## ADDED Requirements

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

