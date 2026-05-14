# @your-org/forms-core

Phase 0 placeholder package for framework-agnostic form-builder contracts and runtime behavior.

## Responsibility

This package will own canonical schema contracts, submitted path parsing, dangerous-key rejection, traversal, condition evaluation, validation primitives, normalization, submission contracts, migrations, and diagnostics.

## Boundary

This package must not depend on React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, upload providers, design-system components, CSS, browser upload orchestration, or transport clients.

## Phase 0 Status

No product runtime behavior is implemented here yet. The current source entrypoint is only a bootstrap placeholder so the monorepo can typecheck, test, and build.
