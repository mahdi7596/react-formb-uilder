# Conditions V1

Status: Phase 1 contract

Conditions are declarative expressions used for visibility, enabled state, conditional validation, and future branching. Conditions must be deterministic, JSON-serializable, synchronous in MVP, and safe to evaluate outside React.

## Goals

- Avoid arbitrary JavaScript in schemas.
- Make dependencies trackable.
- Detect cycles before publish.
- Define missing-value behavior.
- Keep frontend and backend interpretation aligned where conditions affect submitted data.

## Expression Shape

Conditions use `all`, `any`, `not`, field comparisons, or registered predicates.

```json
{
  "all": [
    { "field": "country", "op": "eq", "value": "IR" },
    { "field": "age", "op": "gte", "value": 18 }
  ]
}
```

## Logical Operators

### All

```json
{ "all": [conditionA, conditionB] }
```

Passes when every child condition passes. Empty `all` is invalid.

### Any

```json
{ "any": [conditionA, conditionB] }
```

Passes when at least one child condition passes. Empty `any` is invalid.

### Not

```json
{ "not": conditionA }
```

Passes when the child condition does not pass.

## Field Comparison

```json
{
  "field": "age",
  "op": "gte",
  "value": 18
}
```

`field` references a submitted path, not a node id.

MVP operators:

| Operator | Meaning |
| --- | --- |
| `eq` | strict JSON equality |
| `neq` | not strict JSON equality |
| `gt` | number greater than |
| `gte` | number greater than or equal |
| `lt` | number less than |
| `lte` | number less than or equal |
| `empty` | value is empty by field type |
| `notEmpty` | value is not empty by field type |
| `contains` | array contains value or string contains substring |
| `notContains` | inverse contains |
| `in` | value is one of provided values |
| `notIn` | value is not one of provided values |
| `matches` | string matches restricted regex |

Regex in `matches` follows the same restrictions as validation regex.

## Missing-Value Behavior

When referenced value is missing:

| Operator | Result |
| --- | --- |
| `empty` | true |
| `notEmpty` | false |
| `eq` | true only when comparison value is null |
| `neq` | false when comparison value is null, otherwise true |
| numeric comparisons | false |
| `contains` | false |
| `notContains` | true |
| `in` | false |
| `notIn` | true |
| `matches` | false |

Missing field references should produce diagnostics during publish checks when the field path is unknown.

## Dependency Tracking

Condition analysis must collect dependencies:

```json
{
  "nodeId": "business_email",
  "dependsOn": ["companyType", "country"]
}
```

Dependencies are submitted paths. The builder can map them back to node ids where possible.

Dependency tracking powers:

- publish diagnostics
- condition debugger
- cycle detection
- impact warnings when submitted names change
- hidden-field behavior

## Cycle Detection

Cycles are invalid when a node's visibility, enabled state, or validation depends directly or indirectly on itself.

Example invalid cycle:

```text
field_a visibility depends on field_b
field_b visibility depends on field_a
```

Cycle diagnostics must include affected nodes and paths.

## Custom Predicates

```json
{
  "predicate": "isBusinessEmail",
  "version": "1.0.0",
  "args": ["email"]
}
```

Rules:

- Predicates must be registered by key and version.
- Predicate args are JSON values or submitted path references as defined by the predicate contract.
- Unknown predicates fail closed.
- Async predicates are excluded from MVP.
- Schemas must not contain executable predicate code.

## Visibility And Enabled State

Visibility:

- false means the node and descendants are not rendered
- hidden-value semantics determine state and final submission behavior

Enabled state:

- false means the node is visible but not interactive
- disabled values are excluded from validation and final submission by default

## Publish Diagnostics

Publish checks must diagnose:

- unknown referenced submitted path
- invalid operator for value type
- invalid regex
- unknown predicate
- predicate version mismatch
- condition cycle
- condition that depends on unsupported repeater behavior
- condition too complex by configured limits

## Complexity Limits

MVP condition analysis must define implementation limits in Phase 2 tests:

- maximum nesting depth
- maximum number of condition nodes
- maximum regex length
- maximum dependency count per condition

If limits are exceeded, publish must fail closed.
