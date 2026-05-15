# Phase 17 Persian, RTL, And Iran Localization Report

Date: 2026-05-15

Status: complete, pending owner review and archive.

## Phase Position

- Current phase completed: Phase 17 of 7 fixed product-completion phases.
- Phase name: Persian, RTL, And Iran Localization Foundation.
- Fixed phases remaining after this phase: 3.
- Next phase: Phase 18, Content, Layout, And Real-Form Authoring Blocks.

## What Changed

- Archived Phase 16 and synced visual validation/logic requirements into main OpenSpec specs.
- Created OpenSpec change `implement-persian-rtl-iran-localization`.
- Added optional IranYekan `@font-face` helper in `packages/themes`.
- Added Persian builder and renderer dictionaries with host override support.
- Ensured renderer form direction follows RTL/Persian locale behavior.
- Kept submitted paths, node ids, JSON, and technical values LTR in RTL screens.
- Added Persian/Arabic digit normalization.
- Added Iran mobile, national ID, and postal code validators with registered keys.
- Documented Iran province/city as preset or adapter-backed option source, not a hard-coded core field.

## Validation

Passed:

- `pnpm --filter @your-org/forms-themes test`
- `pnpm --filter @your-org/forms-validators test`
- `pnpm --filter @your-org/forms-react-renderer test`
- `pnpm --filter @your-org/forms-react-builder test`
- `pnpm --filter @your-org/forms-react-renderer typecheck`
- `pnpm --filter @your-org/forms-react-builder typecheck`
- `pnpm --filter @your-org/forms-react-builder exec playwright test`
- `pnpm build`
- `openspec instructions apply --change implement-persian-rtl-iran-localization --json`
- `openspec validate implement-persian-rtl-iran-localization --strict`
- `openspec validate --specs --strict`
- `git diff --check`

## Known Limitations

- This phase adds lightweight dictionaries, not a full i18n framework.
- Jalali date picker/display is still future work.
- Iran province/city is documented as a future preset or adapter-backed option source.
- Production Persian/Iran templates are Phase 19.

## Owner Review Checklist

- Confirm Persian builder labels appear in RTL mode.
- Confirm renderer Persian submit/success strings appear for Persian locale.
- Confirm IranYekan helper is optional and uses package-owned assets.
- Confirm Iran validators cover mobile, national ID, and postal code.
- Confirm Phase 18 should start next.
