## ADDED Requirements

### Requirement: Submitted path runtime
The core package SHALL provide a single runtime implementation for submitted path parsing, serialization, validation, and safe object access.

#### Scenario: Schema path parses successfully
- **WHEN** a schema submitted path such as `user.email` or `items[].quantity` is parsed
- **THEN** core returns a structured path representation that can be serialized back to the same canonical path

#### Scenario: Runtime error path parses successfully
- **WHEN** a runtime path such as `addresses[0].city` is parsed in runtime-error mode
- **THEN** core returns a structured path representation that preserves the concrete index

#### Scenario: Invalid path is rejected
- **WHEN** a path contains empty segments, spaces, escaped dots, unsupported brackets, or wildcard syntax
- **THEN** core returns an `invalid_submitted_path` diagnostic without producing a usable parsed path

#### Scenario: Dangerous path segment is rejected
- **WHEN** a path contains `__proto__`, `constructor`, or `prototype` as a segment
- **THEN** core returns a `dangerous_key` diagnostic and refuses getter or setter operations for that path

#### Scenario: Safe getter and setter preserve object safety
- **WHEN** core reads or writes a value using a submitted path
- **THEN** it does not mutate prototypes and it rejects dangerous segments before reading or writing

### Requirement: Dangerous key rejection
The core package SHALL recursively reject dangerous object keys in every JSON contract surface it inspects.

#### Scenario: Schema contains dangerous key
- **WHEN** a schema contains `__proto__`, `constructor`, or `prototype` in defaults, props, validation params, condition values, ui, meta, localizations, or nested extension data
- **THEN** schema diagnostics include `dangerous_key`

#### Scenario: Submission contains dangerous key
- **WHEN** submission data, files, or meta contains a dangerous key
- **THEN** submission diagnostics include `dangerous_key`

#### Scenario: Backend response contains dangerous key
- **WHEN** backend response meta or error params contain a dangerous key
- **THEN** response diagnostics include `dangerous_key`

#### Scenario: Executable code attempt is rejected
- **WHEN** a persisted schema contains executable JavaScript, serialized functions, React component strings, or code-like extension behavior
- **THEN** schema diagnostics include `executable_code_prohibited`

### Requirement: Schema traversal and diagnostics
The core package SHALL provide framework-neutral schema traversal and publish-check diagnostics for canonical form schemas.

#### Scenario: Schema indexes nodes
- **WHEN** a canonical schema is analyzed
- **THEN** core can look up nodes by node id and submitted path without React or builder state

#### Scenario: Duplicate node ids are diagnosed
- **WHEN** two or more nodes share the same `id`
- **THEN** schema diagnostics include `duplicate_node_id`

#### Scenario: Duplicate submitted paths are diagnosed
- **WHEN** two or more submitted fields use the same `name`
- **THEN** schema diagnostics include `duplicate_submitted_path`

#### Scenario: Unknown node or field type is diagnosed
- **WHEN** a schema contains an unsupported node type or field type and no matching registration exists
- **THEN** schema diagnostics include `unknown_node_type` or `unknown_field_type`

#### Scenario: Unsupported MVP scope is diagnosed
- **WHEN** a schema contains a repeater node or browser upload orchestration behavior
- **THEN** schema diagnostics include `repeater_not_supported` or `upload_lifecycle_not_supported`

### Requirement: Default and empty value normalization
The core package SHALL resolve defaults and normalize final submission values according to the Phase 1 contracts.

#### Scenario: Default values are resolved
- **WHEN** runtime values are initialized from a schema
- **THEN** core resolves field and hidden defaults without executing code and with dangerous-key checks

#### Scenario: Empty optional text is omitted
- **WHEN** an optional text-like field has an empty string in final submission normalization
- **THEN** core omits that field from normalized submission data

#### Scenario: Boolean false is preserved
- **WHEN** a checkbox or switch field has value `false` and is present and enabled
- **THEN** core preserves `false` in normalized submission data

