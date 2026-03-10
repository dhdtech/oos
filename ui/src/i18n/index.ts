import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";
import hi from "./locales/hi.json";
import ar from "./locales/ar.json";
import pt from "./locales/pt.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      hi: { translation: hi },
      ar: { translation: ar },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      convertDetectedLanguage: (lng: string) => lng.split("-")[0],
    },
  });

export default i18n;

export const LANGUAGES = [
  { code: "en", flag: "\u{1F1FA}\u{1F1F8}", label: "English" },
  { code: "zh", flag: "\u{1F1E8}\u{1F1F3}", label: "\u4E2D\u6587" },
  { code: "es", flag: "\u{1F1EA}\u{1F1F8}", label: "Espa\u00F1ol" },
  { code: "hi", flag: "\u{1F1EE}\u{1F1F3}", label: "\u0939\u093F\u0928\u094D\u0926\u0940" },
  { code: "ar", flag: "\u{1F1F8}\u{1F1E6}", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  { code: "pt", flag: "\u{1F1E7}\u{1F1F7}", label: "Portugu\u00EAs" },
];
