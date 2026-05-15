## ADDED Requirements

### Requirement: Provider-Neutral Payment References

Payment features SHALL store provider-neutral references and SHALL NOT store raw card data.

#### Scenario: Card data is never persisted
- **WHEN** a respondent pays through a provider
- **THEN** schemas, submissions, logs, and generated artifacts contain no card number, CVC, or raw payment method secret

#### Scenario: Payment status is backend-confirmed
- **WHEN** a form requires successful payment
- **THEN** final submission success depends on backend-confirmed provider status, not only client-side checkout state

#### Scenario: Payment operations are idempotent
- **WHEN** a payment create or final submission request is retried
- **THEN** idempotency keys prevent duplicate charges or duplicate paid submissions

