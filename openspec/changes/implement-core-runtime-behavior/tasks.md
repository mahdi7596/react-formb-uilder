## 1. Runtime Test Scaffold

- [x] 1.1 Replace or extend the core package test script so focused runtime suites run alongside existing fixture tests
- [x] 1.2 Add failing path runtime tests for schema paths, runtime error paths, serialization, invalid paths, dangerous segments, safe getter, and safe setter behavior
- [x] 1.3 Add failing dangerous-key tests covering schemas, defaults, props, validation params, condition values, ui, meta, localizations, submissions, files, backend responses, and error params
- [x] 1.4 Add failing schema diagnostics tests for traversal, duplicate ids, duplicate submitted paths, unknown node types, unknown field types, unsupported repeaters, unsupported upload orchestration, and executable-code attempts
- [x] 1.5 Add failing validation tests for every MVP validation rule and unknown custom validator fail-closed behavior
- [x] 1.6 Add failing condition tests for logical operators, field operators, missing-value behavior, dependency collection, unknown references, cycle detection, and unknown predicate fail-closed behavior
- [x] 1.7 Add failing hidden-value and submission tests for default exclusion, explicit preservation, disabled exclusion, hidden required behavior, envelope fields, file metadata, invalid envelope input, and revision copying
- [x] 1.8 Add failing backend response tests for success, field errors, global errors, mixed errors, unknown status, invalid error path, and dangerous params
- [x] 1.9 Add failing migration shell tests for no-op current version, missing or unknown version diagnostics, and ordered registered migration execution

## 2. Path And Safety Runtime

- [x] 2.1 Expand `packages/core/src/paths/` with submitted path segment types, parse result types, schema path parsing, runtime error path parsing, and canonical serialization
- [x] 2.2 Implement dangerous path segment rejection using the shared dangerous key list
- [x] 2.3 Implement safe object getter helper that returns diagnostics for invalid or dangerous paths
- [x] 2.4 Implement safe object setter helper that creates plain JSON objects and arrays without prototype mutation
- [x] 2.5 Add `packages/core/src/safety/` for reusable recursive dangerous-key scanning and executable-code attempt detection
- [x] 2.6 Export path and safety runtime APIs from `packages/core/src/index.ts` without browser or React types

## 3. Schema Analysis Runtime

- [x] 3.1 Add schema analysis result types for node indexes, path indexes, field nodes, hidden nodes, traversal diagnostics, and publish-check diagnostics
- [x] 3.2 Implement schema traversal by node id and submitted path
- [x] 3.3 Implement duplicate node id and duplicate submitted path diagnostics
- [x] 3.4 Implement built-in node and field type checks using the MVP contract
- [x] 3.5 Implement unsupported repeater and upload lifecycle diagnostics
- [x] 3.6 Implement validation rule reference checks and unknown custom validator diagnostics with optional validator registry input
- [x] 3.7 Implement condition reference diagnostics and predicate registry checks with optional predicate registry input
- [x] 3.8 Implement condition cycle detection across visibility, enabled state, and conditional validation dependencies
- [x] 3.9 Reuse safety helpers for schema dangerous-key and executable-code diagnostics

## 4. Validation Runtime

- [x] 4.1 Define validation runtime input, output, value context, and error result types
- [x] 4.2 Implement required validation using field-specific empty semantics
- [x] 4.3 Implement string length and word count validations
- [x] 4.4 Implement numeric min, max, integer, and step validations with deterministic floating-step behavior
- [x] 4.5 Implement pattern validation with regex syntax and contract restriction diagnostics
- [x] 4.6 Implement email and URL validation with pragmatic MVP policy
- [x] 4.7 Implement option membership, selection count, and accepted/consent validation
- [x] 4.8 Implement custom validator registration lookup and fail-closed diagnostics for unknown, missing-version, unsupported-version, or async validators
- [x] 4.9 Ensure hidden or disabled fields are skipped by default during final-submission validation

## 5. Condition Runtime

