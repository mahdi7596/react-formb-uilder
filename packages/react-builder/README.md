# @your-org/forms-react-builder

Admin form builder package.

## Responsibility

This package owns builder-facing schema editing behavior, command diagnostics, editor state, undo/redo history, visual builder UI, drag-and-drop workflows, inspector panels, persistence/publish surfaces, and adapter-driven server state.

## Command Boundary

Schema edits must go through builder commands or core domain functions. React components, inspector controls, and future drag callbacks must not directly mutate canonical schema behavior.

Commands are plain TypeScript functions. They accept a canonical schema plus command input and return a product-owned result:

```ts
const result = updateLabel(schema, {
  nodeId: "field_email",
  label: "Work email"
});

if (result.changed) {
  // Use result.schema as the next editor schema.
}
```

Command results include:

- `schema`: next schema snapshot
- `changed`: whether the command changed the schema
- `diagnostics`: builder diagnostics and dangerous-change warnings
- `command`: command name

## Dangerous Changes

Commands emit warning diagnostics for edits that can affect submitted data or published-revision compatibility, including submitted path renames, field deletion, scalar/array shape changes, option value changes, requiredness changes, hidden-value policy changes, and field type changes.

These warnings are not publish gates yet. Future publish and persistence phases can interpret them before saving or publishing revisions.

## Store

`createEditorStore` provides a small vanilla Zustand-style store for:

- canonical schema state
- selected node
- active panel
- canvas mode
- drag state
- command status
- bounded undo/redo history

UI-only state actions do not mutate the schema. Schema changes are recorded only when a command is executed through the store.

## Theme Boundary

`createBuilderStyles()` composes the default builder theme from `@your-org/forms-themes`. `BuilderWorkspace` also injects renderer styles so the preview uses the real public renderer instead of duplicated preview styling.

The builder keeps stable class hooks and data attributes for host styling and tests:

- `.rfb-builder`, `.rfb-command-bar`, `.rfb-workflow-panels`, `.rfb-palette`, `.rfb-canvas-region`, `.rfb-inspector`
- `.rfb-node`, `.rfb-drag-handle`, `.rfb-drop-zone`, `.rfb-drop-feedback`, `.rfb-alert`, `.rfb-badge`, `.rfb-tab`
- `data-active-panel`, `data-can-publish`, `data-dragging`, `data-drop-active`, `data-status`, `data-severity`, `aria-selected`

Builder theme selectors are scoped under `.rfb-builder` where generic renderer class names might otherwise collide. Hosts can override `--rfb-*` variables on `BuilderWorkspace.className` or replace the default CSS entirely.

## Testing

Builder tests cover commands, editor store behavior, server-state helpers, UI accessibility, palette/canvas interactions, keyboard movement, inspector editing, publish workflow surfaces, theme variables, state selectors, responsive constraints, focus styles, and reduced-motion CSS.

## Read More

- Root onboarding: [../../README.md](../../README.md)
- Builder integration: [../../docs/integration/react-builder.md](../../docs/integration/react-builder.md)
- Backend contracts: [../../docs/integration/backend-contracts.md](../../docs/integration/backend-contracts.md)
- JSON Schema generation: [../../docs/integration/json-schema-generation.md](../../docs/integration/json-schema-generation.md)
- Revisions and dangerous changes: [../../docs/migrations/revisions-and-dangerous-changes.md](../../docs/migrations/revisions-and-dangerous-changes.md)
- Theme package: [../themes/README.md](../themes/README.md)
