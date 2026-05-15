## Context

The product-completion plan explicitly says Persian, RTL, and Iran-specific fields are part of the completion plan. Font assets already live in `packages/themes/assets/fonts/iranyekan/`. Current styling has `fontRtl`, logical CSS, and RTL panel placement, but user-visible strings are still mostly English and Iran validation is not available.

## Goals / Non-Goals

**Goals:**

- Provide Persian strings for the builder and renderer without requiring host apps to translate every label.
- Keep package boundaries intact: no React or CSS in core, no regional validators hard-coded into core.
- Make IranYekan optional through themes, not mandatory.
- Normalize Persian/Arabic digits where validators need ASCII digits.
- Provide Iran mobile, national ID, and postal code validators by key.
- Specify Iran province/city as a future preset or adapter-backed option source.

**Non-Goals:**

- Full i18n framework integration.
- Jalali calendar implementation.
- Hard-coded province/city field in core.
- Translating every example/template; Phase 19 owns production examples.

## Decisions

### Use package-owned lightweight dictionaries

Builder and renderer receive optional `messages` overrides and choose Persian defaults when `locale` starts with `fa`. This keeps host customization simple and avoids introducing a full i18n dependency.

### Keep Iran validators in validators package

Iran-specific validation helpers live in `packages/validators`, exported as named functions and validator registrations. Core remains generic and only knows custom validators by key.

### Province/city is not a hard-coded core field

Iran province/city should be a preset composed field or adapter-backed option source. Phase 17 documents and prepares the boundary; it does not add a hard-coded country dataset to core.
