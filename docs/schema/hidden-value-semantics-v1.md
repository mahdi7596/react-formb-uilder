# Hidden Value Semantics V1

Status: Phase 1 contract

Hidden values include values from hidden nodes and values from conditionally hidden visible fields. This document defines how those values interact with rendering, validation, conditions, and final submissions.

## Default Policy

By default, hidden values are excluded from final submissions.

```json
{
  "settings": {
    "preserveHiddenValues": false
  }
}
```

A schema can opt into preservation:

```json
{
  "settings": {
    "preserveHiddenValues": true
  }
}
```

Preserving hidden values is a data and privacy decision. It must be visible in builder publish checks.

## Hidden Sources

Values can become hidden because:

- the node type is `hidden`
- a visible field's `visibility` condition evaluates to false
- a parent section or step is hidden
- a field is disabled by `enabledWhen`

Hidden is not security. Any value present in frontend schema, defaults, URL parameters, or browser state can be inspected by respondents.

## Final Submission Behavior

| State | Default final submission behavior |
| --- | --- |
| visible and enabled | validate and submit normalized value |
| visible and disabled | exclude from validation and final submission unless a separate field contract explicitly opts in |
| conditionally hidden | exclude from validation and final submission |
| hidden node | submit only if allowed by its own source and form preservation policy |
| parent hidden | descendants are treated as hidden |

When `preserveHiddenValues` is true:

- conditionally hidden values can remain in internal state
- final submission can include preserved values
- validation of hidden preserved values is skipped unless a validator explicitly declares hidden validation support

## Hidden Node Behavior

Hidden nodes are intentionally non-visual. They can capture:

- URL parameters
- host-provided context
- safe static defaults
- integration metadata that is safe to expose to the browser

Hidden nodes must not contain:

- secrets
- private API keys
- trust-only server metadata
- authorization decisions
- executable logic

If a hidden node source is missing, its empty value follows `submitted-path-grammar-v1.md`.

## Runtime State Behavior

When a field becomes hidden:

- the renderer may retain its runtime value for user recovery
- the value is excluded from final submission by default
- field-level errors for that field are cleared from visible error display
- touched/dirty state can remain internal
- focus must move to a stable visible target if the focused field disappears

When a field becomes visible again:

- the previous runtime value can be restored
- validation can run according to `validationTiming`
- errors can become visible again

## Conditions Interaction

Hidden fields can still be condition dependencies if their values are available in runtime state or host context. Missing hidden values follow condition missing-value behavior:

- equality comparisons with missing values evaluate false
- `empty` evaluates true
- `notEmpty` evaluates false
- numeric comparisons evaluate false
- custom predicates receive a missing-value diagnostic unless they declare missing-value support

Condition evaluation must avoid cycles even when hidden fields are involved.

## Validation Interaction

Default behavior:

- hidden fields are not validated for final submission
- hidden preserved values are not validated unless explicitly configured
- backend validation remains authoritative and can reject submitted hidden values

Required validation:

- visible required fields must be validated
- conditionally hidden required fields are not blocking while hidden
- conditional requiredness is allowed only when deterministic and documented by validation and condition rules

## Backend Trust

Backends must not trust hidden values as authoritative. Hidden values are client-controlled data. The backend should use hidden values only as hints unless they are validated against server-side session, request, or stored state.

## Publish Diagnostics

The builder must warn or block when:

- hidden values are configured to preserve globally
- hidden fields are marked sensitive
- hidden defaults look like secrets
- hidden paths collide with visible field paths
- hidden-value policy changes between revisions
- a hidden field uses a disallowed path or dangerous key
