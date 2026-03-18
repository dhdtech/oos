# SEO Strategy — Only Once Share (ooshare.io)

> Strategic SEO plan for establishing organic visibility in the secret sharing space.
> Created: March 2026

---

## 1. Executive Summary

**Only Once Share** is a free, open-source, end-to-end encrypted secret sharing platform competing in a space dominated by OneTimeSecret (est. 2011), Password.link, scrt.link, Password Pusher, and Yopass.

**Current State:** The site has zero organic visibility — it does not appear in any search results for target keywords. The sitemap contains only 1 URL (homepage), and the React SPA has no content pages for search engines to index.

**Opportunity:** The "free + open source + true zero-knowledge + no account required" positioning is unique. Most competitors either charge for advanced features or don't offer true client-side encryption. This creates a clear differentiation angle.

**Goal:** Achieve page-1 rankings for 15+ target keywords and 5,000+ monthly organic visits within 12 months.

---

## 2. Business Profile

| Attribute | Details |
|-----------|---------|
| **Product** | Secure one-time secret sharing via self-destructing links |
| **Type** | Free SaaS / Open Source Tool |
| **Domain** | ooshare.io |
| **Industry** | Cybersecurity / Developer Tools |
| **Monetization** | None currently (growth-first strategy) |
| **Languages** | 6 (EN, ZH, ES, HI, AR, PT) |
| **Deployment** | Cloud (ooshare.io) + Self-hosted (Docker) |

---

## 3. Target Audience

### Primary Segments

1. **Developers & DevOps Engineers** — Sharing API keys, tokens, credentials between team members or with clients
2. **IT Professionals** — Distributing access credentials for onboarding, support, or vendor access
3. **Security-Conscious Individuals** — Anyone who needs to share passwords without using email/Slack in plaintext
4. **Compliance-Driven Organizations** — Teams needing GDPR-compliant, zero-knowledge credential sharing

### Search Intent Profiles

| Segment | Typical Query | Intent |
|---------|--------------|--------|
| Developer | "share API key securely" | Transactional |
| IT Admin | "send password to employee safely" | Transactional |
| Security Researcher | "zero-knowledge secret sharing tool" | Informational → Transactional |
| Comparison Shopper | "onetimesecret alternatives" | Comparison |
| Self-Hoster | "open source password sharing self-hosted" | Transactional |

---

## 4. Competitive Positioning

### Unique Value Proposition

> **"The only free, open-source secret sharing tool with true zero-knowledge encryption — no accounts, no limits, no compromise."**

### Positioning Matrix

| | Free | Open Source | Client-Side E2E | No Account | Multi-Language |
|---|---|---|---|---|---|
| **ooshare.io** | Unlimited | MIT | AES-256-GCM | Yes | 6 languages |
| OneTimeSecret | Limited (100KB) | Yes | No (server-side) | Yes (limited) | Yes |
| password.link | 8/month | No | Yes | No (account) | 8 languages |
| scrt.link | Unlimited | Yes | Yes | Yes | No |
| pwpush | Self-host | Yes | No (server-side) | Yes | No |
| yopass | Unlimited | Yes | OpenPGP | Yes | No |

**Key differentiators to emphasize in all content:**
1. **True zero-knowledge** — Key never leaves the browser (vs. OTS/pwpush where server sees plaintext)
2. **Completely free** — No artificial limits (vs. password.link's 8/month, OTS's 100KB cap)
3. **6 languages** — Widest free multilingual support
4. **No account required** — Friction-free sharing
5. **Open source (MIT)** — Full transparency and self-hosting

---

## 5. Keyword Strategy

### Tier 1 — Primary Keywords (Target: Top 10)

