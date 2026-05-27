# Checkout UI - Spec

> **Status:** Approved
> **Author:** @FelipeQueFez
> **Created:** 2026-05-27
> **Last updated:** 2026-05-27
> **Related ADRs:** [ADR-001](../adr/ADR-001-nextjs-app-router.md) · [ADR-002](../adr/ADR-002-layered-clean-architecture.md) · [ADR-003](../adr/ADR-003-zustand-auth-state.md) · [ADR-004](../adr/ADR-004-http-client-with-bearer-injection.md) · [ADR-005](../adr/ADR-005-checkout-calculator-mirrored-from-backend.md) · [ADR-006](../adr/ADR-006-docker-multistage-standalone.md) · [ADR-007](../adr/ADR-007-unit-and-e2e-test-strategy.md) · [ADR-008](../adr/ADR-008-github-actions-monorepo-path-filters.md)

---

## 1. Overview

The Checkout UI is a Next.js 15 frontend that provides the bonus user interface for the Simple Checkout Service code challenge. It allows users to register, log in, and interactively build an item list to submit to the backend `POST /checkout` endpoint. The UI displays a live calculation preview before submission and renders the persisted order summary returned by the API. It follows the same layered clean architecture discipline as the backend and is containerised, CI-tested, and deployed via Render.

---

## 2. Goals

- Provide a registration and login flow that stores the issued JWT for subsequent authenticated requests.
- Allow authenticated users to build an item list (name, unit price, quantity) and submit a checkout to the backend.
- Display a live calculation preview (subtotal, taxes, discount, total) as the user edits items, without a network call.
- Show the persisted order summary returned by the backend after a successful checkout submission.
- Ship as a Docker image deployable to Render with a single environment variable (`NEXT_PUBLIC_API_URL`).
- Enforce the same CI quality bar as the backend: lint, unit tests, and production build must pass on every push.

## 3. Non-Goals

- A dashboard or history of past checkouts (the backend write-only MVP is the source of record).
- Password reset, email verification, or OAuth flows.
- Responsive mobile-first design beyond basic usability (Tailwind utilities only; no dedicated mobile breakpoints required for the MVP).
- Internationalisation or currency localisation.
- A fully exercised E2E suite in CI (Playwright tests are scaffolded but run manually against the hosted deployment).

---

## 4. Background & Context

The CLAUDE.md challenge specification states that a UI is not required but adds a bonus. The backend service is complete and exposes three endpoints (`POST /auth/register`, `POST /auth/login`, `POST /checkout`). This spec captures the frontend implementation that consumes those endpoints and provides a user-facing interface for the checkout workflow, including the architectural choices that mirror the backend's conventions.

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-01 | The UI MUST provide a `/register` page with email and password fields. | P0 |
| REQ-02 | On successful registration the UI MUST store the returned JWT and redirect the user to `/checkout`. | P0 |
| REQ-03 | The UI MUST provide a `/login` page with email and password fields. | P0 |
| REQ-04 | On successful login the UI MUST store the returned JWT and redirect the user to `/checkout`. | P0 |
| REQ-05 | On authentication failure the UI MUST display the error message returned by the API. | P0 |
| REQ-06 | The UI MUST provide a sign-out action that clears the stored JWT and redirects to `/login`. | P0 |
| REQ-07 | The root route `/` MUST redirect unauthenticated users to `/login` and authenticated users to `/checkout`. | P0 |

### 5.2 Checkout Form

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-08 | The `/checkout` page MUST be accessible only to authenticated users; unauthenticated access MUST redirect to `/login`. | P0 |
| REQ-09 | The UI MUST allow users to add one or more items, each with a name, unit price, and quantity. | P0 |
| REQ-10 | The UI MUST allow users to remove any individual item from the list. | P0 |
| REQ-11 | The UI MUST display a live preview of subtotal, taxes, discount, and total that updates as items are edited, without making a network request. | P0 |
| REQ-12 | The UI MUST prevent submission of a checkout with no valid items and display an inline error. | P0 |
| REQ-13 | On successful checkout submission the UI MUST display the order summary returned by the backend (id, subtotal, taxes, discount, total). | P0 |
| REQ-14 | On checkout submission failure the UI MUST display the error returned by the API. | P0 |
| REQ-15 | The submit button MUST be disabled and show a loading indicator while the request is in flight. | P1 |

