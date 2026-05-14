# @your-org/forms-adapters

Phase 0 placeholder package for thin host integration helpers.

## Responsibility

This package will provide helper implementations for agreed JSON contracts such as load, save draft, publish, list revisions, load published form, submit form, and future extension points.

## Boundary

Adapters must stay thin. They must not define product behavior, canonical schema semantics, validation rules, or backend-specific persistence assumptions.

## Phase 0 Status

No adapter behavior is implemented here yet. The current source entrypoint is only a bootstrap placeholder so the monorepo can typecheck, test, and build.
