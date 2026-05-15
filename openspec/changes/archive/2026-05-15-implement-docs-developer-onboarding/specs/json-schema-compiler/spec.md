## ADDED Requirements

### Requirement: JSON Schema generation documentation
The validators package SHALL have integration documentation that explains generated JSON Schema as an optional backend-friendly artifact rather than the canonical authoring model.

#### Scenario: JSON Schema guide exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/integration/json-schema-generation.md` documents Draft 2020-12 output, compiler diagnostics, validation plan entries, condition dependencies, fixture references, and backend consumption boundaries

#### Scenario: JSON Schema guide explains limitations
- **WHEN** the JSON Schema generation guide is inspected
- **THEN** it states that UI behavior, conditions, hidden-value policy, custom validators without backend parity, and publish gating may require diagnostics or backend logic beyond generated JSON Schema

#### Scenario: Existing backend JSON Schema doc is reconciled
- **WHEN** Phase 12 is complete
- **THEN** existing JSON Schema integration documentation is either updated, linked, or superseded so readers do not find conflicting compiler guidance
