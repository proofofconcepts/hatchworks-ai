# ADR-005: Repository Pattern with Interface Abstraction

## Status

Accepted

## Context

The checkout application service must persist records without being coupled to Prisma or any specific database. Coupling the service directly to Prisma would make unit testing require a live database and would make swapping the persistence layer a large refactor.

## Decision

Define `ICheckoutRepository` as a TypeScript interface in the domain layer. Inject it using a Symbol DI token (`CHECKOUT_REPOSITORY`). Provide the Prisma-backed `CheckoutRepository` implementation in the infrastructure layer via the NestJS module's `providers` array. A `CheckoutMapper` converts between Prisma model types and domain types.

## Consequences

- The application service depends only on the interface, not on Prisma; the concrete implementation can be swapped (e.g. for an in-memory stub in tests) without touching the service.
- The Symbol token prevents accidental collision with other injected dependencies.
- `CheckoutMapper` provides a single conversion boundary between the ORM model and the domain, keeping Prisma types out of the domain layer.
- Additional boilerplate compared to injecting Prisma directly; the trade-off is justified by the extensibility requirement.
