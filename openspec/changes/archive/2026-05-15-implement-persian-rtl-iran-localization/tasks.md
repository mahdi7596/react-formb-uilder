## 1. Scope And Proposal

- [x] 1.1 Confirm Phase 16 is archived and visual validation/logic behavior is in main specs.
- [x] 1.2 Create and validate the Phase 17 OpenSpec change.
- [x] 1.3 Keep Phase 17 limited to Persian/RTL/Iran localization foundation.

## 2. Theme And Fonts

- [x] 2.1 Add optional IranYekan `@font-face` helper using `packages/themes/assets/fonts/iranyekan/`.
- [x] 2.2 Use `fontRtl`/direction-aware CSS without forcing IranYekan on every host.
- [x] 2.3 Add themes tests for deterministic font helper output.

## 3. Builder And Renderer Localization

- [x] 3.1 Add Persian builder string dictionary and message override contract.
- [x] 3.2 Add Persian renderer string dictionary and message override contract.
- [x] 3.3 Ensure technical values remain LTR in RTL screens.
- [x] 3.4 Add builder and renderer tests for Persian/RTL strings.

## 4. Iran Validation Foundation

- [x] 4.1 Add Persian/Arabic digit normalization utility.
- [x] 4.2 Add Iran mobile validator registration.
- [x] 4.3 Add Iran national ID validator registration.
- [x] 4.4 Add Iran postal code validator registration.
- [x] 4.5 Add validator tests.

## 5. Documentation And Verification

- [x] 5.1 Document Iran province/city preset/adapter boundary.
- [x] 5.2 Add localization docs.
- [x] 5.3 Run package tests for themes, validators, renderer, and builder.
- [x] 5.4 Run Playwright RTL builder/renderer flow.
- [x] 5.5 Run `pnpm build`.
- [x] 5.6 Run OpenSpec validation and `git diff --check`.
- [x] 5.7 Write the Phase 17 report.
