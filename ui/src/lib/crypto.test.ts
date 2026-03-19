import { describe, it, expect } from "vitest";
import {
  generateKey,
  exportKey,
  importKey,
  encrypt,
  decrypt,
  encodePayload,
  decodePayload,
} from "./crypto";
import type { ImageAttachment } from "./crypto";

describe("crypto", () => {
  describe("generateKey / exportKey / importKey", () => {
    it("generates a 256-bit key", async () => {
      const key = await generateKey();
      const raw = await crypto.subtle.exportKey("raw", key);
      expect(raw.byteLength).toBe(32); // 256 bits
    });

    it("exports and imports key round-trip", async () => {
      const key = await generateKey();
      const exported = await exportKey(key);
      expect(typeof exported).toBe("string");
      expect(exported.length).toBeGreaterThan(0);

      const imported = await importKey(exported);
      const raw1 = new Uint8Array(await crypto.subtle.exportKey("raw", key));
      const raw2 = new Uint8Array(
        await crypto.subtle.exportKey("raw", imported),
      );
      expect(raw2).toEqual(raw1);
    });

    it("export produces base64url (no +, /, =)", async () => {
      const key = await generateKey();
      const exported = await exportKey(key);
      expect(exported).not.toMatch(/[+/=]/);
    });
  });

  describe("payload encoding", () => {
    it("text-only encode/decode roundtrip", () => {
      const payload = encodePayload("Hello, World!");
      const decoded = decodePayload(payload);
      expect(decoded.text).toBe("Hello, World!");
      expect(decoded.image).toBeUndefined();
    });

    it("text+image encode/decode roundtrip", () => {
      const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
      const image: ImageAttachment = {
        mime: "image/png",
        data: imageData,
      };
      const payload = encodePayload("Caption text", image);
      const decoded = decodePayload(payload);

      expect(decoded.text).toBe("Caption text");
      expect(decoded.image).toBeDefined();
      expect(decoded.image!.mime).toBe("image/png");
      expect(decoded.image!.data).toEqual(imageData);
    });

    it("image-only (empty text) encode/decode", () => {
      const imageData = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
      const image: ImageAttachment = {
        mime: "image/jpeg",
        data: imageData,
      };
      const payload = encodePayload("", image);
      const decoded = decodePayload(payload);

      expect(decoded.text).toBe("");
      expect(decoded.image).toBeDefined();
      expect(decoded.image!.mime).toBe("image/jpeg");
      expect(decoded.image!.data).toEqual(imageData);
    });

    it("accepts ArrayBuffer for image data", () => {
      const buffer = new ArrayBuffer(4);
      new Uint8Array(buffer).set([1, 2, 3, 4]);
      const image: ImageAttachment = {
        mime: "image/png",
        data: buffer,
      };
      const payload = encodePayload("test", image);
      const decoded = decodePayload(payload);
      expect(decoded.image!.data).toEqual(new Uint8Array([1, 2, 3, 4]));
    });

    it("legacy payload (no type byte) decodes as text", () => {
      // Simulate a legacy payload: raw UTF-8 text with no type prefix.
      // ASCII letters have byte values >= 0x41, which are neither 0x00 nor 0x01.
      const encoder = new TextEncoder();
      const legacyBytes = encoder.encode("legacy secret");
      const decoded = decodePayload(legacyBytes);
      expect(decoded.text).toBe("legacy secret");
      expect(decoded.image).toBeUndefined();
    });

    it("unicode text in payload", () => {
      const payload = encodePayload("日本語テスト 🎉");
      const decoded = decodePayload(payload);
      expect(decoded.text).toBe("日本語テスト 🎉");
    });

    it("empty text-only payload", () => {
      const payload = encodePayload("");
      expect(payload[0]).toBe(0x00);
      const decoded = decodePayload(payload);
      expect(decoded.text).toBe("");
      expect(decoded.image).toBeUndefined();
    });

    it("truncated type-0x01 payload throws", () => {
      // Only the type byte and partial header
      const truncated = new Uint8Array([0x01, 0x00, 0x00]);
      expect(() => decodePayload(truncated)).toThrow(
        "Truncated text+image payload",
      );
    });

    it("truncated type-0x01 payload throws when text_len exceeds bounds", () => {
      // type=0x01, text_len=999 (way too big), mime_len placeholder
      const truncated = new Uint8Array([0x01, 0x00, 0x00, 0x03, 0xe7, 0x00]);
      expect(() => decodePayload(truncated)).toThrow(
        "Truncated text+image payload",
      );
    });

    it("empty payload returns { text: '' }", () => {
      const decoded = decodePayload(new Uint8Array(0));
      expect(decoded.text).toBe("");
      expect(decoded.image).toBeUndefined();
    });

    it("text-only payload has correct binary structure", () => {
      const payload = encodePayload("abc");
      expect(payload[0]).toBe(0x00);
      // "abc" is 3 bytes
      expect(payload.length).toBe(1 + 3);
    });

    it("text+image payload has correct binary structure", () => {
      const imageData = new Uint8Array([10, 20, 30]);
      const payload = encodePayload("hi", {
        mime: "image/png",
        data: imageData,
      });
      expect(payload[0]).toBe(0x01);
      // [type 1][textLen 4][text 2][mimeLen 1][mime 9][image 3] = 20
      expect(payload.length).toBe(1 + 4 + 2 + 1 + 9 + 3);
    });

    it("throws when MIME type exceeds 255 bytes", () => {
      const longMime = "image/" + "x".repeat(260);
      expect(() =>
        encodePayload("test", {
          mime: longMime,
          data: new Uint8Array([1]),
        }),
      ).toThrow("MIME type too long (max 255 bytes)");
    });

    it("truncated type-0x01 payload throws when mime_len exceeds bounds", () => {
      // Build a payload where text is present but mime_len points beyond the buffer
      // [type=0x01][text_len=0 (4 bytes)][mime_len=255][no mime data]
      const truncated = new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x00, 0xff]);
      expect(() => decodePayload(truncated)).toThrow(
        "Truncated text+image payload",
      );
    });
  });

  describe("encrypt / decrypt", () => {
    it("round-trips text payload", async () => {
      const key = await generateKey();
      const secretId = crypto.randomUUID();
      const payload = encodePayload("Hello, World!");

      const ciphertext = await encrypt(payload, key, secretId);
      const decryptedBytes = await decrypt(ciphertext, key, secretId);
      const decoded = decodePayload(decryptedBytes);
      expect(decoded.text).toBe("Hello, World!");
    });

    it("round-trips text+image payload", async () => {
      const key = await generateKey();
      const secretId = crypto.randomUUID();
      const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
      const payload = encodePayload("Caption", {
        mime: "image/png",
        data: imageData,
      });

      const ciphertext = await encrypt(payload, key, secretId);
      const decryptedBytes = await decrypt(ciphertext, key, secretId);
      const decoded = decodePayload(decryptedBytes);

      expect(decoded.text).toBe("Caption");
      expect(decoded.image).toBeDefined();
      expect(decoded.image!.mime).toBe("image/png");
      expect(decoded.image!.data).toEqual(imageData);
    });

    it("produces base64-encoded output", async () => {
      const key = await generateKey();
      const payload = encodePayload("test");
      const ct = await encrypt(payload, key, crypto.randomUUID());
      // base64 characters only
      expect(ct).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it("ciphertext starts with version byte 0x01", async () => {
      const key = await generateKey();
      const payload = encodePayload("test");
      const ct = await encrypt(payload, key, crypto.randomUUID());
      const bytes = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));
      expect(bytes[0]).toBe(0x01);
    });

    it("encrypts unicode text through encrypt/decrypt", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const payload = encodePayload("日本語テスト 🎉");
      const ct = await encrypt(payload, key, id);
      const decryptedBytes = await decrypt(ct, key, id);
      const decoded = decodePayload(decryptedBytes);
      expect(decoded.text).toBe("日本語テスト 🎉");
    });

    it("encrypts empty payload through encrypt/decrypt", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const payload = encodePayload("");
      const ct = await encrypt(payload, key, id);
      const decryptedBytes = await decrypt(ct, key, id);
      const decoded = decodePayload(decryptedBytes);
      expect(decoded.text).toBe("");
    });

    it("different secret IDs produce different ciphertext", async () => {
      const key = await generateKey();
      const payload = encodePayload("same");
      const ct1 = await encrypt(payload, key, crypto.randomUUID());
      const ct2 = await encrypt(payload, key, crypto.randomUUID());
      expect(ct1).not.toBe(ct2);
    });

    it("fails to decrypt with wrong secret ID (AAD mismatch)", async () => {
      const key = await generateKey();
      const id1 = crypto.randomUUID();
      const id2 = crypto.randomUUID();
      const payload = encodePayload("secret");
      const ct = await encrypt(payload, key, id1);

      await expect(decrypt(ct, key, id2)).rejects.toThrow();
    });

    it("fails to decrypt with wrong key", async () => {
      const key1 = await generateKey();
      const key2 = await generateKey();
      const id = crypto.randomUUID();
      const payload = encodePayload("secret");
      const ct = await encrypt(payload, key1, id);

      await expect(decrypt(ct, key2, id)).rejects.toThrow();
    });

    it("rejects unsupported version", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const payload = encodePayload("test");
      const ct = await encrypt(payload, key, id);
      const bytes = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));
      bytes[0] = 0xff; // bad version
      const tampered = btoa(String.fromCharCode(...bytes));

      await expect(decrypt(tampered, key, id)).rejects.toThrow(
        "Unsupported encryption version",
      );
    });

    it("does not mutate the caller's payload buffer", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const payload = encodePayload("do not wipe me");
      const original = new Uint8Array(payload);

      await encrypt(payload, key, id);
      expect(payload).toEqual(original);
    });
  });
});
