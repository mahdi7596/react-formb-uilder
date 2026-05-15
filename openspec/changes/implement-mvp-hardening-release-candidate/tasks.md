## 1. Baseline Release-Candidate Verification

- [ ] 1.1 Run and record baseline `pnpm test`, `pnpm typecheck`, `pnpm build`, and `openspec validate --all --strict` results before making fixes.
- [ ] 1.2 Run and record builder Playwright e2e coverage with `pnpm --filter @your-org/forms-react-builder e2e`.
- [ ] 1.3 Run and record example Playwright e2e coverage with `pnpm --filter @your-org/forms-example-vite-react test:e2e`.
- [ ] 1.4 Classify any baseline failures or warnings as release-blocking, high, medium, low, or deferred.

## 2. Package Boundary And Export Audits

- [ ] 2.1 Audit all package `exports`, `types`, `sideEffects`, scripts, and dependency declarations for release-candidate consistency.
- [ ] 2.2 Audit `packages/core` for forbidden dependencies or imports: React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, CSS, upload providers, design-system components, and transport clients.
- [ ] 2.3 Audit React package public exports for leaked React Hook Form, TanStack Query, raw dnd-kit, backend SDK, transport, or schema mutation internals.
- [ ] 2.4 Audit import shape for broad accidental barrels, avoidable React coupling, and compiler dependencies leaking outside their package boundaries.
- [ ] 2.5 Fix high-priority package-boundary or export issues found by the audit and add focused tests or checks where practical.

## 3. Runtime, Security, And Contract Audits

- [ ] 3.1 Audit canonical schema, submitted path, dangerous-key rejection, duplicate path handling, hidden-value semantics, submission normalization, and backend response parsing.
- [ ] 3.2 Audit executable-content exclusion for persisted schemas, including JavaScript, React components, DOM objects, backend SDK objects, transport objects, and unsupported rich text behavior.
- [ ] 3.3 Audit custom field, validator, and predicate fail-closed behavior for unknown or unsupported registrations.
- [ ] 3.4 Audit deterministic condition evaluation, dependency tracking, invalid references, and cycle diagnostics.
- [ ] 3.5 Audit JSON Schema compiler output, diagnostics, validation plans, condition dependencies, unsupported behavior diagnostics, and backend-friendly generated artifacts.
- [ ] 3.6 Fix high-priority runtime, security, or contract issues found by the audits and add focused regression tests.

## 4. Renderer And Builder Experience Audits

- [ ] 4.1 Audit renderer accessibility for labels, descriptions, errors, required and disabled states, validation summaries, first-invalid focus, and custom field contract examples.
- [ ] 4.2 Audit renderer RTL/LTR behavior, step navigation, backend validation errors, submission statuses, hidden-field behavior, and normalized payload output.
- [ ] 4.3 Audit builder creator workflows for add, select, inspect, edit, undo, redo, preview through the real renderer, save draft, publish, conflicts, and generated artifact review.
- [ ] 4.4 Audit builder accessibility for keyboard navigation, focus visibility, drag-and-drop keyboard workflows, panel controls, alerts, publish checks, and invalid-drop feedback.
- [ ] 4.5 Audit builder visual stability in desktop and narrow viewports for command bar, palette, canvas, inspector, workflow panels, diagnostics, and primary actions.
- [ ] 4.6 Use `form-builder-ux-reviewer` and `form-builder-ui-reviewer` to review any user-visible builder or renderer issues that Phase 13 fixes.
- [ ] 4.7 Fix high-priority renderer or builder issues found by the audits and add focused tests or Playwright coverage.

## 5. Persistence, Publish, And Revision Audits

- [ ] 5.1 Audit draft save, publish, revision listing, published load, generated artifact bundle, conflict handling, and normalized adapter response mapping.
- [ ] 5.2 Audit published revision immutability, draft editing after publish, revision metadata, and revision hash behavior.
- [ ] 5.3 Audit submission revision integrity for `revisionId`, `revisionHash`, schema version, attempt id, locale, normalized data, file metadata, and JSON-serializable metadata.
- [ ] 5.4 Fix high-priority persistence, publish, revision, or adapter issues found by the audit and add focused tests.

## 6. Release Notes And Documentation

- [ ] 6.1 Create MVP release notes describing current package capabilities, setup path, verification status, known limitations, placeholder package scope, deferred features, and owner decisions still needed before public publishing.
- [ ] 6.2 Update root onboarding or documentation map links so the Phase 13 report and MVP release notes are discoverable.
- [ ] 6.3 Confirm docs do not claim deferred post-MVP features are implemented.

## 7. Final Verification And Phase Report

- [ ] 7.1 Re-run `pnpm test`.
- [ ] 7.2 Re-run `pnpm typecheck`.
- [ ] 7.3 Re-run `pnpm build`.
- [ ] 7.4 Re-run builder Playwright e2e coverage.
- [ ] 7.5 Re-run example Playwright e2e coverage.
- [ ] 7.6 Re-run accessibility checks or the test commands that contain axe-compatible checks.
- [ ] 7.7 Re-run package boundary and export checks.
- [ ] 7.8 Re-run `openspec validate implement-mvp-hardening-release-candidate --strict` and `openspec validate --all --strict`.
- [ ] 7.9 Write `docs/reports/2026-05-15-phase-13-mvp-release-candidate.md` with audits run, verification evidence, defects found, fixes made, known limitations, residual risks, release-note location, and owner review checklist.
- [ ] 7.10 Commit proposal artifacts separately from implementation work.
