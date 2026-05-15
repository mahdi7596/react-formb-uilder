## MODIFIED Requirements

### Requirement: Renderer test and report coverage
The project SHALL verify the renderer foundation through package tests, workspace checks, and a browser-runnable example before builder implementation begins.

#### Scenario: Renderer package tests pass
- **WHEN** `pnpm --filter @your-org/forms-react-renderer test` runs
- **THEN** React renderer tests for field rendering, accessibility wiring, conditions, validation, steps, backend errors, and submission envelope creation pass

#### Scenario: Workspace typecheck passes
- **WHEN** Phase 5 is complete
- **THEN** `pnpm typecheck` passes and `packages/core` still has no dependency on React or renderer code

#### Scenario: Phase report exists
- **WHEN** Phase 5 is complete
- **THEN** `docs/reports/2026-05-14-phase-5-react-renderer.md` summarizes changed files, renderer APIs, field contract behavior, tests run, accessibility coverage, known limitations, dependency boundary check, and owner review checklist

#### Scenario: Browser example proves renderer behavior
- **WHEN** Phase 6 is complete
- **THEN** a Vite React example renders published schemas through the real renderer and passes browser E2E checks for respondent behavior before builder phases begin
