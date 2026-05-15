## ADDED Requirements

### Requirement: Builder persistence status surface
The React builder package SHALL render persistence-aware workspace states for draft loading, dirty edits, saving, saved confirmation, save failure, retry, and conflict recovery while keeping schema changes command-backed.

#### Scenario: Draft loading is explicit
- **WHEN** the builder is loading a draft through host persistence
- **THEN** the workspace shows a loading state that does not imply a schema is editable until a usable draft or recoverable error is available

#### Scenario: Save status follows adapter result
- **WHEN** a creator saves a draft
- **THEN** the command bar or persistence surface shows saving, saved, failed, or retryable status based on normalized adapter results rather than raw transport errors

#### Scenario: Conflict recovery preserves local work
- **WHEN** saving fails because of a stale draft conflict
- **THEN** the builder shows conflict recovery options such as reload latest, retry when safe, or preserve local edits without silently replacing the local schema

### Requirement: Publish checklist surface
The React builder package SHALL provide a publish checklist that gates publication using schema diagnostics, compiler diagnostics, dangerous-change warnings, required metadata checks, and adapter conflict status.

#### Scenario: Publish blocked by errors
- **WHEN** required publish checks produce blocking errors
- **THEN** the publish action is blocked and the checklist identifies the blocking issues with actionable labels or affected nodes where available

#### Scenario: Publish warns about dangerous changes
- **WHEN** publish checks find dangerous but reviewable changes such as submitted path renames, field deletion, shape changes, option value changes, requiredness changes, or hidden-value policy changes
- **THEN** the builder shows warning context before publishing and does not hide the compatibility risk

#### Scenario: Publish success updates revision context
- **WHEN** publishing succeeds through the adapter contract
- **THEN** the builder updates its visible revision metadata to the returned immutable published revision identity, hash, status, and timestamp without mutating any previous published revision

### Requirement: Revision warning surface
The React builder package SHALL provide a revision warning surface that compares the current draft context with relevant published revision metadata where available.

#### Scenario: Latest published revision is visible
- **WHEN** revision metadata is available
- **THEN** the builder identifies the latest published revision and current draft state in a way creators can understand before saving or publishing

#### Scenario: Dangerous revision differences are surfaced
- **WHEN** current draft edits may affect stored submissions or backend contracts compared with a published revision
- **THEN** the builder surfaces warning diagnostics and affected field context before publish

### Requirement: Generated artifact panel
The React builder package SHALL expose generated backend-friendly artifacts for creator review without implementing compiler behavior inside the builder package.

#### Scenario: Artifact panel displays compiler output
- **WHEN** generated artifact data is available from the validators compiler
- **THEN** the builder can display JSON Schema, compiler diagnostics, validation plan entries, condition dependencies, and conformance fixture references

#### Scenario: Artifact panel handles diagnostics
- **WHEN** generated artifacts contain unsupported or unsafe behavior diagnostics
- **THEN** the builder shows the diagnostics in the artifact panel and publish checklist according to their blocking or warning severity

#### Scenario: Builder does not duplicate compiler logic
- **WHEN** artifact panel behavior is implemented
- **THEN** JSON Schema generation and compiler diagnostic derivation remain in `packages/validators`, not in `packages/react-builder`
