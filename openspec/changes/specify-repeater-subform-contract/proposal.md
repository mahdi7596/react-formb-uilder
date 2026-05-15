# Specify Repeater Subform Contract

## Why

Repeaters, subforms, and table rows are high-value features, but they affect path grammar, validation, backend errors, focus management, migrations, JSON Schema generation, and accessibility. They must be specified before implementation.

## What Changes

- Define one-level repeater semantics first.
- Define array path grammar, item identity, validation, backend errors, and migration warnings.
- Explicitly defer nested repeaters until a later contract.

## Impact

- Future implementation touches core traversal, submissions, renderer field arrays, builder nesting, validators, and Playwright flows.

