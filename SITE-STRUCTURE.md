# Site Structure — Only Once Share (ooshare.io)

> URL hierarchy, information architecture, and internal linking strategy.
> Created: March 2026

---

## 1. Current State

```
ooshare.io/
├── /                   ← Homepage (create secret form)
└── /s/:id              ← View secret (dynamic, blocked from indexing)
```

**Problem:** Only 1 indexable page. Zero content for search engines to rank.

---

## 2. Proposed Site Architecture

```
ooshare.io/
│
├── /                           ← Homepage (tool + value proposition)
│
├── /security                   ← How encryption works, zero-knowledge architecture
├── /about                      ← DHD Tech, team, mission, open source commitment
├── /faq                        ← Common questions (FAQPage schema)
├── /privacy                    ← Privacy policy
├── /terms                      ← Terms of service
│
├── /blog/                      ← Blog listing page
│   ├── /how-to-share-password-securely
│   ├── /what-is-zero-knowledge-encryption
│   ├── /self-destructing-links-explained
│   ├── /send-api-keys-securely
│   ├── /self-host-secret-sharing-docker
│   ├── /gdpr-compliant-secret-sharing
│   ├── /aes-256-gcm-encryption-explained
│   ├── /why-email-is-not-safe-for-passwords
│   ├── /devops-secret-sharing-best-practices
│   ├── /employee-onboarding-credential-sharing
│   └── ... (2-3 new posts per month)
│
├── /compare/                   ← Comparison hub page
│   ├── /best-secret-sharing-tools
│   ├── /onetimesecret-alternative
│   ├── /password-link-alternative
│   ├── /password-pusher-alternative
│   └── /scrt-link-alternative
│
├── /s/:id                      ← View secret (noindex, blocked in robots.txt)
│
├── /sitemap.xml                ← Dynamic XML sitemap
├── /robots.txt                 ← Crawler directives
├── /llms.txt                   ← AI crawler summary
└── /.well-known/security.txt   ← Security contact info
```

### Estimated Page Count

| Section | Pages (EN) | Multilingual (x6) | Total |
|---------|-----------|-------------------|-------|
| Core pages | 5 | 30 | 30 |
| Blog posts (Year 1) | 20-25 | 40-50 (selective) | 60-75 |
| Comparison pages | 5 | 15 (ES, PT, ZH) | 15-20 |
| **Total** | **30-35** | | **105-125** |

---

## 3. Page Specifications

### Homepage (`/`)

**Purpose:** Primary landing page + tool interface + SEO authority page

| Element | Details |
|---------|---------|
| H1 | "Share Secrets Securely with Self-Destructing Links" |
| Content sections | Hero + value proposition, how it works (3 steps), feature badges, trust signals, FAQ snippet |
| Schema | WebApplication + WebSite + Organization + FAQPage |
| Internal links | → /security, → /about, → /faq, → /blog, → /compare |
| Target keywords | secure secret sharing, one-time link, share password securely |

### Security Page (`/security`)

**Purpose:** Technical authority page explaining the encryption architecture

| Element | Details |
|---------|---------|
| H1 | "How Only Once Share Keeps Your Secrets Safe" |
| Content sections | Encryption overview, AES-256-GCM explanation, zero-knowledge architecture diagram, key derivation (HKDF), client-side flow, what the server never sees, comparison to server-side encryption |
| Schema | TechArticle + WebApplication |
| Internal links | → /, → /blog/aes-256-gcm-explained, → /blog/zero-knowledge-encryption, → /compare |
| Target keywords | zero-knowledge encryption, AES-256-GCM, client-side encryption |
| Word count | 1,500-2,000 words |

### FAQ Page (`/faq`)

**Purpose:** Answer common questions, capture long-tail keywords, enable FAQPage rich results

| Element | Details |
|---------|---------|
| H1 | "Frequently Asked Questions" |
| Schema | FAQPage (every Q&A pair as Question + AcceptedAnswer) |
| Internal links | Each answer links to relevant blog post or page |
| Target keywords | how to share password securely, is it safe, self-destructing link FAQ |

**Recommended FAQ Questions:**
1. How does Only Once Share work?
2. Is my secret truly private? (zero-knowledge explanation)
3. What encryption does Only Once Share use?
4. Can the server see my secret?
5. What happens after someone views my secret?
6. How long do secrets last?
7. Is Only Once Share free?
8. Can I self-host Only Once Share?
9. Is Only Once Share open source?
10. How is this different from OneTimeSecret?
11. Is it safe to share passwords with Only Once Share?
12. Does Only Once Share work in my language?

### About Page (`/about`)

**Purpose:** E-E-A-T signals — establish organization credibility

| Element | Details |
|---------|---------|
| H1 | "About Only Once Share" |
| Content | DHD Tech story, mission (making secure sharing accessible), team credentials, open source commitment, technology choices |
| Schema | Organization + AboutPage |
| Internal links | → /, → /security, → GitHub repo |

### Blog Listing (`/blog`)

**Purpose:** Content hub, internal linking anchor

| Element | Details |
|---------|---------|
| H1 | "Blog — Security, Encryption & Secret Sharing" |
| Content | Paginated list of posts with title, excerpt, date, reading time |
| Schema | Blog + CollectionPage |
| Internal links | → Each blog post, → /compare |
| Features | Category tags, search, pagination |

### Blog Post Template

| Element | Details |
|---------|---------|
| Schema | Article + BlogPosting with author, datePublished, dateModified |
| Must include | Author byline (DHD Tech), publish date, last updated date, reading time, table of contents (for posts > 1,500 words) |
| Internal links | Minimum 2 links to other ooshare.io pages per post |
| CTA | "Try Only Once Share — free, secure, no account needed" box at end |
| Sidebar/footer | Related posts section |

