## Context

The project is a package-first backend-agnostic React form builder. Phase 0 created the monorepo scaffold and archived the bootstrap change. The next dependency blocker is contract clarity: the architecture requires formal schema, path, validation, condition, submission, response, extension, JSON Schema generation, hidden-value, MVP, and conformance fixture decisions before core runtime behavior is implemented.

This change is intentionally documentation-first. It creates durable contract documents under `docs/schema/` so later phases can implement `packages/core` and `packages/validators` without rediscovering product semantics.

## Goals / Non-Goals

**Goals:**

- Define canonical schema v1 as the authoring and rendering source of truth.
- Define submitted data path grammar and dangerous-key rejection.
- Define MVP field, node, value, and empty-value semantics.
- Define normalized submission and backend response envelopes.
- Define validation rule and validation error contracts.
- Define deterministic condition semantics with dependency tracking and cycle detection.
- Define hidden-field value behavior.
- Define custom field, validator, and predicate registration contracts.
- Define JSON Schema generation scope, dialect, outputs, and diagnostics.
- Define backend conformance fixture categories required before implementation.
- Produce a Phase 1 report mapping the architecture pre-implementation checklist to completed docs.

**Non-Goals:**

- Do not implement TypeScript types or runtime behavior in `packages/core`.
- Do not implement validators, JSON Schema compiler code, AJV integration, or Zod integration.
- Do not implement React renderer or builder behavior.
- Do not implement upload orchestration, repeaters, payments, rich text, computed fields, or workflow automation.
- Do not introduce new dependencies.

## Decisions

### Treat Phase 1 docs as normative contracts

The `docs/schema/*-v1.md` documents created by this change become the source that Phase 2 tests and types must follow.

Alternatives considered:

- Start with TypeScript types first: faster, but risks encoding unclear behavior as code.
- Put everything in one large schema doc: simpler file count, but harder to review and easier to miss contract gaps.

### Split contracts by domain

Use separate documents for canonical schema, paths, submissions, backend responses, validation, conditions, hidden values, extensions, JSON Schema generation, and conformance fixtures.

This keeps each contract reviewable and lets future changes target the smallest relevant document.

### Keep repeaters out of MVP

Repeaters have path, state identity, error mapping, migration, accessibility, and JSON Schema complexity. This phase should explicitly exclude them from MVP rather than partially specify weak behavior.

### Keep upload orchestration out of MVP

The MVP may define file metadata value contracts if needed, but built-in upload prepare/finalize/scanning/provider orchestration stays out until upload lifecycle semantics are specified in a later change.

### Use Draft 2020-12 for generated JSON Schema

Draft 2020-12 is the baseline dialect for future generated submitted-data schemas. Generated JSON Schema remains a structural validation and documentation artifact, not a representation of UI behavior.

### Fail closed for unknown extensions

Unknown custom fields, validators, predicates, unsafe keys, and unsupported compiler behavior must produce diagnostics that block publish or runtime use depending on context.

### Prefer conservative path grammar

Submitted paths should be human-readable and backend-friendly. Keys with dots should be disallowed in MVP unless an explicit escape syntax is specified in the path grammar document.

## Risks / Trade-offs

- Too many docs can slow review -> Keep each document focused and include examples.
- Excluding repeaters may feel limiting -> It prevents unstable array semantics from leaking into MVP.
- Excluding upload orchestration may defer a common form-builder feature -> Metadata-only contracts keep MVP safe while leaving room for host-managed uploads.
- Conservative path grammar may reject some backend field names -> Backend adapters can map names later; canonical submitted paths should stay predictable.
- JSON Schema cannot represent all form behavior -> Compiler diagnostics must be explicit and tested in Phase 2/4.
- Documentation may drift from implementation -> Phase 2 must create fixtures and tests directly from these docs.

## Migration Plan

This is a pre-implementation contract change, so there is no product data migration.

Implementation flow:

1. Create the Phase 1 contract docs under `docs/schema/`.
2. Verify architecture checklist coverage.
3. Run documentation consistency checks.
4. Write the Phase 1 report.
5. Stop for owner review before Phase 2 begins.

If a contract is rejected during review, revise the relevant `docs/schema/*-v1.md` file before implementation begins.

## Open Questions

- Should file metadata fields be included in MVP as a value contract, or should all file fields be delayed until upload lifecycle semantics are specified?
- Should phone values be a conservative string in MVP, or a compound object with raw, country, E.164, and extension fields?
- Should keys with dots be fully disallowed in MVP submitted paths, or supported through explicit escaping?
- Should conditional requiredness be included in MVP validation rules, or delayed until after simple visibility conditions are implemented?
