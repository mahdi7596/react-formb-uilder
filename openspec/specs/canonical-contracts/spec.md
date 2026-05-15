## Purpose
Define the canonical schema, submission, validation, condition, response, extension, JSON Schema artifact, and conformance contracts that keep the form builder backend-agnostic and safe across runtimes.
## Requirements
### Requirement: Canonical schema contract documentation
The project SHALL define a canonical schema v1 documentation contract before implementing core runtime behavior.

#### Scenario: Canonical schema document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/canonical-schema-v1.md` defines schema identity, revision identity, status, locale, direction, settings, nodes, metadata, localization, and MVP node contracts

#### Scenario: MVP scope is explicit
- **WHEN** Phase 1 is complete
- **THEN** the canonical schema documentation states which MVP fields and nodes are included and which advanced components are excluded

### Requirement: Submitted path grammar documentation
The project SHALL define submitted path grammar and dangerous-key rejection before schema or submission code is implemented.

#### Scenario: Submitted path grammar document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/submitted-path-grammar-v1.md` defines object key grammar, array path syntax, empty segment behavior, dot behavior, escaping decision, dangerous-key rejection, and examples

#### Scenario: Dangerous keys are rejected
- **WHEN** Phase 1 is complete
- **THEN** the path grammar documentation requires rejection of `__proto__`, `constructor`, and `prototype` in paths, schemas, defaults, props, metadata, submissions, and backend responses

### Requirement: Submission envelope documentation
The project SHALL define the normalized submission envelope before renderer or adapter implementation.

#### Scenario: Submission envelope document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/submission-envelope-v1.md` defines `formId`, `revisionId`, `revisionHash`, `schemaVersion`, `submissionAttemptId`, `submittedAt`, `locale`, `data`, `files`, and `meta`

#### Scenario: Idempotency and revision integrity are specified
- **WHEN** Phase 1 is complete
- **THEN** the submission contract explains how `submissionAttemptId` and `revisionHash` are used by backends

### Requirement: Backend response documentation
The project SHALL define normalized backend response and validation error contracts before adapter implementation.

#### Scenario: Backend response document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/backend-response-v1.md` defines success, validation error, server error, auth error, rate limit, and conflict response shapes

#### Scenario: Error shape supports field and global errors
- **WHEN** Phase 1 is complete
- **THEN** backend response documentation defines `path`, `code`, `message`, `params`, and `source` for field-level and global errors

### Requirement: Validation rule documentation
The project SHALL define MVP validation rules and fail-closed behavior before validation implementation.

#### Scenario: Validation rules document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/validation-rules-v1.md` defines required, length, numeric, regex, email, URL, option membership, checkbox consent, custom named validators, and error mapping

#### Scenario: Unsupported validators fail closed
- **WHEN** Phase 1 is complete
- **THEN** validation documentation states that unknown custom validators must produce hard diagnostics rather than being ignored

### Requirement: Condition model documentation
The project SHALL define deterministic condition semantics before condition evaluation implementation.

#### Scenario: Conditions document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/conditions-v1.md` defines `all`, `any`, `not`, comparison operators, empty checks, contains checks, missing-value behavior, dependency tracking, and cycle detection

#### Scenario: Async conditions are excluded from MVP
- **WHEN** Phase 1 is complete
- **THEN** condition documentation states that MVP condition evaluation is synchronous and that async predicates are deferred

### Requirement: Hidden value semantics documentation
The project SHALL define hidden-field value behavior before renderer submission behavior is implemented.

#### Scenario: Hidden value document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/hidden-value-semantics-v1.md` defines when hidden values are preserved, cleared, excluded from final submissions, validated, and exposed to conditions

#### Scenario: Default hidden behavior is safe
- **WHEN** Phase 1 is complete
- **THEN** hidden-value documentation states that hidden values are excluded from final submission unless the schema explicitly opts into preserving them

### Requirement: Extension registration documentation
The project SHALL define custom field, validator, and predicate registration contracts before custom extension implementation.

#### Scenario: Extension registration document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/extension-registration-v1.md` defines key, version, input contract, output contract, backend parity flag, diagnostics, and fail-closed behavior for custom fields, validators, and predicates

#### Scenario: Executable schema code is prohibited
- **WHEN** Phase 1 is complete
- **THEN** extension documentation states that schemas must reference custom behavior by registered keys and must not persist executable JavaScript or React components

### Requirement: JSON Schema generation documentation
The project SHALL define JSON Schema generation scope before compiler implementation.

