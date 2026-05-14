## 1. Renderer Test And Dependency Scaffold

- [ ] 1.1 Replace the renderer bootstrap placeholder test with failing React renderer contract tests
- [ ] 1.2 Add package scripts so `pnpm --filter @your-org/forms-react-renderer test` runs renderer tests
- [ ] 1.3 Add React component test dependencies needed for this phase
- [ ] 1.4 Add an axe-compatible accessibility test utility or helper for renderer component checks
- [ ] 1.5 Configure renderer tests to run in a DOM-capable environment without affecting core tests
- [ ] 1.6 Add failing tests proving public exports do not expose React Hook Form types
- [ ] 1.7 Add failing tests for renderer API, registry, slots, built-in fields, conditions, steps, submission, and backend error mapping

## 2. Public API And Package Boundary

- [ ] 2.1 Replace the bootstrap `packageBoundary` export with renderer public exports
- [ ] 2.2 Define `FormRenderer` props and result/callback types
- [ ] 2.3 Define `FormRendererProvider` and renderer context types
- [ ] 2.4 Define field registry types and default registry creation APIs
- [ ] 2.5 Define renderer slot types for form, section, step, field chrome, messages, navigation, and submit controls
- [ ] 2.6 Define submission adapter contracts using product-owned JSON contracts
- [ ] 2.7 Confirm public APIs do not expose React Hook Form, transport, backend-specific, or builder-specific types

## 3. Schema Rendering Model

- [ ] 3.1 Add renderer-safe schema/node helper types that consume canonical schema records without redefining core contracts
- [ ] 3.2 Implement node lookup and child resolution for flat canonical schema nodes
- [ ] 3.3 Implement render-order resolution for root nodes, sections, and steps
- [ ] 3.4 Implement unsupported-node and unsupported-field diagnostics or safe fallback state
- [ ] 3.5 Keep schema traversal behavior aligned with `packages/core` analysis diagnostics

## 4. Renderer State And Core Integration

- [ ] 4.1 Implement default value initialization through core default resolution
- [ ] 4.2 Implement renderer-managed value state and change/blur handlers
- [ ] 4.3 Implement touched/error/submission status state without exposing internal state-library types
- [ ] 4.4 Implement conditional visibility evaluation through core condition behavior
- [ ] 4.5 Implement enabled/disabled evaluation through core condition behavior
- [ ] 4.6 Implement client validation for visible enabled fields through core validation primitives
- [ ] 4.7 Implement hidden and disabled final submission filtering through core normalization behavior
- [ ] 4.8 Implement normalized submission envelope creation through core submission behavior
- [ ] 4.9 Implement backend response parsing and field/global error mapping through core response behavior

## 5. Field Contract And Built-In Fields

- [ ] 5.1 Define renderer field props with ids, node, value binding, change/blur handlers, required state, disabled state, error state, description, and focus registration
- [ ] 5.2 Implement shared field chrome for label, description, error, required, disabled, and invalid state
- [ ] 5.3 Implement text field rendering
- [ ] 5.4 Implement textarea field rendering
- [ ] 5.5 Implement number field rendering with value conversion compatible with core validation
- [ ] 5.6 Implement email field rendering
- [ ] 5.7 Implement phone field rendering
- [ ] 5.8 Implement date field rendering
- [ ] 5.9 Implement select field rendering with enabled options
- [ ] 5.10 Implement radio field rendering with accessible group semantics
- [ ] 5.11 Implement checkbox field rendering
- [ ] 5.12 Implement hidden field behavior without visible chrome
- [ ] 5.13 Implement minimal file metadata field surface for metadata references only
- [ ] 5.14 Implement unknown field fallback that fails closed and does not submit unknown values

## 6. Accessibility Contract

- [ ] 6.1 Generate deterministic renderer-managed ids for fields, labels, descriptions, and errors
- [ ] 6.2 Wire label associations for built-in fields
- [ ] 6.3 Wire `aria-describedby` for descriptions and errors
- [ ] 6.4 Wire `aria-invalid` and error display for client and server errors
- [ ] 6.5 Wire required and disabled state semantically
- [ ] 6.6 Use fieldset/legend or equivalent accessible grouping for radio and checkbox group-style controls
- [ ] 6.7 Implement first-invalid-field focus target registration and focusing behavior
- [ ] 6.8 Add accessibility-oriented tests for built-in fields and error states

## 7. Sections, Steps, And Navigation

- [ ] 7.1 Implement section rendering with child nodes in canonical child order
- [ ] 7.2 Implement single-page rendering for visible renderable nodes
- [ ] 7.3 Implement step rendering for `navigation: "steps"`
- [ ] 7.4 Implement next, previous, and submit navigation affordances for steps
- [ ] 7.5 Implement current-step validation before advancing
- [ ] 7.6 Implement hidden-step skipping behavior for conditionally hidden steps
- [ ] 7.7 Add tests for section order, single-page rendering, step navigation, current-step validation, and hidden-step behavior

## 8. Slots And Styling Hooks

- [ ] 8.1 Implement default form, section, step, field chrome, message, navigation, and submit slot components
- [ ] 8.2 Allow host-provided slots to replace renderer chrome while preserving renderer behavior
- [ ] 8.3 Add stable class hooks for form, field, label, description, error, section, step, navigation, and submit controls
- [ ] 8.4 Add stable data attributes for field type, visibility, invalid state, disabled state, current step, and submission status
- [ ] 8.5 Add minimal default styles or style export hooks without defining the full design system
- [ ] 8.6 Add tests proving slots receive renderer state and callbacks without owning core semantics

## 9. Submission Flow

- [ ] 9.1 Implement submit handling for valid single-page forms
- [ ] 9.2 Implement submit handling for valid multi-step forms
- [ ] 9.3 Generate submission attempt ids or accept a host-provided attempt id factory
- [ ] 9.4 Generate submitted timestamps or accept a host-provided clock
- [ ] 9.5 Call the submission adapter with a normalized core-created envelope
- [ ] 9.6 Display global success, validation, conflict, auth, rate-limit, and server-error states from normalized backend responses
- [ ] 9.7 Focus the first field with a server validation error when appropriate
- [ ] 9.8 Add tests for successful submission, server validation errors, global errors, and envelope fields

## 10. Boundary Verification And Report

- [ ] 10.1 Run `pnpm --filter @your-org/forms-react-renderer test`
- [ ] 10.2 Run `pnpm --filter @your-org/forms-react-renderer typecheck`
- [ ] 10.3 Run `pnpm test`
- [ ] 10.4 Run `pnpm typecheck`
- [ ] 10.5 Confirm `packages/core` still has no dependency on React or `packages/react-renderer`
- [ ] 10.6 Confirm renderer public exports do not expose React Hook Form types
- [ ] 10.7 Run OpenSpec validation for `implement-react-renderer-foundation`
- [ ] 10.8 Write `docs/reports/2026-05-14-phase-5-react-renderer.md`
- [ ] 10.9 Include changed files, renderer APIs, field contract behavior, accessibility coverage, commands run, results, dependency boundary check, known limitations, and owner review checklist in the report
- [ ] 10.10 Commit Phase 5 proposal artifacts, renderer implementation, tests, and report after verification succeeds
- [ ] 10.11 Stop after Phase 5 and request owner review before Phase 6 example app and browser E2E work begins
