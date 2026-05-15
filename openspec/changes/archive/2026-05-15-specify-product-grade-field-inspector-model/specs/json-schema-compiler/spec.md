## ADDED Requirements

### Requirement: Product-grade field compiler diagnostics
The JSON Schema compiler SHALL represent supported product-grade field shapes where possible and diagnose unsupported behavior explicitly.

#### Scenario: Structured choice options compile by submitted value
- **WHEN** a supported single-value or multi-value choice field uses structured options
- **THEN** generated JSON Schema uses option submitted values for enum constraints rather than localized labels

#### Scenario: Content blocks do not create submitted schema properties
- **WHEN** heading, paragraph, image, divider, spacer, welcome screen, ending screen, progress display, section, or page/step nodes are compiled
- **THEN** generated submitted-data JSON Schema omits display-only nodes unless a node explicitly submits data

#### Scenario: Advanced behavior is diagnosed
- **WHEN** a schema contains calculations, dynamic options, upload lifecycle behavior, payment provider lifecycle, repeaters, rich text sanitization, signatures, voice/video recording, data lookup, or custom behavior without compiler support
- **THEN** compiler diagnostics identify the unsupported or non-representable behavior without silently weakening the generated schema

### Requirement: Product-grade migration diagnostics
The JSON Schema compiler or artifact bundle SHALL expose diagnostics that help publish review classify schema changes.

#### Scenario: Compiler output identifies risky submitted shapes
- **WHEN** generated artifacts are used for publish review
- **THEN** the artifact bundle preserves enough field type, submitted path, option value, requiredness, hidden policy, and value shape metadata for the builder to classify safe, dangerous, and publish-blocking changes

#### Scenario: Localization does not affect enum values
- **WHEN** a localized form is compiled
- **THEN** generated enum values, submitted paths, and object property names remain based on stable contract values rather than translated labels

