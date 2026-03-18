# Implementation Roadmap: SEO for ooshare.io

**Date:** 2026-03-18
**Duration:** 12 months (4 phases)

---

## Phase 1: Foundation (Weeks 1-4)

**Goal:** Fix critical technical blockers that prevent any SEO progress.

### Week 1-2: Fix Rendering Architecture

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Implement SSG/pre-rendering for content pages (`/blog/*`, `/faq`, `/security`, `/about`) | P0 | High | Build config, page components |
| Ensure pre-rendered HTML includes correct `<title>`, `<meta description>`, `<link canonical>`, OG tags per page | P0 | Medium | Page components |
| Fix soft 404s - return HTTP 404 for non-existent routes | P1 | Medium | nginx.conf or SSR framework |
| Implement code splitting - separate blog content from main bundle | P2 | Medium | vite.config.ts |

### Week 2-3: Fix Meta Tags & Canonical

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Add per-page canonical tag updates in each page component | P0 | Low | All page components in `ui/src/pages/` |
| Add per-page OG tag updates (og:title, og:description, og:url) | P0 | Low | All page components |
| Add per-page Twitter card updates | P0 | Low | All page components |
| Add hreflang tags for 6 languages | P1 | Medium | Layout component or SSR template |
| Remove `<meta name="keywords">` tag (ignored by Google since 2009) | P3 | Low | `ui/index.html` |
| Shorten meta description to <155 chars | P3 | Low | `ui/index.html` |

### Week 3-4: Security Headers & Technical

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Add security headers to nginx.conf (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) | P1 | Low | `ui/nginx.conf` |
| Add `server_tokens off;` to nginx.conf | P3 | Low | `ui/nginx.conf` |
| Add `OAI-SearchBot` explicit Allow directive to robots.txt | P3 | Low | `ui/public/robots.txt` |
| Enhance llms.txt with RSL 1.0 fields | P3 | Low | `ui/public/llms.txt` |
| Verify llms.txt is served correctly (not SPA shell) | P2 | Low | Test curl |

### Week 4: Verification

- [ ] Run Google Rich Results Test on blog posts and FAQ
- [ ] Verify per-page canonical tags with `curl -s URL | grep canonical`
- [ ] Test social sharing previews (Twitter card validator, Facebook debugger)
- [ ] Submit updated sitemap to Google Search Console
- [ ] Verify security headers with securityheaders.com

**Phase 1 Success Criteria:**
- All 24 pages have unique canonical URLs
- All 24 pages have unique OG tags
- Blog posts and FAQ have crawlable structured data
- Security headers score A+ on securityheaders.com
- Google Search Console shows 24+ indexed pages (may take 2-4 weeks to reflect)

---

## Phase 2: Content Expansion (Weeks 5-12)

**Goal:** Transform thin content into comprehensive, authoritative resources.

### Weeks 5-8: Expand Top 10 Blog Posts

Expand each from ~576 words to 1,500-2,500 words:

| Post | Current Words | Target Words | Priority |
|------|-------------|-------------|----------|
| how-to-share-password-securely | ~570 | 1,800 | P0 |
| best-free-secret-sharing-tools | ~550 | 2,500 | P0 |
| complete-guide-one-time-secret-sharing | ~590 | 3,000 | P0 |
| aes-256-gcm-encryption-explained | ~760 | 2,000 | P1 |
| self-host-secret-sharing-docker | ~530 | 2,000 | P1 |
| what-is-zero-knowledge-encryption | ~550 | 2,000 | P1 |
| gdpr-compliant-secret-sharing | ~500 | 2,000 | P1 |
| devops-secret-sharing-best-practices | ~540 | 2,000 | P2 |
| server-side-vs-client-side-encryption | ~530 | 2,000 | P2 |
| web-crypto-api-browser-encryption | ~510 | 2,000 | P2 |

### Weeks 5-8: New Pages

| Page | Type | Target |
|------|------|--------|
| Privacy Policy (`/privacy`) | Legal | Required for E-E-A-T trust |
| Terms of Service (`/terms`) | Legal | Required for E-E-A-T trust |
| Add contact email to About page | Trust signal | Improves E-E-A-T |
| Add team bios/credentials to About page | E-E-A-T | Author expertise signals |

### Weeks 9-12: New Blog Content + Comparison Pages

| Content | Type | Target Keyword |
|---------|------|---------------|
| "ooshare vs OneTimeSecret" | Comparison | "onetimesecret alternative" |
| "ooshare vs Privnote" | Comparison | "privnote alternative" |
| Expand remaining 11 blog posts to 1,500+ words | Expansion | Various |
| Add architecture diagram (SVG) to Security page | Visual | Technical trust |

