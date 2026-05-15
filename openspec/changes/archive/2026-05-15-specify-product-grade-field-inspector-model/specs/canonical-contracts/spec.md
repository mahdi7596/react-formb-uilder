## ADDED Requirements

### Requirement: Structured option contract
The canonical schema SHALL define choice-like options as JSON-serializable structured records with stable submitted values.

#### Scenario: Option contract separates label from value
- **WHEN** a choice-like field defines options
- **THEN** each option separates display label from submitted value and may include stable id, localized labels, description, disabled state, default state, score, media metadata, and extension-safe metadata

#### Scenario: Unknown submitted option fails closed
- **WHEN** a submission contains an option value not allowed by the canonical schema or registered dynamic option contract
- **THEN** validation fails closed with a field-level diagnostic rather than accepting the value silently

### Requirement: Product-grade schema change safety
Canonical schema tooling SHALL classify schema changes that affect submissions, migrations, publish safety, or backend contracts.

#### Scenario: Submitted path changes are dangerous
- **WHEN** a field's submitted path changes after a published revision exists
- **THEN** the change is classified as dangerous because it affects backend contracts and historical submissions

#### Scenario: Option value changes are dangerous
- **WHEN** an option submitted value changes or an option is removed after a published revision exists
- **THEN** the change is classified as dangerous because labels, analytics, branching, calculations, and backend consumers may depend on the old value

#### Scenario: Shape changes are dangerous
- **WHEN** a field changes between scalar, array, object, file metadata, payment reference, repeater array, or computed value shapes
- **THEN** the change is classified as dangerous or publish-blocking unless an explicit migration exists

#### Scenario: Safe changes are preserved
- **WHEN** labels, descriptions, placeholders, option labels with stable values, translations, visual layout hints, or non-contract theme settings change
- **THEN** the change is classified as safe unless another contract-affecting value changed

### Requirement: Product-grade field catalog boundaries
Canonical contracts SHALL identify which product-grade fields are supported, deferred, plugin-owned, or out of scope for persisted schemas.

#### Scenario: Supported MVP hardening fields are explicit
- **WHEN** canonical schema documentation or validation describes supported field types
- **THEN** it identifies MVP hardening fields that can be authored without new advanced contracts

#### Scenario: Deferred fields require contracts
- **WHEN** a field requires repeaters, upload orchestration, payment provider lifecycle, dynamic lookup, calculations, rich text sanitization, signature lifecycle, voice/video recording, analytics, or AI behavior
- **THEN** canonical contracts require an explicit OpenSpec change before accepting persisted schemas for that behavior

#### Scenario: Executable behavior remains prohibited
- **WHEN** custom fields, validators, predicates, rich text, embeds, calculations, or integrations are specified
- **THEN** persisted schemas reference registered keys and JSON-serializable configuration rather than executable JavaScript or React components

### Requirement: Localization and regional contract boundaries
Canonical contracts SHALL support localization and regional behavior without hard-coding country-specific implementation into core.

#### Scenario: Localized labels do not change submitted contracts
- **WHEN** labels, option labels, help text, errors, endings, or button text are localized
- **THEN** stable node ids, submitted paths, option values, revision identity, and backend contracts remain unchanged

#### Scenario: Regional validators are registered by key
- **WHEN** Iran mobile, national ID, postal code, province/city consistency, Jalali date display, or Persian digit normalization behavior is needed
- **THEN** core contracts expose generic locale and registration mechanisms while validator packages, renderer adapters, builder presets, datasets, or plugins own regional implementation

