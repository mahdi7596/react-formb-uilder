## Why

Phase 16 continues the product-completion plan after the expanded palette and structured options editor. The builder still feels incomplete because common validation and logic are edited through either a required checkbox or raw condition JSON. Serious form builders let creators configure requiredness, length/number limits, patterns, selection counts, visibility rules, and conditional requiredness through safe visual controls.

Phase 16 adds the first working visual validation and logic-builder foundation while preserving the existing canonical schema, declarative condition model, command-backed schema edits, and real-renderer preview.

## What Changes

- Add visual validation controls for required, min/max length, min/max number, pattern, email, URL, and min/max selected rules.
- Add a visual logic editor for common show/hide and require/unrequire behavior using the existing declarative condition model.
- Support AND/OR condition groups with multiple simple field comparisons.
- Keep the advanced condition JSON visible as a read-only developer/debug representation rather than the main authoring workflow.
- Surface unsupported logic actions as explicit diagnostics instead of silently persisting unsupported behavior.
- Make hidden-value behavior visible in the inspector.
- Add tests for visual rule creation, validation-rule runtime parity, and builder UI interactions.
- Write a Phase 16 report for owner review.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `builder-ui-foundation`: Adds visual validation controls and a safe visual logic-builder foundation.
- `canonical-contracts`: Clarifies that conditional validation rules use declarative conditions and unsupported visual logic actions must fail closed.

## Impact

- Affected packages: `packages/react-builder` and `packages/core`.
- Affected docs: Phase 16 report under `docs/reports/`.
- Affected tests: core validation tests, builder component tests, and Playwright builder flow.
- Package boundaries: React logic remains in `packages/react-builder`; condition and validation runtime behavior stays framework-agnostic in `packages/core`.
- Runtime dependencies: no new frontend framework, backend dependency, or executable schema behavior.
