## ADDED Requirements

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

