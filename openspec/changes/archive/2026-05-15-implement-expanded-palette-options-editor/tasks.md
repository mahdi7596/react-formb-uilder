## 1. Scope And Proposal

- [x] 1.1 Confirm Phase 14 has been archived and `product-grade-field-inspector-model` is available in main specs.
- [x] 1.2 Confirm Phase 15 scope is limited to expanded palette and structured options editor.
- [x] 1.3 Confirm existing builder preview continues to use the real renderer.

## 2. Palette Expansion

- [x] 2.1 Inspect current core and renderer field support for URL, checkbox group, switch, time, rating, linear scale, hidden, read-only/display value, and file metadata.
- [x] 2.2 Add builder palette entries for supported MVP-hardening fields with labels, descriptions, icons, default names, and default nodes.
- [x] 2.3 Add minimal renderer parity for newly exposed basic fields so the preview remains the real respondent runtime.
- [x] 2.4 Add tests that the expanded palette entries are visible, searchable, and insert through commands.

## 3. Structured Options Editor

- [x] 3.1 Replace the raw options textarea with structured option rows for select, radio, and checkbox group fields.
- [x] 3.2 Add controls for option label and stable submitted value editing.
- [x] 3.3 Add controls for add, duplicate, delete, move up, and move down.
- [x] 3.4 Add disabled option toggles.
- [x] 3.5 Add default option controls where supported by current schema behavior.
- [x] 3.6 Add bulk paste that converts pasted lines into unique structured options.
- [x] 3.7 Preserve command-backed `updateOptions` usage and dangerous option diagnostics.

## 4. Verification And Documentation

- [x] 4.1 Update builder unit/component tests for structured options editor interactions.
- [x] 4.2 Update Playwright builder flow to create a dropdown with multiple structured options and preview it.
- [x] 4.3 Update `docs/integration/react-builder.md` with expanded palette and structured options behavior.
- [x] 4.4 Run `pnpm --filter @your-org/forms-react-builder test`.
- [x] 4.5 Run `pnpm --filter @your-org/forms-react-builder exec playwright test`.
- [x] 4.6 Run `pnpm build`.
- [x] 4.7 Run `openspec validate implement-expanded-palette-options-editor --strict`.
- [x] 4.8 Run `git diff --check`.
- [x] 4.9 Write `docs/reports/2026-05-15-phase-15-expanded-palette-options-editor.md` with changes, tests, screenshots or browser evidence, known limitations, and owner review checklist.
