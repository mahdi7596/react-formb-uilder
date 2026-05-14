# Phase Workflow

Development proceeds one reviewed phase at a time.

## Phase Rules

1. Read `AGENTS.md`, the architecture documents, active OpenSpec change artifacts, and the current phase plan before making changes.
2. Implement only the approved phase scope.
3. Keep changes minimal and aligned with package boundaries.
4. Run the verification commands required by the phase.
5. Write a phase report under `docs/reports/`.
6. Stop for owner review before starting the next phase.

## Phase Report Requirements

Each phase report must include:

- Phase name and date.
- Summary of what changed.
- Files created or modified.
- Public contracts introduced or changed.
- Decisions made and why.
- Tests run, exact commands, and results.
- Known limitations and deferred work.
- Screenshots or browser notes for UI phases.
- Owner review checklist.

## Owner Review Gate

A phase is not complete until the owner reviews the report and either approves moving forward or requests changes. Follow-up corrections remain part of the current phase unless the owner explicitly changes scope.

## Phase 0 Note

Phase 0 is a bootstrap phase only. It creates repository, workspace, package, documentation, and verification scaffolding. It does not implement form schema, runtime validation, renderer, builder, adapter, JSON Schema compiler, upload, or UI behavior.
