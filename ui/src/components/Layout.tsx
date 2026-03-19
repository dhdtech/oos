import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";
import { Shield, Lock, Eye, Trash2, Github } from "lucide-react";
import SecurityModal from "./SecurityModal";
import LanguageSelector from "./LanguageSelector";

const GLOBAL_SCHEMA = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Only Once Share",
    url: "https://ooshare.io",
    description:
      "Share and send passwords, images, secrets, and sensitive information securely with one-time self-destructing links. End-to-end AES-256 encryption with zero-knowledge architecture. Free and open source.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Organization",
      name: "DHD Tech",
      url: "https://dhdtech.com",
    },
    featureList: [
      "End-to-end AES-256-GCM encryption",
      "Zero-knowledge architecture",
      "Encrypted image sharing (JPEG, PNG, GIF, WebP up to 10 MB)",
      "Single-use self-destructing links",
      "Text and image secrets in one link",
      "No account required",
      "Open source",
      "6-language support",
      "Self-hosting with Docker",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DHD Tech",
    url: "https://dhdtech.com",
    logo: "https://ooshare.io/favicon.svg",
    sameAs: ["https://github.com/dhdtech"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Only Once Share",
    url: "https://ooshare.io",
    description:
      "Free, open-source, end-to-end encrypted secret and image sharing tool.",
    publisher: { "@type": "Organization", name: "DHD Tech" },
  },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: GLOBAL_SCHEMA }}
      />
      <header className="layout-header">
        <Link to="/">
          <Shield size={22} className="header-icon" />
          <span className="header-title">{t("header.title")}</span>
        </Link>
        <div className="header-actions">
          <nav className="header-nav">
            <Link to="/security">{t("nav.security")}</Link>
            <Link to="/blog">{t("nav.blog")}</Link>
            <Link to="/faq">{t("nav.faq")}</Link>
          </nav>
          <LanguageSelector />
          <SecurityModal />
        </div>
      </header>

      <main className="layout-main">
        <div className="layout-content">{children}</div>
      </main>

      <footer className="layout-footer">
        <div className="footer-badges">
          <span className="footer-badge">
            <Lock size={13} />
            {t("footer.encryption")}
          </span>
          <span className="footer-badge">
            <Eye size={13} />
            {t("footer.zeroKnowledge")}
          </span>
          <span className="footer-badge">
            <Trash2 size={13} />
            {t("footer.autoDelete")}
          </span>
        </div>
        <div className="footer-links">
          <Link to="/security">{t("nav.security")}</Link>
          <Link to="/blog">{t("nav.blog")}</Link>
          <Link to="/faq">{t("nav.faq")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/why">{t("nav.why")}</Link>
        </div>
        <a
          href="https://github.com/dhdtech/oos"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-opensource"
        >
          <Github size={14} />
          {t("footer.openSource")}
        </a>
        <div className="footer-powered">
          <span>Powered by</span>
          <a
            href="https://dhdtech.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            DHDTech.io
          </a>
        </div>
      </footer>
    </div>
  );
}
