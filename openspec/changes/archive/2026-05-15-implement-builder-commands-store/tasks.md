## 1. Scope And Package Setup

- [x] 1.1 Record the current dirty Phase 6 example edits as out-of-scope and avoid staging them in this change
- [x] 1.2 Replace the builder bootstrap placeholder exports with command/store public exports
- [x] 1.3 Add a builder package `test` script so `pnpm --filter @your-org/forms-react-builder test` runs Vitest
- [x] 1.4 Create source folders for commands, diagnostics, history, store, schema helpers, and tests
- [x] 1.5 Confirm the builder command/store layer does not require React runtime imports

## 2. Command Contracts And Helpers

- [x] 2.1 Define builder command input, result, diagnostic, severity, and metadata types
- [x] 2.2 Define supported command names for add, delete, duplicate, move, update label, update submitted name, update validation, update condition, update options, update field type, and update settings
- [x] 2.3 Implement immutable schema cloning and node lookup helpers
- [x] 2.4 Implement parent/child reference helpers for root nodes, sections, and steps
- [x] 2.5 Implement unique node id generation and safe duplicate-name behavior
- [x] 2.6 Implement unsafe key and invalid submitted path diagnostics using core helpers
- [x] 2.7 Add tests for command contracts, helper behavior, unsafe keys, invalid paths, duplicate ids, and missing targets

## 3. Node Editing Commands

- [x] 3.1 Implement add-node command with optional parent id and insert position
- [x] 3.2 Implement delete-node command that removes child references and descendant nodes when appropriate
- [x] 3.3 Implement duplicate-node command with unique ids and safe submitted path behavior
- [x] 3.4 Implement move-node command across root, section, and step parents without stale references
- [x] 3.5 Implement update-label command
- [x] 3.6 Implement update-submitted-name command
- [x] 3.7 Implement update-validation command
- [x] 3.8 Implement update-condition command for visibility and enabled state
- [x] 3.9 Implement update-options command
- [x] 3.10 Implement update-field-type command
- [x] 3.11 Implement update-settings command for hidden-value policy and other schema settings
- [x] 3.12 Add tests for every node editing command and no-op behavior

## 4. Dangerous Change Diagnostics

- [x] 4.1 Implement submitted path rename diagnostics
- [x] 4.2 Implement submittable field deletion diagnostics
- [x] 4.3 Implement scalar-to-array and array-to-scalar shape change diagnostics
- [x] 4.4 Implement option value changed/removed diagnostics
- [x] 4.5 Implement requiredness changed diagnostics
- [x] 4.6 Implement hidden-value policy changed diagnostics
- [x] 4.7 Implement field type changed diagnostics
- [x] 4.8 Ensure dangerous diagnostics are warnings unless the edit is structurally invalid
- [x] 4.9 Add tests for each dangerous diagnostic type and diagnostic metadata

## 5. History And Store

- [x] 5.1 Define snapshot-based history entry types with command name, label, timestamp, previous schema, next schema, and diagnostics
- [x] 5.2 Implement bounded undo stack and redo stack helpers
- [x] 5.3 Implement editor store creation with schema, selected node, active panel, canvas mode, drag state, command status, and history state
- [x] 5.4 Implement store UI-state actions for selection, active panel, canvas mode, and drag state without schema mutation
- [x] 5.5 Implement store command execution action that applies commands and records schema-changing history
- [x] 5.6 Implement undo action that restores the previous schema and updates redo history
- [x] 5.7 Implement redo action that reapplies the next schema and updates undo history
- [x] 5.8 Ensure a new schema-changing command after undo clears redo history
- [x] 5.9 Ensure no-op commands are not recorded in history
- [x] 5.10 Add tests for store initialization, command execution, UI state separation, undo, redo, redo clearing, and history limit behavior

## 6. Public API And Documentation

- [x] 6.1 Export builder command APIs, diagnostics, history helpers, and store factory from `packages/react-builder`
- [x] 6.2 Keep public exports product-owned and free of DOM, drag event, renderer implementation, and React component requirements
- [x] 6.3 Update `packages/react-builder/README.md` with command/store responsibilities and example usage
- [x] 6.4 Add package boundary notes explaining that future UI and drag callbacks must call commands
- [x] 6.5 Confirm `packages/core` still does not import builder, renderer, React, store, or drag-and-drop code

## 7. Verification, Report, And Commit

- [x] 7.1 Run `pnpm --filter @your-org/forms-react-builder test`
- [x] 7.2 Run `pnpm --filter @your-org/forms-react-builder typecheck`
- [x] 7.3 Run `pnpm --filter @your-org/forms-core test`
- [x] 7.4 Run `pnpm typecheck`
- [x] 7.5 Run `openspec validate implement-builder-commands-store --strict`
- [x] 7.6 Write `docs/reports/2026-05-15-phase-7-builder-commands-store.md`
- [x] 7.7 Include changed files, command APIs, dangerous diagnostics, store behavior, tests run, boundary checks, known limitations, and owner review checklist in the report
- [x] 7.8 Commit only Phase 7 proposal artifacts, implementation, tests, docs, and report after verification succeeds
- [x] 7.9 Stop after Phase 7 and request owner review before Phase 8 builder UI foundation begins
