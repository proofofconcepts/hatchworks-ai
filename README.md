# Simple Checkout Service — Code Challenge

> **Reviewer note:** This README is the entry point for evaluating this submission. It covers what was built, why each decision was made, and how to run everything. The full decision trail lives in the ADR directories linked below.

---

## Live Demo

Both services are deployed on **Render**.

| | URL |
|---|---|
| **Frontend** | https://hatchworks-ai-frontend.onrender.com |
| **Backend API (Swagger)** | https://hatchworks-ai.onrender.com/api/docs |

> Render free-tier services spin down after inactivity — the first request may take 30–60 seconds to cold-start.

---

## Implementation Summary

### Claude Workflow
| Area | Items |
|---|---|
| Skills | `/create-adr`, `/create-spec`, `/create-new-module-backend`, `/create-new-component-frontend` |
| Agents | `/code-review`, `/deploy`, `/doc-updater`, `/test-writer` |
| Docs | Spec, ADRs, and `CLAUDE.md` |

### Backend
| Area | Choice |
|---|---|
| Framework | NestJS 11 |
| Architecture | Clean / layered (domain → application → infrastructure → presentation) |
| Authentication | JWT with global guard + `@Public()` opt-out, bcrypt password hashing |
| Unit tests | Jest — domain layer only (`calculateCheckout`) |
| CI | GitHub Actions (lint → test → build, path-filtered to `backend/**`) |
| Deployment | Render (Docker web service) |
| ORM | Prisma 5 with `DECIMAL(10,2)` for monetary fields |
| Migrations | `prisma migrate deploy` runs automatically on container startup |
| Persistence abstraction | Repository pattern — `ICheckoutRepository` interface + Symbol DI token |
| Containerisation | Docker multi-stage build + Docker Compose for local database |
| Logger | Structured logger — human-readable in dev, JSON in prod |
| API docs | Swagger / OpenAPI auto-generated at `/api/docs` |
| Config | `.env` with `@nestjs/config`, validated on startup |

### Frontend _(bonus)_
| Area | Choice |
|---|---|
| Framework | Next.js 15 (App Router, `output: standalone`) |
| Architecture | Clean / layered — mirrors backend structure; no `fetch` in components |
| CI | GitHub Actions (lint → test → build, path-filtered to `frontend/**`) |
| Deployment | Render (Docker web service) |
| Unit tests | Jest + ts-jest |
| E2E tests | Playwright (runs against deployed instance, not in CI) |
| Styling | Tailwind CSS 3 |
| State | Zustand — persisted auth store, form stores (no component `useState`) |
| Containerisation | Docker multi-stage, Next.js standalone output |
| Logger | Structured logger — matches backend pattern |
| Config | `NEXT_PUBLIC_API_URL` environment variable |

---

## What Was Asked

Build a lightweight backend checkout service with a single `POST /checkout` endpoint that:

- Calculates subtotal, taxes (13%), discount (10% if subtotal > 100), and total
- Persists each checkout transaction
- Is protected by authentication
- Runs reliably in containers

A UI was listed as optional bonus work.

---

## What Was Delivered

| Requirement | Status | Notes |
|---|---|---|
| `POST /checkout` with correct calculation | ✅ | Pure function domain layer, named constants for rates |
| Persistence layer | ✅ | PostgreSQL 16 via Prisma, `DECIMAL(10,2)` for monetary fields |
| Authentication | ✅ | JWT, global guard, `@Public()` opt-out |
| Containerisation | ✅ | Docker multi-stage build, Docker Compose for local DB |
| Bonus UI | ✅ | Next.js 15 frontend with auth, checkout form, and order summary |

---

## Repository Layout

```
.
├── backend/          NestJS API — the challenge core
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         Registration, login, JWT strategy
│   │   │   └── checkout/     Domain, application, infrastructure, presentation layers
│   │   └── shared/           Global guard, decorators, Prisma module, exception filter
│   ├── prisma/               Schema and migration history
│   ├── test/unit/            Jest unit tests (domain layer only)
│   ├── docs/adr/             8 Architecture Decision Records
│   └── docs/specs/           Feature specification
│
└── frontend/         Next.js 15 UI — bonus
    ├── src/
    │   ├── app/              App Router pages (/, /login, /register, /checkout)
    │   ├── modules/          Auth and checkout feature modules (same layered structure)
    │   └── shared/           HTTP client, logger, Zustand stores
    ├── test/
    │   ├── unit/             Jest unit tests
    │   └── e2e/              Playwright tests
    ├── docs/adr/             8 Architecture Decision Records
    └── docs/specs/           Frontend feature specification
```

