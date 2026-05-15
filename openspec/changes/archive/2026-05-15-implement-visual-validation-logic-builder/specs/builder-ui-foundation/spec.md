## ADDED Requirements

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
