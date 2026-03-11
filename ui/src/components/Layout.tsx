import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Lock, Eye, Trash2, Github } from "lucide-react";
import SecurityModal from "./SecurityModal";
import LanguageSelector from "./LanguageSelector";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.title = t("meta.title");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t("meta.description"));
  }, [i18n.language, t]);

  return (
    <div className="layout">
      <header className="layout-header">
        <a href="/">
          <Shield size={22} className="header-icon" />
          <span className="header-title">{t("header.title")}</span>
        </a>
        <div className="header-actions">
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
        <a
          href="https://github.com/dhdtech/oos"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-opensource"
        >
          <Github size={14} />
          {t("footer.openSource")}
        </a>
      </footer>
    </div>
  );
}