---

## Backend — Architecture Decisions

The backend follows a **DDD-inspired four-layer module structure** applied consistently across every feature: `domain → application → infrastructure → presentation`. Each layer has a single responsibility and strict dependency direction.

### Key decisions and their rationale

**NestJS as the framework** ([ADR-001](backend/docs/adr/ADR-001-nestjs-as-backend-framework.md))  
Provides TypeScript-first DI, global `ValidationPipe`, and automatic Swagger generation. The boilerplate is disproportionate for a single-endpoint service but acceptable given the extensibility requirement — a second module follows zero additional conventions.

**Layered architecture** ([ADR-002](backend/docs/adr/ADR-002-modular-layered-architecture.md))  
Business rules, persistence, and HTTP concerns are separated into distinct layers. Changing the tax rate, adding a tier, or swapping PostgreSQL for a different store each require touching exactly one layer. The cost is more files than a flat structure.

**JWT with a global guard and `@Public()` opt-out** ([ADR-003](backend/docs/adr/ADR-003-jwt-authentication-global-guard.md))  
Routes are protected by default. A developer must consciously decorate a route with `@Public()` to expose it — this prevents accidental exposure of future endpoints. Passwords are bcrypt-hashed (cost 12); plain-text is never stored.

**Prisma + PostgreSQL with `DECIMAL(10,2)`** ([ADR-004](backend/docs/adr/ADR-004-prisma-orm-postgresql.md))  
Monetary values are stored as `DECIMAL(10,2)` rather than `float` to eliminate floating-point rounding errors at the database level. Prisma migrations provide a reproducible schema history. Any breaking schema change surfaces immediately as a TypeScript compile error.

**Repository pattern with a Symbol DI token** ([ADR-005](backend/docs/adr/ADR-005-repository-pattern-with-interface.md))  
The application service depends on `ICheckoutRepository` (a domain interface), not on Prisma. Swapping the persistence layer or substituting an in-memory stub in tests requires no changes to the service. `CheckoutMapper` is the single conversion boundary between ORM types and domain types.

**Pure function for business rules** ([ADR-006](backend/docs/adr/ADR-006-pure-function-checkout-business-rules.md))  
`calculateCheckout()` is a side-effect-free function in the domain layer. Tax rate, discount rate, and threshold are named constants. The function is the only thing unit-tested — it's the only thing with real logic. Rounding is applied once at the output boundary to avoid compounding errors.

**Docker multi-stage build, migrations on startup** ([ADR-007](backend/docs/adr/ADR-007-docker-multistage-build-and-compose.md))  
The production image contains only compiled output, the Prisma client, and production `node_modules`. Migrations run automatically via `prisma migrate deploy && node dist/main.js` — the command is idempotent, so restarts are safe. Docker Compose manages only the database for local development.

**Unit tests for domain only** ([ADR-008](backend/docs/adr/ADR-008-unit-test-strategy.md))  
Controllers and services are trivial orchestration; their test value is low relative to the maintenance cost. `calculateCheckout` encapsulates all the meaningful logic and is fully exercised in `test/unit/`. Tests live outside `src/` to keep build output clean.

### Business Rules

| Field | Formula |
|---|---|
| `subtotal` | Σ(`unit_price × quantity`) |
| `taxes` | 13% of subtotal |
| `discount` | 10% of subtotal if subtotal > 100, else 0 |
| `total` | subtotal + taxes − discount |

All monetary values rounded to two decimal places at the output boundary.

---

## Frontend — Architecture Decisions

The frontend mirrors the backend's layered architecture discipline. Every feature module has the same four-layer structure. The same clean-architecture rules apply: no `fetch` calls from React components, no business logic in components.

**Next.js 15 App Router** ([ADR-001](frontend/docs/adr/ADR-001-nextjs-app-router.md))  
`output: 'standalone'` produces a self-contained Node.js server suitable for Docker without a separate static CDN.

