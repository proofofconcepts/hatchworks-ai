# ADR-006: Pure Function for Checkout Business Rules

## Status

Accepted

## Context

The tax rate (13%), discount rate (10%), and discount threshold (> 100) are business rules that are expected to change as the product evolves (e.g. different tax jurisdictions, tiered discounts). The calculation logic must be easy to test in isolation and easy to modify without touching infrastructure or HTTP concerns.

## Decision

Implement the checkout calculation as a pure function `calculateCheckout` in `src/modules/checkout/domain/checkout.calculator.ts`. The function takes an array of items and returns totals. Tax rate, discount rate, and discount threshold are defined as named constants at the top of the file. Rounding to two decimal places is applied at the final output stage.

## Consequences

- The function has no side effects and no dependencies; it can be unit-tested with plain inputs and outputs, as demonstrated in `checkout.calculator.spec.ts`.
- Changing a business rule requires editing a single named constant rather than hunting through service or controller code.
- Rounding is applied once at the output boundary, which avoids compounding rounding errors across intermediate calculations.
- Future requirements such as per-item tax rates or multi-tier discounts will require refactoring the function signature; the current design does not pre-optimise for those cases.
