## Context

The project has completed the MVP foundation: canonical schema contracts, core runtime behavior, JSON Schema compiler, React renderer foundation, React builder shell, command/store APIs, drag-and-drop workflows, persistence/publish adapters, theme readiness, onboarding docs, and an MVP release-candidate audit. The owner has now reviewed the output and correctly identified that the product still feels like a demo because the builder exposes only a small field catalog, edits choice options through raw `label=value` text, represents logic as JSON, lacks Persian/Iran-specific product readiness, and does not yet match the authoring workflows of serious form builders.

The research inventory at `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md` compares modern form builders and adjacent creation tools, including Jotform, Typeform, Tally, Fillout, Formstack, Paperform, Cognito Forms, Google Forms, Microsoft Forms, SurveyMonkey, Airtable Forms, HubSpot Forms, Wufoo, Formsort, Form.io, SurveyJS, Zoho Forms, Gravity Forms, WPForms, Webflow, Framer, Notion Forms, Retool forms, and Softr-style builders. That research is the product source for this change.

This Phase 14 change does not implement runtime behavior. It turns the research into OpenSpec requirements so later implementation phases can proceed without rediscovering the product direction or weakening the existing package boundaries.

## Goals / Non-Goals

**Goals:**

- Specify the product-grade field catalog and phase placement for MVP hardening, Phase 2, Phase 3, enterprise, adapter, plugin, and out-of-scope features.
- Specify a structured option model for choice-like fields so dropdowns, radios, checkbox groups, multi-selects, image choices, ranking, matrix, and scoring can be edited without raw text formats.
- Specify field-specific inspector tabs and setting groups that replace generic/raw editing for common creator workflows.
- Specify content and layout blocks that let real forms include headings, text, imagery, sections, steps, welcome screens, endings, and progress.
- Specify builder UX requirements for icons, tooltips, badges, component search, quick add, visual validation controls, and visual logic controls.
- Specify safe, dangerous, and publish-blocking schema-change classes before implementation changes published-form behavior.
- Specify Persian, RTL, and Iran readiness at the contract level.
- Preserve the existing MVP specs and require additive follow-up implementation.

**Non-Goals:**

- Implement Phase 15 UI changes.
- Implement Persian/RTL runtime behavior.
- Implement calculations, uploads, repeaters, payments, dynamic options, analytics, AI, or collaboration.
- Change the canonical schema source-of-truth decision.
- Add executable JavaScript, persisted React components, backend-specific SDK objects, or provider-specific behavior to schemas.
- Require the theme package or IranYekan fonts in host applications.

## Decisions

### Add a new product specification instead of only changing builder UI specs

The product-grade field and inspector model crosses `core`, `react-renderer`, `react-builder`, `validators`, `themes`, future `uploads`, future `adapters`, and future `devtools`. A new capability captures the product model independently from any one package while existing capability deltas connect it to package responsibilities.

Alternatives considered:

- Put everything into `builder-ui-foundation`: too UI-specific and would hide renderer, schema, compiler, migration, and localization implications.
- Put everything into `canonical-contracts`: too domain-contract-heavy and would blur creator UX requirements.

### Treat Phase 15 as MVP hardening, not a rewrite

The next implementation phase should expose and polish what the MVP already mostly supports: missing palette entries, structured options, field-specific inspector controls, icons, and diagnostics. It must keep preview using the real renderer and keep schema mutations behind commands.

Alternatives considered:

- Jump directly to advanced features like payments or repeaters: attractive but risky because the basic builder authoring experience still feels unfinished.
- Redesign the whole builder: unnecessary and likely to break the tested foundation.

### Structured options use stable submitted values and translatable labels

Option rows should distinguish internal row identity, submitted value, display label, localized labels, disabled state, default state, score, image/media metadata, and extension metadata. Option labels can change safely; submitted values are backend contracts and can become dangerous changes after publish.

Alternatives considered:

- Keep `label=value` text editing: fast but visibly demo-like and error-prone.
- Use labels as values automatically forever: simple but breaks migrations, localization, analytics, and backend integrations.

### Field catalog is phased by contract risk

Basic scalar fields, existing choice fields, date/time basics, rating/linear scale, hidden/read-only fields, and content blocks belong to MVP hardening. Matrix, ranking, NPS, multi-select, date range, uploads, calculations, and Iran validators belong after explicit contracts. Repeaters, payments, dynamic lookup, partial submissions, and analytics need separate specifications before implementation.

Alternatives considered:

- Add every competitor feature immediately: this would create shallow features and hidden contract debt.
- Keep only MVP fields: this would not meet the owner's goal of a complete credible builder.

### Persian and Iran support is product scope, but hard-coded regional behavior is not core scope

The product must support Persian strings, RTL layout, Persian/Arabic digit normalization, Jalali display decisions, Iran validators, Iran province/city workflows, and IranYekan assets. However, `packages/core` should only own generic locale, direction, value, and validation-key contracts. Country datasets, fonts, and provider-style behavior belong in themes, validators, adapters, builder presets, or plugins.

Alternatives considered:

- Hard-code Iran-specific fields into core: easier for one market, but weakens backend-agnostic and extensible architecture.
- Defer Persian/RTL entirely: contradicts owner priority and the already RTL-first builder posture.

### JSON Schema remains diagnostic-first for unsupported product behavior

The compiler can represent many scalar and enum shapes, but not UI behavior, branching, upload lifecycle, payments, rich text sanitization, dynamic lookup, calculations, or repeaters without explicit contracts. It must emit diagnostics instead of silently dropping behavior.

Alternatives considered:

- Generate weak schemas for everything: misleading and unsafe for backend consumers.
- Block all advanced fields from compile output: too strict where partial structural representation is useful.

## Risks / Trade-offs

- [Risk] The specification becomes too broad for the next implementation phase. -> Mitigation: phase placement is explicit; Phase 15 implements only expanded palette and structured options.
- [Risk] Existing MVP specs could be accidentally overwritten when archived. -> Mitigation: use additive requirements for this change and avoid modifying existing requirement blocks unless later implementation requires it.
- [Risk] Persian/Iran scope could leak into core. -> Mitigation: specs require generic core contracts and place fonts/datasets/provider-specific behavior outside core.
- [Risk] Structured options may require schema migration decisions. -> Mitigation: specs classify option value changes as dangerous and require publish warnings before implementation.
- [Risk] Advanced features remain deferred. -> Mitigation: Phase 20 explicitly specifies calculations, uploads, repeaters, dynamic options, partial submissions, and payments before implementation waves.

## Migration Plan

This change itself is specification-only and does not migrate runtime schemas. Later implementation phases must:

1. Keep existing valid MVP schemas readable.
2. Preserve existing option arrays or migrate them into the structured option model with stable values.
3. Emit warnings rather than silently changing submitted paths, option values, field value shape, hidden-value policy, or custom extension keys.
4. Keep previously published revisions immutable.
5. Document any schema-version bump or migration helper in the phase report that introduces it.

## Open Questions

- Should the first structured options implementation support scoring immediately, or only reserve the shape and UI affordance for Phase 16/20?
- Should Iran province/city ship as a builder preset made of dropdowns, an adapter-backed dynamic option source, or a dedicated registered custom field?
- Should Jalali support initially be display/input mapping over ISO Gregorian storage, or a first-class calendar setting in schema?
- Should read-only/display value be implemented first as a field type, a content/computed node, or both with distinct submission semantics?
