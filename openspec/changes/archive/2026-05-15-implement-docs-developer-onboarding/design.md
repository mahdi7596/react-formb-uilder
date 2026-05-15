## Context

The form builder has moved through the core contract, runtime, renderer, example app, builder, drag-and-drop, persistence/publish, adapter, validator, and theme readiness phases. The implemented behavior is distributed across package READMEs, schema docs, phase reports, OpenSpec specs, and source tests. That is workable for agents who have followed every phase, but it is too fragmented for a new developer, integrator, or future AI session entering the repository cold.

Phase 12 is documentation and onboarding only. It should consolidate current truth, point to deeper references, and make the first successful path obvious: install, test, run the example, understand packages, render a form, embed the builder, wire backend adapters, inspect generated JSON Schema, add extensions, and respect safety/accessibility/revision boundaries.

## Goals / Non-Goals

**Goals:**
- Create a root README that explains what the project is, package boundaries, current MVP status, and the command path to install, verify, and run the example.
- Create integration documentation for the React renderer, React builder, backend adapter contracts, and JSON Schema compiler output.
- Create focused operational docs for accessibility, security/safety, and revision/dangerous-change behavior.
- Add extension examples for custom fields, validators, predicates, and backend response mappings using current public contracts.
- Refresh stale package READMEs so they describe implemented behavior instead of Phase 0 placeholders.
- Produce a Phase 12 report that captures changed docs, commands run, limitations, and owner review checklist.

**Non-Goals:**
- Do not change runtime package behavior or public APIs.
- Do not introduce a documentation site generator, markdown framework, or external docs dependency.
- Do not publish packages or create release automation.
- Do not document speculative features such as repeaters, upload orchestration, real backend SDKs, auth, billing, or multi-user collaboration as implemented.
- Do not replace detailed schema docs; link to them and summarize the integration path.

## Decisions

1. **Use Markdown docs in the existing repo structure**
   - Rationale: The project already uses Markdown for architecture, schema, reports, and package READMEs. Keeping Phase 12 as plain Markdown avoids a toolchain decision before MVP hardening.
   - Alternative considered: Add a docs website. Rejected because it adds dependencies and navigation work without improving the immediate onboarding gap.

2. **Make root README the entry point, not a duplicate of every spec**
   - Rationale: The README should answer "what is this, how do I run it, where do I go next?" and link to detailed docs. It should not become an unmaintainable copy of schema contracts.
   - Alternative considered: Put all onboarding in the root README. Rejected because renderer, builder, backend, accessibility, safety, and migration guidance need durable focused pages.

3. **Separate integration docs by audience and boundary**
   - Renderer docs target host React apps rendering published forms.
   - Builder docs target admin/creator surfaces embedding authoring and publish workflows.
   - Backend contracts docs target server/backend implementers exchanging normalized JSON.
   - JSON Schema docs target teams using compiler artifacts as backend-friendly validation aids.
   - Rationale: Each audience has different risks and "first success" paths.

4. **Keep examples executable-looking but source-derived**
   - Rationale: Examples should use current package exports and contracts so they can be trusted. If a flow is not implemented, the docs must say it is future/deferred rather than showing fake APIs.
   - Alternative considered: Write aspirational examples for future SDK ergonomics. Rejected because this phase is onboarding for the current MVP package set.

5. **Document safety and accessibility as first-class integration contracts**
   - Rationale: Submitted path safety, dangerous-key rejection, hidden-value semantics, backend response normalization, focus handling, labels, errors, and revision immutability are core product promises. They should be easy to find outside source tests.
   - Alternative considered: Leave these only in schema docs and tests. Rejected because integrators need operational guidance.

## Risks / Trade-offs

- Documentation can drift from code if examples are too broad -> Keep examples tied to current exports and run tests/build during the phase.
- Root README can become too long -> Keep it navigational, with links to focused docs.
- Strict link checking may not exist yet -> Run practical checks with `rg` and command verification; document if no formal link checker is configured.
- Existing specs `canonical-contracts` and `core-contract-fixtures` have older strict-format issues -> Do not let unrelated spec cleanup block Phase 12, but record this limitation if it affects `openspec validate --all --strict`.
- Current package name placeholder `@your-org/*` may change before publishing -> Document it as current workspace package names, not final npm publishing identity.

## Migration Plan

1. Add or update docs without changing runtime code.
2. Run focused doc sanity checks and workspace verification.
3. Follow root README commands from the current checkout where practical.
4. Write the Phase 12 report.
5. Commit the proposal and later implementation separately according to the phase workflow.

Rollback is simple: revert documentation changes. No persisted data, runtime behavior, or package API migrations are expected.

## Open Questions

- Should the root README describe the package names as provisional `@your-org/*`, or does the owner want final package scope naming before release?
- Should Phase 12 also clean up older OpenSpec strict-format issues in `canonical-contracts` and `core-contract-fixtures`, or should that stay deferred to Phase 13 hardening?