### 5.3 Live Calculation Preview

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-16 | The preview MUST apply the same rules as the backend: subtotal = Σ(unit_price × quantity), taxes = 13%, discount = 10% if subtotal > 100. | P0 |
| REQ-17 | The preview MUST round all displayed values to 2 decimal places. | P0 |
| REQ-18 | The discount row MUST be hidden when the discount is zero. | P1 |

### 5.4 Observability & Deployment

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-19 | The application MUST log structured JSON in production and human-readable prefixed output in development. | P1 |
| REQ-20 | The application MUST be buildable as a Docker image that starts with a single `node server.js` command. | P0 |
| REQ-21 | CI MUST run lint, unit tests, and a production build on every push or pull request touching `frontend/**`. | P0 |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | JWT MUST NOT be sent over plain HTTP in production; `NEXT_PUBLIC_API_URL` MUST point to an HTTPS endpoint on Render. |
| Extensibility | New modules MUST follow the four-layer structure; no direct `fetch` calls from React components. |
| Portability | The Docker image MUST run with only `NEXT_PUBLIC_API_URL`, `NODE_ENV`, and `PORT` set. |
| Testability | Domain pure functions MUST be unit-testable without a browser, network, or React tree. |
| Build correctness | `npm run build` MUST succeed with zero TypeScript errors and zero ESLint errors. |

---

## 7. User Stories / Scenarios

```text
As a new user,
I want to create an account with my email and password,
So that I can access the checkout interface.
```

```text
As a returning user,
I want to log in and have my session persist across page refreshes,
So that I don't have to sign in every time I open the app.
```

```text
As an authenticated user,
I want to add multiple items with prices and quantities and see the total update instantly,
So that I can verify the order before submitting it.
```

```text
As an authenticated user with a subtotal above $100,
I want the 10% discount to be applied and clearly shown,
So that I can see the benefit before I commit to the purchase.
```

### Acceptance Criteria

- [ ] Given no stored token, when the user navigates to `/`, they are redirected to `/login`.
- [ ] Given no stored token, when the user navigates to `/checkout`, they are redirected to `/login`.
- [ ] Given a valid email and password, when the user submits the register form, they land on `/checkout` with their email shown in the header.
- [ ] Given invalid credentials, when the user submits the login form, an inline error is shown with no redirect.
- [ ] Given items summing to ≤ $100, when the user edits the list, the preview shows discount = $0.00.
- [ ] Given items summing to > $100, when the user edits the list, the preview shows discount = 10% of subtotal.
- [ ] Given a successful `POST /checkout` response, the order summary card appears below the form with the backend-returned id and totals.
- [ ] Given the user clicks Sign out, the token is cleared and they land on `/login`.
- [ ] Given an empty item list, when the user clicks Process checkout, an inline error appears and no request is sent.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
Browser
  │
  ▼
Next.js App (port 3001)
  ├── App Router pages (src/app/)
  │   ├── /              → redirect guard (client component)
  │   ├── /login         → LoginForm
  │   ├── /register      → RegisterForm
  │   └── /checkout      → CheckoutForm + CheckoutResult (auth-guarded)
  │
  ├── Feature Modules (src/modules/)
  │   ├── auth/
  │   │   ├── domain       → LoginRequest, RegisterRequest, AuthResponse
  │   │   ├── application  → login(), register(), logout()
  │   │   ├── infrastructure → loginApi(), registerApi()  ← fetch via http-client
  │   │   └── presentation → LoginForm, RegisterForm
  │   │
  │   └── checkout/
  │       ├── domain       → CheckoutItem, CheckoutResult, calculateCheckout()
  │       ├── application  → processCheckout()
  │       ├── infrastructure → processCheckoutApi()  ← fetch via http-client
  │       └── presentation → CheckoutForm, CheckoutResult
  │
  └── Shared (src/shared/)
      ├── http-client.ts   → apiRequest<T>() — injects Bearer token
      ├── logger.ts        → log(level, message, context?)
      └── auth.store.ts    → Zustand store (token, email) — persisted to localStorage

          │
          ▼
    Backend API (NEXT_PUBLIC_API_URL)
    POST /auth/register  POST /auth/login  POST /checkout
```

### 8.2 Data Model

```ts
// Auth domain
interface LoginRequest  { email: string; password: string }
interface RegisterRequest { email: string; password: string }
interface AuthResponse  { access_token: string }

