/**
 * Only Once Share — Client-Side Encryption Module
 *
 * Cipher:   AES-256-GCM (authenticated encryption)
 * KDF:      HKDF-SHA-256 (derives per-secret key from master key + secret ID)
 * IV:       96-bit random per encryption (NIST recommended)
 * AAD:      Secret ID bound as additional authenticated data
 * Format:   [version 1B] [iv 12B] [ciphertext + GCM tag]
 */

const VERSION = 0x01;
const IV_BYTES = 12;

// --------------- payload type markers ---------------

const PAYLOAD_TEXT = 0x00;
const PAYLOAD_TEXT_IMAGE = 0x01;

export interface ImageAttachment {
  mime: string;
  data: ArrayBuffer | Uint8Array;
}

export interface DecodedPayload {
  text: string;
  image?: { mime: string; data: Uint8Array };
}

// --------------- base64 helpers ---------------

function uint8ToBase64(bytes: Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 0x2000; // 8KB
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(""));
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// --------------- base64url helpers ---------------

function base64urlEncode(bytes: Uint8Array): string {
  return uint8ToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return base64ToUint8(padded);
}

// --------------- payload encoding ---------------

/**
 * Pack text + optional image into a binary payload envelope.
 *
 * Text-only:    [0x00][text UTF-8]
 * Text+Image:   [0x01][text_len u32 BE][text][mime_len u8][mime][image bytes]
 */
export function encodePayload(
  text: string,
  image?: ImageAttachment,
): Uint8Array {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);

  if (!image) {
    // Text-only envelope
    const result = new Uint8Array(1 + textBytes.length);
    result[0] = PAYLOAD_TEXT;
    result.set(textBytes, 1);
    return result;
  }

  // Text+Image envelope
  const mimeBytes = encoder.encode(image.mime);
  if (mimeBytes.length > 255) {
    throw new Error("MIME type too long (max 255 bytes)");
  }

  const imageBytes =
    image.data instanceof Uint8Array
      ? image.data
      : new Uint8Array(image.data);

  // [type 1B][text_len 4B][text][mime_len 1B][mime][image]
  const total =
    1 + 4 + textBytes.length + 1 + mimeBytes.length + imageBytes.length;
  const result = new Uint8Array(total);
  let offset = 0;

  result[offset++] = PAYLOAD_TEXT_IMAGE;

  // text length as u32 big-endian
  const view = new DataView(result.buffer, result.byteOffset, result.byteLength);
  view.setUint32(offset, textBytes.length, false);
  offset += 4;

  result.set(textBytes, offset);
  offset += textBytes.length;

  result[offset++] = mimeBytes.length;

  result.set(mimeBytes, offset);
  offset += mimeBytes.length;

  result.set(imageBytes, offset);

  return result;
}

/**
 * Unpack a binary payload envelope after decryption.
 *
 * First byte 0x00 -> text-only
 * First byte 0x01 -> text+image
 * Anything else   -> legacy raw UTF-8 text (no type byte)
 * Empty payload   -> { text: "" }
 */
export function decodePayload(payload: Uint8Array): DecodedPayload {
  if (payload.length === 0) {
    return { text: "" };
  }

  const decoder = new TextDecoder();
  const type = payload[0];

  if (type === PAYLOAD_TEXT) {
    return { text: decoder.decode(payload.subarray(1)) };
  }

  if (type === PAYLOAD_TEXT_IMAGE) {
    // Minimum: [type 1B][text_len 4B][mime_len 1B] = 6 bytes
    if (payload.length < 6) {
      throw new Error("Truncated text+image payload");
    }

    const view = new DataView(
      payload.buffer,
      payload.byteOffset,
      payload.byteLength,
    );
    let offset = 1;

    const textLen = view.getUint32(offset, false);
    offset += 4;

    if (offset + textLen + 1 > payload.length) {
      throw new Error("Truncated text+image payload");
    }

    const text = decoder.decode(payload.subarray(offset, offset + textLen));
    offset += textLen;

    const mimeLen = payload[offset++];

    if (offset + mimeLen > payload.length) {
      throw new Error("Truncated text+image payload");
    }

    const mime = decoder.decode(payload.subarray(offset, offset + mimeLen));
    offset += mimeLen;

    const data = payload.slice(offset);

    return { text, image: { mime, data } };
  }

  // Legacy: no type byte, entire payload is raw UTF-8 text
  return { text: decoder.decode(payload) };
}

// --------------- key management ---------------

/** Generate a 256-bit master key (stored in URL fragment). */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

/** Export master key to base64url string for the URL fragment. */
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return base64urlEncode(new Uint8Array(raw));
}

/** Import master key from base64url string. */
export async function importKey(base64url: string): Promise<CryptoKey> {
  const raw = base64urlDecode(base64url);
  return crypto.subtle.importKey(
    "raw",
    new Uint8Array(raw) as unknown as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

// --------------- HKDF key derivation ---------------

/**
 * Derive a per-secret AES-256-GCM key from the master key using HKDF-SHA-256.
 * The secret ID is used as the `info` parameter, binding the derived key
 * to this specific secret. An attacker cannot reuse ciphertext across secrets.
 */
async function deriveKey(
  masterKey: CryptoKey,
  secretId: string,
): Promise<CryptoKey> {
  // Export master key raw bytes to use as HKDF input keying material
  const rawKey = await crypto.subtle.exportKey("raw", masterKey);

  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HKDF" },
    false,
    ["deriveKey"],
  );

  const encoder = new TextEncoder();
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: encoder.encode("only-once-share-v1"),
      info: encoder.encode(secretId),
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// --------------- encrypt / decrypt ---------------

/**
 * Encrypt a binary payload with AES-256-GCM.
 * - Derives a unique key via HKDF(masterKey, secretId)
 * - Uses the secret ID as Additional Authenticated Data (AAD)
 * - Output: base64( version || iv || ciphertext+tag )
 */
export async function encrypt(
  payload: Uint8Array,
  masterKey: CryptoKey,
  secretId: string,
): Promise<string> {
  const derivedKey = await deriveKey(masterKey, secretId);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const aad = new TextEncoder().encode(secretId);

  // Copy input before zeroing to avoid wiping the caller's buffer
  const input = new Uint8Array(payload);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    derivedKey,
    input,
  );

  // Wipe plaintext from memory
  input.fill(0);

  // Assemble: [version 1B] [iv 12B] [ciphertext+tag]
  const ctBytes = new Uint8Array(ciphertext);
  const combined = new Uint8Array(1 + IV_BYTES + ctBytes.length);
  combined[0] = VERSION;
  combined.set(iv, 1);
  combined.set(ctBytes, 1 + IV_BYTES);

  return uint8ToBase64(combined);
}

/**
 * Decrypt ciphertext with AES-256-GCM.
 * - Derives the same key via HKDF(masterKey, secretId)
 * - Verifies AAD matches the secret ID (tamper detection)
 * - Returns the raw decrypted bytes (use decodePayload to interpret)
 */
export async function decrypt(
  base64Ciphertext: string,
  masterKey: CryptoKey,
  secretId: string,
): Promise<Uint8Array> {
  const combined = base64ToUint8(base64Ciphertext);

  const version = combined[0];
  if (version !== VERSION) {
    throw new Error("Unsupported encryption version");
  }

  const iv = combined.slice(1, 1 + IV_BYTES);
  const ciphertext = combined.slice(1 + IV_BYTES);
  const aad = new TextEncoder().encode(secretId);

  const derivedKey = await deriveKey(masterKey, secretId);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    derivedKey,
    ciphertext,
  );

  return new Uint8Array(decrypted);
}
