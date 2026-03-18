# SEO Strategy: Only Once Share (ooshare.io)

**Date:** 2026-03-18
**Goal:** Organic traffic growth
**Domain:** https://ooshare.io
**Business Type:** SaaS security tool (freemium, open-source)

---

## Executive Summary

ooshare.io has strong SEO foundations (clean URLs, good schema markup, comprehensive sitemap, 21 blog posts in 6 languages) but suffers from one critical architectural flaw that undermines everything: **pure client-side rendering**. All content is invisible in the initial HTML response, meaning search engines and AI crawlers see an empty page. Fixing this single issue would unlock the majority of the site's SEO potential.

### Current Scores

| Dimension | Score | Target (6mo) | Target (12mo) |
|-----------|-------|--------------|----------------|
| Technical SEO | 62/100 | 85/100 | 92/100 |
| Content Quality | 44/100 | 70/100 | 82/100 |
| E-E-A-T | 41/100 | 60/100 | 75/100 |
| GEO (AI Search) | 38/100 | 65/100 | 78/100 |
| AI Citation Readiness | 62/100 | 75/100 | 85/100 |

---

## 1. Critical Issue: Client-Side Rendering

### The Problem

The site is a React 19 SPA (Vite build). Every route serves the same HTML shell:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

**Consequences:**
- All 21 blog posts, 12 FAQ items, Security page, and About page are invisible in initial HTML
- Every page shares the same canonical URL (`https://ooshare.io/`), telling Google all pages are duplicates of the homepage
- OG/Twitter tags are identical on every page (social sharing always shows homepage metadata)
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) generally don't execute JavaScript
- Googlebot renders JS but with days/weeks delay
- Soft 404s return HTTP 200 for non-existent URLs

### Recommended Fix

**Option A (Recommended): Migrate content pages to Astro or Next.js static export**
- Keep `/` and `/s/:id` as client-side React (they need crypto + interactivity)
- Statically generate `/blog/*`, `/faq`, `/security`, `/about` at build time
- Effort: 2-4 weeks. Highest ROI change possible.

**Option B: Add vite-ssg or prerender-spa-plugin**
- Pre-render content routes at build time within the existing Vite setup
- Lower migration cost but less flexible long-term
- Effort: 1-2 weeks

**Option C (Stopgap): Prerendering service**
- Configure nginx to detect bot user agents and proxy to Prerender.io/Rendertron
- Quick fix (~1-2 days) but adds a dependency and doesn't fix social sharing

---

## 2. Target Keywords

### Primary Keywords (High Intent)

| Keyword | Est. Competition | Page |
|---------|-----------------|------|
| share password securely | Medium | Homepage |
| one-time secret sharing | Medium | Homepage |
| send credentials securely | Medium | Homepage |
| self-destructing message | Medium | Blog |
| share API key securely | Low | Blog |
| zero-knowledge secret sharing | Low | Security |
| one-time link generator | Medium | Homepage |

### Long-Tail Keywords (Blog Content)

| Keyword | Page Target |
|---------|-------------|
| how to share passwords with employees | Blog: credential-sharing-employee-onboarding |
| onetimesecret alternative | Blog: best-free-secret-sharing-tools |
| client-side encryption vs server-side | Blog: server-side-vs-client-side-encryption |
| GDPR compliant password sharing | Blog: gdpr-compliant-secret-sharing |
| self-host secret sharing docker | Blog: self-host-secret-sharing-docker |
| AES-256-GCM encryption explained | Blog: aes-256-gcm-encryption-explained |
| zero knowledge encryption how it works | Blog: what-is-zero-knowledge-encryption |
| share secret devops pipeline | Blog: devops-secret-sharing-best-practices |

### Competitor Comparison Keywords

| Keyword | Page Target |
|---------|-------------|
| onetimesecret vs privnote | New comparison page |
| best free secret sharing tools 2026 | Blog: best-free-secret-sharing-tools |
| onetimesecret alternative open source | Blog: best-free-secret-sharing-tools |
| password.link vs onetimesecret | New comparison page |

---

## 3. On-Page SEO Fixes (Quick Wins)

