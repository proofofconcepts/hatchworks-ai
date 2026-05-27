# ADR-003: Zustand for Auth State with localStorage Persistence

## Status

Accepted

## Context

The JWT issued by the backend must be stored client-side and injected into every authenticated request. React Context would require wrapping the tree and causes re-renders across components. A heavier solution (Redux, Jotai) is unnecessary for a single auth slice. The token must survive page refreshes so the user does not have to log in again on every visit.

## Decision

Use Zustand with the `persist` middleware to manage auth state (`token`, `email`). The store is defined in `src/shared/store/auth.store.ts`. `persist` serialises the state to `localStorage` under the key `auth-storage`. The HTTP client reads the token via `useAuthStore.getState()` (outside React) so it does not need to be inside a component or hook.

## Consequences

- Auth state is available anywhere — inside components via `useAuthStore()` and outside React (e.g. the HTTP client) via `getState()`.
- `persist` keeps the token across page reloads without requiring a cookie or server-side session.
- The token is stored in `localStorage`, which is accessible to JavaScript on the same origin; if XSS protection is not in place, this is a risk. For the MVP this is acceptable; a future iteration may use `HttpOnly` cookies via a server action or middleware.
- `clearAuth()` removes the token from both the in-memory store and `localStorage`, ensuring a clean logout.
