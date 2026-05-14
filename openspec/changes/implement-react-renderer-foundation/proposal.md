## Why

The core runtime and JSON Schema compiler are now in place, but host React apps still cannot render or submit a published canonical form schema. Phase 5 is needed to turn the backend-agnostic contracts into a product-owned respondent renderer API while keeping React implementation details out of core and out of backend contracts.

## What Changes

- Replace the `packages/react-renderer` bootstrap placeholder with the first real renderer foundation.
- Define public renderer APIs for `FormRenderer`, renderer provider/context, field registry, renderer slots, and submission adapter contracts.
- Render canonical schemas using `packages/core` for conditions, validation primitives, hidden-value filtering, normalized submission data, and submission envelope creation.
- Add renderer-managed ids, labels, descriptions, error text, required/disabled state, and focus target behavior for built-in fields.
- Implement MVP built-in fields: text, textarea, number, email, phone, select, radio, checkbox, date, hidden, and file metadata.
- Implement structural rendering for sections and steps, including basic current-step navigation and current-step validation.
- Add minimal styling hooks through CSS variables, data attributes, class hooks, and lightweight default styles without defining the full design system.
- Add React Testing Library coverage and accessibility-oriented checks for built-in field contracts, conditional visibility, step navigation, server error mapping, and submission envelope creation.
- Keep React Hook Form internal if introduced. No React Hook Form types, resolvers, field arrays, or form state may appear in public package APIs.
- Deferred: runnable browser example pages and Playwright E2E remain Phase 6; builder preview and builder UI remain later phases.

## Capabilities

### New Capabilities

- `react-renderer-foundation`: Public respondent renderer API, field registry, slots, built-in MVP fields, accessibility wiring, step orchestration, conditional visibility, validation display, submission envelope creation, and renderer styling hooks.

### Modified Capabilities

- None.

## Impact

- Affected package: `packages/react-renderer`.
- Affected docs: Phase 5 report under `docs/reports/`.
- Affected tests: React renderer package tests and workspace typecheck/test commands.
- Dependencies may add React runtime/dev testing support for the renderer package, such as React, React DOM, React Testing Library, jsdom, and axe-compatible test utilities. React Hook Form may be added only if hidden behind product-owned renderer APIs.
- `packages/core` must remain framework-agnostic and must not import React or renderer code.
