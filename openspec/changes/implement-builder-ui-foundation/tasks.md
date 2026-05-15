## 1. Setup And Boundaries

- [x] 1.1 Confirm the existing dirty `examples/vite-react`, lockfile, and root TypeScript changes are out of scope and do not stage or modify them for Phase 8 unless explicitly required.
- [x] 1.2 Inspect `AGENTS.md`, `DESIGN.md`, the architecture docs, `openspec/specs/builder-commands-store/spec.md`, and the current `packages/react-builder`/`packages/react-renderer` APIs before editing product code.
- [x] 1.3 Update `packages/react-builder` build/test configuration for React TSX components, React Testing Library, browser-safe CSS imports, and any minimal package-local test harness needed for browser verification.
- [x] 1.4 Add only necessary React builder UI/test dependencies with pnpm, keeping `packages/core` free of React, renderer, builder, UI, CSS, store-library, and drag-and-drop dependencies.

## 2. UI Primitives And Styling Foundation

- [x] 2.1 Create package-local builder styling that maps `DESIGN.md` tokens into CSS variables, logical properties, RTL defaults, focus-visible styles, and reduced-motion handling.
- [x] 2.2 Implement reusable primitives for buttons, icon buttons, inputs, textareas, selects, panels, tabs, tooltips, menus, empty states, loading states, error states, badges/alerts, inspector rows, and field chrome.
- [x] 2.3 Add primitive tests for accessible names, keyboard focus, disabled states, selected states, stable dimensions, and long-label behavior.
- [x] 2.4 Export only the intended public builder UI and package APIs without leaking private test harness internals.

## 3. Builder Shell

- [x] 3.1 Implement the RTL-first builder workspace shell with top command bar, right palette region, center canvas region, and left inspector region.
- [x] 3.2 Implement command bar controls for form title display, undo, redo, preview mode, command status, and diagnostics summary without adding backend save or publish behavior.
- [x] 3.3 Wire the shell to `createEditorStore` so selection, active panel, canvas mode, command status, and undo/redo state render from store state.
- [x] 3.4 Add shell tests for region accessibility, RTL placement assumptions, preview toggle, undo/redo button states, and diagnostics summary.

## 4. Palette

- [x] 4.1 Define the MVP palette catalog for supported Phase 8 field types using JSON-serializable node templates and stable component metadata.
- [x] 4.2 Implement grouped palette rendering with icons or recognizable affordances, accessible add controls, and compact descriptions.
- [x] 4.3 Implement palette search filtering, no-results empty state, and search reset behavior without mutating the schema.
- [x] 4.4 Wire click-add to the editor store command path so successful insertion selects the new node and command failures show diagnostics.
- [x] 4.5 Add palette tests for grouping, search filtering, empty search recovery, click-add insertion, selection after insertion, and failed command diagnostics.

## 5. Canvas

- [x] 5.1 Implement canvas empty state for schemas with no editable field nodes.
- [x] 5.2 Implement canvas node rendering for MVP fields with label, submitted path, field type context, validation indicators, and diagnostics indicators.
- [x] 5.3 Implement selection styling and selection actions as UI-only store changes that do not mutate the canonical schema.
- [x] 5.4 Implement inline label editing through the builder command/store path, including commit, cancel, validation feedback, and undo/redo participation.
- [x] 5.5 Implement canvas quick actions for duplicate, delete, and basic move actions through builder commands, surfacing warnings and errors.
- [x] 5.6 Add canvas tests for empty state, node rendering, selection, inline label editing, quick actions, diagnostics visibility, and undo/redo behavior.

## 6. Inspector

- [x] 6.1 Implement inspector tab shell for content, validation, logic, accessibility, and data contract settings.
- [x] 6.2 Implement content controls for supported label, description, placeholder, options, and field-specific settings, routed through builder commands.
- [x] 6.3 Implement validation controls for supported requiredness and validation settings, including dangerous-change diagnostics visibility.
- [x] 6.4 Implement logic controls for supported declarative visibility/condition data without persisting executable JavaScript or React components.
- [x] 6.5 Implement accessibility and data contract controls for ids, submitted names/paths, helper text, and contract-affecting settings with unsafe submitted-path diagnostics.
- [x] 6.6 Add inspector tests for selected-node updates, tab behavior, stale-selection avoidance, command-backed edits, diagnostics, and accessibility labels.

## 7. Preview And Responsive Behavior

- [x] 7.1 Implement preview mode by mounting the real `packages/react-renderer` renderer with the current editor schema.
- [x] 7.2 Ensure preview respondent value interactions do not mutate the canonical builder schema.
- [x] 7.3 Restore editing mode, prior selection, and canvas context when exiting preview where possible.
- [x] 7.4 Implement desktop three-panel layout, tablet inspector drawer behavior, and mobile quick-edit/preview-oriented layout.
- [x] 7.5 Add tests for preview mounting, preview isolation, exit behavior, responsive states, long text handling, and focus behavior.

## 8. Browser Verification And Review

- [x] 8.1 Create or update a clean package-local or dedicated builder preview surface for Playwright and Browser-plugin checks without relying on the dirty Phase 6 example work.
- [x] 8.2 Add Playwright tests for creating a simple form through click-add, editing a field, viewing diagnostics, switching to preview, and checking desktop/narrow layouts.
- [x] 8.3 Run Browser-plugin inspection for desktop and narrow viewports and capture screenshots for the phase report.
- [x] 8.4 Use `form-builder-ui-reviewer` to review visual quality and record any required corrections.
- [x] 8.5 Use `form-builder-ux-reviewer` to review creator UX and record any required corrections.

## 9. Final Verification And Report

- [x] 9.1 Run `pnpm --filter @your-org/forms-react-builder test`.
- [x] 9.2 Run `pnpm --filter @your-org/forms-react-builder typecheck`.
- [x] 9.3 Run `pnpm test`.
- [x] 9.4 Run `pnpm build`.
- [x] 9.5 Run `openspec validate implement-builder-ui-foundation --strict`.
- [x] 9.6 Verify `packages/core` still has no dependency on React, builder, renderer, UI, CSS, store-library, or drag-and-drop code.
- [x] 9.7 Write `docs/reports/2026-05-15-phase-8-builder-ui-foundation.md` with changed files, implemented surfaces, tests run, browser evidence, screenshots, known limitations, out-of-scope dirty files, and owner review checklist.
- [x] 9.8 Commit only Phase 8 implementation files and leave unrelated dirty Phase 6 files unstaged unless the owner explicitly changes scope.
