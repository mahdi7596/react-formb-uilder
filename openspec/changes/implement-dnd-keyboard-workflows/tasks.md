## 1. Setup And Boundaries

- [x] 1.1 Confirm the existing dirty `examples/vite-react`, lockfile, and root TypeScript changes are out of scope and do not stage or modify them for Phase 9 unless explicitly required.
- [x] 1.2 Inspect `AGENTS.md`, the architecture docs, `openspec/specs/builder-commands-store/spec.md`, `openspec/specs/builder-ui-foundation/spec.md`, and current `packages/react-builder` UI/command APIs before editing product code.
- [x] 1.3 Add the minimal `dnd-kit` dependencies to `packages/react-builder` with pnpm and keep `packages/core` free of React, DOM, CSS, builder, renderer, store-library, and drag-and-drop dependencies.
- [x] 1.4 Confirm existing click-add, quick actions, inspector editing, undo/redo, and preview tests are green before wiring drag behavior.

## 2. DnD Abstraction Layer

- [x] 2.1 Create a package-owned DnD layer for drag source types, drop target descriptors, drag payloads, and command intent resolution.
- [x] 2.2 Model palette-template and canvas-node drag payloads separately so palette insertion cannot be confused with canvas reorder.
- [x] 2.3 Implement helpers that convert valid palette drops into add-node command inputs.
- [x] 2.4 Implement helpers that convert valid canvas drops into move-node command inputs.
- [x] 2.5 Implement invalid-drop classification that leaves schema unchanged and produces visible/announced feedback.
- [x] 2.6 Add unit tests for drag payloads, target resolution, command intent creation, no-op reorder detection, and invalid-drop classification.

## 3. DnD Provider And State Wiring

- [x] 3.1 Wrap the builder workspace with a DnD provider that owns sensors, overlay state, announcements, and drop handling.
- [x] 3.2 Wire pointer sensor behavior for palette items and canvas nodes without exposing raw `dnd-kit` events outside the DnD layer.
- [x] 3.3 Wire keyboard sensor or command-backed keyboard controls where they fit without weakening command boundaries.
- [x] 3.4 Update editor drag state on drag start, drag over, drop, cancellation, invalid target, and idle reset.
- [x] 3.5 Ensure successful drops execute store commands and preserve undo/redo behavior.
- [x] 3.6 Add component tests for DnD provider state transitions, successful command execution, cancellation, invalid target handling, and undo/redo after drag.

## 4. Palette Drag Insertion

- [x] 4.1 Add accessible drag handles or draggable affordances to palette items while preserving existing click-add behavior.
- [x] 4.2 Implement palette-to-empty-canvas insertion through the add-node command.
- [x] 4.3 Implement palette-to-specific-position insertion through the add-node command where supported by current schema structure.
- [x] 4.4 Select the inserted node after a successful drag insertion and show command diagnostics when insertion fails.
- [x] 4.5 Add palette tests for click-add preservation, drag insertion, insertion selection, invalid palette drop, and no schema mutation on failed drop.

## 5. Canvas Reorder

- [x] 5.1 Add sortable canvas node affordances and stable drop zones without disrupting inline label editing or quick actions.
- [x] 5.2 Implement canvas before/after reordering through the move-node command.
- [x] 5.3 Preserve selected node and inspector context after successful reorder.
- [x] 5.4 Detect no-op drops and avoid adding undo history for unchanged positions.
- [x] 5.5 Surface invalid reorder feedback when a move target is unsupported.
- [x] 5.6 Add canvas tests for drag reorder, selection preservation, no-op reorder, invalid reorder, diagnostics, and undo/redo after reorder.

## 6. Drag Overlay, Feedback, And Announcements

- [x] 6.1 Implement drag overlay rendering for palette templates and canvas nodes with stable dimensions and readable labels.
- [x] 6.2 Implement valid drop indicators for canvas insertion and reorder positions.
- [x] 6.3 Implement invalid-drop visuals that do not overlap text or resize unrelated controls.
- [x] 6.4 Implement a builder-owned live region for drag start, drag over, drop success, drop failure, cancellation, and keyboard movement announcements.
- [x] 6.5 Respect reduced-motion preferences for overlay and drop indicator transitions.
- [x] 6.6 Add accessibility tests for live-region announcements, focus behavior, accessible names, and invalid-drop feedback.

## 7. Keyboard Workflows

- [x] 7.1 Implement keyboard-accessible palette insertion controls that use the same add-node command path as pointer insertion.
- [x] 7.2 Implement keyboard move-before and move-after controls for selected canvas nodes.
- [x] 7.3 Announce successful keyboard insertion and movement with affected field label and position context where available.
- [x] 7.4 Announce invalid keyboard movement without mutating schema.
- [x] 7.5 Preserve focus or selection predictably after keyboard insertion, movement, invalid movement, undo, and redo.
- [x] 7.6 Add tests for keyboard insertion, keyboard move up/down, invalid keyboard move, announcements, focus, and undo/redo.

## 8. Responsive And Visual Review

- [x] 8.1 Verify desktop three-panel drag insertion and canvas reorder behavior in the package-local builder harness.
- [x] 8.2 Verify narrow viewport behavior keeps quick-edit or keyboard alternatives available without an unusable squeezed drag layout.
- [x] 8.3 Use `form-builder-ui-reviewer` to review drag overlay, drop indicators, invalid-drop states, spacing, hierarchy, and responsive visual quality.
- [x] 8.4 Use `form-builder-ux-reviewer` to review creator confidence, component discovery, drag affordances, keyboard alternatives, recoverability, and undo/redo expectations.
- [x] 8.5 Record required corrections and apply any blocking UI/UX corrections before the final phase report.

## 9. Browser And E2E Verification

- [x] 9.1 Extend the package-local builder Playwright tests for palette-to-canvas pointer drag.
- [x] 9.2 Extend Playwright tests for canvas reorder by pointer drag.
- [x] 9.3 Extend Playwright tests for invalid drop feedback and schema preservation.
- [x] 9.4 Extend Playwright tests for keyboard insertion and movement.
- [x] 9.5 Extend Playwright tests for undo/redo after drag insertion and reorder.
- [x] 9.6 Use the Browser plugin to inspect desktop and narrow viewports and capture screenshots for the phase report.

## 10. Final Verification And Report

- [x] 10.1 Run `pnpm --filter @your-org/forms-react-builder test`.
- [x] 10.2 Run `pnpm --filter @your-org/forms-react-builder typecheck`.
- [x] 10.3 Run `pnpm --filter @your-org/forms-react-builder e2e`.
- [x] 10.4 Run `pnpm test`.
- [x] 10.5 Run `pnpm build`.
- [x] 10.6 Run `openspec validate implement-dnd-keyboard-workflows --strict`.
- [x] 10.7 Verify `packages/core` still has no dependency on React, builder, renderer, UI, CSS, store-library, or drag-and-drop code.
- [x] 10.8 Write `docs/reports/2026-05-15-phase-9-dnd-keyboard-workflows.md` with changed files, implemented workflows, tests run, browser evidence, screenshots, known limitations, out-of-scope dirty files, and owner review checklist.
- [x] 10.9 Commit only Phase 9 proposal or implementation files as appropriate and leave unrelated dirty Phase 6 files unstaged unless the owner explicitly changes scope.
