# Form Builder Product Completion Master Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing backend-agnostic React form builder from an MVP foundation into a credible production-grade form builder without breaking the contracts and packages already built.

**Architecture:** This plan continues after the completed MVP master plan at `docs/superpowers/plans/2026-05-14-form-builder-development-master-plan.md`. The existing canonical schema, core runtime, renderer, builder shell, JSON Schema compiler, adapters, themes, publish flow, and OpenSpec specs remain the baseline. New work must extend those contracts through OpenSpec changes before product behavior is implemented.

**Tech Stack:** TypeScript monorepo, pnpm, Vitest, React Testing Library, Playwright, dnd-kit, TanStack Query in React/adapters only, framework-agnostic `packages/core`, package-owned theme assets under `packages/themes`.

---

## Required Context

Before executing this plan, read these documents in this order:

1. `AGENTS.md`
2. `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`
3. `docs/architecture/2026-05-14-react-technical-architecture-decisions.md`
4. `docs/superpowers/plans/2026-05-14-form-builder-development-master-plan.md`
5. `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md`
6. Current OpenSpec specs under `openspec/specs/`

The research inventory is the source for competitor findings, complete component coverage, feature behavior, missing product gaps, and recommended OpenSpec changes. This plan is the phase-by-phase execution wrapper around that research; it does not replace the research detail.

## Planning Rules

- Do not replace the previous MVP plan. Treat phases 0-13 as completed foundation work.
- Do not weaken package boundaries from `AGENTS.md`.
- Do not put React, upload providers, payment providers, TanStack Query, CSS, or browser APIs into `packages/core`.
- Do not persist executable JavaScript or React components in schemas.
- Do not implement risky features before their contracts are specified.
- Every phase ends with tests, a written report under `docs/reports/`, and owner review before the next phase starts.
- Persian, RTL, and Iran-specific fields are part of this new completion plan, not a later afterthought.
- Existing examples and tests must keep passing unless a phase explicitly updates the expected behavior and documents the migration.

## Existing Baseline To Preserve

Already completed foundation:

- Package-first monorepo.
- Canonical schema contracts.
- Submitted path grammar and dangerous-key rejection.
- Core condition, validation, submission, backend response, migration, and diagnostics behavior.
- JSON Schema compiler package.
- React renderer foundation.
- React builder shell with palette, canvas, inspector, real-renderer preview, DnD, keyboard workflow, persistence state, publish checklist, and revision comparison.
- Theme/design-system readiness with CSS variables, RTL font token, focus styles, and package-level theme helpers.
- Developer onboarding and MVP release documentation.

## Asset Placement Decision

The IranYekan font files belong to the themes package, not the repository root:

```text
packages/themes/assets/fonts/iranyekan/
  IRANYekanXFaNum-Regular.woff2
  IRANYekanXFaNum-Bold.woff2
  IRANYekanXFaNum-Regular.woff
  IRANYekanXFaNum-Bold.woff
```

The font assets should be wired in a later Persian/RTL phase by adding optional `@font-face` CSS helpers in `packages/themes`, not by hard-coding the font into `packages/core`.

## Phase 14: Product Completion Specs And Documentation Alignment

**Purpose:** Convert the research inventory into approved OpenSpec changes before implementation begins.

**Primary files:**

- Read first: `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md`
- Modify: `openspec/specs/builder-ui-foundation/spec.md`
- Modify: `openspec/specs/react-renderer-foundation/spec.md`
- Modify: `openspec/specs/canonical-contracts/spec.md`
- Create: `openspec/changes/<dated-product-grade-field-inspector-model>/`
- Create: `docs/reports/<date>-phase-14-product-completion-specs.md`

**Tasks:**

- [ ] Create an OpenSpec change for the product-grade field and inspector model.
- [ ] Specify the expanded MVP hardening field catalog.
- [ ] Specify the structured option model with stable option values, labels, defaults, disabled options, scores, metadata, and migration warnings.
- [ ] Specify inspector tabs: Content, Choices, Validation, Logic, Appearance, Data, Accessibility, Advanced.
- [ ] Specify content/layout blocks: heading, paragraph, image, divider, section, page/step, welcome, ending.
- [ ] Specify builder icon-button and tooltip requirements.
- [ ] Specify which changes are safe, dangerous, or publish-blocking.
- [ ] Run `openspec validate --strict` for the new change.
- [ ] Write the phase report with exact spec changes and owner-review checklist.

**Tests and checks:**

- `openspec validate --strict`
- `git diff --check`

**Owner review output:**

- Owner confirms the specs are correct before implementation begins.

## Phase 15: Expanded Palette And Structured Options Editor

**Purpose:** Remove the clearest demo signals: the narrow palette and textarea-based `label=value` option editor.

**Primary files:**

