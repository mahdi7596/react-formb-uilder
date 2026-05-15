# Implement Production Templates Examples

## Why

The example app still feels like an engineering harness. Phase 19 must make the visible output feel like a credible form-builder product by showing realistic English and Persian forms, structured options, visual logic, renderer-only embedding, and builder preview parity.

## What Changes

- Replace demo-style example copy with realistic production templates.
- Add English intake and Persian RTL customer intake schemas.
- Add structured choice examples for dropdown, radio, and checkbox group fields.
- Add a visual logic example using the safe declarative condition model.
- Add a renderer-only embed example.
- Add docs and tests that prove builder-to-renderer preview parity for realistic forms.

## Impact

- Touches `examples/vite-react/src/`, example Playwright tests, and integration docs.
- Does not change package contracts beyond documenting production example expectations.
- Keeps Persian/Iran province/city as a preset-style select example, not a hard-coded core field.

