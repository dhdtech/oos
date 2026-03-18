# Site Structure: ooshare.io

**Date:** 2026-03-18
**Architecture:** URL hierarchy, content organization, and internal linking plan.

---

## Current URL Structure

```
ooshare.io/
├── /                          # Homepage (secret creation tool)
├── /s/:id                     # Secret viewing (not indexed, blocked in robots.txt)
├── /security                  # Security architecture page
├── /about                     # About page
├── /faq                       # FAQ page (12 Q&A pairs)
├── /blog                      # Blog index
│   ├── /blog/why-email-is-not-safe-for-passwords
│   ├── /blog/what-is-zero-knowledge-encryption
│   ├── /blog/how-to-share-password-securely
│   ├── /blog/self-destructing-links-explained
│   ├── /blog/aes-256-gcm-encryption-explained
│   ├── /blog/send-api-keys-securely
│   ├── /blog/best-free-secret-sharing-tools
│   ├── /blog/server-side-vs-client-side-encryption
│   ├── /blog/self-host-secret-sharing-docker
│   ├── /blog/credential-sharing-employee-onboarding
│   ├── /blog/gdpr-compliant-secret-sharing
│   ├── /blog/devops-secret-sharing-best-practices
│   ├── /blog/complete-guide-one-time-secret-sharing
│   ├── /blog/open-source-security-transparency
│   ├── /blog/incident-response-credential-sharing
│   ├── /blog/web-crypto-api-browser-encryption
│   ├── /blog/zero-knowledge-architecture-deep-dive
│   ├── /blog/password-sharing-remote-teams
│   ├── /blog/why-self-host-secret-sharing
│   └── /blog/state-of-secret-sharing-2026
└── /*                         # 404 Not Found
```

**Total indexed pages:** 24 (5 core + 19 blog posts + blog index page not in sitemap but accessible)

---

## Proposed URL Structure (New Pages)

```
ooshare.io/
├── /                          # Homepage
├── /s/:id                     # Secret viewing (blocked)
├── /security                  # Security architecture
├── /about                     # About page (expanded with team bios)
├── /faq                       # FAQ page
├── /privacy                   # NEW: Privacy Policy
├── /terms                     # NEW: Terms of Service
├── /blog                      # Blog index
│   ├── /blog/[existing-21-posts]
│   ├── /blog/ooshare-vs-onetimesecret          # NEW: Comparison
│   ├── /blog/ooshare-vs-privnote               # NEW: Comparison
│   ├── /blog/ooshare-vs-password-link           # NEW: Comparison
│   ├── /blog/best-onetimesecret-alternatives    # NEW: Alternatives
│   ├── /blog/soc2-compliant-secret-sharing      # NEW
│   ├── /blog/hipaa-secret-sharing               # NEW
│   ├── /blog/share-api-keys-team                # NEW
│   ├── /blog/send-documents-securely            # NEW
│   ├── /blog/msp-credential-sharing             # NEW
│   ├── /blog/startup-credential-sharing          # NEW
│   ├── /blog/end-to-end-encryption-guide        # NEW
│   ├── /blog/slack-password-sharing-security     # NEW
│   └── /blog/[future posts per content calendar]
└── /*                         # 404

Static files (not indexed):
├── /robots.txt
├── /sitemap.xml
├── /llms.txt
├── /og-image.png
└── /favicon.svg
```

**Target indexed pages at 12 months:** 40-50

---

## Content Pillar Architecture

```
                    ┌─────────────────────┐
                    │     HOMEPAGE         │
                    │  Secret Creation     │
                    │  "How It Works"      │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                      │
   ┌────▼────┐          ┌────▼────┐           ┌─────▼─────┐
   │ Security │          │   FAQ   │           │   Blog    │
   │  Page    │          │  Page   │           │   Index   │
   └────┬────┘          └────┬────┘           └─────┬─────┘
        │                    │                       │
        │                    │         ┌─────────────┼─────────────────┐
        │                    │         │             │                 │
   ┌────▼────────────┐ ┌────▼───┐ ┌───▼──────┐ ┌───▼──────┐ ┌───────▼──────┐
   │ Encryption &    │ │ Links  │ │ Pillar 1 │ │ Pillar 2 │ │  Pillar 3    │
   │ ZK Deep-Dives   │ │ to     │ │ Security │ │ Teams &  │ │  Comparisons │
   │ (blog posts)    │ │ Blog   │ │ Tech     │ │ Workflow │ │  & Tools     │
   └─────────────────┘ │ Posts  │ └──────────┘ └──────────┘ └──────────────┘
                        └────────┘
```

### Pillar 1: Security & Technology
Hub: `/blog/complete-guide-one-time-secret-sharing`

| Spoke | URL |
|-------|-----|
| Zero-knowledge encryption explained | `/blog/what-is-zero-knowledge-encryption` |
| AES-256-GCM explained | `/blog/aes-256-gcm-encryption-explained` |
| Client vs server encryption | `/blog/server-side-vs-client-side-encryption` |
| Web Crypto API | `/blog/web-crypto-api-browser-encryption` |
| ZK architecture deep-dive | `/blog/zero-knowledge-architecture-deep-dive` |
| Self-destructing links | `/blog/self-destructing-links-explained` |
| Email security risks | `/blog/why-email-is-not-safe-for-passwords` |
| E2E encryption guide | `/blog/end-to-end-encryption-guide` (NEW) |

### Pillar 2: Teams & Workflows
Hub: New pillar (or expand `credential-sharing-employee-onboarding`)

