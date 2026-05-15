## ADDED Requirements

### Requirement: Declarative Calculation Expressions

Calculations SHALL use a JSON-serializable expression language and SHALL NOT persist executable JavaScript.

#### Scenario: Unknown calculation operator fails closed
- **WHEN** a schema contains a calculation expression with an unknown operator
- **THEN** schema analysis emits an error diagnostic
- **AND** the renderer does not submit a calculated value for that node

#### Scenario: Calculation dependencies are deterministic
- **WHEN** a calculation references fields or other calculations
- **THEN** the runtime extracts dependencies, orders evaluation deterministically, and blocks cycles before publish

#### Scenario: Rounding is explicit
- **WHEN** a calculation returns a decimal or currency-like value
- **THEN** rounding mode and scale are explicit in the canonical schema
- **AND** frontend and backend conformance fixtures produce the same result

### Requirement: Scoring Contract

Scoring SHALL be represented as declarative calculation rules over stable option values.

#### Scenario: Choice scores use stable values
- **WHEN** a score references a choice option
- **THEN** it references the option submitted value, not the localized label
- **AND** changing an option submitted value is a dangerous revision change

