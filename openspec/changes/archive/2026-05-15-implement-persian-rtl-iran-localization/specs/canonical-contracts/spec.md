## ADDED Requirements

### Requirement: Iran regional validation boundaries

Regional Iran behavior SHALL be implemented through validators, presets, datasets, adapters, or plugins rather than hard-coded country-specific behavior inside core.

#### Scenario: Iran validators use registered keys
- **WHEN** Iran mobile, national ID, postal code, Persian digit normalization, or province/city consistency is needed
- **THEN** packages outside core provide registered validators or presets by key
- **AND** unknown regional validators still fail closed through the existing extension contract

#### Scenario: Province/city is adapter-backed or preset-owned
- **WHEN** a creator needs Iran province/city selection
- **THEN** the product uses a composed preset or adapter-backed dynamic option source
- **AND** core does not embed a hard-coded province/city dataset
