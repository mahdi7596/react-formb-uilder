# Backend-Agnostic React Form Builder Architecture

## Status

Draft architecture design.

## Context

The goal is a reusable, frontend-first form builder product that can be installed into React or Next.js projects as npm packages. It must work with any backend that can receive and return JSON, including Go, NestJS, Hono, Node.js, Next.js route handlers, Laravel, Django, Rails, or custom services.

The product has two primary surfaces:

- Admin Form Builder: a visual editor for creating, organizing, previewing, validating, versioning, and publishing complex forms.
- Public Form Renderer: a runtime renderer that displays published forms inside a host app using the host project's design system.

This is technically possible. The key architectural decision is to make the form definition, runtime state, validation issues, submission payload, and backend responses plain JSON contracts. React should be an implementation detail of the editor and renderer, not a requirement imposed on the backend.

## Product Principles

- The backend stores, serves, validates, and processes JSON; it never imports React code.
- The public renderer is headless by default and visually adaptable through components, slots, CSS variables, tokens, and class hooks.
- The schema is stable, versioned, and explicitly migratable.
- The runtime engine is framework-light and testable outside React.
- Advanced features should be additive: conditional logic, computed fields, repeaters, multi-step forms, and custom fields should use extension points rather than one-off renderer hacks.
- MVP scope should prove the schema, renderer, submission contract, validation flow, and basic builder UX before expanding into complex workflow automation.

## Architecture Options

### Option A: JSON Schema First

Use JSON Schema as the primary form definition and validation model. UI metadata lives in extensions such as `x-ui`, `x-visibility`, and `x-step`.

Benefits:

- Familiar standard with existing validators such as AJV.
- Good for backend validation and data contracts.
- Easier for non-JavaScript backends to understand.

Costs:

- Poor fit for visual builder layout, conditional UI, computed values, repeatable visual sections, file workflows, and custom React field components.
- JSON Schema can become awkward when describing form authoring behavior rather than only data shape.

Best for: API-driven forms where validation interoperability matters more than rich builder UX.

### Option B: Custom Form Schema

Define a product-specific schema for fields, layout, validation, conditions, steps, presentation hints, and submission mapping.

Benefits:

- Best fit for visual builder and renderer needs.
- Clean support for field registry, repeaters, nested sections, condition rules, theming, and extension metadata.
- Easier to evolve product features intentionally.

Costs:

- Backends need a small adapter or validation package if they want server-side schema validation.
- Less standard than JSON Schema.

Best for: a form-builder product where editor and renderer quality matter most.

### Option C: Hybrid Schema

Use a custom form schema as the authoring and rendering source of truth, and generate JSON Schema or another validation artifact from it for backend validation and documentation.

Benefits:

- Keeps the builder expressive while still providing standard backend-friendly artifacts.
- Lets host projects choose between frontend-only validation, server-side validation using generated JSON Schema, or fully custom backend validation.
- Separates form UI semantics from submitted data shape.

Costs:

- Requires a schema compiler and compatibility tests.
- Some custom field types need explicit JSON Schema generation rules.

Recommendation: choose Option C. Use a custom canonical form schema for authoring/rendering, plus optional generated JSON Schema for data validation, docs, and backend interoperability.

## Recommended Package Boundaries

Suggested package set. Replace `@your-org/forms-*` with the final product or company namespace before publishing:

- `@your-org/forms-core`: framework-agnostic schema types, traversal, validation primitives, condition evaluation, default value resolution, submission normalization, migration runner, and utilities.
- `@your-org/forms-react-renderer`: React renderer, hooks, provider, field registry, step orchestration, accessibility helpers, and design-system integration.
- `@your-org/forms-react-builder`: admin visual builder, property panels, drag/reorder UI, schema editor state, preview, publish flow integration points.
- `@your-org/forms-validators`: optional adapters for built-in validators, AJV/JSON Schema generation, and Zod generation or parsing helpers.
- `@your-org/forms-uploads`: file upload contracts, pre-signed upload helpers, progress state, and file field normalization.
- `@your-org/forms-adapters`: optional backend client helpers for REST, GraphQL, Next.js route handlers, and fetch-based submissions.
- `@your-org/forms-themes`: optional starter theme only; never required by the renderer.
- `@your-org/forms-devtools`: schema inspector, condition debugger, and submission preview tools for development.

The core package must not depend on React. The React packages depend on core.

## Form Schema Design

