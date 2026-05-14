# Backend JSON Schema Integration

Phase 4 generated JSON Schema is a backend-friendly artifact, not the canonical authoring model. Backends can use it to validate submitted data shape, while still enforcing revision integrity, auth, rate limits, trusted file metadata, and business rules server-side.

```ts
import { compileJsonSchema } from "@your-org/forms-validators";

const result = compileJsonSchema(canonicalSchema);

if (result.diagnostics.length > 0) {
  console.log(result.diagnostics);
}

const submittedDataSchema = result.schema;
```

The compiler result includes:

- `schema`: Draft 2020-12 JSON Schema for submitted `data`.
- `diagnostics`: warnings and errors for unsupported or unsafe behavior.
- `validationPlan`: validation behavior that JSON Schema does not fully represent.
- `conditionDependencies`: submitted paths used by conditions.

Backends should return normalized response fixtures compatible with `docs/schema/backend-response-v1.md`.
