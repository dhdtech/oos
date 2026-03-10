import { describe, it, expect } from "vitest";
import { generateKey, exportKey, importKey, encrypt, decrypt } from "./crypto";

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

  describe("encrypt / decrypt", () => {
    it("round-trips plaintext", async () => {
      const key = await generateKey();
      const secretId = crypto.randomUUID();
      const plaintext = "Hello, World!";

      const ciphertext = await encrypt(plaintext, key, secretId);
      const decrypted = await decrypt(ciphertext, key, secretId);
      expect(decrypted).toBe(plaintext);
    });

    it("produces base64-encoded output", async () => {
      const key = await generateKey();
      const ct = await encrypt("test", key, crypto.randomUUID());
      // base64 characters only
      expect(ct).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it("ciphertext starts with version byte 0x01", async () => {
      const key = await generateKey();
      const ct = await encrypt("test", key, crypto.randomUUID());
      const bytes = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));
      expect(bytes[0]).toBe(0x01);
    });

    it("encrypts unicode text", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const plaintext = "日本語テスト 🎉";
      const ct = await encrypt(plaintext, key, id);
      expect(await decrypt(ct, key, id)).toBe(plaintext);
    });

    it("encrypts empty string", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const ct = await encrypt("", key, id);
      expect(await decrypt(ct, key, id)).toBe("");
    });

    it("different secret IDs produce different ciphertext", async () => {
      const key = await generateKey();
      const ct1 = await encrypt("same", key, crypto.randomUUID());
      const ct2 = await encrypt("same", key, crypto.randomUUID());
      expect(ct1).not.toBe(ct2);
    });

    it("fails to decrypt with wrong secret ID (AAD mismatch)", async () => {
      const key = await generateKey();
      const id1 = crypto.randomUUID();
      const id2 = crypto.randomUUID();
      const ct = await encrypt("secret", key, id1);

      await expect(decrypt(ct, key, id2)).rejects.toThrow();
    });

    it("fails to decrypt with wrong key", async () => {
      const key1 = await generateKey();
      const key2 = await generateKey();
      const id = crypto.randomUUID();
      const ct = await encrypt("secret", key1, id);

      await expect(decrypt(ct, key2, id)).rejects.toThrow();
    });

    it("rejects unsupported version", async () => {
      const key = await generateKey();
      const id = crypto.randomUUID();
      const ct = await encrypt("test", key, id);
      const bytes = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));
      bytes[0] = 0xff; // bad version
      const tampered = btoa(String.fromCharCode(...bytes));

      await expect(decrypt(tampered, key, id)).rejects.toThrow(
        "Unsupported encryption version",
      );
    });
  });
});
