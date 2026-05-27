# ADR-004: Centralised HTTP Client with Automatic Bearer Token Injection

## Status

Accepted

## Context

Every authenticated request to the backend must include `Authorization: Bearer <token>`. Duplicating this header in every infrastructure function is error-prone and makes the token source hard to change. A thin wrapper is needed that reads the current token and injects it transparently, and that converts non-2xx responses into typed errors.

## Decision

Define `apiRequest<T>` in `src/shared/http/http-client.ts` as a generic `fetch` wrapper. It reads `NEXT_PUBLIC_API_URL` from the environment, retrieves the token from `useAuthStore.getState()` on each call, injects the `Authorization` header when a token exists, and throws a typed `ApiError` (carrying the HTTP status code) on non-2xx responses. All infrastructure functions in every module call `apiRequest` exclusively — no direct `fetch` calls elsewhere in the codebase.

## Consequences

- Changing the auth header format, the base URL, or the error shape requires a single-file edit.
- `ApiError` carries the HTTP status code, allowing presentation components to distinguish 401 (redirect to login) from 400 (show validation error) without parsing raw response bodies.
- Because `apiRequest` is not a React hook, it can be called from application-layer functions outside of the component lifecycle.
- All requests are implicitly JSON; a future need for `multipart/form-data` or streaming would require extending the client.
