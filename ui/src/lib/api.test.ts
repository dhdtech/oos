import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSecret, getSecret } from "./api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("createSecret", () => {
  it("sends ciphertext, ttl, and id to the API", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "uuid-123", alias: "AbCd1234" }),
    });

    const result = await createSecret("ct", 24, "uuid-123");
    expect(mockFetch).toHaveBeenCalledWith("/api/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ciphertext: "ct", ttl_hours: 24, id: "uuid-123" }),
    });
    expect(result).toEqual({ id: "uuid-123", alias: "AbCd1234" });
  });

  it("returns null alias when server returns none", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "uuid-123" }),
    });

    const result = await createSecret("ct", 1, "uuid-123");
    expect(result.alias).toBeNull();
  });

  it("throws on API error with server message", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Payload too large" }),
    });

    await expect(createSecret("ct", 1, "id")).rejects.toThrow(
      "Payload too large",
    );
  });

  it("throws default message when no error field", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(createSecret("ct", 1, "id")).rejects.toThrow(
      "Failed to create secret",
    );
  });
});

describe("getSecret", () => {
  it("fetches ciphertext and id", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ ciphertext: "data", id: "real-uuid" }),
    });

    const result = await getSecret("alias123");
    expect(mockFetch).toHaveBeenCalledWith("/api/secrets/alias123");
    expect(result).toEqual({ ciphertext: "data", id: "real-uuid" });
  });

  it("throws on 404", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(getSecret("missing")).rejects.toThrow(
      "Secret not found or already viewed",
    );
  });

  it("throws on other errors with server message", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Internal error" }),
    });

    await expect(getSecret("id")).rejects.toThrow("Internal error");
  });

  it("throws default message when no error field", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    await expect(getSecret("id")).rejects.toThrow(
      "Failed to retrieve secret",
    );
  });
});
