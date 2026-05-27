# ADR-008: Unit Test Strategy and Directory Structure

## Status

Accepted

## Context

The project needs a testing approach that is fast, deterministic, and easy to maintain. Tests must not be colocated with source files (which conflicts with the NestJS build pipeline and clutters the `src/` tree). The testing scope must be chosen deliberately: testing every class with mocks adds maintenance burden without proportional value, while leaving the domain logic untested creates risk when business rules change.

## Decision

Unit tests live under `test/unit/` at the backend root, mirroring the source structure where needed. Jest is configured with `rootDir: "."` and `roots: ["<rootDir>/test/unit"]` so tests are fully separated from source. Only the pure domain function `calculateCheckout` is unit-tested at this layer; NestJS services, controllers, and the repository implementation are not mocked and tested in isolation because their logic is trivial orchestration — the meaningful behaviour lives entirely in the calculator.

## Consequences

- The `src/` tree contains no test files, keeping the build output clean and the source structure unambiguous.
- `calculateCheckout` tests run without any framework, database, or HTTP setup, making them fast and stable.
- New business rule logic added to the domain layer should be accompanied by unit tests in `test/unit/`; infrastructure or controller changes do not require unit tests unless non-trivial logic is introduced.
- End-to-end tests (if added in the future) belong in `test/e2e/` and should use a dedicated Jest config to keep them separate from the unit suite.
