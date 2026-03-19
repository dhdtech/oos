# Image Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to attach images (JPEG, PNG, GIF, WebP up to 10MB) alongside text secrets, encrypted client-side with the same AES-256-GCM pattern.

**Architecture:** A binary envelope format bundles text + image into a single `Uint8Array` before encryption. The server remains untouched except for increasing the payload size limit. The crypto module's `encrypt`/`decrypt` change to work with `Uint8Array` instead of strings, and new `encodePayload`/`decodePayload` functions handle serialization.

**Tech Stack:** React 19, TypeScript, Vitest, Web Crypto API, pure CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-03-19-image-sharing-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `ui/src/lib/crypto.ts` | Chunked base64, payload encode/decode, signature changes |
| Modify | `ui/src/lib/crypto.test.ts` | Tests for new crypto functions + updated signatures |
| Modify | `api/app.py` | Increase `MAX_CIPHERTEXT_SIZE` to 15MB |
| Modify | `api/test_app.py` | Test new payload limit + update existing too-large test |
| Modify | `ui/src/i18n/locales/en.json` | New English i18n keys for image feature |
| Modify | `ui/src/i18n/locales/zh.json` | Chinese translations |
| Modify | `ui/src/i18n/locales/es.json` | Spanish translations |
| Modify | `ui/src/i18n/locales/hi.json` | Hindi translations |
| Modify | `ui/src/i18n/locales/ar.json` | Arabic translations |
| Modify | `ui/src/i18n/locales/pt.json` | Portuguese translations |
| Modify | `ui/src/index.css` | Drop zone, image preview, image modal styles |
| Modify | `ui/src/pages/CreateSecret.tsx` | Drop zone UI, image state, submit with image |
| Modify | `ui/src/pages/CreateSecret.test.tsx` | Tests for drop zone, image validation, submit |
| Modify | `ui/src/pages/ViewSecret.tsx` | Image rendering, modal, blob URLs |
| Modify | `ui/src/pages/ViewSecret.test.tsx` | Tests for image display, modal open/close |

---

### Task 1: Crypto Module — Base64 Refactor & Payload Encoding

**Files:**
- Modify: `ui/src/lib/crypto.ts`
- Modify: `ui/src/lib/crypto.test.ts`

This task refactors the base64 encoding to support large payloads, adds `encodePayload`/`decodePayload`, and changes `encrypt`/`decrypt` signatures from `string` to `Uint8Array`.

**Note on file locations:** Tests are co-located with source files (e.g., `crypto.test.ts` sits next to `crypto.ts` in `ui/src/lib/`). Test utility files live in `ui/src/test/`.

- [ ] **Step 1: Write failing tests for `encodePayload` and `decodePayload`**

Add these tests to `ui/src/test/lib/crypto.test.ts` in a new `describe("payload encoding")` block:

```typescript
import {
  generateKey,
  exportKey,
  importKey,
  encrypt,
  decrypt,
  encodePayload,
  decodePayload,
} from "./crypto";

describe("payload encoding", () => {
  it("encodes and decodes text-only payload", () => {
    const encoded = encodePayload("hello world");
    const decoded = decodePayload(encoded);
    expect(decoded.text).toBe("hello world");
    expect(decoded.image).toBeUndefined();
  });

  it("encodes and decodes text+image payload", () => {
    const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer; // PNG header bytes
    const encoded = encodePayload("caption", {
      mime: "image/png",
      data: imageData,
    });
    const decoded = decodePayload(encoded);
    expect(decoded.text).toBe("caption");
    expect(decoded.image).toBeDefined();
    expect(decoded.image!.mime).toBe("image/png");
    expect(new Uint8Array(decoded.image!.data)).toEqual(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    );
  });

  it("encodes image-only payload (empty text)", () => {
    const imageData = new Uint8Array([0xff, 0xd8]).buffer;
    const encoded = encodePayload("", { mime: "image/jpeg", data: imageData });
    const decoded = decodePayload(encoded);
    expect(decoded.text).toBe("");
    expect(decoded.image!.mime).toBe("image/jpeg");
  });

  it("decodes legacy payload (no type byte) as text", () => {
    // Legacy payloads are raw UTF-8 with no type marker.
    // Any first byte other than 0x00 or 0x01 is treated as legacy.
    const legacy = new TextEncoder().encode("legacy secret");
    const decoded = decodePayload(legacy);
    expect(decoded.text).toBe("legacy secret");
    expect(decoded.image).toBeUndefined();
  });

  it("handles unicode text in payload", () => {
    const encoded = encodePayload("日本語テスト 🎉");
    const decoded = decodePayload(encoded);
    expect(decoded.text).toBe("日本語テスト 🎉");
  });

  it("handles empty text-only payload", () => {
    const encoded = encodePayload("");
    const decoded = decodePayload(encoded);
    expect(decoded.text).toBe("");
    expect(decoded.image).toBeUndefined();
  });

  it("throws on truncated type-0x01 payload", () => {
    // Only the type byte, not enough data for text_len
    const truncated = new Uint8Array([0x01, 0x00]);
    expect(() => decodePayload(truncated)).toThrow();
  });

  it("handles empty payload", () => {
    const decoded = decodePayload(new Uint8Array(0));
    expect(decoded.text).toBe("");
    expect(decoded.image).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd ui && npx vitest run src/lib/crypto.test.ts`
