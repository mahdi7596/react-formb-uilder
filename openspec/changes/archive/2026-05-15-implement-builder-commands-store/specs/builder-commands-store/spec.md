## ADDED Requirements

### Requirement: Builder command API
The React builder package SHALL expose product-owned command APIs for editing canonical schemas without requiring React components or UI state.

#### Scenario: Command returns structured result
- **WHEN** a builder command is executed with a valid schema and command input
- **THEN** it returns a structured result containing the next schema, whether the schema changed, and any command diagnostics

#### Scenario: Command rejects unsafe input
- **WHEN** a command input contains an unsafe submitted path, dangerous key, missing target node, duplicate node id, or structurally invalid edit
- **THEN** the command fails closed with diagnostics and does not silently corrupt the schema

#### Scenario: Commands are React-free
- **WHEN** host code imports builder command APIs
- **THEN** those APIs do not require React components, DOM objects, drag events, or renderer internals

### Requirement: Node editing commands
The React builder package SHALL support command-driven node creation, deletion, duplication, movement, and basic node updates.

#### Scenario: Add node
- **WHEN** an add-node command is executed with a valid node and optional parent/position
- **THEN** the node is inserted into the schema and into the requested parent child order when applicable

#### Scenario: Delete node
- **WHEN** a delete-node command is executed for an existing node
- **THEN** the node and any child references owned by that node are removed from the schema without leaving stale parent references

#### Scenario: Duplicate node
- **WHEN** a duplicate-node command is executed for an existing node
- **THEN** a new node with a unique id and safe submitted path behavior is inserted near the source node

#### Scenario: Move node
- **WHEN** a move-node command is executed with a valid target parent and position
- **THEN** the node is moved without duplicate child references or orphaned parent references

#### Scenario: Update node fields
- **WHEN** update commands change labels, submitted names, field types, validation rules, conditions, or options
- **THEN** the resulting schema reflects the requested JSON-serializable update through command behavior

### Requirement: Dangerous change diagnostics
The React builder package SHALL emit diagnostics for schema edits that may affect stored responses, backend contracts, or published revision compatibility.

#### Scenario: Submitted path rename diagnostic
- **WHEN** a command changes a field submitted path
- **THEN** the command result includes a dangerous-change diagnostic for submitted path rename

#### Scenario: Deletion diagnostic
- **WHEN** a command deletes a submittable field
- **THEN** the command result includes a dangerous-change diagnostic for deletion

#### Scenario: Shape-change diagnostic
- **WHEN** a command changes scalar-to-array behavior, array-to-scalar behavior, field type, hidden-value policy, or requiredness
- **THEN** the command result includes a dangerous-change diagnostic describing the compatibility risk

#### Scenario: Option value diagnostic
- **WHEN** a command changes or removes an existing option value
- **THEN** the command result includes a dangerous-change diagnostic for option value change

### Requirement: Editor store model
The React builder package SHALL provide an editor store model that coordinates schema state, selection state, UI mode state, drag state, command status, and history without putting domain invariants inside React components.

#### Scenario: Store initializes from schema
- **WHEN** the editor store is created with an initial schema
- **THEN** it exposes the schema, selected node state, active panel state, canvas mode state, drag state, command status, undo availability, and redo availability

#### Scenario: Store executes commands
- **WHEN** a store action executes a builder command
- **THEN** the store updates schema state, command diagnostics, selection where applicable, and history consistently

#### Scenario: Store tracks UI state separately
- **WHEN** selection, active panel, canvas mode, or drag state changes
- **THEN** those changes do not mutate the canonical schema unless a command action is explicitly executed

### Requirement: Undo and redo history
The React builder package SHALL support undo and redo for command-driven schema edits.

#### Scenario: Undo restores previous schema
- **WHEN** a schema-changing command has been executed and the user triggers undo
- **THEN** the editor store restores the previous schema and moves the command into redo history

#### Scenario: Redo reapplies command result
- **WHEN** an undone command is available and the user triggers redo
- **THEN** the editor store reapplies the schema state and restores command metadata

#### Scenario: New command clears redo
- **WHEN** a new schema-changing command is executed after undo
- **THEN** redo history is cleared

#### Scenario: No-op commands are not recorded
- **WHEN** a command returns no schema change
- **THEN** the editor store does not add a new undo history entry

### Requirement: Builder command verification
The project SHALL verify builder commands and store behavior before visual builder UI work begins.

#### Scenario: Builder command tests pass
- **WHEN** `pnpm --filter @your-org/forms-react-builder test` runs
- **THEN** tests cover add, delete, duplicate, move, label updates, submitted-name updates, validation updates, condition updates, option updates, dangerous diagnostics, store actions, and undo/redo behavior

#### Scenario: Core boundary remains intact
- **WHEN** Phase 7 is complete
- **THEN** `packages/core` still has no dependency on React, builder, renderer, store libraries, drag-and-drop libraries, or UI code

#### Scenario: Phase report exists
- **WHEN** Phase 7 is complete
- **THEN** `docs/reports/2026-05-15-phase-7-builder-commands-store.md` summarizes changed files, command APIs, diagnostics, store behavior, tests run, known limitations, and owner review checklist
