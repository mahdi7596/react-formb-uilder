# JSON Schema Generation

`@your-org/forms-validators` generates Draft 2020-12 JSON Schema for submitted `data`. The generated schema is a backend-friendly artifact, not the canonical authoring model.

## Basic Usage

```ts
import { compileJsonSchema } from "@your-org/forms-validators";

const result = compileJsonSchema(canonicalSchema);

console.log(result.schema);
console.log(result.diagnostics);
console.log(result.validationPlan);
console.log(result.conditionDependencies);
```

`compileJsonSchema(schema, options)` returns:

- `schema`: Draft 2020-12 submitted-data JSON Schema.
- `diagnostics`: compiler diagnostics with severity and original diagnostic codes.
- `validationPlan`: validation behavior that JSON Schema cannot fully represent.
- `conditionDependencies`: submitted paths used by visibility, enabled-state, and conditional validation behavior.

## Builder Artifact Bundle

The builder uses `createBuilderArtifactBundle(schema, options)`:

```ts
import { createBuilderArtifactBundle } from "@your-org/forms-validators";

const bundle = createBuilderArtifactBundle(schema, {
  generatedAt: "2026-05-15T00:00:00.000Z"
});
```

The bundle includes compiler output plus:

- `dialect`: `https://json-schema.org/draft/2020-12/schema`
- `generatedAt`
- `fixtureReferences`

## What JSON Schema Covers

Where representable, the compiler emits submitted data shape for:

- string-like fields
- email and URL formats
- date and time strings
- number-like fields
- boolean fields
- single choice enum values
- checkbox group arrays
- file metadata objects
- required fields
- basic min/max and pattern constraints

## Limitations And Diagnostics

JSON Schema does not own UI behavior. The compiler emits diagnostics or validation-plan entries for behavior that needs product runtime or backend parity, including:

- conditional visibility or conditional validation
- custom validators
- custom fields without JSON Schema hooks
- upload lifecycle behavior
- repeaters
- unsupported submitted paths
- unsafe keys
- behavior tied to publish gating or dangerous-change review

Backends should treat compiler diagnostics as review inputs, not as optional noise.

## Backend Consumption

A backend can use the generated schema to validate submitted `data`, but it must still enforce:

- revision identity and revision hash checks
- auth and rate limits
- idempotency or duplicate submission rules
- trusted file metadata rules
- business rules outside schema shape
- normalized backend responses

## Related Docs

- [Backend contracts](backend-contracts.md)
- [Backend JSON Schema short form](backend-json-schema.md)
- [Backend conformance fixtures](../schema/backend-conformance-fixtures-v1.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
