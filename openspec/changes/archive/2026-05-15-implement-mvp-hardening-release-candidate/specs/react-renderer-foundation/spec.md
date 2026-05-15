## ADDED Requirements

### Requirement: Renderer release-candidate audit
The React renderer SHALL be audited for MVP release-candidate readiness across public API shape, accessibility, RTL/LTR behavior, validation behavior, and submission behavior.

#### Scenario: Renderer accessibility is audited
- **WHEN** Phase 13 renderer checks run
- **THEN** built-in field labels, descriptions, errors, required and disabled states, first-invalid focus, validation summaries, and custom field contract examples are verified with automated or documented manual accessibility evidence

#### Scenario: Renderer RTL and LTR behavior is audited
- **WHEN** Phase 13 renderer direction checks run
- **THEN** LTR and RTL form rendering, labels, descriptions, errors, step navigation, submitted paths, and debug output remain readable and directionally correct

#### Scenario: Renderer submission flow is audited
- **WHEN** Phase 13 renderer submission checks run
- **THEN** normalized submission envelopes, hidden-field semantics, backend validation errors, global messages, and submission statuses are verified against current contracts

#### Scenario: Renderer public API hygiene is audited
- **WHEN** Phase 13 renderer package checks run
- **THEN** public renderer exports avoid leaking React Hook Form types, internal state libraries, or backend-specific transport objects
