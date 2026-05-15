## Purpose
Define optional starter theme tokens, CSS variable contracts, default renderer and builder theme helpers, accessibility styling, RTL/LTR styling, and verification expectations without making core behavior or host applications depend on the theme package.
## Requirements
### Requirement: Optional theme package exports
The themes package SHALL export optional starter theme tokens, CSS variable helpers, and default CSS helpers without making host applications or core behavior depend on the theme package.

#### Scenario: Themes package exposes typed tokens
- **WHEN** host or React package code imports `@your-org/forms-themes`
- **THEN** it can access typed default tokens for colors, typography, spacing, radii, shadows, motion, and supported component-level theme values

#### Scenario: Themes package exposes CSS helpers
- **WHEN** host or React package code imports `@your-org/forms-themes`
- **THEN** it can create deterministic CSS variable output and default renderer, builder, or combined theme CSS without requiring a CSS-in-JS runtime

#### Scenario: Themes remain optional
- **WHEN** a host app chooses not to import `@your-org/forms-themes`
- **THEN** renderer and builder behavior remains available through product-owned APIs, stable class hooks, data attributes, and slots

### Requirement: DESIGN token alignment
The themes package SHALL encode the provisional `DESIGN.md` token decisions as implementation-facing theme contracts.

#### Scenario: Token values match design source
- **WHEN** default theme tokens are inspected
- **THEN** key values such as primary color, accent color, surface colors, semantic states, spacing scale, radii, font stacks, and focus indicator values match `DESIGN.md`

#### Scenario: Token output is deterministic
- **WHEN** CSS variables are generated from the default theme tokens
- **THEN** the output order and variable names are stable across repeated calls so tests and host integrations can rely on them

#### Scenario: Theme documentation names the source of truth
- **WHEN** the themes README is inspected
- **THEN** it identifies `DESIGN.md` as the provisional design source and explains how token changes should be governed

### Requirement: CSS custom property contract
The theme layer SHALL expose stable CSS custom properties for host customization while avoiding collisions with host application styles.

#### Scenario: Variables use product namespace
- **WHEN** generated theme CSS is inspected
- **THEN** core variables use a product-prefixed namespace such as `--rfb-color-*`, `--rfb-font-*`, `--rfb-space-*`, `--rfb-radius-*`, `--rfb-shadow-*`, and `--rfb-motion-*`

#### Scenario: Component styles consume variables
- **WHEN** default renderer or builder theme CSS is inspected
- **THEN** colors, spacing, radii, shadows, focus styles, and motion values are expressed through theme variables rather than repeated hard-coded values

#### Scenario: Compatibility aliases are explicit
- **WHEN** existing renderer or builder package-local variables are still supported
- **THEN** they map clearly to the shared theme variables or are documented as compatibility aliases

### Requirement: Default renderer theme
The themes package SHALL provide a default renderer theme that styles public form rendering without owning renderer semantics.

#### Scenario: Renderer form surfaces are styled
- **WHEN** default renderer theme CSS is applied to a rendered form
- **THEN** form, field, label, description, error, section, step, messages, navigation, and submit controls are readable and visually consistent

#### Scenario: Renderer state hooks are styled
- **WHEN** fields or forms expose invalid, disabled, hidden, current-step, or submission-status data attributes
- **THEN** the default theme can style those states without requiring behavior-specific code in the theme package

#### Scenario: Renderer slots remain replaceable
- **WHEN** a host replaces renderer slots for field chrome, labels, descriptions, errors, navigation, messages, or submit controls
- **THEN** the theme package does not require the default slot markup to preserve core renderer behavior

### Requirement: Default builder theme
The themes package SHALL provide a default builder theme that supports the builder workspace, command bar, palette, canvas, inspector, drag states, persistence surfaces, publish checklist, revision warnings, and artifact panels.

#### Scenario: Builder workspace surfaces are styled
- **WHEN** default builder theme CSS is applied to `BuilderWorkspace`
- **THEN** the command bar, palette, canvas, inspector, workflow panels, primitives, empty states, alerts, badges, tabs, and field nodes are visually consistent with the default token set

