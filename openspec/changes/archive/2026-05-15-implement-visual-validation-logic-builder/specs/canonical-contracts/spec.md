## ADDED Requirements

### Requirement: Conditional validation parity

Canonical validation runtime SHALL evaluate validation-rule `when` conditions through the deterministic condition runtime before applying the rule.

#### Scenario: Conditional requiredness applies only when true
- **WHEN** a required validation rule includes a `when` condition
- **AND** the condition evaluates to true for the current values
- **THEN** the field is validated as required
- **AND** when the condition evaluates to false, the required rule is skipped

#### Scenario: Unsupported conditional validation fails closed
- **WHEN** a validation rule `when` condition references unsupported predicates, unsupported regex behavior, invalid condition structure, or unsupported async behavior
- **THEN** validation returns diagnostics rather than silently treating the rule as safe
