# ADR-007: Docker Multi-Stage Build and Docker Compose

## Status

Accepted

## Context

The service must run reliably across environments (local development, CI, production). The container image should be small and not include dev dependencies or build tools. Database migrations must be applied before the application starts, but running them inside the application container couples two concerns and complicates restarts.

## Decision

Use a Docker multi-stage build: a `builder` stage compiles TypeScript and installs all dependencies; the production stage copies only the compiled output, Prisma client, Prisma schema, and production `node_modules`. The container entrypoint runs `prisma migrate deploy && node dist/main.js` so migrations are applied automatically on every startup. `docker-compose.yml` defines the PostgreSQL 16 service with a health check and a persistent named volume for local development.

## Consequences

- The production image contains only runtime artifacts, keeping image size small and reducing the attack surface.
- Migrations run automatically on startup, eliminating a separate migration step or container; this is safe because `prisma migrate deploy` is idempotent and only applies pending migrations.
- The Compose file manages only the database service; the application container is run separately, which avoids rebuilding the image on every code change during development.
- On first startup the container must be able to reach the database before it can proceed; a Compose `depends_on` with `condition: service_healthy` or an external readiness check is recommended for orchestrated environments.
