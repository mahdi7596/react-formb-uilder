## Context

The project has reached an end-to-end MVP workflow: core contracts and runtime, JSON Schema compiler, React renderer, Vite browser example, builder commands/store, builder UI, drag-and-drop, persistence, publish, and adapter contracts. The UI is functional and tested, but styling is still owned by the wrong layers:

- `packages/themes` is a Phase 0 placeholder with only `packageBoundary`.
- `packages/react-renderer` owns `createRendererStyles()` and renderer class/data hooks.
- `packages/react-builder` owns `createBuilderStyles()` and embeds a copy of renderer styles for preview.
- `examples/vite-react` owns host/demo layout CSS and also calls renderer style helpers.
- `DESIGN.md` contains the provisional design source of truth, but tokens are not exported as package contracts.

The architecture says `@your-org/forms-themes` is optional starter theme only and never required by the renderer. `packages/core` must remain free of CSS, React, UI dependencies, and design-system dependencies. Phase 11 should therefore make the default visual layer reusable and testable without weakening the headless/host-customizable direction.

## Goals / Non-Goals

**Goals:**

- Promote `packages/themes` from placeholder to implemented optional package for default theme tokens and starter CSS.
- Convert the current `DESIGN.md` token set into typed exports and deterministic CSS custom property output.
- Provide default renderer and builder theme CSS that React packages and examples can consume or compose without requiring hosts to use it.
- Preserve stable class hooks, data attributes, renderer slots, builder primitives, and host override affordances.
- Use logical CSS properties and explicit LTR handling for submitted paths, schema ids, JSON, URLs, and code inside RTL surfaces.
- Add reduced-motion behavior and focus-visible defaults through the theme layer.
- Verify visual behavior in the Vite example across desktop/narrow viewports and LTR/RTL modes.

**Non-Goals:**

- No brand redesign or final visual identity selection.
- No heavyweight UI framework, CSS-in-JS runtime, Tailwind dependency, shadcn dependency, or component-library migration.
- No changes to canonical schema, core runtime behavior, adapter contracts, or persisted data.
- No requirement that host apps import `@your-org/forms-themes`.
- No rich animation system, dark mode, theme editor, admin-controlled token persistence, or SaaS theming API.
- No implementation of post-MVP fields or features such as uploads, repeaters, payments, signatures, or analytics.

## Decisions

### Decision: Themes exports typed tokens plus CSS strings

`packages/themes` will export:

- a typed token object aligned with `DESIGN.md`
- token category types for color, typography, spacing, radius, shadow, motion, and component tokens
- CSS variable maps for base tokens
- helper functions such as `createThemeVariables()`, `createRendererThemeStyles()`, `createBuilderThemeStyles()`, and `createDefaultThemeStyles()`

The first implementation should keep output deterministic and dependency-free. CSS strings are acceptable at this stage because the existing renderer and builder already expose style helpers this way and the package is not choosing a build-time CSS pipeline.

Alternatives considered:

- Static `.css` assets only: good for browser usage, weaker for package tests and composition in existing helpers.
- CSS-in-JS runtime: rejected because it adds a runtime dependency and reduces host portability.
- Token JSON only: rejected because examples and React packages need usable default CSS.

### Decision: Theme package is optional and React packages compose it

React packages may import `@your-org/forms-themes` to compose their package-owned default styles, but public behavior must still work with host CSS and slots. Core must not import themes. Hosts should be able to:

- use default styles from `@your-org/forms-themes`
- call package style helpers
- ignore default styles and style stable class/data hooks themselves
- replace renderer slots such as field chrome, labels, descriptions, errors, navigation, messages, and submit controls

Alternatives considered:

- Make renderer/builder depend fully on theme CSS: rejected because renderer should remain visually adaptable.
- Keep all CSS inside React packages: rejected because tokens and theme behavior would keep drifting.

### Decision: Token names become semi-public contracts

CSS custom properties should use stable prefixes and clear namespaces:

