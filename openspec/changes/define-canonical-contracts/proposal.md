## Why

The project cannot safely implement core runtime behavior until the canonical schema, submitted path grammar, validation model, condition model, submission envelope, backend response envelope, and extension contracts are specified. This change locks those contracts as documentation first so Phase 2 can build types, fixtures, and tests against stable behavior instead of informal assumptions.

## What Changes

- Define canonical form schema v1 as the source of truth for authoring and rendering.
- Define submitted path grammar, empty value normalization, and dangerous-key rejection rules.
- Define MVP scope decisions for field types, repeaters, uploads, and file metadata.
- Define normalized submission and backend response envelopes, including `revisionHash` and `submissionAttemptId`.
- Define validation rule contracts, validation error shape, and fail-closed behavior.
- Define deterministic condition evaluation, dependency tracking, missing-value behavior, and cycle detection requirements.
- Define hidden-field value semantics.
- Define custom field, custom validator, and custom predicate registration contracts.
- Define JSON Schema generation scope, Draft 2020-12 dialect, and compiler diagnostics.
- Define backend conformance fixture requirements for later implementation.
- Add a Phase 1 report documenting coverage of the architecture pre-implementation checklist.
- No TypeScript runtime behavior, React renderer behavior, builder UI, adapter implementation, or JSON Schema compiler implementation will be added in this change.

## Capabilities

### New Capabilities

- `canonical-contracts`: Defines the product's v1 JSON contracts for schema authoring, submitted paths, validation, conditions, hidden values, extensions, submissions, backend responses, JSON Schema generation, and backend conformance fixtures.

### Modified Capabilities

- None.

## Impact

- Affected documentation:
  - New schema contract docs under `docs/schema/`.
  - New Phase 1 report under `docs/reports/`.
  - OpenSpec artifacts under `openspec/changes/define-canonical-contracts/`.
- Affected packages:
  - No package source behavior changes.
  - Later phases will use these docs to implement `packages/core`, `packages/validators`, `packages/react-renderer`, `packages/react-builder`, and `packages/adapters`.
- Dependencies:
  - No new runtime or development dependencies.
- API impact:
  - No exported TypeScript APIs yet.
  - This change defines the future public contract that implementation must follow.
