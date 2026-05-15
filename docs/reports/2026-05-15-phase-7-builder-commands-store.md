# Phase 7 Builder Commands And Store Report

Date: 2026-05-15
Change: `implement-builder-commands-store`
Status: implemented and ready for owner review

## Summary

Phase 7 replaces the `packages/react-builder` bootstrap placeholder with a plain TypeScript command and editor-store foundation. Builder schema edits now go through product-owned commands that return structured results, dangerous-change diagnostics, and immutable schema snapshots. A small vanilla Zustand-style store coordinates schema state, UI-only state, command status, and bounded undo/redo history without requiring React components.

This phase intentionally does not build visual builder UI. Palette, canvas, inspector, drag-and-drop, preview UI, persistence, publish gates, and adapter-driven workflows remain future phases.

## Out-Of-Scope Dirty Files

The repository still contains unfinished Phase 6 example app edits under `examples/vite-react`, plus related lockfile and root TypeScript alias changes. Those files were already dirty before Phase 7 implementation and were intentionally not included in the Phase 7 commit.

## Changed Files

- `docs/reports/2026-05-15-phase-7-builder-commands-store.md`
- `openspec/changes/implement-builder-commands-store/tasks.md`
- `packages/react-builder/README.md`
- `packages/react-builder/package.json`
- `packages/react-builder/src/index.ts`
- `packages/react-builder/src/index.test.ts`
- `packages/react-builder/src/commands/index.ts`
- `packages/react-builder/src/diagnostics/index.ts`
- `packages/react-builder/src/history/index.ts`
- `packages/react-builder/src/schema/index.ts`
- `packages/react-builder/src/store/index.ts`

## Public APIs Added

- `addNode`
- `deleteNode`
- `duplicateNode`
- `moveNode`
- `updateLabel`
- `updateSubmittedName`
- `updateValidation`
- `updateCondition`
- `updateOptions`
- `updateFieldType`
- `updateSettings`
- `createEditorStore`
- `BuilderCommandResult`
- `BuilderCommandDiagnostic`
- `BuilderCommandName`
- `BuilderSchema`
- `BuilderNode`
- `BuilderOption`
- `BuilderHistoryEntry`
- `BuilderEditorStore`
- `BuilderEditorState`

Thin internal module entrypoints were also added under `src/commands`, `src/diagnostics`, `src/history`, `src/schema`, and `src/store`.

## Command Behavior

Implemented commands are pure functions. They accept a schema and command input, clone schema data before modification, and return:

- `schema`: next schema snapshot
- `changed`: whether the command changed anything
- `diagnostics`: warnings or errors
- `command`: command name

Commands fail closed for missing targets, duplicate ids, dangerous keys, and invalid submitted paths. No-op updates return `changed: false` and are not recorded by the store.

## Dangerous Diagnostics

Implemented warning diagnostics:

- `dangerous_submitted_path_renamed`
- `dangerous_field_deleted`
- `dangerous_shape_changed`
- `dangerous_option_value_changed`
- `dangerous_requiredness_changed`
- `dangerous_hidden_value_policy_changed`
- `dangerous_field_type_changed`

Implemented error diagnostics:

- `duplicate_node_id`
- `missing_target_node`
- `invalid_submitted_path`
- `dangerous_key`

Dangerous compatibility diagnostics are warnings unless the edit is structurally invalid.

## Store Behavior

`createEditorStore` provides:

- schema state
- selected node state
- active panel state
- canvas mode state
- drag state
- command status
- bounded undo history
- bounded redo history

UI-only actions update UI state without mutating the schema. Command execution records schema-changing results in history. Undo restores the previous schema and moves the entry to redo history. Redo reapplies the next schema. New schema-changing commands after undo clear redo history.

## Verification

- `pnpm --filter @your-org/forms-react-builder test`: passed, 1 file and 6 tests.
- `pnpm --filter @your-org/forms-react-builder typecheck`: passed.
- `pnpm --filter @your-org/forms-core test`: passed, 10 files and 27 tests.
- `pnpm typecheck`: passed.
- `pnpm test`: passed, 17 files and 48 tests.
- `openspec validate implement-builder-commands-store --strict`: passed.
- `rg "@your-org/forms-react-builder|packages/react-builder|from \"react\"|from 'react'|@your-org/forms-react-renderer|zustand|dnd-kit" packages/core/src packages/core/package.json`: no matches.
- `rg "from \"react\"|from 'react'|HTMLElement|DragEvent|MouseEvent|@your-org/forms-react-renderer" packages/react-builder/src`: no matches.

## Dependency Boundary Check

`packages/react-builder` depends on `@your-org/forms-core`, as expected, and keeps command/store source free of React runtime imports, DOM event types, renderer implementation imports, Zustand, and dnd-kit.

`packages/core` still has no dependency on the builder, renderer, React, store libraries, drag-and-drop libraries, or UI code.

## Known Limitations

- History stores bounded schema snapshots rather than structural patches.
- The store is a small vanilla Zustand-style implementation, not the Zustand library.
- Dangerous diagnostics are compatibility warnings only; publish gating is a future phase.
- Command batching is not implemented.
- Visual builder UI, drag-and-drop, inspector editing, preview UI, persistence, and publish flows are not included.
- Some source organization is intentionally thin: module folders re-export the package-owned command/store APIs while the initial implementation remains centralized.

## Owner Review Checklist

- [ ] I reviewed the changed files.
- [ ] I reviewed the builder command APIs.
- [ ] I reviewed dangerous-change diagnostics and warning/error behavior.
- [ ] I reviewed editor store state and undo/redo behavior.
- [ ] I understand this phase is not visual builder UI.
- [ ] I understand unfinished Phase 6 example edits remain dirty and out of scope.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

-
