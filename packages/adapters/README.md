# @your-org/forms-adapters

Thin host integration contracts for the backend-agnostic form builder.

## Responsibility

This package defines JSON-first contracts and helper result factories for:

- `loadForm`
- `saveDraft`
- `publishRevision`
- `listRevisions`
- `loadPublishedForm`
- `submitForm`

Adapters describe the boundary between the form-builder packages and host persistence. They do not choose a backend, database, route shape, auth model, fetch client, retry policy, or cache strategy.

## Boundary Rules

- Keep all request and response payloads JSON-serializable.
- Keep React, DOM objects, executable functions, TanStack Query objects, and backend-specific SDK instances out of adapter contracts.
- Keep schema semantics, runtime validation, submitted path behavior, and compiler behavior in `packages/core` or `packages/validators`.
- Treat published revisions as immutable. Publishing returns a new published revision identity/hash or a conflict/blocked result.
- Return normalized `AdapterResult<T>` envelopes so React packages can render success, validation, conflict, auth, rate-limit, server, network, malformed, blocked, and dangerous-key states without knowing the host transport.

## Contract Summary

`FormPersistenceAdapter` contains the Phase 10 operations:

- `loadForm(request)` returns an editable canonical schema and draft metadata.
- `saveDraft(request)` saves an editable draft and returns updated draft metadata plus host version information where available.
- `publishRevision(request)` publishes an immutable revision and returns published revision metadata.
- `listRevisions(request)` returns revision metadata for warning and review surfaces.
- `loadPublishedForm(request)` returns a published canonical schema for public rendering.
- `submitForm(request)` submits a normalized submission envelope and returns a normalized backend response.

Helper functions include:

- `adapterSuccess(data)`
- `adapterFailure(status, options)`
- `staleDraftConflict(options)`
- `immutablePublishedRevisionConflict(options)`
- `dangerousKeyDiagnostics(value)`
- `normalizeAdapterData(data)`
- `normalizeUnknownAdapterError(error)`

## Non-Goals

- No real backend implementation.
- No REST, GraphQL, Next.js route handler, database, or localStorage requirement.
- No React Hook Form or TanStack Query public API.
- No persistence behavior in `packages/core`.
- No upload lifecycle behavior beyond future extension room.
