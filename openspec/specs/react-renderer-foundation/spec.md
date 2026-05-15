## Purpose

Define the React respondent renderer foundation for canonical form schemas. The renderer provides product-owned React APIs, built-in field rendering, accessibility wiring, structural rendering, core-backed runtime behavior, submission handling, host customization hooks, and verification expectations without exposing internal form-state libraries or backend-specific transport contracts.

## Requirements

### Requirement: Public renderer API
The React renderer package SHALL expose a product-owned public API for rendering canonical form schemas without exposing internal form-state library types.

#### Scenario: FormRenderer renders a schema
- **WHEN** a host renders `FormRenderer` with a valid canonical schema
- **THEN** the renderer displays the schema title, description, visible structural nodes, and visible submittable fields according to canonical schema order

#### Scenario: Public API hides React Hook Form internals
- **WHEN** host code imports public renderer types and components
- **THEN** no public API requires React Hook Form types, resolvers, field arrays, or form state

#### Scenario: Renderer accepts host callbacks
- **WHEN** a host provides submission, validation, or lifecycle callbacks through the renderer API
- **THEN** those callbacks receive product-owned JSON-compatible contracts rather than React-specific or backend-specific transport objects

### Requirement: Renderer provider, registry, and slots
The React renderer package SHALL provide renderer context, field registry, and slot contracts that allow hosts to customize rendering without changing canonical schema behavior.

#### Scenario: Built-in registry renders default fields
- **WHEN** a schema uses MVP built-in field types
- **THEN** the renderer resolves them through the default field registry

#### Scenario: Custom registry overrides field rendering
- **WHEN** a host registers a field renderer for a supported field key
- **THEN** the renderer uses that field renderer while preserving renderer-managed ids, accessibility state, value binding, validation state, and submission semantics

#### Scenario: Slots customize renderer chrome
- **WHEN** a host provides slots for form, section, step, field chrome, messages, or submit controls
- **THEN** the renderer uses those slots without delegating core validation, condition, hidden-value, or submission semantics to the slot implementation

### Requirement: Built-in MVP field rendering
The React renderer package SHALL render the MVP field list using accessible React components and canonical schema node contracts.

#### Scenario: Text-like fields render
- **WHEN** text, textarea, email, phone, date, hidden, or file metadata fields are visible
- **THEN** the renderer displays an appropriate input surface or hidden field surface with renderer-managed value binding

#### Scenario: Number fields render
- **WHEN** number fields are visible
- **THEN** the renderer displays a numeric input surface that stores renderer values in a shape compatible with core validation and submission normalization

#### Scenario: Choice fields render
- **WHEN** select, radio, or checkbox fields are visible
- **THEN** the renderer displays enabled options from the schema and omits disabled options from selectable behavior where applicable

#### Scenario: Unknown field fails closed
- **WHEN** a visible field has no built-in or registered renderer
- **THEN** the renderer displays a safe unsupported-field state and exposes a diagnostic rather than silently submitting an unknown value

### Requirement: Accessibility field contract
The React renderer package SHALL provide accessible ids, names, descriptions, errors, required state, disabled state, and focus targets for built-in fields.

#### Scenario: Label and description are wired
- **WHEN** a built-in field has a label and description
- **THEN** the input is associated with the label and references the description through accessible attributes

#### Scenario: Validation error is announced
- **WHEN** a field has a client or server validation error
- **THEN** the field exposes invalid state, references error text accessibly, and displays the error message

#### Scenario: Required and disabled state are wired
- **WHEN** a field is required or disabled by schema validation or enabled-state conditions
- **THEN** the rendered control exposes the correct required or disabled state without relying only on visual styling

#### Scenario: Group fields use fieldset semantics
- **WHEN** radio or checkbox group-style fields are rendered
- **THEN** grouped options use accessible group semantics with a legend or equivalent accessible name

