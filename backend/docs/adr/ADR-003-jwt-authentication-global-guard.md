# ADR-003: JWT Authentication with a Global Guard

## Status

Accepted

## Context

The `/checkout` endpoint must be protected. The authentication mechanism should be stateless to support horizontal scaling and should not require session storage. New routes added in the future should be protected by default rather than opted in explicitly.

## Decision

Use JWT (`@nestjs/jwt` + `passport-jwt`) for stateless authentication. Register `JwtAuthGuard` as a global `APP_GUARD` so every route is protected by default. Expose a `@Public()` decorator that marks routes as exempt from the guard (used for `/auth/register` and `/auth/login`).

## Consequences

- New endpoints are secure by default; a developer must consciously opt out with `@Public()`, reducing the risk of accidentally exposing a route.
- No server-side session state is needed, which aligns with the distributed/containerized deployment requirement.
- Token revocation requires an additional mechanism (blocklist, short expiry + refresh) that is not included in the MVP but is a known future concern.
- Passwords are hashed with bcrypt (cost factor 12) before storage; the plain-text password is never persisted.
