## ADDED Requirements

### Requirement: Builder artifact bundle
The validators package SHALL provide a generated artifact bundle suitable for builder publish review and backend handoff.

#### Scenario: Artifact bundle includes review data
- **WHEN** a canonical schema is compiled for builder publish review
- **THEN** the output includes generated JSON Schema, compiler diagnostics, validation plan entries, condition dependencies, dialect metadata, generated timestamp or deterministic metadata where available, and references to relevant conformance fixture categories

#### Scenario: Artifact bundle remains compiler-owned
- **WHEN** React builder code needs generated artifacts
- **THEN** it consumes the validators package compiler output rather than duplicating JSON Schema generation or compiler diagnostic logic

#### Scenario: Artifact diagnostics feed publish checks
- **WHEN** compiler output contains errors or warnings such as dangerous keys, invalid paths, unknown field types, unsupported custom validators, unsupported regex, or non-representable conditions
- **THEN** the artifact bundle exposes severity and message data that publish checks can classify as blocking or reviewable without losing the original compiler diagnostic codes