### Comparison Hub (`/compare`)

**Purpose:** Internal linking hub for all comparison content

| Element | Details |
|---------|---------|
| H1 | "Compare Secret Sharing Tools" |
| Content | Overview table comparing all tools, links to individual comparison pages |
| Schema | WebPage + ItemList |
| Internal links | → Each /compare/ subpage, → /security, → /blog |

### Individual Comparison Page Template (`/compare/:competitor`)

| Element | Details |
|---------|---------|
| Schema | WebPage + FAQPage (for comparison questions) |
| Sections | Feature comparison table, encryption approach comparison, pricing comparison, pros/cons, use case recommendations, FAQ, verdict |
| Must include | Factual, verifiable claims only; link to competitor's site; last updated date |
| Internal links | → /, → /security, → /compare, → relevant blog posts |

---

## 4. Internal Linking Strategy

### Link Architecture Principles

1. **Hub-and-spoke model:** `/compare/` and `/blog/` are hubs; individual pages are spokes
2. **Every page links to homepage** via navigation
3. **Every blog post links to 2+ other pages** (related posts or comparison pages)
4. **Comparison pages link to security page** (to reinforce encryption differentiation)
5. **FAQ answers link to detailed blog posts** for expanded reading

### Link Flow Diagram

```
                    ┌─────────┐
                    │ Homepage │
                    └────┬────┘
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼─────┐  ┌────▼────┐  ┌─────▼──────┐
    │ /security │  │  /blog  │  │  /compare  │
    └─────┬─────┘  └────┬────┘  └─────┬──────┘
          │              │              │
          │    ┌─────────┼─────────┐   │
          │    │         │         │   │
          ▼    ▼         ▼         ▼   ▼
       Blog posts    Blog posts    Comparison
       reference     cross-link    pages link
       /security     each other    to /security
```

### Anchor Text Strategy

| Target Page | Preferred Anchor Text Variations |
|------------|--------------------------------|
| Homepage | "Only Once Share", "secure secret sharing", "share secrets securely" |
| /security | "how our encryption works", "zero-knowledge architecture", "encryption details" |
| /faq | "frequently asked questions", "common questions" |
| /compare | "compare secret sharing tools", "see how we compare" |
| /compare/onetimesecret-alternative | "compared to OneTimeSecret", "OTS alternative" |
| /blog/[post] | Use target keyword as anchor text |

---

## 5. URL Conventions

### Rules
- All lowercase
- Hyphens as word separators (never underscores)
- No trailing slashes
- No file extensions
- Maximum 3 directory levels deep
- Keep URLs under 75 characters where possible
- English words in URLs (even for translated pages, use `?lng=xx` parameter)

### Examples
```
✅ /blog/how-to-share-password-securely
✅ /compare/onetimesecret-alternative
✅ /security
✅ /faq?lng=es

❌ /blog/How-To-Share-Password-Securely
❌ /blog/how_to_share_password_securely
❌ /compare/onetimesecret-alternative/
❌ /es/comparar/alternativa-a-onetimesecret
```

---

## 6. Sitemap Structure

### sitemap.xml (Enhanced)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Core Pages -->
  <url>
    <loc>https://ooshare.io/</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://ooshare.io/"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://ooshare.io/?lng=es"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://ooshare.io/?lng=zh"/>
    <xhtml:link rel="alternate" hreflang="hi" href="https://ooshare.io/?lng=hi"/>
    <xhtml:link rel="alternate" hreflang="ar" href="https://ooshare.io/?lng=ar"/>
    <xhtml:link rel="alternate" hreflang="pt" href="https://ooshare.io/?lng=pt"/>
  </url>

  <url>
    <loc>https://ooshare.io/security</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://ooshare.io/faq</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://ooshare.io/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog -->
  <url>
    <loc>https://ooshare.io/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Comparison Hub -->
  <url>
    <loc>https://ooshare.io/compare</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Individual pages added dynamically as they are published -->
</urlset>
```

---

## 7. robots.txt (Updated)

```
User-agent: *
Allow: /
Disallow: /s/

# AI Crawlers - Allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://ooshare.io/sitemap.xml
```

---

## 8. Navigation Structure

### Header Navigation
```
Logo | Home | Security | Blog | Compare | FAQ | [Language Selector] | [GitHub]
```

### Footer Navigation
```
Product                  Resources              Company
─────────               ──────────             ────────
How It Works            Blog                    About
Security                FAQ                     Privacy Policy
Self-Hosting            Compare Tools           Terms of Service
API Docs                                        GitHub

[AES-256-GCM Badge] [Zero Knowledge Badge] [Auto-Delete Badge] [Open Source Badge]
```

### Mobile Navigation
- Hamburger menu with all primary links
- Language selector accessible from menu
- "Share a Secret" CTA always visible

---

## 9. Page Priority for Implementation

| Priority | Page | Reason |
|----------|------|--------|
| 1 | Pre-rendering infrastructure | Blocks all other SEO work |
| 2 | /security | Highest E-E-A-T impact, supports all other content |
| 3 | /faq | FAQPage schema = rich results, answers common queries |
| 4 | /about | Organization signals for E-E-A-T |
| 5 | /blog infrastructure | Enables content publishing pipeline |
| 6 | First 2 blog posts | Start indexing content |
| 7 | /compare/onetimesecret-alternative | Highest-intent comparison keyword |
| 8 | /compare/best-secret-sharing-tools | Roundup captures broader searches |
| 9 | /privacy + /terms | Trust and compliance signals |
| 10 | Remaining comparison pages | Incremental traffic from comparison searches |
