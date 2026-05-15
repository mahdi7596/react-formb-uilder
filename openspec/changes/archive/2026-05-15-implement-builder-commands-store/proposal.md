## Why

The builder package is still a placeholder, and future UI phases need a safe, testable command layer before React components start editing schemas. Phase 7 establishes schema-editing commands, dangerous-change diagnostics, and undo/redo store behavior so builder UI, drag-and-drop, and persistence can call stable domain APIs instead of mutating canonical schemas directly.

## What Changes

- Replace the `packages/react-builder` bootstrap placeholder with public builder command and store APIs.
- Add command functions for adding, deleting, duplicating, moving, and updating canonical schema nodes.
- Add commands for updating labels, submitted names, validation rules, conditions, and options.
- Add dangerous-change diagnostics for submitted path rename, node deletion, scalar-to-array changes, option value changes, requiredness changes, hidden-value policy changes, and field type changes.
- Add a Zustand-style editor store model for selected node, active panel, canvas mode, drag state, command status, and undo/redo history.
- Keep schema mutations command-driven and testable outside React components.
- Add focused Vitest coverage for every command, dangerous-change diagnostic, and history behavior.

## Capabilities

### New Capabilities

- `builder-commands-store`: Builder schema-editing commands, command diagnostics, editor store state, and undo/redo history behavior.

### Modified Capabilities

- None.

## Impact

- Affected package: `packages/react-builder`.
- Affected dependencies: may add a small store dependency only if needed, but the command layer itself must remain testable without React UI.
- Affected tests: builder command/store Vitest suites and workspace typecheck/build behavior.
- No changes to `packages/core` runtime behavior are intended unless command implementation reveals a missing framework-neutral helper that should live in core.
- No builder UI, drag-and-drop UI, inspector UI, persistence, publish flow, or visual styling is included in this change.
- Existing dirty Phase 6 example edits are out of scope and should not be included in this change commit.
