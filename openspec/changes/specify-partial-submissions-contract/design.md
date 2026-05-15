# Design

## Envelope

Partial saves use the same normalized submission concepts but add:

- `partialSubmissionId`
- `idempotencyKey`
- `status`: `draft`, `partial`, `submitted`, `expired`
- `completedSteps`
- `resumeTokenHint` only when the backend chooses to issue one

The frontend never creates trusted resume tokens. Host backends own token generation, expiry, and revocation.

## Rules

- Repeated save with same idempotency key is safe.
- Resume must verify form id, revision compatibility, auth/secret token, and expiry.
- Sensitive fields can opt out of partial persistence.
- Final submission closes or supersedes the partial draft.

