## ADDED Requirements

### Requirement: Canonical contract release-candidate safety audit
Canonical schema, path, validation, condition, extension, submission, and backend response contracts SHALL be audited for release-candidate safety.

#### Scenario: Dangerous keys are audited
- **WHEN** Phase 13 safety checks run
- **THEN** dangerous keys such as `__proto__`, `constructor`, and `prototype` are verified as rejected in schemas, defaults, props, metadata, submitted paths, submissions, and backend responses where the current contracts require rejection

#### Scenario: Executable content exclusion is audited
- **WHEN** Phase 13 schema safety checks run
- **THEN** schemas are verified to reject or diagnose executable JavaScript, React components, DOM objects, backend SDK objects, transport objects, and unsupported rich text behavior

#### Scenario: Hidden value and normalization behavior is audited
- **WHEN** Phase 13 submission checks run
- **THEN** hidden-field value semantics, submitted path normalization, duplicate path handling, invalid path diagnostics, and normalized submission envelopes are verified against current contracts

#### Scenario: Extension fail-closed behavior is audited
- **WHEN** Phase 13 extension checks run
- **THEN** unknown custom fields, validators, and predicates fail closed with diagnostics rather than silently submitting, validating, or evaluating unsupported behavior

#### Scenario: Condition dependency behavior is audited
- **WHEN** Phase 13 condition checks run
- **THEN** deterministic condition evaluation, dependency tracking, invalid references, and cycle diagnostics are verified against current contracts