- [x] 5.1 Define condition evaluation input, output, dependency, missing-value, and predicate registry types
- [x] 5.2 Implement `all`, `any`, and `not` evaluation with invalid empty logical array diagnostics
- [x] 5.3 Implement field operators `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `empty`, `notEmpty`, `contains`, `notContains`, `in`, `notIn`, and `matches`
- [x] 5.4 Implement documented missing-value behavior for each field operator
- [x] 5.5 Implement condition dependency extraction for field references and registered predicates
- [x] 5.6 Implement custom predicate lookup and fail-closed diagnostics for unknown, missing-version, unsupported-version, or async predicates
- [x] 5.7 Enforce initial MVP complexity limits for nesting depth, condition node count, regex length, and dependency count

## 6. Normalization And Submission Runtime

- [x] 6.1 Implement default value resolution for fields and hidden nodes with dangerous-key checks
- [x] 6.2 Implement final-submission empty value normalization for MVP field types
- [x] 6.3 Implement visibility and enabled-state analysis using condition runtime results
- [x] 6.4 Implement hidden-value final submission filtering with default exclusion and explicit preservation support
- [x] 6.5 Implement disabled-value exclusion from validation and final submission by default
- [x] 6.6 Implement normalized submission data construction using path setter helpers
- [x] 6.7 Implement file metadata validation and normalization for file metadata references only
- [x] 6.8 Implement submission envelope creation with caller-provided attempt id and timestamp
- [x] 6.9 Diagnose invalid envelope input, invalid file metadata, dangerous metadata, and malformed normalized data

## 7. Backend Response Runtime

- [x] 7.1 Define parsed backend response, field error, global error, and response diagnostic result types
- [x] 7.2 Implement success response parsing
- [x] 7.3 Implement validation, conflict, auth, rate-limit, and server-error response parsing
- [x] 7.4 Implement field error mapping by runtime submitted path and global error mapping by `path: null`
- [x] 7.5 Diagnose unknown statuses, malformed response envelopes, invalid error paths, dangerous params, and dangerous meta
- [x] 7.6 Return a safe server-error-like parsed result for unknown or malformed response status cases

## 8. Migration Runtime

- [x] 8.1 Add `packages/core/src/migrations/` with migration entry, registry, runner, and result types
- [x] 8.2 Implement no-op behavior for current schema version `1.0.0`
- [x] 8.3 Diagnose missing, malformed, or unsupported schema versions
- [x] 8.4 Implement ordered registered migration execution for future versions
- [x] 8.5 Export migration shell APIs only if they are stable enough for Phase 3 public use; otherwise document them as internal in the report

## 9. Fixture Integration And Public Exports

- [x] 9.1 Update fixture contract checks to reuse real runtime diagnostics where practical
- [x] 9.2 Keep all Phase 2 fixture pass/fail expectations green or explicitly update the Phase 3 spec if runtime behavior reveals a contract issue
- [x] 9.3 Export stable runtime APIs from `packages/core/src/index.ts`
- [x] 9.4 Confirm exported APIs remain framework-neutral and do not reference React, DOM-only browser types, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system types, CSS, browser upload orchestration, or transport clients
- [x] 9.5 Confirm `packages/core/package.json` dependencies remain empty or limited to approved framework-neutral runtime dependencies if explicitly justified in the report

## 10. Verification And Report

- [x] 10.1 Run `pnpm --filter @your-org/forms-core test`
- [x] 10.2 Run `pnpm --filter @your-org/forms-core typecheck`
- [x] 10.3 Run `pnpm test`
- [x] 10.4 Run `pnpm typecheck`
- [x] 10.5 Run `pnpm --filter @your-org/forms-core test -- --coverage` if coverage tooling is available without new setup churn
- [x] 10.6 Write `docs/reports/2026-05-14-phase-3-core-runtime.md`
- [x] 10.7 Include changed files, public APIs, behavior implemented, commands run, results, known limitations, dependency boundary check, fixture compatibility notes, and owner review checklist in the report
- [x] 10.8 Commit Phase 3 proposal artifacts, implementation, tests, and report after verification succeeds
- [x] 10.9 Stop after Phase 3 and request owner review before React renderer or builder packages depend on runtime APIs
