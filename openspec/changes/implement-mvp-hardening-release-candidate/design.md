## Context

The workspace has completed the MVP build-out phases for contracts, core runtime behavior, JSON Schema artifacts, React renderer, builder commands/store, builder UI, drag-and-drop keyboard workflows, example e2e coverage, persistence/publish adapters, theme readiness, and developer onboarding. The current Phase 13 objective is not to add a new product surface; it is to prove that the existing package set is coherent enough to be treated as an MVP release candidate.

The release-candidate phase must respect the durable architecture decisions: `packages/core` stays framework-agnostic, JSON Schema generation remains optional and backend-friendly, React Hook Form stays hidden behind product APIs if used, TanStack Query stays out of `core`, dnd-kit stays behind builder drag abstractions, schemas remain JSON-serializable, and published revisions remain immutable.

## Goals / Non-Goals

**Goals:**
- Establish a repeatable release-candidate verification path using current pnpm scripts, package-specific tests, Playwright suites, accessibility checks, package boundary checks, and OpenSpec validation.
- Audit package exports, dependencies, broad imports, React coupling, renderer/builder accessibility, RTL/LTR behavior, security behavior, generated artifacts, adapter responses, revision immutability, and submission revision hashes.
- Fix high-priority issues found during audits when the fix is covered by existing MVP contracts and does not expand feature scope.
- Produce release notes and `docs/reports/2026-05-15-phase-13-mvp-release-candidate.md` with evidence, known limitations, commands run, defects found, fixes made, and owner review checklist.

**Non-Goals:**
- Do not add nested repeaters, built-in upload orchestration, payments, signature, matrix/ranking fields, dynamic lookup fields, arbitrary JavaScript expressions, hosted tenancy, collaboration, rich text authoring, advanced analytics, or workflow automation.
- Do not rename the package namespace away from `@your-org/*` unless the owner separately approves the publishing scope.
- Do not introduce a heavyweight design system, backend-specific persistence layer, or new external runtime dependency just to satisfy the audit.
- Do not convert audit recommendations into speculative rewrites. Fix only release-blocking or high-priority issues that are directly evidenced.

## Decisions

### Decision: Run baseline audits before fixes

Run the full verification set first, record failures, classify each finding, then fix the high-priority items. This keeps Phase 13 from becoming an unbounded improvement phase and gives the report a clear before/after trail.

Alternatives considered:
- Fix likely issues before running audits: faster if assumptions are right, but it hides the evidence trail and risks chasing non-blockers.
- Only run final verification: simpler, but weaker for release-candidate confidence.

### Decision: Treat package-boundary checks as release gates

The release candidate must verify `packages/core` has no React, RHF, TanStack Query, dnd-kit, AJV, Zod, CSS, upload-provider, design-system, or transport dependencies; React-only libraries remain in React packages; generated validators remain outside core; and public package exports do not leak implementation-library types.

Alternatives considered:
- Rely on TypeScript builds only: builds catch type failures but not architecture drift.
- Move all boundary enforcement into a future tooling package: reasonable later, but Phase 13 needs practical checks now.

### Decision: Use existing tests and focused audit scripts before adding new tooling

Use `pnpm test`, `pnpm build`, `pnpm typecheck`, package scripts, Playwright suites in `packages/react-builder` and `examples/vite-react`, practical dependency/export inspection, and existing axe-compatible tests. Add small targeted tests or scripts only when an audit gap blocks release confidence.

Alternatives considered:
- Add a full custom release toolchain immediately: higher ceremony and likely out of scope for the MVP release-candidate phase.
- Manual inspection only: too weak for a repeatable release candidate.

### Decision: Keep release notes and phase report separate

Release notes should be reader-facing and summarize MVP capabilities, setup, limitations, and deferred scope. The phase report should be owner-facing and include commands, audit findings, fixes, evidence, residual risk, and approval checklist.

Alternatives considered:
- Put everything in one report: convenient, but less useful for future users evaluating the package set.

## Risks / Trade-offs

- Full e2e or browser checks may be slow or require a local dev server. Mitigation: use package-provided Playwright configs and record exact commands and any environment limits in the report.
- Audit findings may reveal larger architecture problems. Mitigation: classify issues as release-blocking, high, medium, low, or deferred; fix high-priority items in Phase 13 and document larger follow-up work separately.
- Package-boundary checks can be partly manual. Mitigation: combine `package.json` inspection, import searches, public export checks, and TypeScript verification; document any manual-only gaps.
- Accessibility coverage may not catch every visual or assistive-tech issue. Mitigation: use axe-compatible automated checks, keyboard-flow tests, and targeted manual review notes in the phase report.
- Release notes may imply publish readiness before namespace/publishing decisions are final. Mitigation: label the result as MVP release candidate and call out the placeholder package scope if unchanged.

## Migration Plan

No schema migration is expected. If audit fixes require public API changes, the implementation must document the change, update relevant docs/specs/tests, and call it out as a potential breaking change before the phase is considered complete.
