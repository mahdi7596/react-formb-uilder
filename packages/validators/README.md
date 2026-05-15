# @your-org/forms-validators

Optional backend-friendly validation artifacts and compiler behavior.

## Responsibility

This package owns generated JSON Schema artifacts, compiler diagnostics, validation-plan output, condition dependency output, and builder review bundles.

Canonical schema authoring and runtime behavior remain in `@your-org/forms-core`. Generated JSON Schema is a backend-friendly artifact, not the authoring source of truth.

## JSON Schema Compiler

`compileJsonSchema(schema, options)` returns:

- `schema`: Draft 2020-12 submitted-data JSON Schema
- `diagnostics`: compiler diagnostics with original codes and severity
- `validationPlan`: validation behavior that cannot be fully represented in JSON Schema
- `conditionDependencies`: condition dependency metadata for visibility, enabled state, and conditional validation

## Builder Artifact Bundle

`createBuilderArtifactBundle(schema, options)` returns the compiler output plus publish-review metadata:

- `dialect`: `https://json-schema.org/draft/2020-12/schema`
- `generatedAt`: a provided timestamp or deterministic marker
- `fixtureReferences`: conformance fixture references grouped by category

The React builder can display this bundle in generated artifact and publish checklist surfaces. The builder must consume this compiler-owned output rather than reimplementing JSON Schema generation or compiler diagnostics.

## Boundaries

- Do not import React or builder UI code.
- Do not put JSON Schema generation in `packages/core`.
- Preserve compiler diagnostic codes and severity so publish checks can classify blocking errors and reviewable warnings.
- Keep generated artifacts JSON-serializable for backend handoff and documentation.

## Read More

- Root onboarding: [../../README.md](../../README.md)
- JSON Schema generation: [../../docs/integration/json-schema-generation.md](../../docs/integration/json-schema-generation.md)
- Backend contracts: [../../docs/integration/backend-contracts.md](../../docs/integration/backend-contracts.md)
- Backend conformance fixtures: [../../docs/schema/backend-conformance-fixtures-v1.md](../../docs/schema/backend-conformance-fixtures-v1.md)
- Schema and submission safety: [../../docs/security/schema-and-submission-safety.md](../../docs/security/schema-and-submission-safety.md)