Expected: FAIL — `encodePayload` and `decodePayload` are not exported.

- [ ] **Step 3: Implement `encodePayload` and `decodePayload` in crypto.ts**

Add before the `encrypt` function:

```typescript
// --------------- payload envelope ---------------

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

/**
 * Pack text + optional image into a binary envelope.
 * Text-only: [0x00][text UTF-8]
 * Text+Image: [0x01][text_len u32 BE][text][mime_len u8][mime][image bytes]
 */
export function encodePayload(text: string, image?: ImageAttachment): Uint8Array {
  const textBytes = new TextEncoder().encode(text);

  if (!image) {
    const out = new Uint8Array(1 + textBytes.length);
    out[0] = PAYLOAD_TEXT;
    out.set(textBytes, 1);
    return out;
  }

  const mimeBytes = new TextEncoder().encode(image.mime);
  const imageBytes = image.data instanceof Uint8Array
    ? image.data
    : new Uint8Array(image.data);

  const out = new Uint8Array(
    1 + 4 + textBytes.length + 1 + mimeBytes.length + imageBytes.length
  );
  let offset = 0;

  out[offset++] = PAYLOAD_TEXT_IMAGE;

  // text length (uint32 big-endian)
  new DataView(out.buffer).setUint32(offset, textBytes.length, false);
  offset += 4;

  out.set(textBytes, offset);
  offset += textBytes.length;

  out[offset++] = mimeBytes.length;
  out.set(mimeBytes, offset);
  offset += mimeBytes.length;

  out.set(imageBytes, offset);

  return out;
}

/**
 * Unpack a decrypted payload. Handles:
 * - Type 0x00: text-only envelope
 * - Type 0x01: text+image envelope
 * - Anything else: legacy raw UTF-8 text (no type byte)
 */
export function decodePayload(payload: Uint8Array): DecodedPayload {
  if (payload.length === 0) {
    return { text: "" };
  }

  const type = payload[0];

  if (type === PAYLOAD_TEXT) {
    return { text: new TextDecoder().decode(payload.subarray(1)) };
  }

  if (type === PAYLOAD_TEXT_IMAGE) {
    const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
    let offset = 1;

    const textLen = view.getUint32(offset, false);
    offset += 4;

    const text = new TextDecoder().decode(payload.subarray(offset, offset + textLen));
    offset += textLen;

    const mimeLen = payload[offset++];
    const mime = new TextDecoder().decode(payload.subarray(offset, offset + mimeLen));
    offset += mimeLen;

    const data = payload.slice(offset);

    return { text, image: { mime, data } };
  }

  // Legacy: no type byte, treat entire payload as UTF-8 text
  return { text: new TextDecoder().decode(payload) };
}
```

- [ ] **Step 4: Run payload tests to verify they pass**

