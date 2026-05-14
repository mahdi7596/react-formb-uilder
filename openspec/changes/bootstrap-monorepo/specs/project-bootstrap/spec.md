## ADDED Requirements

### Requirement: Git repository initialization

The project SHALL be initialized as a local git repository connected to the owner-provided GitHub remote.

#### Scenario: Local repository is initialized

- **WHEN** Phase 0 setup is complete
- **THEN** the workspace contains git metadata and `git status` can run from the project root

#### Scenario: Remote origin is configured

- **WHEN** Phase 0 setup is complete
- **THEN** the `origin` remote points to `https://github.com/mahdi7596/react-formb-uilder.git`

### Requirement: Package-first workspace scaffold

The project SHALL use a pnpm workspace monorepo with package folders matching the approved React form-builder architecture.

#### Scenario: Workspace file exists

- **WHEN** Phase 0 setup is complete
- **THEN** the project root contains `pnpm-workspace.yaml`

#### Scenario: MVP package boundaries exist

- **WHEN** Phase 0 setup is complete
- **THEN** the project contains package directories for `core`, `react-renderer`, `react-builder`, `validators`, `adapters`, and `themes`

#### Scenario: Example directory exists

- **WHEN** Phase 0 setup is complete
- **THEN** the project contains `examples/vite-react`

### Requirement: Root development scripts

The project SHALL expose root package scripts for repeatable development and verification.

#### Scenario: Required root scripts exist

- **WHEN** Phase 0 setup is complete
- **THEN** the root `package.json` defines scripts for `build`, `test`, `lint`, `typecheck`, `format`, and `clean`

#### Scenario: Verification scripts run

- **WHEN** dependencies are installed after Phase 0 setup
- **THEN** `pnpm typecheck`, `pnpm test`, and `pnpm build` complete successfully

### Requirement: Framework-agnostic core boundary

The project SHALL prevent the core package from depending on React or other UI/runtime integration libraries.

#### Scenario: Core package dependency boundary

- **WHEN** Phase 0 setup is complete
- **THEN** `packages/core/package.json` does not list React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, upload providers, or transport clients as dependencies

### Requirement: Baseline TypeScript and test configuration

The project SHALL include baseline TypeScript and test configuration that can be shared by packages.

#### Scenario: TypeScript base config exists

- **WHEN** Phase 0 setup is complete
- **THEN** the project root contains a base TypeScript configuration for package configs to extend

#### Scenario: Vitest config exists

- **WHEN** Phase 0 setup is complete
- **THEN** the project root contains Vitest configuration or root test configuration that package test scripts can use

### Requirement: Package boundary documentation

Each placeholder package SHALL document its responsibility and dependency boundary before product behavior is implemented.

#### Scenario: Package README files exist

- **WHEN** Phase 0 setup is complete
- **THEN** each Phase 0 package directory contains a README describing its responsibility and forbidden dependencies

### Requirement: Phase workflow documentation

The project SHALL document the phase gate workflow used for development.

#### Scenario: Workflow document exists

- **WHEN** Phase 0 setup is complete
- **THEN** `docs/development/phase-workflow.md` explains verification, phase reports, owner review, and approval before moving to the next phase

### Requirement: Phase completion report

Phase 0 SHALL produce a report describing exactly what changed and how it was verified.

#### Scenario: Phase report exists

- **WHEN** Phase 0 is complete
- **THEN** `docs/reports/2026-05-14-phase-0-project-setup.md` lists changed files, decisions, commands run, results, limitations, and owner review checklist

### Requirement: No product behavior in bootstrap

The bootstrap change SHALL NOT implement form schema, runtime validation, renderer, builder, adapter, JSON Schema compiler, upload, or UI behavior.

#### Scenario: Source package placeholders remain behavior-free

- **WHEN** Phase 0 setup is complete
- **THEN** package source files contain only placeholders or exports needed for build verification and no form-builder product logic