- Modify: `packages/react-builder/src/ui.tsx`
- Modify: `packages/react-builder/src/commands/index.ts`
- Modify: `packages/react-builder/src/schema/index.ts`
- Modify: `packages/react-builder/src/index.test.ts`
- Modify: `packages/react-builder/src/ui.test.tsx`
- Modify: `packages/react-builder/tests/builder.spec.ts`
- Create or modify docs under `docs/integration/react-builder.md`
- Create: `docs/reports/<date>-phase-15-expanded-palette-options-editor.md`

**Tasks:**

- [ ] Add palette entries for all already-supported field types: URL, checkbox group, switch, time, rating, linear scale, hidden, read-only/display, and file metadata where supported.
- [ ] Replace raw options textarea with a structured options editor.
- [ ] Support add option, delete option, duplicate option, reorder option, edit label, edit stable value, set default, disable option, and bulk paste.
- [ ] Add warnings when option values change after a published revision exists.
- [ ] Keep labels translatable and values stable.
- [ ] Ensure renderer preview still uses `FormRenderer`.
- [ ] Add builder UI tests for option editing.
- [ ] Add command tests for stable option updates and dangerous value warnings.
- [ ] Add Playwright coverage for creating a dropdown with multiple options through the new UI.
- [ ] Write a phase report and screenshots.

**Tests and checks:**

- `pnpm --filter @your-org/forms-react-builder test`
- `pnpm --filter @your-org/forms-react-builder exec playwright test`
- `pnpm build`
- `git diff --check`

**Owner review output:**

- Owner checks that dropdown/radio/checkbox options feel like a real form builder, not a demo.

## Phase 16: Visual Validation And Logic Builder Foundation

**Purpose:** Replace raw condition JSON for common logic with a safe visual rule builder.

**Primary files:**

- Modify: `packages/react-builder/src/ui.tsx`
- Modify: `packages/react-builder/src/commands/index.ts`
- Modify: `packages/core/src/conditions/index.ts` only if the OpenSpec requires additive contract changes.
- Modify: `packages/core/src/validation/index.ts` only if required by the spec.
- Modify: tests in `packages/core/src/conditions/`, `packages/core/src/validation/`, and `packages/react-builder/src/`
- Create: `docs/reports/<date>-phase-16-visual-validation-logic-builder.md`

**Tasks:**

- [ ] Add visual validation controls for required, min/max length, min/max number, pattern, email, URL, min/max selected, and field-specific common rules.
- [ ] Add visual logic controls for show/hide and require/unrequire.
- [ ] Support AND/OR condition groups using the existing declarative condition model.
- [ ] Keep an advanced JSON/debug view read-only or clearly developer-only if needed.
- [ ] Add diagnostics for unsupported logic actions instead of silently saving them.
- [ ] Ensure hidden field value semantics are visible in the inspector.
- [ ] Add tests for visual rule creation and core runtime parity.
- [ ] Write a phase report with supported and unsupported logic actions.

**Tests and checks:**

- `pnpm --filter @your-org/forms-core test`
- `pnpm --filter @your-org/forms-react-builder test`
- `pnpm build`
- `git diff --check`

**Owner review output:**

- Owner checks that simple logic can be created without writing JSON.

## Phase 17: Persian, RTL, And Iran Localization Foundation

**Purpose:** Make Persian and RTL first-class in the builder and renderer.

**Primary files:**

- Modify: `packages/themes/src/index.ts`
- Use assets: `packages/themes/assets/fonts/iranyekan/`
- Modify: `packages/react-renderer/src/index.tsx`
- Modify: `packages/react-builder/src/ui.tsx`
- Modify: `packages/core/src/schema/index.ts` only for additive locale contract changes approved in OpenSpec.
- Modify or create validators in `packages/validators/src/`
- Create docs under `docs/integration/` or `docs/localization/`
- Create: `docs/reports/<date>-phase-17-persian-rtl-iran-localization.md`

**Tasks:**

- [ ] Specify and implement Persian builder/runtime string dictionaries.
- [ ] Add optional IranYekan `@font-face` theme helper from `packages/themes/assets/fonts/iranyekan/`.
- [ ] Use `fontRtl` and direction-aware CSS without forcing every host app to use IranYekan.
- [ ] Verify builder and renderer `dir="rtl"` layout, focus order, icon direction, and technical LTR values.
- [ ] Add Persian/Arabic digit normalization utility for numeric validation where enabled.
- [ ] Add Iran mobile, national ID, and postal code validators by registered validator keys.
- [ ] Specify Iran province/city as either a preset composed field or an adapter-backed option source before implementing a hard-coded field.
- [ ] Add RTL/Persian screenshots in the phase report.

**Tests and checks:**

- `pnpm --filter @your-org/forms-themes test`
- `pnpm --filter @your-org/forms-renderer test`
- `pnpm --filter @your-org/forms-react-builder test`
- Playwright RTL builder and renderer screenshots.
- `pnpm build`
- `git diff --check`

**Owner review output:**

- Owner checks Persian text, RTL layout, Persian-number behavior, and font rendering.

## Phase 18: Content, Layout, And Real-Form Authoring Blocks

