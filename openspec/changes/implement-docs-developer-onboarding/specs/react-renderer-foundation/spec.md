## ADDED Requirements

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
