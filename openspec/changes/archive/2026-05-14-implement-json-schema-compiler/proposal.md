## Why

The core package can now validate and normalize canonical form behavior, but backends still need a portable structural artifact they can inspect or consume without React. Phase 4 adds the optional JSON Schema compiler in `packages/validators` so host apps and non-JavaScript backends can validate submitted data shape while still treating the canonical form schema as the source of truth.

## What Changes

- Replace the `packages/validators` bootstrap placeholder with a Draft 2020-12 submitted-data JSON Schema compiler.
- Generate JSON Schema for representable MVP field types and validation rules.
- Emit explicit compiler diagnostics for behavior JSON Schema cannot represent, including conditional visibility, conditional requiredness, custom validators without JSON Schema generation support, unsupported regex patterns, unknown field types, repeaters, upload lifecycle behavior, dangerous keys, and invalid submitted paths.
- Add compiler output types for submitted-data schema, validation plan entries, condition dependency graph entries, and diagnostics.
- Add validator package fixtures for generated schemas and unsupported compiler behavior.
- Add examples showing how a non-React/backend consumer can use generated JSON Schema plus diagnostics and backend response fixtures.
- Keep AJV helpers optional and outside `packages/core`; do not make `packages/core` depend on `packages/validators`.
- Add tests and a Phase 4 report.

## Capabilities

### New Capabilities

- `json-schema-compiler`: Optional backend-friendly Draft 2020-12 JSON Schema generation, validation-plan artifact generation, compiler diagnostics, and generated-schema conformance fixtures for canonical form schemas.

### Modified Capabilities

- None. Existing `canonical-contracts`, `core-contract-fixtures`, and active/completed core runtime requirements remain source contracts. This change implements a separate compiler capability in `packages/validators`.

## Impact

- Affected package: `packages/validators`.
- Affected public API: new compiler functions and output types exported from `@your-org/forms-validators`.
- Affected tests: focused Vitest suites for field mappings, validation rule mappings, required fields, nested object path output, diagnostics, fixtures, and backend-consumption examples.
- Dependency boundary: `packages/validators` may depend on `@your-org/forms-core`; `packages/core` must not depend on `packages/validators`.
- Deferred: runtime validation remains in `packages/core`; React renderer and builder integration remain later phases; AJV runtime validation helpers are optional and should not be required for this compiler phase unless explicitly justified.
