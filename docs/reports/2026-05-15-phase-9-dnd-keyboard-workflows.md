# Phase 9 DnD And Keyboard Workflows Report

Date: 2026-05-15
Change: `implement-dnd-keyboard-workflows`
Status: Ready for owner review

## Summary

Phase 9 adds direct manipulation workflows to the React builder: palette-to-canvas drag insertion, canvas reorder by pointer drag, visible drop feedback, drag overlay, invalid-drop recovery, live announcements, and keyboard-accessible insertion/movement alternatives.

All schema-changing drag and keyboard workflows route through the existing builder command/store path. `packages/core` remains framework-agnostic.

## Changed Files

- `packages/react-builder/package.json`
- `packages/react-builder/src/dnd.ts`
- `packages/react-builder/src/dnd.test.ts`
- `packages/react-builder/src/index.ts`
- `packages/react-builder/src/ui.tsx`
- `packages/react-builder/src/ui.test.tsx`
- `packages/react-builder/tests/builder.spec.ts`
- `openspec/changes/implement-dnd-keyboard-workflows/tasks.md`
- `docs/reports/2026-05-15-phase-9-dnd-keyboard-workflows.md`
- `docs/reports/assets/phase-9-dnd-desktop.png`
- `docs/reports/assets/phase-9-reorder-desktop.png`
- `docs/reports/assets/phase-9-keyboard-mobile.png`

`pnpm-lock.yaml` was modified by dependency installation but was already dirty with older Phase 6/example changes, so it is intentionally left unstaged until the mixed lockfile state is reconciled.

## Implemented Workflows

- Added a package-owned DnD intent layer with typed palette-template and canvas-node payloads.
- Added helpers that convert valid drag results into `addNode` and `moveNode` command inputs.
- Added invalid-drop and no-op classification that preserves schema state.
- Wrapped `BuilderWorkspace` in `DndContext` with pointer and keyboard sensors.
- Added palette drag handles while preserving click-add buttons.
- Added canvas drag handles and droppable canvas/node targets.
- Added drag overlay, drop feedback, selected/dragging/drop-active states, and reduced-motion-friendly transitions.
- Added live-region announcements for drag, drop, keyboard movement, undo, and redo.
- Added keyboard insertion through palette add controls and keyboard movement through existing move controls.
- Extended Playwright coverage for desktop pointer drag and mobile keyboard/responsive workflows.

## Verification

- `pnpm --filter @your-org/forms-react-builder test`: passed, 3 files, 20 tests.
- `pnpm --filter @your-org/forms-react-builder typecheck`: passed.
- `pnpm --filter @your-org/forms-react-builder e2e`: passed, 7 passed and 3 expected skips for viewport-specific coverage.
- `pnpm test`: passed, 19 files, 62 tests.
- `pnpm build`: passed across workspace packages and the existing Vite example.
- `openspec validate implement-dnd-keyboard-workflows --strict`: passed.
- Core boundary scan: no React, builder, renderer, UI CSS, store-library, or `dnd-kit` imports found in `packages/core`; only existing Vitest test imports were reported.

## Rendered Evidence

Browser plugin runtime was not exposed as a callable tool in this session, so rendered verification used the Playwright fallback from the frontend testing workflow.

Checks performed at `http://127.0.0.1:4178/`:

- Page identity: title was `React Builder Phase 8 Harness`.
- Desktop console health: no warnings or errors from the app.
- Mobile console health: no warnings or errors from the app.
- Desktop interaction proof: dragged Email from palette after Full name, then dragged Email before Full name.
- Mobile interaction proof: focused Add Email and inserted it by keyboard.

Screenshots:

- `docs/reports/assets/phase-9-dnd-desktop.png`
- `docs/reports/assets/phase-9-reorder-desktop.png`
- `docs/reports/assets/phase-9-keyboard-mobile.png`

## Reviewer Notes

### UI Review

Using `form-builder-ui-reviewer`, the Phase 9 visual states are acceptable for owner review. Drop feedback is visible, selected states remain clear, drag handles are keyboard-focusable, and mobile layout avoids a squeezed three-panel drag surface.

Non-blocking polish:

- Replace text placeholders such as `::`, `U`, and `R` with proper iconography in the future design-system/icon pass.
- Refine the drag overlay/drop marker styling when final theme tokens are introduced.

### UX Review

Using `form-builder-ux-reviewer`, the creator path is acceptable for this phase: users can drag from palette, reorder on canvas, recover from invalid drops, use keyboard alternatives, and undo/redo command-backed edits.

Non-blocking future work:

- Mobile pointer dragging is intentionally not treated as the primary narrow-viewport workflow yet; mobile uses keyboard/quick-edit alternatives.
- Nested section/repeater DnD is intentionally deferred until those contracts are specified.

## Known Limitations

- DnD supports MVP root-level palette insertion and canvas reorder, not nested tree/repeater workflows.
- Mobile pointer drag is not the primary supported path in Phase 9.
- Drag handles use simple text affordances until the icon/design-system phase.
- Persistence, publish, revision, and backend adapter flows remain out of scope.
- The package-local Vite harness still uses the existing browser-safe core shim from Phase 8.
- The mixed dirty `pnpm-lock.yaml` state still needs a cleanup/reconciliation pass.

## Out-Of-Scope Dirty Files

These files existed as unrelated dirty work before Phase 9 and were left unstaged:

- `examples/vite-react/*`
- `pnpm-lock.yaml`
- `tsconfig.base.json`

## Owner Review Checklist

- [ ] Run `pnpm --filter @your-org/forms-react-builder dev`.
- [ ] Open `http://127.0.0.1:4178/`.
- [ ] Drag Email from the palette onto the canvas.
- [ ] Drag the inserted Email field before/after another canvas field.
- [ ] Try dropping a palette item outside the canvas and confirm invalid-drop feedback.
- [ ] Insert a field using keyboard focus on the Add button.
- [ ] Move a field using keyboard-accessible move controls.
- [ ] Confirm undo/redo behavior is acceptable for this phase.
- [ ] Confirm desktop and mobile screenshots match the expected direction.
