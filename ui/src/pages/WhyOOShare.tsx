import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Shield,
  ImagePlus,
  Infinity,
  Github,
  ArrowLeft,
  Lock,
} from "lucide-react";
import useSEO from "../lib/useSEO";

export default function WhyOOShare() {
  const { t } = useTranslation();

  useSEO({
    title: t("pages.why.metaTitle"),
    description: t("pages.why.metaDesc"),
    path: "/why",
  });

  return (
    <div className="content-page">
      <article className="article">
        <header className="article-header">
          <h1>{t("pages.why.title")}</h1>
          <p className="article-lead">{t("pages.why.lead")}</p>
        </header>

        <section className="why-grid">
          <div className="info-card">
            <div className="info-card-icon"><Shield size={20} /></div>
            <h2>{t("pages.why.benefit1Title")}</h2>
            <p>{t("pages.why.benefit1Desc")}</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><ImagePlus size={20} /></div>
            <h2>{t("pages.why.benefit2Title")}</h2>
            <p>{t("pages.why.benefit2Desc")}</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><Infinity size={20} /></div>
            <h2>{t("pages.why.benefit3Title")}</h2>
            <p>{t("pages.why.benefit3Desc")}</p>
          </div>
          <div className="info-card">
            <div className="info-card-icon"><Github size={20} /></div>
            <h2>{t("pages.why.benefit4Title")}</h2>
            <p>{t("pages.why.benefit4Desc")}</p>
          </div>
        </section>

        <section className="article-section">
          <h2>{t("pages.why.tableTitle")}</h2>
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{t("pages.why.feature")}</th>
                  <th className="compare-highlight">OOShare</th>
                  <th>OneTimeSecret</th>
                  <th>Privnote</th>
                  <th>Scrt.link</th>
                  <th>Password.link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("pages.why.e2e")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                </tr>
                <tr>
                  <td>{t("pages.why.imageSharing")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                </tr>
                <tr>
                  <td>{t("pages.why.free")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-partial">Limited</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-partial">Limited</td>
                  <td className="compare-partial">Limited</td>
                </tr>
                <tr>
                  <td>{t("pages.why.openSource")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                </tr>
                <tr>
                  <td>{t("pages.why.noAccount")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-partial">Optional</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                </tr>
                <tr>
                  <td>{t("pages.why.selfHost")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                </tr>
                <tr>
                  <td>{t("pages.why.zeroKnowledge")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-no">No</td>
                  <td className="compare-no">No</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                </tr>
                <tr>
                  <td>{t("pages.why.autoExpiry")}</td>
                  <td className="compare-highlight compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                  <td className="compare-yes">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="article-section">
          <h2>{t("pages.why.detailTitle")}</h2>

          <h3>{t("pages.why.detail1Title")}</h3>
          <p>{t("pages.why.detail1Desc")}</p>

          <h3>{t("pages.why.detail2Title")}</h3>
          <p>{t("pages.why.detail2Desc")}</p>

          <h3>{t("pages.why.detail3Title")}</h3>
          <p>{t("pages.why.detail3Desc")}</p>
        </section>

        <div className="article-cta">
          <p>{t("pages.why.ctaText")}</p>
          <Link to="/" className="btn btn-primary">
            <Lock size={16} />
            {t("pages.why.ctaButton")}
          </Link>
        </div>

        <Link to="/" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.backHome")}
        </Link>
      </article>
    </div>
  );
}
