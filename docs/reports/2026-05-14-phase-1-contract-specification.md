# Phase 1 Contract Specification Report

Date: 2026-05-14

OpenSpec change: `define-canonical-contracts`

## Summary

Phase 1 created the canonical v1 contract documentation required before core runtime implementation. The work defines the schema, path grammar, hidden-value behavior, submission envelope, backend response contract, validation rules, condition model, extension registration model, JSON Schema generation scope, and backend conformance fixture categories.

No TypeScript runtime behavior, React renderer behavior, builder UI, adapter behavior, or JSON Schema compiler implementation was added.

## Files Created Or Modified

Created:

- `docs/schema/canonical-schema-v1.md`
- `docs/schema/submitted-path-grammar-v1.md`
- `docs/schema/hidden-value-semantics-v1.md`
- `docs/schema/submission-envelope-v1.md`
- `docs/schema/backend-response-v1.md`
- `docs/schema/validation-rules-v1.md`
- `docs/schema/conditions-v1.md`
- `docs/schema/extension-registration-v1.md`
- `docs/schema/json-schema-generation-v1.md`
- `docs/schema/backend-conformance-fixtures-v1.md`
- `docs/reports/2026-05-14-phase-1-contract-specification.md`
- `openspec/changes/define-canonical-contracts/proposal.md`
- `openspec/changes/define-canonical-contracts/design.md`
- `openspec/changes/define-canonical-contracts/specs/canonical-contracts/spec.md`
- `openspec/changes/define-canonical-contracts/tasks.md`

## Decisions Made

- Canonical schema v1 remains the authoring and rendering source of truth.
- JSON Schema generation targets Draft 2020-12 and remains an optional backend-friendly artifact.
- Submitted path keys with dots are disallowed in MVP; adapters can map to backend names separately.
- Dangerous keys `__proto__`, `constructor`, and `prototype` are rejected in schemas, paths, defaults, props, metadata, submissions, and backend responses.
- Phone uses a conservative string value contract in MVP.
- File support is metadata-only in MVP; upload orchestration is excluded.
- Repeaters are excluded from MVP until their path, state, error, migration, accessibility, and JSON Schema semantics are specified separately.
- Hidden values are excluded from final submissions by default unless the schema explicitly preserves them.
- Conditions are synchronous in MVP.
- Unknown custom fields, validators, predicates, and unsupported compiler behavior fail closed.
- Persisted schemas must not contain executable JavaScript or React components.

## Architecture Checklist Mapping

| Architecture pre-implementation item | Covered by |
| --- | --- |
| Formal submitted path grammar and dangerous-key rejection | `docs/schema/submitted-path-grammar-v1.md` |
| Canonical node contracts | `docs/schema/canonical-schema-v1.md` |
| Validation contracts | `docs/schema/validation-rules-v1.md` |
| Condition contracts | `docs/schema/conditions-v1.md` |
| Error contracts | `docs/schema/backend-response-v1.md`, `docs/schema/validation-rules-v1.md` |
| Metadata contracts | `docs/schema/canonical-schema-v1.md`, `docs/schema/submission-envelope-v1.md` |
| Submission contract | `docs/schema/submission-envelope-v1.md` |
| Backend response contract | `docs/schema/backend-response-v1.md` |
| JSON Schema dialect and compiler diagnostics | `docs/schema/json-schema-generation-v1.md` |
| Hidden-field value semantics | `docs/schema/hidden-value-semantics-v1.md` |
| Custom field registration contract | `docs/schema/extension-registration-v1.md` |
| Custom validator registration contract | `docs/schema/extension-registration-v1.md`, `docs/schema/validation-rules-v1.md` |
| Custom predicate registration contract | `docs/schema/extension-registration-v1.md`, `docs/schema/conditions-v1.md` |
| Deterministic condition evaluation | `docs/schema/conditions-v1.md` |
| Dependency tracking | `docs/schema/conditions-v1.md` |
| Cycle detection | `docs/schema/conditions-v1.md` |
| Backend conformance fixtures | `docs/schema/backend-conformance-fixtures-v1.md` |
| Explicit repeater MVP decision | `docs/schema/canonical-schema-v1.md`, `docs/schema/submitted-path-grammar-v1.md` |
| Explicit upload MVP decision | `docs/schema/canonical-schema-v1.md`, `docs/schema/submission-envelope-v1.md`, `docs/schema/json-schema-generation-v1.md`, `docs/schema/backend-conformance-fixtures-v1.md` |

## Verification

Commands run:

```bash
rg "TODO|TBD|unspecified|later" docs/schema
pnpm typecheck
```

Results:

- `rg "TODO|TBD|unspecified|later" docs/schema`: passed with no matches.
- `pnpm typecheck`: passed.

## Known Limitations

- These contracts are documentation only; no runtime code implements them yet.
- File support is metadata-only; upload lifecycle is intentionally outside MVP.
- Repeaters are intentionally outside MVP.
- Phone uses a conservative string contract; compound phone fields require a future contract change.
- Conditional requiredness is allowed only through deterministic synchronous conditions.
- JSON Schema does not represent all UI or condition behavior; compiler diagnostics must make gaps explicit.

## Owner Review

- [ ] I reviewed the contract documents.
- [ ] I approve the MVP field list and exclusions.
- [ ] I approve the conservative phone string contract.
- [ ] I approve metadata-only file support and no upload orchestration in MVP.
- [ ] I approve excluding repeaters from MVP.
- [ ] I approve the submitted path grammar and dangerous-key rejection rules.
- [ ] I approve the submission and backend response envelopes.
- [ ] I approve the hidden-value policy.
- [ ] I approve moving to Phase 2 after this change is archived.
- [ ] Changes are requested before moving forward.

Requested changes:

-
