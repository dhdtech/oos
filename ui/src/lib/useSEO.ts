import { useEffect } from "react";

const BASE_URL = "https://ooshare.io";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Only Once Share";
const LANGUAGES = ["en", "zh", "es", "hi", "ar", "pt"];

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

function setMeta(selector: string, attribute: string, value: string) {
  document.querySelector(selector)?.setAttribute(attribute, value);
}

export default function useSEO({ title, description, path, ogImage }: SEOProps) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);

    // Open Graph
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);

    // Twitter Card
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", image);

    // Hreflang tags
    document.querySelectorAll("link[hreflang]").forEach((el) => el.remove());
    for (const lang of LANGUAGES) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = `${url}?lng=${lang}`;
      document.head.appendChild(link);
    }
    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.href = url;
    document.head.appendChild(xDefault);
  }, [title, description, path, ogImage]);
}
