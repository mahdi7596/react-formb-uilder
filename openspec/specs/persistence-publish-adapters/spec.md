## Purpose

Define backend-agnostic persistence, publish, revision, and submission adapter contracts for host integrations. This capability keeps `packages/adapters` thin and JSON-first, keeps `packages/core` transport-free, models immutable published revisions, and defines the verification expectations for persistence/publish workflows.

## Requirements

### Requirement: Adapter operation contracts
The adapters package SHALL define backend-agnostic JSON contracts for loading forms, saving drafts, publishing revisions, listing revisions, loading published forms, and submitting normalized form submissions.

#### Scenario: Adapter contracts are JSON serializable
- **WHEN** adapter request and response types are inspected
- **THEN** they use JSON-serializable form schemas, submissions, diagnostics, revision metadata, status values, and messages without React components, executable functions, DOM objects, or backend-specific client types

#### Scenario: Required operations are exported
- **WHEN** host code imports the adapters package
- **THEN** it can reference typed contracts for `loadForm`, `saveDraft`, `publishRevision`, `listRevisions`, `loadPublishedForm`, and `submitForm`

#### Scenario: Core remains transport-free
- **WHEN** adapter contracts are implemented
- **THEN** `packages/core` still has no dependency on adapters, React, TanStack Query, fetch clients, transport code, or backend-specific persistence code

### Requirement: Normalized adapter results
The adapters package SHALL normalize operation outcomes into product-owned result envelopes with explicit status, diagnostics, messages, and optional data.

#### Scenario: Successful adapter result carries data
- **WHEN** an adapter operation succeeds
- **THEN** the result includes `ok: true`, a success status, and operation-specific JSON data such as a draft, revision, revision list, published schema, or backend submission response

#### Scenario: Failed adapter result carries diagnostics
- **WHEN** an adapter operation fails because of validation, conflict, auth, rate limit, server, network, or malformed response conditions
- **THEN** the result includes `ok: false`, a normalized status, a useful message where available, and diagnostics or backend errors that can be rendered by React packages without interpreting backend-specific exceptions

#### Scenario: Dangerous adapter data fails closed
- **WHEN** adapter responses contain dangerous keys in inspected JSON contract surfaces
- **THEN** the adapter helpers return a failed normalized result with dangerous-key diagnostics rather than passing unsafe data to the builder or renderer

### Requirement: Draft persistence contract
The adapters package SHALL define draft loading and saving contracts that preserve canonical schema data and host revision metadata without committing published revisions.

#### Scenario: Load draft returns editable state
- **WHEN** a host adapter loads an editable form draft
- **THEN** the result includes the canonical schema, draft revision metadata, updated timestamp where available, and enough conflict metadata for later save operations

#### Scenario: Save draft returns updated draft metadata
- **WHEN** a host adapter saves a draft schema successfully
- **THEN** the result includes the saved canonical schema or accepted schema reference, updated draft revision metadata, saved timestamp, and conflict token or equivalent host version metadata where available

#### Scenario: Stale draft save reports conflict
- **WHEN** a save draft request uses stale host version metadata
- **THEN** the result reports a conflict status with enough information for the builder to show reload, retry, or preserve-local-work recovery options without mutating the local schema silently

### Requirement: Immutable publish contract
The adapters package SHALL treat published revisions as immutable and define publish operations that create or expose new published revision identities instead of mutating existing published revisions.

#### Scenario: Publish creates published revision metadata
- **WHEN** a draft is published successfully
- **THEN** the result includes published revision id, revision hash, schema version, published timestamp, form id, and canonical schema status compatible with public rendering and submission integrity checks

#### Scenario: Published revision is not updated in place
- **WHEN** a host integration attempts to publish changes over an existing published revision identity
- **THEN** the contract requires a new published revision identity or a conflict/blocked result rather than silently mutating the previous published revision

#### Scenario: Publish conflict is explicit
- **WHEN** a publish request is stale or rejected by host revision rules
- **THEN** the adapter result reports conflict or blocked status with message and diagnostics suitable for the builder publish workflow

### Requirement: Revision listing contract
The adapters package SHALL define revision listing contracts for draft and published revision metadata needed by builder warning and review surfaces.

#### Scenario: Revision list includes comparable metadata
- **WHEN** revisions are listed
- **THEN** each revision entry includes stable id, status, revision hash where available, created or published timestamp where available, title or label where available, and metadata needed to compare the current draft with the latest published revision

#### Scenario: Revision list avoids schema bloat by default
- **WHEN** the builder lists revisions for navigation or warning surfaces
- **THEN** the operation can return metadata without requiring every full schema payload unless the host explicitly includes it

### Requirement: React server-state integration boundary
React package and example integrations SHALL use TanStack Query only behind product-owned hooks or helpers and SHALL NOT require TanStack Query in `packages/core` or in the transport-agnostic adapter contracts.

#### Scenario: React hooks hide query implementation details
- **WHEN** builder or example code exposes load, save, publish, revision, or submission state
- **THEN** public-facing types describe product statuses and adapter results rather than requiring consumers to handle TanStack Query query or mutation objects directly

#### Scenario: Async states are represented consistently
- **WHEN** load, save, publish, revision list, published load, or submission operations are pending, successful, failed, retried, or conflicted
- **THEN** React integration exposes stable product-owned async states that UI components can render consistently

### Requirement: Adapter verification
The project SHALL verify persistence, publish, revision, and submission adapter contracts before Phase 10 is complete.

#### Scenario: Adapter contract tests pass
- **WHEN** adapter package tests run
- **THEN** they cover successful load, save draft, publish, list revisions, load published form, submit form, conflict responses, malformed responses, dangerous-key rejection, and package boundary expectations

#### Scenario: Full verification covers integration
- **WHEN** Phase 10 verification is run
- **THEN** builder tests, example Playwright tests, `pnpm test`, and `pnpm build` pass with the new persistence and publish workflows

#### Scenario: Phase report records persistence decisions
- **WHEN** Phase 10 implementation is complete
- **THEN** `docs/reports/2026-05-15-phase-10-persistence-publish-adapters.md` summarizes contracts, UI states, tests, known limitations, dirty unrelated files, and owner review checklist
