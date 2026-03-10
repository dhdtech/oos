import { describe, it, expect } from "vitest";
import i18n, { LANGUAGES } from "./index";

describe("i18n", () => {
  it("exports 6 languages", () => {
    expect(LANGUAGES).toHaveLength(6);
  });

  it("each language has code, flag, and label", () => {
    for (const lang of LANGUAGES) {
      expect(lang.code).toBeTruthy();
      expect(lang.flag).toBeTruthy();
      expect(lang.label).toBeTruthy();
    }
  });

  it("includes expected language codes", () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toEqual(["en", "zh", "es", "hi", "ar", "pt"]);
  });

  it("i18n is initialized with en as fallback", () => {
    expect(i18n.options.fallbackLng).toContain("en");
  });

  it("all 6 languages have translations loaded", () => {
    for (const lang of LANGUAGES) {
      const bundle = i18n.getResourceBundle(lang.code, "translation");
      expect(bundle).toBeTruthy();
      expect(bundle.header?.title).toBe("Only Once Share");
    }
  });

  it("convertDetectedLanguage strips region suffix", () => {
    const convert = i18n.options.detection?.convertDetectedLanguage;
    if (typeof convert === "function") {
      expect(convert("pt-BR")).toBe("pt");
      expect(convert("en-US")).toBe("en");
      expect(convert("zh")).toBe("zh");
    }
  });
});
