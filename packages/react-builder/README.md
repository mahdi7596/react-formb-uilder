# @your-org/forms-react-builder

Admin form builder package.

## Responsibility

This package owns builder-facing schema editing behavior, command diagnostics, editor state, undo/redo history, and later the visual builder UI.

Phase 7 implements the command/store foundation only. Visual builder UI, drag-and-drop, inspector panels, persistence, publish flows, and adapter-driven server state are later phases.

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
