## ADDED Requirements

### Requirement: Trusted Upload Lifecycle

Uploads SHALL use host-backed prepare and finalize contracts before file metadata can be submitted.

#### Scenario: Submission contains trusted metadata only
- **WHEN** a respondent uploads a file
- **THEN** the final submission stores trusted backend file ids and metadata
- **AND** it does not store raw browser File objects, provider secrets, or presigned upload URLs

#### Scenario: Rejected scans block submission
- **WHEN** an uploaded file is rejected by scanning or backend validation
- **THEN** the renderer displays a recoverable error
- **AND** the submission cannot include that rejected file

#### Scenario: Orphan cleanup is explicit
- **WHEN** a respondent abandons a prepared or uploaded file before final submission
- **THEN** the host adapter receives enough state to clean up the orphan according to retention policy

