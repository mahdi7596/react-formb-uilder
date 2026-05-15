## ADDED Requirements

### Requirement: Builder integration documentation
The React builder package SHALL have integration documentation that explains how host admin apps embed the builder and connect persistence, publish, preview, generated artifacts, theme hooks, and recovery states.

#### Scenario: Builder guide shows first embed path
- **WHEN** `docs/integration/react-builder.md` is inspected
- **THEN** it shows the current `BuilderWorkspace` usage path with schema input, persistence state, publish checklist, generated artifact bundle, revision metadata, and callbacks

#### Scenario: Builder guide explains command boundaries
- **WHEN** the builder integration guide is inspected
- **THEN** it explains that schema edits flow through commands/store behavior and UI components must not mutate canonical schema behavior directly

#### Scenario: Builder guide explains UI customization
- **WHEN** the builder integration guide is inspected
- **THEN** it documents stable class hooks, data attributes, theme variables, renderer preview parity, RTL/LTR considerations, and host styling boundaries

#### Scenario: Builder guide explains creator workflow states
- **WHEN** the builder integration guide is inspected
- **THEN** it explains save, dirty, saved, failed, conflict, publish-blocked, publish-success, generated artifact, and revision warning states at a host integration level
