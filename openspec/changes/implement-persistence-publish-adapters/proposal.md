## Why

The builder can now author, edit, preview, and reorder canonical schemas, but it still cannot persist drafts, publish immutable revisions, or demonstrate backend-agnostic integration through agreed JSON contracts. This phase turns the local builder into a host-integrated workflow while keeping persistence behavior outside `packages/core` and outside backend-specific assumptions.

## What Changes

- Define thin adapter contracts for loading forms, saving drafts, publishing revisions, listing revisions, loading published forms, and submitting normalized envelopes.
- Add React/example-layer server-state hooks and fake host persistence for save, retry, conflict, publish, revision, and submission workflows without requiring TanStack Query in `packages/core`.
- Add builder persistence UI states for loading, dirty, saving, saved, error, retry, and conflict recovery.
- Add publish gating that combines schema validation, JSON Schema compiler diagnostics, dangerous-change diagnostics, required metadata checks, and immutable revision rules.
- Add revision warning and generated artifact surfaces so creators can see dangerous changes, generated JSON Schema, validation-plan output, and conformance fixture references before publishing.
- Preserve package boundaries: adapters remain thin JSON clients, validators own generated artifacts, builder owns publish UX, renderer owns respondent submission, and core remains framework-free.

## Capabilities

### New Capabilities

- `persistence-publish-adapters`: Host-provided persistence contracts, adapter response shapes, immutable revision semantics, TanStack Query integration boundaries, save/publish/submission workflows, and Phase 10 verification expectations.

### Modified Capabilities

- `builder-ui-foundation`: Add persistence status, publish checklist, conflict recovery, revision warning, and generated artifact panel requirements to the existing builder workspace contract.
- `json-schema-compiler`: Add generated artifact bundle requirements needed by the builder publish/artifact panel without moving compiler behavior into the builder.
- `react-renderer-foundation`: Clarify that public submission can use the normalized submit adapter contract while the renderer API remains product-owned.

## Impact

- Affected packages: `packages/adapters`, `packages/react-builder`, `packages/react-renderer`, `packages/validators`, and `examples/vite-react`.
- Public or semi-public contracts: adapter TypeScript interfaces, normalized persistence/publish responses, revision metadata, generated artifact bundle shape, and submission adapter usage.
- Dependencies: TanStack Query may be added only to React packages/examples or host integration helpers, not `packages/core`; adapter contracts themselves must stay transport-agnostic and JSON-first.
- Testing: adapter contract tests, builder component tests for save/conflict/publish states, Playwright tests for example draft save and publish flow, full `pnpm test`, and full `pnpm build`.
- Reports: write `docs/reports/2026-05-15-phase-10-persistence-publish-adapters.md` after implementation.
