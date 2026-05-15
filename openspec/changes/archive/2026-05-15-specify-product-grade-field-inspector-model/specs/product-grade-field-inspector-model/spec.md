## ADDED Requirements

### Requirement: Product completion research traceability
The project SHALL treat the product completion research inventory as the source for competitor findings, component behavior, feature gaps, Persian/RTL/Iran requirements, and recommended follow-up changes while this product-completion plan is active.

#### Scenario: Research inventory is referenced before implementation
- **WHEN** an agent proposes or implements product-completion work after the MVP release candidate
- **THEN** it reads `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md` and maps the planned work back to the relevant component, feature, gap, or recommendation

#### Scenario: Research does not override architecture
- **WHEN** competitor behavior conflicts with the architecture documents or `AGENTS.md`
- **THEN** the canonical custom schema, backend-agnostic package boundaries, JSON-serializable persistence, immutable revisions, fail-closed custom behavior, and real-renderer preview decisions remain authoritative

### Requirement: Phased product field catalog
The product SHALL classify fields and blocks by implementation phase and package boundary before implementation.

#### Scenario: MVP hardening field catalog is defined
- **WHEN** product-completion implementation begins
- **THEN** MVP hardening includes text, textarea, number, email, phone, URL, radio, checkbox group, select, checkbox, switch, date, time, rating, linear scale, hidden field, read-only/display value, heading, paragraph, image, divider, section, page/step, welcome screen, and ending screen

#### Scenario: Advanced catalog is explicitly deferred
- **WHEN** a feature such as multi-select, image choice, ranking, matrix, NPS, date range, upload orchestration, signature, payment, calculation, dynamic option source, repeater, partial submission, analytics, or AI generation is requested
- **THEN** the project identifies the required package boundary and OpenSpec contract before implementing behavior

#### Scenario: Plugin and adapter scope is explicit
- **WHEN** a feature depends on a provider, external data source, payment processor, bot-protection service, CRM, scheduling system, file store, or analytics destination
- **THEN** the feature is specified as an adapter or plugin boundary rather than core behavior

### Requirement: Structured option model
The product SHALL define choice-like options as structured JSON-serializable records rather than raw text lines.

#### Scenario: Option rows preserve identity and submitted value
- **WHEN** a choice-like field is authored
- **THEN** each option has stable identity, submitted value, display label, optional localized labels, optional description, disabled state, default state, optional score, optional media metadata, and extension-safe metadata

#### Scenario: Option values are backend contracts
- **WHEN** an option label changes without changing the submitted value
- **THEN** the change is considered safe for previous submissions

#### Scenario: Dangerous option changes are classified
- **WHEN** an option submitted value changes, an option with possible historical submissions is deleted, or a field changes between single-value and multi-value choice behavior
- **THEN** the builder and publish checks classify the change as dangerous or publish-blocking according to available revision context

### Requirement: Product-grade inspector model
The product SHALL define field-specific inspector tabs and setting groups for creator workflows.

#### Scenario: Inspector tabs are stable
- **WHEN** a creator selects a supported node in the builder
- **THEN** the inspector can expose Content, Choices, Validation, Logic, Appearance, Data, Accessibility, and Advanced tabs or equivalent grouped surfaces based on node capabilities

#### Scenario: Field settings are capability-specific
- **WHEN** a creator selects a field
- **THEN** the inspector exposes only settings that match that field's value type, validation rules, logic support, data contract behavior, accessibility needs, and localization behavior

#### Scenario: Advanced settings remain explicit
- **WHEN** a setting affects submitted paths, custom field keys, validator keys, predicate keys, hidden-value policy, migration behavior, backend mapping, PII/sensitive flags, or analytics names
- **THEN** the inspector identifies it as contract-affecting or advanced rather than presenting it as a harmless visual edit

### Requirement: Product-grade schema change classification
The product SHALL classify schema edits as safe, dangerous, or publish-blocking before publication.

#### Scenario: Safe visual and label edits are identified
- **WHEN** a creator changes labels, descriptions, placeholders, option labels with stable values, translations, or visual layout hints
- **THEN** the builder classifies the change as safe unless another contract-affecting setting changed

#### Scenario: Dangerous contract edits are identified
- **WHEN** a creator changes a submitted path, option submitted value, field value shape, hidden-value policy, field type, upload cardinality, currency representation, date/time storage policy, or custom extension key/version
- **THEN** the builder surfaces dangerous-change context before publish

#### Scenario: Publish-blocking edits are identified
- **WHEN** a schema contains unsafe submitted paths, dangerous keys, unknown field types, unknown validators, unknown predicates, invalid option values, unsupported executable behavior, or compiler errors that fail closed
- **THEN** publication is blocked until the issue is resolved or explicitly specified as supported

### Requirement: Persian RTL and Iran product readiness
The product SHALL include Persian, RTL, and Iran-specific requirements in the product-completion specification.

#### Scenario: Persian and RTL behavior is specified
- **WHEN** Persian or RTL support is implemented
- **THEN** builder and renderer strings, direction, mirrored controls, technical LTR values, validation messages, focus behavior, and screenshots are verified in RTL contexts

#### Scenario: Iran behavior stays outside hard-coded core logic
- **WHEN** Iran mobile, national ID, postal code, province/city, Jalali display, Persian digit normalization, or IranYekan font behavior is implemented
- **THEN** generic contracts remain in core while validators, themes, renderer adapters, builder presets, datasets, or plugins own regional behavior

