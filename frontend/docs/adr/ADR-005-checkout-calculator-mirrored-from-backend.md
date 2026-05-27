# ADR-005: Checkout Calculator Mirrored as a Frontend Pure Function

## Status

Accepted

## Context

The checkout page shows a live preview of subtotal, taxes, discount, and total as the user builds the item list — before the form is submitted to the backend. Without a local calculation, the preview would require a network call on every keystroke. The business rules (13% tax, 10% discount above $100) are stable and already expressed as named constants in the backend domain layer.

## Decision

Mirror `calculateCheckout` as a pure TypeScript function in `src/modules/checkout/domain/checkout.calculator.ts`, using the same constants, formula, and rounding logic as the backend. The frontend uses this function exclusively for the live preview; the backend remains the authoritative source of record for the persisted totals returned in the API response.

## Consequences

- The preview is instant and requires no network call, giving a responsive UX even on slow connections.
- If business rules change (e.g. tax rate update), both files must be updated in sync. This is a known duplication trade-off; a shared library or API-driven rules configuration would eliminate it in a future iteration.
- The function is a pure TypeScript function with no dependencies, making it easy to unit-test in isolation — the same 7 test cases from the backend are reproduced in `test/unit/checkout.calculator.spec.ts`.
