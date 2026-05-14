## 1. Renderer Test And Dependency Scaffold

- [x] 1.1 Replace the renderer bootstrap placeholder test with failing React renderer contract tests
- [x] 1.2 Add package scripts so `pnpm --filter @your-org/forms-react-renderer test` runs renderer tests
- [x] 1.3 Add React component test dependencies needed for this phase
- [x] 1.4 Add an axe-compatible accessibility test utility or helper for renderer component checks
- [x] 1.5 Configure renderer tests to run in a DOM-capable environment without affecting core tests
- [x] 1.6 Add failing tests proving public exports do not expose React Hook Form types
- [x] 1.7 Add failing tests for renderer API, registry, slots, built-in fields, conditions, steps, submission, and backend error mapping

## 2. Public API And Package Boundary

- [x] 2.1 Replace the bootstrap `packageBoundary` export with renderer public exports
- [x] 2.2 Define `FormRenderer` props and result/callback types
- [x] 2.3 Define `FormRendererProvider` and renderer context types
- [x] 2.4 Define field registry types and default registry creation APIs
- [x] 2.5 Define renderer slot types for form, section, step, field chrome, messages, navigation, and submit controls
- [x] 2.6 Define submission adapter contracts using product-owned JSON contracts
- [x] 2.7 Confirm public APIs do not expose React Hook Form, transport, backend-specific, or builder-specific types

## 3. Schema Rendering Model

- [x] 3.1 Add renderer-safe schema/node helper types that consume canonical schema records without redefining core contracts
- [x] 3.2 Implement node lookup and child resolution for flat canonical schema nodes
- [x] 3.3 Implement render-order resolution for root nodes, sections, and steps
- [x] 3.4 Implement unsupported-node and unsupported-field diagnostics or safe fallback state
- [x] 3.5 Keep schema traversal behavior aligned with `packages/core` analysis diagnostics

## 4. Renderer State And Core Integration

- [x] 4.1 Implement default value initialization through core default resolution
- [x] 4.2 Implement renderer-managed value state and change/blur handlers
- [x] 4.3 Implement touched/error/submission status state without exposing internal state-library types
- [x] 4.4 Implement conditional visibility evaluation through core condition behavior
- [x] 4.5 Implement enabled/disabled evaluation through core condition behavior
- [x] 4.6 Implement client validation for visible enabled fields through core validation primitives
- [x] 4.7 Implement hidden and disabled final submission filtering through core normalization behavior
- [x] 4.8 Implement normalized submission envelope creation through core submission behavior
- [x] 4.9 Implement backend response parsing and field/global error mapping through core response behavior

## 5. Field Contract And Built-In Fields

- [x] 5.1 Define renderer field props with ids, node, value binding, change/blur handlers, required state, disabled state, error state, description, and focus registration
- [x] 5.2 Implement shared field chrome for label, description, error, required, disabled, and invalid state
- [x] 5.3 Implement text field rendering
- [x] 5.4 Implement textarea field rendering
- [x] 5.5 Implement number field rendering with value conversion compatible with core validation
- [x] 5.6 Implement email field rendering
- [x] 5.7 Implement phone field rendering
- [x] 5.8 Implement date field rendering
- [x] 5.9 Implement select field rendering with enabled options
- [x] 5.10 Implement radio field rendering with accessible group semantics
- [x] 5.11 Implement checkbox field rendering
- [x] 5.12 Implement hidden field behavior without visible chrome
- [x] 5.13 Implement minimal file metadata field surface for metadata references only
- [x] 5.14 Implement unknown field fallback that fails closed and does not submit unknown values

## 6. Accessibility Contract

- [x] 6.1 Generate deterministic renderer-managed ids for fields, labels, descriptions, and errors
- [x] 6.2 Wire label associations for built-in fields
- [x] 6.3 Wire `aria-describedby` for descriptions and errors
- [x] 6.4 Wire `aria-invalid` and error display for client and server errors
- [x] 6.5 Wire required and disabled state semantically
- [x] 6.6 Use fieldset/legend or equivalent accessible grouping for radio and checkbox group-style controls
- [x] 6.7 Implement first-invalid-field focus target registration and focusing behavior
- [x] 6.8 Add accessibility-oriented tests for built-in fields and error states

## 7. Sections, Steps, And Navigation

- [x] 7.1 Implement section rendering with child nodes in canonical child order
- [x] 7.2 Implement single-page rendering for visible renderable nodes
- [x] 7.3 Implement step rendering for `navigation: "steps"`
- [x] 7.4 Implement next, previous, and submit navigation affordances for steps
- [x] 7.5 Implement current-step validation before advancing
- [x] 7.6 Implement hidden-step skipping behavior for conditionally hidden steps
- [x] 7.7 Add tests for section order, single-page rendering, step navigation, current-step validation, and hidden-step behavior

## 8. Slots And Styling Hooks

- [x] 8.1 Implement default form, section, step, field chrome, message, navigation, and submit slot components
- [x] 8.2 Allow host-provided slots to replace renderer chrome while preserving renderer behavior
- [x] 8.3 Add stable class hooks for form, field, label, description, error, section, step, navigation, and submit controls
- [x] 8.4 Add stable data attributes for field type, visibility, invalid state, disabled state, current step, and submission status
- [x] 8.5 Add minimal default styles or style export hooks without defining the full design system
- [x] 8.6 Add tests proving slots receive renderer state and callbacks without owning core semantics

## 9. Submission Flow

- [x] 9.1 Implement submit handling for valid single-page forms
- [x] 9.2 Implement submit handling for valid multi-step forms
- [x] 9.3 Generate submission attempt ids or accept a host-provided attempt id factory
- [x] 9.4 Generate submitted timestamps or accept a host-provided clock
- [x] 9.5 Call the submission adapter with a normalized core-created envelope
- [x] 9.6 Display global success, validation, conflict, auth, rate-limit, and server-error states from normalized backend responses
- [x] 9.7 Focus the first field with a server validation error when appropriate
- [x] 9.8 Add tests for successful submission, server validation errors, global errors, and envelope fields

## 10. Boundary Verification And Report

- [x] 10.1 Run `pnpm --filter @your-org/forms-react-renderer test`
- [x] 10.2 Run `pnpm --filter @your-org/forms-react-renderer typecheck`
- [x] 10.3 Run `pnpm test`
- [x] 10.4 Run `pnpm typecheck`
- [x] 10.5 Confirm `packages/core` still has no dependency on React or `packages/react-renderer`
- [x] 10.6 Confirm renderer public exports do not expose React Hook Form types
- [x] 10.7 Run OpenSpec validation for `implement-react-renderer-foundation`
- [x] 10.8 Write `docs/reports/2026-05-14-phase-5-react-renderer.md`
- [x] 10.9 Include changed files, renderer APIs, field contract behavior, accessibility coverage, commands run, results, dependency boundary check, known limitations, and owner review checklist in the report
- [x] 10.10 Commit Phase 5 proposal artifacts, renderer implementation, tests, and report after verification succeeds
- [x] 10.11 Stop after Phase 5 and request owner review before Phase 6 example app and browser E2E work begins