Run: `cd ui && npx vitest run src/lib/crypto.test.ts`
Expected: All new payload tests PASS. Existing encrypt/decrypt tests still PASS (we haven't changed signatures yet).

- [ ] **Step 5: Write failing tests for updated encrypt/decrypt signatures**

Update the existing `encrypt` / `decrypt` tests in the same file. The key change: `encrypt` now takes `Uint8Array` and `decrypt` now returns `Uint8Array`:

```typescript
describe("encrypt / decrypt", () => {
  it("round-trips text payload through encrypt/decrypt", async () => {
    const key = await generateKey();
    const secretId = "test-id-001";
    const payload = encodePayload("Hello, World!");
    const ciphertext = await encrypt(payload, key, secretId);
    const decrypted = await decrypt(ciphertext, key, secretId);
    const decoded = decodePayload(decrypted);
    expect(decoded.text).toBe("Hello, World!");
  });

  it("round-trips text+image through encrypt/decrypt", async () => {
    const key = await generateKey();
    const secretId = "test-id-img";
    const imageData = new Uint8Array([1, 2, 3, 4, 5]);
    const payload = encodePayload("with image", {
      mime: "image/png",
      data: imageData.buffer,
    });
    const ciphertext = await encrypt(payload, key, secretId);
    const decrypted = await decrypt(ciphertext, key, secretId);
    const decoded = decodePayload(decrypted);
    expect(decoded.text).toBe("with image");
    expect(new Uint8Array(decoded.image!.data)).toEqual(imageData);
  });

  it("output is valid base64", async () => {
    const key = await generateKey();
    const payload = encodePayload("test");
    const ct = await encrypt(payload, key, "id");
    expect(() => atob(ct)).not.toThrow();
  });

  it("ciphertext starts with version 0x01", async () => {
    const key = await generateKey();
    const payload = encodePayload("test");
    const ct = await encrypt(payload, key, "id");
    const bytes = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));
    expect(bytes[0]).toBe(0x01);
  });

  it("encrypts unicode text", async () => {
    const key = await generateKey();
    const payload = encodePayload("日本語テスト 🎉");
    const ct = await encrypt(payload, key, "id");
    const decrypted = await decrypt(ct, key, "id");
    const decoded = decodePayload(decrypted);
    expect(decoded.text).toBe("日本語テスト 🎉");
  });

  it("encrypts empty payload", async () => {
    const key = await generateKey();
    const payload = encodePayload("");
    const ct = await encrypt(payload, key, "id");
    const decrypted = await decrypt(ct, key, "id");
    const decoded = decodePayload(decrypted);
    expect(decoded.text).toBe("");
  });

  it("different secretIds produce different ciphertext", async () => {
    const key = await generateKey();
    const payload = encodePayload("same text");
    const ct1 = await encrypt(payload, key, "id-a");
    const ct2 = await encrypt(payload, key, "id-b");
    expect(ct1).not.toBe(ct2);
  });

  it("decryption fails with wrong secretId (AAD mismatch)", async () => {
    const key = await generateKey();
    const payload = encodePayload("secret");
    const ct = await encrypt(payload, key, "correct-id");
    await expect(decrypt(ct, key, "wrong-id")).rejects.toThrow();
  });

  it("decryption fails with wrong key", async () => {
    const key1 = await generateKey();
    const key2 = await generateKey();
    const payload = encodePayload("secret");
    const ct = await encrypt(payload, key1, "id");
    await expect(decrypt(ct, key2, "id")).rejects.toThrow();
  });

  it("rejects unsupported version", async () => {
    const fakeBase64 = btoa(
      String.fromCharCode(0xff, ...new Array(13).fill(0))
    );
    const key = await generateKey();
    await expect(decrypt(fakeBase64, key, "id")).rejects.toThrow(
      "Unsupported encryption version"
    );
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `cd ui && npx vitest run src/lib/crypto.test.ts`
Expected: FAIL — `encrypt` still expects `string`, not `Uint8Array`.

- [ ] **Step 7: Update `encrypt` and `decrypt` signatures and refactor base64**

Replace the existing `encrypt` and `decrypt` functions and the base64url helpers in `crypto.ts`:

```typescript
// --------------- base64 helpers (chunked for large payloads) ---------------

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
```

Then update the `encrypt` function:

```typescript
export async function encrypt(
  payload: Uint8Array,
  masterKey: CryptoKey,
  secretId: string,
): Promise<string> {
  const derivedKey = await deriveKey(masterKey, secretId);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const aad = new TextEncoder().encode(secretId);

  // Copy payload so we don't zero the caller's buffer
  const data = new Uint8Array(payload);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    derivedKey,
    data,
  );

  // Wipe plaintext from memory
  data.fill(0);

  // Assemble: [version 1B] [iv 12B] [ciphertext+tag]
  const ctBytes = new Uint8Array(ciphertext);
  const combined = new Uint8Array(1 + IV_BYTES + ctBytes.length);
  combined[0] = VERSION;
  combined.set(iv, 1);
  combined.set(ctBytes, 1 + IV_BYTES);

  return uint8ToBase64(combined);
}
```

And the `decrypt` function:

```typescript
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
```

- [ ] **Step 8: Run all crypto tests to verify they pass**

Run: `cd ui && npx vitest run src/lib/crypto.test.ts`
Expected: ALL PASS.

- [ ] **Step 9: Commit**

```bash
git add ui/src/lib/crypto.ts ui/src/lib/crypto.test.ts
git commit -m "feat(crypto): add payload encoding and refactor for binary data support"
```

---

### Task 2: API — Increase Payload Size Limit

**Files:**
- Modify: `api/app.py:28,83`
- Modify: `api/test_app.py`

- [ ] **Step 1: Write failing test for larger payload and update existing test**

Add new tests to `api/test_app.py` in the `TestCreateSecret` class:

```python
def test_accepts_large_payload_up_to_15mb(self, client):
    """Payloads up to 15MB should be accepted (for image secrets)."""
    # Create a valid base64 ciphertext of ~1.3MB (keep reasonable for test speed)
    large_data = base64.b64encode(b"x" * (1024 * 1024)).decode()
    resp = client.post("/api/secrets", json={
        "ciphertext": large_data,
        "ttl_hours": 1,
        "id": str(uuid.uuid4()),
    })
    assert resp.status_code == 201

