# ADR-007: Jest for Unit Tests and Playwright for E2E (Scaffolded)

## Status

Accepted

## Context

The project requires both unit tests for domain logic and integration/E2E tests for the full user flow (register → login → checkout). Unit tests must run fast without a browser or network; E2E tests must drive a real browser against a running application. The backend already uses Jest with ts-jest; the frontend should follow the same pattern for unit tests and introduce Playwright for E2E.

## Decision

Use Jest with ts-jest for unit tests in `test/unit/`, configured with `testEnvironment: "node"` since the domain functions have no DOM dependency. Use Playwright for E2E tests in `test/e2e/`, configured to target a running app via `PLAYWRIGHT_BASE_URL`. E2E tests are **not run in CI** at this time; they are scaffolded for future execution against the hosted Render deployment. The CI workflow (`frontend-ci.yml`) runs only lint, unit tests, and build.

## Consequences

- Unit tests (`npm run test`) run in under 1 second with no external dependencies, making them safe to run on every commit.
- Playwright tests (`npm run test:e2e`) require a running frontend and backend; they are intended to run manually or in a future dedicated job targeting the staging environment.
- The Jest config mirrors the backend: `rootDir: "."`, `roots: ["<rootDir>/test/unit"]`, no spec files in `src/`.
- The `PLAYWRIGHT_BASE_URL` environment variable allows pointing the E2E suite at local, staging, or production without changing the config file.
