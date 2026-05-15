## ADDED Requirements

### Requirement: Adapter-Backed Dynamic Options

Dynamic options SHALL load through explicit host adapter contracts and SHALL preserve stable submitted values.

#### Scenario: Dynamic option loading is recoverable
- **WHEN** an option source fails to load
- **THEN** the renderer displays an accessible error and retry control
- **AND** it does not silently submit a label or stale unknown value

#### Scenario: Source dependencies are tracked
- **WHEN** an option source depends on another field value
- **THEN** the dependency is declared in schema, tracked by runtime, and invalidates stale selections when configured

#### Scenario: Backend validates dynamic values
- **WHEN** a submission contains a value from a dynamic source
- **THEN** the backend can validate it against the source key, version, and submitted value snapshot