#### Scenario: Empty arrays and null values are omitted
- **WHEN** optional choice arrays, file metadata arrays, numeric values, dates, times, ratings, or scale values are empty by contract
- **THEN** core omits those values from normalized submission data unless explicitly preserved by supported schema semantics

### Requirement: MVP validation primitives
The core package SHALL evaluate MVP validation rules and return structured validation diagnostics or errors.

#### Scenario: Required validation follows field emptiness
- **WHEN** a visible enabled field has a `required` rule
- **THEN** core validates non-empty strings, non-null numbers, non-null options, non-empty arrays, and accepted consent booleans according to field type

#### Scenario: String and word validation runs
- **WHEN** a string field uses `minLength`, `maxLength`, `minWords`, or `maxWords`
- **THEN** core returns pass/fail results using the documented counting rules

#### Scenario: Numeric validation runs
- **WHEN** a number field uses `min`, `max`, `integer`, or `step`
- **THEN** core validates numeric value constraints with deterministic floating-step handling

#### Scenario: Pattern validation is restricted
- **WHEN** a pattern rule contains invalid regex syntax, unsupported lookbehind, excessive length, or unsafe detectable behavior
- **THEN** core returns a diagnostic instead of evaluating the pattern

#### Scenario: Format and option validation runs
- **WHEN** a field uses email, URL, option membership, selection count, or accepted validation
- **THEN** core returns structured validation errors for invalid values

#### Scenario: Unknown custom validator fails closed
- **WHEN** a validation rule references an unregistered custom validator or unsupported version
- **THEN** core returns `unsupported_custom_registration` and does not silently pass the value

### Requirement: Condition evaluation
The core package SHALL evaluate deterministic MVP conditions and analyze their dependencies.

#### Scenario: Logical conditions evaluate
- **WHEN** a condition uses `all`, `any`, or `not`
- **THEN** core evaluates the expression recursively and rejects empty logical arrays

