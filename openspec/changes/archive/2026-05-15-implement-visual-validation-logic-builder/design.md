## Context

The current builder inspector has tabs for content, validation, logic, accessibility, and data. Validation only exposes a required checkbox. Logic exposes raw visibility condition JSON. The core schema already has validation rules and declarative condition expressions, including rule-level `when` conditions. The condition runtime supports `all`, `any`, comparison operators, dependency extraction, and fail-closed diagnostics for unsupported predicates.

Phase 16 should use those existing contracts instead of inventing a new expression engine.

## Goals / Non-Goals

**Goals:**

- Let creators configure common validation rules visually.
- Let creators configure simple visibility and conditional requiredness visually.
- Store visual logic as existing canonical condition expressions.
- Preserve command-backed edits and undo/redo.
- Keep unsupported logic actions explicit and non-persisted.
- Add runtime parity for conditional validation rule evaluation.
- Add focused tests and documentation.

**Non-Goals:**

- Skip logic, branching between pages, endings, redirects, calculations, scoring, conditional option filtering, answer piping, or dynamic options.
- Full expression builder with nested arbitrary groups.
- AI logic generation.
- Persian/RTL implementation; Phase 17 owns that.
- Content/layout blocks; Phase 18 owns that.

## Decisions

### Use existing condition expressions

Visual logic writes the same declarative condition shape the core already evaluates:

```json
{ "all": [{ "field": "plan", "op": "eq", "value": "enterprise" }] }
```

No executable JavaScript or React components are persisted.

### Conditional requiredness uses `ValidationRule.when`

A conditionally required field is represented as:

```json
{ "type": "required", "when": { "all": [{ "field": "plan", "op": "eq", "value": "enterprise" }] } }
```

This keeps requiredness in the validation model rather than adding a separate ad hoc builder-only field.

### Keep the first visual builder bounded

Phase 16 supports one-level AND/OR groups with simple field/operator/value rows. This covers common show/hide and require-if workflows without taking on full nested logic UI complexity.

### Read-only debug JSON remains useful

Creators should not have to write JSON for common behavior, but a read-only JSON preview helps developers verify the canonical contract being produced.

## Risks / Trade-offs

- [Risk] A bounded visual rule builder may not cover every condition shape already possible in JSON. -> Mitigation: mark unsupported existing shapes clearly and do not silently rewrite them.
- [Risk] Conditional requiredness can be confused with plain requiredness. -> Mitigation: label it clearly and show the generated condition summary.
- [Risk] Validation UI could become too generic. -> Mitigation: show only rules relevant to the selected field type.
