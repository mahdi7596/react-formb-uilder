## 1. Schema And MVP Scope Docs

- [x] 1.1 Create `docs/schema/canonical-schema-v1.md`
- [x] 1.2 Document schema identity fields, revision fields, status, locale, direction, settings, nodes, metadata, and localization model
- [x] 1.3 Document MVP node contracts for field, section, step, content, ending, and hidden nodes
- [x] 1.4 Document MVP field list and value shapes, including conservative phone and file metadata decisions
- [x] 1.5 Explicitly document that repeaters are excluded from MVP unless separately specified later
- [x] 1.6 Explicitly document that upload orchestration is excluded from MVP unless separately specified later

## 2. Path And Value Semantics Docs

- [x] 2.1 Create `docs/schema/submitted-path-grammar-v1.md`
- [x] 2.2 Define object key grammar, array syntax, dot behavior, escaping decision, and examples
- [x] 2.3 Define dangerous-key rejection for paths, schemas, defaults, props, metadata, submissions, and backend responses
- [x] 2.4 Define empty value normalization rules for each MVP field type
- [x] 2.5 Create `docs/schema/hidden-value-semantics-v1.md`
- [x] 2.6 Define hidden value preservation, clearing, final submission exclusion, validation interaction, and condition interaction

## 3. Submission And Backend Response Docs

- [x] 3.1 Create `docs/schema/submission-envelope-v1.md`
- [x] 3.2 Define normalized submission envelope fields, metadata, revision hash, idempotency key, files array, and examples
- [x] 3.3 Create `docs/schema/backend-response-v1.md`
- [x] 3.4 Define success, validation error, server error, auth error, rate limit, and conflict response shapes
- [x] 3.5 Define field and global error shape using path, code, message, params, and source

## 4. Validation, Conditions, And Extensions Docs

- [x] 4.1 Create `docs/schema/validation-rules-v1.md`
- [x] 4.2 Define MVP validation rules, custom named validators, regex restrictions, error mapping, and fail-closed behavior
- [x] 4.3 Create `docs/schema/conditions-v1.md`
- [x] 4.4 Define all, any, not, comparison operators, empty checks, contains checks, missing-value behavior, dependency tracking, cycle detection, and synchronous-only MVP behavior
- [x] 4.5 Create `docs/schema/extension-registration-v1.md`
- [x] 4.6 Define custom field, validator, and predicate registrations with key, version, input contract, output contract, backend parity flag, diagnostics, and fail-closed behavior
- [x] 4.7 Document that persisted schemas must not include executable JavaScript or React components

## 5. JSON Schema And Conformance Docs

- [x] 5.1 Create `docs/schema/json-schema-generation-v1.md`
- [x] 5.2 Lock JSON Schema dialect to Draft 2020-12
- [x] 5.3 Define generated outputs, non-goals, unsupported behavior diagnostics, and compiler warning examples
- [x] 5.4 Create `docs/schema/backend-conformance-fixtures-v1.md`
- [x] 5.5 Define required valid and invalid schema fixtures
- [x] 5.6 Define required valid and invalid submission fixtures
- [x] 5.7 Define required backend response, conflict response, upload metadata, and unsupported compiler warning fixtures
- [x] 5.8 Document that fixtures must be JSON-first and usable by non-JavaScript backends

## 6. Verification And Report

- [x] 6.1 Run `rg "TODO|TBD|unspecified|later" docs/schema`
- [x] 6.2 Review architecture pre-implementation checklist and map every item to a contract document
- [x] 6.3 Run `pnpm typecheck`
- [x] 6.4 Write `docs/reports/2026-05-14-phase-1-contract-specification.md`
- [x] 6.5 Include changed files, decisions, checklist mapping, commands run, results, known limitations, and owner review checklist in the report
- [x] 6.6 Commit Phase 1 proposal artifacts and contract docs after verification succeeds
- [x] 6.7 Stop after Phase 1 and request owner review before Phase 2 begins
