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

### Requirement: Builder release-candidate audit
The React builder SHALL be audited for MVP release-candidate readiness across creator workflows, preview parity, accessibility, drag-and-drop, package boundaries, and visual stability.

#### Scenario: Creator workflow is audited
- **WHEN** Phase 13 builder checks run
- **THEN** adding fields, selecting nodes, editing inspector settings, undo and redo, previewing through the real renderer, saving drafts, publishing, and handling conflicts are verified or findings are documented

#### Scenario: Builder accessibility is audited
- **WHEN** Phase 13 builder accessibility checks run
- **THEN** keyboard navigation, focus visibility, drag-and-drop keyboard workflows, panel controls, alerts, publish checks, and invalid-drop feedback are verified with automated or documented manual evidence

#### Scenario: Builder preview parity is audited
- **WHEN** Phase 13 builder preview checks run
- **THEN** builder preview behavior is verified to use the real renderer path and not duplicate field rendering behavior in builder-only UI code

#### Scenario: Builder visual stability is audited
- **WHEN** Phase 13 rendered builder checks run
- **THEN** desktop and narrow viewports remain readable with no incoherent overlap for command bar, palette, canvas, inspector, workflow panels, diagnostics, and primary actions

#### Scenario: Builder public API hygiene is audited
- **WHEN** Phase 13 builder package checks run
- **THEN** public builder exports avoid leaking TanStack Query mutation/query objects, raw dnd-kit event contracts, backend-specific SDK objects, or schema mutation internals

### Requirement: Product-grade expanded palette
The React builder package SHALL expose the product-completion field catalog through a searchable, grouped palette without removing existing MVP builder behavior.

#### Scenario: MVP hardening fields are discoverable
- **WHEN** the builder palette is rendered during product-completion phases
- **THEN** text, textarea, number, email, phone, URL, radio, checkbox group, select, checkbox, switch, date, time, rating, linear scale, hidden field, and read-only/display value are discoverable where their contracts are supported

#### Scenario: Palette groups reflect creator intent
- **WHEN** the palette is inspected
- **THEN** components are grouped by creator-facing categories such as Basic, Choice, Date/Time, Survey, Contact, Content, Layout, Logic/System, Integrations, and Advanced rather than by internal package names

#### Scenario: Deferred fields are not silently enabled
- **WHEN** a field requires unspecified contracts such as repeaters, payments, upload orchestration, dynamic lookup, calculations, or signatures
- **THEN** the palette either hides it, marks it unavailable, or routes it to an explicit future/plugin path without creating unsupported schema behavior

### Requirement: Structured option editor
The React builder package SHALL provide a structured option editor for choice-like fields.

#### Scenario: Creator edits options without raw text syntax
- **WHEN** a creator edits dropdown, radio, checkbox group, multi-select, image choice, ranking, or matrix options
- **THEN** the builder provides controls to add, delete, duplicate, reorder, label, assign stable values, set defaults, disable options, and bulk paste options without requiring `label=value` text syntax

#### Scenario: Option editor uses commands
- **WHEN** a creator changes option labels, values, order, defaults, disabled state, scores, or metadata
- **THEN** the change is routed through builder commands and participates in diagnostics, undo, redo, and publish warnings

#### Scenario: Option editor warns about contract changes
- **WHEN** an option submitted value or choice field value shape changes compared with published revision context
- **THEN** the editor surfaces dangerous-change context before publish

### Requirement: Product-grade inspector surfaces
The React builder package SHALL provide field-specific inspector surfaces for product-grade authoring.

#### Scenario: Inspector exposes product tabs
- **WHEN** a creator selects a node with supported settings
- **THEN** the inspector exposes Content, Choices, Validation, Logic, Appearance, Data, Accessibility, and Advanced surfaces as appropriate for the node

#### Scenario: Inspector replaces raw JSON for common logic
- **WHEN** a creator configures common show/hide or requiredness logic
- **THEN** the builder provides visual condition controls that write declarative condition data rather than requiring raw JSON entry

#### Scenario: Inspector keeps developer details available but scoped
- **WHEN** submitted paths, generated ids, custom extension keys, JSON-like diagnostics, backend mappings, or migration metadata are shown
- **THEN** the builder presents them as technical or advanced values and preserves LTR readability inside RTL layouts

### Requirement: Product-grade builder actions
The React builder package SHALL use accessible icon buttons, labels, and tooltips for common command actions.

#### Scenario: Quick actions are accessible and recognizable
- **WHEN** canvas nodes, command bars, option rows, or inspector rows expose actions such as add, move, duplicate, delete, collapse, expand, undo, redo, preview, publish, settings, or search
- **THEN** the controls use recognizable icons or icon-plus-label affordances with accessible names and tooltips rather than ambiguous abbreviations such as `Up`, `Dn`, or `Cp`

#### Scenario: Directional actions mirror correctly
- **WHEN** the builder is rendered in RTL
- **THEN** directional icons and movement affordances mirror visually where appropriate while preserving logical schema order and technical value direction

### Requirement: Content and layout authoring blocks
The React builder package SHALL support authoring content and layout blocks once their renderer/schema contracts are available.

#### Scenario: Content blocks are authored as schema nodes
- **WHEN** heading, paragraph, image, divider, spacer, section, page/step, welcome screen, ending screen, or progress display blocks are added
- **THEN** the builder creates JSON-serializable canonical nodes and routes edits through commands

#### Scenario: Content block accessibility is enforced
- **WHEN** a content block needs accessible text such as an image alt value, heading text, or ending title
- **THEN** the builder surfaces diagnostics when the required accessible content is missing

