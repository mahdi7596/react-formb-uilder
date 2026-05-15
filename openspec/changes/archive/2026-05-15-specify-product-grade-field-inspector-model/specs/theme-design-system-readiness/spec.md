## ADDED Requirements

### Requirement: Optional Persian typography assets
The themes package SHALL support optional Persian/RTL typography assets without requiring hosts or core contracts to use a specific font.

#### Scenario: IranYekan assets remain theme-owned
- **WHEN** IranYekan font files are included in the repository
- **THEN** they live under `packages/themes/assets/fonts/iranyekan/` or another theme-owned asset path rather than the repository root or `packages/core`

#### Scenario: Font-face helper is optional
- **WHEN** the themes package exposes IranYekan or Persian font CSS helpers
- **THEN** hosts can opt into those helpers without changing canonical schema behavior, renderer semantics, validation, or backend contracts

### Requirement: Product-grade RTL theme behavior
The default theme SHALL support product-grade RTL and LTR behavior for builder and renderer surfaces.

#### Scenario: Direction-aware theme styles preserve readability
- **WHEN** builder or renderer surfaces are displayed in RTL with Persian text
- **THEN** layout, spacing, icons, focus states, option rows, inspector controls, validation messages, and field chrome remain readable and avoid incoherent overlap

#### Scenario: Technical values stay LTR
- **WHEN** submitted paths, option values, schema ids, revision ids, URLs, email addresses, code, or JSON-like artifacts appear inside RTL screens
- **THEN** theme styles provide hooks for those values to remain LTR and readable

