## Purpose

Define the React builder UI foundation for authoring canonical form schemas. The builder package provides an RTL-first workspace shell, package-owned UI primitives, searchable component palette, command-backed canvas and inspector editing, real renderer preview mode, responsive behavior, and verification expectations without introducing backend-specific persistence or leaking implementation libraries into core contracts.

## Requirements

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

### Requirement: Builder persistence status surface
The React builder package SHALL render persistence-aware workspace states for draft loading, dirty edits, saving, saved confirmation, save failure, retry, and conflict recovery while keeping schema changes command-backed.

#### Scenario: Draft loading is explicit
- **WHEN** the builder is loading a draft through host persistence
- **THEN** the workspace shows a loading state that does not imply a schema is editable until a usable draft or recoverable error is available

#### Scenario: Save status follows adapter result
- **WHEN** a creator saves a draft
- **THEN** the command bar or persistence surface shows saving, saved, failed, or retryable status based on normalized adapter results rather than raw transport errors

#### Scenario: Conflict recovery preserves local work
- **WHEN** saving fails because of a stale draft conflict
- **THEN** the builder shows conflict recovery options such as reload latest, retry when safe, or preserve local edits without silently replacing the local schema

### Requirement: Publish checklist surface
The React builder package SHALL provide a publish checklist that gates publication using schema diagnostics, compiler diagnostics, dangerous-change warnings, required metadata checks, and adapter conflict status.

#### Scenario: Publish blocked by errors
- **WHEN** required publish checks produce blocking errors
- **THEN** the publish action is blocked and the checklist identifies the blocking issues with actionable labels or affected nodes where available

#### Scenario: Publish warns about dangerous changes
- **WHEN** publish checks find dangerous but reviewable changes such as submitted path renames, field deletion, shape changes, option value changes, requiredness changes, or hidden-value policy changes
- **THEN** the builder shows warning context before publishing and does not hide the compatibility risk

#### Scenario: Publish success updates revision context
- **WHEN** publishing succeeds through the adapter contract
- **THEN** the builder updates its visible revision metadata to the returned immutable published revision identity, hash, status, and timestamp without mutating any previous published revision

### Requirement: Revision warning surface
The React builder package SHALL provide a revision warning surface that compares the current draft context with relevant published revision metadata where available.

#### Scenario: Latest published revision is visible
- **WHEN** revision metadata is available
- **THEN** the builder identifies the latest published revision and current draft state in a way creators can understand before saving or publishing

#### Scenario: Dangerous revision differences are surfaced
- **WHEN** current draft edits may affect stored submissions or backend contracts compared with a published revision
- **THEN** the builder surfaces warning diagnostics and affected field context before publish

### Requirement: Generated artifact panel
The React builder package SHALL expose generated backend-friendly artifacts for creator review without implementing compiler behavior inside the builder package.

#### Scenario: Artifact panel displays compiler output
- **WHEN** generated artifact data is available from the validators compiler
- **THEN** the builder can display JSON Schema, compiler diagnostics, validation plan entries, condition dependencies, and conformance fixture references

#### Scenario: Artifact panel handles diagnostics
- **WHEN** generated artifacts contain unsupported or unsafe behavior diagnostics
- **THEN** the builder shows the diagnostics in the artifact panel and publish checklist according to their blocking or warning severity

#### Scenario: Builder does not duplicate compiler logic
- **WHEN** artifact panel behavior is implemented
- **THEN** JSON Schema generation and compiler diagnostic derivation remain in `packages/validators`, not in `packages/react-builder`

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

### Requirement: Builder theme package integration
The React builder package SHALL align default builder styling with the optional themes package while preserving builder-owned behavior and host customization hooks.

#### Scenario: Builder styles compose theme output
- **WHEN** builder default styles are generated or rendered
- **THEN** they consume or align with `@your-org/forms-themes` default variables and avoid duplicating token values that belong to the theme package

#### Scenario: Builder host hooks remain stable
- **WHEN** host CSS targets builder class hooks, data attributes, ARIA states, or CSS variables
- **THEN** Phase 11 theme integration preserves those hooks for command bar, palette, canvas, inspector, workflow panels, drag states, alerts, badges, tabs, and field nodes

#### Scenario: Builder package does not require host theme adoption
- **WHEN** a host renders the builder without importing theme package helpers directly
- **THEN** builder behavior remains available and any default styling path remains package-owned rather than schema-owned

### Requirement: Builder visual verification under default theme
The React builder package SHALL verify that its default themed workspace remains usable across desktop, narrow, RTL, LTR, focus, and reduced-motion contexts.

#### Scenario: Themed builder desktop layout is stable
- **WHEN** the default themed builder is rendered at a desktop viewport
- **THEN** command bar, palette, canvas, inspector, workflow panels, and primary actions remain readable and do not overlap

#### Scenario: Themed builder narrow layout is stable
- **WHEN** the default themed builder is rendered at a narrow viewport
- **THEN** controls wrap or scroll intentionally and field labels, buttons, badges, paths, diagnostics, and drop indicators do not clip incoherently

#### Scenario: Builder focus and motion states are verified
- **WHEN** keyboard focus and reduced-motion preferences are checked on themed builder controls
- **THEN** focus remains visible and nonessential transitions are reduced or removed according to the default theme

### Requirement: Builder integration documentation
The React builder package SHALL have integration documentation that explains how host admin apps embed the builder and connect persistence, publish, preview, generated artifacts, theme hooks, and recovery states.

#### Scenario: Builder guide shows first embed path
- **WHEN** `docs/integration/react-builder.md` is inspected
- **THEN** it shows the current `BuilderWorkspace` usage path with schema input, persistence state, publish checklist, generated artifact bundle, revision metadata, and callbacks

#### Scenario: Builder guide explains command boundaries
- **WHEN** the builder integration guide is inspected
- **THEN** it explains that schema edits flow through commands/store behavior and UI components must not mutate canonical schema behavior directly

#### Scenario: Builder guide explains UI customization
- **WHEN** the builder integration guide is inspected
- **THEN** it documents stable class hooks, data attributes, theme variables, renderer preview parity, RTL/LTR considerations, and host styling boundaries

#### Scenario: Builder guide explains creator workflow states
- **WHEN** the builder integration guide is inspected
- **THEN** it explains save, dirty, saved, failed, conflict, publish-blocked, publish-success, generated artifact, and revision warning states at a host integration level
