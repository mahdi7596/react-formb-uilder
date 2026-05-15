# Phase 10 Report: Persistence Publish Adapters

Date: 2026-05-15

OpenSpec change: `implement-persistence-publish-adapters`

## Summary

Phase 10 is complete. The project now has backend-agnostic adapter contracts, builder persistence and publish workflow state, generated artifact review, normalized renderer submission adapter handling, and a Vite example that exercises save, conflict, publish, artifact, and submission flows with fake host persistence.

The implementation keeps `packages/core` framework-free and transport-free. TanStack Query is used only inside `packages/react-builder` server-state helpers and is not added to core or adapter contracts.

## Changed Files

- `packages/adapters/src/index.ts`
- `packages/adapters/src/index.test.ts`
- `packages/adapters/README.md`
- `packages/validators/src/compiler/index.ts`
- `packages/validators/src/index.test.ts`
- `packages/validators/README.md`
- `packages/react-builder/src/persistence.ts`
- `packages/react-builder/src/persistence.test.ts`
- `packages/react-builder/src/server-state.ts`
- `packages/react-builder/src/server-state.test.tsx`
- `packages/react-builder/src/ui.tsx`
- `packages/react-builder/src/ui.test.tsx`
- `packages/react-builder/src/index.ts`
- `packages/react-builder/package.json`
- `packages/react-builder/tsconfig.json`
- `packages/react-renderer/src/index.tsx`
- `packages/react-renderer/src/index.test.tsx`
- `packages/react-renderer/package.json`
- `packages/react-renderer/tsconfig.json`
- `examples/vite-react/README.md`
- `examples/vite-react/package.json`
- `examples/vite-react/src/App.tsx`
- `examples/vite-react/src/core-browser.ts`
- `examples/vite-react/src/fakeBackend.ts`
- `examples/vite-react/src/main.tsx`
- `examples/vite-react/src/schemas.ts`
- `examples/vite-react/src/styles.css`
- `examples/vite-react/tests/renderer-example.spec.ts`
- `examples/vite-react/index.html`
- `examples/vite-react/playwright.config.ts`
- `examples/vite-react/vite.config.ts`
- `examples/vite-react/tsconfig.json`
- `examples/vite-react/tsconfig.build.json`
- `pnpm-lock.yaml`
- `tsconfig.base.json`
- `openspec/changes/implement-persistence-publish-adapters/tasks.md`

The older `examples/vite-react/src/index.ts` and `examples/vite-react/src/index.test.ts` were removed as the example moved to a runnable Vite app entry structure.

## Implemented Contracts

- Added typed adapter operations for `loadForm`, `saveDraft`, `publishRevision`, `listRevisions`, `loadPublishedForm`, and `submitForm`.
- Added normalized adapter result envelopes with success, validation error, conflict, blocked, auth error, rate limit, server error, network error, malformed response, and dangerous-key rejection statuses.
- Added draft metadata, published revision metadata, revision list, conflict metadata, and immutable published revision response types.
- Added adapter helpers for success/failure envelopes, stale draft conflict, immutable publish conflict, dangerous-key diagnostics, adapter data normalization, and unknown adapter error normalization.
- Kept adapter types JSON-first and transport-agnostic. No fetch, REST, GraphQL, database, React, or TanStack Query dependency is introduced in adapters.
- Added validator `createBuilderArtifactBundle` output for JSON Schema, compiler diagnostics, validation plan, condition dependencies, dialect metadata, generation metadata, and fixture references.
- Updated renderer submission handling so a host submission adapter can return normalized adapter results while renderer APIs remain product-owned.

## Builder Workflow

