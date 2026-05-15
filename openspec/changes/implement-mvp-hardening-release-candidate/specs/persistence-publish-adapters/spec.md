## ADDED Requirements

### Requirement: Persistence and publish release-candidate audit
Persistence, publish, revision, and submission adapter behavior SHALL be audited before the MVP package set is considered release-candidate ready.

#### Scenario: Publish immutability is audited
- **WHEN** Phase 13 persistence checks run
- **THEN** published revision immutability, draft editing behavior, generated artifact snapshots, revision metadata, and revision hash behavior are verified against the current contracts

#### Scenario: Submission revision integrity is audited
- **WHEN** Phase 13 submission checks run
- **THEN** submissions include the correct `revisionId`, `revisionHash`, schema version, attempt identity, locale, normalized data, file metadata, and JSON-serializable metadata

#### Scenario: Adapter response mapping is audited
- **WHEN** Phase 13 adapter checks run
- **THEN** success, validation error, conflict, auth error, rate-limit, server error, network error, malformed response, blocked, and dangerous-key outcomes map to normalized product-owned statuses

#### Scenario: Adapter public boundaries are audited
- **WHEN** Phase 13 adapter package checks run
- **THEN** adapter contracts do not require React state, TanStack Query objects, backend SDK exceptions, or transport-specific response objects in public product APIs
