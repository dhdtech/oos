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

// --------------- base64url helpers ---------------

function base64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
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
    raw.buffer as ArrayBuffer,
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
 * Encrypt plaintext with AES-256-GCM.
 * - Derives a unique key via HKDF(masterKey, secretId)
 * - Uses the secret ID as Additional Authenticated Data (AAD)
 * - Output: base64( version || iv || ciphertext+tag )
 */
export async function encrypt(
  plaintext: string,
  masterKey: CryptoKey,
  secretId: string,
): Promise<string> {
  const derivedKey = await deriveKey(masterKey, secretId);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const aad = new TextEncoder().encode(secretId);
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    derivedKey,
    encoded,
  );

  // Wipe plaintext from memory
  encoded.fill(0);

  // Assemble: [version 1B] [iv 12B] [ciphertext+tag]
  const ctBytes = new Uint8Array(ciphertext);
  const combined = new Uint8Array(1 + IV_BYTES + ctBytes.length);
  combined[0] = VERSION;
  combined.set(iv, 1);
  combined.set(ctBytes, 1 + IV_BYTES);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt ciphertext with AES-256-GCM.
 * - Derives the same key via HKDF(masterKey, secretId)
 * - Verifies AAD matches the secret ID (tamper detection)
 */
export async function decrypt(
  base64Ciphertext: string,
  masterKey: CryptoKey,
  secretId: string,
): Promise<string> {
  const combined = Uint8Array.from(atob(base64Ciphertext), (c) =>
    c.charCodeAt(0),
  );

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

  return new TextDecoder().decode(decrypted);
}
