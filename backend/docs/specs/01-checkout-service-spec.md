# Checkout Service - Spec

> **Status:** Approved
> **Author:** @FelipeQueFez
> **Created:** 2026-05-27
> **Last updated:** 2026-05-27
> **Related ADRs:** [ADR-001](../adr/ADR-001-nestjs-as-backend-framework.md) · [ADR-002](../adr/ADR-002-modular-layered-architecture.md) · [ADR-003](../adr/ADR-003-jwt-authentication-global-guard.md) · [ADR-004](../adr/ADR-004-prisma-orm-postgresql.md) · [ADR-005](../adr/ADR-005-repository-pattern-with-interface.md) · [ADR-006](../adr/ADR-006-pure-function-checkout-business-rules.md) · [ADR-007](../adr/ADR-007-docker-multistage-build-and-compose.md)

---

## 1. Overview

The Checkout Service is a lightweight backend MVP for an early-stage commerce workflow. It exposes a single authenticated `POST /checkout` endpoint that receives a list of items, applies deterministic pricing rules (subtotal, 13% tax, 10% discount on orders above $100), persists the resulting checkout record against the authenticated user, and returns the calculated totals. The service is containerized, stateless, and designed to be extended as business rules evolve.

---

## 2. Goals

- Expose a `POST /checkout` endpoint that computes subtotal, taxes, discount, and total from a list of items.
- Protect all business endpoints behind JWT authentication.
- Persist every checkout transaction (with its line items) to a relational database so the record is auditable.
- Package the service with Docker so it runs identically across local, CI, and production environments.
- Keep business rule logic isolated and easy to modify without touching infrastructure or transport concerns.

## 3. Non-Goals

- A frontend or consumer-facing UI (out of scope for this iteration).
- Token refresh, token revocation, or session management beyond the initial JWT issuance.
- Retrieval or listing of past checkout records (write-only in the MVP).
- Multi-currency support, regional tax tables, or configurable discount tiers (future work).
- Rate limiting, quotas, or advanced API gateway concerns.

---

## 4. Background & Context

This service was built as a code challenge to demonstrate sound API design, extensible business logic, persistence, authentication, and containerized deployment. The requirements specify clarity and correctness over completeness, with an explicit expectation that tax rates and discount tiers may change. The implementation decisions are recorded in the seven ADRs referenced above.

---

## 5. Functional Requirements

### 5.1 Authentication

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| REQ-01 | The system MUST allow anonymous users to register via `POST /auth/register` with an email and password. | P0 |
| REQ-02 | The system MUST return a JWT `access_token` upon successful registration.                             | P0 |
| REQ-03 | The system MUST allow registered users to authenticate via `POST /auth/login` with email and password. | P0 |
| REQ-04 | The system MUST return a JWT `access_token` upon successful login.                                    | P0 |
| REQ-05 | The system MUST reject login attempts with invalid credentials with HTTP 401.                         | P0 |
| REQ-06 | The system MUST reject registration attempts for an already-registered email with HTTP 409.           | P0 |
| REQ-07 | Passwords MUST be hashed with bcrypt before storage; the plain-text password MUST never be persisted. | P0 |
| REQ-08 | All endpoints except `/auth/register` and `/auth/login` MUST require a valid Bearer JWT.             | P0 |

### 5.2 Checkout Calculation

| ID     | Requirement                                                                                                      | Priority |
|--------|------------------------------------------------------------------------------------------------------------------|----------|
| REQ-09 | The system MUST accept a `POST /checkout` request body containing a non-empty array of items.                    | P0 |
| REQ-10 | Each item MUST include `name` (string), `unit_price` (positive number), and `quantity` (positive integer).       | P0 |
| REQ-11 | The system MUST compute `subtotal` as the sum of `unit_price × quantity` across all items.                       | P0 |
| REQ-12 | The system MUST compute `taxes` as 13% of `subtotal`.                                                            | P0 |
| REQ-13 | The system MUST compute `discount` as 10% of `subtotal` when `subtotal > 100`, and 0 otherwise.                  | P0 |
| REQ-14 | The system MUST compute `total` as `subtotal + taxes - discount`.                                                | P0 |
| REQ-15 | All monetary output values MUST be rounded to two decimal places.                                                | P0 |
| REQ-16 | The system MUST reject a request with an empty `items` array with HTTP 400.                                      | P0 |
| REQ-17 | The system MUST reject requests with extra unknown fields with HTTP 400.                                          | P1 |

