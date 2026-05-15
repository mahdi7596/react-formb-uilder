## ADDED Requirements

### Requirement: Root README onboarding contract
The project bootstrap documentation SHALL include a root README that acts as the stable entry point for developers and agents.

#### Scenario: Root README exists
- **WHEN** Phase 12 is complete
- **THEN** the repository root contains `README.md` with product positioning, current status, package map, setup commands, verification commands, example app commands, and documentation links

#### Scenario: README respects package boundaries
- **WHEN** the root README describes the package map
- **THEN** it states that `packages/core` is framework-agnostic, React behavior lives in React packages, backend integration uses adapters, JSON Schema generation is optional, and themes are removable

#### Scenario: README documents phase workflow
- **WHEN** the root README describes development workflow
- **THEN** it links to `docs/development/phase-workflow.md` and explains that phases require tests, reports, owner review, and commits

### Requirement: Package README refresh
Package README files SHALL reflect implemented package responsibilities and boundaries instead of stale placeholder status.

#### Scenario: Core README describes implemented behavior
- **WHEN** `packages/core/README.md` is inspected after Phase 12
- **THEN** it describes current schema, paths, safety, validation, conditions, submissions, responses, migrations, diagnostics, and fixture exports without claiming the package is a Phase 0 placeholder

#### Scenario: Package READMEs link outward
- **WHEN** package README files are inspected after Phase 12
- **THEN** they link to relevant integration, schema, safety, accessibility, backend, or migration docs where deeper guidance exists