def test_rejects_payload_over_15mb(self, client):
    """Payloads over 15MB should be rejected."""
    huge_data = "A" * (15 * 1024 * 1024 + 1)
    resp = client.post("/api/secrets", json={
        "ciphertext": huge_data,
        "ttl_hours": 1,
        "id": str(uuid.uuid4()),
    })
    assert resp.status_code == 413
    assert "15MB" in resp.get_json()["error"]
```

**Also update the existing `test_create_secret_too_large` test** — currently it uses `100 * 1024 + 1` bytes which will no longer exceed the limit. Change the boundary value to `15 * 1024 * 1024 + 1`:

```python
def test_create_secret_too_large(self, client):
    big = "A" * (15 * 1024 * 1024 + 1)
    resp = client.post("/api/secrets", json={"ciphertext": big})
    assert resp.status_code == 413
    assert "too large" in resp.get_json()["error"].lower()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd api && pytest test_app.py -v -k "large_payload or over_15mb"`
Expected: FAIL — the 15MB payload is rejected by the current 100KB limit.

- [ ] **Step 3: Update `MAX_CIPHERTEXT_SIZE` and error message**

In `api/app.py`, change line 28:

```python
MAX_CIPHERTEXT_SIZE = 15 * 1024 * 1024  # 15MB (supports 10MB images after base64 expansion)
```

And change line 83:

```python
return jsonify({"error": "Payload too large (max 15MB)"}), 413
```

- [ ] **Step 4: Run all API tests**

Run: `cd api && pytest test_app.py -v --cov=app --cov-report=term-missing --cov-fail-under=99`
Expected: ALL PASS with 99%+ coverage.

- [ ] **Step 5: Commit**

```bash
git add api/app.py api/test_app.py
git commit -m "feat(api): increase max payload to 15MB for image support"
```

---

### Task 3: i18n — Add Image Feature Translation Keys

**Files:**
- Modify: `ui/src/i18n/locales/en.json`
- Modify: `ui/src/i18n/locales/zh.json`
- Modify: `ui/src/i18n/locales/es.json`
- Modify: `ui/src/i18n/locales/hi.json`
- Modify: `ui/src/i18n/locales/ar.json`
- Modify: `ui/src/i18n/locales/pt.json`

- [ ] **Step 1: Add English keys to `en.json`**

Add these keys inside the `"create"` section:

```json
"dropzone.label": "Drag & drop an image here",
"dropzone.hint": "or click to browse",
"dropzone.sizeLimit": "Max 10 MB · JPEG, PNG, GIF, WebP",
"dropzone.dragActive": "Drop your image here",
"image.invalidType": "Only images are allowed (JPEG, PNG, GIF, WebP)",
"image.tooLarge": "Image must be under 10 MB",
"image.remove": "Remove image",
"image.preview": "Image preview"
```

Add these keys inside the `"view"` section:

```json
"clickToEnlarge": "Click image to enlarge",
"imageModal.close": "Close image"
```

- [ ] **Step 2: Add translations for the other 5 languages**

Add equivalent keys to `zh.json`, `es.json`, `hi.json`, `ar.json`, `pt.json`. Use accurate translations appropriate for each locale. Follow the same key structure.

- [ ] **Step 3: Commit**

```bash
git add ui/src/i18n/locales/*.json
git commit -m "feat(i18n): add image sharing translation keys for all 6 languages"
```

---

### Task 4: CreateSecret — Image Drop Zone UI

**Files:**
- Modify: `ui/src/pages/CreateSecret.tsx`
- Modify: `ui/src/index.css`
- Modify: `ui/src/pages/CreateSecret.test.tsx`

**Important context:**
- The crypto mock in `CreateSecret.test.tsx` currently mocks `encrypt` to return a string. After Task 1, `encrypt` accepts `Uint8Array`. Update mocks to match.
- Also mock `encodePayload` since the component now calls it.
- The `textarea` must no longer have `required` attribute — the form is valid if either text or image is present.

- [ ] **Step 1: Write failing tests for drop zone rendering and interaction**

Update the mock block at the top of `CreateSecret.test.tsx`:

```typescript
vi.mock("../lib/crypto", () => ({
  generateKey: vi.fn().mockResolvedValue("mock-key"),
  exportKey: vi.fn().mockResolvedValue("mock-key-string"),
  encrypt: vi.fn().mockResolvedValue("encrypted-base64"),
  encodePayload: vi.fn().mockReturnValue(new Uint8Array([0])),
}));
```

Add new tests:

```typescript
describe("image drop zone", () => {
  it("renders drop zone with label text", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText(/drag & drop an image here/i)).toBeInTheDocument();
  });

  it("renders hidden file input accepting only images", () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.accept).toBe("image/jpeg,image/png,image/gif,image/webp");
    expect(input.style.display).toBe("none");
  });

  it("shows error for non-image file", async () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["text"], "doc.pdf", { type: "application/pdf" });
    await userEvent.upload(input, file);
    expect(screen.getByText(/only images are allowed/i)).toBeInTheDocument();
  });

  it("shows error for file over 10MB", async () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });
    await userEvent.upload(input, largeFile);
    expect(screen.getByText(/under 10 MB/i)).toBeInTheDocument();
  });

  it("shows image preview after valid file selection", async () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake-image-data"], "photo.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(screen.getByAltText(/image preview/i)).toBeInTheDocument();
    });
    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  it("removes image when remove button is clicked", async () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake-image-data"], "photo.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(screen.getByAltText(/image preview/i)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByLabelText(/remove image/i));
    expect(screen.queryByAltText(/image preview/i)).not.toBeInTheDocument();
    expect(screen.getByText(/drag & drop an image here/i)).toBeInTheDocument();
  });

  it("submits with image only (no text)", async () => {
    renderWithProviders(<CreateSecret />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake-image-data"], "photo.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(screen.getByAltText(/image preview/i)).toBeInTheDocument();
    });
    // Submit button should be enabled even without text
    const submitBtn = screen.getByRole("button", { name: /create secret link/i });
    expect(submitBtn).not.toBeDisabled();
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText(/secret link created/i)).toBeInTheDocument();
    });
  });

  it("submits with both text and image", async () => {
    renderWithProviders(<CreateSecret />);
    const textarea = screen.getByPlaceholderText(/paste your password/i);
    await userEvent.type(textarea, "secret message");

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["fake-image-data"], "photo.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(screen.getByAltText(/image preview/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /create secret link/i }));
    await waitFor(() => {
      expect(screen.getByText(/secret link created/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd ui && npx vitest run src/pages/CreateSecret.test.tsx`
Expected: FAIL — drop zone elements don't exist yet.

- [ ] **Step 3: Add drop zone CSS to `index.css`**

Add before the `/* ─── Reduced motion ─── */` section:

```css
/* ─── Image Drop Zone ─── */
.dropzone {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: transparent;
}

