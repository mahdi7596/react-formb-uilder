# Design

## Expression Model

Calculations use JSON expressions, never JavaScript strings:

```json
{
  "type": "calculation",
  "id": "calc_total",
  "name": "order.total",
  "valueType": "decimal",
  "expression": {
    "op": "add",
    "args": [
      { "field": "order.subtotal" },
      { "field": "order.tax" }
    ]
  },
  "rounding": { "mode": "halfAwayFromZero", "scale": 2 }
}
```

Supported first-wave expression nodes:

- literal: string, number, decimal string, boolean, null
- field reference by submitted path
- arithmetic: add, subtract, multiply, divide, modulo
- comparison: eq, neq, gt, gte, lt, lte
- boolean: and, or, not
- conditional: if
- aggregate over arrays only after repeater contract lands

## Type System

Types are `string`, `number`, `decimal`, `boolean`, `date`, `datetime`, `duration`, `array`, and `null`. Decimal values use strings for precision-sensitive money and scoring.

## Safety

- Unknown operators fail closed.
- Cycles block publish.
- Divide-by-zero produces a calculation error, not `Infinity`.
- Frontend and backend evaluators must share conformance fixtures.
- Calculation value changes that affect submitted data are dangerous revision changes.

