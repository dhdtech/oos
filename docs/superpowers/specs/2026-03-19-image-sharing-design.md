# Image Sharing Feature — Design Spec

**Date:** 2026-03-19
**Status:** Approved

## Summary

Add image sharing to Only Once Share. Users can attach an image (drag-and-drop or click-to-browse) alongside their text secret. Images are encrypted client-side with the same AES-256-GCM pattern and shared one-time. The server remains zero-knowledge — it cannot distinguish text secrets from image secrets.

## Decisions

| Decision | Choice |
|----------|--------|
| Content model | Text and image together in one secret |
| Max image size | 10 MB |
| Drop zone placement | Always visible below text area |
| Payload architecture | Binary envelope (Approach A) |
| Allowed image types | JPEG, PNG, GIF, WebP (no SVG) |
| Image viewing | Thumbnail in card; click opens 80vh modal |
| Download button | None — view only |

## Binary Envelope Format

The plaintext payload before encryption uses this binary format:

```
Text-only (type 0x00):
[0x00][text UTF-8 bytes]

Text+Image (type 0x01):
[0x01][text_len uint32 BE][text UTF-8 bytes][mime_len uint8][mime ASCII][image raw bytes]
```

- Type `0x00`: everything after is UTF-8 text. Existing secrets without a type byte are treated as legacy text (backwards compatible).
- Type `0x01`: structured envelope with text + image.
- Text can be empty (length 0) if user only attaches an image.
- Image is absent when user only types text (use type `0x00`).
- Accepted MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`. No SVG (XSS risk).

The outer ciphertext format is unchanged: `[version 1B][iv 12B][ciphertext+tag]` → base64.

## Crypto Module Changes (`ui/src/lib/crypto.ts`)

### Critical: Base64 Encoding Refactor

The existing `encrypt` function uses `btoa(String.fromCharCode(...combined))` which spreads the entire `Uint8Array` onto the call stack. This throws `RangeError` for arrays larger than ~125K elements — incompatible with 10MB+ payloads. Similarly, `decrypt` uses `atob()` which has browser-specific size limits.

**Required refactor:** Replace the spread-based base64 with a chunked approach:

```typescript
// Encode: process in 8KB chunks
function uint8ToBase64(bytes: Uint8Array): string {
  const chunks: string[] = [];
  const chunkSize = 0x2000; // 8KB
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(''));
}

