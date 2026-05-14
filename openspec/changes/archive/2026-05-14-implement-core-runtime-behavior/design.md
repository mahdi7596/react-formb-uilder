## Context

`packages/core` currently exposes framework-neutral TypeScript contracts and JSON conformance fixtures. The Phase 2 fixture checks are intentionally lightweight: they prove fixture shape and diagnostic vocabulary, but they are not the runtime engine that React renderer, builder preview, publish checks, adapters, or future validators can rely on.

Phase 3 turns the approved Phase 1 contracts into real core behavior while preserving the package boundary: no React, no browser APIs, no AJV/Zod, no transport clients, no upload providers, and no design-system dependency. This is the first phase where runtime semantics become executable, so the implementation should be test-driven and organized by stable domain modules rather than UI needs.

The relevant source contracts are:

- `docs/schema/submitted-path-grammar-v1.md`
- `docs/schema/canonical-schema-v1.md`
- `docs/schema/validation-rules-v1.md`
- `docs/schema/conditions-v1.md`
- `docs/schema/hidden-value-semantics-v1.md`
- `docs/schema/submission-envelope-v1.md`
- `docs/schema/backend-response-v1.md`
- `docs/schema/extension-registration-v1.md`
- `openspec/specs/canonical-contracts/spec.md`
- `openspec/specs/core-contract-fixtures/spec.md`

## Goals / Non-Goals

**Goals:**

- Implement submitted path parsing, serialization, safe object getter/setter helpers, and dangerous segment rejection.
- Replace fixture-only checks with reusable runtime diagnostics for dangerous keys, schema traversal, duplicate ids, duplicate submitted paths, unsupported node/field behavior, validation rule checks, condition reference checks, and cycle detection.
- Implement MVP validation primitives in core without importing external validators.
- Implement deterministic condition evaluation with dependency collection and missing-value semantics.
- Implement default value resolution and final-submission empty value normalization.
- Implement hidden-field filtering for final submissions using the documented default exclusion and explicit preservation setting.
- Implement normalized submission envelope creation from schema, runtime values, files, locale, metadata, and attempt id.
- Implement backend response parsing and mapping into field and global errors.
- Add a migration runner shell that establishes future versioned migration shape without shipping complex migrations.
- Add focused Vitest coverage and a Phase 3 report.

**Non-Goals:**

- No React renderer or builder UI integration.
- No JSON Schema compiler, AJV integration, or Zod helper.
- No repeaters beyond fail-closed diagnostics and reserved path grammar support.
- No browser file upload orchestration; only normalized file metadata contracts.
- No async validators or async predicates.
- No persistence adapter, transport client, REST/GraphQL helper, or backend SDK.
- No full visual design system or theme work.

## Decisions

### Decision 1: Keep runtime modules pure and small

Implement behavior in focused modules under `packages/core/src/`:

- `paths`: parse/serialize, segment validation, safe get/set/delete helpers.
- `safety`: dangerous-key scanning and executable-code detection helpers shared across schema, submissions, and responses.
- `schema`: traversal, lookup indexes, publish diagnostics, field/node classification.
- `validation`: MVP validation primitives and validation plan helpers.
- `conditions`: expression evaluation, dependency extraction, predicate registration checks, cycle detection.
- `submissions`: empty normalization, hidden filtering, envelope creation, file metadata validation.
- `responses`: backend response parsing and field/global error mapping.
- `migrations`: migration runner shell.

Alternative considered: keep adding behavior to fixture helpers. Rejected because fixture helpers are test support and would blur the public runtime API.

### Decision 2: Use diagnostic-returning APIs instead of throwing for domain failures

Runtime functions should generally return result objects with `ok`, `value`, and `diagnostics` rather than throwing for invalid schemas, invalid submissions, or malformed responses. Throwing remains acceptable only for programmer misuse that cannot be represented as user-facing diagnostics.

Alternative considered: throw exceptions for invalid contracts. Rejected because builder publish checks, renderer flows, and backend conformance tooling need to collect multiple diagnostics and present them coherently.

### Decision 3: Preserve a single source of path truth