| Spoke | URL |
|-------|-----|
| Employee onboarding | `/blog/credential-sharing-employee-onboarding` |
| Remote teams | `/blog/password-sharing-remote-teams` |
| DevOps practices | `/blog/devops-secret-sharing-best-practices` |
| Incident response | `/blog/incident-response-credential-sharing` |
| GDPR compliance | `/blog/gdpr-compliant-secret-sharing` |
| Send API keys | `/blog/send-api-keys-securely` |
| SOC 2 compliance | `/blog/soc2-compliant-secret-sharing` (NEW) |
| HIPAA compliance | `/blog/hipaa-secret-sharing` (NEW) |

### Pillar 3: Comparisons & Tools
Hub: `/blog/best-free-secret-sharing-tools`

| Spoke | URL |
|-------|-----|
| vs OneTimeSecret | `/blog/ooshare-vs-onetimesecret` (NEW) |
| vs Privnote | `/blog/ooshare-vs-privnote` (NEW) |
| vs password.link | `/blog/ooshare-vs-password-link` (NEW) |
| OTS Alternatives | `/blog/best-onetimesecret-alternatives` (NEW) |
| Open source benefits | `/blog/open-source-security-transparency` |
| Why self-host | `/blog/why-self-host-secret-sharing` |
| Self-host Docker guide | `/blog/self-host-secret-sharing-docker` |

### Pillar 4: Self-Hosting (Developer)
Hub: `/blog/self-host-secret-sharing-docker`

| Spoke | URL |
|-------|-----|
| Why self-host | `/blog/why-self-host-secret-sharing` |
| Open source transparency | `/blog/open-source-security-transparency` |
| State of secret sharing | `/blog/state-of-secret-sharing-2026` |

---

## Internal Linking Map

### Core Pages Cross-Links

```
Homepage  ──→  Security, FAQ, Blog, About
Security  ──→  FAQ, Blog (encryption posts), Homepage
FAQ       ──→  Security, Blog (relevant posts), Homepage
About     ──→  Security, Blog, Homepage, GitHub
Blog      ──→  All blog posts, Security, FAQ
```

### Blog Post Linking Rules

1. **Every post links to:** at least 2 other blog posts + 1 core page
2. **Pillar hubs link to:** all spokes in their cluster
3. **Spoke posts link to:** their pillar hub + 1-2 sibling spokes
4. **Comparison posts link to:** Security page + relevant technical posts
5. **Compliance posts link to:** FAQ + relevant workflow posts

### Recommended Internal Links per Post

| Post | Should Link To |
|------|---------------|
| how-to-share-password-securely | Security, complete-guide, email-security, tools comparison |
| best-free-secret-sharing-tools | vs-OTS, vs-Privnote, Security, why-self-host |
| complete-guide-one-time-secret-sharing | ALL Pillar 1 spokes, Security, FAQ |
| aes-256-gcm-encryption-explained | Security, ZK encryption, client-vs-server, Web Crypto |
| self-host-secret-sharing-docker | why-self-host, Security, open-source, DevOps |
| what-is-zero-knowledge-encryption | Security, AES-256-GCM, ZK deep-dive, complete-guide |
| gdpr-compliant-secret-sharing | FAQ, employee-onboarding, Security, remote-teams |

---

## Sitemap Structure

### Updated sitemap.xml priorities

| URL | Priority | Change Freq |
|-----|----------|-------------|
| `/` | 1.0 | weekly |
| `/security` | 0.9 | monthly |
| `/blog` | 0.9 | weekly |
| `/faq` | 0.8 | monthly |
| `/about` | 0.7 | monthly |
| `/privacy` | 0.3 | yearly |
| `/terms` | 0.3 | yearly |
| Pillar blog posts | 0.8 | monthly |
| Regular blog posts | 0.6 | yearly |
| Comparison blog posts | 0.7 | quarterly |

---

## i18n URL Strategy

### Current
Language is set via `?lng=xx` query parameter or `localStorage`. No URL-based language routing.

### Recommended (Future)
If traffic warrants, implement language-prefixed URLs:

```
ooshare.io/           # English (default)
ooshare.io/es/        # Spanish
ooshare.io/pt/        # Portuguese
ooshare.io/zh/        # Chinese
ooshare.io/hi/        # Hindi
ooshare.io/ar/        # Arabic
```

**For now:** Add hreflang tags pointing to `?lng=xx` variants:
```html
<link rel="alternate" hreflang="en" href="https://ooshare.io/" />
<link rel="alternate" hreflang="es" href="https://ooshare.io/?lng=es" />
<link rel="alternate" hreflang="pt" href="https://ooshare.io/?lng=pt" />
<link rel="alternate" hreflang="zh" href="https://ooshare.io/?lng=zh" />
<link rel="alternate" hreflang="hi" href="https://ooshare.io/?lng=hi" />
<link rel="alternate" hreflang="ar" href="https://ooshare.io/?lng=ar" />
<link rel="alternate" hreflang="x-default" href="https://ooshare.io/" />
```

---

## Schema Markup Map

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | WebApplication, Organization, WebSite |
| Security | WebPage (or TechArticle) |
| FAQ | FAQPage, WebPage |
| About | AboutPage, Organization |
| Blog Index | Blog, CollectionPage |
| Blog Post | BlogPosting (with author, dates, keywords) |
| Comparison Posts | BlogPosting + potentially Product schemas |
| Privacy/Terms | WebPage |

### Missing Schemas to Add

- **BreadcrumbList** on all pages: `Home > Blog > Post Title`
- **SiteNavigationElement** for main nav
- **VideoObject** when YouTube embeds are added
