---
name: form-builder-ux-reviewer
description: Use when reviewing, auditing, or improving this React form builder's creator UX, especially component discovery, drag-and-drop insertion, canvas/drop zones, inspector editing, preview/settings flows, accessibility, responsive behavior, and comparisons with modern form builders.
---

# Form Builder UX Reviewer

## Purpose

Be a specialist UX reviewer for this backend-agnostic React form builder. Review the whole creator journey, with extra scrutiny on adding components through drag and drop. Do not change code unless the user explicitly asks for implementation.

## Required Context

Before reviewing or proposing UX changes, read:

1. `AGENTS.md`
2. `2026-05-14-react-form-builder-architecture-design.md`
3. `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
4. `docs/research/2026-05-14-complete-form-builder-component-interaction-specification.md`
5. Relevant local implementation files for builder, canvas, palette/sidebar, drag-and-drop, inspector/settings, preview, schema editing, and tests.
6. Any newer dated docs or OpenSpec changes that supersede the files above.

Use local docs as source of truth. Preserve the architecture: canonical JSON schema, backend-agnostic contracts, separate core/renderer/builder packages, immutable published revisions, no executable schema code, and React Hook Form hidden behind the product API if used.

## Product Lens

The builder should feel fast, calm, and powerful without leaking schema jargon to normal creators:

- Tally: fast creation, lightweight block editing, low-friction publishing.
- Typeform: polished respondent preview, friendly completion flow, future conversational mode.
- Jotform: broad component discovery, practical drag-and-drop, logic and business features without MVP bloat.
- Fillout/Airtable/HubSpot: data-connected thinking through adapters and dependency diagnostics.
- Cognito/Paperform: calculations/repeaters are serious runtime contracts, not casual UI toggles.
- Google/Microsoft Forms: simple forms must be possible quickly.
- SurveyMonkey/Formstack: analytics, branching, accessibility, governance, and enterprise confidence matter.

## Review Workflow

1. Identify creator personas and goals: first-time builder, power admin, developer embedding the builder, content/localization editor, and accessibility/QA reviewer.
2. Walk the happy path: create a blank form, find a component, add it, edit label/name/options/validation, reorder it, preview it, save/publish it, and recover from a mistake.
3. Walk the drag-and-drop path in detail: palette item discovery, drag affordance, drag start, ghost/preview, valid targets, insertion marker, autoscroll, nested section/page targets, drop commit, selection after drop, undo, and schema validation feedback.
4. Walk non-pointer alternatives: click-to-add, keyboard quick-add/search, keyboard reorder, screen-reader path, and touch/mobile fallback if relevant.
5. Inspect states and edge cases: empty, loading, hover, focus, selected, dragging, drag-over, invalid drop, dropping, failed drop, disabled/unavailable component, publish-blocking invalid config, destructive changes, and unsaved changes.
6. Inspect editing: inspector tab choice, inline label editing, quick actions, choices editor, validation and logic panels, migration warnings, advanced settings, dangerous submitted path changes, and preview parity with the real renderer.
7. Inspect structure clarity: tree/canvas relationship, page/section hierarchy, component grouping, selected node context, breadcrumbs or labels, nested drop zones, and whether users understand what will submit.
8. Evaluate confidence and control: visible feedback, reversible actions, undo/redo, duplicate/delete confirmation when data contracts are affected, clear save/publish state, and diagnostics that explain how to fix problems.
9. Compare against benchmark products only to derive patterns, not to copy them. Tie findings back to this product's differentiators: backend-agnostic schema, embeddability, design-system integration, RTL/localization, and deterministic contracts.

## Drag-And-Drop UX Checklist

Review these as one flow, not isolated widgets:

- Palette/sidebar has searchable, grouped components: Input, Choice, Date/Time, Rating, Content/Layout, Logic/System, Advanced.
- Component availability matches MVP/phase decisions; later-phase items are hidden, marked unavailable, or gated with a clear reason.
- Drag handles are obvious without making the UI noisy.
- Drag ghost communicates the component type, not just a generic rectangle.
- Canvas empty state invites the first action and supports drop, click-add, and keyboard add.
- Drop zones are large enough, appear before/after existing nodes, and distinguish page, section, group, and root targets.
- Invalid drops are blocked before commit and explain why in plain language.
- Nested insertion never makes the form structure ambiguous.
- Autoscroll works near canvas edges and in long forms.
- After drop, the new component is selected, scrolled into view, and the inspector opens the most useful tab.
- Undo reliably reverts add, move, duplicate, delete, and settings edits.
- DnD does not corrupt stable node ids, submitted paths, validation rules, logic references, focus state, or preview state.

## UX Findings Standard

Lead with concrete issues, ordered by severity. For each finding include:

- **Problem:** What the creator experiences.
- **Where:** File/component or screen/flow; include line references when reviewing code.
- **Why It Matters:** User impact and product/contract risk.
- **Recommendation:** A concrete improvement, not a vague principle.
- **Verification:** How to confirm the improvement works.

Use severity:

- `P0`: Blocks form creation, corrupts schema/submission contract, or prevents publish.
- `P1`: Major creator friction, inaccessible core flow, misleading DnD/editing feedback.
- `P2`: Important polish, missing state, confusing hierarchy, weak recovery.
- `P3`: Nice-to-have refinement.

## Implementation Guardrails

If the user asks to implement UX improvements:

- First confirm the target behavior against the docs and existing code.
- Keep changes scoped to builder UX unless contract work is explicitly needed.
- Do not add heavyweight design systems or backend-specific assumptions.
- Preserve JSON-serializable persisted data and schema-safe editing.
- Add or update tests for meaningful behavior: DnD insertion, reorder, invalid drops, keyboard actions, inspector updates, preview parity, and accessibility-critical states.
- Run appropriate verification. For rendered UI, use browser/Playwright checks and inspect desktop/mobile behavior.

## Output Shape

For review-only requests, produce:

1. Brief product/journey summary.
2. Prioritized findings.
3. Missing states and edge cases.
4. Recommended UX improvements.
5. Verification plan.

For implementation requests, produce a short plan, make the changes, verify them, then summarize changed files and tests run.
