# Persian, RTL, And Iran Localization

Date: 2026-05-15

Persian and RTL support is implemented as package-level localization behavior, not as backend-specific or core-specific behavior.

`packages/react-builder` and `packages/react-renderer` include lightweight English and Persian dictionaries. Persian defaults are selected when the active locale starts with `fa`, and hosts may override individual messages through package props.

Persisted schema values do not change when UI strings are localized. Stable node ids, submitted paths, option values, revision ids, and backend contracts remain language-neutral.

Technical values stay LTR in RTL screens where readability and safety matter: submitted paths, node ids, revision ids, option submitted values, URLs, and generated JSON.

IranYekan assets live in `packages/themes/assets/fonts/iranyekan/`. Hosts can opt in with `createIranYekanFontFace()` from `@your-org/forms-themes`; this updates `--rfb-font-rtl` without forcing every host app to use IranYekan.

`packages/validators` exports `normalizePersianArabicDigits`, `isIranMobile`, `isIranNationalId`, `isIranPostalCode`, and `iranValidatorRegistrations`.

Registered keys:

- `custom:ir.mobile`
- `custom:ir.nationalId`
- `custom:ir.postalCode`

Iran province/city should be implemented as either a composed preset field backed by structured dropdowns, or an adapter-backed dynamic option source. It should not be hard-coded into `packages/core`.
