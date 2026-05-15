## ADDED Requirements

### Requirement: Schema and submission safety documentation
The project SHALL document operational safety rules for canonical schemas, submitted paths, dangerous keys, normalized submissions, hidden values, extension registration, and backend responses.

#### Scenario: Safety doc exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/security/schema-and-submission-safety.md` documents dangerous-key rejection, submitted path grammar, hidden-value semantics, normalized submission envelopes, backend response parsing, and extension fail-closed behavior

#### Scenario: Safety doc identifies forbidden persisted behavior
- **WHEN** the safety doc is inspected
- **THEN** it states that persisted schemas must not store executable JavaScript, React components, backend SDK objects, DOM objects, or transport-specific behavior

#### Scenario: Safety doc links canonical references
- **WHEN** the safety doc is inspected
- **THEN** it links to canonical schema, submitted path grammar, submission envelope, backend response, validation rules, conditions, hidden-value semantics, and extension registration docs

### Requirement: Extension safety documentation
Extension documentation SHALL explain how custom fields, validators, and predicates are registered without weakening canonical schema safety.

#### Scenario: Unknown extensions fail closed
- **WHEN** extension docs are inspected
- **THEN** they state that unknown custom fields, validators, and predicates must fail closed with diagnostics rather than silently submitting or evaluating unsupported behavior

#### Scenario: Backend parity is explicit
- **WHEN** extension docs are inspected
- **THEN** they explain when custom validators or predicates need backend parity and how missing parity should appear in diagnostics or generated artifact review
