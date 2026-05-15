## Purpose

Define accessible drag-and-drop and keyboard workflows for the React builder. This capability covers package-owned DnD abstractions, palette-to-canvas insertion, canvas reordering, drag overlays, drop feedback, live announcements, keyboard alternatives, and verification expectations while keeping schema mutations command-backed and keeping `packages/core` framework-free.

## Requirements

### Requirement: Builder DnD abstraction layer
The React builder package SHALL provide a package-owned drag-and-drop abstraction layer that wraps `dnd-kit` and translates pointer and keyboard interactions into builder command intents.

#### Scenario: DnD layer keeps schema mutation command-backed
- **WHEN** a drag or keyboard movement interaction completes successfully
- **THEN** the resulting schema change is applied through the editor store command path rather than by mutating schema data inside React event handlers

#### Scenario: DnD layer uses typed drag payloads
- **WHEN** the builder starts dragging a palette item or a canvas node
- **THEN** the drag state identifies the source type, stable source id, display label, and command-relevant payload without storing DOM objects in schema or command inputs

#### Scenario: Core boundary remains framework-free
- **WHEN** the DnD layer is added to the React builder package
- **THEN** `packages/core` still has no dependency on React, `dnd-kit`, DOM events, CSS, builder UI code, or renderer code

### Requirement: Palette to canvas drag insertion
The React builder package SHALL allow creators to drag MVP field templates from the palette onto valid canvas drop targets to insert schema nodes.

#### Scenario: Palette drag inserts a field
- **WHEN** a creator drags a palette field template onto a valid canvas insertion target and drops it
- **THEN** the builder executes the add-node command, inserts a matching JSON-serializable node, selects the inserted node, and records the change in undo history

#### Scenario: Palette click-add remains available
- **WHEN** drag-and-drop support is enabled
- **THEN** existing palette click-add behavior remains available and continues to use the command/store path

#### Scenario: Invalid palette drop does not mutate schema
- **WHEN** a creator drops a palette template on an unsupported target
- **THEN** the builder leaves the canonical schema unchanged, shows invalid-drop feedback, and announces that the drop target is not valid

### Requirement: Canvas reorder by drag
The React builder package SHALL allow creators to reorder existing canvas nodes through drag-and-drop while preserving schema integrity.

#### Scenario: Canvas drag reorders a field
- **WHEN** a creator drags an existing canvas node to a valid before or after position and drops it
- **THEN** the builder executes the move-node command and updates canvas order without duplicate child references or orphaned parent references

#### Scenario: Reorder keeps selection understandable
- **WHEN** a selected canvas node is moved by drag
- **THEN** the moved node remains selected after the command succeeds and the inspector follows the moved node

#### Scenario: No-op reorder is not recorded
- **WHEN** a canvas node is dropped back into its existing position
- **THEN** the builder does not add a new undo history entry and communicates that no movement occurred

### Requirement: Drag overlay and drop feedback
The React builder package SHALL provide visible and accessible drag overlays, drop indicators, and drag-state feedback for valid, invalid, dragging, dropping, and cancelled states.

#### Scenario: Drag overlay identifies the dragged item
- **WHEN** a creator starts dragging a palette template or canvas node
- **THEN** the builder shows a drag overlay that identifies the item without changing canonical schema data

#### Scenario: Valid drop target is clear
- **WHEN** a dragged item moves over a valid insertion or reorder target
- **THEN** the builder shows a clear drop indicator and exposes target context to assistive technology

#### Scenario: Invalid drop target is recoverable
- **WHEN** a dragged item moves over an invalid target or is dropped there
- **THEN** the builder shows invalid-drop feedback, announces the issue, preserves the previous schema, and leaves the creator able to continue editing

### Requirement: Keyboard insertion and movement
The React builder package SHALL provide keyboard-accessible alternatives for inserting palette items and moving canvas nodes.

#### Scenario: Keyboard inserts palette field
- **WHEN** a keyboard user focuses a palette item and activates its keyboard insertion control
- **THEN** the builder inserts the field through the same add-node command path used by pointer workflows and announces the result

#### Scenario: Keyboard moves selected node
- **WHEN** a keyboard user activates move-before or move-after controls for a selected canvas node
- **THEN** the builder executes the move-node command, updates order, preserves focus or selection predictably, and announces the new position

#### Scenario: Keyboard invalid movement is explained
- **WHEN** a keyboard user attempts to move a node beyond the allowed order or into an unsupported target
- **THEN** the builder leaves the schema unchanged and announces why the movement is not allowed

### Requirement: Drag announcements
The React builder package SHALL provide accessible announcements for drag and keyboard movement workflows.

#### Scenario: Drag start is announced
- **WHEN** a creator starts dragging a palette template or canvas node
- **THEN** the builder announces the item being moved and the available kind of action

#### Scenario: Drop result is announced
- **WHEN** a drop succeeds, fails, or is cancelled
- **THEN** the builder announces the result in a live region without relying only on visual styling

#### Scenario: Keyboard move result is announced
- **WHEN** a keyboard insertion or movement succeeds or fails
- **THEN** the builder announces the result with the affected field label and position context where available

### Requirement: DnD verification
The project SHALL verify drag-and-drop and keyboard builder workflows before the phase is considered complete.

#### Scenario: Component tests cover DnD state and keyboard workflows
- **WHEN** React builder component tests run
- **THEN** they cover drag-state rendering, keyboard insertion, keyboard movement, invalid-drop feedback, announcements, and undo/redo after command-backed drag or keyboard edits

#### Scenario: Browser tests cover pointer drag
- **WHEN** Playwright tests run for the builder harness
- **THEN** they cover palette-to-canvas pointer drag, canvas reorder by pointer drag, invalid drop feedback, and undo/redo after drag

#### Scenario: Phase review captures DnD quality
- **WHEN** Phase 9 implementation is complete
- **THEN** Browser-plugin inspection, `form-builder-ui-reviewer`, and `form-builder-ux-reviewer` are used to review visual feedback, accessibility, and creator confidence before owner review