#### Scenario: Focus target is registered
- **WHEN** validation or server response requires focusing the first invalid field
- **THEN** the renderer can focus the field through a renderer-managed focus target contract

### Requirement: Structural rendering and step navigation
The React renderer package SHALL render section and step nodes from canonical schema children and support basic multi-step navigation.

#### Scenario: Sections render children in order
- **WHEN** a section node lists child ids
- **THEN** the renderer displays visible child nodes in the listed order under section chrome

#### Scenario: Single-page navigation renders all visible non-step content
- **WHEN** form settings use `navigation: "singlePage"`
- **THEN** the renderer displays all visible renderable nodes in one submission surface

#### Scenario: Step navigation renders current step
- **WHEN** form settings use `navigation: "steps"`
- **THEN** the renderer displays the current visible step and provides previous, next, and submit affordances according to current step position

#### Scenario: Current step validates before advancing
- **WHEN** a respondent attempts to advance from a step with invalid visible enabled fields
- **THEN** the renderer stays on the current step and displays validation errors for those fields

### Requirement: Core-backed runtime behavior
The React renderer package SHALL use `packages/core` for conditions, validation primitives, hidden/disabled filtering, normalized data, submission envelopes, and backend response parsing.

#### Scenario: Conditional visibility uses core
- **WHEN** field values change and a node visibility condition depends on those values
- **THEN** the renderer evaluates visibility through core condition behavior and updates visible nodes deterministically

#### Scenario: Hidden and disabled values are filtered by core
- **WHEN** a form is submitted with hidden or disabled fields
- **THEN** the renderer creates submitted data using core hidden/disabled filtering and normalization semantics

#### Scenario: Client validation uses core
- **WHEN** visible enabled fields are validated
- **THEN** the renderer uses core validation primitives and displays returned field errors or diagnostics

#### Scenario: Submission envelope uses core
- **WHEN** a respondent submits a valid form
- **THEN** the renderer creates a normalized submission envelope through core submission behavior before calling the submission adapter

#### Scenario: Backend errors map to fields
- **WHEN** a submission adapter returns normalized backend validation errors
- **THEN** the renderer parses the response through core response behavior and displays field and global errors

### Requirement: Submission adapter integration contract
The React renderer package SHALL support submitting normalized submission envelopes through a product-owned adapter contract without exposing backend-specific transport details or React Hook Form internals.

#### Scenario: Renderer submits through normalized adapter
- **WHEN** a respondent submits a rendered published form and the host provides a submission adapter
- **THEN** the renderer creates a normalized submission envelope through core submission behavior and passes it to the adapter contract

#### Scenario: Backend validation response maps to renderer errors
- **WHEN** the submission adapter returns normalized backend validation errors
- **THEN** the renderer maps field errors, global errors, status, and message into its product-owned error display contract without exposing raw backend exceptions

#### Scenario: Renderer public API remains product-owned
- **WHEN** submission adapter integration is implemented
- **THEN** renderer public APIs do not expose React Hook Form types, TanStack Query mutation objects, backend-specific clients, or executable schema behavior

### Requirement: Renderer styling hooks
The React renderer package SHALL expose minimal styling hooks without defining the full product design system.

#### Scenario: Data attributes identify renderer state
- **WHEN** fields, sections, steps, errors, or form states are rendered
- **THEN** they include stable data attributes for state such as field type, hidden state, invalid state, disabled state, current step, and submission status

#### Scenario: Class hooks are stable
- **WHEN** hosts style renderer output
- **THEN** the renderer exposes stable class hooks for form, field, label, description, error, section, step, navigation, and submit controls

#### Scenario: CSS variables are optional
- **WHEN** hosts do not provide custom styles
- **THEN** minimal default styles remain readable, and hosts can override key renderer spacing, color, and border variables without changing renderer behavior

### Requirement: Renderer test and report coverage
The project SHALL verify the renderer foundation before moving to browser example and E2E work.

