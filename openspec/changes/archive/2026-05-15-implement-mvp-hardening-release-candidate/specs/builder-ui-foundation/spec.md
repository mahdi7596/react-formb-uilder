## ADDED Requirements

### Requirement: Builder release-candidate audit
The React builder SHALL be audited for MVP release-candidate readiness across creator workflows, preview parity, accessibility, drag-and-drop, package boundaries, and visual stability.

#### Scenario: Creator workflow is audited
- **WHEN** Phase 13 builder checks run
- **THEN** adding fields, selecting nodes, editing inspector settings, undo and redo, previewing through the real renderer, saving drafts, publishing, and handling conflicts are verified or findings are documented

#### Scenario: Builder accessibility is audited
- **WHEN** Phase 13 builder accessibility checks run
- **THEN** keyboard navigation, focus visibility, drag-and-drop keyboard workflows, panel controls, alerts, publish checks, and invalid-drop feedback are verified with automated or documented manual evidence

#### Scenario: Builder preview parity is audited
- **WHEN** Phase 13 builder preview checks run
- **THEN** builder preview behavior is verified to use the real renderer path and not duplicate field rendering behavior in builder-only UI code

#### Scenario: Builder visual stability is audited
- **WHEN** Phase 13 rendered builder checks run
- **THEN** desktop and narrow viewports remain readable with no incoherent overlap for command bar, palette, canvas, inspector, workflow panels, diagnostics, and primary actions

#### Scenario: Builder public API hygiene is audited
- **WHEN** Phase 13 builder package checks run
- **THEN** public builder exports avoid leaking TanStack Query mutation/query objects, raw dnd-kit event contracts, backend-specific SDK objects, or schema mutation internals
