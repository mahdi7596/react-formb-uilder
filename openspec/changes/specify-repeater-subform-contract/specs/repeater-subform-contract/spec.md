## ADDED Requirements

### Requirement: One-Level Repeater Contract

Repeaters SHALL be specified as canonical array containers before renderer or builder implementation.

#### Scenario: Nested repeaters fail closed
- **WHEN** a repeater contains another repeater
- **THEN** schema analysis emits an unsupported behavior error
- **AND** publish is blocked

#### Scenario: Repeater item errors map predictably
- **WHEN** the backend returns an error for `items[1].name`
- **THEN** the renderer maps the error to the second repeater item's `name` field
- **AND** focus moves to that field when possible

#### Scenario: JSON Schema represents one-level repeaters
- **WHEN** a supported one-level repeater is compiled
- **THEN** JSON Schema generation emits an array with object items and child field properties

