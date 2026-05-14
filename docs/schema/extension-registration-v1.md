# Extension Registration V1

Status: Phase 1 contract

Extensions allow host apps to add fields, validators, and predicates without storing executable code in schemas. Schemas reference extension behavior by registered keys and versions.

## Non-Executable Schema Rule

Persisted schemas must not contain:

- executable JavaScript
- React components
- serialized functions
- code strings intended for evaluation
- backend-specific handlers
- secrets

Schemas can reference registered extension keys:

```json
{
  "fieldType": "currency"
}
```

## Custom Field Registration

Conceptual registration shape:

```ts
registry.registerField("currency", {
  version: "1.0.0",
  validateConfig: currencyConfigSchema,
  valueContract: currencyValueContract,
  normalizeValue: normalizeCurrency,
  toJsonSchema: currencyToJsonSchema,
  component: CurrencyField
});
```

The persisted schema stores only JSON:

```json
{
  "id": "budget",
  "type": "field",
  "fieldType": "currency",
  "name": "budget",
  "props": {
    "currency": "USD",
    "minorUnits": 2
  }
}
```

Custom field registration must declare:

- key
- version
- JSON config contract
- submitted value contract
- default value contract
- accessibility contract
- normalization behavior
- validation support
- JSON Schema generation support or unsupported diagnostic
- whether backend parity is required

Unknown custom fields block publish and runtime rendering unless the renderer is configured with a safe fallback that does not submit data.

## Custom Validator Registration

Conceptual registration shape:

```ts
registry.registerValidator("businessEmail", {
  version: "1.0.0",
  fieldTypes: ["email", "text"],
  validateParams: paramsContract,
  validate: businessEmailValidator,
  backendParityRequired: true
});
```

Persisted schema:

```json
{
  "type": "businessEmail",
  "version": "1.0.0",
  "params": {
    "allowSubdomains": true
  }
}
```

Custom validator registration must declare:

- key
- version
- supported field types
- params contract
- output error code contract
- sync or async behavior; async is outside MVP
- backend parity requirement
- diagnostics for missing backend parity

Unknown validators fail closed.

## Custom Predicate Registration

Conceptual registration shape:

```ts
registry.registerPredicate("isBusinessEmail", {
  version: "1.0.0",
  argsContract: argsContract,
  dependencies: ["email"],
  evaluate: isBusinessEmail,
  backendParityRequired: false
});
```

Persisted condition:

```json
{
  "predicate": "isBusinessEmail",
  "version": "1.0.0",
  "args": ["email"]
}
```

Custom predicate registration must declare:

- key
- version
- args contract
- dependency extraction
- missing-value behavior
- output boolean contract
- sync or async behavior; async is outside MVP
- backend parity requirement

Unknown predicates fail closed.

## Versioning

Extension versions are explicit strings. A schema referencing `businessEmail@1.0.0` must not silently use incompatible behavior from `2.0.0`.

Allowed version behavior:

- exact match by default
- host-configured compatibility aliases only when explicitly declared
- diagnostics when version is missing or unsupported

## Backend Parity

Some extensions require backend parity because frontend validation or visibility cannot be trusted.

If backend parity is required:

- publish checks must verify that backend support is declared
- generated conformance fixtures should include success and failure examples
- compiler diagnostics must identify unsupported backend artifacts

## Accessibility Contract For Custom Fields

Every custom field must support renderer-managed:

- input id
- label id
- description id
- error id
- `aria-describedby`
- `aria-invalid`
- required state
- disabled state
- focus target
- value binding
- error display

Custom fields that cannot satisfy the accessibility contract must block publish.

## Diagnostics

Extension diagnostics include:

- unknown extension key
- missing version
- unsupported version
- invalid props/config
- invalid default value
- invalid submitted value contract
- missing JSON Schema generator when required
- missing backend parity when required
- accessibility contract failure
- attempted executable schema code

Diagnostics that could lead to unsafe runtime behavior must fail closed.