### Weeks 9-12: Internal Linking Overhaul

- Add 3+ internal links per blog post
- FAQ answers link to relevant blog posts
- Security page links to encryption/ZK blog posts
- Blog posts cross-reference each other by topic cluster

**Phase 2 Success Criteria:**
- All 21 blog posts exceed 1,500 words
- 2 new comparison pages live
- Privacy policy and terms pages live
- Internal links: 3+ per blog post
- About page has team credentials

---

## Phase 3: Scale (Weeks 13-24)

**Goal:** Create new content, build backlinks, optimize for AI search.

### Content Creation (2 new posts/month)

See [CONTENT-CALENDAR.md](CONTENT-CALENDAR.md) for detailed schedule.

### Backlink Building

| Action | Timeline | Expected Links |
|--------|----------|---------------|
| Submit to awesome-selfhosted GitHub list | Week 13 | 1 high-quality |
| Submit to AlternativeTo.net | Week 13 | 1 + user reviews |
| Submit to SaaSHub | Week 14 | 1 |
| Post on r/selfhosted, r/privacy (genuine value) | Week 14-16 | Community links |
| Post on Hacker News (Show HN) | Week 15 | Potential viral |
| Create Docker Hub listing with proper description | Week 16 | 1 |
| Submit to Product Hunt | Week 18 | 1 + coverage |
| Guest post on security blogs | Weeks 16-24 | 2-4 |

### GEO Optimization

| Action | Timeline | Impact |
|--------|----------|--------|
| Restructure blog passages for citability (40-60 word leading answers) | Weeks 13-16 | High |
| Convert H2s to question format where natural | Weeks 13-16 | Medium |
| Add statistics with cited sources to all posts | Weeks 13-20 | High |
| Create YouTube walkthrough video | Week 16 | High (0.737 citation correlation) |
| Per-post OG images | Weeks 18-24 | Medium |

### Performance Optimization

| Action | Timeline | Impact |
|--------|----------|--------|
| Implement IndexNow for Bing/Yandex | Week 14 | Medium |
| Self-host Inter font (eliminate CLS) | Week 15 | Low |
| Optimize LCP via SSR/SSG (already done in Phase 1) | Verified | N/A |
| Add resource hints (preconnect, prefetch) | Week 16 | Low |

**Phase 3 Success Criteria:**
- 6 new blog posts published
- 5+ new referring domains
- Listed on AlternativeTo, SaaSHub, awesome-selfhosted
- YouTube video published
- Google Search Console: 1,000+ organic impressions/month
- All blog passages restructured for AI citability

---

## Phase 4: Authority (Months 7-12)

**Goal:** Establish ooshare.io as the go-to resource for secret sharing knowledge.

### Content

- Continue 2 posts/month cadence
- Begin publishing annual "State of Secret Sharing" report
- Develop compliance-specific content (HIPAA, PCI DSS, SOC 2)
- Create interactive tools (encryption strength calculator, security assessment)

### Authority Building

- Seek security publication features/reviews
- Engage in security communities (OWASP, security forums)
- Consider conference talks or webinars on zero-knowledge architecture
- Build email newsletter from blog readers

### Advanced Technical SEO

- Implement video schema for YouTube embeds
- Add BreadcrumbList schema for navigation
- Consider AMP or instant loading for blog posts
- A/B test meta titles and descriptions based on CTR data from Search Console

**Phase 4 Success Criteria:**
- 5,000+ organic visits/month
- 50+ referring domains
- Top 10 ranking for at least 5 target keywords
- AI search engines citing ooshare.io content
- GEO score: 78/100

---

## Resource Requirements

| Phase | Dev Effort | Content Effort | External Cost |
|-------|-----------|---------------|---------------|
| Phase 1 | 2-3 weeks full-time | Minimal | $0 |
| Phase 2 | 1 week | 6-8 weeks writing | $0 (or content writer budget) |
| Phase 3 | 2-3 days/month | 4-6 weeks writing | Product Hunt launch costs, optional guest post outreach |
| Phase 4 | 1-2 days/month | 4-6 weeks writing | Optional: conference, video production |

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| SSR migration breaks existing functionality | Medium | Keep `/` and `/s/:id` as CSR; only SSG content pages |
| Content expansion doesn't rank | Medium | Focus on long-tail keywords first; build topical authority before targeting head terms |
| Competitors respond with content | Low | First-mover advantage in zero-knowledge education; multi-language moat |
| Google algorithm update | Medium | Focus on genuine E-E-A-T rather than gaming; diversify with AI search readiness |
| Limited dev resources | High | Phase 1 is the only phase requiring significant dev work; rest is content |