**Purpose:** Allow admins to build real forms with structure and explanatory content, not only input lists.

**Primary files:**

- Modify: `packages/core/src/schema/index.ts`
- Modify: `packages/react-renderer/src/index.tsx`
- Modify: `packages/react-builder/src/ui.tsx`
- Modify tests across core, renderer, and builder.
- Create: `docs/reports/<date>-phase-18-content-layout-blocks.md`

**Tasks:**

- [ ] Add heading and paragraph/text blocks.
- [ ] Add divider and spacer blocks.
- [ ] Add image block with alt text.
- [ ] Add section block and page/step block authoring UI.
- [ ] Add welcome screen and ending/thank-you screen.
- [ ] Add renderer behavior for content blocks and steps.
- [ ] Add builder canvas behavior for content blocks.
- [ ] Add accessibility validation for missing image alt text and missing accessible names.
- [ ] Add tests and screenshots.

**Tests and checks:**

- `pnpm --filter @your-org/forms-core test`
- `pnpm --filter @your-org/forms-react-renderer test`
- `pnpm --filter @your-org/forms-react-builder test`
- Playwright builder flow for a realistic multi-section form.
- `pnpm build`
- `git diff --check`

**Owner review output:**

- Owner checks that the builder can create a real structured form with content and ending screens.

## Phase 19: Production Templates And Examples

**Purpose:** Replace demo-looking examples with realistic product examples, including Persian/Iran examples.

**Primary files:**

- Modify: `examples/vite-react/src/`
- Modify or create example schemas under package fixtures if appropriate.
- Modify docs under `docs/integration/`
- Create: `docs/reports/<date>-phase-19-production-templates-examples.md`

**Tasks:**

- [ ] Add realistic English contact/intake form example.
- [ ] Add Persian RTL customer intake form example.
- [ ] Add Iran province/city example once its contract is approved.
- [ ] Add dropdown/radio/checkbox examples using structured options.
- [ ] Add visual logic example.
- [ ] Add renderer-only embed example.
- [ ] Add builder-to-renderer preview parity checks.
- [ ] Add screenshots and owner-check instructions.

**Tests and checks:**

- `pnpm --filter examples-vite-react test` if available.
- `pnpm --filter @your-org/forms-react-builder exec playwright test`
- `pnpm build`
- `git diff --check`

**Owner review output:**

- Owner checks the app output and confirms it no longer feels like a demo.

## Phase 20: Advanced Contract Specifications

**Purpose:** Prepare risky commercial features without rushing unsafe implementation.

**Primary files:**

- Create OpenSpec changes for calculations, uploads, repeaters, dynamic options, submissions, and payments.
- Modify docs under `docs/schema/`, `docs/integration/`, and `docs/security/`.
- Create: `docs/reports/<date>-phase-20-advanced-contract-specifications.md`

**Tasks:**

- [ ] Specify calculation/scoring expression language, type system, dependency tracking, cycle detection, backend parity, and rounding.
- [ ] Specify upload lifecycle: prepare, upload, finalize, trusted metadata, virus scan state, and error recovery.
- [ ] Specify repeater/subform path grammar, validation, focus, migration, and JSON Schema generation.
- [ ] Specify dynamic option source adapter contract with loading, error, cache, invalidation, and submission safety.
- [ ] Specify partial submissions and save/continue idempotency.
- [ ] Specify payment plugin boundary and never-store-card-data rule.
- [ ] Validate all OpenSpec changes.
- [ ] Write the phase report and recommended implementation order.

**Tests and checks:**

- `openspec validate --strict`
- `git diff --check`

**Owner review output:**

- Owner chooses which advanced feature enters implementation first.

## Phase 21+: Advanced Feature Implementation Waves

Each advanced feature must get its own phase after Phase 20 approval:

- Calculations and scoring.
- File/image upload orchestration.
- Dynamic options and data lookup.
- Repeaters/subforms/table rows.
- Partial submissions and save/continue later.
- Signature.
- Payments/products/coupons.
- Analytics/drop-off.
- Conversational one-question-at-a-time mode.
- Collaboration, permissions, audit logs, and enterprise controls.

Each implementation wave must include:

- OpenSpec change.
- Focused implementation.
- Unit tests.
- React tests.
- Playwright flow.
- Accessibility checks.
- Migration/diff documentation.
- Phase report.
- Owner checkout before continuing.

## Safety Checklist For Every Phase

- [ ] Existing tests pass before starting or known failures are documented.
- [ ] New behavior is specified before implementation.
- [ ] `packages/core` stays React-free and provider-free.
- [ ] Builder preview continues to use the real renderer.
- [ ] Persisted data remains JSON-serializable.
- [ ] Unknown custom behavior fails closed.
- [ ] Published revision immutability is preserved.
- [ ] Dangerous schema/submission changes produce warnings or publish blockers.
- [ ] RTL and LTR are checked when UI changes are visible.
- [ ] Phase report is written before asking owner to approve the next phase.
