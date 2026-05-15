## ADDED Requirements

### Requirement: Phase 19 Renderer Example Coverage

The renderer examples SHALL demonstrate production-style respondent forms through canonical schemas.

#### Scenario: Renderer-only embed is available
- **WHEN** the example app is switched to renderer-only mode
- **THEN** the public form renders and submits without requiring the builder surface

#### Scenario: Persian RTL template preserves contracts
- **WHEN** the Persian intake template is submitted
- **THEN** Persian labels and RTL layout are displayed while submitted paths and option values remain stable backend contract values

