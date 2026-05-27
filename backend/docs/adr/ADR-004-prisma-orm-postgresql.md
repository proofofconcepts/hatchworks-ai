# ADR-004: Prisma ORM with PostgreSQL

## Status

Accepted

## Context

Checkout records and user accounts must be persisted. The persistence layer should be type-safe, support schema migrations, and integrate cleanly with TypeScript and NestJS. The database must be reliable, support decimal precision for financial values, and be straightforward to run locally and in containers.

## Decision

Use PostgreSQL 16 as the database and Prisma as the ORM. The schema is defined in `prisma/schema.prisma` using `Decimal @db.Decimal(10,2)` for all monetary fields to avoid floating-point rounding errors. Prisma Client is generated from the schema and provides fully-typed query builders. A separate `Dockerfile.migration` manages schema migrations independently from the application container.

## Consequences

- Monetary values stored as `DECIMAL(10,2)` prevent floating-point precision loss at the database level.
- Prisma migrations provide a tracked, reproducible schema history.
- Prisma Client is regenerated on schema changes, so any breaking schema modification surfaces as a TypeScript compile error.
- Prisma's runtime adds a small overhead compared to raw SQL drivers; acceptable for this workload.
- The `PrismaService` is shared across modules via `PrismaModule`, avoiding multiple client instances.
