## ADDED Requirements

### Requirement: Runnable Vite renderer example
The project SHALL provide a runnable Vite React example app that renders canonical published schemas through `@your-org/forms-react-renderer`.

#### Scenario: Example dev server starts
- **WHEN** `pnpm --filter @your-org/forms-example-vite-react dev` runs
- **THEN** the example app starts a Vite development server suitable for manual browser inspection

#### Scenario: Example renders through the real renderer
- **WHEN** the example displays a form
- **THEN** the form is rendered by `FormRenderer` from `@your-org/forms-react-renderer` rather than duplicated example-only field rendering

#### Scenario: Example builds successfully
- **WHEN** the workspace build runs
- **THEN** the Vite example builds without breaking package-first TypeScript boundaries

### Requirement: Example schemas and modes
The example app SHALL expose browser-visible modes for single-page, multi-step, backend-response, and RTL renderer behavior.

#### Scenario: Single-page schema is visible
- **WHEN** a user opens the single-page example mode
- **THEN** the page displays a published single-page form schema with required fields, conditional fields, and hidden-field behavior

#### Scenario: Multi-step schema is visible
- **WHEN** a user opens the multi-step example mode
- **THEN** the page displays a published multi-step form schema with current-step navigation and validation before advancing

#### Scenario: RTL schema is visible
- **WHEN** a user opens the RTL example mode
- **THEN** the page displays a published schema with `direction: "rtl"` and visible RTL layout behavior

#### Scenario: Backend status mode is visible
- **WHEN** a user selects backend response scenarios
- **THEN** the example can demonstrate normalized success, validation error, conflict, auth error, rate-limit, and server-error responses

### Requirement: Fake backend adapters
The example app SHALL use fake in-process submission adapters that return normalized backend response contracts.

#### Scenario: Successful submission
- **WHEN** a respondent submits valid form data in a success scenario
- **THEN** the fake adapter returns a normalized success response and the renderer displays success state

#### Scenario: Server validation response
- **WHEN** a respondent submits data in a validation-error scenario
- **THEN** the fake adapter returns field and global validation errors and the renderer maps them to the correct UI locations

#### Scenario: Non-validation backend statuses
- **WHEN** a respondent submits data in conflict, auth, rate-limit, or server-error scenarios
- **THEN** the fake adapter returns the corresponding normalized status and the renderer displays an appropriate global state

### Requirement: Browser E2E coverage
The example package SHALL include Playwright E2E tests for critical renderer behavior in a real browser.

#### Scenario: Successful browser submission is tested
- **WHEN** `pnpm --filter @your-org/forms-example-vite-react test:e2e` runs
- **THEN** Playwright verifies a user can complete a visible form and see success feedback

#### Scenario: Server validation mapping is tested
- **WHEN** Playwright submits a form in a validation-error scenario
- **THEN** the test verifies field error text, global error text, invalid state, and focus behavior

#### Scenario: Step navigation is tested
- **WHEN** Playwright uses the multi-step example
- **THEN** the test verifies current-step validation, advancing, going back, and final submission behavior

#### Scenario: Hidden fields are tested
- **WHEN** Playwright submits a form with hidden or conditionally hidden fields
- **THEN** the test verifies hidden-field behavior through visible submission output or adapter-observed envelope data

#### Scenario: Keyboard focus is tested
- **WHEN** Playwright interacts with the example using keyboard navigation or invalid submit
- **THEN** the test verifies focus moves to the expected field or control

### Requirement: Manual review evidence
The project SHALL produce report artifacts that let the owner inspect what Phase 6 delivered.

#### Scenario: Screenshots are captured
- **WHEN** Phase 6 verification runs
- **THEN** desktop and narrow viewport screenshots of the running example are saved for the phase report

#### Scenario: Phase 6 report exists
- **WHEN** Phase 6 is complete
- **THEN** `docs/reports/2026-05-14-phase-6-renderer-example-e2e.md` summarizes changed files, example modes, commands run, screenshots, browser notes, known limitations, and owner review checklist

#### Scenario: Owner can inspect running output
- **WHEN** implementation finishes
- **THEN** the final notes include the local URL where the owner can view the running example
