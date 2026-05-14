# Form Builder Development Master Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement each phase task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the backend-agnostic React form builder from the approved architecture, moving only one reviewed phase at a time.

**Architecture:** The product is package-first: `packages/core` owns framework-agnostic contracts and runtime behavior, `packages/react-renderer` owns respondent rendering, `packages/react-builder` owns the visual editor, and optional packages own validators, adapters, uploads, themes, and examples. The canonical custom form schema is the source of truth; JSON Schema is generated only as a backend-friendly artifact.

**Tech Stack:** TypeScript monorepo, React, React Hook Form internal to the renderer only, TanStack Query for adapter/server state in React packages and examples, dnd-kit in the builder, Vitest, React Testing Library, Playwright, axe-compatible accessibility checks, Draft 2020-12 JSON Schema generation.

---

## Operating Model

Development must proceed in phases. At the end of every phase:

1. Run that phase's required verification commands.
2. Write a detailed phase report under `docs/reports/`.
3. Stop and ask the owner to inspect the output.
4. Continue only after owner approval or after requested corrections are made.

Each phase report must include:

- Phase name and date.
- Summary of what changed.
- Files created or modified.
- Public contracts introduced or changed.
- Decisions made and why.
- Tests run, exact commands, and results.
- Known limitations and deferred work.
- Screenshots or browser notes for UI phases.
- Owner review checklist.

Recommended report path format:

```text
docs/reports/YYYY-MM-DD-phase-N-short-name.md
```

Because the workspace is currently not a git repository, the first execution phase should either initialize git or explicitly record that version control is being handled elsewhere. If git is initialized, each phase should end with a clean working tree or a clear list of uncommitted artifacts for owner review.

## Current Workspace Baseline

Existing files inspected:

- `AGENTS.md`
- `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`
- `docs/architecture/2026-05-14-react-technical-architecture-decisions.md`
- `DESIGN.md`
- `docs/research/2026-05-14-complete-form-builder-component-interaction-specification.md`
- `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
- `docs/research/complete-form-builder-component-audit-standard-prompt.md`
- `openspec/config.yaml`

Existing OpenSpec state:

- `openspec list --json` returns no active changes.
- No change artifacts currently exist under `openspec/changes/`.

Important starting constraint:

- The project has documentation and one HTML simulation, but no package scaffold, no `package.json`, no tests, and no source packages yet.

## Phase 0: Project Setup And Governance

**Goal:** Create the development foundation without implementing product behavior.

**Tasks:**

- [ ] Decide whether this workspace should be initialized as a git repository.
- [ ] If yes, create `.gitignore` for Node, package managers, build outputs, coverage, Playwright reports, OS files, and local environment files.
- [ ] Create root `package.json` with package manager scripts for build, test, lint, typecheck, format, and clean.
- [ ] Choose and lock package manager. Recommended: `pnpm` workspaces.
- [ ] Create `pnpm-workspace.yaml`.
- [ ] Create root TypeScript configuration files: `tsconfig.base.json` and package-level extension pattern.
- [ ] Create root Vitest configuration.
- [ ] Create ESLint and Prettier configuration if the project owner wants automated formatting from the beginning.
- [ ] Create base folder structure:

```text
packages/
  core/
  react-renderer/
  react-builder/
  validators/
  adapters/
  themes/
examples/
  vite-react/
docs/
  schema/
  integration/
  accessibility/
  migrations/
  security/
  reports/
