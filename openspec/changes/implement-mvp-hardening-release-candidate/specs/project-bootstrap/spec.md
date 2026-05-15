## ADDED Requirements

### Requirement: Release-candidate workspace verification
The project bootstrap verification flow SHALL prove the workspace can be installed, tested, typechecked, built, and validated as an MVP release candidate.

#### Scenario: Root verification passes
- **WHEN** Phase 13 release-candidate verification is run
- **THEN** `pnpm test`, `pnpm typecheck`, `pnpm build`, and `openspec validate --all --strict` pass or any failure is classified in the Phase 13 report

#### Scenario: Package scripts remain aligned
- **WHEN** package-level scripts are audited during Phase 13
- **THEN** each active package exposes verification scripts consistent with the root workspace flow or has a documented reason for omission

#### Scenario: Release-candidate docs are discoverable
- **WHEN** the root onboarding documentation is inspected after Phase 13
- **THEN** it links to the MVP release notes or Phase 13 report so a future developer can find release-candidate status and known limitations

### Requirement: Release-candidate package boundary audit
The workspace SHALL include a release-candidate audit of package exports, dependency declarations, and implementation-library boundaries.

#### Scenario: Core boundary is audited
- **WHEN** Phase 13 package-boundary checks run
- **THEN** `packages/core` is verified to avoid React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, upload providers, design-system components, CSS assets, and transport clients

#### Scenario: Public exports are audited
- **WHEN** Phase 13 package export checks run
- **THEN** public package entrypoints are inspected for broad accidental exports, missing type exports, and leaked implementation-library types

#### Scenario: Dependency placement is audited
- **WHEN** Phase 13 dependency checks run
- **THEN** React-only dependencies are confined to React packages or examples, builder-only drag dependencies are confined to builder surfaces, and backend-friendly compiler dependencies stay outside `packages/core`
