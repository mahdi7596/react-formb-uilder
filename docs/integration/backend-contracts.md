# Backend Contracts

The backend boundary is JSON-first. Host services may use any language or framework as long as they exchange normalized JSON contracts.

## Adapter Operations

`@your-org/forms-adapters` defines `FormPersistenceAdapter`:

- `loadForm(request)`: load an editable draft schema and draft metadata.
- `saveDraft(request)`: save an editable draft and return updated draft metadata.
- `publishRevision(request)`: publish an immutable revision and return published metadata.
- `listRevisions(request)`: list draft, published, or archived revision metadata.
- `loadPublishedForm(request)`: load a published schema for public rendering.
- `submitForm(request)`: submit a normalized submission envelope and return a normalized backend response.

Adapters return `AdapterResult<T>`:

```ts
import { adapterFailure, adapterSuccess } from "@your-org/forms-adapters";

const ok = adapterSuccess({ savedAt: "2026-05-15T00:00:00.000Z" });
const failed = adapterFailure("server_error", { message: "Host service failed." });
```

## Statuses

Adapter statuses:

- `success`
- `validation_error`
- `conflict`
- `auth_error`
- `rate_limited`
- `server_error`
- `network_error`
- `malformed_response`
- `dangerous_key`
- `blocked`

Public submission backend responses use:

- `success`
- `validation_error`
- `server_error`
- `auth_error`
- `rate_limited`
- `conflict`

## Error Mapping Examples

Validation response:

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
      "source": "server"
    }
  ],
  "message": "Please fix the highlighted fields."
}
```

Conflict response:

```ts
import { staleDraftConflict } from "@your-org/forms-adapters";

const result = staleDraftConflict({
  latestVersion: "host-version-42",
  latestRevisionId: "draft_latest",
  latestRevisionHash: "sha256:latest"
});
```

Auth, rate-limit, and server errors:

```ts
import { adapterFailure } from "@your-org/forms-adapters";

adapterFailure("auth_error", { message: "Sign in before saving this draft." });
adapterFailure("rate_limited", { message: "Try again later." });
adapterFailure("server_error", { message: "The host service failed." });
```

Success submission response:

```json
{
  "ok": true,
  "status": "success",
  "submissionId": "sub_123",
  "errors": [],
  "message": "Submission received."
}
```

## JSON Rules

Adapter payloads must be JSON-serializable. Do not pass:

- React state
- React Hook Form objects
- TanStack Query mutation objects
- DOM objects
- backend SDK clients
- executable functions
- class instances that require custom serialization

Use `dangerousKeyDiagnostics` or `normalizeAdapterData` to reject dangerous keys such as `__proto__`, `constructor`, and `prototype`.

## Fixtures

Backend implementers should compare behavior against:

- [backend response contract](../schema/backend-response-v1.md)
- [submission envelope contract](../schema/submission-envelope-v1.md)
- [backend conformance fixtures](../schema/backend-conformance-fixtures-v1.md)
- core fixture exports from `@your-org/forms-core`

## Related Docs

- [JSON Schema generation](json-schema-generation.md)
- [Revisions and dangerous changes](../migrations/revisions-and-dangerous-changes.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