- Added product-owned persistence states: `idle`, `loading`, `dirty`, `saving`, `saved`, `failed`, `retrying`, and `conflicted`.
- Added publish checklist items from metadata checks, core schema diagnostics, compiler diagnostics, builder dangerous-change diagnostics, adapter conflicts, and revision comparison warnings.
- Added revision comparison helpers for current draft metadata versus latest published revision metadata.
- Added workflow panels in `BuilderWorkspace` for persistence status, conflict recovery, publish checklist, revision review, and generated artifacts.
- Save and publish callbacks now receive the current in-builder schema so host persistence can save the actual edited schema.
- Existing builder schema changes still flow through builder commands/store paths.

## Example App

- Wired `examples/vite-react` as a browser-runnable host app with the real builder and renderer.
- Added fake host persistence for draft load/save, stale save conflict, publish success, publish conflict, revision listing, published form loading, and normalized submission.
- Added controls for `Simulate save conflict` and `Simulate publish conflict`.
- Documented how to exercise save, conflict recovery, publish, artifact review, and renderer submission flows in the example README.

## Browser Evidence

Flow under test: `http://127.0.0.1:5173/` -> click `Save draft` -> saved persistence state appears.

Browser plugin was available and used through the in-app browser after automated Playwright coverage. Evidence captured:

- URL: `http://127.0.0.1:5173/`
- Title: `React Form Builder Renderer Example`
- Page identity and nonblank check: page contained `Builder save and publish workflow` and `Publish checklist`
- Framework overlay: none observed
- Console health: no warnings or errors reported by browser dev logs
- Interaction proof: clicking `Save draft` showed `Draft saved in the fake host adapter.`

## Verification Commands

- `pnpm --filter @your-org/forms-adapters test`
- `pnpm --filter @your-org/forms-adapters typecheck`
- `pnpm --filter @your-org/forms-adapters build`
- `pnpm --filter @your-org/forms-validators test`
- `pnpm --filter @your-org/forms-validators typecheck`
- `pnpm --filter @your-org/forms-validators build`
- `pnpm --filter @your-org/forms-react-builder test`
- `pnpm --filter @your-org/forms-react-builder typecheck`
- `pnpm --filter @your-org/forms-react-builder build`
- `pnpm --filter @your-org/forms-react-renderer test`
- `pnpm --filter @your-org/forms-react-renderer typecheck`
- `pnpm --filter @your-org/forms-react-renderer build`
- `pnpm --filter @your-org/forms-example-vite-react typecheck`
- `pnpm --filter @your-org/forms-example-vite-react build`
- `pnpm --filter @your-org/forms-example-vite-react test:e2e`
- `pnpm test`
- `pnpm build`
- `openspec validate implement-persistence-publish-adapters --strict`

Final verification status:

- Unit/component tests: 21 files passed, 77 tests passed
- Example Playwright tests: 9 passed
- Full build: passed
- OpenSpec strict validation: passed

## Known Limitations

- The example uses in-memory fake host persistence only. Refreshing the page resets draft and published revision state.
- There is no real backend, auth, database, network transport, upload lifecycle, or collaboration/locking implementation in this phase.
- Publish conflict recovery is represented as normalized state; no merge UI is implemented.
- Generated artifact review is intentionally read-only.
- The adapter contracts are TypeScript contracts and helpers, not a backend SDK.

## Dirty Worktree Notes

Before this implementation continued, the example app and some workspace metadata were already dirty from earlier phase work. This phase intentionally worked with those files rather than reverting them. The Phase 10 changes are scoped to persistence/publish adapters, builder workflow state, renderer submission integration, validator artifact bundles, and the Vite example.

## Owner Review Checklist

- Run the example with `pnpm --filter @your-org/forms-example-vite-react dev`.
- Open the printed localhost URL.
- Click `Save draft` and confirm the saved state appears.
- Click `Simulate save conflict`, then `Save draft`, and confirm reload/retry/keep-local controls appear.
- Click `Publish` and confirm `rev_published_1` appears in the revision review surface.
- Open `Generated artifacts` and inspect the JSON Schema/dialect/diagnostic metadata.
- Submit the public renderer form and confirm the normalized envelope and backend response panels update.
