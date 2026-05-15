## Why

Phase 7 created the command and editor-store foundation for schema editing, but creators still cannot visually build or inspect a form. Phase 8 turns those foundations into the first usable builder workspace so the owner can review the real authoring experience before drag-and-drop and publish workflows are added.

## What Changes

- Add an RTL-first React builder shell with top command bar, right component palette, center canvas, and left inspector.
- Add reusable builder UI primitives for buttons, icon buttons, inputs, textareas, selects, panels, tabs, tooltips, menus, empty states, loading states, error states, inspector rows, field chrome, labels, descriptions, and validation messages.
- Add a searchable, grouped component palette for MVP fields and click-add insertion.
- Add canvas rendering for MVP field nodes, including empty state, selected state, quick actions, and inline label editing.
- Add inspector tabs for content, validation, logic, accessibility, and data contract settings.
- Wire builder UI edits to the Phase 7 builder commands and editor store rather than mutating schemas directly in React components.
- Add preview mode that uses the real `packages/react-renderer` renderer instead of duplicating respondent field behavior.
- Add responsive behavior for desktop three-panel editing, tablet inspector drawer behavior, and a mobile quick-edit/preview-oriented layout.
- Add component and browser-level verification plus a Phase 8 report for owner review.

## Capabilities

### New Capabilities

- `builder-ui-foundation`: Defines the first visual builder workspace, package-local UI primitives, palette, canvas, inspector, command integration, real-renderer preview, responsive behavior, and verification expectations.

### Modified Capabilities

- None.

## Impact

- Affected package: `packages/react-builder`.
- Integration points: `packages/react-renderer` is used for builder preview; Phase 7 command/store APIs remain the schema editing boundary.
- Tests and verification: React Testing Library coverage, Playwright/browser checks against a builder test harness or package-level preview surface, `pnpm test`, `pnpm build`, and reviewer-skill checks.
- Documentation: add `docs/reports/2026-05-15-phase-8-builder-ui-foundation.md` at implementation completion.
- Dependencies may be added only where needed for React builder UI and tests, such as React component testing utilities or lightweight icon support. No heavyweight design system or backend-specific persistence should be introduced in this phase.
- Existing unfinished Phase 6 example edits under `examples/vite-react`, related lockfile changes, and root TypeScript alias changes are out of scope for this proposal and should not be staged into Phase 8 work unless the owner explicitly asks.
