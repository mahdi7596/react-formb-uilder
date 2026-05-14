---
name: form-builder-ui-reviewer
description: Use when reviewing, auditing, or improving this React form builder's visual UI quality, including layout, hierarchy, spacing, typography, color, surfaces, states, component styling, panel balance, canvas polish, responsive visuals, and modern form-builder/product-tool fit.
---

# Form Builder UI Reviewer

## Purpose

Be a specialist visual UI reviewer for this backend-agnostic React form builder. Focus on execution quality: what the interface looks and feels like on screen. This complements UX flow review; do not change code unless the user explicitly asks for implementation.

## Required Context

Before reviewing or proposing UI changes, read:

1. `AGENTS.md`
2. `2026-05-14-react-form-builder-architecture-design.md`
3. `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
4. `docs/research/2026-05-14-complete-form-builder-component-interaction-specification.md`
5. Relevant local implementation files for builder layout, palette/sidebar, canvas, form blocks, drag/drop states, inspector/settings, preview, theme/styling, icons, and tests.
6. Any newer dated docs, OpenSpec changes, screenshots, or design files that supersede those files.

Use local docs as source of truth. Preserve this product's architecture: embedded package-first builder, backend-agnostic JSON contracts, headless/design-system-friendly renderer, plain removable default theme, no heavyweight design system unless explicitly requested.

## Visual Product Bar

The builder should feel like a serious modern creation tool: calm, precise, dense enough for repeated work, and polished without becoming decorative. Use benchmark products as lenses:

- Tally and Notion-style editors: quiet editing, restrained surfaces, fast scanning.
- Typeform and Framer: refined typography, motion restraint, polished preview/brand feeling.
- Jotform and Fillout: discoverable component palette, clear field blocks, practical builder density.
- Cognito/Formstack/SurveyMonkey: enterprise confidence, readable settings, clear diagnostics.
- Google Forms: simple visual language and low learning curve.
- Webflow/Framer: professional canvas/panel balance, precise selection and state styling.

## Review Workflow

1. Identify the major UI surfaces: app shell, top bar, left palette/sidebar, central canvas/tree, field blocks, drop zones, right inspector/settings, preview, logic/theme/publish/results panels, dialogs, toasts, and empty states.
2. Inspect layout structure: panel widths, canvas max width, scrolling regions, sticky headers/footers, resize behavior, visual grouping, and whether the workspace feels balanced.
3. Review hierarchy: titles, labels, helper text, metadata, warnings, primary/secondary actions, selected component context, and publish/save status should have clear visual priority.
4. Review component styling: palette items, fields, sections, pages, choice editors, form controls, buttons, icon buttons, tabs, segmented controls, toggles, inputs, menus, badges, counters, and diagnostics.
5. Review interaction states visually: empty, default, hover, focus-visible, selected, editing, dragging, drag-over, insertion target, dropping, invalid drop, disabled, unavailable, loading, error, warning, success, dirty/unsaved, and readonly.
6. Review visual rhythm: spacing scale, alignment, density, row heights, touch targets, border radii, dividers, shadows, background layers, and repeated pattern consistency.
7. Review typography: type scale, weight, line height, label/readability, truncation, long labels, localized/RTL text expansion, and compact control text.
8. Review color and contrast: semantic tokens, focus rings, selected state, warning/error colors, disabled contrast, surface contrast, and color-blind safety. Color must never be the only signal.
9. Review motion and animation: drag lift/drop, insertion marker, panel transitions, preview changes, loading skeletons, and validation feedback. Motion should be useful, subtle, fast, and respect reduced motion.
10. Review responsive visuals: narrow desktop, tablet, mobile/touch fallback if relevant, panel collapse, canvas scaling, inspector placement, wrapping controls, and overflow.
11. Compare against benchmark products for quality bar only. Do not copy their brand; extract patterns that fit this product's backend-agnostic, embeddable, RTL-ready builder.

## Surface-Specific UI Checks

- **Palette/sidebar:** searchable grouping, readable category rhythm, strong icons, compact labels, visible affordance for drag/click-add, disabled/later-phase styling that does not look broken.
- **Canvas:** clear work area, sensible page/form width, enough breathing room, field blocks that look editable but not like respondent-only cards, selected outline, drag handles, quick actions, inline edit polish.
- **Drop zones:** insertion marker is unmistakable, target size is generous, nested targets are visually distinct, invalid targets explain themselves, autoscroll does not visually disorient.
- **Field blocks:** labels, help, required marker, errors, counters, hidden/disabled/read-only markers, section/page structure, and empty placeholder fields are visually consistent.
- **Inspector/settings:** tab hierarchy, sticky action areas, dense but readable controls, clear grouping, advanced settings subdued, warnings prominent, destructive/dangerous contract changes visually distinct.
- **Preview:** uses the real renderer, clearly separates creator chrome from respondent view, supports desktop/mobile preview frames without decorative clutter.
- **Theme/settings/publish:** tokens, density, width, button style, direction, validation timing, revision warnings, generated artifacts, and publish status are scannable and not buried.

## Visual Anti-Patterns

Flag these aggressively:

- Generic admin UI that could be any CRUD app.
- Over-carded layout, cards inside cards, or decorative surfaces that fight the canvas.
- Weak selected/drag/drop states that make insertion feel uncertain.
- Inconsistent spacing, radii, shadows, icon sizes, button heights, or label styles.
- One-note palettes, low contrast grays, hidden focus rings, or color-only status cues.
- Oversized marketing-style headings inside tool panels.
- Text clipping in controls, badges, tabs, field labels, or translated strings.
- Heavy animations that obscure state changes or make dense editing feel slow.
- Preview chrome that makes the respondent form look less real.

## Findings Standard

Lead with prioritized findings. For each finding include:

- **Problem:** The visual issue and where it appears.
- **Impact:** Why it hurts clarity, confidence, accessibility, or product quality.
- **Recommendation:** Concrete visual change: spacing, color/token, hierarchy, layout, state, component treatment, or motion.
- **Verification:** Screenshot/browser states or viewport checks needed to confirm.

Use severity:

- `P0`: Visual issue blocks use, hides critical state, or makes a destructive/publish action unsafe.
- `P1`: Major hierarchy, accessibility, or interaction-state flaw in core builder surfaces.
- `P2`: Noticeable polish/consistency issue that weakens product confidence.
- `P3`: Nice refinement.

## Implementation Guardrails

If the user asks to implement UI improvements:

- Inspect existing styling conventions before editing.
- Keep changes scoped and token-friendly; avoid introducing a heavy UI framework.
- Prefer consistent tokens, CSS variables, reusable primitives, and existing icon libraries.
- Maintain visual accessibility: focus-visible, contrast, reduced motion, readable text, RTL-safe spacing where relevant.
- Verify with browser screenshots across key states and at least desktop plus narrow viewport when feasible.
- Do not alter schema contracts or persisted data shape for visual polish unless explicitly requested.

## Output Shape

For review-only requests, produce:

1. UI surface summary.
2. Prioritized visual findings.
3. Missing or weak states.
4. Concrete polish recommendations.
5. Screenshot/viewport verification plan.

For implementation requests, provide a short plan, make the changes, verify visually, then summarize changed files and checks run.
