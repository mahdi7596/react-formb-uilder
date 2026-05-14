---
version: alpha
name: "Backend-Agnostic React Form Builder"
description: "Provisional AI-readable design system for a package-first form builder, renderer, and builder UI."
meta:
  status: provisional
  owners: ["Design", "Engineering"]
  lastReviewed: "2026-05-14"
  sources:
    brand: "provisional"
    accessibilityTarget: "WCAG 2.2 AA"
    architecture: "docs/architecture/2026-05-14-react-form-builder-architecture-design.md"
colors:
  primary: "#315CFF"
  on-primary: "#FFFFFF"
  primary-container: "#E8EDFF"
  on-primary-container: "#12205C"
  secondary: "#42526B"
  on-secondary: "#FFFFFF"
  accent: "#087568"
  on-accent: "#FFFFFF"
  surface: "#FFFFFF"
  surface-muted: "#F6F7FB"
  surface-raised: "#FFFFFF"
  surface-inverse: "#151923"
  on-surface: "#172033"
  on-surface-muted: "#667085"
  on-surface-inverse: "#FFFFFF"
  border: "#DDE3EE"
  border-strong: "#AEB8C8"
  outline-focus: "#315CFF"
  success: "#147A4D"
  on-success: "#FFFFFF"
  warning: "#9A6500"
  on-warning: "#FFFFFF"
  danger: "#B42318"
  on-danger: "#FFFFFF"
  info: "#155EEF"
  on-info: "#FFFFFF"
  chart-1: "#315CFF"
  chart-2: "#087568"
  chart-3: "#B42318"
  chart-4: "#6D3EF2"
  chart-5: "#8A5A00"
typography:
  font-sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  font-rtl: "Vazirmatn, Noto Sans Arabic, Tahoma, system-ui, sans-serif"
  font-mono: "'Roboto Mono', 'SFMono-Regular', Consolas, monospace"
  h1: { fontFamily: "{typography.font-sans}", fontSize: "32px", fontWeight: 700, lineHeight: "40px", letterSpacing: "0px" }
  h2: { fontFamily: "{typography.font-sans}", fontSize: "24px", fontWeight: 700, lineHeight: "32px", letterSpacing: "0px" }
  h3: { fontFamily: "{typography.font-sans}", fontSize: "20px", fontWeight: 650, lineHeight: "28px", letterSpacing: "0px" }
  body-md: { fontFamily: "{typography.font-sans}", fontSize: "16px", fontWeight: 400, lineHeight: "24px", letterSpacing: "0px" }
  body-sm: { fontFamily: "{typography.font-sans}", fontSize: "14px", fontWeight: 400, lineHeight: "20px", letterSpacing: "0px" }
  label-md: { fontFamily: "{typography.font-sans}", fontSize: "14px", fontWeight: 600, lineHeight: "20px", letterSpacing: "0px" }
  label-sm: { fontFamily: "{typography.font-sans}", fontSize: "12px", fontWeight: 600, lineHeight: "16px", letterSpacing: "0px" }
spacing:
  0: "0"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  field-gap: "6px"
  inline-gap: "8px"
  panel-padding: "16px"
  canvas-gap: "12px"
  section-gap: "24px"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-muted:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0"
    height: "36px"
    width: "36px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    height: "38px"
  badge:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "24px"
  panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "16px"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  inverse-panel:
    backgroundColor: "{colors.surface-inverse}"
    textColor: "{colors.on-surface-inverse}"
    rounded: "{rounded.md}"
    padding: "16px"
  tab-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "40px"
  empty-state:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "24px"
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    height: "1px"
  divider-strong:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    height: "1px"
  focus-indicator:
    backgroundColor: "{colors.outline-focus}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    height: "3px"
  alert-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  alert-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-warning}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  alert-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  alert-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.on-info}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  chart-swatch-1:
    backgroundColor: "{colors.chart-1}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    size: "16px"
  chart-swatch-2:
    backgroundColor: "{colors.chart-2}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.sm}"
    size: "16px"
  chart-swatch-3:
    backgroundColor: "{colors.chart-3}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.sm}"
    size: "16px"
  chart-swatch-4:
    backgroundColor: "{colors.chart-4}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    size: "16px"
  chart-swatch-5:
    backgroundColor: "{colors.chart-5}"
    textColor: "{colors.on-warning}"
    rounded: "{rounded.sm}"
    size: "16px"
