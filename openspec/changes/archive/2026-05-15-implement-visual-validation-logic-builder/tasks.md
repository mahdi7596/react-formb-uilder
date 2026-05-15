## 1. Scope And Proposal

- [x] 1.1 Confirm Phase 15 is archived and expanded palette behavior is in main specs.
- [x] 1.2 Create and validate the Phase 16 OpenSpec change.
- [x] 1.3 Keep Phase 16 limited to visual validation and first logic-builder foundation.

## 2. Core Runtime Parity

- [x] 2.1 Update core validation runtime so validation rules with `when` conditions are evaluated through the existing condition runtime.
- [x] 2.2 Add tests showing conditional requiredness validates only when its condition is true.
- [x] 2.3 Preserve fail-closed diagnostics for unsupported predicates or invalid condition behavior.

## 3. Visual Validation Controls

- [x] 3.1 Replace validation-only required checkbox with field-aware visual validation controls.
- [x] 3.2 Support required, min/max length, min/max number, pattern, email, URL, and min/max selected where relevant.
- [x] 3.3 Persist validation changes through `updateValidation`.
- [x] 3.4 Keep dangerous requiredness diagnostics visible.

## 4. Visual Logic Builder

- [x] 4.1 Add visual visibility logic controls for show/hide behavior.
- [x] 4.2 Add conditional requiredness controls through validation rule `when`.
- [x] 4.3 Support AND/OR condition groups with simple field/operator/value rows.
- [x] 4.4 Show advanced condition JSON as read-only/debug output.
- [x] 4.5 Surface unsupported logic actions or unsupported existing condition shapes as diagnostics instead of silently saving.
- [x] 4.6 Make hidden-field value semantics visible in the inspector.

## 5. Verification And Documentation

- [x] 5.1 Update builder component tests for visual validation and logic interactions.
- [x] 5.2 Update Playwright flow so a creator builds simple logic without writing JSON.
- [x] 5.3 Update integration docs if needed.
- [x] 5.4 Run `pnpm --filter @your-org/forms-core test`.
- [x] 5.5 Run `pnpm --filter @your-org/forms-react-builder test`.
- [x] 5.6 Run `pnpm --filter @your-org/forms-react-builder exec playwright test`.
- [x] 5.7 Run `pnpm build`.
- [x] 5.8 Run `openspec validate implement-visual-validation-logic-builder --strict`.
- [x] 5.9 Run `git diff --check`.
- [x] 5.10 Write `docs/reports/2026-05-15-phase-16-visual-validation-logic-builder.md` with changes, tests, known limitations, and owner review checklist.