**Layered clean architecture** ([ADR-002](frontend/docs/adr/ADR-002-layered-clean-architecture.md))  
The same domain/application/infrastructure/presentation split as the backend. React components are pure presentation — they read from stores and call store actions; no direct API calls, no business logic.

**Zustand with localStorage persistence** ([ADR-003](frontend/docs/adr/ADR-003-zustand-auth-state.md))  
The auth store (token + email) is persisted to `localStorage` so sessions survive page refreshes. All other mutable state (form fields, loading, errors, result) lives in per-feature Zustand stores. No component uses `useState`.

**Centralised HTTP client with automatic Bearer injection** ([ADR-004](frontend/docs/adr/ADR-004-http-client-with-bearer-injection.md))  
`apiRequest<T>()` reads the token from the auth store on every call and injects `Authorization: Bearer <token>`. Components and services never handle tokens directly. A typed `ApiError` is thrown on non-2xx responses for consistent error handling.

**Backend as the source of truth for calculation** (supersedes ADR-005)  
The frontend has no local calculator. When the user submits the checkout form, the request goes to `POST /checkout`. The backend calculates, persists, and returns the result. This eliminates duplicated business logic and makes the backend the single source of truth for tax and discount rules.

**Docker multi-stage with standalone output** ([ADR-006](frontend/docs/adr/ADR-006-docker-multistage-standalone.md))  
The production image copies only `.next/standalone`, static assets, and `public/`. No `node_modules` or source files. Started with `node server.js`.

**Jest for unit tests, Playwright for E2E** ([ADR-007](frontend/docs/adr/ADR-007-unit-and-e2e-test-strategy.md))  
Unit tests cover pure domain functions. Playwright E2E tests cover the full auth and checkout flows and are designed to run against a deployed instance, not in CI against a local server.

---

## Running the Project

### Prerequisites

- Node.js 20+, npm 10+
- Docker and Docker Compose

### Backend

```bash
cd backend
npm install
cp .env.example .env          # defaults work out of the box with Docker Compose
docker compose up -d          # start PostgreSQL
npx prisma migrate deploy     # apply migrations
npm run start:dev             # API at http://localhost:3000
                              # Swagger at http://localhost:3000/api/docs
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # set NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev                   # UI at http://localhost:3001
```

### Docker (both services, production-like)

Build context is the repository root for both images:

```bash
# Backend
docker build -f backend/Dockerfile -t checkout-service .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://checkout_user:checkout_pass@localhost:5432/checkout_db \
  -e JWT_SECRET=your-secret-at-least-32-chars \
  -e JWT_EXPIRATION=24h \
  checkout-service

# Frontend
docker build -f frontend/Dockerfile -t checkout-frontend .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  checkout-frontend
```

---

## Testing

```bash
# Backend — unit tests (pure domain logic)
cd backend && npm test

# Frontend — unit tests
cd frontend && npm test

# Frontend — E2E (requires both services running)
cd frontend && npx playwright install chromium
cd frontend && npm run test:e2e
```

---

## API Quick Reference

### `POST /auth/register` · `POST /auth/login`

```json
{ "email": "user@example.com", "password": "secret123" }
→ { "access_token": "<JWT>" }
```

### `POST /checkout` _(requires `Authorization: Bearer <JWT>`)_

```json
{
  "items": [{ "name": "Widget", "unit_price": 60.00, "quantity": 2 }]
}
→
{
  "id": "<uuid>",
  "subtotal": 120.00,
  "taxes": 15.60,
  "discount": 12.00,
  "total": 123.60,
  "createdAt": "2026-05-27T..."
}
```

---

## Further Reading

| Area | Path |
|---|---|
| Backend ADRs | [`backend/docs/adr/`](backend/docs/adr/) |
| Backend spec | [`backend/docs/specs/01-checkout-service-spec.md`](backend/docs/specs/01-checkout-service-spec.md) |
| Frontend ADRs | [`frontend/docs/adr/`](frontend/docs/adr/) |
| Frontend spec | [`frontend/docs/specs/01-checkout-ui-spec.md`](frontend/docs/specs/01-checkout-ui-spec.md) |
| Backend README | [`backend/README.md`](backend/README.md) |
| Frontend README | [`frontend/README.md`](frontend/README.md) |
