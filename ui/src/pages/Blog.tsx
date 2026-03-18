import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getBlogPosts } from "../content/blog-posts";

export default function Blog() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("pages.blog.metaTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("pages.blog.metaDesc"));
  }, [t]);

  const posts = getBlogPosts(i18n.language);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const locale = i18n.language === "zh" ? "zh-CN" : i18n.language;

  return (
    <div className="content-page">
      <article className="article">
        <header className="article-header">
          <h1>{t("pages.blog.title")}</h1>
          <p className="article-lead">{t("pages.blog.lead")}</p>
        </header>

        <div className="blog-list">
          {sorted.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card-content">
                <div className="blog-card-tags">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.description}</p>
                <div className="blog-card-meta">
                  <span><Calendar size={13} /> {new Date(post.date).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span><Clock size={13} /> {post.readingTime} {t("pages.blog.minRead")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <a href="/" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.backHome")}
        </a>
      </article>
    </div>
  );
}
