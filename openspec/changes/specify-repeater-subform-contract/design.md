# Design

## Scope

First implementation supports one-level repeaters only:

```json
{
  "id": "repeater_dependents",
  "type": "repeater",
  "name": "dependents",
  "children": ["dependent_name", "dependent_age"],
  "minItems": 0,
  "maxItems": 5,
  "itemLabel": "Dependent"
}
```

Child submitted paths are relative to the repeater item, e.g. `name`, `age`. Normalized output:

```json
{
  "dependents": [
    { "_itemId": "item_1", "name": "Ava", "age": 8 }
  ]
}
```

## Rules

- Stable item ids are runtime state and may be submitted only if configured.
- Nested repeaters fail closed.
- Backend errors address `dependents[0].name` and may include item ids for recovery.
- Reordering items must preserve item state and errors.
- Deleting repeater children or changing child paths is a dangerous revision change.

