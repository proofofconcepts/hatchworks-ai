# ADR-006: Docker Multi-Stage Build with Next.js Standalone Output

## Status

Accepted

## Context

The frontend must be containerisable and deployable at scale, matching the backend's Docker strategy. A naive single-stage build would copy all of `node_modules` into the image (hundreds of megabytes). Next.js provides a `standalone` output mode that bundles only the files required to run the server.

## Decision

Use a two-stage Dockerfile that mirrors the backend pattern: a `builder` stage runs `npm ci` and `npm run build`; a lean `runner` stage copies `.next/standalone`, `.next/static`, and `public` from the builder. The `next.config.ts` sets `output: 'standalone'`. The container starts with `node server.js` on port 3001.

## Consequences

- The production image contains only the compiled output and its minimal runtime dependencies, keeping the image small and the attack surface low.
- `PORT` is set via an environment variable, making the container port configurable without rebuilding.
- `NEXT_PUBLIC_API_URL` must be provided at build time (it is baked into the client bundle by Next.js); it is declared as `sync: false` in `render.yaml` so the value is set per-environment in the Render dashboard.
- Static assets are served directly from the standalone server; a CDN can be placed in front for production-scale traffic.
