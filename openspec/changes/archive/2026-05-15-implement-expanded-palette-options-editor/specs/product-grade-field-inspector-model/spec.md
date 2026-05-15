## ADDED Requirements

### Requirement: Phase 15 MVP-hardening implementation slice
The product SHALL implement the Phase 15 slice of the product-grade field and inspector model without implementing deferred advanced features.

#### Scenario: Phase 15 scope is limited
- **WHEN** Phase 15 implementation is complete
- **THEN** expanded palette entries and structured options editor behavior are implemented while visual logic builder, Persian UI, content/layout blocks, payments, repeaters, dynamic options, and calculations remain deferred

#### Scenario: Structured option model is partially implemented
- **WHEN** select, radio, or checkbox group options are edited in the builder
- **THEN** the creator can manage labels, stable submitted values, disabled state, default state where supported, row order, duplication, deletion, single-option add, and bulk paste through structured controls

