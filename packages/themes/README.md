# @your-org/forms-themes

Optional starter tokens, CSS custom properties, and default CSS helpers for the React form builder.

## Responsibility

This package owns removable visual assets only:

- typed default theme tokens for color, typography, spacing, radius, shadow, motion, and component dimensions
- deterministic `--rfb-*` CSS custom property generation
- default renderer, builder, combined, focus, and reduced-motion CSS helper strings
- compatibility aliases for older `--rfb-*` renderer variables and `--fb-*` builder variables

## Boundary

Themes are optional. `@your-org/forms-core` must not depend on this package, React, CSS frameworks, or design-system libraries. Host apps can use these helpers, override their variables, or replace them entirely.

`DESIGN.md` is the source of truth for product design decisions. This package converts those decisions into package-ready tokens and CSS hooks without moving domain behavior into styling.

## Exports

- `defaultThemeTokens`: typed token object aligned with current design decisions.
- `defaultThemeVariableEntries`: ordered product-prefixed CSS variable entries.
- `createThemeVariables(options)`: returns deterministic CSS custom properties.
- `createRendererThemeStyles(options)`: variables plus renderer selectors.
- `createBuilderThemeStyles(options)`: variables plus builder selectors.
- `createDefaultThemeStyles(options)`: variables plus renderer and builder selectors.
- `createFocusThemeStyles()`: shared visible focus and disabled-state CSS.
- `createReducedMotionStyles()`: reduced-motion media-query CSS.

## Host Overrides

Host apps should prefer CSS variables over editing package CSS:

```css
.my-form-shell {
  --rfb-color-primary: #087568;
  --rfb-color-focus: #087568;
  --rfb-radius-md: 6px;
}
```

The default variable selector is `:where(.rfb-theme, .rfb-form, .rfb-builder)`. Use `createThemeVariables({ selector: ":root" })` when an app wants global variables, or wrap a single builder/renderer surface in a scoped class for local customization.

## Deferred Work

Dark mode, generated `.css` assets, a theme gallery, and final brand selection are intentionally deferred. The current package prepares stable contracts and class hooks without locking the product into a finished design system.
