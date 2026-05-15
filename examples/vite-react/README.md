# Vite React Example

Browser-runnable host app for the React form builder and renderer.

## Run

```bash
pnpm --filter @your-org/forms-example-vite-react dev
```

Open the printed localhost URL. The app demonstrates:

- builder draft save through fake host persistence
- stale draft conflict recovery with reload, retry, and keep-local-edit controls
- publish gating, immutable published revision metadata, and revision warnings
- generated JSON Schema, compiler diagnostics, validation-plan, condition-dependency, and fixture review
- single-page renderer submission
- fake backend validation errors
- multi-step validation and navigation
- hidden-field filtering shown in the normalized envelope panel
- RTL rendering with Persian labels
- conflict, auth, rate-limit, and server-error backend statuses
- default theme package adoption with host-scoped CSS variable overrides

## Exercise The Builder Workflow

Use the `Builder save and publish workflow` section at the top of the example.

- Click `Save draft` to save the current builder schema into the fake host adapter. The status panel should show `Draft saved`.
- Click `Simulate save conflict`, then `Save draft`, to return a stale draft conflict. Use `Reload latest`, `Retry`, or `Keep local edits` to inspect recovery states.
- Click `Publish` to create an immutable published revision such as `rev_published_1`. The revision review panel should show the latest published revision and hash warning context.
- Click `Simulate publish conflict`, then `Publish`, to inspect the host publish conflict path.
- Open `Generated artifacts` to review the generated JSON Schema, dialect, compiler diagnostic count, validation-plan count, condition dependencies, and fixture references.

The fake host lives in `src/fakeBackend.ts`. It implements the same normalized adapter contracts that a real host backend integration would implement later, but it does not use a network, database, or backend-specific SDK.

## E2E

```bash
pnpm --filter @your-org/forms-example-vite-react test:e2e
```

Playwright starts the Vite dev server and verifies the browser-visible builder persistence, publish, artifact, and renderer submission behavior.

## Theme Usage

The example imports `createDefaultThemeStyles` from `@your-org/forms-themes` and injects the shared renderer and builder CSS helpers once at the app shell. The builder and renderer packages still expose their own style helpers, but the example keeps package theme styling out of host CSS.

Host-specific CSS stays in `src/styles.css`: page layout, debug panels, mode controls, and the scoped customization classes. `builder-theme-override` demonstrates a builder token override, and `host-theme-override` demonstrates renderer token overrides for primary color, focus color, and radius.

## Boundaries

This package is a host-app example. It renders the builder through `@your-org/forms-react-builder`, renders respondent forms through `@your-org/forms-react-renderer`, and uses fake in-process adapters that return normalized JSON contracts. It does not implement uploads, a real backend, auth, storage, or transport code.
