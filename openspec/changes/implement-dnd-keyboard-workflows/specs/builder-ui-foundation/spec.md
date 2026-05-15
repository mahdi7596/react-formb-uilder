## MODIFIED Requirements

### Requirement: Searchable component palette
The React builder package SHALL provide a searchable grouped component palette for adding MVP field nodes through click-add behavior and accessible drag insertion.

#### Scenario: Palette groups field types
- **WHEN** the palette is rendered
- **THEN** MVP field types are grouped by category with icons or recognizable affordances, short labels, and accessible add controls

#### Scenario: Palette search filters components
- **WHEN** a creator types in the palette search input
- **THEN** matching component groups and items remain visible while non-matching items are hidden or collapsed with no schema mutation

#### Scenario: Click-add inserts through commands
- **WHEN** a creator activates a palette item
- **THEN** the builder inserts a matching node by executing the editor store's command path and selects the created node when insertion succeeds

#### Scenario: Palette drag inserts through commands
- **WHEN** a creator drags a palette item to a valid canvas drop target
- **THEN** the builder inserts a matching node by executing the editor store's command path and selects the created node when insertion succeeds

#### Scenario: Empty palette search is recoverable
- **WHEN** a palette search has no matching components
- **THEN** the palette shows a useful empty state and a clear way to recover without changing the schema

### Requirement: Canvas authoring surface
The React builder package SHALL provide a canvas authoring surface that renders MVP schema nodes, empty states, selection state, drag state, quick actions, and inline label editing.

#### Scenario: Canvas renders schema nodes
- **WHEN** the current builder schema contains MVP field nodes
- **THEN** the canvas renders each node as an authoring block with field label, submitted path, field type context, and relevant validation or diagnostics indicators

#### Scenario: Canvas empty state supports first insertion
- **WHEN** the current builder schema has no editable field nodes
- **THEN** the canvas shows an empty state that directs the creator to add a component from the palette without pretending that a backend save exists

#### Scenario: Selection updates UI state only
- **WHEN** a creator selects a canvas node
- **THEN** the editor store selection changes, the node receives selected styling, and the canonical schema remains unchanged

#### Scenario: Inline label editing uses commands
- **WHEN** a creator edits a selected node label inline and commits the edit
- **THEN** the change is applied through the builder command/store path and participates in diagnostics and undo/redo history

#### Scenario: Quick actions use commands
- **WHEN** a creator duplicates, deletes, or moves a node through canvas quick actions
- **THEN** the action executes the corresponding builder command and surfaces command diagnostics when the command warns or fails

#### Scenario: Drag reorder uses commands
- **WHEN** a creator reorders canvas nodes by drag-and-drop
- **THEN** the reorder executes the corresponding builder move command, updates selection consistently, and surfaces command diagnostics when the command warns or fails

#### Scenario: Canvas shows drag and drop states
- **WHEN** a creator drags over the canvas or over a node
- **THEN** the canvas shows stable dragging, dropping, valid-drop, and invalid-drop states without overlapping text or resizing unrelated controls

### Requirement: Responsive builder behavior
The React builder package SHALL provide responsive behavior for desktop, tablet, and mobile builder viewports, including accessible alternatives when pointer drag is not ergonomic.

#### Scenario: Desktop uses three-panel layout
- **WHEN** the viewport is wide enough for desktop editing
- **THEN** the builder uses the top command bar, right palette, center canvas, and left inspector layout

#### Scenario: Tablet collapses inspector
- **WHEN** the viewport is tablet-sized
- **THEN** the inspector is available as a drawer or equivalent secondary surface while the creator can still discover fields and edit the canvas

#### Scenario: Mobile favors preview and quick edit
- **WHEN** the viewport is mobile-sized
- **THEN** the builder avoids an unusable squeezed three-panel layout and provides preview-oriented or quick-edit access to core actions

#### Scenario: Narrow layouts keep keyboard movement available
- **WHEN** pointer drag is difficult because of viewport size or input mode
- **THEN** the builder still exposes keyboard-accessible insertion or movement controls for supported MVP workflows

#### Scenario: Text does not overlap or clip
- **WHEN** builder labels, buttons, tabs, paths, diagnostics, drag overlays, or drop indicators contain long text
- **THEN** text wraps, truncates with accessible disclosure, or uses stable sizing so controls do not overlap incoherently across supported viewports
