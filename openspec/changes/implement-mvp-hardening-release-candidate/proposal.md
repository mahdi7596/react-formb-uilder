## Why

The MVP package set now has the core contracts, renderer, builder, adapters, theme readiness, examples, and onboarding docs in place. Before treating it as a release candidate, the project needs a focused hardening pass that proves the end-to-end workflow, audits the package boundaries, and fixes high-priority issues found by verification rather than adding new feature scope.

## What Changes

- Add an MVP release-candidate readiness phase that runs full workspace verification, Playwright flows, accessibility checks, package boundary audits, bundle/import audits, security audits, RTL/LTR audits, and revision immutability checks.
- Resolve high-priority defects discovered during those audits when the fix is within MVP scope and already covered by existing contracts.
- Document remaining limitations, release-readiness evidence, and next-phase candidates in a Phase 13 report.
- Prepare MVP release notes that describe what is included, what is intentionally deferred, and how host projects can evaluate the package set.
- No breaking API changes are planned. Any discovered breaking issue must be called out explicitly in the report and tasks before implementation.

## Capabilities

### New Capabilities
- `mvp-release-candidate-readiness`: Defines the release-candidate audit, verification, defect-resolution, report, and release-note expectations for the first MVP package set.

### Modified Capabilities
- `project-bootstrap`: Strengthens workspace verification expectations for release-candidate status.
- `react-renderer-foundation`: Adds release-candidate audit expectations for renderer accessibility, RTL/LTR behavior, submission behavior, and package API hygiene.
- `builder-ui-foundation`: Adds release-candidate audit expectations for builder accessibility, creator workflow integrity, preview parity, and package API hygiene.
- `persistence-publish-adapters`: Adds release-candidate audit expectations for publish/revision immutability, submission revision hash behavior, and normalized adapter response handling.
- `canonical-contracts`: Adds release-candidate audit expectations for dangerous-key rejection, executable-content exclusion, schema validation, hidden-value behavior, and submission normalization.
- `json-schema-compiler`: Adds release-candidate audit expectations for generated artifact diagnostics and backend-friendly compiler output.

## Impact

- Affected areas include root workspace scripts, package exports, dependency declarations, TypeScript build outputs, tests, Playwright examples, accessibility checks, release notes, and Phase 13 reporting.
- The implementation should prefer audit-first changes: run verification, capture evidence, identify issues, fix high-priority issues, then re-run the relevant checks.
- The phase must not introduce deferred post-MVP features such as nested repeaters, built-in upload orchestration, payments, rich text authoring, arbitrary JavaScript expressions, hosted tenancy, or heavy default design-system scope.