// Decode: use Uint8Array.from on smaller decoded string
function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
```

These replace the existing inline `btoa`/spread pattern in `encrypt` (which throws `RangeError` on large arrays) and the `atob` pattern in `decrypt` (for consistency, though `decrypt`'s existing `Uint8Array.from(atob(...), callback)` pattern does not have the same stack limit issue).

### New Functions

- **`encodePayload(text: string, image?: { mime: string; data: ArrayBuffer }): Uint8Array`** — packs text + optional image into binary envelope.
- **`decodePayload(payload: Uint8Array): { text: string; image?: { mime: string; data: Uint8Array } }`** — unpacks after decryption. Handles legacy payloads (no type byte) as plain UTF-8 text.

### Legacy Payload Detection

`decodePayload` checks the first byte: `0x00` → text-only envelope, `0x01` → text+image envelope, anything else → legacy raw UTF-8 text. Since legitimate user-entered text encoded as UTF-8 will not start with `0x00` or `0x01` (C0 control characters), this heuristic is safe for all practical user-entered text. Edge case: a legacy secret starting with a literal NUL or SOH byte would be silently misinterpreted as an envelope — this is accepted as vanishingly unlikely for real-world usage.

### Signature Changes

- `encrypt` changes from accepting `plaintext: string` to accepting `payload: Uint8Array` (the pre-packed envelope). The internal `TextEncoder.encode` call is removed. The function should copy the input before zeroing to avoid wiping the caller's buffer.
- `decrypt` changes to return `Uint8Array` instead of `string`. Callers run the result through `decodePayload`.

The ciphertext wire format is untouched. Existing stored secrets decrypt fine — `decodePayload` handles the legacy case.

### Existing Test Mock Updates

Existing test mocks in `CreateSecret.test.tsx` and `ViewSecret.test.tsx` that mock `encrypt` to return a string and `decrypt` to return a string must be updated to match the new signatures (`Uint8Array` in/out). Tests must also mock `encodePayload`/`decodePayload` as needed.

## API Changes (`api/app.py`)

Minimal:

- Increase `MAX_CIPHERTEXT_SIZE` constant from `100 * 1024` (100KB) to `15 * 1024 * 1024` (15MB). This covers: 10MB raw image × 1.33 base64 expansion = ~13.3MB + text + JSON overhead.
- Update the hardcoded error message `"Payload too large (max 100KB)"` to reflect the new limit.
- No Gunicorn config changes needed — the Python-level `MAX_CIPHERTEXT_SIZE` check is sufficient and Gunicorn's default `--limit-request-body` is unlimited.
- Nginx does NOT proxy API requests (UI and API are separate services), so `client_max_body_size` is irrelevant. Render hosting platform has a 100MB limit, so 15MB is well within bounds.

No schema changes, no new fields, no new endpoints.

## CreateSecret UI Changes (`ui/src/pages/CreateSecret.tsx`)

Drop zone always visible below the textarea:

- **Appearance:** Dashed indigo border, image icon, "Drag & drop an image here", "or click to browse", "max 10 MB" hint.
- **Hidden file input:** Triggered on click. Accepts `image/jpeg,image/png,image/gif,image/webp`.
- **Drag states:** Border/background highlight on `dragenter`/`dragover`. Reset on `dragleave`/`drop`.
- **Validation:** Reject non-image files and files >10MB with inline error message.
- **Preview:** Valid image replaces drop zone content with thumbnail + filename + file size + remove (X) button. Dashed border becomes solid.
- **Remove:** X button clears image and restores empty drop zone.
- **Submit flow:** Read image as `ArrayBuffer` via `FileReader`. Call `encodePayload(text, { mime, data })`. Encrypt the envelope. At least one of text or image must be present.
- **Styling:** Pure CSS custom properties matching existing dark theme.

## ViewSecret UI Changes (`ui/src/pages/ViewSecret.tsx`)

After decryption, `decodePayload` returns `{ text, image? }`:

- **Text only:** Same as today — monospace text block with copy button.
- **Image only:** Thumbnail in card. Click opens fullscreen modal.
- **Text + image:** Text block with copy button first, image thumbnail below. Same modal on click.
- **Image modal:** Reuses existing `.modal-overlay` + `.modal` CSS pattern. Image: `max-height: 80vh`, `max-width: 90vw`, `object-fit: contain`. Close via X button or clicking outside. No download button.
- **Memory cleanup:** `URL.revokeObjectURL` on component unmount.
- **Legacy secrets:** No type byte → plain text. Fully backwards compatible.

## i18n

New keys across all 6 languages (`en`, `zh`, `es`, `hi`, `ar`, `pt`):

- Drop zone: label, hint, size limit
- Errors: invalid file type, file too large
- Preview: remove button label
- View: click to enlarge hint
- Modal: close button aria-label

## Testing (99% coverage required)

**`crypto.ts` tests:**
- `encodePayload`/`decodePayload` roundtrips: text-only, image-only, text+image, legacy no-type-byte
- Invalid type byte, truncated data

**`CreateSecret` tests:**
- Drop zone renders
- Drag events: enter, over, leave, drop
- File type rejection, file size rejection
- Preview display, remove image
- Submit with text+image, image-only, text-only

**`ViewSecret` tests:**
- Render text-only, image-only (blob URL), text+image
- Image click opens modal
- Modal close via X, close via overlay click
- Legacy secret compatibility

**`app.py` tests:**
- Payload up to 15MB accepted
- Payload over 15MB rejected

## No New Dependencies

Everything uses built-in browser APIs: `FileReader`, `URL.createObjectURL`, drag/drop events, `DataTransfer`, `Web Crypto API`.
