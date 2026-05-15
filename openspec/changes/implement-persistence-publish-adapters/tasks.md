## 1. Adapter Contracts

- [x] 1.1 Replace the adapters placeholder export with typed operation contracts for `loadForm`, `saveDraft`, `publishRevision`, `listRevisions`, `loadPublishedForm`, and `submitForm`.
- [x] 1.2 Define normalized adapter result envelopes for success, validation error, conflict, auth error, rate limit, server error, network error, malformed response, and dangerous-key rejection.
- [x] 1.3 Define draft metadata, published revision metadata, conflict metadata, revision list entries, and immutable publish response types.
- [x] 1.4 Add adapter helper functions for normalizing results and rejecting dangerous keys in inspected JSON surfaces.
- [x] 1.5 Update the adapters README with boundary rules, contract summaries, and non-goals.

## 2. Adapter Tests

- [x] 2.1 Add contract tests for successful load draft, save draft, publish revision, list revisions, load published form, and submit form results.
- [x] 2.2 Add tests for stale draft save conflict and publish conflict result shapes.
- [x] 2.3 Add tests for malformed adapter data and dangerous-key rejection.
- [x] 2.4 Add package boundary checks proving `packages/core` does not depend on adapters, React, TanStack Query, or transport code.

## 3. Generated Artifact Bundle

- [x] 3.1 Extend validators compiler exports with a builder review artifact bundle containing JSON Schema, diagnostics, validation plan, condition dependencies, dialect metadata, and fixture references.
- [x] 3.2 Add tests proving artifact bundle diagnostics preserve original compiler codes and severity.
- [x] 3.3 Update validators documentation with the generated artifact bundle shape and builder handoff expectations.

## 4. Builder Persistence And Publish Model

- [x] 4.1 Add product-owned persistence state types for loading, dirty, saving, saved, failed, retrying, and conflicted draft states.
- [x] 4.2 Add product-owned publish check types for blocking errors, reviewable warnings, metadata checks, compiler diagnostics, dangerous-change diagnostics, and adapter conflicts.
- [x] 4.3 Add helper logic that composes schema diagnostics, compiler artifacts, command/diff dangerous-change diagnostics, and required metadata into a publish checklist.
- [x] 4.4 Add revision comparison helpers for current draft metadata versus latest published revision metadata.
- [x] 4.5 Keep schema mutations routed through existing builder commands and store paths.

## 5. Builder UI Surfaces

- [x] 5.1 Add draft loading, dirty, save, saved, failure, retry, and conflict UI states to the builder workspace.
- [x] 5.2 Add conflict recovery controls that allow reload latest, retry where safe, or preserve local edits without silently replacing the local schema.
- [x] 5.3 Add a publish checklist surface that blocks publish on errors and shows reviewable warnings.
- [x] 5.4 Add a revision warning surface for latest published revision context and dangerous draft differences.
- [x] 5.5 Add a generated artifact panel for JSON Schema, compiler diagnostics, validation plan, condition dependencies, and fixture references.
- [x] 5.6 Ensure the new UI states work in desktop and narrow layouts without overlapping text or unusable controls.

## 6. React Server-State Integration

- [x] 6.1 Add React/example-layer hooks or helpers for load draft, save draft, publish revision, list revisions, load published form, and submit form using product-owned return types.
- [x] 6.2 Use TanStack Query only behind those hooks/helpers and avoid exposing query or mutation objects as domain contracts.
- [x] 6.3 Ensure TanStack Query is not added to `packages/core` or required by transport-agnostic adapter contracts.

## 7. Example App Integration

- [x] 7.1 Add fake host persistence for draft loading, draft saving, stale draft conflict, publish success, publish conflict, revision listing, published form loading, and normalized submission.
- [x] 7.2 Wire the Vite React example builder to the fake host persistence and publish workflow.
- [x] 7.3 Wire public renderer submission in the example through the normalized submit adapter contract.
- [x] 7.4 Document how to exercise save, conflict, publish, artifact review, and submission flows in the example README.

## 8. Builder And Renderer Tests

- [x] 8.1 Add builder tests for draft loading, save success, save failure, retry, conflict recovery, and dirty state.
- [x] 8.2 Add builder tests for publish blocked, publish warnings, publish success, immutable revision metadata, and revision warning states.
- [x] 8.3 Add builder tests for generated artifact panel rendering and compiler diagnostic handling.
- [x] 8.4 Add renderer tests for normalized submission adapter success and backend validation error mapping.

## 9. Browser Verification

- [x] 9.1 Add Playwright coverage for example draft save success and visible saved state.
- [x] 9.2 Add Playwright coverage for save conflict recovery.
- [x] 9.3 Add Playwright coverage for publish blocked, publish success, revision warning, and generated artifact panel states.
- [x] 9.4 Add Playwright coverage for public renderer submission through the fake submit adapter.

## 10. Full Verification And Report

- [x] 10.1 Run `pnpm --filter @your-org/forms-adapters test`.
- [x] 10.2 Run focused validators, builder, renderer, and example tests affected by Phase 10.
- [x] 10.3 Run example Playwright tests for persistence and publish workflows.
- [x] 10.4 Run `pnpm test`.
- [x] 10.5 Run `pnpm build`.
- [x] 10.6 Run `openspec validate implement-persistence-publish-adapters --strict`.
- [x] 10.7 Write `docs/reports/2026-05-15-phase-10-persistence-publish-adapters.md` with changed files, implemented contracts, UI states, screenshots or browser evidence, commands run, known limitations, unrelated dirty files, and owner review checklist.
