## ADDED Requirements

### Requirement: Product-grade renderer catalog parity
The React renderer package SHALL render product-completion fields and blocks only when their canonical contracts are supported.

#### Scenario: MVP hardening fields render through registry
- **WHEN** schemas contain supported MVP hardening fields such as URL, checkbox group, switch, time, rating, linear scale, hidden, or read-only/display values
- **THEN** the renderer resolves them through built-in or registered field renderers while preserving renderer-managed accessibility, validation, conditions, hidden semantics, and submission behavior

#### Scenario: Unsupported advanced fields fail closed
- **WHEN** a schema contains an advanced or plugin field without a registered renderer or finalized contract
- **THEN** the renderer displays a safe unsupported-field state and exposes diagnostics rather than silently submitting an unknown value

### Requirement: Content and layout runtime rendering
The React renderer package SHALL render supported content and layout blocks from canonical schema nodes.

#### Scenario: Content blocks render accessibly
- **WHEN** a visible heading, paragraph, image, divider, spacer, welcome screen, ending screen, or progress display block is rendered
- **THEN** the renderer outputs accessible markup that does not create submitted data unless the node contract explicitly says it does

#### Scenario: Section and step blocks preserve order
- **WHEN** section or page/step nodes contain child ids
- **THEN** the renderer displays visible child nodes in canonical order and applies navigation, progress, and validation behavior according to form settings

### Requirement: Localization-aware renderer behavior
The React renderer package SHALL support product-completion localization requirements without changing submitted contract values.

#### Scenario: Labels and option labels localize independently from values
- **WHEN** a form is rendered in a locale with translated labels, descriptions, placeholders, errors, button text, option labels, or endings
- **THEN** the renderer displays localized text while preserving stable node ids, submitted paths, and option submitted values

#### Scenario: RTL runtime preserves technical LTR values
- **WHEN** the renderer displays submitted paths, schema ids, URLs, email addresses, code, JSON, or other technical values inside RTL screens
- **THEN** those technical values remain readable in LTR direction

#### Scenario: Persian digit normalization is explicit
- **WHEN** Persian or Arabic digit normalization is enabled for numeric input
- **THEN** the renderer normalizes input for validation and submission according to the configured locale policy rather than mutating unrelated text fields

### Requirement: Preview parity for product-grade nodes
The React builder preview SHALL continue to use the real renderer for product-grade fields and blocks.

#### Scenario: Builder preview renders product nodes through renderer
- **WHEN** a creator previews a schema containing supported product-grade fields or content/layout blocks
- **THEN** the preview mounts the React renderer path instead of duplicating respondent runtime behavior inside builder-only code

