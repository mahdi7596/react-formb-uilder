## ADDED Requirements

### Requirement: Phase 18 Content And Layout Node Contracts

The canonical schema SHALL support JSON-serializable content and layout nodes that do not create submitted data.

#### Scenario: Content nodes remain non-submittable
- **WHEN** a schema contains heading, paragraph, image, divider, spacer, or welcome content nodes
- **THEN** schema analysis accepts supported node contracts
- **AND** those nodes are not indexed as submitted fields

#### Scenario: Accessible content diagnostics are emitted
- **WHEN** an image, heading, welcome screen, or ending screen is missing required readable text
- **THEN** schema analysis emits an accessibility diagnostic for that node

