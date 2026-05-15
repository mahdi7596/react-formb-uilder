## Context

`packages/react-renderer` now exposes a working renderer API, but it has only been verified through React Testing Library and package-level tests. `examples/vite-react` still contains a Phase 0 placeholder entrypoint and cannot be opened in a browser to inspect respondent behavior.

Phase 6 should become the first owner-visible product output: a Vite React app that imports the renderer package, loads fixture-like published schemas, runs fake normalized backend responses, and proves the respondent experience in real browsers with Playwright and screenshots.

Relevant constraints:

- `packages/core` must stay framework-agnostic and must not depend on the example, React, Vite, Playwright, or renderer code.
- `packages/react-renderer` remains the only source of respondent rendering behavior. The example must not duplicate renderer field behavior.
- The example may add React, React DOM, Vite, Playwright, and browser-testing dependencies.
- The example should stay host-app-like: it demonstrates package usage rather than becoming product logic.
- Phase 6 should not start builder UI work.

## Goals / Non-Goals

**Goals:**

- Turn `examples/vite-react` into a runnable Vite React app.
- Render single-page and multi-step published schemas through `FormRenderer`.
- Demonstrate fake normalized backend success and validation-error flows.
- Include conflict, auth, rate-limit, and server-error response scenarios in the fake adapter surface.
- Demonstrate LTR and RTL forms with visible locale/direction handling.
- Add Playwright E2E coverage for successful submission, server validation error mapping, step navigation, hidden fields, keyboard focus, and responsive rendering.
- Use the Browser plugin during implementation verification when available.
- Capture desktop and narrow viewport screenshots for the phase report.
- Fix the TypeScript path alias for `@your-org/forms-react-renderer` to point to the TSX source entrypoint.

**Non-Goals:**

- No builder UI, palette, inspector, drag-and-drop, save/publish workflow, or schema editing.
- No real backend, network persistence, authentication, or database integration.
- No full design system or premium visual redesign.
- No upload lifecycle implementation beyond existing file metadata surfaces.
- No changes to core runtime behavior unless a real integration bug is discovered and fixed with tests.

## Decisions

### Decision: Convert the existing example package in place

Use `examples/vite-react` instead of creating a second example package.

Alternatives considered:

- Create a new `examples/renderer-vite-react` package. This would avoid disturbing the placeholder but duplicates the intended folder from the master plan.
- Convert `examples/vite-react` in place. This matches Phase 0 scaffolding and keeps the package map simple.

Chosen approach: convert in place.

### Decision: Keep schemas local to the example

The example should define or import local published schemas in source files, with shape aligned to core fixtures and renderer tests.

Alternatives considered:

- Import JSON fixtures directly from `packages/core/src/testing/fixtures/json`. That couples the browser example to test fixture internals and path/runtime loading details.
- Define local example schemas. This is clearer for host-app usage and lets the example include UI-specific labels and RTL copy.

Chosen approach: local example schemas, intentionally similar to core fixtures but not dependent on fixture internals.

### Decision: Use fake submission adapters, not a mock server

Submission behavior should be implemented as async adapter functions passed into `FormRenderer`.

Alternatives considered:

- Add a local mock HTTP server. This is heavier and introduces transport behavior before adapters are in scope.
- Use fake in-process adapters. This directly exercises the renderer's product-owned submission contract without pretending there is a real backend.

Chosen approach: fake in-process adapters that return normalized JSON backend responses.

### Decision: Use route/query-style example modes

The app should expose clear modes for manual inspection, such as single-page success, single-page server validation, multi-step, RTL, and backend status states.

Alternatives considered:

- Build a complex router. This adds dependency and complexity without much value.
- Use internal React tab/navigation state and stable test selectors. This is enough for Phase 6.

Chosen approach: simple in-app navigation controls and stable labels/selectors.

### Decision: Add Playwright at the example package boundary

Playwright tests should live with the Vite example and run through `pnpm --filter @your-org/forms-example-vite-react test:e2e`.

Alternatives considered:

- Root-level Playwright tests. This is workable later, but Phase 6 is package-specific.
- Vitest-only DOM tests. These do not prove the browser-visible output the owner asked for.

Chosen approach: package-local Playwright config and tests, with Vite dev server integration.

### Decision: Keep visual styling demonstrative but restrained

The example should be readable and professional enough for owner review, using renderer style hooks and minimal app CSS. It should not define the future design system.

Alternatives considered:

- Leave it unstyled. This makes manual inspection harder and weakens screenshot value.
- Build a full theme package now. That belongs to a later design-system readiness phase.

Chosen approach: local example CSS that proves renderer hooks, direction, layout, and responsive behavior.

## Risks / Trade-offs

- [Risk] Playwright browser binaries may not be installed locally. → Mitigation: document the install step if needed, and run `npx playwright install` only if verification requires it.
- [Risk] Example app build may need Vite-specific TypeScript settings while workspace packages use `NodeNext`. → Mitigation: keep the example tsconfig explicit and verify both package build and root build.
- [Risk] Existing generated `dist/` and `tsconfig.tsbuildinfo` artifacts in the example may obscure source changes. → Mitigation: avoid depending on generated artifacts, and keep final git status clear.
- [Risk] The renderer package export/path alias still points to `index.ts` while the source is `index.tsx`. → Mitigation: update source aliases and verify `pnpm typecheck` and `pnpm build`.
- [Risk] Browser tests could become brittle if they assert visual details too tightly. → Mitigation: assert behavior and stable accessible names/selectors, use screenshots for review evidence rather than pixel-perfect gating.

## Migration Plan

1. Replace the placeholder example package source with a Vite React app structure.
2. Add required example dependencies and scripts.
3. Add package-local schemas, fake adapters, app components, and styles.
4. Add Playwright config and E2E tests.
5. Update TypeScript aliases/references needed for renderer TSX imports.
6. Run package and workspace verification.
7. Start the dev server for owner inspection and capture screenshots.
8. Write the Phase 6 report and stop for owner review.

Rollback is simple before publishing: revert the Phase 6 commit, which only affects example/tooling/report artifacts unless a separately justified renderer bug fix is needed.

## Open Questions

- Should the example include Persian RTL copy in Phase 6, or use English text with `direction: "rtl"` only? The default implementation should include a small Persian-labeled RTL example because the owner can inspect directionality more clearly.
- Should screenshots be committed under `docs/reports/assets/` or another report-local folder? The default implementation should use `docs/reports/assets/phase-6-renderer-example-e2e/`.
