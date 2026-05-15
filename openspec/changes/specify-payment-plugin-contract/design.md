# Design

## Boundary

Core may define provider-neutral submitted references:

```json
{
  "payment": {
    "provider": "stripe",
    "paymentIntentId": "pi_...",
    "status": "succeeded",
    "amount": "49.00",
    "currency": "USD",
    "lineItems": []
  }
}
```

Provider SDKs, checkout sessions, webhooks, refunds, and secrets live in host adapters/plugins.

## Rules

- Never store card numbers, CVC, or raw payment method secrets.
- Payment creation and final submission use idempotency keys.
- Backend verifies provider webhook signatures.
- Renderer handles pending, succeeded, failed, canceled, and requires-action states.
- Submission can require successful payment only after backend confirmation.

