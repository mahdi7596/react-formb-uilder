# Canonical Schema V1

Status: Phase 1 contract

This document defines the canonical form schema v1 for authoring, rendering, validation planning, condition evaluation, submissions, migrations, and backend-friendly compiler outputs. The canonical schema is the source of truth. Generated JSON Schema is an optional artifact and must not become the authoring model.

## Goals

- Keep persisted form definitions JSON-serializable and backend-agnostic.
- Keep React components, executable JavaScript, transport code, and backend-specific assumptions out of schemas.
- Keep internal node identity separate from submitted data paths.
- Make published revisions immutable.
- Define the smallest MVP that proves schema, renderer, validation, submissions, generated JSON Schema, and basic builder workflow.

## Top-Level Form Shape

```json
{
  "schemaVersion": "1.0.0",
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "revisionHash": "sha256_...",
  "status": "draft",
  "locale": "en",
  "direction": "ltr",
  "title": "Contact intake",
  "description": "Tell us how we can help.",
  "settings": {
    "submitMode": "final",
    "navigation": "singlePage",
    "validationTiming": "onBlur",
    "preserveHiddenValues": false
  },
  "nodes": [],
  "localizations": {},
  "meta": {}
}
```

## Top-Level Fields

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `schemaVersion` | string | yes | Product schema format version. MVP uses `1.0.0`. |
| `formId` | string | yes | Stable opaque form identifier assigned by the host product. |
| `revisionId` | string | yes | Stable opaque revision identifier. Published revisions are immutable. |
| `revisionHash` | string | yes for published | Hash of the canonical published revision used to detect mutation. |
| `status` | string | yes | One of `draft`, `published`, `archived`. |
| `locale` | string | yes | Default BCP 47 locale, such as `en`, `fa`, or `ar`. |
| `direction` | string | yes | One of `ltr`, `rtl`, `auto`. |
| `title` | string | yes | Plain text form title. |
| `description` | string | no | Plain text form description. |
| `settings` | object | yes | Runtime settings defined below. |
| `nodes` | array | yes | Flat list of nodes. Node order in this array is not authoritative for nested layout. |
| `localizations` | object | no | Per-locale display text overrides. |
| `meta` | object | no | JSON-serializable extension metadata. Dangerous keys are rejected. |

## Settings

```json
{
  "submitMode": "final",
  "navigation": "singlePage",
  "validationTiming": "onBlur",
  "preserveHiddenValues": false
}
```

| Field | Values | Default | Contract |
| --- | --- | --- | --- |
| `submitMode` | `final` | `final` | MVP submits one final normalized envelope. Partial submissions are outside MVP. |
| `navigation` | `singlePage`, `steps` | `singlePage` | `steps` uses structural `step` nodes. |
| `validationTiming` | `onSubmit`, `onBlur`, `onChange` | `onBlur` | Renderer timing hint. Backend validation remains authoritative. |
| `preserveHiddenValues` | boolean | `false` | Default hidden values are excluded from final submission. |

Unknown settings must produce diagnostics. Hosts may store extension settings under `meta` with registered keys.

## Identity Rules

`id` and `name` are separate concepts.

- `id` is a stable internal node identity used by builder selection, migrations, condition references, diagnostics, and renderer bookkeeping.
- `name` is the submitted data path used for field values. Changing `name` is a data contract change and must be treated as dangerous before publish.

Node ids:

- Must be unique within a form revision.
- Must be non-empty strings.
- Must not use dangerous keys: `__proto__`, `constructor`, or `prototype`.
- Should be opaque enough to survive label changes.

Submitted names:

- Exist only on submittable input fields.
- Must follow `submitted-path-grammar-v1.md`.
- Must be unique among fields that can submit values at the same submitted path.

## Node Model

Every node has this base shape:

```json
{
  "id": "full_name",
  "type": "field",
  "label": "Full name",
  "description": "Use your legal name.",
  "visibility": null,
  "enabledWhen": null,
  "ui": {},
  "meta": {}
}
```

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `id` | string | yes | Stable internal node id. |
| `type` | string | yes | MVP values are `field`, `section`, `step`, `content`, `ending`, `hidden`. |
| `label` | string | depends | Plain text display label or accessible name. |
| `description` | string | no | Plain text help text. |
| `visibility` | condition | no | Declarative visibility condition. |
| `enabledWhen` | condition | no | Declarative enabled/disabled condition. |
| `ui` | object | no | Non-authoritative presentation hints. |
| `meta` | object | no | JSON-serializable extension metadata. |

Labels, descriptions, option labels, and error text are plain text in MVP. Rich text authoring is outside MVP.

## MVP Node Contracts

### Field Node

Field nodes collect or represent a submitted value.

```json
{
  "id": "email",
  "type": "field",
  "fieldType": "email",
  "name": "email",
  "label": "Email",
  "defaultValue": "",
  "validation": [{ "type": "required" }],
  "props": {},
  "meta": {}
}
```

Required fields:

- `fieldType`: registered field renderer key.
- `name`: submitted path, except for display-only fields.
- `label`: required accessible name unless a specific field contract defines an accessible label override.

