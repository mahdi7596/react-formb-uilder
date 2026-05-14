# @your-org/forms-react-renderer

Phase 0 placeholder package for the public respondent renderer.

## Responsibility

This package will own React rendering, field registry integration, renderer slots, renderer hooks, accessibility wiring, step orchestration, and optional internal React Hook Form integration.

## Boundary

React Hook Form, if used later, must remain hidden behind this product's renderer API. This package must not define canonical schema behavior that belongs in `@your-org/forms-core`.

## Phase 0 Status

No renderer behavior is implemented here yet. The current source entrypoint is only a bootstrap placeholder so the monorepo can typecheck, test, and build.