- `--rfb-color-*`
- `--rfb-font-*`
- `--rfb-space-*`
- `--rfb-radius-*`
- `--rfb-shadow-*`
- `--rfb-motion-*`
- package aliases where useful, such as renderer field gaps and builder panel variables

Existing `--fb-*` and `--rfb-*` package-local variables should either map to the shared variables or be replaced through a compatibility layer. Avoid a hard breaking rename in one step unless tests and docs show the migration path.

Alternatives considered:

- Keep current mixed variable names: rejected because host customization becomes harder.
- Use design-token syntax directly as CSS variables, such as `--colors-primary`: rejected because package prefixing reduces collisions in host apps.

### Decision: Theme CSS covers foundations, not product logic

The default theme should style surfaces, controls, field chrome, focus, alerts, badges, tabs, panels, builder workflow panels, drag states, and renderer forms. It must not encode domain invariants, validation behavior, schema mutation rules, publish rules, or adapter behavior.

State should be selected through existing semantic markup:

- class hooks such as `.rfb-form`, `.rfb-field`, `.rfb-builder`, `.rfb-node`
- data attributes such as `data-rfb-invalid`, `data-rfb-disabled`, `data-rfb-submission-status`, `data-drag-status`, and `data-can-publish`
- ARIA and native states such as `aria-selected`, `aria-invalid`, `disabled`, and `:focus-visible`

Alternatives considered:

- Add theme props to every component: rejected for Phase 11 because it would spread styling concerns across APIs.
- Store UI tokens in schema `ui`: rejected because default styling is not persisted form behavior.

### Decision: Example demonstrates default theme plus host overrides

The Vite example should import theme output and keep only host-shell/demo-specific CSS locally. This demonstrates that the package theme is useful while preserving the idea that host apps own layout outside embedded builder/renderer surfaces.

The example should cover:

- default renderer form styling
- builder styling
- host shell styling
- at least one host override using CSS variables or class hooks
- LTR and RTL examples
- reduced-motion behavior where practical through CSS and tests

Alternatives considered:

- Build a separate theme gallery: useful later, but too much surface for Phase 11.
- Replace all example CSS: rejected because host apps still need their own surrounding layout.

## Risks / Trade-offs

- Token names become unstable if chosen hastily -> Use clear `--rfb-*` names and document them as starter contracts.
- Theme package drifts from `DESIGN.md` -> Add tests that assert key token values and update README with the source-of-truth relationship.
- React package style helpers duplicate theme CSS -> Refactor helpers to compose theme output and test for expected variables/class hooks.
- Host override story remains theoretical -> Add Vite example override and docs showing both CSS variable and slot paths.
- Visual checks become brittle -> Use Playwright assertions for visible state and screenshots for evidence, not pixel-perfect snapshots.
- Theme package accidentally enters core dependency graph -> Add boundary checks proving `packages/core` does not depend on themes or CSS.

## Migration Plan

1. Implement typed token exports and CSS variable helpers in `packages/themes`.
2. Add theme package tests for token shape, deterministic CSS output, reduced-motion CSS, and boundary metadata.
3. Update renderer and builder style helpers to compose or align with theme CSS while preserving current class/data hooks.
4. Update the Vite example to consume the default theme and demonstrate host overrides.
5. Add or update Playwright coverage for themed renderer/builder flows, desktop/narrow layout, LTR/RTL, focus visibility, and reduced-motion.
6. Update package READMEs and write the Phase 11 report.

Rollback is straightforward: React packages can keep their previous local style helper behavior and the optional `packages/themes` exports can be removed before external publication. No persisted schema or backend contract migration is involved.

## Open Questions

- Should default theme CSS be exported only as JavaScript strings in Phase 11, or should the package also include a generated `.css` file in `dist`?
- Should CSS variable names immediately replace `--fb-*` aliases, or should Phase 11 keep compatibility aliases and defer removal?
- Should dark mode be explicitly deferred in the spec, or should the token model include dark-mode-ready naming without implementing a dark theme?