The canonical schema should describe form behavior, rendering structure, validation, and submission mapping.

Example shape:

```json
{
  "schemaVersion": "1.0.0",
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "status": "published",
  "locale": "en",
  "title": "Contact intake",
  "settings": {
    "submitMode": "final",
    "navigation": "steps",
    "validationTiming": "onBlur",
    "preserveHiddenValues": false
  },
  "nodes": [
    {
      "id": "step_identity",
      "type": "step",
      "children": ["full_name", "email"]
    },
    {
      "id": "full_name",
      "type": "field",
      "fieldType": "text",
      "name": "fullName",
      "label": "Full name",
      "defaultValue": "",
      "validation": [{ "type": "required" }]
    }
  ]
}
```

Recommended concepts:

- `id`: stable internal node identifier used for builder references and migrations.
- `name`: submitted data path, such as `fullName`, `addresses[].city`, or `items[].quantity`.
- `type`: structural node type, such as `field`, `section`, `step`, `group`, `repeater`, or `computed`.
- `fieldType`: field renderer key, such as `text`, `select`, `date`, `file`, or a custom key.
- `props`: field-specific configuration that remains JSON-serializable.
- `validation`: declarative validation rules.
- `visibility`: conditional display rules.
- `enabledWhen`: conditional interaction rules.
- `computed`: declarative derived value rules.
- `ui`: non-authoritative presentation hints.
- `meta`: extension-safe metadata for host apps.

Keep React components out of schema. Custom components are referenced by string keys and resolved through a frontend registry.

## Submission JSON Contract

The renderer should send a normalized submission envelope:

```json
{
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "schemaVersion": "1.0.0",
  "submittedAt": "2026-05-14T10:30:00.000Z",
  "locale": "en",
  "data": {
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  },
  "files": [
    {
      "field": "resume",
      "fileId": "file_123",
      "name": "resume.pdf",
      "mimeType": "application/pdf",
      "size": 48122
    }
  ],
  "meta": {
    "source": "public-renderer",
    "requestId": "req_abc"
  }
}
```

Backend responses should also be normalized:

```json
{
  "ok": false,
  "status": "validation_error",
  "submissionId": null,
  "errors": [
    {
      "path": "email",
      "code": "invalid_email",
      "message": "Enter a valid email address."
    }
  ],
  "message": "Please fix the highlighted fields."
}
```

Response statuses should include `success`, `validation_error`, `server_error`, `auth_error`, `rate_limited`, and `conflict`.

## Validation Strategy

Use layered validation:

- Schema validation: verify that a form definition is valid before publishing.
- Client runtime validation: provide immediate UX feedback using the canonical schema.
- Server validation: backend should validate submitted JSON independently, either with generated JSON Schema/AJV-compatible artifacts or native backend rules.
- Cross-field validation: support declarative rules such as `requiredIf`, `minLessThanMax`, and `dateAfter`.
- Custom validation: allow host apps to register custom validator keys in frontend and backend code.

Recommended libraries:

- AJV is a good fit for validating generated JSON Schema and backend-friendly artifacts.
- Zod is useful for TypeScript developer ergonomics and package API validation, but should not be the only contract because non-Node backends cannot consume it directly.
- React Hook Form can be used internally in the React renderer for field registration and performance, but it should not leak into the public schema or backend contract.
- Do not make host apps use React Hook Form unless they opt into low-level integration.

## Conditional Logic Strategy

Use a small declarative expression model rather than arbitrary JavaScript:

```json
{
  "visibility": {
    "all": [
      { "field": "country", "op": "eq", "value": "IR" },
      { "field": "age", "op": "gte", "value": 18 }
    ]
  }
}
```

Rules should support `all`, `any`, `not`, comparison operators, empty checks, contains, regex with restrictions, and references to form values, step state, locale, and submission context. Avoid arbitrary code execution in schema. If custom logic is needed, use registered named predicates such as `{ "predicate": "isBusinessEmail", "args": ["email"] }`.

## File Upload Strategy

Do not send raw file binaries inside the JSON submission envelope. Use a two-phase strategy:

1. Renderer requests an upload target from the host backend using JSON.
2. Browser uploads the file directly to the target or to the backend endpoint.
3. Renderer submits normalized file metadata and returned `fileId` values in the final JSON payload.

Support adapters for pre-signed S3/R2/GCS URLs and simple backend upload endpoints. Enforce file type, size, count, and virus-scanning expectations on the backend. The frontend may pre-check these rules but cannot be trusted as the authority.

