## 1. Compiler Test Scaffold

- [x] 1.1 Replace or extend the validators package test script so compiler suites run
- [x] 1.2 Add failing compiler tests for Draft 2020-12 root schema output
- [x] 1.3 Add failing tests for MVP field type mappings
- [x] 1.4 Add failing tests for nested submitted path object construction
- [x] 1.5 Add failing tests for representable validation rule mappings
- [x] 1.6 Add failing tests for compiler diagnostics for unsupported or unsafe behavior
- [x] 1.7 Add failing tests for compiler output bundle shape
- [x] 1.8 Add failing tests for generated-schema fixtures
- [x] 1.9 Add failing tests for backend-consumption examples or snippets

## 2. Compiler Module Structure

- [x] 2.1 Replace the validators bootstrap placeholder export with compiler-oriented exports
- [x] 2.2 Add `packages/validators/src/json-schema/` for JSON Schema output types and helpers
- [x] 2.3 Add `packages/validators/src/compiler/` for compiler entrypoint, options, result, validation plan, and dependency graph types
- [x] 2.4 Add `packages/validators/src/diagnostics/` if validators-specific diagnostic helpers are needed
- [x] 2.5 Add `packages/validators/src/testing/fixtures/` for generated-schema fixtures and manifest utilities
- [x] 2.6 Keep package dependencies limited to `@your-org/forms-core` unless an optional dependency is explicitly justified

## 3. Submitted Data JSON Schema Generation

- [x] 3.1 Implement `compileJsonSchema` or equivalent public compiler entrypoint
- [x] 3.2 Emit Draft 2020-12 root schema with `type: "object"`, `properties`, and `additionalProperties: false`
- [x] 3.3 Build nested JSON Schema object properties from submitted path grammar using core path helpers
- [x] 3.4 Generate required arrays at the nearest object schema for unconditional required fields
- [x] 3.5 Diagnose duplicate submitted paths through core schema analysis
- [x] 3.6 Diagnose invalid submitted paths through core path diagnostics
- [x] 3.7 Diagnose dangerous path segments and dangerous schema keys

## 4. MVP Field Type Mapping

- [x] 4.1 Map text, textarea, and phone fields to string schemas
- [x] 4.2 Map email fields to string schemas with `format: "email"`
- [x] 4.3 Map url fields to string schemas with `format: "uri"`
- [x] 4.4 Map date fields to string schemas with `format: "date"`
- [x] 4.5 Map time fields to string schemas with the MVP time pattern
- [x] 4.6 Map number, rating, and linear scale fields to number schemas
- [x] 4.7 Map integer-constrained number fields to integer schemas
- [x] 4.8 Map checkbox and switch fields to boolean schemas
- [x] 4.9 Map radio and select fields to enum schemas from enabled option values
- [x] 4.10 Map checkbox group fields to array schemas with item enum values
- [x] 4.11 Map hidden fields from default/value contract where representable
- [x] 4.12 Map file metadata fields to arrays of file metadata reference objects

## 5. Validation Rule Mapping

- [x] 5.1 Map `minLength` and `maxLength` to JSON Schema string length keywords
- [x] 5.2 Map `min` and `max` to `minimum` and `maximum`
- [x] 5.3 Map `integer` to `type: "integer"`
- [x] 5.4 Map `step` to `multipleOf` when representable
- [x] 5.5 Map portable `pattern` rules to JSON Schema `pattern`
- [x] 5.6 Diagnose unsupported regex patterns with `unsupported_regex`
- [x] 5.7 Map `selectionCount` to `minItems` and `maxItems`
- [x] 5.8 Map `option` through enum generation rather than a separate keyword
- [x] 5.9 Include non-represented or partially represented validation behavior in validation-plan entries

## 6. Diagnostics And Non-Representable Behavior

- [x] 6.1 Emit `condition_not_representable` for visibility and enabled-state conditions
- [x] 6.2 Emit validation-plan entries and diagnostics for conditional requiredness
- [x] 6.3 Emit `custom_validator_not_representable` for custom validators without registered JSON Schema support
- [x] 6.4 Emit `custom_predicate_not_representable` for custom predicates that affect compiler outputs
- [x] 6.5 Emit `unknown_field_type` for field types without built-in or registered compiler support
- [x] 6.6 Emit `repeater_not_supported` for repeater nodes
- [x] 6.7 Emit `upload_lifecycle_not_supported` for browser upload orchestration behavior
- [x] 6.8 Emit `dangerous_key` for dangerous keys in inspected schema surfaces
- [x] 6.9 Emit `invalid_submitted_path` for invalid submitted paths
- [x] 6.10 Assign diagnostic severities so unsafe inputs are errors and non-representable safe behavior is warnings

## 7. Output Bundle And Fixtures

- [x] 7.1 Define compiler output bundle types for `schema`, `diagnostics`, `validationPlan`, and `conditionDependencies`
- [x] 7.2 Implement condition dependency graph output for schema conditions
- [x] 7.3 Add generated-schema fixtures for minimal form, nested object paths, choices, required fields, file metadata, and unsupported behavior
- [x] 7.4 Add a fixture manifest with expected diagnostics and generated schema file paths
- [x] 7.5 Add tests that load every validator fixture and compare generated output deterministically
- [x] 7.6 Ensure fixtures are JSON-first and useful to non-JavaScript backend developers

## 8. Backend Consumption Examples

- [x] 8.1 Add a backend-oriented example or documentation snippet showing generated JSON Schema usage without React
- [x] 8.2 Include generated diagnostics in the example so unsupported behavior is visible
- [x] 8.3 Reference normalized backend response fixtures where useful
- [x] 8.4 Ensure examples do not import React renderer or builder packages

## 9. Boundary And Public Exports

- [x] 9.1 Export stable compiler APIs from `packages/validators/src/index.ts`
- [x] 9.2 Confirm `packages/validators` can import `@your-org/forms-core`
- [x] 9.3 Confirm `packages/core` does not import `packages/validators`
- [x] 9.4 Confirm AJV helpers are absent or explicitly optional and documented
- [x] 9.5 Confirm generated JSON Schema is documented as an artifact, not the authoring model

## 10. Verification And Report

- [x] 10.1 Run `pnpm --filter @your-org/forms-validators test`
- [x] 10.2 Run `pnpm --filter @your-org/forms-validators typecheck`
- [x] 10.3 Run `pnpm --filter @your-org/forms-core test`
- [x] 10.4 Run `pnpm test`
- [x] 10.5 Run `pnpm typecheck`
- [x] 10.6 Confirm `packages/core` still has no compiler dependency on `packages/validators`
- [x] 10.7 Write `docs/reports/2026-05-14-phase-4-json-schema-compiler.md`
- [x] 10.8 Include changed files, compiler APIs, generated artifact behavior, diagnostics, commands run, results, dependency boundary check, known limitations, and owner review checklist in the report
- [x] 10.9 Commit Phase 4 proposal artifacts, compiler implementation, tests, fixtures, examples, and report after verification succeeds
- [x] 10.10 Stop after Phase 4 and request owner review before React renderer work begins
