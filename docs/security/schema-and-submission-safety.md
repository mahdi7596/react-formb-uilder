# Schema And Submission Safety

The form builder is backend-agnostic because schemas, submissions, responses, and adapter results are normalized JSON contracts. Safety depends on keeping those contracts declarative and rejecting dangerous input early.

## Dangerous Keys

Reject dangerous object keys in schemas, defaults, props, metadata, submissions, backend responses, and adapter data:

- `__proto__`
- `constructor`
- `prototype`

Core and adapter helpers expose dangerous-key diagnostics. Hosts should reject payloads with these keys instead of trying to sanitize them silently.

## Submitted Paths

Submitted paths define where field values appear in submitted `data`. They must follow [submitted path grammar](../schema/submitted-path-grammar-v1.md).

Unsafe or invalid submitted paths must fail closed. Builders should surface diagnostics before publish; renderers and backends should not submit or accept ambiguous paths.

## Persisted Schema Rules

Persisted schemas must not store:

- executable JavaScript
- React components
- DOM objects
- backend SDK objects
- transport clients
- functions
- library-specific form state

Custom behavior is referenced by string keys and resolved by host registries.

## Submission Envelopes

Renderer submissions use [submission envelope](../schema/submission-envelope-v1.md) fields:

- `formId`
- `revisionId`
- `revisionHash`
- `schemaVersion`
- `submissionAttemptId`
- `submittedAt`
- `locale`
- `data`
- `files`
- `meta`

Backends must verify revision identity and revision hash. Generated JSON Schema can validate submitted `data` shape, but it does not replace backend authorization, rate limiting, idempotency, trusted file metadata, or business rules.

## Hidden Values

Hidden values are excluded from final submission by default. If a schema explicitly preserves hidden values, host teams should review why and ensure backend behavior matches the product contract.

Read [hidden value semantics](../schema/hidden-value-semantics-v1.md).

## Backend Responses

Backend responses must follow [backend response](../schema/backend-response-v1.md). Field errors use submitted paths. Global errors use top-level messages. Transport exceptions should be normalized before reaching renderer UI.

## Custom Extensions

Extension contracts are described in [extension registration](../schema/extension-registration-v1.md).

Custom field registration example:

```ts
import type { CustomFieldRegistration } from "@your-org/forms-core";

const currencyField: CustomFieldRegistration = {
  key: "currency",
  version: "1.0.0",
  configContract: { type: "object" },
  valueContract: { type: "string" },
  defaultValue: "",
  backendParityRequired: true,
  supportsJsonSchema: false
};
```

Custom validator registration example:

```ts
import type { CustomValidatorRegistration } from "@your-org/forms-core";

const knownCustomerValidator: CustomValidatorRegistration = {
  key: "custom:knownCustomer",
  version: "1.0.0",
  fieldTypes: ["email"],
  paramsContract: { type: "object" },
  backendParityRequired: true,
  async: false
};
```

Custom predicate registration example:

```ts
import type { CustomPredicateRegistration } from "@your-org/forms-core";

const hasPlanPredicate: CustomPredicateRegistration = {
  key: "custom:hasPlan",
  version: "1.0.0",
  argsContract: { type: "object" },
  dependencies: ["plan"],
  backendParityRequired: true,
  async: false
};
```

Unknown custom fields, validators, and predicates must fail closed with diagnostics. Missing backend parity should appear in diagnostics or generated artifact review when the backend must enforce the same rule.

## Related Docs

- [Canonical schema](../schema/canonical-schema-v1.md)
- [Submitted path grammar](../schema/submitted-path-grammar-v1.md)
- [Submission envelope](../schema/submission-envelope-v1.md)
- [Backend response](../schema/backend-response-v1.md)
- [Validation rules](../schema/validation-rules-v1.md)
- [Conditions](../schema/conditions-v1.md)
- [Hidden value semantics](../schema/hidden-value-semantics-v1.md)
- [Extension registration](../schema/extension-registration-v1.md)
- [Backend contracts](../integration/backend-contracts.md)
