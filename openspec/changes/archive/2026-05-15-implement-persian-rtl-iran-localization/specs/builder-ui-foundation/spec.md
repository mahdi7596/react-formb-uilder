## ADDED Requirements

### Requirement: Persian builder localization

The React builder SHALL support Persian user-facing workspace strings while preserving LTR rendering for technical values.

#### Scenario: Persian builder strings render in RTL mode
- **WHEN** the builder locale is Persian and direction is RTL
- **THEN** primary workspace labels, commands, tabs, empty states, validation labels, and logic labels render Persian strings
- **AND** submitted paths, node ids, revision ids, JSON, URLs, and option submitted values remain LTR

#### Scenario: Host overrides builder strings
- **WHEN** a host provides builder message overrides
- **THEN** those strings override the default locale dictionary without changing persisted schema data