### Section Node

Section nodes group child nodes without creating a submitted object by themselves.

```json
{
  "id": "contact_section",
  "type": "section",
  "label": "Contact details",
  "children": ["full_name", "email"]
}
```

Sections:

- Must list child node ids in render order.
- Must not have `name`.
- Do not submit values.

### Step Node

Step nodes define multi-step navigation.

```json
{
  "id": "step_contact",
  "type": "step",
  "label": "Contact",
  "children": ["full_name", "email"]
}
```

Steps:

- Must list child node ids in render order.
- Must not have `name`.
- Use form setting `navigation: "steps"`.
- Are validated according to renderer step-navigation settings.

### Content Node

Content nodes render non-submittable content.

```json
{
  "id": "intro",
  "type": "content",
  "contentType": "paragraph",
  "label": "Welcome",
  "props": {
    "text": "Please answer a few questions."
  }
}
```

MVP content types:

- `heading`
- `paragraph`
- `image`
- `divider`

Content nodes:

- Must not submit values.
- Must keep text plain in MVP.
- Image nodes use metadata and URLs provided by the host; upload orchestration is not part of this contract.

### Ending Node

Ending nodes describe final respondent messaging.

```json
{
  "id": "thank_you",
  "type": "ending",
  "label": "Thank you",
  "props": {
    "message": "We received your response."
  }
}
```

Ending nodes:

- Must not submit values.
- Can be selected by future branching rules.
- Are plain text in MVP.

### Hidden Node

Hidden nodes capture host-provided or URL-derived values without rendering an input.

```json
{
  "id": "utm_source",
  "type": "hidden",
  "fieldType": "hidden",
  "name": "utm.source",
  "defaultValue": "",
  "props": {
    "source": "urlParam",
    "param": "utm_source"
  }
}
```

Hidden nodes:

- Must follow submitted path grammar.
- Use hidden-value semantics from `hidden-value-semantics-v1.md`.
- Must not be used to expose secrets. Hidden frontend values are visible to respondents.

## MVP Field Types And Values

| Field type | Submitted value | Empty runtime value | Notes |
| --- | --- | --- | --- |
| `text` | string | `""` | Short text. |
| `textarea` | string | `""` | Long text. |
| `number` | number or null | `null` | Submitted as JSON number. |
| `email` | string | `""` | Trim/lowercase normalization can be enabled. |
| `phone` | string | `""` | Conservative MVP contract. Compound phone object is deferred. |
| `url` | string | `""` | URL normalization is explicit, not implicit. |
| `radio` | string or null | `null` | Submitted option value, not label. |
| `checkboxGroup` | string[] | `[]` | Multiple selected option values. |
| `select` | string or null | `null` | Native/select-like single choice. |
| `checkbox` | boolean | `false` | Single consent or acknowledgement. |
| `switch` | boolean | `false` | Boolean toggle. |
| `date` | string or null | `null` | ISO calendar date `YYYY-MM-DD`. |
| `time` | string or null | `null` | 24-hour local time `HH:mm` or `HH:mm:ss`. |
| `rating` | number or null | `null` | Integer within configured range. |
| `linearScale` | number or null | `null` | Numeric scale value. |
| `hidden` | JSON primitive or object | configured | Host-provided hidden value. |
| `fileMetadata` | object[] | `[]` | Trusted server metadata reference only; no upload orchestration. |

## Option Contract

Choice fields store options as stable values:

```json
{
  "id": "option_support",
  "label": "Support",
  "value": "support",
  "description": "I need help with an existing account",
  "disabled": false
}
```

Rules:

- `value` is submitted and must remain stable.
- `label` is display text and can be localized.
- Duplicate option values are invalid within the same field.
- Changing an option value is a dangerous data contract change.

## Localization Model

Display text can be overridden per locale:

```json
{
  "localizations": {
    "fa": {
      "title": "فرم تماس",
      "nodes": {
        "email": {
          "label": "ایمیل"
        }
      }
    }
  }
}
```

Rules:

- `id`, `name`, `fieldType`, option `value`, revision ids, and schema ids are not localized.
- Labels, descriptions, placeholders, option labels, and messages can be localized.
- Direction can be set at form level and may be overridden by host rendering context.

## Excluded From MVP

These are explicitly excluded until separately specified:

- Repeaters and nested repeaters.
- Built-in browser upload orchestration, prepare/finalize flows, provider-specific upload helpers, virus scanning, and orphan cleanup.
- Payment fields.
- Signature fields.
- Matrix/grid and ranking fields.
- Rich text authoring.
- Arbitrary JavaScript expressions.
- Computed spreadsheet-like fields.
- Full workflow automation.
- Built-in SaaS tenancy.

## Diagnostics

Schema validation must produce diagnostics for:

- Unknown node types.
- Unknown field types without registered custom field contracts.
- Missing required fields.
- Duplicate node ids.
- Duplicate submitted names.
- Invalid submitted paths.
- Dangerous keys.
- Unsupported validation rules.
- Unsupported conditions.
- Unsupported compiler behavior.

Unknown or unsafe behavior must fail closed.
