## Context

The builder currently has a functional shell, command-backed schema editing, real renderer preview, drag-and-drop, keyboard movement, persistence states, and publish warnings. The current palette and options inspector are intentionally MVP-level. The palette only exposes a few fields, and choice options are edited as raw text.

Core and renderer already recognize more field types than the builder exposes, including URL, checkbox group, switch, time, rating, linear scale, and file metadata. The product-grade specs now require the builder to expose supported MVP-hardening fields and provide a structured option editor.

## Goals / Non-Goals

**Goals:**

- Add missing builder palette entries for supported MVP-hardening fields.
- Add minimal renderer parity for newly exposed basic fields so preview remains real renderer output.
- Replace raw option textarea editing for select, radio, and checkbox group with a structured option editor.
- Support add, duplicate, delete, move up/down, label, value, default, disabled, and bulk paste interactions.
- Keep all schema mutations routed through existing builder commands.
- Preserve undo/redo, diagnostics, and preview parity.
- Add focused tests and documentation.

**Non-Goals:**

- Visual logic builder. Phase 16 owns that.
- Persian/RTL text implementation. Phase 17 owns that.
- Content/layout blocks. Phase 18 owns that.
- Payments, repeaters, calculations, uploads orchestration, dynamic options, or enterprise features.
- A full UI component refactor.

## Decisions

### Reuse the existing `BuilderOption` shape and extend it conservatively

`BuilderOption` already has `id`, `label`, `value`, and `disabled`. Phase 15 should add UI around that shape and only add small optional properties if needed, such as a default marker represented in node props/settings if the existing schema supports it. Scoring and media metadata are reserved for later phases.

Alternatives considered:

- Introduce a fully new option model immediately: too much risk for Phase 15.
- Keep raw text as the only editing mode: fails the product requirement and owner feedback.

### Build the options editor inside the existing inspector first

The fastest credible improvement is replacing the textarea inside the current inspector flow. A larger inspector-tab redesign can come later, but the editor should already use product-grade controls and accessible labels.

Alternatives considered:

- Full inspector architecture rewrite: too much scope for Phase 15.
- Modal-only option editor: heavier and less direct for common editing.

### Use command-backed whole-array updates

The existing `updateOptions` command accepts the full options array and already emits dangerous option value diagnostics. The UI can compose row-level actions into full-array updates without creating new mutation paths.

Alternatives considered:

- Add many granular commands first: cleaner long-term but not necessary for this phase.
- Mutate node options directly in React state: violates builder command boundaries.

### Represent default choice through existing field `defaultValue` when possible

Default option behavior should use the field's submitted option value, not an option label. If a field does not yet have a first-class default-value command, Phase 15 can add a small command-backed property update for `defaultValue`.

Alternatives considered:

- Store `default` on option rows only: useful for UI but can become ambiguous for multi-choice fields.
- Defer default entirely: misses the product-grade option editor requirement.

## Risks / Trade-offs

- [Risk] Some palette entries may render as unsupported if renderer support is incomplete. -> Mitigation: only expose fields with existing core/renderer support or mark file metadata carefully.
- [Risk] Option default handling can conflict between single and multiple choice fields. -> Mitigation: implement single-choice defaults first and keep multi-choice default behavior explicit and tested.
- [Risk] Bulk paste can create duplicate values. -> Mitigation: slug values and make duplicates unique.
- [Risk] UI complexity in `ui.tsx` grows. -> Mitigation: keep helpers small and local for this phase; refactor in a later inspector architecture phase if needed.