.dropzone:hover {
  border-color: var(--border-hover);
  background: var(--surface-hover);
}

.dropzone--active {
  border-color: var(--primary);
  background: var(--primary-glow);
}

.dropzone--has-file {
  border-style: solid;
  border-color: var(--border);
  padding: 1rem;
  cursor: default;
}

.dropzone-icon {
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.dropzone--active .dropzone-icon {
  color: var(--primary);
}

.dropzone-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.dropzone--active .dropzone-label {
  color: var(--primary);
}

.dropzone-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.125rem;
}

.dropzone-size-limit {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.375rem;
}

.dropzone-error {
  font-size: 0.8125rem;
  color: #fca5a5;
  margin-top: 0.5rem;
}

/* Image Preview */
.image-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.image-preview-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.image-preview-info {
  flex: 1;
  min-width: 0;
}

.image-preview-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-preview-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.image-preview-remove {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition);
}

.image-preview-remove:hover {
  background: var(--error-glow);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--error);
}
```

- [ ] **Step 4: Implement drop zone in `CreateSecret.tsx`**

Add imports at top:

```typescript
import { Image, X } from "lucide-react";
import { generateKey, exportKey, encrypt, encodePayload } from "../lib/crypto";
```

Add state variables inside the component:

```typescript
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>("");
const [imageError, setImageError] = useState("");
const [dragActive, setDragActive] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
```

Add `useRef` to the React import.

Add image handling functions:

```typescript
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