## Multi-Step Forms

Steps should be structural nodes, not separate forms. One form revision owns the full schema.

Recommended behavior:

- Validate the current step before advancing when configured.
- Preserve draft state locally or through a host-provided draft adapter.
- Allow hidden future steps based on conditional logic.
- Submit one normalized final payload by default.
- Add partial-step submission later only for advanced workflows.

## Repeatable And Nested Fields

Use repeaters for arrays and groups/sections for object nesting:

```json
{
  "id": "addresses",
  "type": "repeater",
  "name": "addresses",
  "minItems": 1,
  "maxItems": 5,
  "item": {
    "type": "group",
    "children": ["address_city", "address_line"]
  }
}
```

The runtime should maintain stable item keys separately from submitted array indexes so reordering does not corrupt state. Validation errors should use normalized paths such as `addresses[0].city`.

## Renderer Architecture

The renderer should be registry-driven:

- `FormProvider`: owns schema, values, errors, locale, direction, theme, and adapters.
- `FormRenderer`: traverses visible nodes and renders layout.
- `FieldRegistry`: maps `fieldType` keys to React components.
- `RendererSlots`: lets host apps replace labels, descriptions, errors, buttons, step navigation, wrappers, and field chrome.
- `ThemeProvider`: maps design tokens and class names without forcing a visual system.
- `SubmissionAdapter`: sends normalized JSON and maps backend responses to renderer state.

The public renderer should provide both a batteries-included component and lower-level hooks for teams that want full design-system control.

## Admin Builder Architecture

The builder should use the same canonical schema and field registry, with additional editor metadata:

- canvas/tree view for structure
- field palette
- properties panel
- validation editor
- conditional logic editor
- step editor
- preview mode using the real renderer
- publish/version workflow
- schema diff and migration warnings

The builder should emit JSON only. Persistence is delegated to the host app through adapters such as `loadForm`, `saveDraft`, `publishRevision`, and `listRevisions`.

## Backend Integration Contract

The minimum backend API surface should be:

- `GET /forms/:formId/published`: return published schema JSON.
- `POST /forms/:formId/submissions`: accept normalized submission JSON and return normalized response JSON.
- Optional `POST /forms/:formId/uploads/prepare`: return upload target JSON.
- Optional admin endpoints for draft save, publish, revision listing, and migration.

Backends may store forms in SQL, document databases, CMS records, files, or external services. The frontend product should not care.

## Backend-Agnostic Rules

- No React components in persisted schema.
- No executable JavaScript in persisted schema.
- No backend-specific IDs required beyond opaque strings.
- Use ISO dates, standard JSON primitives, and explicit file metadata.
- Publish generated JSON Schema as an optional artifact, not as the only schema.
- Keep transport adapters thin. The contract is JSON, not REST specifically.

## Design System Support

Support design systems through four layers:

1. Headless hooks for full custom rendering.
2. Component registry for custom fields and wrappers.
3. Slot overrides for labels, help text, errors, buttons, progress, and layout containers.
4. CSS variables, data attributes, and className hooks for teams that want styling without replacing components.

The default theme should be intentionally plain and removable.

## Custom Field Components

Custom fields should register with a key:

```ts
registry.register("currency", {
  component: CurrencyField,
  validateConfig: currencyConfigSchema,
  toSubmissionValue: normalizeCurrency,
  toJsonSchema: currencyToJsonSchema
});
```

The schema stores `"fieldType": "currency"` and JSON config. Host projects provide the React component and optional validation/serialization hooks.

## Schema Versioning And Migrations

Use two version concepts:

- `schemaVersion`: product schema format version, such as `1.0.0`.
- `revisionId`: immutable published form revision.

Published revisions should be immutable. Editing a published form creates a new draft revision. Submissions must include the `revisionId` they were created against.

Migration types:

- Product schema migrations: upgrade old form definitions when the library format changes.
- Form revision migrations: host-level decisions about what happens when admins rename fields, remove fields, or change field types.
- Submission migrations: optional reporting-layer transforms for analytics and exports.

Dangerous changes should be flagged in the builder: renaming submitted paths, changing scalar fields to arrays, deleting fields with historical submissions, or changing file field semantics.

## Security Concerns

