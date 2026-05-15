## ADDED Requirements

### Requirement: Renderer theme package integration
The React renderer package SHALL align its optional default styling with the themes package while preserving product-owned renderer APIs, slots, class hooks, and data attributes.

#### Scenario: Renderer styles compose theme output
- **WHEN** renderer default styles are generated or rendered
- **THEN** they consume or align with `@your-org/forms-themes` default variables and avoid duplicating token values that belong to the theme package

#### Scenario: Renderer host hooks remain stable
- **WHEN** host CSS targets renderer class hooks, data attributes, or CSS variables
- **THEN** Phase 11 theme integration preserves hooks for form, field, label, description, error, section, step, messages, navigation, and submit controls

#### Scenario: Renderer slots still replace default chrome
- **WHEN** a host replaces renderer slots while default theme CSS is available
- **THEN** core renderer behavior, validation, submission, hidden-field semantics, and accessibility wiring do not depend on the default theme markup

### Requirement: Renderer visual verification under default theme
The React renderer package SHALL verify that its default themed output remains usable across desktop, narrow, LTR, RTL, focus, error, and reduced-motion contexts.

#### Scenario: Themed renderer states are visible
- **WHEN** themed renderer fields show required, disabled, invalid, server-error, current-step, or submission-status states
- **THEN** the states are visibly distinguishable and do not rely only on color

#### Scenario: Themed renderer direction support is verified
- **WHEN** LTR and RTL example forms are rendered with the default theme
- **THEN** labels, descriptions, errors, controls, step navigation, submitted paths, and debug JSON remain readable with correct direction handling

#### Scenario: Renderer focus and motion states are verified
- **WHEN** keyboard focus and reduced-motion preferences are checked on themed renderer controls
- **THEN** focus remains visible and nonessential transitions are reduced or removed according to the default theme
