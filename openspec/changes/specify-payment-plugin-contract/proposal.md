# Specify Payment Plugin Contract

## Why

Payments are common in mature form builders but carry PCI, provider webhook, idempotency, double-charge, refund, and security risks. Payment implementation must stay provider-adapter based and never store card data.

## What Changes

- Define product/order/payment reference contracts.
- Define provider plugin boundary.
- Define idempotency, status reconciliation, webhook verification, and never-store-card-data rules.

## Impact

- Future implementation belongs in adapters/plugins plus renderer/builder surfaces, not provider code inside core.

