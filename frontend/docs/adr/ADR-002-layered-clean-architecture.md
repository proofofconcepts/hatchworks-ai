# ADR-002: Layered Clean Architecture Mirroring the Backend

## Status

Accepted

## Context

The backend uses a four-layer module structure (domain / application / infrastructure / presentation) that keeps business logic isolated from framework and transport concerns. The frontend needs the same discipline to prevent React components from directly calling the API, embedding business rules, or importing framework-specific code into layers that should remain pure.

## Decision

Each feature module under `src/modules/{module}/` is split into the same four layers as the backend. Domain holds TypeScript interfaces and pure functions. Application orchestrates domain and infrastructure. Infrastructure holds all `fetch` calls. Presentation holds React components and Next.js pages. Shared cross-cutting utilities (HTTP client, logger, store) live in `src/shared/`. No layer may import from a layer above it.

## Consequences

- React components never import the HTTP client directly; they call application-layer functions, keeping components testable without a network.
- Domain types and pure functions can be unit-tested in Node without React, a browser, or a mock server.
- The pattern is slightly more verbose than a flat `components/` + `api/` structure but pays off when modules grow or business rules change.
- Developers new to the project must understand the layer conventions before making changes — the same expectation as the backend.
