## Why

The builder, renderer, and example now work end to end, but styling is still split across React package-local CSS strings and example CSS while `packages/themes` remains a placeholder. Phase 11 should make the default UI reusable and host-overridable without turning the product into a heavyweight design-system dependency or coupling styling to `packages/core`.

## What Changes

- Turn `@your-org/forms-themes` from a placeholder into the source for default theme tokens, CSS custom properties, and reusable starter CSS for renderer, builder, and examples.
- Convert the existing `DESIGN.md` token decisions into typed token exports and deterministic CSS variable output.
- Add default minimal theme CSS that React packages and examples can consume without making themes required by `packages/core`.
- Keep renderer and builder class hooks, data attributes, slots, and component boundaries stable so host apps can replace or override visual pieces.
- Add RTL/LTR logical CSS coverage, reduced-motion handling, focus-visible behavior, and accessible contrast checks for the default theme.
- Update the Vite React example to demonstrate the default theme and host customization affordances.
- Write the Phase 11 report with visual/browser evidence and owner review checklist.

No breaking changes are intended. Existing package-local style helpers may be refactored to compose theme output, but public renderer and builder behavior should remain product-owned and host-overridable.

## Capabilities

### New Capabilities

- `theme-design-system-readiness`: Default theme tokens, CSS variable generation, starter CSS assets, package boundaries, host override contracts, RTL/LTR and reduced-motion behavior, and Phase 11 verification expectations.

### Modified Capabilities

- `builder-ui-foundation`: Builder styling SHALL consume or align with theme package tokens and keep stable class/data hooks for host customization.
- `react-renderer-foundation`: Renderer styling hooks SHALL integrate with optional theme assets while preserving slots and host overrides.
- `project-bootstrap`: The themes package SHALL move from placeholder status to an implemented optional package while preserving core dependency boundaries.

## Impact

- Affected packages: `packages/themes`, `packages/react-renderer`, `packages/react-builder`, and `examples/vite-react`.
- Affected docs/reports: package READMEs, OpenSpec specs, and `docs/reports/2026-05-15-phase-11-theme-design-system-readiness.md`.
- Public or semi-public contracts: theme token names, CSS custom property names, default theme CSS helper exports, class hooks, data attributes, slot compatibility, and host override guidance.
- Dependencies: no heavyweight UI framework should be introduced; `packages/core` must remain free of CSS, theme package, React, and design-system dependencies.
- Testing: theme token/unit tests, renderer/builder style hook tests, Vite example Playwright visual flows for desktop/narrow and LTR/RTL, focus/reduced-motion checks where practical, full `pnpm test`, and full `pnpm build`.