### Requirement: Expanded MVP-hardening palette implementation
The React builder package SHALL expose supported MVP-hardening field types in the component palette.

#### Scenario: Supported fields are visible in palette
- **WHEN** the builder palette is rendered
- **THEN** URL, checkbox group, switch, time, rating, linear scale, hidden field, read-only/display value, and file metadata entries are available when their current contracts are supported

#### Scenario: Palette insertion remains command-backed
- **WHEN** a creator adds any expanded palette field
- **THEN** the builder creates a JSON-serializable canonical node through the existing command/store path and selects the inserted node

### Requirement: Structured option editor implementation
The React builder package SHALL replace raw textarea option editing with structured controls for supported choice fields.

#### Scenario: Options are edited as rows
- **WHEN** a creator selects a select, radio, or checkbox group field
- **THEN** the inspector shows option rows with editable label, submitted value, disabled state, default control, duplicate, delete, and move controls

#### Scenario: Creator can add and bulk paste options
- **WHEN** a creator adds a single option or bulk pastes multiple option labels
- **THEN** the builder creates structured option records with stable submitted values and unique ids

#### Scenario: Option changes use diagnostics
- **WHEN** a creator changes an option submitted value or deletes an option
- **THEN** the edit is routed through `updateOptions` and dangerous option diagnostics remain visible when emitted by commands

### Requirement: Option editor verification
The project SHALL verify expanded palette and structured option editing before Phase 15 is considered complete.

#### Scenario: Builder tests cover structured options
- **WHEN** builder tests run
- **THEN** they cover adding, duplicating, deleting, reordering, disabling, defaulting, bulk pasting, and editing stable option values

#### Scenario: Browser flow covers real dropdown authoring
- **WHEN** Playwright runs for the builder
- **THEN** it verifies that a creator can create a dropdown with multiple options through structured controls and preview it through the real renderer

### Requirement: Visual validation controls

The React builder inspector SHALL provide field-aware visual controls for common validation rules instead of requiring creators to edit validation JSON for MVP field behavior.

#### Scenario: Creator configures common validation visually
- **WHEN** a creator selects a supported field and opens the validation inspector panel
- **THEN** the builder exposes relevant controls for required, min/max length, min/max number, pattern, email, URL, or min/max selected rules according to the field type
- **AND** validation changes are persisted through builder commands
- **AND** requiredness changes continue to surface dangerous-change diagnostics where applicable

### Requirement: Visual logic builder foundation

The React builder inspector SHALL provide safe visual controls for common visibility and conditional requiredness logic using the declarative condition model.

#### Scenario: Creator configures visibility without JSON
- **WHEN** a creator opens the logic inspector panel for a selected field
- **THEN** the builder exposes show/hide behavior controls and AND/OR condition row controls
- **AND** saving the visual rule writes a canonical declarative condition expression
- **AND** no executable JavaScript, React components, or backend-specific behavior is persisted

#### Scenario: Creator configures conditional requiredness without JSON
- **WHEN** a creator configures conditional requiredness for a selected field
- **THEN** the builder stores the condition on a required validation rule using `when`
- **AND** plain requiredness and conditional requiredness are distinguishable in the UI

#### Scenario: Unsupported logic is explicit
- **WHEN** a creator selects an unsupported logic action or the selected field has an unsupported existing condition shape
- **THEN** the builder surfaces a visible diagnostic
- **AND** it does not silently persist unsupported behavior as if it were supported visual logic

#### Scenario: Advanced condition JSON is debug-only
- **WHEN** a creator inspects advanced condition output
- **THEN** the builder shows a read-only JSON representation of the generated canonical condition
- **AND** common Phase 16 logic authoring does not require typing JSON

#### Scenario: Hidden value semantics are visible
- **WHEN** a creator selects a hidden field or reviews logic-related data behavior
- **THEN** the inspector explains whether hidden values are excluded or preserved according to the current schema settings

### Requirement: Persian builder localization

The React builder SHALL support Persian user-facing workspace strings while preserving LTR rendering for technical values.

#### Scenario: Persian builder strings render in RTL mode
- **WHEN** the builder locale is Persian and direction is RTL
- **THEN** primary workspace labels, commands, tabs, empty states, validation labels, and logic labels render Persian strings
- **AND** submitted paths, node ids, revision ids, JSON, URLs, and option submitted values remain LTR

#### Scenario: Host overrides builder strings
- **WHEN** a host provides builder message overrides
- **THEN** those strings override the default locale dictionary without changing persisted schema data

### Requirement: Phase 18 Content And Layout Authoring

The React builder SHALL support content and layout authoring blocks as first-class canvas nodes.

#### Scenario: Palette creates content and layout nodes
- **WHEN** a creator adds heading, paragraph, image, divider, spacer, section, page/step, welcome screen, or ending screen blocks
- **THEN** the builder creates JSON-serializable canonical nodes through command-backed schema edits

#### Scenario: Inspector adapts to non-submittable nodes
- **WHEN** a creator selects a content, section, step, or ending node
- **THEN** the inspector exposes relevant content/accessibility settings
- **AND** it does not expose submitted-path editing for non-submittable nodes

### Requirement: Phase 19 Builder Preview Parity Examples

The builder example SHALL prove that realistic templates preview through the real renderer.

#### Scenario: Production template preview matches renderer behavior
- **WHEN** a creator previews a realistic schema containing content blocks, choices, and logic
- **THEN** preview mode renders the same respondent controls and conditional behavior as the public renderer path
