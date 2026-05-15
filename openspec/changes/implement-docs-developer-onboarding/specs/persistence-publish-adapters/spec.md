## ADDED Requirements

### Requirement: Backend adapter contract documentation
Backend integration documentation SHALL explain normalized adapter contracts for loading, saving, publishing, listing revisions, loading published forms, and submitting forms.

#### Scenario: Backend contracts guide exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/integration/backend-contracts.md` documents adapter operation purposes, request/response expectations, normalized result statuses, JSON-serializable payload rules, and forbidden backend-specific leakage

#### Scenario: Backend contracts guide explains error mapping
- **WHEN** the backend contracts guide is inspected
- **THEN** it explains how backend validation, conflict, auth, rate-limit, server, network, malformed, blocked, and dangerous-key failures map to normalized adapter results or backend responses

#### Scenario: Backend contracts guide explains fixture use
- **WHEN** the backend contracts guide is inspected
- **THEN** it points to backend response docs and conformance fixtures that backend implementers can use to verify integration behavior

### Requirement: Revision and dangerous-change documentation
The project SHALL document revision immutability, draft conflict handling, publish gating, dangerous-change warnings, and migration expectations.

#### Scenario: Revision migration doc exists
- **WHEN** Phase 12 is complete
- **THEN** `docs/migrations/revisions-and-dangerous-changes.md` explains draft versus published revisions, immutable published revision behavior, revision hashes, conflict recovery, publish blocking, dangerous-change diagnostics, and migration boundaries

#### Scenario: Dangerous changes are named
- **WHEN** the revision migration doc is inspected
- **THEN** it names submitted path rename, field deletion, scalar/array shape change, option value change, requiredness change, hidden-value policy change, and field type change as dangerous or review-worthy changes