#### Scenario: Builder state hooks are styled
- **WHEN** builder elements expose selected, dragging, drag-over, invalid-drop, disabled, error, warning, success, dirty, saved, conflict, or publish-blocking states
- **THEN** the default theme provides visible styling that does not rely on color alone

#### Scenario: Builder schema behavior stays outside theme
- **WHEN** builder theme CSS is inspected
- **THEN** it does not encode schema mutation rules, validation rules, publish rules, adapter behavior, or other domain invariants

### Requirement: RTL, LTR, and code-direction styling
The default theme SHALL support RTL-first builder layouts and LTR content inside RTL surfaces using logical CSS and explicit direction hooks.

#### Scenario: Logical CSS is used for layout-sensitive styling
- **WHEN** default theme CSS is inspected
- **THEN** spacing, borders, and placement use logical properties where practical so RTL and LTR layouts can mirror without duplicate style trees

#### Scenario: LTR technical content remains readable
- **WHEN** submitted paths, schema ids, revision ids, URLs, email addresses, code, or JSON appear inside RTL screens
- **THEN** default styles preserve LTR direction for those technical values

#### Scenario: Example covers LTR and RTL
- **WHEN** the Vite example is tested with LTR and RTL modes
- **THEN** renderer and builder surfaces remain readable and controls do not overlap or clip because of direction changes

### Requirement: Accessibility and reduced-motion theme behavior
The default theme SHALL include accessible focus, contrast, disabled, error, and reduced-motion behavior for renderer and builder surfaces.

#### Scenario: Focus visibility is theme-provided
- **WHEN** keyboard users focus renderer or builder controls
- **THEN** a visible focus indicator is present and is not color-only

#### Scenario: State contrast is acceptable
- **WHEN** default themed success, warning, danger, info, selected, disabled, and invalid states are rendered
- **THEN** foreground/background or border/text combinations are chosen for readable contrast and visible non-color cues

#### Scenario: Reduced motion is respected
- **WHEN** the user prefers reduced motion
- **THEN** nonessential transitions and animations in default theme CSS are removed or reduced

### Requirement: Theme verification
The project SHALL verify the default theme package and rendered themed examples before Phase 11 is complete.

#### Scenario: Theme package tests pass
- **WHEN** `pnpm --filter @your-org/forms-themes test`, typecheck, and build run
- **THEN** token exports, CSS variable generation, default CSS helpers, reduced-motion CSS, and boundary metadata pass verification

#### Scenario: Full workspace verification passes
- **WHEN** Phase 11 verification runs
- **THEN** `pnpm test`, `pnpm build`, and focused renderer/builder/example checks pass with the default theme integration

#### Scenario: Browser evidence is captured
- **WHEN** the Vite example is served for Phase 11 review
- **THEN** Browser-plugin or Playwright checks capture desktop and narrow viewport evidence for themed renderer/builder surfaces, LTR/RTL behavior, focus visibility, and absence of relevant console errors

#### Scenario: Phase report records theme decisions
- **WHEN** Phase 11 implementation is complete
- **THEN** `docs/reports/2026-05-15-phase-11-theme-design-system-readiness.md` summarizes changed files, token contracts, CSS helpers, UI evidence, commands run, known limitations, and owner review checklist

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

### Requirement: Optional IranYekan theme helper

The themes package SHALL expose an optional IranYekan `@font-face` CSS helper that uses package-owned font assets and does not force host applications to adopt the font.

#### Scenario: Host opts into IranYekan
- **WHEN** a host calls the IranYekan theme helper
- **THEN** the generated CSS references `packages/themes/assets/fonts/iranyekan/` asset paths
- **AND** maps the font to the RTL font token without changing core behavior

#### Scenario: Host does not opt in
- **WHEN** a host uses default theme styles without the IranYekan helper
- **THEN** the builder and renderer remain usable with the default `fontRtl` stack
