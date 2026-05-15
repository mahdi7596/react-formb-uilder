## Context

The project has completed the foundational package structure, canonical contracts, core runtime behavior, JSON Schema compiler, React renderer, builder commands/store, visual builder UI, and DnD/keyboard authoring workflows. The current builder can edit a draft schema locally and preview it with the real renderer, but it does not yet model host persistence, revision publication, conflict recovery, generated artifacts, or public submission through a shared adapter contract.

The architecture requires backend-agnostic JSON contracts. `packages/core` must remain framework-free and transport-free. `packages/adapters` must stay thin and must not define product semantics. React server-state handling belongs in React packages, examples, or host integration helpers, with TanStack Query hidden behind product-owned hooks rather than leaking into core contracts.

## Goals / Non-Goals

**Goals:**

- Define typed adapter contracts for draft loading, draft saving, revision publishing, revision listing, published-form loading, and normalized submission.
- Model adapter request/response envelopes that are JSON-serializable, backend-agnostic, and aligned with existing schema, submission, backend response, and diagnostic contracts.
- Add builder persistence and publish workflow surfaces for loading, dirty state, saving, saved state, save failure, retry, conflict recovery, publish blocked, publish warning, and publish success.
- Build publish checks from existing sources of truth: core schema diagnostics, JSON Schema compiler diagnostics, builder dangerous-change diagnostics, required metadata checks, and revision immutability rules.
- Expose generated artifacts in the builder without moving compiler logic into `packages/react-builder`.
- Demonstrate the workflow in the Vite React example with fake host persistence and Playwright coverage.

**Non-Goals:**

- No real hosted backend, database, auth, or network transport implementation.
- No backend-specific SDKs, REST route handlers, GraphQL clients, or Next.js server code.
- No persistence logic in `packages/core`.
- No executable JavaScript, React components, or backend-specific assumptions in persisted schemas.
- No real-time collaboration, multi-user locking, or merge UI beyond conflict detection and recovery states.
- No upload lifecycle implementation beyond preserving future adapter extension points.

## Decisions

### Decision: Adapter contracts are thin JSON boundaries

`packages/adapters` will define product-owned TypeScript contracts for:

- `loadForm`
- `saveDraft`
- `publishRevision`
- `listRevisions`
- `loadPublishedForm`
- `submitForm`

Each operation returns a normalized result envelope with `ok`, `status`, optional `data`, optional `diagnostics`, optional `message`, and optional conflict metadata where relevant. The contracts describe JSON shapes and helper behavior only; they do not choose fetch, REST, GraphQL, local storage, database APIs, auth, or retry policies.

Alternatives considered:

- Put persistence directly in the builder: rejected because it couples product behavior to one host integration path.
- Put adapter behavior in core: rejected because core must remain framework-agnostic and transport-free.
- Make adapters fetch-first: rejected for MVP because host apps may use any backend or client transport.

### Decision: Published revisions are immutable by contract

Publishing creates a new published revision record rather than mutating an existing published revision. Adapter types will distinguish draft state from published revision state and require revision identity/hash metadata on publish responses. Save-draft operations can update drafts, but publish operations must return a new immutable published revision identity or a conflict/blocked result.

Alternatives considered:

- Allow published revision updates in place: rejected because submission integrity relies on `revisionId` and `revisionHash`.
- Delay immutability until backend implementation: rejected because the frontend contract would otherwise encourage unsafe host behavior.

### Decision: Publish checks compose diagnostics instead of inventing a second validator

The builder publish checklist will aggregate:

- core schema/runtime diagnostics
- JSON Schema compiler diagnostics and validation-plan output from `packages/validators`
- builder dangerous-change diagnostics from command history or diff analysis
- required metadata checks such as title, form id, revision id/hash, schema version, locale, and supported status
- adapter conflict responses when the host rejects a stale draft

The checklist will classify errors as blocking and warnings as reviewable. Unknown custom fields, validators, predicates, unsafe keys, and unsupported compiler behavior remain fail-closed according to existing contracts.

Alternatives considered:

- Write a builder-specific validation path: rejected because it would drift from core and validator behavior.
- Treat compiler warnings as always blocking: rejected because some JSON Schema limitations can be acceptable when validation-plan output captures non-representable behavior; exact blocking rules should be explicit in the publish checklist.

### Decision: TanStack Query lives behind React/example integration

The adapter package will not depend on TanStack Query. React builder/example integration can expose product-owned hooks such as draft loading, saving, publishing, revision listing, generated artifact loading, and submission. Those hooks may use TanStack Query internally, but public domain contracts remain adapter-shaped JSON contracts.

Alternatives considered:

- Add TanStack Query to adapters: rejected because adapters should also be usable by non-React host code.
- Hand-roll async status in UI components: rejected because save/publish/retry/conflict workflows need consistent mutation and cache status.

### Decision: Generated artifacts come from validators

The generated artifact panel will consume compiler output from `packages/validators`. It can display JSON Schema, diagnostics, validation plan, condition dependencies, and conformance fixture references, but it must not duplicate compiler behavior in the builder package.

Alternatives considered:

- Generate JSON Schema in the builder package: rejected because JSON Schema generation belongs in `packages/validators`.
- Show only raw JSON Schema: rejected because publish decisions also need diagnostics, validation-plan gaps, and fixture context.

## Risks / Trade-offs

- Adapter contracts become too broad → Keep the first version focused on Phase 10 operations and JSON envelopes; defer uploads, async options, auth, and collaboration.
- TanStack Query leaks into public package APIs → Keep hook return types product-owned and avoid exporting query keys or library-specific mutation types as core contracts.
- Publish checklist duplicates validation logic → Compose existing core and validator outputs; add only orchestration and presentation logic in the builder.
- Conflict UX becomes unclear → Include explicit stale draft, retry, reload, and preserve-local-state scenarios in specs and tests.
- Dirty worktree example files may conflict with implementation → Treat current example changes as existing user/session work and stage future Phase 10 edits carefully.

## Migration Plan

1. Replace the adapters placeholder with typed contract exports and contract tests.
2. Add builder persistence/publish orchestration around existing command/store and UI primitives.
3. Add generated artifact consumption from validators.
4. Wire the Vite React example to a fake host adapter that exercises load, save, conflict, publish, revision listing, published load, and submit.
5. Verify package boundaries with unit, component, Playwright, full test, and build commands.

Rollback is straightforward before a real backend exists: remove the Phase 10 adapter hooks/UI surfaces and keep the existing local-only builder behavior. Published schema data does not require migration because this phase introduces contracts and fake host storage only.
