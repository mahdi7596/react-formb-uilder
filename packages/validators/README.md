# @your-org/forms-validators

Phase 0 placeholder package for optional validation artifacts and compiler behavior.

## Responsibility

This package will own generated JSON Schema artifacts, compiler diagnostics, optional AJV-related helpers, and optional Zod helpers if they are later approved.

## Boundary

Canonical schema authoring and runtime behavior remain in `@your-org/forms-core`. Generated JSON Schema is a backend-friendly artifact, not the authoring source of truth.

## Phase 0 Status

No validator or compiler behavior is implemented here yet. The current source entrypoint is only a bootstrap placeholder so the monorepo can typecheck, test, and build.
