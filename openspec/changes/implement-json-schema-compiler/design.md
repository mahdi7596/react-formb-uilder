## Context

`packages/core` now owns canonical schema contracts and framework-neutral runtime behavior. `packages/validators` is still a bootstrap placeholder, but Phase 1 already specified that generated JSON Schema is an optional backend-friendly artifact, not the authoring model.

Phase 4 introduces the first compiler surface in `packages/validators`. The compiler consumes canonical schemas and core diagnostics, then emits Draft 2020-12 JSON Schema for submitted data plus companion artifacts for behavior JSON Schema cannot fully represent. The primary stakeholders are host app developers, backend developers, future adapter packages, and future builder publish-check UI.

The relevant source contracts are:

- `docs/schema/json-schema-generation-v1.md`
- `docs/schema/canonical-schema-v1.md`
- `docs/schema/submitted-path-grammar-v1.md`
- `docs/schema/validation-rules-v1.md`
- `docs/schema/conditions-v1.md`
- `docs/schema/backend-conformance-fixtures-v1.md`
- `packages/core` runtime APIs from Phase 3

## Goals / Non-Goals

**Goals:**

- Generate Draft 2020-12 JSON Schema for normalized submitted data.
- Map MVP field types to JSON Schema structural shapes.
- Map representable validation rules to JSON Schema keywords.
- Build nested JSON Schema object properties from submitted paths.
- Use `additionalProperties: false` by default.
- Emit compiler diagnostics for non-representable or unsafe behavior.
- Emit validation-plan entries for validation behavior not fully represented in JSON Schema.
- Emit condition dependency graph entries for conditions found during compilation.
- Add generated-schema fixtures and backend-consumption examples.
- Keep `packages/core` independent from `packages/validators`.

**Non-Goals:**

- No runtime AJV validation requirement.
- No AJV dependency unless justified as an optional helper.
- No Zod generation.
- No React renderer or builder integration.
- No support for repeaters beyond fail-closed diagnostics.
- No browser upload orchestration.
- No attempt to represent renderer UI, labels, layout, visibility, enabled state, slots, or custom React behavior in JSON Schema.

## Decisions

### Decision 1: Compiler returns a bundle, not only JSON Schema

The compiler should return:

- `schema`: Draft 2020-12 submitted-data JSON Schema.
- `diagnostics`: compiler diagnostics with severity and stable code.
- `validationPlan`: validation behaviors that backend implementers may need beyond structural JSON Schema.
- `conditionDependencies`: condition dependency graph entries for publish checks and backend awareness.

Alternative considered: return only JSON Schema. Rejected because conditions, custom validators, and runtime semantics cannot all be honestly represented in plain JSON Schema.

### Decision 2: Generate representable output and diagnose gaps

For safe and structurally valid schemas, the compiler should generate the most accurate JSON Schema it can and emit warnings for non-representable behavior. Unsafe or unsupported schema inputs should emit errors and block trustworthy generation.

Errors include dangerous keys, invalid submitted paths, unknown field types without compiler support, repeaters in MVP, upload lifecycle behavior, and executable-code attempts. Warnings include condition not representable, custom validator not representable, and custom predicate not representable when the rest of the schema can still produce a useful structural artifact.

Alternative considered: strict all-or-nothing generation. Rejected because backend developers benefit from partial structural schemas as long as diagnostics are explicit and unsafe inputs fail closed.

### Decision 3: Depend on core, never the reverse

`packages/validators` can import `@your-org/forms-core` for canonical types, path parsing, schema analysis, condition dependencies, and diagnostics. `packages/core` must not import validators or compiler types.

Alternative considered: move compiler helpers into core. Rejected because JSON Schema generation is optional backend artifact behavior, not core runtime behavior.

### Decision 4: Keep JSON Schema types local and dependency-free

Represent Draft 2020-12 JSON Schema with local TypeScript types instead of adding a runtime dependency. The compiler can emit plain JSON objects that backend tools can consume.

Alternative considered: add a JSON Schema type package or AJV. Rejected for this phase because generation does not require validation runtime behavior.

### Decision 5: Submitted paths define object shape

Submitted path parsing from core should drive object nesting. A path like `user.email` becomes nested JSON Schema properties, not a literal key with a dot. Array markers are reserved, but repeaters remain unsupported in MVP and should emit diagnostics.

Alternative considered: use submitted path strings as literal top-level keys. Rejected because the submission envelope contract says submitted paths build nested `data` objects.

### Decision 6: Fixtures should be JSON-first and backend-friendly

Generated output fixtures should be JSON files or stable TypeScript assertions against JSON-compatible objects. They should be suitable references for non-JavaScript backend developers.

Alternative considered: only inline snapshots in tests. Rejected because backend conformance needs inspectable artifacts.

## Risks / Trade-offs

- JSON Schema could be mistaken as the authoring model -> Mitigate with API names, docs, diagnostics, and report language that call it a generated artifact.
- Partial generation could hide unsupported behavior -> Mitigate by making diagnostics part of the compiler result and tests.
- Field mapping edge cases could drift from core normalization -> Mitigate by importing core path/schema helpers and testing against existing fixtures.
- Regex portability is difficult -> Mitigate by conservative diagnostics and avoid promising cross-engine equivalence.
- Custom field/compiler extension design could be too large -> Mitigate by supporting registration shape and diagnostics, while deferring rich custom generators where not needed for MVP.
- Nested paths can create complex object schema merging -> Mitigate with focused tests for one-level and multi-level object paths before arrays/repeaters.

## Migration Plan

1. Add failing compiler tests in `packages/validators`.
2. Replace the placeholder validators entrypoint with compiler exports.
3. Implement local JSON Schema output types and compiler result types.
4. Implement submitted path to nested object schema construction.
5. Implement MVP field type mapping.
6. Implement validation rule keyword mapping.
7. Implement validation-plan and condition dependency artifacts.
8. Implement compiler diagnostics for unsupported or unsafe behavior.
9. Add generated-schema fixtures and backend-consumption examples.
10. Run package and workspace verification.
11. Write `docs/reports/2026-05-14-phase-4-json-schema-compiler.md`.
12. Commit and stop for owner review before React renderer work begins.

Rollback is simple while no later package depends on the compiler: revert the Phase 4 commit or keep compiler exports marked experimental until owner approval.

## Open Questions

- Should optional AJV helper functions be explicitly deferred, or included as dependency-free examples only?
- Should unknown custom validators default to warning when structural schema can still be generated, or error when backend parity is required?
- Should generated fixtures live entirely under `packages/validators/src/testing/fixtures/` or should selected examples also be copied to `docs/integration/` in a later documentation phase?
