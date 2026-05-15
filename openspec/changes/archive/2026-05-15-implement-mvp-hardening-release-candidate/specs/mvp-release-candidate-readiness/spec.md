## ADDED Requirements

### Requirement: Release-candidate verification evidence
The project SHALL collect repeatable release-candidate verification evidence before the MVP package set is considered ready for owner review.

#### Scenario: Full verification commands are recorded
- **WHEN** Phase 13 is complete
- **THEN** the phase report records the exact commands, outcomes, and relevant notes for workspace tests, typecheck, build, Playwright e2e suites, accessibility checks, package boundary audit, and OpenSpec validation

#### Scenario: Verification failures are classified
- **WHEN** any release-candidate verification command fails or produces warnings
- **THEN** the phase report classifies the finding as release-blocking, high, medium, low, or deferred and records whether it was fixed during Phase 13

### Requirement: Audit-first defect resolution
The release-candidate phase SHALL resolve high-priority issues found by audit while avoiding unbounded feature expansion.

#### Scenario: High-priority issues are fixed or documented
- **WHEN** Phase 13 audits identify release-blocking or high-priority issues within MVP scope
- **THEN** the implementation fixes them or records a clear reason they remain deferred before owner review

#### Scenario: Out-of-scope feature requests are deferred
- **WHEN** an audit finding would require deferred post-MVP features or unspecified contracts
- **THEN** the finding is documented as follow-up work rather than implemented in Phase 13

### Requirement: MVP release notes
The project SHALL prepare MVP release notes that summarize current package capabilities, setup path, verification status, known limitations, and deferred scope.

#### Scenario: Release notes describe MVP capabilities
- **WHEN** Phase 13 is complete
- **THEN** the release notes describe the implemented core, renderer, builder, validators, adapters, themes, and example app capabilities without claiming deferred post-MVP features are supported

#### Scenario: Release notes identify release-candidate limits
- **WHEN** the release notes are inspected
- **THEN** they identify placeholder package scope, known limitations, deferred features, and owner decisions still needed before public publishing

### Requirement: Phase 13 owner review report
The release-candidate phase SHALL produce a report for owner review before release, continued hardening, or post-MVP feature planning.

#### Scenario: Phase report exists
- **WHEN** Phase 13 is complete
- **THEN** `docs/reports/2026-05-15-phase-13-mvp-release-candidate.md` summarizes audits run, verification evidence, defects found, fixes made, residual risks, release-note location, and owner review checklist

#### Scenario: Report supports owner decision
- **WHEN** the owner reviews the Phase 13 report
- **THEN** it clearly supports deciding whether to release the MVP candidate, continue hardening, or start post-MVP feature planning