---

## Overview

This file is the design source of truth for the form builder project. It is provisional until a brand direction is selected, but future UI work should still reuse these tokens and rules instead of inventing one-off colors, radii, shadows, or type sizes.

The product should feel like a serious creation tool: quiet, precise, fast to scan, and useful for repeated editing. It should borrow the calm block-editing feel of Tally and Notion, the practical discoverability of Jotform and Fillout, and the canvas/panel confidence of Webflow or Framer without copying their brands.

The default UI is an embedded app workspace, not a marketing site. The primary design direction is RTL-first for Persian and Arabic admin experiences. The key surfaces are a top command bar, right-side component palette, central form canvas, left-side inspector, preview mode that uses the real renderer, logic and publish diagnostics, and future results surfaces.

## Colors

The current token set uses **Option A: Electric Trust**, a provisional blue primary with teal accent. It is recommended as the starting default because it reads as technical, trustworthy, and broadly compatible with host SaaS/admin products.

Color options for final selection:

| Option | Primary | Accent | Character | Best fit |
| --- | --- | --- | --- | --- |
| A. Electric Trust | `#315CFF` | `#087568` | Crisp, technical, confident | Default package UI, developer tools, admin embedding |
| B. Graphite Mint | `#263238` | `#00A884` | Neutral, mature, low-noise | Enterprise builders, dense workflows, long sessions |
| C. Signal Violet | `#6D3EF2` | `#E25555` | Creative, energetic, product-led | More expressive builder UI and branded template browsing |

Use semantic colors only. Every filled color needs its paired `on-*` foreground. Do not rely on color alone for states; pair color with text, icons, borders, or position.

Primary is for selected state, publish actions, active tabs, focus indicators, and the most important command. Accent is for positive creation feedback, add-new affordances, and selected secondary tools. Danger is reserved for destructive actions and publish-blocking errors.

## Typography

Use the sans stack for Latin UI and the RTL stack for Persian or Arabic contexts. Body text defaults to `16px/24px` in documents and respondent forms, while dense builder controls use `14px/20px`.

App headings must stay restrained: workspace H1 maxes at `32px`, panel headings at `20px`, section headings at `14px` or `16px`. Do not use display typography inside sidebars, cards, inspectors, dialogs, or tables. Letter spacing is `0px`; never use negative letter spacing for RTL scripts.

## Layout

The builder shell uses a four-zone RTL-first layout:

- Top command bar: form title, saved state, undo/redo, preview toggle, share/publish commands.
- Right palette: searchable grouped components with icons, click-add, and drag affordance.
- Center canvas: the form structure, selected node chrome, insertion targets, empty states, and preview frame.
- Left inspector: contextual tabs for content, validation, logic, accessibility, and data contract settings.

Recommended desktop widths: right palette `280px`, left inspector `340px`, top bar `56px`, canvas max content width `760px`. The canvas region owns scrolling; palette and inspector may scroll independently. Avoid nested cards; use panels, dividers, rows, and individual field blocks.

## Elevation & Depth

Use depth sparingly. Default panels are flat with borders. Field blocks may use a very subtle shadow only when selected, dragged, or floating as a drag overlay. Dialogs and popovers can use stronger elevation, but the main builder should remain calm and grounded.

Recommended shadow levels:

- Level 0: no shadow, border only.
- Level 1: selected field or hover lift, `0 1px 2px rgba(15, 23, 42, 0.08)`.
- Level 2: menus/dialogs, `0 12px 32px rgba(15, 23, 42, 0.14)`.

