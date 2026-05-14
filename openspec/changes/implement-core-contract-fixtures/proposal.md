## Why

Phase 1 defined the canonical contracts in documentation; Phase 2 must make those contracts executable enough for future work by adding TypeScript contract types, conformance fixtures, diagnostics, and tests in `packages/core`. This creates a stable, framework-agnostic foundation before implementing runtime behavior such as parsing, validation, condition evaluation, and submission normalization.

## What Changes

- Add core TypeScript type modules for canonical schema, submitted paths, diagnostics, submissions, backend responses, validation rules, conditions, extensions, and fixture manifests.
- Add JSON conformance fixtures under `packages/core/src/testing/fixtures/`.
- Add valid schema fixtures covering minimal form, multi-step form, choices, hidden values, localization, conditional visibility, file metadata, and custom validator references.
- Add invalid schema fixtures covering dangerous keys, missing names, duplicate ids, unknown node/field types, invalid validation, invalid conditions, repeaters, upload orchestration, and executable-code attempts.
- Add valid submission fixtures covering omitted empty values, booleans, choices, hidden values, file metadata, and idempotent retry.
- Add invalid submission fixtures covering dangerous keys, invalid paths, validation failures, missing revision hash, revision mismatch, missing idempotency key, invalid option value, and invalid file metadata.
- Add backend response fixtures for success, validation error, conflict, auth error, rate limit, server error, malformed status, and dangerous params.
- Add compiler diagnostic fixtures for non-representable conditions, unsupported custom behavior, unsupported regex, unknown field type, repeaters, upload lifecycle, dangerous keys, and invalid paths.
- Add fixture manifest tests that assert expected pass/fail diagnostics.
- Export only framework-neutral APIs from `@your-org/forms-core`.
- No React, AJV, Zod, TanStack Query, dnd-kit, upload provider, or transport dependency will be added to `packages/core`.
- No full runtime behavior will be implemented in this change.

## Capabilities

### New Capabilities

- `core-contract-fixtures`: Defines the framework-agnostic core TypeScript contract surface, diagnostic vocabulary, JSON conformance fixtures, fixture manifest format, and tests that prove the approved Phase 1 contracts have executable coverage.

### Modified Capabilities

- None.

## Impact

- Affected package:
  - `packages/core`
- Affected docs:
  - `docs/reports/2026-05-14-phase-2-core-contracts-fixtures.md`
- Affected OpenSpec artifacts:
  - `openspec/changes/implement-core-contract-fixtures/`
- Dependencies:
  - No new dependencies expected.
- API impact:
  - Adds initial exported TypeScript types and fixture helpers from `@your-org/forms-core`.
  - These exports are contract-level APIs, not runtime parser/evaluator behavior.
