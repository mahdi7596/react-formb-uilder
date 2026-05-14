## Context

The project currently contains architecture, research, design guidance, OpenSpec configuration, and a master development plan. It does not yet contain a git repository, root package metadata, package workspaces, TypeScript configuration, test configuration, source package folders, or repeatable verification commands.

Phase 0 must create a foundation for later work while preserving the architecture decisions already recorded in `AGENTS.md`, `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`, `docs/architecture/2026-05-14-react-technical-architecture-decisions.md`, and `DESIGN.md`.

The owner has created the GitHub repository at `https://github.com/mahdi7596/react-formb-uilder.git`. The URL is reachable and currently behaves like an empty repository, making it suitable for the initial push after local setup.

## Goals / Non-Goals

**Goals:**

- Initialize this workspace as the local git repository for the GitHub remote.
- Establish a pnpm TypeScript monorepo that matches the package-first architecture.
- Create placeholder package boundaries without implementing product behavior.
- Add root scripts that future phases can use consistently.
- Add baseline verification tooling for typecheck, tests, build, lint, and formatting.
- Add documentation that explains the phase workflow and owner approval gate.
- Produce a Phase 0 report that records exactly what was created and what verification was run.

**Non-Goals:**

- Do not implement canonical schema contracts, path grammar, validation, conditions, submissions, renderer behavior, builder behavior, JSON Schema generation, adapters, or UI.
- Do not introduce React into `packages/core`.
- Do not introduce backend persistence or backend-specific assumptions.
- Do not create a full design system beyond preserving the existing `DESIGN.md` guidance.
- Do not publish packages to npm.

## Decisions

### Use pnpm workspaces

Use pnpm because the project is package-first, and pnpm workspaces provide strict dependency boundaries, fast installs, and a clean fit for multiple packages and examples.

Alternatives considered:

- npm workspaces: simpler default tooling, but weaker dependency strictness.
- Yarn: capable, but no existing project reason to prefer it.

### Keep Phase 0 behavior-free

Phase 0 creates folders, package metadata, scripts, config, and governance docs only. Product behavior starts in later phases after the contract specifications are approved.

This keeps setup reviewable and prevents accidental schema or React decisions before Phase 1 locks the contracts.

### Start with placeholder package names

Use placeholder package names until the owner confirms the final npm scope. The architecture documents use `@your-org/forms-*` as placeholders, and this phase should avoid pretending a publishing namespace is final.

The implementation report must clearly list the placeholder names so they can be renamed before package publication.

### Include package folders for near-term boundaries

Create the package folders needed by the MVP path:

- `packages/core`
- `packages/react-renderer`
- `packages/react-builder`
- `packages/validators`
- `packages/adapters`
- `packages/themes`

Do not create `uploads` or `devtools` packages in Phase 0 unless the owner requests them, because upload orchestration and devtools are explicitly deferred until contracts stabilize.

### Make verification commands work immediately

Even with placeholder packages, root commands must run successfully:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

If linting and formatting are added, their commands must also run. Placeholder packages can use minimal no-op source files or package-local scripts, but they must not contain product behavior.

### Document the phase gate as project process

Add `docs/development/phase-workflow.md` so future agents understand that each phase ends with verification, a report, and owner approval before moving forward.

## Risks / Trade-offs

- Final npm package scope is not confirmed → Use placeholders and document the rename point in the Phase 0 report.
- The GitHub repository name appears to be `react-formb-uilder`, which may be a typo → Use the owner-provided URL for Phase 0 and record it in the report.
- Adding too much tooling early can slow iteration → Keep tooling conventional and minimal.
- Placeholder packages can create a false sense of product progress → Keep README files explicit that no runtime behavior exists yet.
- Network or package installation may fail during verification → Record the exact failure in the report and do not mark Phase 0 complete until install and verification succeed or the owner approves an alternative.

## Migration Plan

1. Initialize git in the existing workspace.
2. Add the owner-provided GitHub remote.
3. Add monorepo configuration and placeholder package folders.
4. Run install and verification commands.
5. Write the Phase 0 report.
6. Commit the Phase 0 artifacts.
7. Push the initial branch to the remote after owner approval or as part of the approved implementation flow.

Rollback is simple because no product behavior or data migration is introduced. If the scaffold is rejected, remove or revise the scaffold files before any later phases depend on them.

## Open Questions

- Should package placeholders use `@your-org/forms-*`, `@react-formbuilder/forms-*`, or another owner-approved npm scope?
- Should Phase 0 include ESLint and Prettier immediately, or defer lint/format tooling until the first source code phase?
- Should the initial branch be named `main`?