// Checkout domain
interface CheckoutItem  { name: string; unitPrice: number; quantity: number }
interface CheckoutRequest { items: CheckoutItem[] }
interface CheckoutResult {
  id: string; subtotal: number; taxes: number;
  discount: number; total: number; createdAt: string
}
interface CheckoutTotals { subtotal: number; taxes: number; discount: number; total: number }

// Auth store
interface AuthState {
  token: string | null; email: string | null
  setAuth(token: string, email: string): void
  clearAuth(): void
}
```

### 8.3 API Contract (consumed)

The frontend consumes the backend API documented in [`backend/docs/specs/01-checkout-service-spec.md`](../../../backend/docs/specs/01-checkout-service-spec.md). All three endpoints are called via `apiRequest<T>` in the respective infrastructure files.

### 8.4 Key Flows

**Happy path — register and checkout:**

1. User navigates to `/` → redirected to `/login` (no token in store).
2. User clicks "Register" → navigates to `/register`.
3. User submits email + password → `POST /auth/register` → `access_token` stored in Zustand (`localStorage`).
4. User is redirected to `/checkout`.
5. User adds items; `calculateCheckout()` runs locally on every change and updates the preview.
6. User clicks "Process checkout" → `POST /checkout` with `Authorization: Bearer <token>`.
7. Backend response (id, subtotal, taxes, discount, total) rendered in the order summary card.

**Edge cases:**

- Duplicate email on register → API returns 409 → inline error shown, no redirect.
- Expired or invalid JWT on checkout → API returns 401 → `ApiError(401)` thrown → inline error shown; user should sign out and log in again.
- Empty or all-zero item list → client-side guard prevents submission, inline error shown.
- `NEXT_PUBLIC_API_URL` not set → defaults to `http://localhost:3000` (dev only).

---

## 9. Error Handling

| Scenario | Behavior | Source |
|----------|----------|--------|
| Invalid credentials on login | Inline error from `ApiError.message` | API 401 |
| Email already registered | Inline error from `ApiError.message` | API 409 |
| Empty item list on submit | Inline client-side error, no request sent | Client guard |
| API unreachable / network error | Generic "Something went wrong" message | `fetch` rejection |
| 401 on checkout (expired token) | Inline error; user must sign out and re-login | API 401 |
| Any other API error | Inline error from `ApiError.message` | API 4xx / 5xx |

---

## 10. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should a 401 on `/checkout` automatically redirect to `/login` and clear the token? | @FelipeQueFez | Open |
| 2 | Should `NEXT_PUBLIC_API_URL` be injected at runtime (server action) instead of build time to avoid rebuilding per environment? | @FelipeQueFez | Open |
| 3 | Should E2E tests run in CI against a Render preview environment on each PR? | @FelipeQueFez | Open |

---

## 11. Out of Scope / Future Work

- Checkout history page (`GET /checkout` endpoint not yet implemented in the backend).
- Automatic token refresh and 401-triggered redirect-to-login.
- Mobile-optimised layout and accessibility audit.
- Full Playwright E2E suite running in CI against a preview environment.
- CDN for static assets.
- Environment-agnostic runtime config (avoiding baked-in `NEXT_PUBLIC_*` build vars).

---

## 12. References

- [CLAUDE.md — Challenge Definition](../../../CLAUDE.md)
- [Backend Spec — Checkout Service](../../../backend/docs/specs/01-checkout-service-spec.md)
- [ADR-001 — Next.js App Router](../adr/ADR-001-nextjs-app-router.md)
- [ADR-002 — Layered Clean Architecture](../adr/ADR-002-layered-clean-architecture.md)
- [ADR-003 — Zustand Auth State](../adr/ADR-003-zustand-auth-state.md)
- [ADR-004 — HTTP Client with Bearer Injection](../adr/ADR-004-http-client-with-bearer-injection.md)
- [ADR-005 — Checkout Calculator Mirrored from Backend](../adr/ADR-005-checkout-calculator-mirrored-from-backend.md)
- [ADR-006 — Docker Multi-Stage Standalone](../adr/ADR-006-docker-multistage-standalone.md)
- [ADR-007 — Unit and E2E Test Strategy](../adr/ADR-007-unit-and-e2e-test-strategy.md)
- [ADR-008 — GitHub Actions Monorepo Path Filters](../adr/ADR-008-github-actions-monorepo-path-filters.md)
