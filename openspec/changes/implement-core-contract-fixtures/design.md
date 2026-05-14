## Context

Phase 1 produced normative contract documents under `docs/schema/`. The core package is still a Phase 0 placeholder with only a package boundary constant and placeholder test. Phase 2 must convert the approved contracts into TypeScript contract surfaces and JSON-first conformance fixtures so future runtime behavior can be implemented against stable examples.

This change is still conservative: it creates framework-neutral types, diagnostics, fixtures, and fixture tests. It does not implement the full submitted path parser, schema traversal, validation engine, condition evaluator, submission normalizer, backend response mapper, or migration runner. Those belong to Phase 3.

## Goals / Non-Goals

**Goals:**

- Add focused `packages/core/src/` modules for schema, paths, diagnostics, submissions, responses, conditions, validation, extensions, and testing fixtures.
- Export only framework-neutral core APIs.
- Create JSON fixtures and a manifest matching `docs/schema/backend-conformance-fixtures-v1.md`.
- Add enough fixture assertion logic to check pass/fail expectations and expected diagnostic codes.
- Represent dangerous keys, invalid paths, invalid schema shape, invalid submission envelopes, backend response errors, and compiler warning diagnostics in tests.
- Keep `packages/core` free of React, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system components, CSS, browser upload orchestration, and transport clients.

**Non-Goals:**

- Do not implement complete runtime validation.
- Do not implement full submitted path parsing and object setter/getter helpers.
- Do not implement condition evaluation or dependency graph building.
- Do not implement JSON Schema generation.
- Do not implement React renderer or builder behavior.
- Do not add new dependencies.

## Decisions

### Use TypeScript-only contracts in core

The first public core surface should be type definitions, diagnostic definitions, fixture helpers, and shallow shape checks. This makes package boundaries useful without jumping into product runtime too early.

Alternative considered:

- Implement runtime validators immediately. Rejected because Phase 3 is dedicated to runtime behavior and should build on reviewed fixture coverage.

### Keep fixtures JSON-first

Fixtures should be plain `.json` files with a separate manifest. That keeps them usable by non-JavaScript backend conformance suites and avoids TypeScript-only examples.

Alternative considered:

- Use `.ts` fixtures for convenience. Rejected because backend-agnostic conformance requires portable JSON.

### Add lightweight fixture checks

Tests should load the manifest, load each fixture, and assert expected diagnostic codes using lightweight shape checks. They should not claim to be full runtime validation.

This gives Phase 2 real test coverage while preserving Phase 3 for the full parser/evaluator.

### Split core modules by contract domain

Recommended module layout:

```text
packages/core/src/
  schema/
  paths/
  diagnostics/
  validation/
  conditions/
  submissions/
  responses/
  extensions/
  testing/
    fixtures/
```

This mirrors the docs and keeps future Phase 3 work naturally placed.

### Preserve placeholder package boundaries

Package names remain `@your-org/forms-core` until the owner chooses a final package scope.

## Risks / Trade-offs

- Lightweight checks may be mistaken for complete validation -> Name helpers and tests as fixture/contract checks, and document that Phase 3 implements runtime behavior.
- Fixture count can grow quickly -> Start with required representative fixtures from Phase 1, not every possible edge case.
- Type exports may need refinement during Phase 3 -> Keep contracts narrow and document any follow-up changes through OpenSpec.
- JSON imports can be awkward in TypeScript tests -> Use Node filesystem JSON loading or import assertions only if current tooling supports it cleanly.
- No schema validator dependency means checks are manual -> Accept this for Phase 2 to keep core dependency-free; optional validator packages belong outside core.

## Migration Plan

There is no product data migration. This change replaces the placeholder core export with contract exports and adds fixture files.

Implementation flow:

1. Add contract modules and exports.
2. Add fixture directories and manifest.
3. Add JSON fixtures.
4. Add fixture loading and contract-check tests.
5. Verify core package tests, typecheck, full tests, and dependency boundaries.
6. Write the Phase 2 report and stop for owner review.

## Open Questions

- How many invalid fixtures should Phase 2 include initially versus leaving as follow-up fixtures for Phase 3?
- Should fixture helpers live under `src/testing/` as exported test utilities or remain internal to package tests?
- Should the manifest use relative file paths from the manifest location or fixture-root-relative ids?
