# Phase 5 React Renderer Foundation Report

Date: 2026-05-14
Change: `implement-react-renderer-foundation`
Status: implemented and ready for owner review

## Summary

Phase 5 adds the first React respondent-rendering foundation in `packages/react-renderer`. The renderer consumes the canonical schema, delegates domain behavior to `packages/core`, renders built-in MVP fields, supports custom field registry entries and slots, handles single-page and stepped navigation, creates normalized submission envelopes, and maps normalized backend responses back into field and global UI state.

This phase still does not create the browser-viewable example app. The first app output for manual browser review is planned for Phase 6, where the renderer will be wired into `examples/vite-react` with Playwright/browser checks. The first builder UI output remains planned for a later builder phase.

## Changed Files

- `packages/react-renderer/package.json`
- `packages/react-renderer/tsconfig.json`
- `packages/react-renderer/src/index.tsx`
- `packages/react-renderer/src/index.test.tsx`
- `packages/react-renderer/src/index.ts` removed
- `packages/react-renderer/src/index.test.ts` removed
- `vitest.config.ts`
- `pnpm-lock.yaml`
- `docs/reports/2026-05-14-phase-5-react-renderer.md`
- `openspec/changes/implement-react-renderer-foundation/tasks.md`

## Public APIs Added

- `FormRenderer`
- `FormRendererProvider`
- `useFormRenderer`
- `createDefaultFieldRegistry(overrides?)`
- `createRendererStyles()`
- `RendererSchema`
- `RendererNode`
- `RendererFieldProps`
- `RendererFieldIds`
- `FieldRenderer`
- `FieldRegistry`
- `RendererSlots`
- `FieldChromeSlotProps`
- `FormSlotProps`
- `SectionSlotProps`
- `StepSlotProps`
- `MessageSlotProps`
- `NavigationSlotProps`
- `RendererSubmissionStatus`
- `SubmissionAdapter`
- `FormRendererProps`
- `FormRendererContextValue`

React Hook Form was not introduced or exposed. The renderer API is product-owned and can later hide React Hook Form internally if we decide it helps respondent value handling.

## Field Contract Behavior

The renderer field contract now provides:

- Canonical node metadata and stable renderer-managed ids.
- Current value plus `onChange` and `onBlur` bindings.
- Required, disabled, invalid, and error state.
- Label, description, options, and field type data.
- Focus registration for first-invalid-field behavior.

Built-in fields implemented:

- `text`
- `textarea`
- `number`
- `email`
- `phone`
- `date`
- `select`
- `radio`
- `checkbox`
- `hidden`
- `fileMetadata`

Unknown fields and unsupported nodes render safe fallback status UI and do not silently submit unknown field values.

## Core Integration

The renderer delegates durable behavior to `packages/core`:

- Default values use `resolveDefaultValues`.
- Visibility and enabled state use `evaluateCondition`.
- Client validation uses `validateFieldValue`.
- Submission envelopes use `createSubmissionEnvelope`.
- Backend responses use `parseBackendResponse`.

The renderer keeps React state local to respondent rendering and does not move domain invariants into React components.

## Accessibility Coverage

Implemented and tested:

- Deterministic field, label, description, and error ids.
- Label associations for built-in fields.
- `aria-describedby` for descriptions and errors.
- `aria-invalid` and field-level error display.
- Semantic `required` and `disabled` state.
- Radio groups with `role="radiogroup"` and named group semantics.
- First invalid client or server field receives focus.
- Axe-compatible accessibility check for the built-in field surface.

## Navigation And Submission

Implemented and tested:

- Single-page rendering for visible root nodes.
- Section rendering in canonical child order.
- Step rendering for `navigation: "steps"`.
- Previous, next, and submit controls.
- Current-step validation before advancing.
- Hidden step skipping.
- Host-provided attempt id factory and clock.
- Normalized submission adapter calls.
- Field and global backend validation error mapping.
- Success message display after normalized successful responses.

## Slots And Styling Hooks

The renderer includes default chrome plus host override hooks for form, section, step, field chrome, messages, and navigation. Stable hooks were added through class names and data attributes for form, fields, field type, invalid state, disabled state, sections, steps, navigation, submit buttons, and submission status.

`createRendererStyles()` exposes minimal default CSS variables and baseline selectors without defining the full design system.

## Verification

- `pnpm --filter @your-org/forms-react-renderer test`: passed, 1 file and 6 tests.
- `pnpm --filter @your-org/forms-react-renderer typecheck`: passed.
- `pnpm test`: passed, 18 files and 44 tests.
- `pnpm typecheck`: passed.
- `openspec validate implement-react-renderer-foundation --strict`: passed.
- `rg "@your-org/forms-react-renderer|packages/react-renderer|FormRenderer|from \"react\"|from 'react'" packages/core packages/core/package.json`: no matches.
- `rg "react-hook-form|Controller|FieldArray|formState|resolver" packages/react-renderer/src/index.tsx packages/react-renderer/package.json`: no matches.

## Dependency Boundary Check

`packages/react-renderer` depends on `@your-org/forms-core` and React, as intended.

`packages/core` still has no dependency on React, `packages/react-renderer`, React Hook Form, TanStack Query, dnd-kit, transport code, backend-specific code, design-system components, or upload providers.

The renderer package now has DOM-capable component tests without changing core tests away from their Node environment.

## Known Limitations

- No browser-visible example app is included in this phase.
- No Playwright/browser screenshot verification is included in this phase; that belongs to Phase 6.
- React Hook Form remains intentionally absent. If introduced later, it must stay internal to the renderer API.
- Repeaters and upload lifecycle UI are still outside MVP scope.
- The minimal file metadata field is only a metadata-reference surface, not an upload flow.
- The default styles are intentionally basic and not the future design system.
- Async options, persistence, publish/revision flows, and builder preview integration are future phases.

## Owner Review Checklist

- [ ] I reviewed the changed files.
- [ ] I reviewed the `FormRenderer` API and renderer public exports.
- [ ] I reviewed the built-in field behavior and field contract.
- [ ] I reviewed the accessibility behavior and test coverage.
- [ ] I reviewed the submission envelope and backend response mapping behavior.
- [ ] I understand that Phase 5 output is a renderer package/API/test output, not yet a browser example app.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

-
