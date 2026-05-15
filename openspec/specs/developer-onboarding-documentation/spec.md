## Purpose
Define the developer onboarding documentation expected for the backend-agnostic React form builder so new developers, host integrators, backend implementers, and future agents can find the current product contracts without phase-history archaeology.

## Requirements

### Requirement: Root developer onboarding entry point
The project SHALL provide a root onboarding document that explains the product, current MVP status, package map, setup commands, verification commands, and next documentation paths for a new developer or future agent.

#### Scenario: New developer can identify the product and packages
- **WHEN** a new developer opens the root README
- **THEN** it explains that this is a backend-agnostic React form builder using a canonical schema, optional JSON Schema artifacts, and package-first boundaries for core, renderer, builder, validators, adapters, themes, and examples

#### Scenario: New developer can install and verify
- **WHEN** a new developer follows the root README from a clean checkout
- **THEN** it provides the pnpm install, test, typecheck, build, and example dev commands needed to verify the workspace

#### Scenario: Future agent can find durable context
- **WHEN** a future agent reads the root README
- **THEN** it points to `AGENTS.md`, architecture decisions, schema docs, integration docs, phase workflow, and current reports rather than requiring phase-history archaeology

### Requirement: Documentation map by integration role
The project SHALL provide a documentation map that routes readers to the correct integration document based on whether they are rendering forms, building admin authoring surfaces, implementing a backend, reviewing accessibility, reviewing safety, or handling revisions.

#### Scenario: Renderer integrator finds renderer docs
- **WHEN** a host app developer needs to render a published form
- **THEN** the documentation map points them to the React renderer integration guide and schema/submission references

#### Scenario: Builder integrator finds builder docs
- **WHEN** an admin app developer needs to embed the visual builder
- **THEN** the documentation map points them to the React builder integration guide, adapter docs, generated artifact docs, and theme customization notes

#### Scenario: Backend implementer finds backend docs
- **WHEN** a backend implementer needs to load, save, publish, or submit forms
- **THEN** the documentation map points them to backend contracts, JSON Schema generation, backend response mapping, revision safety, and conformance fixture guidance

### Requirement: Extension examples
The documentation SHALL include examples for custom field registration, custom validator registration, custom predicate registration, and backend response mapping using current product-owned contracts.

#### Scenario: Custom field example is source-derived
- **WHEN** the custom field documentation is inspected
- **THEN** it shows how to register a renderer field through the current field registry contract without exposing React Hook Form or storing executable code in schemas

#### Scenario: Custom validator and predicate examples are fail-closed
- **WHEN** validator and predicate extension examples are inspected
- **THEN** they explain registration keys, backend parity expectations, diagnostics, and fail-closed behavior for unknown or unsupported extensions

#### Scenario: Backend response mapping example uses normalized contracts
- **WHEN** backend response documentation is inspected
- **THEN** it shows normalized success, validation error, conflict, auth, rate-limit, and server-error response shapes or references without exposing backend-specific transport exceptions

### Requirement: Phase 12 report
The documentation onboarding phase SHALL produce a report for owner review before MVP hardening begins.

#### Scenario: Phase report summarizes documentation work
- **WHEN** Phase 12 is complete
- **THEN** `docs/reports/2026-05-15-phase-12-docs-onboarding.md` summarizes changed docs, examples added, commands run, known limitations, and owner review checklist

#### Scenario: Report records validation limits
- **WHEN** documentation link checking or OpenSpec strict validation is not fully available because of existing project limitations
- **THEN** the phase report records the exact limitation and what verification was run instead
