# Design

## Option Source

```json
{
  "optionSource": {
    "type": "adapter",
    "key": "crm.accounts",
    "version": "1.0.0",
    "params": {
      "country": { "field": "country" }
    },
    "valueField": "id",
    "labelField": "name",
    "cache": { "scope": "session", "ttlSeconds": 300 }
  }
}
```

## Runtime

- Renderer requests options through a host adapter.
- Loading state is visible and accessible.
- Failed sources show a recoverable error.
- Submitted values must be stable ids, not labels.
- Submission validates selected values against the loaded source snapshot or backend validation.

## Builder

Builder offers static fallback options and source diagnostics, but does not embed external records into schema unless explicitly snapshotted.

