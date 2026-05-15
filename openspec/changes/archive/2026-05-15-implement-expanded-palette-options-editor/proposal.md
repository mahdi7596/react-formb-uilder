## Why

Phase 14 specified the product-grade field and inspector model. The clearest demo-feeling issues in the current builder are now ready to fix: the palette exposes only a small subset of already-supported fields, and dropdown/radio options are edited through raw `label=value` textarea lines.

Phase 15 makes the builder feel like a real form authoring product by expanding the palette and replacing raw option editing with a structured, command-backed options editor.

## What Changes

- Expand the React builder palette to expose supported MVP-hardening field types that are already recognized by core/renderer contracts: URL, checkbox group, switch, time, rating, linear scale, hidden field, read-only/display value, and file metadata where support exists.
- Add minimal real-renderer parity for newly exposed basic fields so the builder preview remains the real respondent runtime rather than a duplicated mock.
- Replace textarea-based choice editing with a structured options editor for select, radio, and checkbox group fields.
- Add option row controls for add, duplicate, delete, reorder, label editing, stable submitted value editing, default state, disabled state, and bulk paste.
- Keep option labels separate from stable submitted values.
- Preserve command-backed schema mutation, undo/redo participation, diagnostics, and real-renderer preview.
- Surface existing dangerous option diagnostics when option submitted values change.
- Update builder tests, Playwright coverage, integration docs, and Phase 15 report.

No advanced fields are implemented in this phase. Payments, repeaters, visual logic builder, Persian UI, content/layout blocks, dynamic options, calculations, and upload orchestration remain later phases.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `builder-ui-foundation`: Implements product-grade expanded palette behavior and structured option editing for choice-like MVP fields.
- `product-grade-field-inspector-model`: Implements the first MVP-hardening slice of the product-grade field catalog and structured option model.
- `react-renderer-foundation`: Adds minimal runtime rendering parity for newly exposed basic fields used by the expanded palette.

## Impact

- Affected packages: `packages/react-builder` and `packages/react-renderer`.
- Affected docs: `docs/integration/react-builder.md` and `docs/reports/2026-05-15-phase-15-expanded-palette-options-editor.md`.
- Affected tests: builder unit/component tests and Playwright builder flow.
- Package boundaries: `packages/core` remains React-free and unchanged unless tests reveal a strictly necessary additive type or diagnostic adjustment.
- Runtime dependencies: no new heavy UI framework or backend-specific dependency should be introduced.