## Shapes

Use `8px` radius for buttons, inputs, field blocks, and repeated component cards. Use `4px` for small controls, focus details, and code/data pills. Use pill radius only for compact badges, chips, and status labels.

Do not make the whole interface round and soft. This product should feel precise.

## Components

Core primitives: buttons, icon buttons, inputs, textareas, selects, checkboxes, radios, switches, segmented controls, tabs, tooltips, menus, dialogs, drawers, alerts, badges, toasts, skeletons, empty states, loading states, error states, and focus indicators.

Builder components: app shell, command bar, component palette, palette item, category group, canvas, canvas node, drop zone, drag overlay, selection outline, field quick actions, structure tree, inspector, inspector row, inspector section, logic rule editor, publish checklist, revision warning, preview frame, and diagnostics panel.

Renderer components: field chrome, label, description, validation message, step progress, step navigation, text input, textarea, number, email, phone, URL, date, time, radio group, checkbox group, dropdown, rating, linear scale, hidden field indicator for builders, section, page, welcome screen, and ending screen.

State coverage is mandatory for default, hover, focus-visible, active, selected, dragging, drag-over, invalid-drop, disabled, read-only, loading, error, warning, success, dirty/unsaved, and published/locked states.

## Do's and Don'ts

Do use the real renderer inside builder preview. Do keep schema edits behind commands and avoid placing domain invariants in React components. Do show submitted path/name changes as contract-affecting edits. Do make drag targets generous and selected state unmistakable.

Do not duplicate field rendering between builder preview and public renderer. Do not store executable JavaScript or React components in persisted schemas. Do not introduce a heavyweight UI framework by default. Do not use decorative blobs, glass effects, arbitrary gradients, oversized dashboard headings, or cards inside cards.

## Motion

Motion should clarify state changes: drag lift, insertion marker, save status, preview transitions, and validation feedback. Use fast transitions around `120ms` to `180ms`. Respect `prefers-reduced-motion` by removing transforms and nonessential animation.

## Accessibility

Target WCAG 2.2 AA. All interactive controls need visible focus states, accessible names, and keyboard paths. Drag-and-drop must have click-add and keyboard alternatives. Labels cannot be replaced by placeholders. Error messaging must be programmatically associated with fields.

The builder must support keyboard selection, duplicate, delete, move, undo, redo, inspector focus, and publish diagnostics. Color must not be the only way to distinguish required, invalid, selected, disabled, or hidden states.

## Responsive Behavior

Desktop is the primary builder experience. At tablet widths, collapse the inspector into a drawer and keep the palette available as a command/search panel. At mobile widths, favor preview, quick-edit, and field ordering flows over dense three-panel editing.

Text must wrap or truncate intentionally with tooltips where needed. Buttons and badges must not clip long labels. Use logical CSS properties so RTL and LTR layouts can mirror without duplicating styles.

## Localization

The system must support English, Persian, Arabic, and other locales. The default builder simulation is RTL. RTL layouts should mirror navigation, panel placement, directional icons, insertion markers, quick actions, and step progress. Do not mirror neutral icons such as search, settings, or plus.

Use locale-aware date, number, and validation message formatting in implementation. Keep all persisted schema data language-agnostic where possible and localize display text through schema/localization contracts.

Submitted paths, schema ids, revision ids, email addresses, URLs, code snippets, and JSON diagnostics must render LTR inside RTL screens with explicit `dir="ltr"` or equivalent styling.

## Governance for AI Agents

Before generating or changing UI, read `AGENTS.md`, this `DESIGN.md`, and the relevant architecture or OpenSpec files. Reuse existing tokens, primitives, and component roles. If a required token or component rule is missing, propose an addition to this file instead of inventing a local style.

When implementing the React app later, keep `packages/core` free of styling and UI dependencies. Put reusable UI tokens/classes in theme or React package layers only. Verify significant rendered changes with desktop and narrow viewport screenshots, focus states, and reduced-motion behavior when applicable.