#### Scenario: Renderer package tests pass
- **WHEN** `pnpm --filter @your-org/forms-react-renderer test` runs
- **THEN** React renderer tests for field rendering, accessibility wiring, conditions, validation, steps, backend errors, and submission envelope creation pass

#### Scenario: Workspace typecheck passes
- **WHEN** Phase 5 is complete
- **THEN** `pnpm typecheck` passes and `packages/core` still has no dependency on React or renderer code

#### Scenario: Phase report exists
- **WHEN** Phase 5 is complete
- **THEN** `docs/reports/2026-05-14-phase-5-react-renderer.md` summarizes changed files, renderer APIs, field contract behavior, tests run, accessibility coverage, known limitations, dependency boundary check, and owner review checklist

### Requirement: Renderer theme package integration
The React renderer package SHALL align its optional default styling with the themes package while preserving product-owned renderer APIs, slots, class hooks, and data attributes.

#### Scenario: Renderer styles compose theme output
- **WHEN** renderer default styles are generated or rendered
- **THEN** they consume or align with `@your-org/forms-themes` default variables and avoid duplicating token values that belong to the theme package

#### Scenario: Renderer host hooks remain stable
- **WHEN** host CSS targets renderer class hooks, data attributes, or CSS variables
- **THEN** Phase 11 theme integration preserves hooks for form, field, label, description, error, section, step, messages, navigation, and submit controls

#### Scenario: Renderer slots still replace default chrome
- **WHEN** a host replaces renderer slots while default theme CSS is available
- **THEN** core renderer behavior, validation, submission, hidden-field semantics, and accessibility wiring do not depend on the default theme markup

### Requirement: Renderer visual verification under default theme
The React renderer package SHALL verify that its default themed output remains usable across desktop, narrow, LTR, RTL, focus, error, and reduced-motion contexts.

#### Scenario: Themed renderer states are visible
- **WHEN** themed renderer fields show required, disabled, invalid, server-error, current-step, or submission-status states
- **THEN** the states are visibly distinguishable and do not rely only on color

#### Scenario: Themed renderer direction support is verified
- **WHEN** LTR and RTL example forms are rendered with the default theme
- **THEN** labels, descriptions, errors, controls, step navigation, submitted paths, and debug JSON remain readable with correct direction handling

#### Scenario: Renderer focus and motion states are verified
- **WHEN** keyboard focus and reduced-motion preferences are checked on themed renderer controls
- **THEN** focus remains visible and nonessential transitions are reduced or removed according to the default theme

### Requirement: Renderer integration documentation
The React renderer package SHALL have integration documentation that explains how a host renders published canonical schemas and handles submissions without exposing internal implementation libraries.

#### Scenario: Renderer guide shows first render path
- **WHEN** `docs/integration/react-renderer.md` is inspected
- **THEN** it shows the current `FormRenderer` usage path with schema input, submission adapter handling, styles/theme options, and public package imports

#### Scenario: Renderer guide explains customization hooks
- **WHEN** the renderer integration guide is inspected
- **THEN** it explains field registry overrides, renderer slots, stable class hooks, data attributes, and CSS variables without requiring React Hook Form types

#### Scenario: Renderer guide explains validation and backend errors
- **WHEN** the renderer integration guide is inspected
- **THEN** it explains client validation, first-invalid focus, normalized submission envelopes, backend validation responses, global messages, and submission statuses

### Requirement: Accessibility field contract documentation
The renderer accessibility contract SHALL be documented for built-in and custom field implementers.

#### Scenario: Field accessibility doc exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/accessibility/field-contract.md` documents labels, descriptions, required state, disabled state, errors, fieldsets, focus targets, hidden fields, custom fields, RTL/LTR expectations, and reduced-motion considerations

#### Scenario: Custom fields preserve renderer-managed accessibility
- **WHEN** the accessibility field contract is inspected
- **THEN** it states that custom fields must use renderer-managed ids, accessible names, descriptions, error references, invalid state, disabled/required state, and focus refs provided by the renderer
