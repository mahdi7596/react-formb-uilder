## ADDED Requirements

### Requirement: Phase 18 Content And Layout Authoring

The React builder SHALL support content and layout authoring blocks as first-class canvas nodes.

#### Scenario: Palette creates content and layout nodes
- **WHEN** a creator adds heading, paragraph, image, divider, spacer, section, page/step, welcome screen, or ending screen blocks
- **THEN** the builder creates JSON-serializable canonical nodes through command-backed schema edits

#### Scenario: Inspector adapts to non-submittable nodes
- **WHEN** a creator selects a content, section, step, or ending node
- **THEN** the inspector exposes relevant content/accessibility settings
- **AND** it does not expose submitted-path editing for non-submittable nodes

