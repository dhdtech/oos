import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Lock, Key, Eye, Trash2, Hash, Server, ArrowLeft } from "lucide-react";

export default function Security() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("pages.security.metaTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("pages.security.metaDesc"));
  }, [t]);

  return (
    <div className="content-page">
      <article className="article">
        <header className="article-header">
          <h1>{t("pages.security.title")}</h1>
          <p className="article-lead">{t("pages.security.lead")}</p>
        </header>

        <section className="info-section">
          <div className="info-card">
            <div className="info-card-icon"><Lock size={20} /></div>
            <h2>{t("pages.security.e2eTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.e2eContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Key size={20} /></div>
            <h2>{t("pages.security.hkdfTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.hkdfContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Hash size={20} /></div>
            <h2>{t("pages.security.aadTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.aadContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Eye size={20} /></div>
            <h2>{t("pages.security.zkTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.zkContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Server size={20} /></div>
            <h2>{t("pages.security.serverTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.serverContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Trash2 size={20} /></div>
            <h2>{t("pages.security.oneTimeTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.oneTimeContent") }} />
          </div>

          <div className="info-card">
            <div className="info-card-icon"><Shield size={20} /></div>
            <h2>{t("pages.security.ossTitle")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("pages.security.ossContent") }} />
          </div>
        </section>

        <section className="article-section">
          <h2>{t("pages.security.flowTitle")}</h2>
          <ol className="steps-list">
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step1") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step2") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step3") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step4") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step5") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step6") }} />
            <li dangerouslySetInnerHTML={{ __html: t("pages.security.step7") }} />
          </ol>
        </section>

        <section className="article-section">
          <h2>{t("pages.security.whyTitle")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("pages.security.whyP1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("pages.security.whyP2") }} />
        </section>

        <div className="article-cta">
          <a href="/" className="btn btn-primary">{t("pages.security.cta")}</a>
        </div>

        <a href="/" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.backHome")}
        </a>
      </article>
    </div>
  );
}
