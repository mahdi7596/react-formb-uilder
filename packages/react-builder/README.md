# @your-org/forms-react-builder

Phase 0 placeholder package for the admin visual form builder.

## Responsibility

This package will own the component palette, canvas/tree editing, inspector, schema editing commands, undo/redo, drag-and-drop layer, preview using the real renderer, publish checks, and adapter-driven persistence.

## Boundary

Schema edits must go through commands or core domain functions. React components and drag callbacks must not directly mutate canonical schema behavior.

## Phase 0 Status

No builder behavior is implemented here yet. The current source entrypoint is only a bootstrap placeholder so the monorepo can typecheck, test, and build.
