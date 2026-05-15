## Why

The project now has enough core, renderer, builder, adapters, validators, themes, and example behavior that a new developer or future agent needs a clear onboarding path instead of piecing the system together from phase reports. Phase 12 should turn the implemented contracts into durable docs that explain how to install, run, integrate, extend, and safely evolve the form builder.

## What Changes

- Add a root `README.md` with product positioning, package map, install/run commands, development workflow, and phase-gate expectations.
- Add integration docs for the React renderer, React builder, backend adapter contracts, and JSON Schema generation.
- Add focused docs for accessibility field contracts, schema/submission safety, and revisions/dangerous changes.
- Add documented examples for custom field registration, custom validator registration, custom predicate registration, and backend response mapping.
- Update stale package READMEs, especially `packages/core/README.md`, so package boundaries reflect implemented behavior rather than Phase 0 placeholders.
- Add a Phase 12 report with changed docs, commands run, known limitations, and owner review checklist.

## Capabilities

### New Capabilities
- `developer-onboarding-documentation`: documents the required developer onboarding, integration, extension, safety, accessibility, migration, and verification documentation for the current MVP package set.

### Modified Capabilities
- `project-bootstrap`: root README and package README requirements become part of the durable workspace governance and onboarding contract.
- `react-renderer-foundation`: renderer integration and accessibility documentation requirements are added for public renderer usage, slots, fields, submissions, errors, and custom fields.
- `builder-ui-foundation`: builder integration documentation requirements are added for workspace usage, persistence/publish surfaces, generated artifacts, theme hooks, and host customization.
- `persistence-publish-adapters`: backend contract and revision/dangerous-change documentation requirements are added for adapter implementers.
- `json-schema-compiler`: JSON Schema generation documentation requirements are added for backend-friendly compiler artifacts, diagnostics, and conformance examples.
- `canonical-contracts`: safety documentation requirements are added for schema, submitted paths, dangerous-key rejection, hidden values, extension registration, and backend responses.

## Impact

- Affects documentation and OpenSpec specs only until implementation begins.
- No runtime API changes are intended.
- No dependency changes are expected.
- Follow-up implementation will touch root and package READMEs plus files under `docs/integration/`, `docs/accessibility/`, `docs/security/`, `docs/migrations/`, and `docs/reports/`.