function handleFile(file: File) {
  setImageError("");
  if (!ACCEPTED_TYPES.includes(file.type)) {
    setImageError(t("create.image.invalidType"));
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    setImageError(t("create.image.tooLarge"));
    return;
  }
  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  setDragActive(false);
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
}

function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
  setDragActive(true);
}

function handleDragLeave(e: React.DragEvent) {
  e.preventDefault();
  setDragActive(false);
}

function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (file) handleFile(file);
  e.target.value = "";
}

function removeImage() {
  if (imagePreview) URL.revokeObjectURL(imagePreview);
  setImageFile(null);
  setImagePreview("");
  setImageError("");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

Update `handleSubmit` — read image as `ArrayBuffer`, call `encodePayload`, then `encrypt`:

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!secret.trim() && !imageFile) return;

  setLoading(true);
  setError("");
  setLink("");

  try {
    let imageAttachment: { mime: string; data: ArrayBuffer } | undefined;
    if (imageFile) {
      imageAttachment = {
        mime: imageFile.type,
        data: await imageFile.arrayBuffer(),
      };
    }

    const id = crypto.randomUUID();
    const key = await generateKey();
    const payload = encodePayload(secret, imageAttachment);
    const ciphertext = await encrypt(payload, key, id);
    const result = await createSecret(ciphertext, ttlHours, id);
    const keyStr = await exportKey(key);
    const pathId = result.alias ?? result.id;
    setLink(`${window.location.origin}/s/${pathId}?lng=${i18n.language}#${keyStr}`);
    posthog.capture("secret_created", { ttl_hours: ttlHours, has_image: !!imageFile });
    setSecret("");
    removeImage();
  } catch (err) {
    posthog.capture("secret_create_failed");
    setError(err instanceof Error ? err.message : "Something went wrong");
  } finally {
    setLoading(false);
  }
}
```

Update the submit button `disabled` check:

```tsx
disabled={loading || (!secret.trim() && !imageFile)}
```

Remove the `required` attribute from the `<textarea>`.

Add the drop zone JSX after the `</div>` closing the `form-group` div and before the `ttl-group` div:

```tsx
<div
  className={`dropzone ${dragActive ? "dropzone--active" : ""} ${imageFile ? "dropzone--has-file" : ""}`}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onClick={() => !imageFile && fileInputRef.current?.click()}
>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/jpeg,image/png,image/gif,image/webp"
    onChange={handleFileInput}
    style={{ display: "none" }}
  />

  {imageFile && imagePreview ? (
    <div className="image-preview">
      <img
        src={imagePreview}
        alt={t("create.image.preview")}
        className="image-preview-thumb"
      />
      <div className="image-preview-info">
        <div className="image-preview-name">{imageFile.name}</div>
        <div className="image-preview-size">{formatFileSize(imageFile.size)}</div>
      </div>
      <button
        type="button"
        className="image-preview-remove"
        onClick={(e) => { e.stopPropagation(); removeImage(); }}
        aria-label={t("create.image.remove")}
      >
        <X size={14} />
      </button>
    </div>
  ) : (
    <>
      <div className="dropzone-icon">
        <Image size={24} />
      </div>
      <div className="dropzone-label">
        {dragActive ? t("create.dropzone.dragActive") : t("create.dropzone.label")}
      </div>
      {!dragActive && (
        <>
          <div className="dropzone-hint">{t("create.dropzone.hint")}</div>
          <div className="dropzone-size-limit">{t("create.dropzone.sizeLimit")}</div>
        </>
      )}
    </>
  )}

  {imageError && <div className="dropzone-error">{imageError}</div>}
