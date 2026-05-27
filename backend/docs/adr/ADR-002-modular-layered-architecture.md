# ADR-002: Modular Layered Architecture (DDD-Inspired)

## Status

Accepted

## Context

Business logic, infrastructure concerns, and HTTP presentation details must not bleed into each other as the service grows. The checkout domain in particular has rules that may change independently of how they are persisted or exposed. A clear internal structure is needed from the start to avoid coupling.

## Decision

Each feature module is split into four layers: `domain`, `application`, `infrastructure`, and `presentation`. Domain contains pure interfaces and business logic. Application orchestrates use cases. Infrastructure holds Prisma implementations. Presentation holds controllers and DTOs. Modules are grouped under `src/modules/` and shared utilities under `src/shared/`.

## Consequences

- Business rules live in the domain layer and have no dependency on frameworks or databases, making them straightforward to test and modify.
- Adding a new persistence backend or transport layer (e.g. gRPC, a second DB) requires touching only the infrastructure or presentation layer.
- More files and directories than a flat structure; acceptable given the need for long-term extensibility stated in the challenge requirements.
- New contributors must understand the layer conventions before making changes.
