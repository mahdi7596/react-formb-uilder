# React Form Builder

Backend-agnostic React form builder workspace for authoring, rendering, validating, publishing, and submitting forms through JSON contracts.

The product uses a custom canonical form schema as the authoring and rendering source of truth. JSON Schema is generated only as an optional backend-friendly artifact. React is used for the public renderer and admin builder packages, while backend integration stays based on normalized JSON requests and responses.

## Current Status

This repository is in MVP development. The current workspace includes:

- framework-agnostic core contracts and runtime helpers
- React public form renderer
- React visual builder with command-backed editing, preview, drag-and-drop, keyboard movement, persistence status, publish checklist, generated artifacts, and revision warnings
- optional JSON Schema compiler artifacts
- normalized backend adapter contracts
- optional starter theme package
- runnable Vite React example with Playwright coverage

Package names currently use the provisional `@your-org/*` workspace scope. Replace that scope before publishing packages.

## Package Map

| Package | Responsibility |
| --- | --- |
| `@your-org/forms-core` | Framework-agnostic schema contracts, submitted paths, dangerous-key rejection, validation primitives, condition evaluation, submissions, backend responses, migrations, diagnostics, and fixtures. |
| `@your-org/forms-react-renderer` | React respondent renderer, field registry, slots, accessibility wiring, step navigation, validation display, submission envelopes, and backend response mapping. |
| `@your-org/forms-react-builder` | React admin builder workspace, schema editing commands/store, palette, canvas, inspector, preview, drag-and-drop, persistence surfaces, publish checklist, revision warnings, and generated artifact display. |
| `@your-org/forms-validators` | Optional Draft 2020-12 JSON Schema generation, compiler diagnostics, validation plans, condition dependency artifacts, and builder artifact bundles. |
| `@your-org/forms-adapters` | Thin JSON-first adapter contracts for loading forms, saving drafts, publishing revisions, listing revisions, loading published forms, and submitting envelopes. |
| `@your-org/forms-themes` | Optional starter tokens, CSS variables, renderer/builder theme helpers, focus styles, and reduced-motion CSS. |
| `examples/vite-react` | Browser-runnable host app proving renderer, builder, fake backend adapters, theme usage, and e2e flows. |

Boundary rules:

- `packages/core` must stay free of React, CSS, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system packages, and transport clients.
- React behavior belongs in `packages/react-renderer` and `packages/react-builder`.
- Backend integration uses normalized JSON adapter contracts, not React state or backend-specific SDK objects.
- JSON Schema is an optional generated artifact, not the canonical authoring model.
- Themes are removable. Host apps may use the default theme helpers, override `--rfb-*` variables, or replace package styling.
- Persisted schemas must not contain executable JavaScript or React components.

## Quick Start

Install dependencies:

```bash
pnpm install
```

Run the main verification commands:

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm audit:release
```

Run the example app:

```bash
pnpm --filter @your-org/forms-example-vite-react dev
```

Run example browser tests:

```bash
pnpm --filter @your-org/forms-example-vite-react test:e2e
```

Useful package-level checks:

```bash
pnpm --filter @your-org/forms-core test
pnpm --filter @your-org/forms-react-renderer test
pnpm --filter @your-org/forms-react-builder test
pnpm --filter @your-org/forms-validators test
pnpm --filter @your-org/forms-themes test
```

## Documentation Map

Start here by role:

| Role | Read |
| --- | --- |
| Future agent or maintainer | [AGENTS.md](AGENTS.md), [architecture](docs/architecture/2026-05-14-react-form-builder-architecture-design.md), [React architecture decisions](docs/architecture/2026-05-14-react-technical-architecture-decisions.md), [phase workflow](docs/development/phase-workflow.md) |
| Schema/runtime implementer | [canonical schema](docs/schema/canonical-schema-v1.md), [submitted paths](docs/schema/submitted-path-grammar-v1.md), [validation rules](docs/schema/validation-rules-v1.md), [conditions](docs/schema/conditions-v1.md), [hidden values](docs/schema/hidden-value-semantics-v1.md) |
| React renderer integrator | [React renderer integration](docs/integration/react-renderer.md), [field accessibility contract](docs/accessibility/field-contract.md), [submission envelope](docs/schema/submission-envelope-v1.md), [backend response](docs/schema/backend-response-v1.md) |
| React builder integrator | [React builder integration](docs/integration/react-builder.md), [backend contracts](docs/integration/backend-contracts.md), [revisions and dangerous changes](docs/migrations/revisions-and-dangerous-changes.md), [theme package](packages/themes/README.md) |
| Backend implementer | [backend contracts](docs/integration/backend-contracts.md), [JSON Schema generation](docs/integration/json-schema-generation.md), [backend conformance fixtures](docs/schema/backend-conformance-fixtures-v1.md), [schema and submission safety](docs/security/schema-and-submission-safety.md) |
| Accessibility reviewer | [field accessibility contract](docs/accessibility/field-contract.md), [React renderer integration](docs/integration/react-renderer.md), [React builder integration](docs/integration/react-builder.md) |
| Security reviewer | [schema and submission safety](docs/security/schema-and-submission-safety.md), [submitted paths](docs/schema/submitted-path-grammar-v1.md), [extension registration](docs/schema/extension-registration-v1.md) |
| Release reviewer | [MVP release candidate notes](docs/release-notes/2026-05-15-mvp-release-candidate.md), [latest Phase 13 report](docs/reports/2026-05-15-phase-13-mvp-release-candidate.md) |

## Development Workflow

Development proceeds through reviewed phases:

1. Create or inspect an OpenSpec change.
2. Implement the tasks for one phase.
3. Run that phase's verification commands.
4. Write a detailed report under `docs/reports/`.
5. Commit the work.
6. Let the owner review before moving to the next phase.

See [docs/development/phase-workflow.md](docs/development/phase-workflow.md) for the full workflow. Every new AI or coding session should read [AGENTS.md](AGENTS.md) before planning or changing code.

## Current Example

The Vite example demonstrates:

- builder draft save and conflict recovery through fake host adapters
- publish checklist and immutable revision metadata
- generated JSON Schema and compiler artifact review
- renderer single-page and multi-step submissions
- backend validation error mapping
- hidden field filtering
- RTL rendering
- default theme package usage with host CSS variable overrides

Example source lives in [examples/vite-react](examples/vite-react/).

## Non-Goals In Current MVP

- Real backend implementation
- Auth or user management
- Upload orchestration beyond file metadata contracts
- Repeaters
- Package publishing
- Hosted documentation site
- Final visual design system

These can be added in later phases once their contracts are specified.
