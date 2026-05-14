# Submitted Path Grammar V1

Status: Phase 1 contract

Submitted paths define where field values appear inside the normalized submission `data` object. They are backend-facing contracts and must be stable, predictable, and safe to parse in multiple languages.

## Goals

- Keep submitted paths readable and portable across JavaScript and non-JavaScript backends.
- Prevent prototype pollution and dangerous object mutation.
- Avoid ambiguous path parsing.
- Make dangerous data contract changes visible before publish.

## Grammar

MVP paths use dot-separated object segments and bracket array markers.

```text
path          = segment ( "." segment | array-marker )*
segment       = identifier
identifier    = ALPHA_OR_UNDERSCORE ( ALPHA_OR_DIGIT_OR_UNDERSCORE | "-" )*
array-marker  = "[]"
```

Examples:

```text
email
user.email
billing-address.line1
items[].quantity
items[].sku
```

Submitted paths in schemas use `[]` to describe array item fields. Runtime error paths and submitted backend errors use concrete indexes such as `items[0].quantity` only when referring to a submitted value instance.

## Segment Rules

Allowed segment characters:

- ASCII letters `A-Z` and `a-z`
- digits `0-9`, except as the first character
- underscore `_`
- hyphen `-`

Disallowed:

- empty segments
- spaces
- dots inside a segment
- brackets inside a segment
- slash, backslash, colon, quotes, control characters, and null bytes
- escaped dots
- wildcard operators

Keys with dots are disallowed in MVP. Host adapters can map canonical names to backend names that contain dots if needed. This avoids introducing escape syntax before it is required.

## Array Syntax

Schema paths use `[]` for a repeated item contract:

```text
addresses[].city
```

Concrete runtime paths use numeric indexes:

```text
addresses[0].city
```

Repeaters are excluded from MVP, so `[]` support is reserved for future contracts and for compiler/path grammar compatibility. MVP implementations must reject repeater nodes unless a separate change specifies their state, validation, accessibility, migration, and JSON Schema behavior.

## Dangerous Keys

The following keys are rejected anywhere they appear as object keys or path segments:

```text
__proto__
constructor
prototype
```

Rejection applies to:

- submitted paths
- schema object keys
- node ids when they would be used as object keys
- defaults
- props
- validation params
- condition values when object-shaped
- `ui`
- `meta`
- localizations
- submission `data`
- submission `files`
- submission `meta`
- backend responses
- backend error `params`

Comparison is exact and case-sensitive in MVP. Future stricter policies can reject case variants if needed.

## Path Examples

Valid:

```text
email
fullName
user.email
company_id
billing-address.line1
utm.source
items[].quantity
```

Invalid:

```text
.email
email.
user..email
user\.email
user["email"]
__proto__.polluted
profile.constructor.name
items[0].quantity
first name
name*
```

`items[0].quantity` is invalid as a schema field `name`; it is valid only as a runtime error path that points to a submitted value instance.

## Runtime Error Paths

Backend and runtime errors can use either:

- `null` for global form errors
- a submitted field path such as `email`
- an indexed runtime path such as `addresses[0].city` after repeaters are specified

The renderer must map error paths to visible fields where possible. Unknown valid paths can be shown in a global error summary.

## Empty Value Normalization

Runtime input state and final submission normalization are separate. Runtime state may preserve typed invalid strings so users can correct input. Final submission values follow this table after validation and hidden-value filtering:

| Field type | Empty runtime value | Final normalized value |
| --- | --- | --- |
| `text` | `""` | omitted unless required or explicitly preserved |
| `textarea` | `""` | omitted unless required or explicitly preserved |
| `number` | `null` | omitted when `null` |
| `email` | `""` | omitted unless required or explicitly preserved |
| `phone` | `""` | omitted unless required or explicitly preserved |
| `url` | `""` | omitted unless required or explicitly preserved |
| `radio` | `null` | omitted when `null` |
| `checkboxGroup` | `[]` | omitted when empty unless explicitly preserved |
| `select` | `null` | omitted when `null` |
| `checkbox` | `false` | submitted as `false` only when field is present and enabled |
| `switch` | `false` | submitted as `false` only when field is present and enabled |
| `date` | `null` | omitted when `null` |
| `time` | `null` | omitted when `null` |
| `rating` | `null` | omitted when `null` |
| `linearScale` | `null` | omitted when `null` |
| `hidden` | configured | follows hidden-value semantics |
| `fileMetadata` | `[]` | omitted when empty unless explicitly preserved |

Required validation runs before omission decisions for visible and enabled fields.

## Data Contract Changes

The builder must treat these as dangerous changes before publish:

- changing `name`
- changing scalar value shape to array value shape
- changing array value shape to scalar value shape
- deleting a field with historical submissions
- changing choice option `value`
- changing hidden-value policy
- changing file metadata semantics

Published revisions are immutable. A dangerous change creates a new draft revision and must be surfaced before publish.
