## ADDED Requirements

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
