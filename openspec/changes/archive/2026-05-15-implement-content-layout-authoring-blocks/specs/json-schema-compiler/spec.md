## ADDED Requirements

### Requirement: Phase 18 Content Blocks Do Not Affect JSON Schema

The JSON Schema compiler SHALL ignore supported non-submittable content and layout nodes.

#### Scenario: Content and ending nodes do not create properties
- **WHEN** a schema includes supported content, section, step, or ending nodes
- **THEN** generated JSON Schema properties only represent submittable field and hidden nodes

