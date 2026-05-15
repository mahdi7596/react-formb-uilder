## ADDED Requirements

### Requirement: Themes package exits placeholder status
The themes package SHALL become an implemented optional package for starter tokens and theme CSS while preserving package-first workspace boundaries.

#### Scenario: Themes package has product exports
- **WHEN** Phase 11 is complete
- **THEN** `packages/themes/src/index.ts` exports real theme tokens, CSS variable helpers, default CSS helpers, and package boundary metadata rather than only a bootstrap placeholder

#### Scenario: Themes package has verification scripts
- **WHEN** Phase 11 is complete
- **THEN** `packages/themes/package.json` exposes test, typecheck, and build scripts consistent with the workspace verification flow

#### Scenario: Core remains independent from themes
- **WHEN** Phase 11 is complete
- **THEN** `packages/core/package.json` does not depend on `@your-org/forms-themes`, CSS assets, React, design-system packages, or UI styling libraries
