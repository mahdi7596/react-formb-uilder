# Phase 3 Core Runtime Report

Date: 2026-05-14
Change: `implement-core-runtime-behavior`
Status: implemented and ready for owner review

## Summary

Phase 3 turns the Phase 1 contracts and Phase 2 fixtures into executable, framework-neutral core runtime behavior. The core package now has runtime APIs for submitted paths, dangerous-key checks, schema analysis, validation, condition evaluation, submission normalization, backend response parsing, and migration runner scaffolding.

This phase does not create a visual app. Its output is visible through tests, public TypeScript APIs, fixtures, and this report. The first browser-viewable respondent output is planned for Phase 6, after the React renderer foundation in Phase 5. The first builder UI output is planned for Phase 8.

## Changed Files

- `packages/core/package.json`
- `packages/core/src/index.ts`
- `packages/core/src/paths/index.ts`
- `packages/core/src/paths/runtime.test.ts`
- `packages/core/src/safety/index.ts`
- `packages/core/src/safety/runtime.test.ts`
- `packages/core/src/schema/index.ts`
- `packages/core/src/schema/runtime.test.ts`
- `packages/core/src/validation/index.ts`
- `packages/core/src/validation/runtime.test.ts`
- `packages/core/src/conditions/index.ts`
- `packages/core/src/conditions/runtime.test.ts`
- `packages/core/src/submissions/index.ts`
- `packages/core/src/submissions/runtime.test.ts`
- `packages/core/src/responses/index.ts`
- `packages/core/src/responses/runtime.test.ts`
- `packages/core/src/migrations/index.ts`
- `packages/core/src/migrations/runtime.test.ts`
- `packages/core/src/testing/fixtures/index.ts`
- `openspec/changes/implement-core-runtime-behavior/**`

## Public APIs Added

- Path runtime: `parseSubmittedPath`, `serializeSubmittedPath`, `getValueAtPath`, `setValueAtPath`.
- Safety runtime: `findDangerousKeys`, `hasExecutableCode`.
- Schema runtime: `analyzeSchema`.
- Validation runtime: `validateFieldValue`.
- Condition runtime: `evaluateCondition`, `extractConditionDependencies`, `isEmpty`.
- Submission runtime: `resolveDefaultValues`, `normalizeSubmissionData`, `createSubmissionEnvelope`.
- Response runtime: `parseBackendResponse`.
- Migration runtime: `runMigrations`.

## Behavior Implemented

- Submitted path parsing for schema paths and runtime error paths.
- Dangerous segment rejection for `__proto__`, `constructor`, and `prototype`.
- Safe object getter/setter behavior without prototype mutation.
- Recursive dangerous-key scanning and executable-code attempt detection.
- Schema traversal indexes by node id and submitted path.
- Diagnostics for duplicate ids, duplicate submitted paths, unknown node/field types, unsupported repeaters, unsupported upload orchestration, unknown validation rules, unsupported custom validator references, invalid condition references, and condition cycles.
- MVP validation for required, string length, word count, numeric bounds, integer, step, pattern, email, URL, option membership, selection count, and accepted/consent.
- Condition evaluation for logical operators, field operators, missing-value behavior, dependency extraction, unknown predicates, and basic complexity limits.
- Default value resolution.
- Final-submission empty-value normalization.
- Hidden and disabled value exclusion by default, with explicit hidden preservation support.
- Normalized submission envelope creation with schema revision fields copied through.
- File metadata validation for metadata references only.
- Backend response parsing with field/global error mapping.
- Migration runner shell with no-op current-version behavior and ordered registered migration execution.
- Phase 2 fixture compatibility through runtime-backed schema and response diagnostics where practical.

## Verification

- `pnpm --filter @your-org/forms-core test`: passed, 10 files and 27 tests.
- `pnpm --filter @your-org/forms-core typecheck`: passed.
- `pnpm test`: passed, 16 files and 33 tests.
- `pnpm typecheck`: passed.
- `pnpm --filter @your-org/forms-core test -- --coverage`: passed, but the current Vitest setup does not print a coverage summary.

## Dependency Boundary Check

`packages/core/package.json` still has empty `dependencies` and `devDependencies`. No React, DOM/browser-only API, AJV, Zod, TanStack Query, dnd-kit, upload provider, design-system component, CSS framework, browser upload orchestration, or transport client was added to `packages/core`.

## Fixture Compatibility Notes

The Phase 2 fixture manifest remains green. Schema fixtures now use `analyzeSchema` diagnostics where practical, and backend response fixtures use `parseBackendResponse` diagnostics. Submission and compiler-diagnostic fixture checks remain lightweight where they need fixture-specific context that is not yet part of a full host runtime.

## Known Limitations

- Email and URL validation use pragmatic MVP checks. Backends can apply stricter policies.
- Regex safety checks are conservative and intentionally small; cross-language regex portability remains a validators/compiler phase concern.
- Repeaters and upload orchestration remain unsupported and fail closed.
- Async validators and async predicates remain unsupported for MVP.
- Condition cycle detection covers the MVP direct reciprocal cases and current fixture expectations; deeper graph reporting can be expanded when builder diagnostics need richer UX.
- The migration runner shell is intentionally minimal because only schema version `1.0.0` exists today.
- There is still no visual output in this phase. Manual browser inspection starts with renderer/example phases.

## Owner Review Checklist

- [ ] I reviewed the changed files.
- [ ] I reviewed the runtime API names and result shapes.
- [ ] I understand that Phase 3 output is test/API/report output, not a visual UI.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

-
