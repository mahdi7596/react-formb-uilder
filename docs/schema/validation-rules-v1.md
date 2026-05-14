# Validation Rules V1

Status: Phase 1 contract

Validation rules are declarative schema entries used by the renderer, publish checks, generated validation plans, and backend conformance fixtures. Backend validation remains authoritative.

## Validation Rule Shape

```json
{
  "type": "required",
  "message": "Email is required.",
  "params": {}
}
```

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `type` | string | yes | Built-in rule key or registered custom validator key. |
| `version` | string | custom | Required for custom validators. |
| `message` | string | no | Plain text override. Renderer may localize or override. |
| `params` | object | rule-specific | JSON-serializable rule parameters. Dangerous keys are rejected. |
| `when` | condition | no | Conditional validation guard, evaluated synchronously in MVP. |

Unknown rule types fail closed.

## Built-In MVP Rules

### Required

```json
{ "type": "required" }
```

Passes when value is non-empty by field type:

- non-empty string after configured trim
- non-null number
- non-null selected option
- non-empty array
- `true` for consent checkbox when configured as consent

### Min Length

```json
{ "type": "minLength", "params": { "min": 2 } }
```

Applies to strings. Length counting uses Unicode code points in MVP. Grapheme-aware length can be added through a separate contract change.

### Max Length

```json
{ "type": "maxLength", "params": { "max": 280 } }
```

Applies to strings.

### Min Words

```json
{ "type": "minWords", "params": { "min": 3 } }
```

Applies to textarea fields. Word counting is locale-sensitive and may produce diagnostics for locales where whitespace splitting is unreliable.

### Max Words

```json
{ "type": "maxWords", "params": { "max": 200 } }
```

Applies to textarea fields.

### Number Minimum

```json
{ "type": "min", "params": { "min": 18 } }
```

Applies to numeric values.

### Number Maximum

```json
{ "type": "max", "params": { "max": 120 } }
```

Applies to numeric values.

### Integer

```json
{ "type": "integer" }
```

Applies to numeric values.

### Step

```json
{ "type": "step", "params": { "step": 0.5 } }
```

Applies to numeric values. Floating precision must be handled consistently by core tests.

### Regex Pattern

```json
{
  "type": "pattern",
  "params": {
    "pattern": "^[A-Z0-9_-]+$"
  }
}
```

MVP regex restrictions:

- no lookbehind
- no engine-specific flags
- no catastrophic backtracking patterns where detectable
- max pattern length enforced by schema validation
- pattern must compile in JavaScript and be documented as potentially non-portable for other backends

If backend parity is required and a pattern is not portable, compiler diagnostics must warn or block.

### Email

```json
{ "type": "email" }
```

Uses pragmatic email format validation suitable for form UX. Backends can apply stricter policy.

### URL

```json
{
  "type": "url",
  "params": {
    "protocols": ["https", "http"]
  }
}
```

Validates URL syntax and optional protocol allowlist.

### Option Membership

```json
{ "type": "option" }
```

Ensures submitted option values exist in the field's current enabled option list. Historical submissions may contain old option values, but new submissions must use valid values.

### Selection Count

```json
{
  "type": "selectionCount",
  "params": {
    "min": 1,
    "max": 3
  }
}
```

Applies to checkbox groups.

### Consent Accepted

```json
{ "type": "accepted" }
```

Applies to consent checkbox fields. Passes only when value is `true`.

## Conditional Requiredness

Conditional requiredness is allowed only through a `when` condition on a `required` rule:

```json
{
  "type": "required",
  "when": {
    "all": [{ "field": "companyType", "op": "eq", "value": "business" }]
  }
}
```

The condition model is synchronous in MVP. Unknown predicates fail closed.

## Custom Named Validators

Custom validators use registered keys and versions:

```json
{
  "type": "businessEmail",
  "version": "1.0.0",
  "params": {
    "allowSubdomains": true
  },
  "message": "Use your work email."
}
```

Rules:

- Custom validators must be registered before use.
- Custom validators declare supported field types.
- Custom validators declare whether backend parity is required.
- Unknown custom validators produce hard diagnostics.
- Schemas must not contain executable validator code.

## Validation Error Mapping

Validation failures map to backend response error shape:

```json
{
  "path": "email",
  "code": "invalid_email",
  "message": "Enter a valid email address.",
  "params": {},
  "source": "client"
}
```

Codes should be machine-readable and stable. Messages are display text and can be localized.

## Hidden And Disabled Fields

Default behavior:

- hidden fields are not validated for final submission
- disabled fields are not validated for final submission
- preserved hidden values are not validated unless a validator explicitly opts into hidden validation

Backend validation can still reject submitted preserved hidden values.

## Diagnostics

Schema validation must produce diagnostics for:

- rule type not supported by field type
- missing params
- invalid param type
- unsupported regex
- unknown custom validator
- custom validator version mismatch
- backend parity required but no backend parity contract
- conditional validation with invalid condition

Diagnostics that could lead to unsafe acceptance must fail closed.
