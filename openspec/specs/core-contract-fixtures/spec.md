## Purpose
Define the core package contract modules and JSON-first conformance fixtures that make canonical schema, submission, response, diagnostic, and migration behavior portable across backends and testable without React.

## Requirements

### Requirement: Core contract type modules
The core package SHALL expose framework-neutral TypeScript contract modules for the approved Phase 1 schema contracts.

#### Scenario: Contract modules exist
- **WHEN** Phase 2 is complete
- **THEN** `packages/core/src/` contains modules for schema, paths, diagnostics, validation, conditions, submissions, responses, extensions, and testing fixtures

#### Scenario: Core exports are framework-neutral
- **WHEN** Phase 2 is complete
- **THEN** `@your-org/forms-core` exports contract types and fixture helpers without depending on React, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system components, CSS, browser upload orchestration, or transport clients

### Requirement: Diagnostic vocabulary
The core package SHALL define structured diagnostic types and stable diagnostic codes for fixture checks.

#### Scenario: Diagnostic codes cover Phase 1 contracts
- **WHEN** Phase 2 is complete
- **THEN** core diagnostic codes include dangerous keys, invalid submitted paths, missing required schema fields, duplicate node ids, duplicate submitted paths, unknown node types, unknown field types, invalid validation rules, invalid conditions, unsupported custom registrations, invalid submission envelopes, invalid backend responses, and unsupported compiler behavior

#### Scenario: Diagnostics are testable
- **WHEN** a fixture is expected to fail
- **THEN** fixture tests can assert the expected diagnostic code list from the fixture manifest

### Requirement: JSON-first conformance fixtures
The core package SHALL provide JSON conformance fixtures for schemas, submissions, backend responses, and diagnostics.

#### Scenario: Fixture directories exist
- **WHEN** Phase 2 is complete
- **THEN** `packages/core/src/testing/fixtures/` contains directories for schemas, submissions, responses, and diagnostics

#### Scenario: Fixture files are portable JSON
- **WHEN** fixture files are created
- **THEN** they are valid JSON files without TypeScript syntax, JavaScript comments, functions, React components, or executable code

### Requirement: Fixture manifest
The core package SHALL define and test a fixture manifest that describes expected fixture outcomes.

#### Scenario: Manifest exists
- **WHEN** Phase 2 is complete
- **THEN** a fixture manifest lists fixture id, file path, category, expected pass/fail result, and expected diagnostic codes

#### Scenario: Manifest paths resolve
- **WHEN** fixture tests run
- **THEN** every fixture path in the manifest resolves to an existing JSON file

### Requirement: Valid schema fixtures
The core package SHALL include representative valid schema fixtures from the Phase 1 conformance contract.

#### Scenario: Valid schema fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** valid schema fixtures cover minimal single-page form, multi-step form, choice fields, hidden field default exclusion, localization, simple conditional visibility, file metadata field, and custom validator reference with registered support metadata

### Requirement: Invalid schema fixtures
The core package SHALL include invalid schema fixtures for unsafe or unsupported schema cases.

#### Scenario: Invalid schema fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** invalid schema fixtures cover missing schema version, duplicate ids, unknown node type, unknown field type, missing submitted name, invalid submitted path, dangerous key, duplicate submitted path, unknown validation rule, unsupported custom validator, invalid condition reference, condition cycle, repeater node in MVP, upload orchestration in MVP, and executable-code attempt

### Requirement: Submission fixtures
The core package SHALL include valid and invalid submission envelope fixtures.

#### Scenario: Valid submission fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** valid submissions cover minimal contact submission, omitted empty optional values, boolean false value, choice values, hidden values excluded by default, preserved hidden value, file metadata reference, and idempotent retry

#### Scenario: Invalid submission fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** invalid submissions cover missing revision hash, mismatched revision hash, missing submission attempt id, dangerous key in data, dangerous key in meta, invalid submitted path, required field missing, invalid email, invalid URL, invalid option value, invalid file metadata, and hidden value submitted when policy excludes it

### Requirement: Backend response fixtures
The core package SHALL include backend response fixtures for renderer and backend contract testing.

#### Scenario: Backend response fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** response fixtures cover success, field validation error, global validation error, mixed validation errors, conflict, auth error, rate limit, server error, malformed unknown status, and dangerous key in params

### Requirement: Compiler diagnostic fixtures
The core package SHALL include compiler diagnostic fixtures for unsupported behavior that later validator packages must surface.

#### Scenario: Compiler diagnostic fixture coverage exists
- **WHEN** Phase 2 is complete
- **THEN** diagnostic fixtures cover condition not representable, custom validator not representable, unsupported regex, unknown field type, repeater not supported, upload lifecycle not supported, dangerous key, and invalid submitted path

### Requirement: Fixture tests
The core package SHALL include Vitest coverage that loads fixtures and verifies expected pass/fail diagnostic outcomes.

#### Scenario: Core fixture tests pass
- **WHEN** `pnpm --filter @your-org/forms-core test` runs
- **THEN** every fixture manifest entry is loaded and checked against expected diagnostics

#### Scenario: Full test suite remains green
- **WHEN** `pnpm test` runs
- **THEN** the repository test suite passes with the new core fixture tests included

### Requirement: Phase report
The project SHALL report Phase 2 completion before runtime behavior expands.

#### Scenario: Phase report exists
- **WHEN** Phase 2 is complete
- **THEN** `docs/reports/2026-05-14-phase-2-core-contracts-fixtures.md` summarizes changed files, exported contracts, fixture coverage, commands run, dependency boundary check, known limitations, and owner review checklist
