## Context

`packages/core` now provides framework-neutral path parsing, condition evaluation, validation primitives, hidden/disabled filtering, submission normalization, backend response parsing, and migration scaffolding. `packages/validators` now provides optional JSON Schema generation. `packages/react-renderer` still exposes only a bootstrap placeholder, so there is no product-owned React API that can render a published canonical schema.

Phase 5 introduces the respondent renderer foundation. The primary stakeholders are host React apps, future Vite/Next examples, the future builder preview, backend integrators receiving normalized submissions, and accessibility reviewers. The renderer must depend on core without moving domain invariants into React components.

## Goals / Non-Goals

**Goals:**

- Provide a stable public `FormRenderer` API for rendering canonical schemas in React.
- Provide renderer provider/context, field registry, renderer slots, and submission adapter contracts.
- Render MVP built-in fields with accessible ids, labels, descriptions, required/disabled state, errors, and focus behavior.
- Render structural sections and steps from canonical schema children.
- Support basic single-page and multi-step navigation.
- Use core for conditions, validation, hidden/disabled filtering, default values, normalized submissions, submission envelopes, and backend response parsing.
- Keep React Hook Form internal if it is introduced.
- Add minimal styling hooks through CSS variables, class hooks, data attributes, and lightweight default styles.
- Add React component tests and accessibility-oriented checks for renderer contracts.

**Non-Goals:**

- No builder UI, palette, inspector, canvas, drag-and-drop, or preview integration.
- No runnable browser example or Playwright E2E; that remains Phase 6.
- No full visual design system or project `DESIGN.md`.
- No repeaters, upload orchestration, payment fields, arbitrary JavaScript expressions, or rich text authoring.
- No backend persistence implementation.
- No public React Hook Form API exposure.

## Decisions

### Decision 1: Product-owned public renderer API

Expose product concepts such as `FormRenderer`, `FormRendererProvider`, `FieldRegistry`, `RendererSlots`, `SubmissionAdapter`, and renderer event callbacks. Do not expose React Hook Form, AJV, or backend-specific transport types.

Alternative considered: expose a lower-level hook-first API shaped around React Hook Form. Rejected because the renderer must remain product-owned and backend-agnostic, and hosts should not need to understand internal form-state choices.

### Decision 2: Use internal React state first, leave RHF optional

Implement the foundation with renderer-managed value, touched, error, step, and submission state unless a specific implementation task proves React Hook Form is needed. If React Hook Form is added, it must remain internal and replaceable.

Alternative considered: add React Hook Form immediately. Deferred because MVP fields and core normalization can be proven with simpler state first, avoiding premature public coupling or dependency churn.

### Decision 3: Field registry is the extensibility boundary

Built-in fields should be registered through the same registry shape used by custom fields. A field component receives a renderer-owned field props contract: ids, label, description, value binding, change/blur handlers, required, disabled, hidden, error state, focus registration, node, and schema context.

Alternative considered: switch on field type directly inside `FormRenderer`. Rejected as the only mechanism because the future builder preview and host custom fields need a stable replacement/extension point.

### Decision 4: Core runtime remains the source of behavioral truth

The renderer should call core APIs for condition evaluation, validation primitives, hidden/disabled filtering, default values, normalized data, envelopes, and backend response parsing. React components may orchestrate user interactions, but they must not reimplement domain invariants.

Alternative considered: implement renderer-specific validation and condition logic for convenience. Rejected because it creates drift between renderer, builder preview, backend adapters, and compiler diagnostics.

### Decision 5: Accessibility is part of the field contract

Every built-in field must receive deterministic renderer-managed ids for input, label, description, and error text. The renderer must wire `aria-describedby`, `aria-invalid`, required state, disabled state, fieldsets/legends for radio and checkbox groups, focus targets, and server/client error display.

Alternative considered: rely on host-provided slots for accessibility. Rejected because the default renderer must be safe and usable before hosts customize it.

### Decision 6: Slots customize chrome, not domain behavior

Renderer slots can customize form chrome, section chrome, step chrome, field chrome, submit area, messages, and individual field rendering surfaces. Slots receive renderer state and callbacks, but schema mutation and validation semantics remain outside slots.

Alternative considered: make slots responsible for the entire render tree. Rejected because it would make the default renderer thin but push too much accessibility and behavior burden onto hosts.

### Decision 7: Minimal CSS hooks only

Ship minimal default styles or class hooks sufficient for readable tests and examples. Use CSS variables, data attributes, and stable class names. Do not define a full design system, color palette, or builder UI styling in this phase.

Alternative considered: build the visual design system during renderer foundation. Rejected because the project explicitly defers full design-system work and Phase 5 should prove contracts before polish.

## Risks / Trade-offs

- React dependencies may require package and tsconfig changes → Keep dependencies isolated to `packages/react-renderer` and verify workspace typecheck/test.
- Internal state may later need React Hook Form for performance → Keep state behind internal hooks and public APIs product-owned.
- Accessibility tests can become shallow if only DOM snapshots are checked → Add interaction-oriented assertions for labels, descriptions, errors, required/disabled state, fieldsets, and focus behavior.
- Step validation can get complex with hidden fields and conditions → Scope to current-step MVP and rely on core hidden/disabled semantics.
- Custom field registry can become too broad → Start with the stable field props contract needed by built-ins and extension registration.
- Minimal styling may look plain → Accept for Phase 5; Phase 6 gives browser-reviewable output and later design-system phases can improve visuals.

## Migration Plan

1. Replace the renderer placeholder tests with failing React renderer contract tests.
2. Add package/test dependencies needed for React component tests and accessibility checks.
3. Define renderer public types, field registry types, slot types, submission adapter types, and internal renderer state helpers.
4. Implement schema traversal helpers for render order and step/section child resolution.
5. Implement default field components and field chrome.
6. Implement visibility, disabled state, validation, server error mapping, and submission orchestration through core APIs.
7. Add minimal styling hooks and export them in a host-friendly way.
8. Run package and workspace verification.
9. Write `docs/reports/2026-05-14-phase-5-react-renderer.md`.
10. Commit and stop for owner review before Phase 6 example/browser work.

Rollback is straightforward while no later phase depends on the renderer foundation: revert the Phase 5 implementation commit and keep the archived/spec artifacts as the record of intended behavior.

## Open Questions

- Should Phase 5 add React Hook Form internally, or keep the first renderer state implementation dependency-light?
- Which axe-compatible test utility should be used in this repo for component-level accessibility checks?
- Should file metadata fields render as a JSON/text metadata editor in Phase 5 tests, or as a minimal host-controlled field surface until upload phases specify richer behavior?
