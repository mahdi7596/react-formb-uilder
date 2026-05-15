# Backend JSON Schema Integration

This is the short-form compatibility page for backend teams looking specifically for generated JSON Schema. The full guide is [JSON Schema generation](json-schema-generation.md).

Generated JSON Schema is a backend-friendly artifact, not the canonical authoring model. Backends can use it to validate submitted data shape while still enforcing revision integrity, auth, rate limits, trusted file metadata, idempotency, and business rules server-side.

```ts
import { compileJsonSchema } from "@your-org/forms-validators";

const result = compileJsonSchema(canonicalSchema);
const submittedDataSchema = result.schema;
const diagnostics = result.diagnostics;
```

Read these before integrating:

- [JSON Schema generation](json-schema-generation.md)
- [Backend contracts](backend-contracts.md)
- [Backend response contract](../schema/backend-response-v1.md)
- [Backend conformance fixtures](../schema/backend-conformance-fixtures-v1.md)
