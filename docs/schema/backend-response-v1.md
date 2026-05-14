# Backend Response V1

Status: Phase 1 contract

Backends return normalized response envelopes so the renderer can handle success, validation errors, server errors, auth errors, rate limits, and conflicts without knowing backend implementation details.

## Success Response

```json
{
  "ok": true,
  "status": "success",
  "submissionId": "sub_123",
  "errors": [],
  "message": "Thanks. Your response was submitted.",
  "meta": {}
}
```

## Error Response

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
  "message": "Please fix the highlighted fields.",
  "meta": {}
}
```

## Fields

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `ok` | boolean | yes | True only for successful submission acceptance. |
| `status` | string | yes | Machine-readable status. |
| `submissionId` | string or null | yes | Backend submission id when accepted. |
| `errors` | array | yes | Empty for success. Field and global errors for failure. |
| `message` | string | no | Human-readable summary safe to show to respondents. |
| `meta` | object | no | Safe extension metadata. Dangerous keys are rejected. |

## Status Values

| Status | `ok` | Meaning | Renderer behavior |
| --- | --- | --- | --- |
| `success` | true | Submission accepted. | Show success or ending. |
| `validation_error` | false | Submitted data failed validation. | Map field errors and show summary. |
| `server_error` | false | Backend failed unexpectedly. | Show retry-safe generic error. |
| `auth_error` | false | Submission requires auth or current auth is invalid. | Show auth-aware error or host handler. |
| `rate_limited` | false | Too many attempts or abuse protection triggered. | Show cooldown or retry message. |
| `conflict` | false | Revision mismatch, expired form, duplicate conflict, or stale data. | Stop submission and ask host/renderer to reload or show conflict message. |

Unknown statuses must be treated as `server_error` and surfaced through diagnostics.

## Error Shape

```json
{
  "path": "email",
  "code": "invalid_email",
  "message": "Enter a valid email address.",
  "params": {
    "expectedFormat": "email"
  },
  "source": "server"
}
```

| Field | Type | Required | Contract |
| --- | --- | --- | --- |
| `path` | string or null | yes | Submitted path for field errors; `null` for global errors. |
| `code` | string | yes | Machine-readable error code. |
| `message` | string | no | Human-readable message. Renderer may localize or override. |
| `params` | object | no | JSON-serializable structured details. |
| `source` | string | yes | `schema`, `client`, `server`, `adapter`, or `compiler`. |

Rules:

- Field errors use submitted paths, not node ids.
- Global errors use `path: null`.
- Dangerous keys are rejected in `params` and `meta`.
- Error `message` is plain text.
- The renderer must not rely on message text for logic.

## Common Error Codes

MVP codes include:

- `required`
- `invalid_type`
- `invalid_path`
- `invalid_email`
- `invalid_url`
- `too_short`
- `too_long`
- `too_small`
- `too_large`
- `pattern_mismatch`
- `invalid_option`
- `invalid_revision`
- `revision_hash_mismatch`
- `duplicate_submission`
- `rate_limited`
- `server_error`
- `auth_required`
- `forbidden`
- `conflict`

Custom validators can define namespaced codes such as `custom.business_email_required`.

## Conflict Response

```json
{
  "ok": false,
  "status": "conflict",
  "submissionId": null,
  "errors": [
    {
      "path": null,
      "code": "revision_hash_mismatch",
      "message": "This form changed while you were filling it out.",
      "params": {
        "expectedRevisionId": "rev_2026_05_14_001"
      },
      "source": "server"
    }
  ],
  "message": "Please reload the form and try again."
}
```

## Rate Limit Response

```json
{
  "ok": false,
  "status": "rate_limited",
  "submissionId": null,
  "errors": [
    {
      "path": null,
      "code": "rate_limited",
      "message": "Please wait before trying again.",
      "params": {
        "retryAfterSeconds": 60
      },
      "source": "server"
    }
  ],
  "message": "Please wait before trying again."
}
```

## Security Rules

- Backends must validate submissions independently.
- Error messages should avoid leaking secrets or validation internals.
- Rich HTML error messages are not part of MVP.
- Unknown or malformed response envelopes are treated as `server_error`.