### A. Per-Page Canonical Tags
Each page component's `useEffect` must update `<link rel="canonical">`:
```javascript
document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://ooshare.io${location.pathname}`);
```

### B. Per-Page OG/Twitter Tags
Add OG tag updates in each page component to fix social sharing. Blog posts especially need unique `og:title`, `og:description`, and `og:url`.

### C. Hreflang Tags
Add `<link rel="alternate" hreflang="xx">` for each of the 6 supported languages. This tells Google which language version to serve in each market.

### D. Security Headers (nginx.conf)
Add to nginx.conf:
```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```
Critical for a security-focused product to practice what it preaches.

### E. Homepage Content Expansion
Add below the secret creation form:
- "How It Works" 3-step section
- Feature grid (Zero Knowledge, Auto-Delete, Open Source, 6 Languages)
- Trust signals / use case examples
- Target: 600-800 words of visible content

---

## 4. Content Strategy

### Blog Content Expansion
Every blog post averages 576 words. Target minimum: 1,500 words.

**Priority posts to expand first** (highest keyword potential):
1. `how-to-share-password-securely` (beginner guide, high search volume)
2. `best-free-secret-sharing-tools` (comparison/alternative query)
3. `complete-guide-one-time-secret-sharing` (pillar content)
4. `aes-256-gcm-encryption-explained` (technical authority)
5. `self-host-secret-sharing-docker` (DevOps audience)

**What to add per post:**
- Real-world case studies or scenarios
- Data/statistics with cited sources
- Deeper technical detail where relevant
- Step-by-step screenshots or diagrams
- Internal links to related blog posts, Security page, FAQ
- External citations to build credibility

### E-E-A-T Improvements

| Signal | Current | Action |
|--------|---------|--------|
| Experience | Weak | Add first-hand narratives ("we built this because...") |
| Expertise | Moderate | Add author bios with credentials, link to GitHub contributions |
| Authoritativeness | Weak | Get listed on AlternativeTo, Product Hunt; seek reviews |
| Trustworthiness | Moderate | Add privacy policy, terms of service, contact info |

### Internal Linking Strategy
Currently blog posts almost exclusively link to the homepage. Implement:
- Blog-to-blog cross-links (e.g., encryption post links to security architecture post)
- Blog-to-feature-page links (e.g., mentions of zero-knowledge link to `/security`)
- FAQ answers link to relevant blog posts
- Security page links to technical blog posts

---

## 5. GEO (Generative Engine Optimization)

### Current State
- robots.txt allows all AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- llms.txt present with good product documentation
- Schema markup covers WebApplication, Organization, FAQPage, BlogPosting
- **But all content is invisible due to CSR** (38/100 GEO score)

### Post-SSR Actions
Once content is crawlable:
1. **Restructure passages for citability** - Lead with direct answers in first 40-60 words of each section
2. **Convert H2s to question format** - "How Email Works" becomes "How does email transmit passwords between servers?"
3. **Add statistics with sources** - e.g., "According to Verizon's 2025 DBIR, 80% of breaches involve credentials"
4. **Create per-post OG images** - Currently all pages share one OG image
5. **Build YouTube presence** - YouTube mentions correlate ~0.737 with AI citations

### llms.txt Enhancement
Add RSL 1.0 fields:
```
License: MIT
Usage-Policy: Content may be used for AI training and search with attribution
Preferred-Citation: "Only Once Share (ooshare.io) by DHD Tech"
```

---

## 6. Technical SEO Priorities

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| P0 | Implement SSR/SSG for content pages | Critical | High |
| P0 | Fix per-page canonical tags | Critical | Low |
| P0 | Fix per-page OG/Twitter tags | Critical | Low |
| P1 | Add security headers to nginx | High | Low |
| P1 | Add hreflang tags | High | Medium |
| P1 | Fix soft 404s (return proper HTTP 404) | High | Medium |
| P2 | Implement code splitting (bundle is 973KB) | Medium | Medium |
| P2 | Add IndexNow for Bing/Yandex notification | Medium | Low |
| P2 | Self-host Inter font (avoid CLS from swap) | Low | Low |
| P3 | Add OAI-SearchBot explicit directive | Low | Low |

---

## 7. KPI Targets

| Metric | Baseline (Mar 2026) | 3 Month | 6 Month | 12 Month |
|--------|---------------------|---------|---------|----------|
| Organic Traffic | ~0 (CSR blocks indexing) | 200/mo | 1,500/mo | 5,000/mo |
| Indexed Pages | ~1 (homepage only) | 24 | 30+ | 50+ |
| Keyword Rankings (top 100) | ~0 | 30 | 80 | 150+ |
| Blog Posts >1,500 words | 0/21 | 5/21 | 15/21 | 21/21 |
| Referring Domains | Unknown (low) | +10 | +30 | +60 |
| GEO Score | 38/100 | 60/100 | 70/100 | 78/100 |

---

## Competitor Landscape

ooshare.io competes against established tools:
- **OneTimeSecret** (~372K visits/mo, 15% from organic)
- **Privnote** (~865K visits/mo, 9% from organic)
- **password.link**, **scrt.link**, **yopass.se**, **1ty.me**

**Key differentiator:** ooshare.io is one of the few that offers true **zero-knowledge, client-side encryption** (OneTimeSecret does server-side encryption). This is the primary messaging angle for content and SEO.

See [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) for detailed analysis.
