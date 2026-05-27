# ADR-001: Next.js 15 with App Router

## Status

Accepted

## Context

The frontend needs a React-based framework that supports server-side rendering, file-based routing, TypeScript, and a production-ready build pipeline. It must be containerisable and deployable to Render as a Node.js service. The App Router (introduced in Next.js 13 and stable since 14) is the current recommended paradigm and replaces the Pages Router.

## Decision

Use Next.js 15 with the App Router. Routes are defined under `src/app/` using the file-system convention. The build is configured with `output: 'standalone'` in `next.config.ts` so the production image contains only the minimal set of files needed to run the server, enabling a lean Docker image without a separate static-file server.

## Consequences

- File-system routing enforces a predictable structure; adding a route means adding a directory, not registering it manually.
- `output: 'standalone'` produces a self-contained `server.js` that is copied into the Docker runner stage — no `next start` wrapper needed.
- Server Components are available but all interactive pages are marked `'use client'` because they depend on the Zustand store and browser APIs; this is intentional for an MVP and can be refined per-route later.
- The Pages Router is not used; mixing the two is not supported.