All schema names, runtime paths, error paths, getter/setter behavior, and normalized submission data construction must use the path module. Other modules must not hand-parse dot paths.

Alternative considered: simple string splitting in each caller. Rejected because dangerous-key rejection, array-marker semantics, and future indexed paths would drift quickly.

### Decision 4: Runtime validation is pragmatic and dependency-free

Core implements MVP validation primitives directly: required, string length, word count, numeric min/max, integer, step, pattern, email, URL, option membership, selection count, and accepted. Regex checks use JavaScript `RegExp` with contract restrictions and diagnostics; backend parity and JSON Schema portability remain future validator/compiler concerns.

Alternative considered: introduce AJV, Zod, validator.js, or another library. Rejected for Phase 3 because `packages/core` must stay dependency-light and framework/backend agnostic.

### Decision 5: Custom extensions fail closed through registries

Custom validators and predicates are referenced by key/version and must be provided through explicit registry objects passed to runtime checks. Unknown keys, missing versions, unsupported versions, async declarations, and executable-code attempts produce diagnostics.

Alternative considered: skip unknown custom behavior at runtime. Rejected because the architecture requires fail-closed behavior.

### Decision 6: Hidden filtering is a final-submission concern

The core submission helpers should accept runtime values and visibility/enabled analysis, then filter final data according to hidden-value semantics. Runtime UI state recovery stays out of core; core only determines what should be validated and submitted.

Alternative considered: core owns renderer state transitions. Rejected because focus recovery, touched/dirty state, and visible error display belong in React renderer phases.

### Decision 7: Migration shell establishes shape, not policy-heavy migrations

Add a migration runner with versioned migration entries, ordered execution, diagnostics, and no-op behavior for current `1.0.0`. Do not add real cross-version product migrations until a future schema version exists.

Alternative considered: defer migrations entirely. Rejected because published revisions are immutable and future agents need the migration boundary before runtime behavior grows.

## Risks / Trade-offs

- Runtime APIs may become too broad in one phase -> Mitigate with module-level tests, narrow exports, and a report that calls out any deferred behavior.
- Path parser edge cases can create security issues -> Mitigate by testing valid/invalid schema paths, runtime paths, dangerous segments, arrays, empty segments, object getter/setter pollution attempts, and backend error paths.
- Validation semantics can drift from docs -> Mitigate by adding table-driven tests from the Phase 1 validation and empty-normalization docs.
- Condition evaluation can become complex -> Mitigate by implementing synchronous MVP operators first, explicit limits, dependency extraction, and cycle tests before predicates.
- Hidden-value behavior can surprise users -> Mitigate by making the default exclusion policy explicit in tests and report examples.
- Response parsing may over-normalize backend bugs -> Mitigate by preserving diagnostics for unknown statuses, malformed errors, invalid paths, and dangerous params.
- Fixture helper behavior may duplicate runtime behavior -> Mitigate by either reusing runtime diagnostics in fixture tests or clearly keeping fixture helpers as thin wrappers over runtime modules.

## Migration Plan

1. Add failing tests for each runtime module before implementation.
2. Implement path and safety helpers first because all other modules depend on them.
3. Implement schema diagnostics and traversal next.
4. Implement validation and condition runtime behavior.
5. Implement hidden filtering, submission envelope creation, response parsing, and migration shell.
6. Update fixture tests to use the real runtime behavior where practical.
7. Run package and workspace verification.
8. Write `docs/reports/2026-05-14-phase-3-core-runtime.md`.
9. Commit the OpenSpec artifacts, implementation, tests, and report.
10. Stop for owner review before React packages depend on the new APIs.

Rollback is straightforward before later phases depend on these APIs: revert the Phase 3 commit or keep APIs marked internal until the owner review approves them.

## Open Questions

- Should runtime-generated `submissionAttemptId` be provided only by the host/renderer, or should core also expose a small helper for caller-provided id factories?
- Should email and URL validation be deliberately minimal in Phase 3, with stricter policy deferred to backend/validators, or should the core include a stronger built-in policy now?
- Should the migration shell be exported from the public package root immediately, or kept as an internal module until the first real migration exists?
