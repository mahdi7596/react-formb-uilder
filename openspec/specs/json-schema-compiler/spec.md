## Purpose

Define the optional backend-friendly JSON Schema compiler for canonical form schemas. This capability covers generated submitted-data JSON Schema, compiler diagnostics, validation-plan artifacts, condition dependency output, JSON-first fixtures, and backend consumption documentation.

## Requirements

### Requirement: Draft 2020-12 submitted data schema
The validators package SHALL generate Draft 2020-12 JSON Schema for normalized submitted form data from canonical form schemas.

#### Scenario: Compiler emits Draft 2020-12 schema
- **WHEN** a valid canonical schema is compiled
- **THEN** the compiler output includes a JSON Schema object with `$schema: "https://json-schema.org/draft/2020-12/schema"`, `type: "object"`, `properties`, and `additionalProperties: false`

#### Scenario: Compiler treats canonical schema as source of truth
- **WHEN** a canonical schema is compiled
- **THEN** submitted paths, field types, validation rules, hidden semantics, and diagnostics are derived from the canonical schema and core contracts rather than from hand-authored JSON Schema

#### Scenario: Core does not depend on validators
- **WHEN** Phase 4 is complete
- **THEN** `packages/core` has no dependency on `packages/validators` or compiler-specific runtime dependencies

### Requirement: MVP field type mapping
The validators package SHALL map representable MVP field types to submitted-data JSON Schema shapes.

#### Scenario: String-like fields compile
- **WHEN** text, textarea, phone, email, url, date, or time fields are compiled
- **THEN** generated JSON Schema uses string-compatible schemas and appropriate `format` or `pattern` keywords when representable

#### Scenario: Number-like fields compile
- **WHEN** number, rating, or linear scale fields are compiled
- **THEN** generated JSON Schema uses number-compatible schemas and integer type when an integer rule applies

#### Scenario: Boolean fields compile
- **WHEN** checkbox or switch fields are compiled
- **THEN** generated JSON Schema uses `type: "boolean"`

#### Scenario: Choice fields compile
- **WHEN** radio, select, or checkbox group fields with options are compiled
- **THEN** generated JSON Schema uses `enum` for single-value choices and array item `enum` for multi-value choices

#### Scenario: File metadata fields compile
- **WHEN** file metadata fields are compiled
- **THEN** generated JSON Schema uses an array of file metadata reference objects with required `fileId` and safe metadata properties

### Requirement: Submitted path object construction
The validators package SHALL build nested JSON Schema object properties from submitted path grammar.

#### Scenario: Nested object path compiles
- **WHEN** a field uses a submitted path such as `user.email`
- **THEN** generated JSON Schema contains nested `properties.user.properties.email` rather than a literal `user.email` property

#### Scenario: Duplicate path diagnostics are surfaced
- **WHEN** multiple fields use the same submitted path
- **THEN** compiler diagnostics include `duplicate_submitted_path`

#### Scenario: Invalid path blocks trustworthy generation
- **WHEN** a field uses an invalid submitted path
- **THEN** compiler diagnostics include `invalid_submitted_path`

#### Scenario: Dangerous path blocks generation
- **WHEN** a submitted path contains `__proto__`, `constructor`, or `prototype`
- **THEN** compiler diagnostics include `dangerous_key`

### Requirement: Validation rule mapping
The validators package SHALL map representable MVP validation rules to JSON Schema keywords and validation-plan entries.

#### Scenario: Required rules compile
- **WHEN** visible unconditional fields use the `required` rule
- **THEN** generated JSON Schema includes those property names in the nearest object schema `required` array

#### Scenario: String length rules compile
- **WHEN** fields use `minLength` or `maxLength`
- **THEN** generated JSON Schema includes `minLength` or `maxLength`

#### Scenario: Numeric rules compile
- **WHEN** fields use `min`, `max`, `integer`, or `step`
- **THEN** generated JSON Schema includes `minimum`, `maximum`, `type: "integer"`, or `multipleOf` when representable

#### Scenario: Pattern rules compile or diagnose
- **WHEN** a field uses a portable pattern rule
- **THEN** generated JSON Schema includes `pattern`
- **WHEN** a pattern is unsupported or unsafe
- **THEN** compiler diagnostics include `unsupported_regex`

#### Scenario: Selection count rules compile
- **WHEN** checkbox group fields use `selectionCount`
- **THEN** generated JSON Schema includes `minItems` and/or `maxItems` when configured

