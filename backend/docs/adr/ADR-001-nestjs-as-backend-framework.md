# ADR-001: NestJS as Backend Framework

## Status

Accepted

## Context

The checkout service requires a Node.js backend that supports TypeScript natively, enforces a structured module system, and provides built-in tooling for validation, dependency injection, and OpenAPI documentation. The team needs to move fast on an MVP while keeping the codebase navigable as it grows.

## Decision

Use NestJS as the backend framework. It provides a TypeScript-first opinionated structure, a built-in dependency injection container, decorator-based routing and validation, and first-party integrations with Swagger, Passport, and Prisma.

## Consequences

- Module boundaries, DI, and decorators are enforced by the framework, reducing inconsistency across contributors.
- `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` is applied globally, ensuring invalid payloads are rejected at the framework layer.
- Swagger documentation is generated automatically from controller and DTO decorators with no additional tooling.
- Framework conventions (e.g. module files, guards, filters) introduce boilerplate that is disproportionate for very small services.
