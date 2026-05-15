# Phase 13 Report: MVP Hardening And Release Candidate

Date: 2026-05-15

Change: `implement-mvp-hardening-release-candidate`

## Summary

Phase 13 hardened the first MVP package set and prepared it for owner release-candidate review. The phase added a repeatable release audit command, fixed the one release-blocking e2e issue found during baseline verification, added MVP release candidate notes, and re-ran the full verification set.

The MVP can now be demonstrated end to end through the Vite example: build schema, preview with the real renderer, save draft, publish through fake host adapters, expose generated artifacts, render public forms, submit normalized payloads, and handle normalized backend responses.

## Changed Files

- `package.json`
  - Added `pnpm audit:release`.
- `packages/adapters/package.json`
  - Added a package-level `test` script.
- `packages/react-builder/dev/core-browser.ts`
  - Synced the browser shim with current core exports needed by the builder dev harness, including `analyzeSchema`, diagnostic helpers, diagnostic codes, and schema analysis support.
- `scripts/release-candidate-audit.mjs`
  - Added a repeatable release-candidate audit for package manifests, exports, scripts, dependency placement, forbidden imports, and public type leakage.
- `README.md`
  - Added `pnpm audit:release` to verification commands.
  - Linked release reviewer docs.
- `docs/release-notes/2026-05-15-mvp-release-candidate.md`
  - Added MVP release candidate notes, capabilities, verification set, known limitations, and owner decisions.
- `openspec/changes/implement-mvp-hardening-release-candidate/tasks.md`
  - Marked all implementation tasks complete.

## Baseline Verification

Initial baseline commands:

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm test` | Passed | 21 files, 81 tests. |
| `pnpm typecheck` | Passed | TypeScript project references succeeded. |
| `pnpm build` | Passed | All packages and Vite example built. |
| `openspec validate --all --strict` | Passed | 13 passed, 0 failed before archiving. |
| `pnpm --filter @your-org/forms-example-vite-react test:e2e` | Passed | 11 passed. |
| `pnpm --filter @your-org/forms-react-builder e2e` | Failed, then fixed | Release-blocking harness crash before builder mount. |

## Defect Found And Fixed

### Release-Blocking: Builder e2e harness did not mount

The builder Playwright suite initially failed because the test page loaded the HTML title but never mounted the builder UI. The browser error was:

```text
The requested module '/core-browser.ts' does not provide an export named 'analyzeSchema'
```

Root cause:

- `packages/react-builder/dev/core-browser.ts` is a browser-safe shim for `@your-org/forms-core`.
- The builder package now uses `analyzeSchema` through publish checklist behavior.
- The shim had not been updated with the newer core exports, so the dev harness crashed before rendering landmarks such as the command bar, palette, canvas, and inspector.

Fix:

- Added `analyzeSchema`, `createDiagnostic`, `DIAGNOSTIC_CODES`, diagnostic severity/code types, and minimal release-harness schema analysis behavior to the shim.
- Re-ran builder e2e successfully: 7 passed, 3 intentionally skipped.

## Package Boundary Audit

Added and ran `pnpm audit:release`.

The audit checks:

- Package manifests have expected names, ESM type, root exports, side-effect flags, and verification scripts.
- Root package exposes release audit and verification commands.
- Builder and example packages expose e2e scripts.
- `packages/core` has no forbidden dependency declarations.
- Core, validators, adapters, themes, and renderer source avoid forbidden imports for their package boundaries.
- Renderer and builder public type declarations do not leak React Hook Form, raw TanStack Query result types, raw dnd-kit event types, or similar implementation-library public contracts.

Result:

- `pnpm audit:release` passed.

## Runtime, Security, And Contract Audit

Audited existing test coverage and source behavior for:

- canonical schema analysis
- submitted path grammar
- dangerous-key rejection
- duplicate node id and duplicate submitted path diagnostics
- executable schema code detection
- hidden-value exclusion and preservation
- normalized submission envelopes
- file metadata normalization
- backend response parsing
- custom validator and predicate fail-closed diagnostics
- deterministic condition evaluation, dependency tracking, invalid references, and cycle diagnostics
- JSON Schema compiler diagnostics, validation plan entries, condition dependency artifacts, and generated artifact bundles

No additional high-priority runtime/security defect was found.

## Renderer And Builder Audit

Audited React renderer and builder coverage through Vitest, axe-compatible checks, and Playwright.

Renderer coverage includes:

- accessible labels, descriptions, errors, invalid states, required and disabled states
- first-invalid focus
- custom field registry examples
- slots
- normalized submission envelopes
- backend validation errors and global messages
- single-page and multi-step navigation
- hidden-field exclusion
- RTL narrow viewport example
- reduced-motion and focus-visible behavior

Builder coverage includes:

- command bar, palette, canvas, inspector, and workflow panels
- add, select, edit, duplicate, delete, undo, redo
- click-add and keyboard movement
- pointer drag insertion, reorder, and invalid-drop recovery
- preview through the real renderer
- persistence, save draft, publish, conflicts, generated artifacts, and revision warnings
- desktop and mobile viewport e2e checks

The `form-builder-ux-reviewer` and `form-builder-ui-reviewer` skills were applied as audit lenses. No additional user-visible UX/UI defect required implementation in this phase.

## Persistence, Publish, And Revision Audit

Audited adapter and builder persistence behavior for:

- load form
- save draft
- publish revision
- list revisions
- load published form
- submit form
- stale draft conflict
- immutable published revision conflict
- generated artifact bundles
- revision hash warnings
- normalized adapter failure statuses
- dangerous-key adapter data rejection
- TanStack Query hidden behind product-owned builder server-state results

No additional high-priority persistence or revision defect was found.

## Final Verification

Final commands:

| Command | Result |
| --- | --- |
| `pnpm test` | Passed: 21 files, 81 tests |
| `pnpm typecheck` | Passed |
| `pnpm build` | Passed |
| `pnpm audit:release` | Passed |
| `pnpm --filter @your-org/forms-react-builder e2e` | Passed: 7 passed, 3 skipped |
| `pnpm --filter @your-org/forms-example-vite-react test:e2e` | Passed: 11 passed |
| `openspec validate implement-mvp-hardening-release-candidate --strict` | Passed |
| `openspec validate --all --strict` | Passed: 13 passed, 0 failed |

Accessibility checks:

- Included in `pnpm test` through `vitest-axe` checks in renderer and builder tests.
- Covered in browser through Playwright focus, RTL, reduced-motion, keyboard movement, invalid-drop, and narrow viewport flows.

## Known Limitations

- Package names still use the provisional `@your-org/*` scope.
- Packages remain private and are not published to npm.
- No hosted documentation site exists yet.
- No real backend implementation is included.
- File support is metadata-only; upload orchestration remains deferred.
- Repeaters, payments, signatures, matrices, ranking, dynamic lookup, rich text authoring, hosted tenancy, collaboration, workflow automation, and advanced analytics remain deferred.
- JSON Schema remains an optional backend-friendly artifact, not the canonical authoring model.
- The default theme is a removable starter theme, not a final visual design system.

## Release Notes

Release notes were added at:

- `docs/release-notes/2026-05-15-mvp-release-candidate.md`

## Owner Review

- [ ] I reviewed the changed files.
- [ ] I ran or inspected the app/output where applicable.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

- 
