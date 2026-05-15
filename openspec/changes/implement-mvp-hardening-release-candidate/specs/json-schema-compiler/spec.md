## ADDED Requirements

### Requirement: JSON Schema compiler release-candidate audit
The JSON Schema compiler and generated artifact bundle SHALL be audited for MVP release-candidate readiness.

#### Scenario: Generated artifacts are audited
- **WHEN** Phase 13 JSON Schema checks run
- **THEN** generated Draft 2020-12 artifacts, validation plan entries, condition dependency metadata, compiler diagnostics, and backend-friendly response fixtures are verified against current fixtures and documentation

#### Scenario: Unsupported behavior diagnostics are audited
- **WHEN** Phase 13 compiler diagnostics checks run
- **THEN** unsupported or backend-unrepresentable behavior such as custom validators without backend parity, unsupported predicates, condition-only UI behavior, and hidden-value policy caveats produce diagnostics that publish checks can classify

#### Scenario: Compiler package boundary is audited
- **WHEN** Phase 13 compiler package checks run
- **THEN** JSON Schema compiler behavior remains in `packages/validators` or documented compiler surfaces and does not introduce AJV, Zod, or backend-friendly compiler dependencies into `packages/core`