#### Scenario: Field comparisons evaluate
- **WHEN** a condition uses `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `empty`, `notEmpty`, `contains`, `notContains`, `in`, `notIn`, or `matches`
- **THEN** core evaluates the condition using documented missing-value behavior

#### Scenario: Dependencies are collected
- **WHEN** a condition references submitted paths
- **THEN** core returns the dependency list for publish diagnostics, condition debugging, and hidden-value impact checks

#### Scenario: Unknown condition reference is diagnosed
- **WHEN** a condition references a submitted path that does not exist in the schema
- **THEN** schema diagnostics include `invalid_condition`

#### Scenario: Condition cycles are diagnosed
- **WHEN** node visibility, enabled state, or conditional validation dependencies form a direct or indirect cycle
- **THEN** schema diagnostics include `condition_cycle`

#### Scenario: Unknown predicate fails closed
- **WHEN** a condition references an unregistered predicate, unsupported predicate version, or async predicate in MVP
- **THEN** core returns `unsupported_custom_registration` or `invalid_condition` and does not evaluate arbitrary code

### Requirement: Hidden value final submission filtering
The core package SHALL filter hidden and disabled values from final submissions according to hidden-value semantics.

#### Scenario: Hidden values are excluded by default
- **WHEN** `preserveHiddenValues` is false and a field or hidden node is hidden at final submission time
- **THEN** core excludes that value from normalized submission data

#### Scenario: Hidden values can be preserved
- **WHEN** `preserveHiddenValues` is true and a hidden value is otherwise safe and valid for preservation
- **THEN** core can include the value in normalized submission data while skipping hidden validation by default

#### Scenario: Disabled values are excluded by default
- **WHEN** a field is visible but disabled by `enabledWhen`
- **THEN** core excludes the value from validation and normalized submission data by default

#### Scenario: Hidden required field does not block submission
- **WHEN** a required field is conditionally hidden at final submission time
- **THEN** core does not return a required validation error for that hidden field unless explicit hidden validation support is configured

### Requirement: Submission envelope creation
The core package SHALL create normalized submission envelopes from schema, runtime values, file metadata, locale, metadata, and caller-provided attempt information.

#### Scenario: Valid submission envelope is created
- **WHEN** core receives a valid schema, runtime values, files, locale, submission attempt id, and submission timestamp
- **THEN** it returns an envelope containing `formId`, `revisionId`, `revisionHash`, `schemaVersion`, `submissionAttemptId`, `submittedAt`, `locale`, `data`, `files`, and optional safe `meta`

#### Scenario: Revision data is copied from schema
- **WHEN** a submission envelope is created
- **THEN** `formId`, `revisionId`, `revisionHash`, and `schemaVersion` match the schema used to render the form

#### Scenario: Invalid file metadata is diagnosed
- **WHEN** submitted file metadata is missing required `field` or `fileId` values or contains dangerous metadata
- **THEN** core returns `invalid_file_metadata` or `dangerous_key`

#### Scenario: Invalid envelope input is diagnosed
- **WHEN** attempt id, timestamp, locale, data, or metadata are malformed
- **THEN** core returns `invalid_submission_envelope`

### Requirement: Backend response parsing
The core package SHALL parse normalized backend responses and map them to field and global errors.

#### Scenario: Success response parses
- **WHEN** a backend response has `ok: true`, `status: "success"`, a submission id, and no errors
- **THEN** core returns a successful parsed response

#### Scenario: Validation errors are mapped
- **WHEN** a backend response has field and global validation errors
- **THEN** core maps valid submitted paths to field errors and `path: null` errors to global errors

#### Scenario: Unknown status is diagnosed
- **WHEN** a backend response has an unknown or malformed status
- **THEN** core returns `invalid_backend_response` and exposes a safe server-error-like result to callers

#### Scenario: Invalid response error path is diagnosed
- **WHEN** a backend error path is not null and does not match runtime path grammar
- **THEN** core returns `invalid_submitted_path`

#### Scenario: Dangerous response params are diagnosed
- **WHEN** backend error params or response meta contain dangerous keys
- **THEN** core returns `dangerous_key`

### Requirement: Migration runner shell
The core package SHALL provide a minimal versioned migration runner shell for future schema migrations.

#### Scenario: Current schema version requires no migration
- **WHEN** a schema is already at current supported version `1.0.0`
- **THEN** the migration runner returns the schema unchanged with no diagnostics

#### Scenario: Unknown schema version is diagnosed
- **WHEN** a schema has an unsupported or missing schema version
- **THEN** the migration runner returns a diagnostic instead of guessing a migration path

#### Scenario: Registered migrations run in order
- **WHEN** future migrations are registered from one schema version to another
- **THEN** the migration runner applies them in version order and returns diagnostics if any step fails

### Requirement: Runtime fixture compatibility
The core package SHALL keep Phase 2 JSON fixture checks compatible with the real runtime behavior.

#### Scenario: Fixture tests use runtime diagnostics
- **WHEN** core fixture tests run after Phase 3
- **THEN** pass fixtures still produce no diagnostics and fail fixtures produce the expected diagnostic code lists using runtime-backed checks where practical

#### Scenario: Full workspace verification remains green
- **WHEN** Phase 3 is complete
- **THEN** `pnpm --filter @your-org/forms-core test`, `pnpm --filter @your-org/forms-core typecheck`, `pnpm test`, and `pnpm typecheck` pass

### Requirement: Phase report
The project SHALL report Phase 3 completion before React packages consume runtime APIs.

#### Scenario: Phase report exists
- **WHEN** Phase 3 is complete
- **THEN** `docs/reports/2026-05-14-phase-3-core-runtime.md` summarizes changed files, public APIs, behavior implemented, tests run, known limitations, dependency boundary check, and owner review checklist
