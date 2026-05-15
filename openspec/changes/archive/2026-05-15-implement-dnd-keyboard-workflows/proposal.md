## Why

Phase 8 made the builder usable through click-add, quick actions, inspector editing, and real renderer preview. The next missing creator workflow is direct manipulation: creators expect to drag fields from the palette, reorder fields on the canvas, and complete the same actions from the keyboard with clear accessible feedback.

This change adds accessible drag-and-drop and keyboard builder workflows while preserving the existing rule that schema mutations must go through builder commands, not UI event handlers.

## What Changes

- Add a builder drag-and-drop layer in `packages/react-builder` using `dnd-kit`.
- Support palette-to-canvas insertion by pointer drag.
- Support canvas reordering by pointer drag.
- Add drag overlay, drop-zone indicators, selected/dragging/dropping/invalid-drop states, and recoverable invalid-drop feedback.
- Add keyboard insertion and keyboard movement alternatives for creators who do not use pointer drag.
- Add accessible drag announcements for start, movement, invalid targets, and completed drops.
- Ensure every successful drop executes existing builder command/store paths such as add, move, select, undo, and redo.
- Add React component tests and Playwright coverage for pointer drag, keyboard insertion/movement, invalid-drop feedback, and undo/redo after drag.
- Use Browser-plugin inspection and `form-builder-ui-reviewer`/`form-builder-ux-reviewer` review before owner approval.
- Keep the existing dirty Phase 6 example work out of this phase unless the owner explicitly changes scope.

## Capabilities

### New Capabilities

- `builder-dnd-keyboard-workflows`: Accessible drag-and-drop and keyboard workflows for palette insertion, canvas reordering, drop feedback, announcements, and command-backed schema edits.

### Modified Capabilities

- `builder-ui-foundation`: Palette, canvas, and responsive builder UI behavior now includes drag states, drop targets, drag overlays, keyboard movement affordances, and invalid-drop recovery requirements.

## Impact

- `packages/react-builder` gains `dnd-kit` dependencies and a package-owned DnD abstraction layer.
- Builder UI components gain drag handles, sortable/drop-zone attributes, accessible announcements, and keyboard workflow controls.
- Builder tests expand to cover DnD state transitions, keyboard alternatives, diagnostics, and undo/redo after drag.
- Playwright coverage expands from click-add/edit/preview to direct manipulation flows.
- `packages/core` remains framework-agnostic and must not gain React, `dnd-kit`, DOM, CSS, or builder UI dependencies.
- `packages/react-renderer` behavior is not changed except where preview verification confirms schema parity after drag edits.