### 5.3 Persistence

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| REQ-18 | The system MUST persist each checkout transaction to the database before returning the response.      | P0 |
| REQ-19 | Each persisted `Checkout` record MUST store `subtotal`, `taxes`, `discount`, `total`, and a reference to the authenticated user. | P0 |
| REQ-20 | Each persisted `CheckoutItem` record MUST store `name`, `unit_price`, `quantity`, and `line_total`.  | P0 |
| REQ-21 | Monetary database columns MUST use `DECIMAL(10,2)` to avoid floating-point precision loss.           | P0 |
| REQ-22 | Deleting a `User` MUST cascade-delete their associated `Checkout` and `CheckoutItem` records.        | P1 |

### 5.4 Observability & API Documentation

| ID     | Requirement                                                                                          | Priority |
|--------|------------------------------------------------------------------------------------------------------|----------|
| REQ-23 | The service MUST expose an OpenAPI (Swagger) UI at `GET /api/docs`.                                  | P1 |
| REQ-24 | The service SHOULD emit structured log output for request lifecycle events and errors.                | P1 |

---

## 6. Non-Functional Requirements

| Category       | Requirement                                                                                    |
|----------------|------------------------------------------------------------------------------------------------|
| Security       | All endpoints except auth routes MUST be protected by JWT. Passwords MUST be bcrypt-hashed.   |
| Extensibility  | Business rule constants (tax rate, discount rate, threshold) MUST be named and co-located to allow single-file changes. |
| Portability    | The service MUST run via Docker without requiring a local Node.js installation.                |
| Scalability    | The service MUST be stateless; any number of replicas can run concurrently sharing the same database. |
| Correctness    | All monetary calculations MUST produce results consistent with the formula table in CLAUDE.md. |
| Testability    | The checkout calculation logic MUST be unit-testable without a database or HTTP layer.         |

---

## 7. User Stories / Scenarios

```text
As a new user,
I want to register with my email and password,
So that I can obtain a JWT and access the checkout endpoint.
```

```text
As a registered user,
I want to submit a list of items with prices and quantities,
So that I receive an accurate breakdown of subtotal, taxes, discount, and total.
```

```text
As a registered user with a subtotal above $100,
I want the system to apply the 10% loyalty discount automatically,
So that my total reflects the discount without me needing to calculate it.
```

### Acceptance Criteria

- [ ] Given a valid email and password, when `POST /auth/register` is called, then HTTP 201 is returned with an `access_token`.
- [ ] Given an already-registered email, when `POST /auth/register` is called again, then HTTP 409 is returned.
- [ ] Given valid credentials, when `POST /auth/login` is called, then HTTP 200 is returned with an `access_token`.
- [ ] Given invalid credentials, when `POST /auth/login` is called, then HTTP 401 is returned.
- [ ] Given a valid JWT and items summing to ≤ $100, when `POST /checkout` is called, then `discount` equals 0 and `total` equals `subtotal + taxes`.
- [ ] Given a valid JWT and items summing to > $100, when `POST /checkout` is called, then `discount` equals 10% of `subtotal` and `total` is reduced accordingly.
- [ ] Given no `Authorization` header, when `POST /checkout` is called, then HTTP 401 is returned.
- [ ] Given an empty `items` array, when `POST /checkout` is called, then HTTP 400 is returned.
- [ ] Given a valid checkout request, a `Checkout` record and its `CheckoutItem` rows MUST be found in the database after the response is returned.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
HTTP Client
    │
    ▼
NestJS App (port 3000)
    ├── GlobalJwtAuthGuard       ← rejects unauthenticated requests
    ├── GlobalValidationPipe     ← rejects malformed payloads
    ├── GlobalHttpExceptionFilter← normalises error responses
    │
    ├── AuthModule
    │   ├── POST /auth/register  (@Public)
    │   └── POST /auth/login     (@Public)
    │
    └── CheckoutModule
        └── POST /checkout       (JWT required)
                │
                ├── CheckoutService
                │   ├── calculateCheckout()   ← pure domain function
                │   └── CheckoutRepository.save()
                │
                └── PrismaService → PostgreSQL
```

### 8.2 Data Model

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String                          // bcrypt hash
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  checkouts Checkout[]

  @@index([email])
}

model Checkout {
  id        String         @id @default(cuid())
  userId    String
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  subtotal  Decimal        @db.Decimal(10, 2)
  taxes     Decimal        @db.Decimal(10, 2)
  discount  Decimal        @db.Decimal(10, 2)
  total     Decimal        @db.Decimal(10, 2)
  createdAt DateTime       @default(now())
  items     CheckoutItem[]

  @@index([userId])
}

model CheckoutItem {
  id         String   @id @default(cuid())
  checkoutId String
  checkout   Checkout @relation(fields: [checkoutId], references: [id], onDelete: Cascade)
  name       String
  unitPrice  Decimal  @db.Decimal(10, 2)
  quantity   Int
  lineTotal  Decimal  @db.Decimal(10, 2)

  @@index([checkoutId])
}
```