- Treat all schema JSON from remote sources as untrusted until validated.
- Never execute arbitrary JavaScript from form definitions.
- Sanitize rich text using an allowlist on both client display and backend storage.
- Validate submissions on the backend, regardless of frontend validation.
- Rate-limit public submission endpoints.
- Protect admin builder endpoints with authentication and authorization.
- Prevent prototype pollution by rejecting dangerous object keys such as `__proto__`, `constructor`, and `prototype`.
- Enforce upload MIME, size, count, scanning, and storage access rules on the backend.
- Avoid exposing secrets in schema, default values, hidden fields, or frontend config.

## Accessibility Concerns

- Every field needs a stable accessible name.
- Labels, descriptions, errors, and inputs must be linked with `htmlFor`, `aria-describedby`, and `aria-invalid`.
- Step navigation must be keyboard accessible.
- Validation errors should be announced through an accessible summary and field-level messages.
- Conditional fields should manage focus carefully when content appears or disappears.
- Repeaters need accessible add/remove/reorder controls.
- Custom fields must satisfy the same field component accessibility contract.
- RTL/LTR direction should be configurable at form and locale level.

## Testing Strategy

Recommended test layers:

- Core unit tests for schema parsing, traversal, defaults, conditions, computed values, normalization, and migrations.
- Contract tests for submission and response JSON.
- Renderer tests for field rendering, accessibility attributes, conditional behavior, repeaters, and step navigation.
- Builder tests for schema editing, reorder operations, validation editor output, preview parity, and publish flow.
- Cross-framework examples for Vite React and Next.js App Router.
- Backend adapter contract fixtures that can be used by Go, Node, Python, PHP, and other services.
- Visual regression tests for default theme only; host design systems own their own visuals.

## Suggested Monorepo Structure

```text
packages/
  core/
  react-renderer/
  react-builder/
  validators/
  uploads/
  adapters/
  themes/
  devtools/
examples/
  vite-react/
  next-app-router/
  next-api-routes/
  hono-api/
  nest-api/
docs/
  schema/
  integration/
  accessibility/
  migrations/
  security/
```

## MVP Scope

Include in MVP:

- Canonical form schema v1.
- Core runtime engine.
- React renderer with basic fields: text, textarea, number, email, phone, select, radio, checkbox, date, hidden, and file metadata fields.
- Required, min/max length, numeric range, regex, email, and custom named validators.
- Simple conditional visibility.
- Basic multi-step support.
- Normalized submission and response contracts.
- Field registry and slot-based rendering.
- Admin builder with field palette, tree/canvas organization, property panel, preview using the real renderer, save draft adapter hooks, and publish adapter hooks.
- Generated structural JSON Schema for submitted data.
- Conformance fixtures for schema validation, submission validation, backend responses, and unsupported JSON Schema compilation warnings.

Avoid in MVP:

- Arbitrary page-builder layouts.
- Arbitrary JavaScript expressions.
- Full workflow automation.
- Payment fields.
- Complex computed spreadsheets.
- Repeaters unless the path, error, migration, accessibility, and JSON Schema semantics are fully specified. If included, support only one level and no nested repeaters.
- Built-in file upload orchestration unless the upload lifecycle, finalization, scanning, and cleanup semantics are fully specified. Prefer metadata-only file fields with host-managed uploads for MVP.
- Built-in SaaS tenancy.
- Heavy default design system.
- Backend-specific persistence.
- Rich text authoring unless sanitization and rendering are fully specified.
- Full schema diff tooling, migration assistant UI, and devtools.
- Computed fields beyond simple documented derived values.

## Future SaaS Or Embeddable Product Path

The package architecture can become a SaaS by adding hosted services around the same contracts:

- hosted form schema storage and revisions
- hosted admin builder
- hosted analytics and submission inbox
- hosted file upload pipeline
- embeddable renderer script or React package
- tenant-aware auth and roles
- webhooks for backend integrations
- backend SDKs that validate submissions using generated JSON Schema

The SaaS should still preserve the npm package path. Teams should be able to self-host the schema and submission backend, use only the renderer, or use the hosted builder and APIs.

## Recommended Decision

Proceed with changes. Build a hybrid-schema, package-first product:

- custom canonical schema for authoring and rendering
- optional generated JSON Schema for backend validation
- framework-agnostic core
- React renderer and builder as separate packages
- backend integration through normalized JSON envelopes and adapters
- custom design systems through headless hooks, slots, registries, tokens, and CSS hooks

