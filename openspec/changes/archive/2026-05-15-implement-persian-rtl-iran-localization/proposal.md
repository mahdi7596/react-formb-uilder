## Why

Phase 17 makes Persian, RTL, and Iran-specific behavior first-class rather than a late cosmetic change. The project already has RTL-aware shell layout and IranYekan font assets, but the builder/renderer strings, optional font helper, Persian digit handling, and Iran validators are not wired yet.

## What Changes

- Add Persian builder and renderer string dictionaries with locale-aware defaults.
- Add optional IranYekan `@font-face` theme helper using package-owned font assets.
- Keep technical values such as submitted paths, ids, URLs, and JSON LTR inside RTL screens.
- Add Persian/Arabic digit normalization utilities.
- Add Iran mobile, national ID, and postal code validators as registered validator keys.
- Document Iran province/city as a preset/adapter-backed option-source contract, not a hard-coded core field.
- Add tests, docs, and a Phase 17 report.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `theme-design-system-readiness`: Adds optional IranYekan font-face helper and RTL font usage expectations.
- `builder-ui-foundation`: Adds Persian builder string support and RTL technical-value behavior.
- `react-renderer-foundation`: Adds Persian renderer strings and RTL runtime behavior.
- `canonical-contracts`: Clarifies regional validator and Iran province/city boundaries.

## Impact

- Affected packages: `packages/themes`, `packages/react-renderer`, `packages/react-builder`, and `packages/validators`.
- Affected docs: localization docs and Phase 17 report.
- Runtime dependencies: no new dependency, no country-specific logic inside `packages/core`.
