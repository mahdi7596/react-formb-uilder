## Context

`packages/react-builder` is currently a placeholder package. The upcoming builder UI phases need command-driven schema mutation and undo/redo behavior before components, drag callbacks, or inspector controls are allowed to edit canonical schemas.

This phase creates a domain layer inside the React builder package, but the behavior itself should be plain TypeScript and testable without rendering React. React components, drag-and-drop, persistence, and visual builder UI come later.

Key constraints:

- Canonical schemas remain JSON-serializable.
- `packages/core` stays framework-agnostic and owns general schema/path/condition/validation primitives.
- Builder commands may depend on `packages/core`, but `packages/core` must not depend on `packages/react-builder`.
- UI components must not mutate schemas directly in later phases; they should call this command layer.
- Published revisions are immutable, so dangerous changes should be diagnosed before publish/persistence workflows are implemented.

## Goals / Non-Goals

**Goals:**

- Add builder command APIs for schema node creation, deletion, duplication, movement, and field updates.
- Add command diagnostics for dangerous schema edits that could affect stored responses or backend contracts.
- Add history behavior that supports undo and redo around command results.
- Add an editor store model for selected node, active panel, canvas mode, drag state, command status, schema state, and history.
- Keep the command layer React-free and testable through Vitest.
- Keep public builder exports package-owned and focused on builder concepts.

**Non-Goals:**

- No visual builder shell, palette, canvas UI, inspector UI, or drag-and-drop UI.
- No persistence, publish workflow, revision storage, server state, or TanStack Query integration.
- No generated JSON Schema UI or backend adapter work.
- No real-time collaboration or multi-user conflict model.
- No full migration engine for dangerous changes; this phase only diagnoses them.
- No changes to renderer behavior.

## Decisions

### Decision: Commands are pure functions

Commands should accept immutable inputs and return a result object containing the next schema, diagnostics, metadata, and inverse/undo information where needed.

Alternatives considered:

- Mutate an editor store directly from every command. This couples domain behavior to state management and makes command tests harder.
- Make commands pure and let the store call them. This keeps domain edits reusable by UI, drag-and-drop, tests, and future persistence flows.

Chosen approach: pure command functions, with a thin store wrapper.

### Decision: Use product-owned command result contracts

Every command should return a builder-owned result shape such as `BuilderCommandResult`, with `schema`, `diagnostics`, `changed`, and optional history metadata.

Alternatives considered:

- Throw for all invalid edits. This is hostile to builder UX, where invalid edits often need inline diagnostics.
- Return only a schema. This hides dangerous-change warnings and makes future publish gates weaker.

Chosen approach: structured result contracts and diagnostics.

### Decision: Store is Zustand-style but dependency-light

The phase should implement a small store model with selector-friendly state and actions. If a dependency is unnecessary, use a framework-neutral store factory rather than adding Zustand immediately.

Alternatives considered:

- Add Zustand now. This matches the architecture language but adds a React-adjacent dependency before UI exists.
- Implement a minimal Zustand-style vanilla store shape. This proves state transitions and keeps the phase focused.

Chosen approach: minimal vanilla Zustand-style store APIs unless implementation strongly benefits from adding Zustand.

### Decision: History stores command patches or snapshots

For Phase 7, history can store bounded schema snapshots plus command metadata. The API should leave room to switch to patches later.

Alternatives considered:

- Compute structural JSON patches. More compact but adds complexity before UI and persistence need it.
- Store snapshots. Simpler, deterministic, and enough for MVP command tests.

Chosen approach: snapshot-based undo/redo with a bounded history limit and command metadata.

### Decision: Dangerous-change diagnostics are warnings, not hard blockers

Commands should still produce next schemas unless the edit is structurally invalid or unsafe. Dangerous contract changes should be surfaced as diagnostics so future publish gates can block or require confirmation.

Alternatives considered:

- Block dangerous edits immediately. This can make normal builder editing frustrating and belongs more naturally to publish/revision workflows.
- Ignore dangerous edits until publishing. That weakens immediate feedback and makes undo/history less informative.

Chosen approach: allow edits with diagnostics, fail closed for unsafe keys and structurally invalid operations.

## Risks / Trade-offs

- [Risk] Snapshot history can become memory-heavy for large forms. → Mitigation: keep a configurable history limit and document future patch-based replacement as an internal implementation detail.
- [Risk] Command APIs could accidentally encode UI assumptions. → Mitigation: keep commands plain TypeScript and avoid React, DOM, drag, or component concepts in command inputs.
- [Risk] Dangerous-change detection could be incomplete. → Mitigation: explicitly cover the Phase 7 list with tests and keep diagnostics extensible for later publish gates.
- [Risk] Existing Phase 6 dirty example edits could be accidentally committed with Phase 7 artifacts or implementation. → Mitigation: stage only Phase 7 files during proposal and implementation commits.
- [Risk] Moving nodes across sections/steps can create orphan or duplicate child references. → Mitigation: centralize child-list updates and test root, section, and step movement cases.

## Migration Plan

1. Replace builder placeholder exports with command/store exports.
2. Add command result and diagnostic types.
3. Implement schema editing helpers and command functions.
4. Implement dangerous-change diagnostic helpers.
5. Implement history and editor store factory.
6. Add command/store tests.
7. Run package and workspace verification.
8. Write the Phase 7 report and stop for owner review.

Rollback is a normal commit revert. The phase should not alter persisted data or main core behavior.

## Open Questions

- Should Phase 7 add a real `zustand` dependency or keep a vanilla compatible store shape? Default: keep vanilla unless implementation friction appears.
- Should dangerous diagnostics include severity levels now? Default: yes, use warning/error severities so future publish checks can interpret them.
- Should command APIs support batch commands in this phase? Default: no, single-command history first; batching can be layered later.
