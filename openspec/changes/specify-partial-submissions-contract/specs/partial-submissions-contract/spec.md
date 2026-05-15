## ADDED Requirements

### Requirement: Idempotent Partial Submission Contract

Partial submissions SHALL use backend-owned ids and idempotency keys.

#### Scenario: Repeated partial save is idempotent
- **WHEN** the renderer retries a partial save with the same idempotency key
- **THEN** the backend treats it as the same operation
- **AND** duplicate partial records are not created

#### Scenario: Resume validates revision compatibility
- **WHEN** a respondent resumes a partial submission
- **THEN** the host verifies form id, revision compatibility, token validity, and expiry before returning draft data

#### Scenario: Sensitive fields can opt out
- **WHEN** a field is marked as excluded from partial persistence
- **THEN** partial save omits that value even if final submission would include it