</div>
```

- [ ] **Step 5: Update existing CreateSecret tests for new crypto mocks**

The existing tests that mock `encrypt` need to also mock `encodePayload`. Update the import and mock block. Also update the "submit disabled when textarea empty" test: rename it to "submit is disabled when neither text nor image is present" and verify the button is disabled in the default state (no text, no image). The existing submit flow tests that fill text should continue to work since `encodePayload` is mocked.

- [ ] **Step 6: Run all CreateSecret tests**

Run: `cd ui && npx vitest run src/pages/CreateSecret.test.tsx`
Expected: ALL PASS.

- [ ] **Step 7: Commit**

```bash
git add ui/src/pages/CreateSecret.tsx ui/src/index.css ui/src/pages/CreateSecret.test.tsx
git commit -m "feat(ui): add image drop zone to CreateSecret page"
```

---

### Task 5: ViewSecret — Image Rendering & Modal

**Files:**
- Modify: `ui/src/pages/ViewSecret.tsx`
- Modify: `ui/src/index.css`
- Modify: `ui/src/pages/ViewSecret.test.tsx`

**Important context:**
- `decrypt` now returns `Uint8Array`. The component must call `decodePayload` on the result.
- State changes: `plaintext` (string) stays for text; add `imageUrl` (string) and `imageMime` (string) for the image blob URL.
- Add `showImageModal` (boolean) state for the lightbox.

- [ ] **Step 1: Write failing tests for image rendering and modal**

Update the mock block at the top of `ViewSecret.test.tsx`:

```typescript
import * as cryptoLib from "../lib/crypto";

vi.mock("../lib/crypto", () => ({
  importKey: vi.fn().mockResolvedValue("mock-key"),
  decrypt: vi.fn().mockResolvedValue(new Uint8Array([0])),
  decodePayload: vi.fn().mockReturnValue({ text: "decrypted secret" }),
}));
```

**Important:** Since `vi.clearAllMocks()` runs in `beforeEach` (from setup.ts), the default mock implementations are cleared between tests. Add this to the `beforeEach` block so existing text-only tests keep working:

```typescript
beforeEach(() => {
  vi.mocked(cryptoLib.decodePayload).mockReturnValue({ text: "decrypted secret" });
});
```

Add new tests:

```typescript
describe("image display", () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("renders image when payload contains an image", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "",
      image: { mime: "image/png", data: new Uint8Array([1, 2, 3]) },
    });

    renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
    expect(screen.getByText(/click image to enlarge/i)).toBeInTheDocument();
  });

  it("renders both text and image", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "secret text",
      image: { mime: "image/jpeg", data: new Uint8Array([1]) },
    });

    renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByText("secret text")).toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  it("opens modal when image is clicked", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "",
      image: { mime: "image/png", data: new Uint8Array([1]) },
    });

    renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("img"));
    expect(screen.getByLabelText(/close image/i)).toBeInTheDocument();
  });

  it("closes modal when X button is clicked", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "",
      image: { mime: "image/png", data: new Uint8Array([1]) },
    });

    renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("img"));
    await userEvent.click(screen.getByLabelText(/close image/i));
    expect(screen.queryByLabelText(/close image/i)).not.toBeInTheDocument();
  });

  it("closes modal when overlay is clicked", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "",
      image: { mime: "image/png", data: new Uint8Array([1]) },
    });

    renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("img"));
    // Click the overlay (modal-overlay element)
    const overlay = document.querySelector(".image-modal-overlay") as HTMLElement;
    await userEvent.click(overlay);
    expect(screen.queryByLabelText(/close image/i)).not.toBeInTheDocument();
  });

  it("revokes blob URL on unmount", async () => {
    const { decodePayload } = await import("../lib/crypto");
    vi.mocked(decodePayload).mockReturnValue({
      text: "",
      image: { mime: "image/png", data: new Uint8Array([1]) },
    });

    const { unmount } = renderWithProviders(<ViewSecret />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd ui && npx vitest run src/pages/ViewSecret.test.tsx`
Expected: FAIL — image elements don't exist yet.

- [ ] **Step 3: Add image modal CSS to `index.css`**

Add before the `/* ─── Reduced motion ─── */` section:

```css
/* ─── Secret Image ─── */
.secret-image-container {
  margin-top: 0.75rem;
}

.secret-image-thumb {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: opacity var(--transition);
}

.secret-image-thumb:hover {
  opacity: 0.85;
}

.secret-image-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.375rem;
  text-align: center;
}

/* Image Modal (Lightbox) */
.image-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeInOverlay 0.15s ease;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 80vh;
}

.image-modal-content img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius);
}

