# Submission Envelope V1

Status: Phase 1 contract

The submission envelope is the normalized JSON payload sent by the renderer or host app to a backend. It is backend-agnostic and does not assume REST, GraphQL, Next.js, or any particular storage model.

## Envelope Shape

```json
{
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "revisionHash": "sha256_dcb6...",
  "schemaVersion": "1.0.0",
  "submissionAttemptId": "attempt_01HX...",
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

## Fields

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `formId` | string | yes | Opaque form id from the schema. |
| `revisionId` | string | yes | Published revision id the respondent used. |
| `revisionHash` | string | yes | Hash of the canonical published revision. |
| `schemaVersion` | string | yes | Product schema format version, e.g. `1.0.0`. |
| `submissionAttemptId` | string | yes | Client-generated idempotency key for this attempt. |
| `submittedAt` | string | yes | ISO 8601 UTC timestamp generated at submission time. |
| `locale` | string | yes | Locale active during submission. |
| `data` | object | yes | Submitted values keyed by submitted path grammar. |
| `files` | array | yes | File metadata references, empty when no file metadata is submitted. |
| `meta` | object | no | Safe extension metadata. Dangerous keys are rejected. |

## Revision Integrity

`revisionId` identifies the published revision. `revisionHash` protects against accidental mutation of a published revision after it was served.

Backends should:

- verify that `revisionId` exists
- verify that `revisionHash` matches stored canonical revision content
- return `conflict` when the revision is missing, expired, unpublished, or hash-mismatched

The hash algorithm is represented as a prefixed string such as `sha256_<digest>`. Phase 2 fixtures should include valid and mismatched examples.

## Idempotency

`submissionAttemptId` protects against duplicate submissions caused by retries, double-clicks, reconnects, or flaky networks.

Rules:

- The renderer generates one attempt id for a logical submission attempt.
- Retries for the same attempt reuse the same id.
- A new user-initiated submission after correction can use a new id.
- Backends can return the original response for repeated matching attempts.
- Attempt ids are opaque strings and must not encode secrets.

## Data Object

`data` is a JSON object built from submitted paths and normalized values.

Example path mapping:

```json
{
  "user": {
    "email": "jane@example.com"
  }
}
```

from:

```text
user.email
```

Rules:

- Dangerous keys are rejected.
- Empty values are omitted according to `submitted-path-grammar-v1.md`.
- Hidden values follow `hidden-value-semantics-v1.md`.
- Disabled values are excluded by default.
- Backend validation remains authoritative.

## Files Array

MVP supports file metadata references only, not upload orchestration.

```json
{
  "field": "resume",
  "fileId": "file_123",
  "name": "resume.pdf",
  "mimeType": "application/pdf",
  "size": 48122,
  "meta": {}
}
```

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `field` | string | yes | Submitted path of the file metadata field. |
| `fileId` | string | yes | Backend-issued trusted file id. |
| `name` | string | no | Display filename from backend or browser. Not authoritative. |
| `mimeType` | string | no | MIME hint. Backend must verify. |
| `size` | number | no | Size hint in bytes. Backend must verify. |
| `meta` | object | no | Safe extension metadata. |

Backends must treat `fileId` as the authority and resolve trusted metadata server-side. Browser-submitted file metadata is a hint.

## Meta Object

`meta` can include safe data such as:

- `source`
- `requestId`
- `embedId`
- `userAgentSummary`
- host-defined correlation ids

`meta` must not include secrets, tokens, or authorization decisions. Dangerous keys are rejected recursively.

## Example: Validation Retry

The same attempt id is reused when the client retries after a network failure:

```json
{
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "revisionHash": "sha256_dcb6...",
  "schemaVersion": "1.0.0",
  "submissionAttemptId": "attempt_retry_001",
  "submittedAt": "2026-05-14T10:31:00.000Z",
  "locale": "en",
  "data": {
    "email": "jane@example.com"
  },
  "files": [],
  "meta": {
    "source": "public-renderer"
  }
}
```

## Invalid Envelopes

Backends should reject envelopes with:

- missing `formId`
- missing or unknown `revisionId`
- missing or mismatched `revisionHash`
- missing `submissionAttemptId`
- invalid `submittedAt`
- malformed `data`
- dangerous keys
- submitted values that violate backend validation
- file metadata without trusted `fileId`
