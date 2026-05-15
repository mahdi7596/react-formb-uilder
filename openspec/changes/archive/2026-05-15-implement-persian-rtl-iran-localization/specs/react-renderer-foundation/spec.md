## ADDED Requirements

### Requirement: Persian renderer localization

The React renderer SHALL support Persian runtime strings and RTL layout without changing canonical schema contracts.

#### Scenario: Persian renderer runtime strings render
- **WHEN** a schema locale starts with `fa` or the renderer receives Persian locale
- **THEN** submit, previous, next, success, and validation messages use Persian defaults unless host overrides are provided
- **AND** form direction follows schema or host direction while technical values stay LTR where applicable