This gives the best balance between product flexibility, backend neutrality, maintainability, and MVP practicality.

## Architecture Review Corrections

The hybrid-schema recommendation is correct, but the schema must be treated as a product runtime language with a compiler pipeline, not as informal JSON configuration. The following corrections should be made before implementation starts.

### Contract Decisions To Lock Before Coding

- Define a formal submitted path grammar. The design must specify how paths such as `user.email`, `addresses[0].city`, object keys with dots, array indexes, escaped characters, empty keys, and dangerous keys are represented.
- Keep `id` and `name` strictly separate. `id` is the stable internal node identity used by the builder, runtime, migrations, and references. `name` is the submitted data contract and changing it is a breaking data change.
- Add `revisionHash` to the submission envelope in addition to `revisionId` so backends can detect accidental mutation of published revisions.
- Add an optional idempotency key such as `submissionAttemptId` to protect against duplicate submissions caused by retries, double-clicks, reconnects, and flaky networks.
- Lock the JSON Schema dialect now, such as Draft 2020-12 or Draft 7. All generated schemas, examples, docs, and backend fixtures must target the same dialect.
- Define hidden-field value semantics. The recommended default is to exclude hidden values from final submission while allowing an explicit override when a product needs to preserve and submit hidden values.
- Define the validation error contract with support for field errors, global form errors, machine-readable codes, optional human messages, params, and source.
- Wrap React Hook Form behind the renderer's own runtime API. React Hook Form may be an internal implementation detail, but public package APIs must not expose React Hook Form types, resolvers, field arrays, or form state.

Recommended submission envelope change:

```json
{
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "revisionHash": "sha256_...",
  "schemaVersion": "1.0.0",
  "submissionAttemptId": "attempt_abc123",
  "submittedAt": "2026-05-14T10:30:00.000Z",
  "locale": "en",
  "data": {
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  },
  "files": [],
  "meta": {
    "source": "public-renderer",
    "requestId": "req_abc"
  }
}
```

Recommended backend error shape:

```json
{
  "ok": false,
  "status": "validation_error",
  "submissionId": null,
  "errors": [
    {
      "path": "email",
      "code": "invalid_email",
      "message": "Enter a valid email address.",
      "params": {},
      "source": "server"
    },
    {
      "path": null,
      "code": "form_expired",
      "message": "This form is no longer accepting submissions.",
      "params": {},
      "source": "server"
    }
  ],
  "message": "Please fix the highlighted fields."
}
```

### Schema And Compiler Changes

- Treat the canonical schema as the source of truth for authoring and rendering.
- Treat generated JSON Schema as a structural validation and documentation artifact, not as a complete representation of form behavior.
- Generate explicit compiler diagnostics when schema behavior cannot be represented safely in JSON Schema.
- Define compiler outputs separately: submitted data JSON Schema, validation plan, condition dependency graph, unsupported feature warnings, and optional documentation metadata.
- Keep UI behavior, visibility, computed values, upload lifecycle, custom field rendering, and builder metadata out of generated JSON Schema unless a specific behavior has a correct JSON Schema representation.

Example compiler warning:

```json
{
  "warnings": [
    {
      "code": "condition_not_representable",
      "path": "nodes.business_email.visibility",
      "message": "This visibility rule cannot be fully represented in generated JSON Schema."
    }
  ]
}
```

### Package Boundary Changes

- Keep `forms-core` free of React, AJV, Zod, upload providers, design-system components, and transport code.
- Define internal core layers even if they ship in one package initially: schema types, traversal, runtime evaluation, condition evaluation, normalization, validation primitives, and migration runner.
- Keep JSON Schema, AJV, and Zod emitters in `forms-validators` or a future compiler package, not in core.
- Put upload value contracts and file field normalization in core, but keep browser upload orchestration and provider-specific helpers outside core.
- Keep `forms-adapters` thin. It should provide helper implementations for agreed JSON contracts, not become the place where product behavior is defined.
- Delay `forms-devtools` until after the schema, renderer, validation, and builder contracts are stable.

### Validation And Conditional Logic Changes

- Define a deterministic condition evaluation model with dependency tracking, missing-value behavior, cycle detection, and clear interaction with hidden fields.
- Keep MVP conditional logic synchronous only. Async predicates should be postponed.
- Version custom validators and predicates. A custom validator should declare a key, version, input contract, output contract, and whether backend parity is required.
- Unknown custom validators or predicates must not be silently ignored. The runtime should fail closed, block publish, or emit a hard diagnostic depending on context.
- Cross-field validation should use named declarative rules over explicit paths, not arbitrary code.
- Restrict regex features to avoid runtime and backend incompatibilities.

