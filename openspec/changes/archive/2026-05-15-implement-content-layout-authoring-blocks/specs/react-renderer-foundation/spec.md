## ADDED Requirements

### Requirement: Phase 18 Runtime Content Blocks

The React renderer SHALL render supported content and layout nodes through the same renderer path used by builder preview.

#### Scenario: Content blocks render accessibly
- **WHEN** a form contains heading, paragraph, image, divider, spacer, welcome, section, step, or ending nodes
- **THEN** the renderer outputs accessible markup for the supported node
- **AND** no submitted value is created unless the node is a field or hidden field

#### Scenario: Ending screens replace the form after success
- **WHEN** a submission succeeds and the schema contains a visible ending node
- **THEN** the renderer displays that ending node as the success screen