### Requirement: Compiler diagnostics
The validators package SHALL emit explicit diagnostics for unsupported, unsafe, or non-representable behavior.

#### Scenario: Conditions produce diagnostics and dependency graph
- **WHEN** a schema contains visibility, enabled state, or conditional validation conditions
- **THEN** compiler output includes condition dependency graph entries and diagnostics such as `condition_not_representable` where JSON Schema cannot represent the behavior

#### Scenario: Custom validator without generator is diagnosed
- **WHEN** a field uses a custom validator without registered JSON Schema generation support
- **THEN** compiler diagnostics include `custom_validator_not_representable`

#### Scenario: Unknown field type is diagnosed
- **WHEN** a field has an unknown field type without registered compiler support
- **THEN** compiler diagnostics include `unknown_field_type`

#### Scenario: Unsupported MVP scope is diagnosed
- **WHEN** a schema contains repeater nodes or browser upload lifecycle behavior
- **THEN** compiler diagnostics include `repeater_not_supported` or `upload_lifecycle_not_supported`

#### Scenario: Dangerous keys are diagnosed
- **WHEN** a schema contains dangerous keys in any inspected JSON contract surface
- **THEN** compiler diagnostics include `dangerous_key`

### Requirement: Compiler output bundle
The validators package SHALL return a compiler output bundle containing generated schema, diagnostics, validation plan, and condition dependencies.

#### Scenario: Output includes schema and diagnostics
- **WHEN** compilation completes
- **THEN** the result includes `schema`, `diagnostics`, `validationPlan`, and `conditionDependencies`

#### Scenario: Diagnostics include severity
- **WHEN** compiler diagnostics are emitted
- **THEN** each diagnostic includes code, severity, message, and path where available

#### Scenario: Validation plan captures non-JSON-Schema behavior
- **WHEN** validation behavior cannot be fully represented in JSON Schema
- **THEN** compiler output includes validation-plan entries instead of silently dropping the behavior

### Requirement: Builder artifact bundle
The validators package SHALL provide a generated artifact bundle suitable for builder publish review and backend handoff.

#### Scenario: Artifact bundle includes review data
- **WHEN** a canonical schema is compiled for builder publish review
- **THEN** the output includes generated JSON Schema, compiler diagnostics, validation plan entries, condition dependencies, dialect metadata, generated timestamp or deterministic metadata where available, and references to relevant conformance fixture categories

#### Scenario: Artifact bundle remains compiler-owned
- **WHEN** React builder code needs generated artifacts
- **THEN** it consumes the validators package compiler output rather than duplicating JSON Schema generation or compiler diagnostic logic

#### Scenario: Artifact diagnostics feed publish checks
- **WHEN** compiler output contains errors or warnings such as dangerous keys, invalid paths, unknown field types, unsupported custom validators, unsupported regex, or non-representable conditions
- **THEN** the artifact bundle exposes severity and message data that publish checks can classify as blocking or reviewable without losing the original compiler diagnostic codes

### Requirement: Generated schema fixtures
The validators package SHALL include JSON-first compiler fixtures and tests for generated schemas and diagnostics.

#### Scenario: Generated schema fixtures exist
- **WHEN** Phase 4 is complete
- **THEN** `packages/validators` contains fixtures for minimal form, nested object paths, choices, required fields, file metadata, and unsupported compiler behavior

#### Scenario: Fixture tests pass
- **WHEN** `pnpm --filter @your-org/forms-validators test` runs
- **THEN** generated fixture outputs and diagnostic expectations pass

### Requirement: Backend consumption examples
The validators package SHALL include examples showing how non-React backend consumers can use generated artifacts.

#### Scenario: Backend example exists
- **WHEN** Phase 4 is complete
- **THEN** the repository includes an example or documentation snippet showing a backend-oriented consumer using generated JSON Schema, diagnostics, and normalized backend response fixtures

#### Scenario: Example does not require React
- **WHEN** backend consumption examples are inspected
- **THEN** they do not import React, React renderer, or builder packages

### Requirement: Phase report
The project SHALL report Phase 4 completion before React renderer work begins.

#### Scenario: Phase report exists
- **WHEN** Phase 4 is complete
- **THEN** `docs/reports/2026-05-14-phase-4-json-schema-compiler.md` summarizes changed files, compiler APIs, generated artifact behavior, diagnostics, commands run, dependency boundary check, known limitations, and owner review checklist