Example custom predicate reference:

```json
{
  "predicate": "isBusinessEmail",
  "version": "1.0.0",
  "args": ["email"]
}
```

### Repeater Changes

- Runtime item identity must be separate from submitted array indexes.
- Errors should use normalized submitted paths such as `addresses[0].city`, while runtime state should track stable item keys internally.
- Reordering must not corrupt values, errors, touched state, focus state, or draft state.
- Repeaters should be delayed unless one-level repeater semantics are fully specified for paths, validation, JSON Schema generation, accessibility, migrations, and backend errors.

### Upload Changes

- Do not trust browser-submitted file metadata as authoritative. The backend should treat `fileId` as the authority and resolve trusted metadata server-side.
- If uploads are included, define lifecycle states such as prepared, uploading, uploaded, attached, scanning, accepted, rejected, and abandoned.
- Define cleanup behavior for orphaned uploads.
- Define finalization behavior so a file uploaded in phase one cannot be reused or attached to an unauthorized submission.
- Keep virus scanning, MIME verification, size limits, access control, and storage policy on the backend.

### Migration And Versioning Changes

- Published revisions must be immutable by contract. Editing a published form creates a new draft revision.
- Separate product schema migrations from form data contract migrations. Upgrading the form schema format is not the same as changing a customer's submitted data shape.
- Provide migration dry-run output with affected nodes, dangerous changes, irreversible changes, and warnings.
- Flag dangerous builder changes before publish: submitted path renames, deleted fields, scalar-to-array changes, field type changes, option value changes, requiredness changes, upload semantic changes, and hidden-value behavior changes.

### Security Changes

- Add CSRF, CORS, origin, authenticated submission, and embedded-form guidance.
- Add bot and spam protection extension points such as CAPTCHA, Turnstile, honeypots, rate limits, and server-side abuse checks without hard-coding one vendor.
- Reject dangerous object keys such as `__proto__`, `constructor`, and `prototype` in schemas, submissions, defaults, props, metadata, and backend responses.
- Keep labels, descriptions, option labels, and error text plain text by default. Rich text must be a separate explicitly sanitized feature.
- Add schema size, depth, node count, condition complexity, and regex limits.

### Accessibility Changes

- Make accessibility part of the custom field API. Every custom field should receive renderer-managed ids, described-by ids, invalid state, required state, disabled state, and a focus target contract.
- Require built-in and custom fields to support accessible labels, descriptions, errors, keyboard operation, focus management, and screen reader announcements.
- Define repeater accessibility requirements before shipping repeaters: add, remove, reorder, item labels, and error summaries.

### Backend-Agnostic Changes

- Backend-agnostic means semantic parity, not only JSON transport.
- Create conformance fixtures before writing much code: valid schema, invalid schema, valid submission, invalid submission, validation error response, conflict response, upload prepare response, and unsupported compiler warnings.
- Keep transport secondary. Document JSON request and response shapes independently from REST endpoint examples.
- Define date, datetime, timezone, number, decimal, currency, empty value, and locale normalization rules.
- Avoid backend SDKs until the JSON contract and fixtures prove stable.

## Prioritized Pre-Implementation Action List

1. Write the formal schema specification for paths, nodes, validation rules, conditions, errors, extension metadata, and dangerous keys.
2. Decide the JSON Schema dialect and document exactly what generated JSON Schema does and does not guarantee.
3. Define the canonical submission envelope, backend response envelope, global error shape, idempotency key, and revision hash.
4. Define hidden-field value semantics.
5. Define the custom field, custom validator, and custom predicate registration contracts.
6. Define the condition evaluation model, dependency graph, cycle detection, and missing-value behavior.
7. Reduce the MVP to the smallest version that proves the schema, renderer, validation, submission contract, generated JSON Schema, and basic builder workflow.
8. Decide whether repeaters remain in MVP. If yes, write their path, state, error, migration, accessibility, and JSON Schema semantics before implementation.
9. Decide whether uploads remain in MVP. If yes, write their lifecycle, cleanup, finalization, backend trust model, and security requirements before implementation.
10. Create backend conformance fixtures that can be used by Go, Node, Python, PHP, Ruby, Java, and custom backends.
