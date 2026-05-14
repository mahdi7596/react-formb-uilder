# Backend Conformance Fixtures V1

Status: Phase 1 contract

Conformance fixtures are JSON-first examples used to test schema validation, submission normalization, backend responses, compiler diagnostics, and backend interoperability. They must be usable by JavaScript and non-JavaScript backends.

## Goals

- Prove backend-agnostic semantics with concrete JSON examples.
- Give future `packages/core` and `packages/validators` tests stable inputs.
- Help Go, Node, Python, PHP, Ruby, Java, and custom services validate parity.
- Catch unsafe behavior such as dangerous keys and unsupported custom extensions.

## Fixture Organization

Recommended future location:

```text
packages/core/src/testing/fixtures/
  schemas/
  submissions/
  responses/
  diagnostics/
packages/validators/src/testing/fixtures/
  json-schema/
```

Phase 1 only defines required fixture categories. Phase 2 creates concrete fixture files.

## Valid Schema Fixtures

Required valid schema fixtures:

- minimal single-page contact form
- multi-step form
- choice fields with stable option values
- hidden field with default exclusion behavior
- form with localized labels
- form with simple conditional visibility
- form with file metadata field
- form with custom validator reference and registered support metadata

Each valid schema fixture must include:

- `schemaVersion`
- `formId`
- `revisionId`
- `revisionHash`
- `status`
- `locale`
- `direction`
- `settings`
- `nodes`

## Invalid Schema Fixtures

Required invalid schema fixtures:

- missing `schemaVersion`
- duplicate node ids
- unknown node type
- unknown field type
- field missing submitted `name`
- invalid submitted path
- dangerous key in schema
- duplicate submitted path
- unknown validation rule
- unsupported custom validator
- invalid condition reference
- condition cycle
- repeater node in MVP
- upload orchestration node in MVP
- executable code string where a registered key is required

Expected result:

- each invalid fixture produces deterministic diagnostics
- unsafe cases fail closed

## Valid Submission Fixtures

Required valid submission fixtures:

- successful minimal contact submission
- submission with omitted empty optional values
- submission with boolean false value
- submission with choice values
- submission with hidden values excluded by default
- submission with preserved hidden value when explicitly configured
- submission with file metadata reference
- retry using same `submissionAttemptId`

Each fixture must include:

- `formId`
- `revisionId`
- `revisionHash`
- `schemaVersion`
- `submissionAttemptId`
- `submittedAt`
- `locale`
- `data`
- `files`

## Invalid Submission Fixtures

Required invalid submission fixtures:

- missing `revisionHash`
- mismatched `revisionHash`
- missing `submissionAttemptId`
- dangerous key in `data`
- dangerous key in `meta`
- invalid submitted path
- required field missing
- invalid email
- invalid URL
- invalid option value
- invalid file metadata without `fileId`
- submitted hidden value when policy excludes it

## Backend Response Fixtures

Required response fixtures:

- success response
- field validation error response
- global validation error response
- mixed field and global validation errors
- conflict response for revision hash mismatch
- auth error response
- rate limited response with retry metadata
- server error response
- malformed response with unknown status
- response with dangerous key in `params`

## Compiler Diagnostic Fixtures

Required compiler diagnostic fixtures:

- conditional visibility not representable in JSON Schema
- custom validator not representable
- unsupported regex
- unknown field type
- repeater not supported
- upload lifecycle not supported
- dangerous key
- invalid submitted path

## Upload Metadata Fixture

MVP upload-related fixture is metadata-only:

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

Fixtures must clarify that browser-provided `name`, `mimeType`, and `size` are hints. Backends must resolve trusted metadata by `fileId`.

## Non-JavaScript Backend Requirements

Fixtures must:

- be valid JSON files
- avoid TypeScript-specific syntax
- avoid JavaScript comments
- avoid executable code
- use ISO timestamps
- use stable diagnostic codes
- use submitted paths rather than React state paths
- document expected pass/fail result outside the fixture or in a separate manifest

## Fixture Manifest

Phase 2 should create a manifest describing expected behavior:

```json
{
  "id": "invalid-dangerous-key-submission",
  "file": "submissions/invalid-dangerous-key.json",
  "expect": "fail",
  "diagnostics": ["dangerous_key"]
}
```

The manifest lets multiple runtimes run the same conformance suite.

## Versioning

Fixtures are versioned with the contract they test. Breaking contract changes must add new fixtures or revise fixture expectations through an explicit OpenSpec change.
