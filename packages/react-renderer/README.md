# @your-org/forms-react-renderer

Public React renderer for respondent-facing forms.

## Responsibility

This package renders canonical schemas with product-owned field contracts, renderer slots, accessibility ids, validation errors, submission status messages, step navigation, and normalized submission envelopes.

React Hook Form may be used internally later, but it must remain hidden behind this package's API. Canonical schema behavior, hidden-value semantics, validation primitives, submitted-path parsing, and submission contracts belong in `@your-org/forms-core`.

## Theme Boundary

`createRendererStyles()` composes the default renderer theme from `@your-org/forms-themes`. The renderer keeps stable class hooks and data attributes such as:

- `.rfb-form`, `.rfb-field`, `.rfb-label`, `.rfb-description`, `.rfb-error`
- `.rfb-section`, `.rfb-step`, `.rfb-messages`, `.rfb-navigation`, `.rfb-submit-button`
- `data-rfb-field-type`, `data-rfb-invalid`, `data-rfb-disabled`, `data-rfb-submission-status`

Hosts can use `createRendererStyles()`, import theme helpers directly, override `--rfb-*` variables, or replace styling with their own CSS. Slots remain replaceable and do not own core semantics.

## Testing

Renderer tests cover built-in fields, accessibility, hidden-field semantics, validation, backend response mapping, normalized envelopes, slots, data attributes, theme variables, focus styles, and reduced-motion CSS.