.image-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.image-modal-close:hover {
  background: rgba(255, 255, 255, 0.15);
}
```

- [ ] **Step 4: Implement image rendering and modal in `ViewSecret.tsx`**

Update imports:

```typescript
import { importKey, decrypt, decodePayload } from "../lib/crypto";
import { X } from "lucide-react";
```

Add state:

```typescript
const [imageUrl, setImageUrl] = useState("");
const [showImageModal, setShowImageModal] = useState(false);
```

Update the `fetchAndDecrypt` function — call `decodePayload` on the decrypted `Uint8Array`:

```typescript
const decryptedBytes = await decrypt(result.ciphertext, key, result.id);
const decoded = decodePayload(decryptedBytes);
setPlaintext(decoded.text);
if (decoded.image) {
  const blob = new Blob([decoded.image.data], { type: decoded.image.mime });
  setImageUrl(URL.createObjectURL(blob));
}
```

Add cleanup `useEffect`:

```typescript
useEffect(() => {
  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };
}, [imageUrl]);
```

Update the "revealed" JSX — render text block only if text is non-empty, render image below if present:

```tsx
{status === "revealed" && (
  <div className="card">
    <div className="revealed-card">
      <div className="destroyed-banner">
        <ShieldOff size={15} />
        <span>{t("view.destroyed")}</span>
      </div>

      {plaintext && (
        <>
          <div className="secret-content">{plaintext}</div>
          <button
            className={`btn btn-sm btn-full ${copied ? "btn-success" : "btn-secondary"}`}
            onClick={handleCopy}
            aria-label={t("view.copySecret")}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? t("view.copiedClipboard") : t("view.copySecret")}
          </button>
        </>
      )}

      {imageUrl && (
        <div className="secret-image-container">
          <img
            src={imageUrl}
            alt={t("view.clickToEnlarge")}
            className="secret-image-thumb"
            onClick={() => setShowImageModal(true)}
          />
          <div className="secret-image-hint">{t("view.clickToEnlarge")}</div>
        </div>
      )}
    </div>
  </div>
)}

{showImageModal && imageUrl && (
  <div
    className="image-modal-overlay"
    onClick={() => setShowImageModal(false)}
  >
    <div
      className="image-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="image-modal-close"
        onClick={() => setShowImageModal(false)}
        aria-label={t("view.imageModal.close")}
      >
        <X size={16} />
      </button>
      <img src={imageUrl} alt={t("view.clickToEnlarge")} />
    </div>
  </div>
)}
```

- [ ] **Step 5: Update existing ViewSecret tests for new crypto mocks**

The existing tests that mock `decrypt` returning a string need to be updated. Mock `decrypt` to return `Uint8Array` and `decodePayload` to return `{ text: "decrypted secret" }`. The test for "missing hash" and "missing id" should still work since the error paths don't reach `decodePayload`.

- [ ] **Step 6: Run all ViewSecret tests**

Run: `cd ui && npx vitest run src/pages/ViewSecret.test.tsx`
Expected: ALL PASS.

- [ ] **Step 7: Commit**

```bash
git add ui/src/pages/ViewSecret.tsx ui/src/index.css ui/src/pages/ViewSecret.test.tsx
git commit -m "feat(ui): add image rendering and lightbox modal to ViewSecret"
```

---

### Task 6: Full Test Suite Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full UI test suite with coverage**

Run: `cd ui && npx vitest run --coverage --coverage.thresholds.lines=99`
Expected: ALL PASS with 99%+ line coverage.

- [ ] **Step 2: Run full API test suite with coverage**

Run: `cd api && pytest test_app.py -v --cov=app --cov-report=term-missing --cov-fail-under=99`
Expected: ALL PASS with 99%+ coverage.

- [ ] **Step 3: Run full stack via Docker**

Run: `make test-all`
Expected: ALL PASS.

- [ ] **Step 4: Manual smoke test**

Run: `make up`
Then in the browser at `http://localhost:8080`:
1. Create a text-only secret — verify existing flow works
2. Create an image-only secret (drag a JPEG) — verify link generated
3. Open the link — verify image displays in card
4. Click image — verify modal opens at 80vh
5. Close modal via X and via clicking outside
6. Create a text+image secret — verify both render on the view page
7. Try dragging a PDF — verify error message
8. Try dragging a 15MB image — verify error message

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during full test verification"
```
