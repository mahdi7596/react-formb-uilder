## 1. Scope And Package Setup

- [ ] 1.1 Record the current dirty Phase 6 example edits as out-of-scope and avoid staging them in this change
- [ ] 1.2 Replace the builder bootstrap placeholder exports with command/store public exports
- [ ] 1.3 Add a builder package `test` script so `pnpm --filter @your-org/forms-react-builder test` runs Vitest
- [ ] 1.4 Create source folders for commands, diagnostics, history, store, schema helpers, and tests
- [ ] 1.5 Confirm the builder command/store layer does not require React runtime imports

## 2. Command Contracts And Helpers

- [ ] 2.1 Define builder command input, result, diagnostic, severity, and metadata types
- [ ] 2.2 Define supported command names for add, delete, duplicate, move, update label, update submitted name, update validation, update condition, update options, update field type, and update settings
- [ ] 2.3 Implement immutable schema cloning and node lookup helpers
- [ ] 2.4 Implement parent/child reference helpers for root nodes, sections, and steps
- [ ] 2.5 Implement unique node id generation and safe duplicate-name behavior
- [ ] 2.6 Implement unsafe key and invalid submitted path diagnostics using core helpers
- [ ] 2.7 Add tests for command contracts, helper behavior, unsafe keys, invalid paths, duplicate ids, and missing targets

## 3. Node Editing Commands

- [ ] 3.1 Implement add-node command with optional parent id and insert position
- [ ] 3.2 Implement delete-node command that removes child references and descendant nodes when appropriate
- [ ] 3.3 Implement duplicate-node command with unique ids and safe submitted path behavior
- [ ] 3.4 Implement move-node command across root, section, and step parents without stale references
- [ ] 3.5 Implement update-label command
- [ ] 3.6 Implement update-submitted-name command
- [ ] 3.7 Implement update-validation command
- [ ] 3.8 Implement update-condition command for visibility and enabled state
- [ ] 3.9 Implement update-options command
- [ ] 3.10 Implement update-field-type command
- [ ] 3.11 Implement update-settings command for hidden-value policy and other schema settings
- [ ] 3.12 Add tests for every node editing command and no-op behavior

## 4. Dangerous Change Diagnostics

- [ ] 4.1 Implement submitted path rename diagnostics
- [ ] 4.2 Implement submittable field deletion diagnostics
- [ ] 4.3 Implement scalar-to-array and array-to-scalar shape change diagnostics
- [ ] 4.4 Implement option value changed/removed diagnostics
- [ ] 4.5 Implement requiredness changed diagnostics
- [ ] 4.6 Implement hidden-value policy changed diagnostics
- [ ] 4.7 Implement field type changed diagnostics
- [ ] 4.8 Ensure dangerous diagnostics are warnings unless the edit is structurally invalid
- [ ] 4.9 Add tests for each dangerous diagnostic type and diagnostic metadata

## 5. History And Store

- [ ] 5.1 Define snapshot-based history entry types with command name, label, timestamp, previous schema, next schema, and diagnostics
- [ ] 5.2 Implement bounded undo stack and redo stack helpers
- [ ] 5.3 Implement editor store creation with schema, selected node, active panel, canvas mode, drag state, command status, and history state
- [ ] 5.4 Implement store UI-state actions for selection, active panel, canvas mode, and drag state without schema mutation
- [ ] 5.5 Implement store command execution action that applies commands and records schema-changing history
- [ ] 5.6 Implement undo action that restores the previous schema and updates redo history
- [ ] 5.7 Implement redo action that reapplies the next schema and updates undo history
- [ ] 5.8 Ensure a new schema-changing command after undo clears redo history
- [ ] 5.9 Ensure no-op commands are not recorded in history
- [ ] 5.10 Add tests for store initialization, command execution, UI state separation, undo, redo, redo clearing, and history limit behavior

## 6. Public API And Documentation

- [ ] 6.1 Export builder command APIs, diagnostics, history helpers, and store factory from `packages/react-builder`
- [ ] 6.2 Keep public exports product-owned and free of DOM, drag event, renderer implementation, and React component requirements
- [ ] 6.3 Update `packages/react-builder/README.md` with command/store responsibilities and example usage
- [ ] 6.4 Add package boundary notes explaining that future UI and drag callbacks must call commands
- [ ] 6.5 Confirm `packages/core` still does not import builder, renderer, React, store, or drag-and-drop code

## 7. Verification, Report, And Commit

- [ ] 7.1 Run `pnpm --filter @your-org/forms-react-builder test`
- [ ] 7.2 Run `pnpm --filter @your-org/forms-react-builder typecheck`
- [ ] 7.3 Run `pnpm --filter @your-org/forms-core test`
- [ ] 7.4 Run `pnpm typecheck`
- [ ] 7.5 Run `openspec validate implement-builder-commands-store --strict`
- [ ] 7.6 Write `docs/reports/2026-05-15-phase-7-builder-commands-store.md`
- [ ] 7.7 Include changed files, command APIs, dangerous diagnostics, store behavior, tests run, boundary checks, known limitations, and owner review checklist in the report
- [ ] 7.8 Commit only Phase 7 proposal artifacts, implementation, tests, docs, and report after verification succeeds
- [ ] 7.9 Stop after Phase 7 and request owner review before Phase 8 builder UI foundation begins
