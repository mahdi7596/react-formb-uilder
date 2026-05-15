# Vite React Example

Browser-runnable host app for the React form builder and renderer.

## Run

```bash
pnpm --filter @your-org/forms-example-vite-react dev
```

Open the printed localhost URL. The root page opens directly to the Persian RTL builder workspace. Production examples live at `/examples`.

The examples page demonstrates production-style templates rather than toy-only forms:

- English customer intake with content blocks, structured dropdown/radio/checkbox options, consent, hidden campaign metadata, and a thank-you ending
- Persian RTL customer intake with Iran province/city option presets and stable backend values
- multi-step project request with section containers and current-step validation
- visual logic showing conditional visibility and conditional requiredness
- renderer-only embed mode that mounts `FormRenderer` without the builder
- builder draft save through fake host persistence
- stale draft conflict recovery with reload, retry, and keep-local-edit controls
- publish gating, immutable published revision metadata, revision warnings, and generated artifacts
- fake backend validation errors, conflict, auth, rate-limit, and server-error statuses
- default theme package adoption with host-scoped CSS variable overrides

## Exercise The Builder Workflow

Use the root builder page, or the `Builder save, preview, and publish workflow` section on any builder-enabled example template.

- Click `ذخیره پیش‌نویس` to save the current Persian builder schema into the fake host adapter. The status panel should show the saved state.
- Click `Simulate save conflict`, then `Save draft`, to return a stale draft conflict. Use `Reload latest`, `Retry`, or `Keep local edits` to inspect recovery states.
- Click `انتشار` to create an immutable published revision such as `rev_published_1`. The revision review panel should show the latest published revision and hash warning context.
- Click `Simulate publish conflict`, then `Publish`, to inspect the host publish conflict path.
- Open `Generated artifacts` to review the generated JSON Schema, dialect, compiler diagnostic count, validation-plan count, condition dependencies, and fixture references.
- Click `پیش‌نمایش` inside the builder to verify the template renders through the real public renderer.

## Owner Review Checklist

- Open `/` and confirm it starts directly on the Persian RTL builder workspace.
- Open `/examples`, select `Customer intake`, and submit the form; the ending screen should say `Request received`.
- Select `Persian intake`; the form panel should be RTL, Persian labels should render, and submitted option values should stay English/stable in the debug envelope.
- Select `Visual logic`; the integration target field should appear only after choosing `Backend integration`.
- Select `Renderer-only embed`; the builder workspace should disappear and the public form should still submit normally.
- Open builder preview for a template and confirm the same respondent controls appear there.

The fake host lives in `src/fakeBackend.ts`. It implements the same normalized adapter contracts that a real host backend integration would implement later, but it does not use a network, database, or backend-specific SDK.

## E2E

```bash
pnpm --filter @your-org/forms-example-vite-react test:e2e
```

Playwright starts the Vite dev server and verifies browser-visible production templates, Persian RTL output, visual logic, renderer-only embedding, builder persistence, publish, artifact, and renderer submission behavior.

## Theme Usage

The example imports `createDefaultThemeStyles` from `@your-org/forms-themes` and injects the shared renderer and builder CSS helpers once at the app shell. The builder and renderer packages still expose their own style helpers, but the example keeps package theme styling out of host CSS.

Host-specific CSS stays in `src/styles.css`: page layout, debug panels, mode controls, and the scoped customization classes. `builder-theme-override` demonstrates a builder token override, and `host-theme-override` demonstrates renderer token overrides for primary color, focus color, and radius.

## Boundaries

This package is a host-app example. It renders the builder through `@your-org/forms-react-builder`, renders respondent forms through `@your-org/forms-react-renderer`, and uses fake in-process adapters that return normalized JSON contracts. It does not implement uploads, a real backend, auth, storage, or transport code.
