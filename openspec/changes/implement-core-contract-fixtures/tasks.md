## 1. Core Module Structure

- [x] 1.1 Replace the Phase 0 placeholder core source with contract-oriented exports
- [x] 1.2 Create `packages/core/src/diagnostics/`
- [x] 1.3 Create `packages/core/src/schema/`
- [x] 1.4 Create `packages/core/src/paths/`
- [x] 1.5 Create `packages/core/src/validation/`
- [x] 1.6 Create `packages/core/src/conditions/`
- [x] 1.7 Create `packages/core/src/submissions/`
- [x] 1.8 Create `packages/core/src/responses/`
- [x] 1.9 Create `packages/core/src/extensions/`
- [x] 1.10 Create `packages/core/src/testing/fixtures/`

## 2. Type Contracts And Diagnostics

- [x] 2.1 Define structured diagnostic severity, source, code, and diagnostic types
- [x] 2.2 Define submitted path branded type and path-related contract types without implementing full parser behavior
- [x] 2.3 Define canonical schema, settings, node, field, option, localization, UI, and metadata types
- [x] 2.4 Define validation rule and validation error contract types
- [x] 2.5 Define condition expression and dependency contract types
- [x] 2.6 Define submission envelope and file metadata contract types
- [x] 2.7 Define backend response and backend error contract types
- [x] 2.8 Define custom field, validator, and predicate registration contract types
- [x] 2.9 Define fixture manifest, fixture category, fixture expectation, and fixture result types

## 3. Fixture Manifest And JSON Fixtures

- [x] 3.1 Create fixture manifest file under `packages/core/src/testing/fixtures/`
- [x] 3.2 Add valid schema fixtures for minimal form, multi-step form, choices, hidden default exclusion, localization, conditional visibility, file metadata, and custom validator reference
- [x] 3.3 Add invalid schema fixtures for missing schema version, duplicate ids, unknown node type, unknown field type, missing submitted name, invalid submitted path, dangerous key, duplicate submitted path, unknown validation rule, unsupported custom validator, invalid condition reference, condition cycle, repeater node, upload orchestration node, and executable-code attempt
- [x] 3.4 Add valid submission fixtures for minimal contact submission, omitted empty values, boolean false, choices, hidden excluded, hidden preserved, file metadata, and idempotent retry
- [x] 3.5 Add invalid submission fixtures for missing revision hash, mismatched revision hash, missing attempt id, dangerous data key, dangerous meta key, invalid path, required missing, invalid email, invalid URL, invalid option, invalid file metadata, and hidden value excluded by policy
- [x] 3.6 Add response fixtures for success, field validation error, global validation error, mixed validation errors, conflict, auth error, rate limit, server error, malformed unknown status, and dangerous params
- [x] 3.7 Add compiler diagnostic fixtures for condition not representable, custom validator not representable, unsupported regex, unknown field type, repeater not supported, upload lifecycle not supported, dangerous key, and invalid path

## 4. Fixture Loading And Contract Tests

- [x] 4.1 Add fixture loading utilities that read JSON fixtures by manifest path
- [x] 4.2 Add lightweight fixture contract checks that produce expected diagnostic codes without claiming full runtime validation
- [x] 4.3 Add Vitest coverage that verifies every manifest fixture path exists and contains valid JSON
- [x] 4.4 Add Vitest coverage that verifies pass fixtures have no expected diagnostics
- [x] 4.5 Add Vitest coverage that verifies fail fixtures include expected diagnostics
- [x] 4.6 Remove or replace the Phase 0 placeholder core test

## 5. Public Exports And Boundary Check

- [x] 5.1 Export contract types and fixture helpers from `packages/core/src/index.ts`
- [x] 5.2 Ensure exported APIs are framework-neutral and do not reference React or browser-specific types
- [x] 5.3 Confirm `packages/core/package.json` has no React, AJV, Zod, TanStack Query, dnd-kit, upload provider, design-system, CSS, browser upload orchestration, or transport dependencies

## 6. Verification And Report

- [x] 6.1 Run `pnpm --filter @your-org/forms-core test`
- [x] 6.2 Run `pnpm --filter @your-org/forms-core typecheck`
- [x] 6.3 Run `pnpm test`
- [x] 6.4 Run `pnpm typecheck`
- [x] 6.5 Write `docs/reports/2026-05-14-phase-2-core-contracts-fixtures.md`
- [x] 6.6 Include changed files, exported contracts, fixture coverage, commands run, results, known limitations, dependency boundary check, and owner review checklist in the report
- [x] 6.7 Commit Phase 2 proposal artifacts, core contracts, fixtures, tests, and report after verification succeeds
- [x] 6.8 Stop after Phase 2 and request owner review before Phase 3 begins
