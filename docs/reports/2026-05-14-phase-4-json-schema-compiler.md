# Phase 4 JSON Schema Compiler Report

Date: 2026-05-14
Change: `implement-json-schema-compiler`
Status: implemented and ready for owner review

## Summary

Phase 4 adds the first optional backend-friendly compiler surface in `packages/validators`. The compiler consumes the canonical form schema and core runtime diagnostics, then emits a Draft 2020-12 submitted-data JSON Schema plus companion artifacts for behavior JSON Schema cannot honestly represent.

This phase does not create a visual app. Its output is visible through compiler APIs, JSON fixtures, backend documentation, and tests. The first browser-viewable respondent output remains planned for Phase 6, after the React renderer foundation in Phase 5. The first builder UI output remains planned for Phase 8.

## Changed Files

- `docs/integration/backend-json-schema.md`
- `docs/reports/2026-05-14-phase-4-json-schema-compiler.md`
- `examples/vite-react/tsconfig.json`
- `openspec/changes/implement-json-schema-compiler/**`
- `packages/adapters/tsconfig.json`
- `packages/core/src/diagnostics/index.ts`
- `packages/core/tsconfig.json`
- `packages/react-builder/tsconfig.json`
- `packages/react-renderer/tsconfig.json`
- `packages/themes/tsconfig.json`
- `packages/validators/package.json`
- `packages/validators/src/backend-example.test.ts`
- `packages/validators/src/compiler/index.ts`
- `packages/validators/src/index.test.ts`
- `packages/validators/src/index.ts`
- `packages/validators/src/json-schema/index.ts`
- `packages/validators/src/testing/fixtures/**`
- `packages/validators/tsconfig.json`
- `tsconfig.base.json`
- `vitest.config.ts`

## Public APIs Added

- `compileJsonSchema(schemaInput, options)`
- `JsonSchemaCompilerResult`
- `JsonSchemaCompilerOptions`
- `CompilerDiagnostic`
- `ValidationPlanEntry`
- `ConditionDependencyEntry`
- `JsonSchemaObject`
- `createRootJsonSchema`

The compiler result shape is:

- `schema`: Draft 2020-12 JSON Schema for normalized submitted `data`.
- `diagnostics`: core and compiler diagnostics with stable codes and severities.
- `validationPlan`: conditional, custom, or otherwise non-represented validation behavior.
- `conditionDependencies`: condition dependency graph entries for visibility, enabled state, and conditional validation.

## Behavior Implemented

- Draft 2020-12 root output with `type: "object"`, `properties`, and `additionalProperties: false`.
- Nested object construction from submitted paths such as `user.email`.
- Core path parsing, core schema analysis, dangerous-key scanning, and core diagnostics surfaced through the compiler.
- Required fields mapped to nearest-object `required` arrays when unconditional.
- MVP field mappings for string-like, number-like, boolean, choice, checkbox group, hidden, and file metadata fields.
- Representable validation mapping for string length, numeric min/max, integer, step, portable pattern, and selection count rules.
- Diagnostics for unsupported regex patterns, conditions, custom validators, unknown field types, repeaters, upload lifecycle behavior, invalid submitted paths, dangerous keys, and custom predicate gaps.
- Validation-plan entries for conditional and custom validation behavior that JSON Schema cannot fully represent.
- JSON-first generated-schema fixtures for minimal email, nested paths, required choices, file metadata, and unsupported behavior.
- Backend-oriented docs showing generated artifact usage without React renderer or builder imports.

## Verification

- `pnpm --filter @your-org/forms-validators test`: passed, 3 files and 7 tests.
- `pnpm --filter @your-org/forms-validators typecheck`: passed.
- `pnpm --filter @your-org/forms-core test`: passed, 10 files and 27 tests.
- `pnpm test`: passed, 18 files and 39 tests.
- `pnpm typecheck`: passed.
- `rg "@your-org/forms-validators|packages/validators|compileJsonSchema" packages/core package.json packages/core/package.json`: no matches.

## Dependency Boundary Check

`packages/validators` depends on `@your-org/forms-core`, as intended. `packages/core` still has no dependency on `packages/validators`, React, AJV, Zod, TanStack Query, dnd-kit, upload providers, design-system components, or transport code.

AJV helpers were not added in this phase. JSON Schema remains a generated backend-friendly artifact, not the authoring model.

The TypeScript workspace now has source aliases for the local packages and package-local `outDir` settings. This keeps development typechecking package-first and prevents package builds from writing declarations into the repository root `dist/`.

## Known Limitations

- Repeaters are still out of MVP scope and emit `repeater_not_supported`.
- Browser upload lifecycle behavior is still out of MVP scope and emits `upload_lifecycle_not_supported`.
- Regex portability is conservative; unsupported or unsafe-looking patterns emit `unsupported_regex`.
- Conditions, custom validators, and custom predicates are not encoded into JSON Schema. They are surfaced through diagnostics, validation-plan entries, and condition dependencies.
- Custom field-specific JSON Schema generators are not yet implemented. Unknown field types fail closed with diagnostics.
- This phase has no visual output for manual browser review.

## Owner Review Checklist

- [ ] I reviewed the changed files.
- [ ] I reviewed the `compileJsonSchema` API and bundle shape.
- [ ] I reviewed generated fixture JSON files and diagnostics.
- [ ] I reviewed `docs/integration/backend-json-schema.md`.
- [ ] I understand that Phase 4 output is compiler/API/docs/test output, not visual UI.
- [ ] The tests listed in this report are sufficient for this phase.
- [ ] The phase is approved and the next phase may start.
- [ ] Changes are requested before moving forward.

Requested changes:

-
