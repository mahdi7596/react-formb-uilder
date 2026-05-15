# MVP Release Candidate Notes

Date: 2026-05-15

Status: MVP release candidate ready for owner review.

These notes describe the first MVP package set for owner review. The workspace is still private and uses the provisional `@your-org/*` package scope.

## Included Package Capabilities

### `@your-org/forms-core`

- Canonical schema contract helpers.
- Submitted path parsing, serialization, value access, and prototype-pollution-safe writes.
- Dangerous-key detection and executable schema code detection.
- Schema analysis diagnostics for duplicate ids, duplicate submitted paths, unsupported nodes, unknown fields, invalid conditions, and condition cycles.
- Validation primitives for MVP field rules.
- Deterministic condition evaluation and dependency extraction.
- Default value resolution, hidden-value semantics, submission normalization, file metadata normalization, and normalized submission envelopes.
- Backend response parsing for field and global validation errors.
- Product schema migration runner foundation.
- JSON-first conformance fixtures.

### `@your-org/forms-react-renderer`

- React respondent renderer for published canonical schemas.
- Built-in MVP fields, hidden fields, sections, single-page rendering, and multi-step navigation.
- Field registry overrides and renderer slots.
- Accessibility wiring for labels, descriptions, errors, invalid state, required/disabled state, and first-invalid focus.
- Normalized submission envelope creation and normalized backend response handling.
- Optional theme helper integration without requiring a host design system.

### `@your-org/forms-react-builder`

- Admin builder workspace with command-backed schema editing.
- Palette, canvas, inspector, preview through the real renderer, undo/redo, click-add, pointer drag, and keyboard movement alternatives.
- Persistence state surfaces for loading, saving, saved, failed, retry, and conflict states.
- Publish checklist, generated artifact display, revision warnings, and adapter-driven save/publish hooks.
- Builder server-state helper that keeps TanStack Query behind product-owned result shapes.

### `@your-org/forms-validators`

- Draft 2020-12 JSON Schema generation for submitted data where representable.
- Compiler diagnostics for unsupported backend artifacts.
- Validation plan entries and condition dependency artifacts.
- Builder artifact bundle for publish review.
- JSON-first compiler fixtures and backend-oriented usage documentation.

### `@your-org/forms-adapters`

- Thin JSON-first contracts for loading forms, saving drafts, publishing revisions, listing revisions, loading published forms, and submitting normalized envelopes.
- Product-owned success, conflict, validation, auth, rate-limit, server, network, malformed, blocked, and dangerous-key result statuses.
- Helpers for stale draft conflict and immutable published revision conflict shapes.

### `@your-org/forms-themes`

- Optional starter tokens and CSS variable helpers.
- Renderer and builder default theme helpers.
- Focus-visible and reduced-motion helpers.
- Removable styling path for host apps that want to provide their own design system.

### `examples/vite-react`

- Runnable host example that exercises the renderer, builder, fake host adapters, generated artifacts, persistence conflicts, publish flow, backend validation errors, hidden-field exclusion, RTL rendering, and theme overrides.

## Verification Status

Phase 13 verification is recorded in `docs/reports/2026-05-15-phase-13-mvp-release-candidate.md`. The release-candidate verification set passed:

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- `pnpm audit:release`
- `pnpm --filter @your-org/forms-react-builder e2e`
- `pnpm --filter @your-org/forms-example-vite-react test:e2e`
- `openspec validate implement-mvp-hardening-release-candidate --strict`
- `openspec validate --all --strict`

## Known Limitations

- Package names still use the provisional `@your-org/*` scope.
- Packages are private and not published to npm.
- No hosted documentation site exists yet.
- No real backend implementation is included; host apps provide persistence and submission APIs.
- File support is metadata-only. Built-in upload orchestration, provider upload lifecycle, scanning, finalization, and cleanup are deferred.
- Repeaters and nested repeaters are excluded from MVP.
- Payments, signatures, matrix/ranking fields, dynamic lookup fields, rich text authoring, workflow automation, collaboration, hosted tenancy, and advanced analytics are deferred.
- JSON Schema output is a backend-friendly artifact, not the canonical authoring model and not a complete representation of UI behavior.
- Visual styling is intentionally a removable starter theme, not a final product design system.

## Owner Decisions Before Public Publishing

- Choose the final package scope and naming.
- Decide whether this release candidate is sufficient for private evaluation, public prerelease, or continued hardening.
- Decide which deferred features belong in the next post-MVP phase.
- Decide whether to add a hosted docs site, package publishing workflow, and changelog automation before public distribution.
