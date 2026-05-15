## Why

The MVP foundation proves the package architecture, canonical schema, renderer, builder shell, commands, preview, publishing checks, and backend-agnostic contracts, but the creator experience still feels demo-like because the field catalog, option editing, inspector model, logic controls, and localization requirements are under-specified for a serious form builder.

This change turns the competitor research inventory into durable OpenSpec requirements before implementation, so Phase 15 and later phases can improve the product without breaking the completed MVP foundation.

## What Changes

- Define the product-grade builder field catalog for the next implementation phases, including which fields are MVP-hardening, Phase 2, Phase 3, enterprise, adapter, or plugin scope.
- Define a structured option model for choices, dropdowns, multi-selects, image choices, ranking, matrix columns, scoring values, defaults, disabled choices, bulk paste, and migration warnings.
- Define product-grade inspector tabs and setting groups: Content, Choices, Validation, Logic, Appearance, Data, Accessibility, and Advanced.
- Define content and layout block requirements: heading, paragraph, image, divider, spacer, section, page/step, welcome screen, ending/thank-you screen, and progress display.
- Define builder UX requirements for icon buttons, tooltips, quick actions, component search, quick add, empty states, field badges, diagnostics, and field-specific settings.
- Define safe, dangerous, and publish-blocking schema changes for submitted names, option values, field value shape, hidden-value policy, field deletion, localization, and visual-only edits.
- Define Persian/RTL/Iran requirements at the specification level so later implementation can add Persian strings, RTL behavior, IranYekan theme assets, Persian digit normalization, Jalali decisions, Iran validators, and Iran province/city support without hard-coding product behavior into `packages/core`.
- Preserve existing architectural decisions: canonical custom schema remains source of truth, JSON Schema remains optional, `packages/core` remains framework-agnostic, preview uses the real renderer, persisted schemas remain JSON-serializable, and unsupported custom behavior fails closed.

No application behavior is implemented by this change. It creates the requirements and task structure for the next product-completion phases.

## Capabilities

### New Capabilities

- `product-grade-field-inspector-model`: Defines the expanded product field catalog, structured option model, inspector settings model, content/layout blocks, builder UX requirements, localization expectations, and schema-change safety classes that will guide Phase 15 and later implementation.

### Modified Capabilities

- `builder-ui-foundation`: Adds product-grade requirements for expanded palette behavior, structured option editing, icon-button quick actions, field-specific inspector tabs, component search/quick add, content/layout block authoring, and diagnostic presentation.
- `react-renderer-foundation`: Adds renderer requirements for new content/layout blocks, field catalog parity, localization-aware runtime behavior, and real-preview parity for builder-authored nodes.
- `canonical-contracts`: Adds contract requirements for structured option identity, safe/dangerous/publish-blocking schema changes, option-value migration warnings, localization-sensitive values, and advanced-feature boundaries.
- `json-schema-compiler`: Adds compiler diagnostic requirements for fields, blocks, option models, conditions, uploads, repeaters, payments, and other behavior that cannot be represented safely in JSON Schema.
- `theme-design-system-readiness`: Adds requirements for optional Persian/RTL typography assets and direction-aware theme support without forcing a hard-coded font or visual system.

## Impact

- Affected specs: `builder-ui-foundation`, `react-renderer-foundation`, `canonical-contracts`, `json-schema-compiler`, `theme-design-system-readiness`, and new `product-grade-field-inspector-model`.
- Affected future packages: `packages/core`, `packages/react-renderer`, `packages/react-builder`, `packages/validators`, `packages/themes`, `packages/uploads`, `packages/adapters`, and future `packages/devtools`.
- Affected docs: the new requirements must reference the research inventory at `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md` and the product-completion plan at `docs/superpowers/plans/2026-05-15-form-builder-product-completion-master-plan.md`.
- Dependencies: no new runtime dependencies are introduced by this specification change.
- Tests and verification for this change: `openspec validate specify-product-grade-field-inspector-model --strict` and `git diff --check`.
- Follow-up implementation begins with Phase 15, focused on expanded palette and structured options editor, only after this specification change is complete.
