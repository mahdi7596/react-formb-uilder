# Specify Calculation Scoring Contract

## Why

Calculations and scoring are common in serious form builders, but they create a runtime language. Shipping them without deterministic semantics would risk frontend/backend drift, unsafe expressions, broken revisions, and incorrect submitted data.

## What Changes

- Define a declarative expression model for calculations and scores.
- Define supported value types, operators, rounding, dependency tracking, cycle detection, backend parity, and migration warnings.
- Keep executable JavaScript out of persisted schemas.

## Impact

- Future implementation will touch `packages/core`, `packages/react-renderer`, `packages/react-builder`, `packages/validators`, and docs.
- Until implemented, unsupported calculations continue to fail closed.

