# JSON Schema Generation V1

Status: Phase 1 contract

Generated JSON Schema is an optional backend-friendly structural validation and documentation artifact. It is not the canonical authoring model and does not represent all form behavior.

## Dialect

All generated schemas target JSON Schema Draft 2020-12.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema"
}
```

Future dialect changes require a dated decision and migration plan.

## Compiler Inputs

The compiler consumes:

- canonical schema v1
- field registry contracts
- custom validator contracts
- custom predicate contracts
- generation options

The compiler must treat the canonical schema as untrusted input until validated.

## Compiler Outputs

The compiler can emit:

- submitted data JSON Schema
- validation plan
- condition dependency graph
- unsupported feature warnings
- optional documentation metadata

These outputs are separate artifacts. The submitted data JSON Schema must not pretend to cover behavior that belongs in validation plans, conditions, renderer logic, or backend workflows.

## Submitted Data JSON Schema

Example output:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["email"]
}
```

Representable MVP field shapes:

| Field type | JSON Schema representation |
| --- | --- |
| `text` | `type: "string"` |
| `textarea` | `type: "string"` |
| `number` | `type: "number"` or `type: "integer"` when integer rule exists |
| `email` | `type: "string"`, `format: "email"` |
| `phone` | `type: "string"` |
| `url` | `type: "string"`, `format: "uri"` |
| `radio` | `enum` of option values |
| `checkboxGroup` | `type: "array"`, `items.enum` |
| `select` | `enum` of option values |
| `checkbox` | `type: "boolean"` |
| `switch` | `type: "boolean"` |
| `date` | `type: "string"`, `format: "date"` |
| `time` | `type: "string"`, `pattern` for MVP time format |
| `rating` | `type: "number"` with min/max |
| `linearScale` | `type: "number"` with min/max |
| `hidden` | inferred from configured value contract |
| `fileMetadata` | `type: "array"` of file metadata references |

## Non-Goals

Generated JSON Schema does not represent:

- renderer UI
- labels and descriptions as behavior
- slots
- React components
- conditional visibility
- conditional enabled state
- custom field rendering
- upload lifecycle
- browser upload orchestration
- builder metadata
- migration warnings
- arbitrary backend authorization
- spam protection
- rich text sanitization

## Validation Rule Mapping

Representable examples:

| Canonical rule | JSON Schema keyword |
| --- | --- |
| `required` | parent object `required` |
| `minLength` | `minLength` |
| `maxLength` | `maxLength` |
| `min` | `minimum` |
| `max` | `maximum` |
| `integer` | `type: "integer"` |
| `pattern` | `pattern` if portable |
| `email` | `format: "email"` |
| `url` | `format: "uri"` |
| `option` | `enum` |
| `selectionCount.min` | `minItems` |
| `selectionCount.max` | `maxItems` |

Custom validators require either:

- registered JSON Schema generation support
- a compiler diagnostic saying they are not representable

## Compiler Warning Shape

```json
{
  "code": "condition_not_representable",
  "path": "nodes.business_email.visibility",
  "message": "This visibility rule cannot be fully represented in generated JSON Schema.",
  "severity": "warning",
  "meta": {}
}
```

Fields:

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `code` | string | yes | Machine-readable diagnostic code. |
| `path` | string | yes | Schema location, not submitted field path unless explicitly stated. |
| `message` | string | yes | Plain text explanation. |
| `severity` | string | yes | `info`, `warning`, or `error`. |
| `meta` | object | no | Safe structured context. |

## Diagnostic Codes

MVP compiler diagnostics include:

- `condition_not_representable`
- `custom_field_schema_missing`
- `custom_validator_not_representable`
- `custom_predicate_not_representable`
- `unsupported_regex`
- `repeater_not_supported`
- `upload_lifecycle_not_supported`
- `unknown_field_type`
- `invalid_submitted_path`
- `dangerous_key`
- `required_hidden_value`

Errors block artifact generation. Warnings allow artifact generation but must be surfaced to the builder and report.

## Additional Properties

Generated submitted data schemas should use `additionalProperties: false` by default to match known submitted paths. Host apps can opt into looser backend handling outside the canonical compiler.

## Conditions And Required Fields

Conditional requiredness is not fully representable in plain JSON Schema without advanced conditional schema output. MVP compiler behavior:

- unconditional required fields map to `required`
- conditional required fields emit validation plan entries
- conditional required fields emit a compiler warning if not represented in submitted data JSON Schema

## File Metadata Schema

File metadata values are references only:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": ["fileId"],
    "additionalProperties": false,
    "properties": {
      "fileId": { "type": "string" },
      "name": { "type": "string" },
      "mimeType": { "type": "string" },
      "size": { "type": "number", "minimum": 0 }
    }
  }
}
```

Upload prepare/finalize/scanning behavior is outside this schema.

## Backend Usage

Backends can use generated JSON Schema to validate submitted structure, but must still enforce:

- revision status
- revision hash
- authorization
- rate limits
- spam protection
- trusted file metadata
- custom validators requiring backend parity
- business rules not represented in JSON Schema
