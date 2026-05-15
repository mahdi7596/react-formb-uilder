## ADDED Requirements

### Requirement: Builder workspace shell
The React builder package SHALL provide an RTL-first visual builder workspace with a top command bar, right component palette, center canvas, and left inspector.

#### Scenario: Desktop shell renders expected regions
- **WHEN** the builder workspace is rendered at a desktop viewport
- **THEN** it exposes a top command bar, right palette region, center canvas region, and left inspector region with accessible region names

#### Scenario: Command bar exposes editing state
- **WHEN** the builder workspace is rendered with an editable schema
- **THEN** the command bar shows the form title, undo/redo controls, preview mode control, and command or diagnostics status without requiring backend persistence

#### Scenario: Shell follows RTL layout
- **WHEN** the builder workspace is rendered in RTL mode
- **THEN** the palette appears on the right, the inspector appears on the left, directional affordances mirror appropriately, and submitted paths or JSON-like values render LTR where needed

### Requirement: Builder UI primitives
The React builder package SHALL provide reusable builder UI primitives for the controls, surfaces, and state displays used by the Phase 8 workspace.

#### Scenario: Primitives expose accessible names and focus states
- **WHEN** buttons, icon buttons, inputs, textareas, selects, tabs, tooltips, menus, and inspector rows are rendered
- **THEN** interactive controls have accessible names, keyboard focus visibility, disabled state behavior, and stable dimensions that do not shift layout

#### Scenario: State primitives render consistently
- **WHEN** empty, loading, error, warning, success, selected, dirty, and disabled states are needed in the builder workspace
- **THEN** the package renders them through reusable primitives that follow `DESIGN.md` tokens and do not require a heavyweight external design system

#### Scenario: Field chrome is reusable
- **WHEN** builder canvas nodes or renderer-adjacent field displays need labels, descriptions, validation messages, required indicators, or selected styling
- **THEN** they reuse package-owned field chrome primitives rather than duplicating markup in each field block

### Requirement: Searchable component palette
The React builder package SHALL provide a searchable grouped component palette for adding MVP field nodes through click-add behavior.

#### Scenario: Palette groups field types
- **WHEN** the palette is rendered
- **THEN** MVP field types are grouped by category with icons or recognizable affordances, short labels, and accessible add controls

#### Scenario: Palette search filters components
- **WHEN** a creator types in the palette search input
- **THEN** matching component groups and items remain visible while non-matching items are hidden or collapsed with no schema mutation

#### Scenario: Click-add inserts through commands
- **WHEN** a creator activates a palette item
- **THEN** the builder inserts a matching node by executing the editor store's command path and selects the created node when insertion succeeds

#### Scenario: Empty palette search is recoverable
- **WHEN** a palette search has no matching components
- **THEN** the palette shows a useful empty state and a clear way to recover without changing the schema

### Requirement: Canvas authoring surface
The React builder package SHALL provide a canvas authoring surface that renders MVP schema nodes, empty states, selection state, quick actions, and inline label editing.

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

### Requirement: Inspector editing
The React builder package SHALL provide inspector tabs for content, validation, logic, accessibility, and data contract settings, with schema-changing edits routed through builder commands.

#### Scenario: Inspector follows selection
- **WHEN** a creator selects a node on the canvas
- **THEN** the inspector shows controls for the selected node and does not show stale controls for a previously selected node

#### Scenario: Content edits use commands
- **WHEN** a creator edits label, description, placeholder, options, or other content settings in the inspector
- **THEN** the edit is committed through builder commands and updates the canvas consistently

#### Scenario: Validation edits use commands
- **WHEN** a creator changes requiredness or supported validation settings in the inspector
- **THEN** the edit is committed through builder commands and dangerous-change diagnostics are visible when applicable

#### Scenario: Logic settings are represented safely
- **WHEN** a creator views or edits supported visibility or condition settings
- **THEN** the inspector uses declarative condition data and never persists executable JavaScript or React components

#### Scenario: Accessibility and data contract settings are explicit
- **WHEN** a creator edits accessibility or data contract settings
- **THEN** submitted paths, ids, labels, helper text, and related contract-affecting values are clearly identified and unsafe submitted paths fail closed through command diagnostics

### Requirement: Preview mode uses real renderer
The React builder package SHALL provide a preview mode that renders the current builder schema through `packages/react-renderer`.

#### Scenario: Preview mounts renderer
- **WHEN** a creator switches to preview mode
- **THEN** the builder renders the current schema with the real React renderer package rather than builder-specific duplicate field rendering

#### Scenario: Preview is isolated from schema editing
- **WHEN** a creator interacts with fields in preview mode
- **THEN** respondent value changes do not mutate the canonical builder schema unless an explicit builder command is executed outside preview interaction

#### Scenario: Preview can return to editing
- **WHEN** a creator exits preview mode
- **THEN** the previous builder selection and editable canvas state are restored where possible

### Requirement: Responsive builder behavior
The React builder package SHALL provide responsive behavior for desktop, tablet, and mobile builder viewports.

#### Scenario: Desktop uses three-panel layout
- **WHEN** the viewport is wide enough for desktop editing
- **THEN** the builder uses the top command bar, right palette, center canvas, and left inspector layout

#### Scenario: Tablet collapses inspector
- **WHEN** the viewport is tablet-sized
- **THEN** the inspector is available as a drawer or equivalent secondary surface while the creator can still discover fields and edit the canvas

#### Scenario: Mobile favors preview and quick edit
- **WHEN** the viewport is mobile-sized
- **THEN** the builder avoids an unusable squeezed three-panel layout and provides preview-oriented or quick-edit access to core actions

#### Scenario: Text does not overlap or clip
- **WHEN** builder labels, buttons, tabs, paths, or diagnostics contain long text
- **THEN** text wraps, truncates with accessible disclosure, or uses stable sizing so controls do not overlap incoherently across supported viewports

### Requirement: Builder UI verification
The project SHALL verify the Phase 8 builder UI foundation before the phase is considered complete.

#### Scenario: Component tests cover builder workflows
- **WHEN** React component tests run for the builder package
- **THEN** they cover palette filtering and click-add, canvas selection, inline label editing, inspector edits, preview mode, empty states, and command diagnostics visibility

#### Scenario: Browser checks cover rendered UI
- **WHEN** the builder UI is served through a clean package-local or dedicated preview surface
- **THEN** Playwright or Browser-plugin checks verify desktop and narrow viewports, creator add/edit/preview flow, focus behavior, and absence of obvious console errors

#### Scenario: Reviewer skills are applied
- **WHEN** Phase 8 implementation is complete
- **THEN** `form-builder-ui-reviewer` and `form-builder-ux-reviewer` are used to review the visual quality and creator UX before owner review

#### Scenario: Phase report is written
- **WHEN** Phase 8 is complete
- **THEN** `docs/reports/2026-05-15-phase-8-builder-ui-foundation.md` summarizes changed files, implemented UI surfaces, tests run, browser evidence, screenshots, known limitations, out-of-scope dirty files, and owner review checklist
