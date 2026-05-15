## ADDED Requirements

### Requirement: Phase 15 expanded palette fields SHALL have real renderer parity

The React renderer SHALL provide minimal respondent runtime rendering for the basic field types newly exposed by the Phase 15 builder palette so the builder preview remains backed by the real renderer.

#### Scenario: Newly exposed basic fields render in respondent runtime
- **WHEN** a form contains URL, time, checkbox group, switch, rating, linear scale, or read-only/display-value fields
- **THEN** the React renderer renders an accessible field control for each supported field type
- **AND** choice-like fields preserve labels, submitted values, disabled option state, and default values where the current schema supports them
- **AND** read-only/display-value fields do not allow respondent editing

#### Scenario: Builder preview uses the real renderer for expanded fields
- **WHEN** a creator inserts newly exposed Phase 15 fields into the builder
- **THEN** preview mode renders those fields through the React renderer registry
- **AND** the builder does not introduce a separate duplicated preview implementation for those field types
