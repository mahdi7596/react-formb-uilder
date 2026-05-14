## Why

Phase 2 gave the core package stable contracts and JSON fixtures, but the package still cannot evaluate those contracts as real runtime behavior. Phase 3 is needed now so the future React renderer, builder preview, adapters, and validator package can depend on one framework-neutral source of truth instead of each reinventing path parsing, validation, condition, hidden-value, submission, and response logic.

## What Changes

- Add runtime-safe submitted path parsing, serialization, getter, and setter helpers.
- Add recursive dangerous-key rejection for schemas, defaults, props, metadata, submissions, files, backend responses, and diagnostic params.
- Add schema traversal and publish-check style diagnostics for duplicate ids, duplicate submitted paths, unknown node and field types, unknown validation rules, unknown predicates, invalid conditions, condition cycles, unsupported repeaters, unsupported upload orchestration, and executable-code attempts.
- Add default value resolution and final-submission empty value normalization for MVP fields.
- Add MVP validation primitives for required, length, word count, numeric, integer, step, pattern, email, URL, option membership, selection count, and accepted/consent rules.
- Add deterministic condition evaluation with dependency collection, missing-value behavior, predicate registration checks, and cycle detection.
- Add hidden-field final submission filtering using the documented default exclusion policy and explicit preservation setting.
- Add normalized submission envelope creation with revision integrity, attempt id, locale, files, metadata, and filtered data.
- Add backend response parsing that maps normalized responses to field/global errors and rejects malformed or dangerous response data.
- Add a migration runner shell for future schema migrations without implementing complex migrations in this phase.
- Add focused Vitest suites and a Phase 3 completion report.

## Capabilities

### New Capabilities

- `core-runtime-behavior`: Framework-neutral runtime behavior for submitted paths, dangerous-key rejection, schema diagnostics, validation, conditions, hidden-value filtering, submission envelope creation, backend response parsing, and migration runner scaffolding.

### Modified Capabilities

- None. Existing `canonical-contracts` and `core-contract-fixtures` requirements remain the source contracts; this change implements runtime behavior against them.

## Impact

- Affected package: `packages/core`.
- Affected public API: new framework-neutral runtime functions and result types exported from `@your-org/forms-core`.
- Affected tests: new focused Vitest suites for paths, dangerous keys, schema traversal/diagnostics, validation, conditions, hidden values, submissions, responses, migrations, and fixture compatibility.
- Dependency boundary: `packages/core` must remain free of React, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system components, CSS, browser upload orchestration, and transport clients.
- Deferred: JSON Schema compilation stays in a later validators phase; React renderer/builder integration stays in later React phases; repeaters and upload orchestration remain unsupported MVP behavior.