| Keyword | Est. Monthly Volume | Competition | Current Rank | Target |
|---------|-------------------|-------------|-------------|--------|
| one-time secret | 8,000-12,000 | High | Not ranked | Top 10 |
| share password securely | 2,000-4,000 | Medium | Not ranked | Top 5 |
| self-destructing link | 1,000-2,000 | Medium | Not ranked | Top 5 |
| send password safely | 1,000-2,000 | Medium | Not ranked | Top 5 |
| secure password sharing | 2,000-4,000 | Medium-High | Not ranked | Top 10 |
| one-time link | 1,500-3,000 | Medium | Not ranked | Top 10 |

### Tier 2 — Secondary Keywords (Target: Top 20)

| Keyword | Est. Monthly Volume | Competition | Strategy |
|---------|-------------------|-------------|----------|
| onetimesecret alternative | 500-1,000 | Low-Medium | Comparison page |
| encrypted password sharing | 500-1,000 | Low | Feature page |
| zero-knowledge secret sharing | 200-500 | Low | Blog + security page |
| share API keys securely | 200-500 | Low | Use case page |
| self-destructing message | 1,000-2,000 | Medium | Blog content |
| temporary password sharing | 300-600 | Low | Feature page |
| free secret sharing tool | 300-600 | Low | Homepage + blog |

### Tier 3 — Long-Tail Keywords (Quick Wins)

| Keyword | Competition | Content Type |
|---------|-------------|-------------|
| how to share a password securely | Low | Blog/FAQ |
| best open source password sharing tool | Low | Blog |
| send credentials without email | Low | Blog/Use case |
| GDPR compliant secret sharing | Low | Security page |
| AES-256 encrypted sharing tool | Very Low | Technical blog |
| share secrets online free no account | Low | Homepage SEO |
| self-hosted secret sharing docker | Low | Docs/Blog |

### Tier 4 — Competitor Brand Keywords

| Keyword | Strategy |
|---------|----------|
| onetimesecret alternative | Comparison page + listings |
| password.link alternative | Comparison page |
| password pusher alternative | Comparison page |
| scrt.link vs onetimesecret | Comparison roundup |

---

## 6. E-E-A-T Strategy

### Experience
- Document real-world use cases (DevOps credential sharing, client onboarding, incident response)
- Publish "how we use ooshare.io" case studies
- Show the tool in action with screenshots and workflows

### Expertise
- Technical deep-dives on encryption (AES-256-GCM, HKDF, Web Crypto API)
- Security architecture documentation
- Comparison of encryption approaches across tools

### Authoritativeness
- DHD Tech organization page with team credentials
- GitHub activity and open-source contributions
- Submissions to security tool directories and roundups

### Trustworthiness
- Transparent security model (open source, auditable code)
- Clear privacy policy and data handling documentation
- Security.txt and responsible disclosure process
- No tracking of secret content (document analytics privacy measures)

---

## 7. Technical SEO Requirements

### Critical Fixes (Week 1-2)

1. **Server-Side Rendering or Pre-rendering** — The React SPA currently renders an empty `<div id="root">`. Search engines may not index content. Options:
   - **Pre-rendering** (recommended): Use `vite-plugin-ssr` or a prerender step to generate static HTML for key pages
   - **SSR**: Migrate to Next.js or Remix (higher effort)
   - **Dynamic rendering**: Serve pre-rendered HTML to crawlers via middleware

2. **Expand sitemap.xml** — Currently only contains `/`. Must include all new content pages, updated with proper `lastmod`, `changefreq`, and `priority` values.

3. **Add robots.txt directives** for new content sections while keeping `/s/` blocked.

### Schema Markup Plan

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | WebApplication + WebSite + Organization + FAQPage |
| Security Page | TechArticle + WebApplication |
| Blog Posts | Article + BlogPosting |
| Comparison Pages | WebPage + FAQPage |
| About Page | Organization + AboutPage |
| FAQ Page | FAQPage |
| How-To Guides | HowTo |

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Optimize hero content, preload critical assets |
| INP | < 200ms | Minimize JS bundle, defer non-critical scripts |
| CLS | < 0.1 | Set explicit dimensions on images/embeds |

### AI Search Readiness

