# Phase 2 Core Contracts And Fixtures Report

Date: 2026-05-14
Change: `implement-core-contract-fixtures`
Status: implemented and ready for owner review

## Summary

Phase 2 replaced the Phase 0 core placeholder with framework-neutral contract exports, diagnostic vocabulary, submitted path helpers, JSON conformance fixtures, fixture manifest metadata, and tests. This phase intentionally stops before full runtime schema parsing, condition evaluation, submission normalization, JSON Schema compilation, or renderer behavior.

## Changed Files

- `packages/core/src/index.ts`
- `packages/core/src/index.test.ts`
- `packages/core/src/conditions/index.ts`
- `packages/core/src/diagnostics/index.ts`
- `packages/core/src/extensions/index.ts`
- `packages/core/src/paths/index.ts`
- `packages/core/src/responses/index.ts`
- `packages/core/src/schema/index.ts`
- `packages/core/src/submissions/index.ts`
- `packages/core/src/validation/index.ts`
- `packages/core/src/testing/fixtures/types.ts`
- `packages/core/src/testing/fixtures/manifest.ts`
- `packages/core/src/testing/fixtures/index.ts`
- `packages/core/src/testing/fixtures/fixture-contracts.test.ts`
- `packages/core/src/testing/fixtures/json/**`
- `packages/core/package.json`
- `vitest.config.ts`
- `openspec/changes/implement-core-contract-fixtures/**`

## Exported Contracts

- Diagnostics: stable diagnostic codes, severity, source, diagnostic shape, and diagnostic factory.
- Paths: branded submitted path type, dangerous key list, lightweight submitted path predicate, and recursive dangerous-key check.
- Schema: canonical form schema, nodes, fields, options, localization, settings, metadata, and JSON value contracts.
- Validation: validation rule and validation error contracts.
- Conditions: condition expression and dependency contracts.
- Submissions: submission envelope and file metadata contracts.
- Responses: backend response status and backend response contracts.
- Extensions: custom field, validator, and predicate registration contracts.
- Fixtures: manifest, fixture entry/result types, JSON fixture loader, and lightweight contract checks.

## Fixture Coverage

Total JSON fixtures: 61

- Schema valid fixtures: minimal form, multi-step form, choices, hidden default exclusion, localization, conditional visibility, file metadata, and custom validator reference.
- Schema invalid fixtures: missing schema version, duplicate ids, unknown node type, unknown field type, missing submitted name, invalid submitted path, dangerous key, duplicate submitted path, unknown validation rule, unsupported custom validator, invalid condition reference, condition cycle, repeater node, upload orchestration node, and executable-code attempt.
- Submission valid fixtures: minimal contact submission, omitted empty values, boolean false, choices, hidden excluded, hidden preserved, file metadata, and idempotent retry.
- Submission invalid fixtures: missing revision hash, mismatched revision hash, missing attempt id, dangerous data key, dangerous meta key, invalid path, required missing, invalid email, invalid URL, invalid option, invalid file metadata, and hidden value excluded by policy.
- Response fixtures: success, field validation error, global validation error, mixed validation errors, conflict, auth error, rate limit, server error, malformed unknown status, and dangerous params.
- Compiler diagnostic fixtures: condition not representable, custom validator not representable, unsupported regex, unknown field type, repeater not supported, upload lifecycle not supported, dangerous key, and invalid path.

## Verification

- `pnpm --filter @your-org/forms-core test`: passed
- `pnpm --filter @your-org/forms-core typecheck`: passed
- `pnpm test`: passed
- `pnpm typecheck`: passed

## Dependency Boundary Check

`packages/core/package.json` still has empty `dependencies` and `devDependencies`. No React, AJV, Zod, TanStack Query, dnd-kit, upload provider, design-system package, CSS framework, browser upload orchestration, or transport dependency was added to `packages/core`.

## Known Limitations

- The fixture checks are intentionally lightweight. They exist to prove fixture shape and diagnostic vocabulary coverage, not to claim full runtime validation.
- Submitted path handling is a predicate and branded contract, not the full parser/evaluator planned for Phase 3.
- Condition dependency checks only cover the fixture-level cases needed for this phase.
- JSON Schema compilation diagnostics are represented as fixtures only. No compiler package behavior was implemented.
- Upload orchestration and repeater behavior remain explicitly unsupported for MVP until a later approved phase.

## Owner Review Checklist

- Confirm the exported core contracts match the architecture direction.
- Confirm the fixture categories and fail-closed diagnostic expectations are useful for backend conformance work.
- Confirm the unsupported MVP areas, especially repeaters and upload lifecycle behavior, should remain outside the next runtime phase.
- Confirm Phase 3 can begin with path parsing, schema checks, condition evaluation, submission normalization, and diagnostic-producing runtime behavior.
