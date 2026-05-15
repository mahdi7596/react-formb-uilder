## Context

The builder currently has the Phase 8 visual foundation: an RTL-first workspace, searchable palette, canvas node rendering, inspector editing, command bar, quick actions, and preview through the real renderer. Schema changes already flow through `packages/react-builder` commands and the editor store, and the store already includes a drag-state shape that is not yet connected to real drag-and-drop UI.

Phase 9 adds direct manipulation on top of that foundation. The important boundary is that pointer and keyboard gestures are interaction mechanisms only. The actual schema edit must still be performed by existing builder commands such as add node, move node, select node, undo, and redo.

The approved architecture chooses `dnd-kit` for `packages/react-builder`, wrapped behind builder-owned abstractions. It also requires keyboard-accessible workflows before drag-and-drop is considered complete.

## Goals / Non-Goals

**Goals:**

- Add `dnd-kit` to `packages/react-builder` without introducing it into `packages/core`.
- Create a builder DnD layer that translates pointer and keyboard interactions into builder-owned drag intents.
- Support palette-to-canvas insertion by drag.
- Support canvas field reordering by drag.
- Add drag overlay, drop-zone indicators, invalid-drop feedback, and accessible announcements.
- Add keyboard insertion and movement alternatives that execute the same command/store paths as pointer drag.
- Preserve undo/redo behavior for drag-created and drag-moved schema edits.
- Verify the workflows with component tests, Playwright, Browser-plugin inspection, and reviewer skills.
- Keep unrelated Phase 6 example-app work out of this change.

**Non-Goals:**

- No nested tree/repeater DnD beyond the existing MVP flat or current parent-child command behavior.
- No persistence, publish, revision, conflict, or backend save behavior.
- No real-time collaboration, multiplayer cursors, or CRDT behavior.
- No replacement of the existing command/store model.
- No changes to `packages/core` contracts beyond boundary verification.
- No final design-system overhaul; visual polish should remain scoped to DnD states and clarity.

## Decisions

### Use a package-owned DnD layer over direct `dnd-kit` usage

The UI should not scatter raw `dnd-kit` events across palette and canvas components. Instead, create a small builder DnD layer that owns:

- draggable ids and data payloads,
- drop target ids and target meaning,
- collision/drop interpretation,
- drag overlay rendering,
- announcements,
- conversion from drag result to command execution.

This keeps `dnd-kit` as an implementation detail of the React builder UI and protects existing command boundaries.

### Model DnD as intents, not schema mutations

Pointer and keyboard interactions should resolve into builder intents:

```text
palette item drag -> add node intent -> addNode command -> select inserted node
canvas node drag  -> move node intent -> moveNode command -> preserve selection
invalid target    -> diagnostic/status intent -> no schema mutation
```

The DnD layer may update editor drag state for visual feedback, but it must not mutate `schema.nodes` directly.

### Keep palette insertion and canvas reorder as separate drag sources

Palette items represent templates that create new nodes. Canvas items represent existing schema nodes. Their payloads should be distinct:

```text
Drag source type: palette-template
  payload: palette item key, node template, label

Drag source type: canvas-node
  payload: node id, current parent, current index
```

This avoids accidentally moving a palette template or duplicating an existing canvas node when the user intended a reorder.

### Make keyboard behavior first-class

Keyboard workflows should not be a hidden fallback. They should be visible through accessible controls and predictable focus behavior:

- palette item keyboard add inserts the selected template,
- selected canvas node can move before/after neighboring nodes through keyboard controls,
- announcements describe the result,
- undo/redo works after keyboard changes.

The initial implementation can use explicit keyboard-accessible controls and `dnd-kit` keyboard sensor behavior where appropriate. If `dnd-kit` keyboard sorting conflicts with the command model, prefer the product command contract and implement command-backed keyboard movement directly.

### Use live-region announcements owned by the builder

Accessible announcements should be centralized so tests and future localization can reason about them. Announcements should cover:

- drag start,
- valid movement over a target,
- invalid target,
- drop success,
- drop cancellation,
- keyboard move success.

Announcements should be concise and not depend on visual-only color or icon feedback.

### Treat invalid drops as recoverable command-state feedback

Invalid drops should not silently do nothing. They should:

- leave the schema unchanged,
- set a visible invalid-drop status or diagnostic,
- announce the failure,
- return focus to a useful source or selected node when possible.

### Scope responsive DnD conservatively

Desktop should support full palette-to-canvas and canvas reorder. Narrow viewports should still expose keyboard or quick-action alternatives even if pointer drag is harder to use. Mobile DnD should be verified for no broken layout and no inaccessible trapped state, but the phase does not need advanced touch choreography beyond `dnd-kit` sensor support.

## Risks / Trade-offs

- [Risk] `dnd-kit` pointer events are awkward in jsdom component tests. -> Use component tests for state/announcements and Playwright for real pointer drag behavior.
- [Risk] Drag state could bypass command diagnostics. -> Require all successful drops to call existing store command paths and test undo/redo after drag.
- [Risk] Keyboard DnD can become unclear or undiscoverable. -> Provide explicit accessible controls and live announcements, not only hidden keyboard sensor shortcuts.
- [Risk] Invalid-drop states can create noisy UI. -> Keep feedback localized to the source/target and command bar status.
- [Risk] Future nested sections/repeaters may need richer tree DnD. -> Keep the DnD layer extensible with typed drag payloads and target descriptors, but only implement MVP targets in this phase.
- [Risk] The current Phase 6 example files and lockfile are dirty. -> Keep all Phase 9 staging and commits scoped to builder DnD artifacts unless the owner changes scope.

## Migration Plan

1. Add `dnd-kit` dependencies to `packages/react-builder` with pnpm.
2. Add DnD abstractions and tests while preserving existing click-add and quick actions.
3. Wire palette and canvas components to the DnD layer.
4. Add keyboard insertion/movement and live announcements.
5. Expand Playwright and Browser-plugin verification.
6. Write the Phase 9 report and commit only Phase 9 files.

Rollback is straightforward: remove the DnD layer wiring and dependency additions while leaving existing Phase 8 click-add, quick actions, inspector editing, and preview workflows intact.

## Open Questions

- Should mobile pointer drag be considered a supported workflow in Phase 9, or should mobile rely on keyboard/quick-edit controls until a later mobile-focused builder UX phase?
- Should drag handles be always visible, or visible only on hover/focus/selection? The implementation should prefer always-accessible handles if there is any doubt.