- [ ] Add `llms.txt` file at root describing the tool for AI crawlers
- [ ] Ensure GPTBot, ClaudeBot, PerplexityBot are allowed in robots.txt
- [ ] Structure content with clear, quotable passages for AI citations
- [ ] Use definition-style paragraphs that AI can extract and cite

---

## 8. KPI Targets

| Metric | Baseline (Mar 2026) | 3 Month | 6 Month | 12 Month |
|--------|---------------------|---------|---------|----------|
| Organic Traffic | ~0 | 500/mo | 2,000/mo | 5,000+/mo |
| Indexed Pages | 1 | 15 | 30 | 50+ |
| Keywords Top 100 | 0 | 25 | 75 | 150+ |
| Keywords Top 10 | 0 | 3 | 10 | 20+ |
| Domain Authority | 0 | 10 | 20 | 30+ |
| Backlinks | ~0 | 25 | 75 | 200+ |
| Core Web Vitals | Unknown | All Green | All Green | All Green |
| AI Citations | 0 | 1-2 | 5+ | 10+ |

---

## 9. Link Building Strategy

### Phase 1 — Directory Submissions (Months 1-2)
- AlternativeTo.net (list as OTS alternative)
- SaaSHub (create product listing)
- Product Hunt launch
- GitHub Awesome lists (awesome-selfhosted, awesome-security)
- DevOps tool directories

### Phase 2 — Content-Driven Links (Months 3-6)
- Reach out to "best secret sharing tools" roundup authors for inclusion
- Guest posts on cybersecurity blogs
- Technical deep-dives on dev.to, Hashnode, Medium
- Submit to Hacker News, Reddit r/selfhosted, r/cybersecurity

### Phase 3 — Authority Building (Months 7-12)
- Security conference talks/presentations
- Partnership mentions with complementary tools
- Open-source community engagement
- Press coverage for security-focused stories

---

## 10. International SEO Strategy

With 6 languages already supported, leverage this competitive advantage:

### Implementation
- Use `?lng=xx` parameter with `rel="alternate" hreflang` tags
- Consider subdirectory approach (`/es/`, `/zh/`, etc.) for better crawlability
- Create localized sitemap entries for each language variant
- Translate key content pages (not just the app interface)

### Priority Markets
1. **English** (US, UK, AU, CA) — Primary market, highest competition
2. **Spanish** (ES, LATAM) — Underserved market, low competition
3. **Portuguese** (BR, PT) — Growing tech market
4. **Chinese** (CN, TW) — Large market but unique challenges (GFW)
5. **Hindi** (IN) — Rapidly growing developer market
6. **Arabic** (ME, NA) — Niche but zero competition

---

## 11. Success Criteria

### 3-Month Milestones
- [ ] 15+ pages indexed in Google
- [ ] Appearing in search results for 3+ target keywords
- [ ] Listed on AlternativeTo, SaaSHub, and Product Hunt
- [ ] Blog launched with 5+ posts
- [ ] All Core Web Vitals passing

### 6-Month Milestones
- [ ] 2,000+ monthly organic visits
- [ ] Top 10 ranking for 5+ keywords
- [ ] 3+ comparison pages ranking
- [ ] Featured in 2+ "best tools" roundups
- [ ] 50+ referring domains

### 12-Month Milestones
- [ ] 5,000+ monthly organic visits
- [ ] Top 5 ranking for primary keywords
- [ ] DA 30+
- [ ] Appearing in AI search results (Google AI Overviews, ChatGPT, Perplexity)
- [ ] Recognized as a top-5 tool in the category

---

## 12. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| SPA rendering blocks indexing | Critical | Implement pre-rendering in Phase 1 |
| OneTimeSecret brand dominance | High | Focus on differentiation (free, zero-knowledge, multilingual) |
| Low domain authority | High | Aggressive link building + directory submissions |
| Content quality vs. competitors | Medium | Focus on technical depth and unique data |
| Algorithm changes | Medium | Diversify traffic sources (direct, referral, social) |
| Competitor SEO response | Low | First-mover advantage on underserved keywords |
