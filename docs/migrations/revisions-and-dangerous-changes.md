# Revisions And Dangerous Changes

The form builder treats published revisions as immutable. Drafts can change; published forms are stable contracts for submissions and backend processing.

## Drafts And Published Revisions

- Draft revisions are editable.
- Published revisions are immutable.
- Publishing creates or returns a published revision identity with `revisionId`, `revisionHash`, `schemaVersion`, `publishedAt`, and `immutable: true`.
- Public submissions include `revisionId` and `revisionHash` so backends can verify the submitted form version.

## Conflict Recovery

Host adapters should return normalized conflicts when local work is stale:

- stale draft conflict: reload latest or preserve local edits
- stale publish conflict: review latest published metadata before retrying
- immutable published revision conflict: never mutate an existing published revision

The builder surfaces reload, retry, and preserve-local-edits affordances where the adapter result says they are available.

## Publish Gating

Publishing should consider:

- schema diagnostics
- compiler diagnostics
- generated artifact review
- dangerous-change diagnostics
- required metadata
- adapter conflicts

Blocking errors should prevent publishing. Warnings should be visible before publish.

## Dangerous Or Review-Worthy Changes

The builder command layer emits warnings for changes that can affect stored submissions or backend contracts:

- submitted path rename
- field deletion
- scalar-to-array or array-to-scalar shape change
- option value change
- requiredness change
- hidden-value policy change
- field type change

These are not always invalid, but they require review because existing submissions, backend validation, analytics, or exports may depend on the previous contract.

## Migration Boundaries

Core includes a migration runner shell for future schema migrations. Complex migrations are not part of the current MVP. Hosts should version migration decisions and avoid rewriting published revisions in place.

## Backend Responsibilities

Backends should:

- store immutable published revision metadata
- verify `revisionHash` on submission
- reject stale draft saves when host versioning detects conflicts
- return normalized conflict results
- keep migration or compatibility logic outside React components

## Related Docs

- [Backend contracts](../integration/backend-contracts.md)
- [Submission envelope](../schema/submission-envelope-v1.md)
- [Backend response](../schema/backend-response-v1.md)
- [JSON Schema generation](../integration/json-schema-generation.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
