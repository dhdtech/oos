# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Only Once Share (ooshare.io) — a zero-knowledge, one-time secret sharing service. Secrets are encrypted client-side with AES-256-GCM before being stored; the server never sees plaintext. Secrets are atomically deleted on first retrieval.

## Architecture

Monorepo with two services orchestrated via Docker Compose:

- **UI** (`ui/`): React 19 + TypeScript + Vite 6. Pure CSS with custom properties (no Tailwind). Served via Nginx in production.
- **API** (`api/`): Python 3.12 + Flask 3.1 + Gunicorn. 3 endpoints: `POST /api/secrets`, `GET /api/secrets/{id}`, `GET /api/health`.
- **Redis**: Storage backend with TTL-based auto-expiry. Atomic `GETDEL` ensures one-time retrieval.

Client-side encryption lives in `ui/src/lib/crypto.ts` — AES-256-GCM with HKDF-SHA-256 key derivation, AAD binding to secret ID, and a versioned ciphertext format. The master key travels only in the URL fragment (never sent to server).

## Development Commands

```bash
make up              # Start all containers (docker compose up --build)
make down            # Stop all containers
make build           # Rebuild containers
make logs            # Tail logs
make test            # API tests with coverage (99% threshold)
make ui-test         # UI tests with coverage (99% threshold)
make test-all        # Run all tests
```

Local URLs: UI at `http://localhost:8080`, API at `http://localhost:5000`.

### Running tests directly (without Docker)

```bash
# API (requires Redis running on :6379)
cd api && pytest test_app.py -v --cov=app --cov-report=term-missing --cov-fail-under=99

# UI
cd ui && npx vitest run --coverage --coverage.thresholds.lines=99

# Single UI test file
cd ui && npx vitest run src/test/SomeFile.test.tsx
```

## CI

GitHub Actions (`.github/workflows/ci.yaml`) runs on PRs to `main`. Both API and UI tests must pass with **99% coverage** minimum.

## i18n

Uses i18next with 6 languages: en, zh, es, hi, ar, pt. Translation files in `ui/src/i18n/locales/`. Blog content translations in `ui/src/content/blog/`. Language detection order: URL `?lng=xx` → localStorage → browser.

## Key Files

- `ui/src/lib/crypto.ts` — AES-256-GCM encryption/decryption, HKDF key derivation
- `ui/src/lib/api.ts` — API client (fetch wrapper)
- `api/app.py` — Entire Flask backend (~190 LOC)
- `api/test_app.py` — API tests with mocked Redis/PostHog
- `ui/src/pages/` — Page components (CreateSecret, ViewSecret, Security, About, FAQ, Blog, BlogPost)
- `ui/src/components/` — Layout, LanguageSelector, SecurityModal
- `docker-compose.yml` — Dev environment orchestration

## Conventions

- UI uses React Router for SPA routing; Nginx handles production fallback to `index.html`
- Secret IDs support both UUIDs and 8-char base62 aliases
- PostHog analytics is optional (env var `POSTHOG_API_KEY` on API, `VITE_POSTHOG_KEY` on UI)
- Ciphertext format: `[version 1B][iv 12B][ciphertext+tag]`, base64-encoded
- API enforces 100KB max payload on secret creation
