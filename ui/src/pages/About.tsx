import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Github, Globe, ArrowLeft } from "lucide-react";

export default function About() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("pages.about.metaTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("pages.about.metaDesc"));
  }, [t]);

  return (
    <div className="content-page">
      <article className="article">
        <header className="article-header">
          <h1>{t("pages.about.title")}</h1>
          <p className="article-lead">{t("pages.about.lead")}</p>
        </header>

        <section className="article-section">
          <h2>{t("pages.about.missionTitle")}</h2>
          <p>{t("pages.about.missionP1")}</p>
          <p>{t("pages.about.missionP2")}</p>
        </section>

        <section className="article-section">
          <h2>{t("pages.about.whyOssTitle")}</h2>
          <p>{t("pages.about.whyOssP1")}</p>
          <p>{t("pages.about.whyOssP2")}</p>
        </section>

        <section className="article-section">
          <h2>{t("pages.about.builtByTitle")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("pages.about.builtByP1") }} />
        </section>

        <section className="article-section">
          <h2>{t("pages.about.differentTitle")}</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <Shield size={20} />
              <h3>{t("pages.about.feature1Title")}</h3>
              <p>{t("pages.about.feature1Desc")}</p>
            </div>
            <div className="feature-item">
              <Globe size={20} />
              <h3>{t("pages.about.feature2Title")}</h3>
              <p>{t("pages.about.feature2Desc")}</p>
            </div>
            <div className="feature-item">
              <Github size={20} />
              <h3>{t("pages.about.feature3Title")}</h3>
              <p>{t("pages.about.feature3Desc")}</p>
            </div>
            <div className="feature-item">
              <Globe size={20} />
              <h3>{t("pages.about.feature4Title")}</h3>
              <p>{t("pages.about.feature4Desc")}</p>
            </div>
          </div>
        </section>

        <section className="article-section">
          <h2>{t("pages.about.involvedTitle")}</h2>
          <p>{t("pages.about.involvedP1")}</p>
          <div className="article-cta">
            <a
              href="https://github.com/dhdtech/only-once-share"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <Github size={16} />
              {t("pages.about.viewOnGithub")}
            </a>
          </div>
        </section>

        <a href="/" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.backHome")}
        </a>
      </article>
    </div>
  );
}
