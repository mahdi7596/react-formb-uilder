# Phase 8 Builder UI Foundation Report

Date: 2026-05-15
Change: `implement-builder-ui-foundation`
Status: Ready for owner review

## Summary

Phase 8 adds the first usable React builder UI foundation for the package-first form builder. The work creates a clean package-local builder preview surface, a reusable builder workspace, component primitives, command-backed palette/canvas/inspector editing, real renderer preview mode, responsive layouts, and automated browser coverage.

The builder can now be viewed through the `packages/react-builder` harness:

```bash
pnpm --filter @your-org/forms-react-builder dev
```

Then open `http://127.0.0.1:4178/`.

## Changed Files

- `packages/react-builder/package.json`
- `packages/react-builder/tsconfig.json`
- `packages/react-builder/tsconfig.build.json`
- `packages/react-builder/vitest.config.ts`
- `packages/react-builder/vite.config.ts`
- `packages/react-builder/playwright.config.ts`
- `packages/react-builder/src/index.ts`
- `packages/react-builder/src/ui.tsx`
- `packages/react-builder/src/ui.test.tsx`
- `packages/react-builder/dev/index.html`
- `packages/react-builder/dev/main.tsx`
- `packages/react-builder/dev/core-browser.ts`
- `packages/react-builder/tests/builder.spec.ts`
- `packages/react-renderer/tsconfig.build.json`
- `packages/validators/tsconfig.build.json`
- `docs/reports/assets/phase-8-builder-ui-desktop.png`
- `docs/reports/assets/phase-8-builder-ui-mobile.png`
- `openspec/changes/implement-builder-ui-foundation/tasks.md`

## Implemented Surfaces

- Added `BuilderWorkspace`, `BuilderStyles`, `createBuilderStyles`, and reusable package-local primitives for buttons, icon buttons, fields, selects, textareas, alerts, badges, empty states, and inspector rows.
- Added RTL-first builder layout with top command bar, right palette, center canvas, and left inspector.
- Added command bar status for undo, redo, preview mode, command status, diagnostics count, and current schema title.
- Added grouped/searchable palette with command-backed click insertion and selection of the inserted node.
- Added canvas empty state, field block rendering, selection state, inline label editing, duplicate/delete/move quick actions, validation markers, and diagnostic surfacing.
- Added inspector tabs for content, validation, logic, accessibility, and data contract settings, with edits routed through builder commands.
- Added real renderer preview mode using `@your-org/forms-react-renderer`; preview respondent values do not mutate the canonical builder schema.
- Added package-local Vite harness for browser verification and Playwright tests independent of the dirty Phase 6 example app.
- Added build-only TypeScript config overrides for dependent packages so package builds consume built workspace type boundaries instead of pulling another package's `src` into their own `rootDir`.

## Public API Additions

- `BuilderWorkspace`
- `BuilderStyles`
- `createBuilderStyles`
- Builder UI primitives exported from `packages/react-builder/src/ui.tsx`
- `paletteCatalog`
- `updateNodeProperties` command for command-backed property edits

## Verification

- `pnpm --filter @your-org/forms-react-builder test`: passed, 2 files, 13 tests.
- `pnpm --filter @your-org/forms-react-builder typecheck`: passed.
- `pnpm --filter @your-org/forms-react-builder e2e`: passed, 3 passed and 1 expected desktop skip for the mobile-only layout smoke.
- `pnpm test`: passed, 18 files, 55 tests.
- `pnpm build`: passed across workspace packages and the existing Vite example.
- `openspec validate implement-builder-ui-foundation --strict`: passed.
- Core boundary scan: no React, renderer, builder, UI CSS, store-library, or drag-and-drop imports found in `packages/core`; only existing Vitest test imports were reported.

## Browser Evidence

Browser-plugin desktop and mobile inspections passed with no console errors or warnings from the builder harness.

- Desktop screenshot: `docs/reports/assets/phase-8-builder-ui-desktop.png`
- Mobile screenshot: `docs/reports/assets/phase-8-builder-ui-mobile.png`

The browser flow verified click-add of an email field, inline label editing, unsafe submitted-path diagnostics, fixing the submitted path, and switching to renderer preview.

## Reviewer Notes

### UI Review

Using `form-builder-ui-reviewer`, the current UI is acceptable for the foundation phase: panel hierarchy is clear, the RTL three-panel layout is stable, diagnostic feedback is visible, focus states are present, and mobile stacks without overlap. No required blocking corrections were found before owner review.

Future polish candidates:

- Improve tab overflow presentation in the inspector once the final design system phase begins.
- Tune command-bar density and diagnostic message placement after more real builder actions are available.

### UX Review

Using `form-builder-ux-reviewer`, the creator flow is acceptable for Phase 8: users can discover fields, add by click, select nodes, edit settings, see diagnostics, recover from unsafe paths, and preview through the real renderer. No required blocking corrections were found before owner review.

Future UX work:

- Drag-and-drop insertion and keyboard reordering are intentionally deferred to the next DnD phase.
- Save, publish, revision, and backend adapter workflows remain out of scope for this phase.

## Known Limitations

- Drag-and-drop is not implemented in Phase 8.
- Persistence, publishing, submissions, and revision management are not implemented in this phase.
- The package-local Vite harness uses `dev/core-browser.ts` as a browser-safe shim because the current core public index also exports fixture helpers that depend on Node modules. A future package/browser entry decision should remove the need for the shim.
- The visual system is foundation-level and token-ready; the full design-system phase should formalize final spacing, density, colors, and component contracts.
- `pnpm-lock.yaml` was already dirty from Phase 6 example work before this phase. It was not staged in the Phase 8 commit to avoid mixing phases.

## Out-Of-Scope Dirty Files

The following dirty files existed before Phase 8 implementation and were intentionally left out of the Phase 8 commit:

- `examples/vite-react/*`
- `pnpm-lock.yaml`
- `tsconfig.base.json`

## Owner Review Checklist

- [ ] Run `pnpm --filter @your-org/forms-react-builder dev`.
- [ ] Open `http://127.0.0.1:4178/`.
- [ ] Add a few fields from the palette.
- [ ] Select fields and edit content, validation, accessibility, and data settings.
- [ ] Try an unsafe submitted path such as `__proto__.bad` and confirm diagnostics appear.
- [ ] Fix the submitted path and switch to preview.
- [ ] Confirm the desktop and mobile screenshots match the expected direction for this phase.
