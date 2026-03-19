import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useSEO from "../lib/useSEO";

const FAQ_COUNT = 12;

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`pages.faq.q${i + 1}`),
    a: t(`pages.faq.a${i + 1}`),
  }));

  useSEO({
    title: t("pages.faq.metaTitle"),
    description: t("pages.faq.metaDesc"),
    path: "/faq",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
    let script = document.querySelector('script[data-faq-schema]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-faq-schema", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => { script?.remove(); };
  }, [t, faqs]);

  return (
    <div className="content-page">
      <article className="article">
        <header className="article-header">
          <h1>{t("pages.faq.title")}</h1>
          <p className="article-lead">{t("pages.faq.lead")}</p>
        </header>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary className="faq-question">{faq.q}</summary>
              <div className="faq-answer"><p>{faq.a}</p></div>
            </details>
          ))}
        </div>

        <div className="article-cta">
          <p>{t("pages.faq.moreQuestions")}</p>
          <a
            href="https://github.com/dhdtech/oos/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            {t("pages.faq.askGithub")}
          </a>
        </div>

        <Link to="/" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.backHome")}
        </Link>
      </article>
    </div>
  );
}
