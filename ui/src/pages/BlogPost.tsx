import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getBlogPosts } from "../content/blog-posts";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const posts = getBlogPosts(i18n.language);
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Only Once Share Blog`;
      document.querySelector('meta[name="description"]')?.setAttribute("content", post.description);

      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": { "@type": "Organization", "name": "DHD Tech", "url": "https://dhdtech.com" },
        "publisher": { "@type": "Organization", "name": "Only Once Share", "url": "https://ooshare.io" },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://ooshare.io/blog/${post.slug}` },
        "keywords": post.tags.join(", ")
      };
      let script = document.querySelector('script[data-blog-schema]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-blog-schema", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
      return () => { script?.remove(); };
    }
  }, [post]);

  if (!post) return <NotFound />;

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const idx = sorted.findIndex(p => p.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;
  const locale = i18n.language === "zh" ? "zh-CN" : i18n.language;
  return (
    <div className="content-page">
      <article className="article blog-article">
        <header className="article-header">
          <div className="blog-card-tags">
            {post.tags.map(tag => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span><Calendar size={14} /> {new Date(post.date).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</span>
            <span><Clock size={14} /> {post.readingTime} {t("pages.blog.minRead")}</span>
            <span>{t("pages.blog.by")} DHD Tech</span>
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="blog-cta-box">
          <h3>{t("pages.blog.ctaTitle")}</h3>
          <p>{t("pages.blog.ctaDesc")}</p>
          <a href="/" className="btn btn-primary">{t("pages.blog.ctaButton")}</a>
        </div>

        <nav className="blog-nav">
          {prev && (
            <Link to={`/blog/${prev.slug}`} className="blog-nav-link blog-nav-prev">
              <small>{t("pages.blog.previous")}</small>
              <span>{prev.title}</span>
            </Link>
          )}
          {next && (
            <Link to={`/blog/${next.slug}`} className="blog-nav-link blog-nav-next">
              <small>{t("pages.blog.next")}</small>
              <span>{next.title}</span>
            </Link>
          )}
        </nav>

        <Link to="/blog" className="back-link">
          <ArrowLeft size={15} />
          {t("nav.allPosts")}
        </Link>
      </article>
    </div>
  );
}
