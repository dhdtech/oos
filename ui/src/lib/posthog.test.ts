import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock posthog-js before importing our module
const mockInit = vi.fn();
vi.mock("posthog-js", () => ({
  default: {
    init: mockInit,
    capture: vi.fn(),
  },
}));

describe("posthog", () => {
  beforeEach(() => {
    mockInit.mockReset();
    vi.unstubAllEnvs();
  });

  it("does not call posthog.init when VITE_POSTHOG_KEY is not set", async () => {
    vi.stubEnv("VITE_POSTHOG_KEY", "");
    // Re-import to re-evaluate module
    vi.resetModules();
    vi.mock("posthog-js", () => ({
      default: { init: mockInit, capture: vi.fn() },
    }));
    await import("./posthog");
    expect(mockInit).not.toHaveBeenCalled();
  });

  it("calls posthog.init when VITE_POSTHOG_KEY is set", async () => {
    vi.stubEnv("VITE_POSTHOG_KEY", "phc_test123");
    vi.stubEnv("VITE_POSTHOG_HOST", "https://custom.posthog.com");
    vi.resetModules();
    vi.mock("posthog-js", () => ({
      default: { init: mockInit, capture: vi.fn() },
    }));
    await import("./posthog");
    expect(mockInit).toHaveBeenCalledWith("phc_test123", expect.objectContaining({
      api_host: "https://custom.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    }));
  });

  it("uses default host when VITE_POSTHOG_HOST is not set", async () => {
    vi.stubEnv("VITE_POSTHOG_KEY", "phc_test123");
    vi.stubEnv("VITE_POSTHOG_HOST", "");
    vi.resetModules();
    vi.mock("posthog-js", () => ({
      default: { init: mockInit, capture: vi.fn() },
    }));
    await import("./posthog");
    expect(mockInit).toHaveBeenCalledWith("phc_test123", expect.objectContaining({
      api_host: "https://us.i.posthog.com",
    }));
  });

  describe("sanitize_properties", () => {
    function getSanitizer(): (props: Record<string, unknown>, event: string) => Record<string, unknown> {
      const call = mockInit.mock.calls[0];
      return call[1].sanitize_properties;
    }

    async function initWithKey() {
      vi.stubEnv("VITE_POSTHOG_KEY", "phc_test");
      vi.resetModules();
      vi.mock("posthog-js", () => ({
        default: { init: mockInit, capture: vi.fn() },
      }));
      await import("./posthog");
    }

    it("strips URL fragments from known URL properties", async () => {
      await initWithKey();
      const sanitize = getSanitizer();
      const props = {
        "$current_url": "https://example.com/s/abc#secretkey",
        "$pathname": "/s/abc#secretkey",
        "$referrer": "https://example.com/page#frag",
        other: "untouched",
      };
      const result = sanitize(props, "$pageview");
      expect(result["$current_url"]).toBe("https://example.com/s/abc");
      expect(result["$pathname"]).toBe("/s/abc");
      expect(result["$referrer"]).toBe("https://example.com/page");
      expect(result.other).toBe("untouched");
    });

    it("strips fragments from arbitrary properties containing /s/ URLs", async () => {
      await initWithKey();
      const sanitize = getSanitizer();
      const props = {
        custom_field: "https://example.com/s/abc#key123",
      };
      const result = sanitize(props, "$autocapture");
      expect(result.custom_field).toBe("https://example.com/s/abc");
    });

    it("does not strip fragments from non-/s/ URLs in arbitrary properties", async () => {
      await initWithKey();
      const sanitize = getSanitizer();
      const props = {
        custom_field: "https://example.com/page#section",
      };
      const result = sanitize(props, "$autocapture");
      expect(result.custom_field).toBe("https://example.com/page#section");
    });

    it("handles non-string values without error", async () => {
      await initWithKey();
      const sanitize = getSanitizer();
      const props = {
        "$current_url": 12345,
        numeric: 42,
        bool: true,
        obj: { nested: "value" },
      };
      const result = sanitize(props, "$pageview");
      expect(result["$current_url"]).toBe(12345);
      expect(result.numeric).toBe(42);
    });

    it("handles URL properties without fragments", async () => {
      await initWithKey();
      const sanitize = getSanitizer();
      const props = {
        "$current_url": "https://example.com/s/abc",
      };
      const result = sanitize(props, "$pageview");
      expect(result["$current_url"]).toBe("https://example.com/s/abc");
    });
  });
});