#### Scenario: JSON Schema generation document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/json-schema-generation-v1.md` locks Draft 2020-12 and defines generated outputs, non-goals, unsupported behavior diagnostics, and compiler warning shapes

#### Scenario: JSON Schema is not the authoring model
- **WHEN** Phase 1 is complete
- **THEN** JSON Schema documentation states that generated schemas are backend-friendly structural artifacts and not the canonical authoring source of truth

### Requirement: Backend conformance fixture documentation
The project SHALL define conformance fixture categories before fixtures are implemented.

#### Scenario: Conformance fixture document exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/schema/backend-conformance-fixtures-v1.md` lists required valid and invalid schema, submission, backend response, conflict response, upload metadata, and unsupported compiler warning fixtures

#### Scenario: Fixtures target non-JavaScript backends
- **WHEN** Phase 1 is complete
- **THEN** conformance documentation states that fixtures must be JSON-first and usable by Go, Node, Python, PHP, Ruby, Java, and custom backends

### Requirement: Phase report and checklist coverage
The project SHALL report Phase 1 completion and map architecture pre-implementation checklist items to contract documents.

#### Scenario: Phase report exists
- **WHEN** Phase 1 is complete
- **THEN** `docs/reports/2026-05-14-phase-1-contract-specification.md` summarizes changed files, decisions, tests or checks run, limitations, and owner review checklist

#### Scenario: Architecture checklist is mapped
- **WHEN** Phase 1 is complete
- **THEN** the Phase 1 report maps each architecture pre-implementation checklist item to one or more `docs/schema/` contract documents

### Requirement: Schema and submission safety documentation
The project SHALL document operational safety rules for canonical schemas, submitted paths, dangerous keys, normalized submissions, hidden values, extension registration, and backend responses.

#### Scenario: Safety doc exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/security/schema-and-submission-safety.md` documents dangerous-key rejection, submitted path grammar, hidden-value semantics, normalized submission envelopes, backend response parsing, and extension fail-closed behavior

#### Scenario: Safety doc identifies forbidden persisted behavior
- **WHEN** the safety doc is inspected
- **THEN** it states that persisted schemas must not store executable JavaScript, React components, backend SDK objects, DOM objects, or transport-specific behavior

#### Scenario: Safety doc links canonical references
- **WHEN** the safety doc is inspected
- **THEN** it links to canonical schema, submitted path grammar, submission envelope, backend response, validation rules, conditions, hidden-value semantics, and extension registration docs

### Requirement: Extension safety documentation
Extension documentation SHALL explain how custom fields, validators, and predicates are registered without weakening canonical schema safety.

#### Scenario: Unknown extensions fail closed
- **WHEN** extension docs are inspected
- **THEN** they state that unknown custom fields, validators, and predicates must fail closed with diagnostics rather than silently submitting or evaluating unsupported behavior

#### Scenario: Backend parity is explicit
- **WHEN** extension docs are inspected
- **THEN** they explain when custom validators or predicates need backend parity and how missing parity should appear in diagnostics or generated artifact review

### Requirement: Canonical contract release-candidate safety audit
Canonical schema, path, validation, condition, extension, submission, and backend response contracts SHALL be audited for release-candidate safety.

#### Scenario: Dangerous keys are audited
- **WHEN** Phase 13 safety checks run
- **THEN** dangerous keys such as `__proto__`, `constructor`, and `prototype` are verified as rejected in schemas, defaults, props, metadata, submitted paths, submissions, and backend responses where the current contracts require rejection

#### Scenario: Executable content exclusion is audited
- **WHEN** Phase 13 schema safety checks run
- **THEN** schemas are verified to reject or diagnose executable JavaScript, React components, DOM objects, backend SDK objects, transport objects, and unsupported rich text behavior

#### Scenario: Hidden value and normalization behavior is audited
- **WHEN** Phase 13 submission checks run
- **THEN** hidden-field value semantics, submitted path normalization, duplicate path handling, invalid path diagnostics, and normalized submission envelopes are verified against current contracts

#### Scenario: Extension fail-closed behavior is audited
- **WHEN** Phase 13 extension checks run
- **THEN** unknown custom fields, validators, and predicates fail closed with diagnostics rather than silently submitting, validating, or evaluating unsupported behavior

#### Scenario: Condition dependency behavior is audited
- **WHEN** Phase 13 condition checks run
- **THEN** deterministic condition evaluation, dependency tracking, invalid references, and cycle diagnostics are verified against current contracts
