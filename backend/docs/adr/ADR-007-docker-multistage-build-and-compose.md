# ADR-007: Docker Multi-Stage Build and Docker Compose

## Status

Accepted

## Context

The service must run reliably across environments (local development, CI, production). The container image should be small and not include dev dependencies or build tools. Database migrations must be applied before the application starts, but running them inside the application container couples two concerns and complicates restarts.

## Decision

Use a Docker multi-stage build: a `builder` stage compiles TypeScript and installs all dependencies; the production stage copies only the compiled output, Prisma client, and production `node_modules`. A separate `Dockerfile.migration` image handles schema migrations independently. `docker-compose.yml` defines the PostgreSQL 16 service with a health check and a persistent named volume for local development.

## Consequences

- The production image contains only runtime artifacts, keeping image size small and reducing the attack surface.
- Separating migration execution from the application container allows migrations to run as a one-shot job (e.g. a Kubernetes init container or a Compose `depends_on` with condition) without the app container having migration tooling.
- The Compose file manages only the database service; the application container is run separately, which avoids rebuilding the image on every code change during development.
- Developers need to run the migration container or `prisma migrate deploy` manually before starting the app for the first time.