### 8.3 API Contract

#### `POST /auth/register`

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `201 Created`
```json
{
  "access_token": "<JWT>"
}
```

---

#### `POST /auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** `200 OK`
```json
{
  "access_token": "<JWT>"
}
```

---

#### `POST /checkout`

**Headers:** `Authorization: Bearer <JWT>`

**Request**
```json
{
  "items": [
    { "name": "Widget", "unit_price": 60.00, "quantity": 2 }
  ]
}
```

**Response** `201 Created`
```json
{
  "subtotal": 120.00,
  "taxes": 15.60,
  "discount": 12.00,
  "total": 123.60
}
```

### 8.4 Key Flows

**Happy path — authenticated checkout:**

1. Client obtains a JWT via `POST /auth/login`.
2. Client calls `POST /checkout` with `Authorization: Bearer <token>` and an `items` array.
3. `JwtAuthGuard` validates the token; injects `JwtPayload` (userId, email) into the request.
4. `ValidationPipe` validates the request body against `CreateCheckoutDto`.
5. `CheckoutController` calls `CheckoutService.processCheckout(userId, dto)`.
6. `CheckoutService` calls `calculateCheckout(items)` — a pure function — to compute totals.
7. `CheckoutService` calls `CheckoutRepository.save(...)` which writes one `Checkout` row and N `CheckoutItem` rows inside a single Prisma nested `create`.
8. The persisted record is returned and serialised as `CheckoutResponseDto`.

**Edge cases:**

- Empty `items` array → `ValidationPipe` rejects with HTTP 400 before the service layer is reached.
- Missing or expired JWT → `JwtAuthGuard` rejects with HTTP 401.
- Duplicate email on register → `AuthService` throws `ConflictException` → HTTP 409.
- Wrong password → `AuthService` throws `UnauthorizedException` → HTTP 401.
- Database unreachable → Prisma throws; `HttpExceptionFilter` catches and returns HTTP 500.

---

## 9. Error Handling

| Scenario                          | Behavior                                              | HTTP Status |
|-----------------------------------|-------------------------------------------------------|-------------|
| Missing or invalid JWT            | `JwtAuthGuard` rejects before controller is reached   | 401         |
| Wrong credentials on login        | Generic "Invalid credentials" message (no user enumeration) | 401    |
| Email already registered          | `ConflictException` with descriptive message          | 409         |
| Empty `items` array               | `ValidationPipe` returns field-level error details    | 400         |
| Unknown fields in request body    | `ValidationPipe` (forbidNonWhitelisted) rejects       | 400         |
| Database or unexpected error      | `HttpExceptionFilter` returns a structured error body | 500         |

---

## 10. Open Questions

| #  | Question                                                                           | Owner         | Status   |
|----|------------------------------------------------------------------------------------|---------------|----------|
| 1  | Should checkout records be retrievable (`GET /checkout/:id` or `GET /checkout`)?  | @FelipeQueFez | Open     |
| 2  | Should JWT expiry be configurable via environment variable?                        | @FelipeQueFez | Open     |
| 3  | Should tax rate and discount rules be stored in the database for runtime changes?  | @FelipeQueFez | Open     |
| 4  | Is a refresh token flow required before production use?                            | @FelipeQueFez | Open     |

---

## 11. Out of Scope / Future Work

- Frontend or consumer UI.
- `GET /checkout` or `GET /checkout/:id` retrieval endpoints.
- Configurable tax rates per SKU, region, or user tier.
- Multi-tier discount rules (e.g. 5% at $50, 10% at $100, 15% at $200).
- JWT refresh and revocation.
- Rate limiting and abuse prevention.
- Idempotency keys for checkout requests.
- Metrics and distributed tracing (e.g. OpenTelemetry).

---

## 12. References

- [CLAUDE.md — Challenge Definition](../../CLAUDE.md)
- [ADR-001 — NestJS as Backend Framework](../adr/ADR-001-nestjs-as-backend-framework.md)
- [ADR-002 — Modular Layered Architecture](../adr/ADR-002-modular-layered-architecture.md)
- [ADR-003 — JWT Authentication with Global Guard](../adr/ADR-003-jwt-authentication-global-guard.md)
- [ADR-004 — Prisma ORM with PostgreSQL](../adr/ADR-004-prisma-orm-postgresql.md)
- [ADR-005 — Repository Pattern with Interface](../adr/ADR-005-repository-pattern-with-interface.md)
- [ADR-006 — Pure Function for Checkout Business Rules](../adr/ADR-006-pure-function-checkout-business-rules.md)
- [ADR-007 — Docker Multi-Stage Build and Compose](../adr/ADR-007-docker-multistage-build-and-compose.md)
