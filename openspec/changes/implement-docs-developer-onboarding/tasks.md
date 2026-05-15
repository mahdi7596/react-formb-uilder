## 1. Root Onboarding And Package Map

- [x] 1.1 Create root `README.md` with product positioning, current MVP status, package map, setup commands, verification commands, example app commands, and documentation links.
- [x] 1.2 Document package boundaries in the root README: framework-agnostic core, React renderer, React builder, validators, adapters, themes, and example app.
- [x] 1.3 Document the phase workflow and owner review process in the root README with links to `AGENTS.md` and `docs/development/phase-workflow.md`.
- [x] 1.4 Verify the root README commands match current `package.json`, pnpm workspace scripts, and example scripts.

## 2. Package README Refresh

- [x] 2.1 Update `packages/core/README.md` to describe implemented contracts, runtime behavior, safety utilities, fixtures, exports, and dependency boundaries.
- [x] 2.2 Review and update `packages/react-renderer/README.md` links to the renderer integration and accessibility docs.
- [x] 2.3 Review and update `packages/react-builder/README.md` links to the builder integration, backend contracts, revision, and theme docs.
- [x] 2.4 Review and update `packages/validators/README.md` links to JSON Schema generation and backend integration docs.
- [x] 2.5 Review and update `packages/adapters/README.md` links to backend contracts and revision/dangerous-change docs.
- [x] 2.6 Review and update `packages/themes/README.md` links to root onboarding, renderer/builder docs, and theme customization guidance.

## 3. Integration Documentation

- [x] 3.1 Create `docs/integration/react-renderer.md` covering `FormRenderer`, schema input, submission adapter, styles/theme options, field registry overrides, slots, class hooks, data attributes, validation, backend errors, and first-invalid focus.
- [x] 3.2 Create `docs/integration/react-builder.md` covering `BuilderWorkspace`, schema input, persistence state, publish checklist, generated artifact bundle, revision metadata, callbacks, command boundaries, theme hooks, RTL/LTR behavior, and creator workflow states.
- [x] 3.3 Create `docs/integration/backend-contracts.md` covering adapter operations, normalized result statuses, JSON-serializable payload rules, error mapping, forbidden backend leakage, and conformance fixture guidance.
- [x] 3.4 Create `docs/integration/json-schema-generation.md` covering Draft 2020-12 compiler output, diagnostics, validation plans, condition dependencies, fixture references, limitations, and backend consumption boundaries.
- [x] 3.5 Reconcile existing `docs/integration/backend-json-schema.md` by updating it to point to the new JSON Schema generation guide or by making it a compatibility/short-form page with no conflicting guidance.

## 4. Accessibility, Safety, And Revision Documentation

- [x] 4.1 Create `docs/accessibility/field-contract.md` covering labels, descriptions, required/disabled state, errors, fieldsets, focus targets, hidden fields, custom fields, RTL/LTR expectations, and reduced-motion considerations.
- [x] 4.2 Create `docs/security/schema-and-submission-safety.md` covering dangerous-key rejection, submitted path grammar, hidden-value semantics, normalized submission envelopes, backend response parsing, extension fail-closed behavior, and forbidden persisted executable behavior.
- [x] 4.3 Create `docs/migrations/revisions-and-dangerous-changes.md` covering draft vs published revisions, immutable published revision behavior, revision hashes, conflicts, publish blocking, dangerous-change diagnostics, and migration boundaries.
- [x] 4.4 Add cross-links from these docs to existing schema docs under `docs/schema/`.

## 5. Extension And Backend Examples

- [x] 5.1 Add a custom field registration example using current renderer field registry contracts and renderer-managed accessibility props.
- [x] 5.2 Add a custom validator registration example explaining key/version, backend parity expectations, diagnostics, and fail-closed behavior.
- [x] 5.3 Add a custom predicate registration example explaining declarative condition integration, dependency tracking expectations, diagnostics, and fail-closed behavior.
- [x] 5.4 Add backend response mapping examples for success, validation error, conflict, auth error, rate limit, and server error using normalized contracts or existing fixtures.
- [x] 5.5 Ensure examples do not store executable JavaScript or React components in persisted schemas and do not expose React Hook Form, TanStack Query, or backend-specific SDK objects as public contracts.

## 6. Documentation Quality Checks

- [x] 6.1 Run `rg "Phase 0 placeholder|No .* behavior is implemented|TODO|TBD|unspecified" README.md docs packages/*/README.md` and fix stale onboarding language or document intentional exclusions.
- [x] 6.2 Run practical link/reference checks with `rg "docs/|packages/|examples/" README.md docs packages/*/README.md` and verify referenced files exist.
- [x] 6.3 Follow the root README setup/verification path from the current checkout where practical.
- [x] 6.4 Run `pnpm test`.
- [x] 6.5 Run `pnpm build`.
- [x] 6.6 Run `pnpm typecheck`.
- [x] 6.7 Run `openspec validate implement-docs-developer-onboarding --strict`.

## 7. Phase Report And Review

- [x] 7.1 Write `docs/reports/2026-05-15-phase-12-docs-onboarding.md` with changed docs, examples added, commands run, validation results, known limitations, and owner review checklist.
- [x] 7.2 Record whether no formal markdown link checker is configured and what practical checks were used instead.
- [x] 7.3 Record any deferred work such as package scope rename, docs site generation, publishing docs, older OpenSpec strict-format cleanup, or release notes.
- [x] 7.4 Commit the proposal artifacts separately from implementation work.
