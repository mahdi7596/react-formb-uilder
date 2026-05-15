## ADDED Requirements

### Requirement: Builder theme package integration
The React builder package SHALL align default builder styling with the optional themes package while preserving builder-owned behavior and host customization hooks.

#### Scenario: Builder styles compose theme output
- **WHEN** builder default styles are generated or rendered
- **THEN** they consume or align with `@your-org/forms-themes` default variables and avoid duplicating token values that belong to the theme package

#### Scenario: Builder host hooks remain stable
- **WHEN** host CSS targets builder class hooks, data attributes, ARIA states, or CSS variables
- **THEN** Phase 11 theme integration preserves those hooks for command bar, palette, canvas, inspector, workflow panels, drag states, alerts, badges, tabs, and field nodes

#### Scenario: Builder package does not require host theme adoption
- **WHEN** a host renders the builder without importing theme package helpers directly
- **THEN** builder behavior remains available and any default styling path remains package-owned rather than schema-owned

### Requirement: Builder visual verification under default theme
The React builder package SHALL verify that its default themed workspace remains usable across desktop, narrow, RTL, LTR, focus, and reduced-motion contexts.

#### Scenario: Themed builder desktop layout is stable
- **WHEN** the default themed builder is rendered at a desktop viewport
- **THEN** command bar, palette, canvas, inspector, workflow panels, and primary actions remain readable and do not overlap

#### Scenario: Themed builder narrow layout is stable
- **WHEN** the default themed builder is rendered at a narrow viewport
- **THEN** controls wrap or scroll intentionally and field labels, buttons, badges, paths, diagnostics, and drop indicators do not clip incoherently

#### Scenario: Builder focus and motion states are verified
- **WHEN** keyboard focus and reduced-motion preferences are checked on themed builder controls
- **THEN** focus remains visible and nonessential transitions are reduced or removed according to the default theme
