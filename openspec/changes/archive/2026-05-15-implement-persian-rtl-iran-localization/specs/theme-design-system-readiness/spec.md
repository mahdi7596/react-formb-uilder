## ADDED Requirements

### Requirement: Optional IranYekan theme helper

The themes package SHALL expose an optional IranYekan `@font-face` CSS helper that uses package-owned font assets and does not force host applications to adopt the font.

#### Scenario: Host opts into IranYekan
- **WHEN** a host calls the IranYekan theme helper
- **THEN** the generated CSS references `packages/themes/assets/fonts/iranyekan/` asset paths
- **AND** maps the font to the RTL font token without changing core behavior

#### Scenario: Host does not opt in
- **WHEN** a host uses default theme styles without the IranYekan helper
- **THEN** the builder and renderer remain usable with the default `fontRtl` stack
