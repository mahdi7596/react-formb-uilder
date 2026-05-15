# @your-org/forms-core

Framework-agnostic contracts and runtime behavior for the form builder.

## Responsibility

This package owns the canonical JSON contracts and pure runtime helpers that must work without React or a backend SDK:

- canonical schema types and schema analysis
- submitted path parsing and safety checks
- dangerous-key and executable-code rejection helpers
- validation rule primitives
- deterministic condition evaluation and dependency extraction
- default value resolution and hidden/disabled submission filtering
- normalized submission envelope creation
- normalized backend response parsing
- migration runner shell
- diagnostic vocabulary
- contract fixtures for schema, submission, response, and compiler behavior

## Boundary

`@your-org/forms-core` must not depend on React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, upload providers, design-system components, CSS, browser upload orchestration, transport clients, or backend SDKs.

React packages consume core behavior. Validators consume core contracts to produce optional backend-friendly artifacts. Adapters exchange JSON contracts with hosts. Core itself remains framework-neutral.

## Public Areas

- `schema`: canonical form schema contracts and `analyzeSchema`.
- `paths`: submitted path parser, serializer, and path checks.
- `safety`: dangerous key and executable-code checks.
- `validation`: built-in validation rule behavior.
- `conditions`: declarative condition evaluation and dependency extraction.
- `submissions`: default value resolution and normalized submission envelope creation.
- `responses`: normalized backend response parsing.
- `migrations`: migration runner shell for future schema migrations.
- `diagnostics`: stable diagnostic codes and diagnostic objects.
- `testing/fixtures`: conformance fixtures used by packages and docs.

## Read More

- Root onboarding: [../../README.md](../../README.md)
- Canonical schema: [../../docs/schema/canonical-schema-v1.md](../../docs/schema/canonical-schema-v1.md)
- Submitted path grammar: [../../docs/schema/submitted-path-grammar-v1.md](../../docs/schema/submitted-path-grammar-v1.md)
- Submission envelope: [../../docs/schema/submission-envelope-v1.md](../../docs/schema/submission-envelope-v1.md)
- Backend response: [../../docs/schema/backend-response-v1.md](../../docs/schema/backend-response-v1.md)
- Conditions: [../../docs/schema/conditions-v1.md](../../docs/schema/conditions-v1.md)
- Validation rules: [../../docs/schema/validation-rules-v1.md](../../docs/schema/validation-rules-v1.md)
- Extension registration: [../../docs/schema/extension-registration-v1.md](../../docs/schema/extension-registration-v1.md)
- Safety guide: [../../docs/security/schema-and-submission-safety.md](../../docs/security/schema-and-submission-safety.md)
