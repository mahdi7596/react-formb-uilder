## 1. Theme Package Contracts

- [ ] 1.1 Replace the themes placeholder export with typed default theme tokens for colors, typography, spacing, radii, shadows, motion, and component-level values.
- [ ] 1.2 Add product-prefixed CSS custom property names and deterministic variable generation helpers such as `createThemeVariables`.
- [ ] 1.3 Add default CSS helper exports for renderer, builder, and combined theme usage.
- [ ] 1.4 Add compatibility aliases or documented mappings for existing renderer/builder CSS variables where needed.
- [ ] 1.5 Update `packages/themes/README.md` with package boundaries, `DESIGN.md` source-of-truth guidance, exported contracts, and host override examples.

## 2. Theme Package Tests

- [ ] 2.1 Add tests proving key token values match `DESIGN.md` decisions.
- [ ] 2.2 Add tests proving CSS variable generation is deterministic and product-prefixed.
- [ ] 2.3 Add tests proving renderer, builder, combined, focus, and reduced-motion CSS helpers include expected selectors and variables.
- [ ] 2.4 Add boundary tests proving `packages/core` does not depend on themes, CSS, React, or design-system libraries.

## 3. Renderer Theme Integration

- [ ] 3.1 Refactor `createRendererStyles()` to compose or align with `@your-org/forms-themes` renderer theme output.
- [ ] 3.2 Preserve renderer class hooks and data attributes for form, field, label, description, error, section, step, messages, navigation, and submit controls.
- [ ] 3.3 Ensure renderer slots remain replaceable and do not depend on default theme markup for core behavior.
- [ ] 3.4 Add or update renderer tests for theme variables, class hooks, data attributes, slot replacement, error states, focus styles, and reduced-motion CSS.

## 4. Builder Theme Integration

- [ ] 4.1 Refactor `createBuilderStyles()` to compose or align with `@your-org/forms-themes` builder theme output.
- [ ] 4.2 Preserve builder class hooks and data attributes for command bar, palette, canvas, inspector, workflow panels, drag states, alerts, badges, tabs, and field nodes.
- [ ] 4.3 Ensure builder theme CSS styles selected, dragging, valid-drop, invalid-drop, disabled, warning, error, success, dirty, saved, conflict, and publish-blocking states without relying only on color.
- [ ] 4.4 Add or update builder tests for theme variables, class hooks, state selectors, desktop/narrow style constraints, focus styles, and reduced-motion CSS.

## 5. Vite Example Theme Adoption

- [ ] 5.1 Update the Vite React example to consume the default theme package for renderer and builder surfaces.
- [ ] 5.2 Keep host-shell/demo-specific layout CSS in the example and remove duplicated package theme styling where possible.
- [ ] 5.3 Add a small host override demonstration using CSS variables or stable class hooks.
- [ ] 5.4 Ensure LTR, RTL, public renderer, builder, publish workflow, generated artifact, and debug panels remain readable with the default theme.
- [ ] 5.5 Update the example README with theme usage and host customization notes.

## 6. Browser And Accessibility Verification

- [ ] 6.1 Add or update Playwright coverage for themed desktop builder/renderer surfaces.
- [ ] 6.2 Add or update Playwright coverage for themed narrow viewport behavior.
- [ ] 6.3 Add or update Playwright coverage for LTR and RTL themed renderer/builder behavior.
- [ ] 6.4 Add focus visibility checks for renderer and builder controls.
- [ ] 6.5 Add reduced-motion verification where practical through CSS assertions or browser emulation.
- [ ] 6.6 Use Browser plugin for rendered inspection when available and record page identity, nonblank UI, console health, screenshot evidence, and interaction proof.

## 7. Documentation And Reports

- [ ] 7.1 Update relevant package READMEs for renderer, builder, themes, and example styling boundaries.
- [ ] 7.2 Write `docs/reports/2026-05-15-phase-11-theme-design-system-readiness.md` with changed files, token contracts, CSS helper contracts, UI evidence, commands run, known limitations, and owner review checklist.
- [ ] 7.3 Document any deferred theme work such as dark mode, generated `.css` assets, theme gallery, or final brand selection.

## 8. Verification

- [ ] 8.1 Run `pnpm --filter @your-org/forms-themes test`.
- [ ] 8.2 Run `pnpm --filter @your-org/forms-themes typecheck`.
- [ ] 8.3 Run `pnpm --filter @your-org/forms-themes build`.
- [ ] 8.4 Run focused renderer, builder, and Vite example tests affected by theme integration.
- [ ] 8.5 Run `pnpm --filter @your-org/forms-example-vite-react test:e2e`.
- [ ] 8.6 Run `pnpm test`.
- [ ] 8.7 Run `pnpm build`.
- [ ] 8.8 Run `openspec validate implement-theme-design-system-readiness --strict`.