```

- [ ] Add package placeholder `package.json` files for core packages with names, exports, and dependency boundaries.
- [ ] Add dependency boundary notes to each package README.
- [ ] Document the phase workflow in `docs/development/phase-workflow.md`.

**Verification at end of phase:**

- [ ] Run `pnpm install`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Confirm `packages/core` has no React dependency.
- [ ] Write `docs/reports/2026-05-14-phase-0-project-setup.md`.
- [ ] Owner reviews the repository scaffold and confirms package names, package manager, and workflow.

**Exit criteria:**

- Monorepo can install, typecheck, test, and build with empty or placeholder packages.
- Package boundaries are visible.
- Future agents know the phase gate process.

## Phase 1: Canonical Contract Specification

**Goal:** Lock the contracts that must exist before product behavior is written.

**Tasks:**

- [ ] Create `docs/schema/canonical-schema-v1.md`.
- [ ] Specify `schemaVersion`, `formId`, `revisionId`, `revisionHash`, `status`, `locale`, `direction`, `title`, `settings`, `nodes`, `meta`, and localization model.
- [ ] Specify node contracts for MVP: `field`, `section`, `step`, `content`, `ending`, and `hidden`.
- [ ] Decide MVP field list from the research document:
  - short text
  - long text
  - number
  - email
  - phone with conservative string contract unless compound phone is explicitly approved
  - URL
  - single choice
  - multiple choice
  - dropdown
  - single checkbox or consent
  - boolean switch
  - date
  - time
  - rating
  - linear scale
  - heading
  - paragraph
  - image metadata
  - divider
  - hidden field
- [ ] Explicitly exclude repeaters from MVP unless their full path, state, error, migration, accessibility, and JSON Schema semantics are specified first.
- [ ] Explicitly keep upload orchestration out of MVP. MVP may include file metadata contracts only if approved.
- [ ] Create `docs/schema/submitted-path-grammar-v1.md`.
- [ ] Define submitted path grammar for object keys and arrays.
- [ ] Reject dangerous path segments and object keys: `__proto__`, `constructor`, and `prototype`.
- [ ] Decide whether keys with dots are allowed only through escaping or are disallowed in MVP.
- [ ] Define empty value normalization rules for each MVP field type.
- [ ] Create `docs/schema/submission-envelope-v1.md`.
- [ ] Include `formId`, `revisionId`, `revisionHash`, `schemaVersion`, `submissionAttemptId`, `submittedAt`, `locale`, `data`, `files`, and `meta`.
- [ ] Create `docs/schema/backend-response-v1.md`.
- [ ] Define `success`, `validation_error`, `server_error`, `auth_error`, `rate_limited`, and `conflict`.
- [ ] Define field errors, global errors, `path`, `code`, `message`, `params`, and `source`.
- [ ] Create `docs/schema/validation-rules-v1.md`.
- [ ] Define required, min/max length, numeric min/max, regex restrictions, email, URL, option membership, checkbox consent, custom named validators, and fail-closed behavior.
- [ ] Create `docs/schema/conditions-v1.md`.
- [ ] Define `all`, `any`, `not`, comparison operators, empty checks, contains, dependency tracking, missing-value behavior, and cycle detection.
- [ ] Create `docs/schema/hidden-value-semantics-v1.md`.
- [ ] Set default: hidden values are excluded from final submission unless a schema setting explicitly preserves them.
- [ ] Create `docs/schema/extension-registration-v1.md`.
- [ ] Define custom field, validator, and predicate registrations with key, version, input contract, output contract, backend parity flag, diagnostics, and fail-closed behavior.
- [ ] Create `docs/schema/json-schema-generation-v1.md`.
- [ ] Lock JSON Schema dialect to Draft 2020-12.
- [ ] Define what generated JSON Schema does and does not guarantee.
- [ ] Define compiler diagnostics for unsupported behavior.
- [ ] Create `docs/schema/backend-conformance-fixtures-v1.md`.
- [ ] List required fixtures before implementation starts.

**Verification at end of phase:**

- [ ] Review every item in the architecture document's prioritized pre-implementation action list and map it to a spec file.
- [ ] Run a documentation consistency pass with `rg "TODO|TBD|unspecified|later"` against the new schema docs.
- [ ] Write `docs/reports/2026-05-14-phase-1-contract-specification.md`.
- [ ] Owner reviews and approves the schema, path grammar, submission contract, response contract, hidden-value policy, custom extension model, and MVP exclusions.

**Exit criteria:**

- All contracts needed for core implementation are specified.
- Repeaters and upload orchestration are either explicitly excluded or fully specified.
- No behavior-critical contract is left implicit.

## Phase 2: Core Package Contracts And Fixtures

**Goal:** Implement the framework-agnostic core types, fixtures, and contract tests.

**Tasks:**

- [ ] Create `packages/core/src/schema/` for canonical TypeScript types.
- [ ] Create `packages/core/src/paths/` for submitted path parsing and serialization.
- [ ] Create `packages/core/src/diagnostics/` for structured diagnostics.
- [ ] Create `packages/core/src/testing/fixtures/`.
- [ ] Add valid schema fixture.
- [ ] Add invalid schema fixtures for unsafe keys, missing names, duplicate ids, unknown node types, unknown field types, invalid validation rules, invalid conditions, and unsupported custom registrations.
- [ ] Add valid submission fixture.
- [ ] Add invalid submission fixtures for dangerous keys, invalid paths, validation failures, missing revision hash, and duplicate/malformed idempotency key.
- [ ] Add backend response fixtures for success, validation error, conflict, auth error, rate limit, and server error.
- [ ] Add compiler warning fixture for non-representable conditional behavior.
- [ ] Write Vitest tests that load every fixture and assert expected pass/fail diagnostics.
- [ ] Export only framework-neutral APIs from `packages/core`.

**Verification at end of phase:**

- [ ] Run `pnpm --filter @your-org/forms-core test`.
- [ ] Run `pnpm --filter @your-org/forms-core typecheck`.
- [ ] Run `pnpm test`.
- [ ] Confirm `packages/core/package.json` has no React, AJV, Zod, TanStack Query, dnd-kit, upload provider, or transport dependencies.
- [ ] Write `docs/reports/2026-05-14-phase-2-core-contracts-fixtures.md`.
- [ ] Owner reviews fixtures and core public API before runtime behavior expands.

**Exit criteria:**

- Core package has stable TypeScript contracts and fixtures.
- Dangerous keys and invalid schema cases are represented in tests.
- Backend conformance work has a concrete foundation.

## Phase 3: Core Runtime Behavior

**Goal:** Implement the core runtime functions that the renderer and builder will rely on.

**Tasks:**

- [ ] Implement submitted path parser, serializer, and setter/getter helpers.
- [ ] Implement dangerous-key rejection for schemas, defaults, props, metadata, submissions, and backend responses.
- [ ] Implement schema traversal by node id and submitted path.
- [ ] Implement duplicate id and duplicate submitted path diagnostics.
- [ ] Implement default value resolution and empty value normalization.
- [ ] Implement validation primitives for MVP rules.
- [ ] Implement condition evaluation with dependency tracking.
- [ ] Implement cycle detection for conditions.
- [ ] Implement hidden-field final submission filtering.
- [ ] Implement normalized submission envelope creation.
- [ ] Implement normalized backend response parsing and mapping to field/global errors.
- [ ] Implement migration runner shell for future product schema migrations without shipping complex migrations yet.

**Verification at end of phase:**

- [ ] Run focused Vitest suites for paths, dangerous keys, traversal, validation, conditions, hidden values, submissions, responses, and migrations.
- [ ] Run `pnpm --filter @your-org/forms-core test -- --coverage` if coverage tooling is configured.
- [ ] Run `pnpm typecheck`.
- [ ] Write `docs/reports/2026-05-14-phase-3-core-runtime.md`.
- [ ] Owner reviews runtime behavior with examples and confirms contract behavior before React packages start depending on it.

**Exit criteria:**

- Core behavior is usable without React.
- Unknown custom validators and predicates fail closed.
- Hidden-value semantics and normalized submission behavior are tested.

## Phase 4: Validators And JSON Schema Compiler

**Goal:** Add optional backend-friendly JSON Schema generation without moving compiler behavior into core.

**Tasks:**

- [ ] Create `packages/validators`.
- [ ] Implement Draft 2020-12 submitted-data schema generation for MVP field types.
- [ ] Emit diagnostics for UI behavior that JSON Schema cannot represent.
- [ ] Emit diagnostics for custom fields without JSON Schema generation hooks.
- [ ] Emit diagnostics for unsupported regex patterns.
- [ ] Keep AJV helpers optional and outside `packages/core`.
- [ ] Add conformance fixtures for generated schemas.
- [ ] Add examples showing how a non-React backend can consume generated JSON Schema and response fixtures.

**Verification at end of phase:**

- [ ] Run `pnpm --filter @your-org/forms-validators test`.
- [ ] Run `pnpm --filter @your-org/forms-core test`.
- [ ] Run `pnpm typecheck`.
- [ ] Confirm `packages/core` still has no compiler dependency on `packages/validators`.
- [ ] Write `docs/reports/2026-05-14-phase-4-json-schema-compiler.md`.
- [ ] Owner reviews generated schema output and compiler diagnostics.

**Exit criteria:**

- Generated JSON Schema is a documented artifact, not the authoring model.
- Compiler warnings are explicit and tested.

## Phase 5: React Renderer Foundation

**Goal:** Build the respondent renderer around the core contracts with a product-owned public API.

**Tasks:**

- [ ] Create `packages/react-renderer`.
- [ ] Define `FormRenderer`, `FormProvider`, field registry, renderer slots, and submission adapter contracts.
- [ ] Add renderer-managed ids, labels, descriptions, errors, required/disabled state, and focus target contract.
- [ ] Implement default fields for the MVP field list approved in Phase 1.
- [ ] Implement structural rendering for sections and steps.
- [ ] Implement basic step navigation and current-step validation.
- [ ] Implement conditional visibility through `packages/core`.
- [ ] Implement hidden-value filtering through `packages/core`.
- [ ] Implement normalized submission creation through `packages/core`.
- [ ] Keep React Hook Form internal if used. Public APIs must not expose RHF types or form state.
- [ ] Add basic CSS variables, data attributes, class hooks, and minimal default styling.

**Verification at end of phase:**

- [ ] Run `pnpm --filter @your-org/forms-react-renderer test`.
- [ ] Run React Testing Library tests for labels, descriptions, errors, required state, disabled state, conditional visibility, step navigation, and submission envelope creation.
- [ ] Run axe-compatible checks for built-in fields.
- [ ] Run `pnpm typecheck`.
- [ ] Write `docs/reports/2026-05-14-phase-5-react-renderer.md`.
- [ ] Owner reviews renderer examples and accessibility behavior.

**Exit criteria:**

- A host React app can render and submit a published schema.
- Built-in fields meet the renderer field contract.
- The renderer is usable with custom slots and does not leak RHF.

## Phase 6: Example App And Renderer E2E

**Goal:** Create a runnable Vite React example that proves the renderer in a real app.

**Tasks:**

- [ ] Create `examples/vite-react`.
- [ ] Load a fixture published schema.
- [ ] Render the form using `packages/react-renderer`.
- [ ] Add fake submission adapter returning success and validation error responses.
- [ ] Add example pages for single-page and multi-step forms.
- [ ] Add locale and direction examples for LTR and RTL.
- [ ] Add Playwright tests for successful submission, server validation error mapping, step navigation, hidden fields, and keyboard focus.
- [ ] Use the Browser plugin for rendered verification when available.

**Verification at end of phase:**

- [ ] Run `pnpm --filter @your-org/forms-example-vite-react dev` for manual inspection.
- [ ] Run `pnpm --filter @your-org/forms-example-vite-react test:e2e`.
- [ ] Capture desktop and narrow viewport screenshots.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Write `docs/reports/2026-05-14-phase-6-renderer-example-e2e.md`.
- [ ] Owner checks the running example and confirms respondent behavior.

**Exit criteria:**

- Renderer is proven in a real browser.
- UI, accessibility, and contract behavior are demonstrable before builder work begins.

## Phase 7: Builder Domain Commands And Store

**Goal:** Implement schema-editing behavior outside React components.

**Tasks:**

- [ ] Create `packages/react-builder`.
- [ ] Create `packages/react-builder/src/commands/`.
- [ ] Implement commands for adding, deleting, duplicating, moving, updating labels, updating submitted names, updating validation rules, updating conditions, and changing options.
- [ ] Add command diagnostics for dangerous schema changes: submitted path rename, deletion, scalar-to-array change, option value change, requiredness change, hidden-value policy change, and field type change.
- [ ] Create Zustand-style editor store for selection, active panel, canvas mode, drag state, command status, and history.
- [ ] Keep domain invariants in commands and core functions, not React components.
- [ ] Add undo/redo history around commands.
- [ ] Add tests for every command and history behavior.

**Verification at end of phase:**

- [ ] Run `pnpm --filter @your-org/forms-react-builder test`.
- [ ] Run `pnpm --filter @your-org/forms-core test`.
- [ ] Run `pnpm typecheck`.
- [ ] Write `docs/reports/2026-05-14-phase-7-builder-commands-store.md`.
- [ ] Owner reviews command behavior and dangerous-change diagnostics.

**Exit criteria:**

- Builder schema mutations are testable without React UI.
- Undo/redo and migration warnings work at the command layer.

## Phase 8: Builder UI Foundation

**Goal:** Build the first usable visual builder shell.

**Tasks:**

- [ ] Build RTL-first app shell using `DESIGN.md`: top command bar, right palette, center canvas, left inspector.
- [ ] Build shared UI primitives: buttons, icon buttons, inputs, textareas, selects, panels, tabs, tooltips, menus, empty states, loading states, error states, inspector rows, field chrome, labels, descriptions, validation messages.
- [ ] Build searchable grouped component palette.
- [ ] Build canvas node rendering for MVP field types.
- [ ] Build selection outline, quick actions, and inline label editing.
- [ ] Build inspector tabs for content, validation, logic, accessibility, and data contract settings.
- [ ] Wire inspector changes to builder commands.
- [ ] Add preview mode using the real renderer from `packages/react-renderer`.
- [ ] Avoid duplicating renderer field behavior inside preview.
- [ ] Add responsive behavior: desktop three-panel layout, tablet inspector drawer, mobile quick-edit/preview-oriented flow.

**Verification at end of phase:**

- [ ] Use `form-builder-ui-reviewer` for visual UI quality review.
- [ ] Use `form-builder-ux-reviewer` for creator UX review.
- [ ] Run React Testing Library tests for palette, canvas selection, inspector edits, preview mode, and empty states.
- [ ] Run Playwright tests for create simple form, edit field, preview, and publish diagnostics visibility.
- [ ] Use Browser plugin to inspect desktop and narrow viewports.
- [ ] Capture screenshots for the phase report.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Write `docs/reports/2026-05-14-phase-8-builder-ui-foundation.md`.
- [ ] Owner manually checks the builder UI and decides whether visual/UX corrections are needed before drag-and-drop.

**Exit criteria:**

- A creator can build a simple form through click-add and inspector editing.
- Preview uses the real renderer.
- The builder follows the provisional design system and RTL-first layout.

## Phase 9: Drag-And-Drop And Keyboard Builder Workflows

**Goal:** Add accessible drag-and-drop without bypassing command boundaries.

**Tasks:**

- [ ] Add dnd-kit to `packages/react-builder`.
- [ ] Create builder DnD abstraction layer.
- [ ] Implement palette-to-canvas insertion.
- [ ] Implement canvas reorder.
- [ ] Implement drag overlay.
- [ ] Implement valid and invalid drop feedback.
- [ ] Implement keyboard insertion and movement alternatives.
- [ ] Ensure all DnD callbacks call schema commands rather than mutating schema in UI components.
- [ ] Add accessible announcements for drag start, movement, invalid drop, and drop result.

**Verification at end of phase:**

- [ ] Run command tests and builder component tests.
- [ ] Run Playwright tests for pointer drag, keyboard movement, invalid drop, and undo/redo after drag.
- [ ] Run axe-compatible checks on builder flows.
- [ ] Use Browser plugin to inspect drag feedback and keyboard behavior.
- [ ] Write `docs/reports/2026-05-14-phase-9-dnd-keyboard-workflows.md`.
- [ ] Owner checks drag-and-drop and keyboard builder behavior.

**Exit criteria:**

- Drag-and-drop is usable by pointer and keyboard.
- Schema mutations remain command-driven.
- Invalid drops are clear and recoverable.

## Phase 10: Builder Persistence, Publish Flow, And Adapters

**Goal:** Add host-provided persistence contracts and publish gating.

**Tasks:**

- [ ] Create `packages/adapters`.
- [ ] Define adapter contracts for `loadForm`, `saveDraft`, `publishRevision`, `listRevisions`, `loadPublishedForm`, and `submitForm`.
- [ ] Add TanStack Query hooks in React package/example layers only.
- [ ] Build save draft status, error, retry, and conflict states.
- [ ] Build publish checklist using schema validation, compiler diagnostics, dangerous-change diagnostics, and required metadata checks.
- [ ] Enforce immutable published revisions in adapter contracts.
- [ ] Add revision diff warning surface for dangerous changes.
- [ ] Add generated artifact panel for JSON Schema and conformance fixtures.

**Verification at end of phase:**

- [ ] Run adapter contract tests.
- [ ] Run builder tests for save, conflict, publish blocked, publish success, and revision warning states.
- [ ] Run Playwright tests for draft save and publish flow in the example app.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Write `docs/reports/2026-05-14-phase-10-persistence-publish-adapters.md`.
- [ ] Owner reviews persistence contracts and publish UX.

**Exit criteria:**

- Builder can load, save, and publish through normalized JSON contracts.
- Publish flow prevents invalid or unsafe revisions.

## Phase 11: Theme Package And Design-System Readiness

**Goal:** Make styling reusable without locking host apps into a heavyweight design system.

**Tasks:**

- [ ] Create `packages/themes`.
- [ ] Convert `DESIGN.md` tokens into CSS variables or typed theme tokens.
- [ ] Add default minimal theme for renderer and builder examples.
- [ ] Expose class hooks and data attributes for host styling.
- [ ] Ensure renderer slots can replace labels, descriptions, errors, buttons, progress, wrappers, and field chrome.
- [ ] Add RTL/LTR logical CSS checks.
- [ ] Add reduced-motion behavior for animations.

**Verification at end of phase:**

- [ ] Run visual checks in Vite example for default theme.
- [ ] Run Playwright screenshots for LTR, RTL, desktop, and narrow viewport.
- [ ] Run accessibility checks for focus visibility and contrast.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Write `docs/reports/2026-05-14-phase-11-theme-design-system-readiness.md`.
- [ ] Owner reviews theme output and host customization affordances.

**Exit criteria:**

- Default UI is polished enough for examples.
- Host apps can style or replace visual pieces without changing core behavior.

## Phase 12: Documentation And Developer Onboarding

**Goal:** Make the packages understandable and installable for future users and future agents.

**Tasks:**

- [ ] Write root README with product positioning and package map.
- [ ] Write `docs/integration/react-renderer.md`.
- [ ] Write `docs/integration/react-builder.md`.
- [ ] Write `docs/integration/backend-contracts.md`.
- [ ] Write `docs/integration/json-schema-generation.md`.
- [ ] Write `docs/accessibility/field-contract.md`.
- [ ] Write `docs/security/schema-and-submission-safety.md`.
- [ ] Write `docs/migrations/revisions-and-dangerous-changes.md`.
- [ ] Add examples for custom field registration, custom validator registration, and custom predicate registration.
- [ ] Add example backend response mappings.

**Verification at end of phase:**

- [ ] Run documentation link checks if tooling is configured.
- [ ] Run all tests and builds.
- [ ] Follow the README from a clean checkout or clean workspace install.
- [ ] Write `docs/reports/2026-05-14-phase-12-docs-onboarding.md`.
- [ ] Owner reviews developer onboarding flow.

**Exit criteria:**

- A new developer can understand, install, run, and extend the project.
- Durable contracts are documented where future agents will find them.

## Phase 13: MVP Hardening And Release Candidate

**Goal:** Stabilize the first MVP package set.

**Tasks:**

- [ ] Run full typecheck, test, build, and e2e suites.
- [ ] Audit package exports and dependency boundaries.
- [ ] Audit bundle shape for broad imports and avoidable React package coupling.
- [ ] Audit accessibility across renderer and builder.
- [ ] Audit security behavior for schema validation, dangerous keys, rich text exclusion, and submission normalization.
- [ ] Audit RTL/LTR behavior.
- [ ] Audit published revision immutability and submission revision hash behavior.
- [ ] Resolve high-priority issues found during audits.
- [ ] Prepare release notes for MVP.

**Verification at end of phase:**

- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm typecheck`.
- [ ] Run Playwright e2e suite.
- [ ] Run accessibility checks.
- [ ] Run package boundary audit.
- [ ] Write `docs/reports/2026-05-14-phase-13-mvp-release-candidate.md`.
- [ ] Owner performs final MVP review and decides whether to release, continue hardening, or start Phase 2 features.

**Exit criteria:**

- MVP can be demonstrated end to end: build schema, preview with real renderer, publish through adapters, render public form, submit normalized payload, handle backend response.
- Known limitations are documented.
- Next-phase feature candidates are clear.

## Deferred Until After MVP

These should not be implemented during MVP unless the owner explicitly changes scope and their contracts are specified first:

- Nested repeaters.
- Built-in upload orchestration and provider-specific upload lifecycle.
- Payments.
- Signature.
- Matrix/grid and ranking.
- Dynamic lookup and external record picker.
- Rich text authoring.
- Arbitrary JavaScript expressions.
- Full workflow automation.
- Advanced analytics, A/B tests, click maps, AI follow-up, voice, and video response.
- Hosted SaaS tenancy and role-based collaboration.

## Phase Approval Template

Use this at the end of every phase report:

```markdown
## Owner Review

- [ ] I reviewed the changed files.
- [ ] I ran or inspected the app/output where applicable.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

- 
```

## Recommended First Execution Step

Start with Phase 0 only. Do not scaffold product behavior yet. The main decision before writing code is whether to initialize git in this folder and whether the package namespace should remain placeholder `@your-org/*` or be replaced with the final npm scope.
