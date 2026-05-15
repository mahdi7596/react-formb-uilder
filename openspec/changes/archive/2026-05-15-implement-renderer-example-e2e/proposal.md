## Why

Phase 5 proved the React renderer through package-level tests, but there is still no runnable browser experience for the owner to inspect. Phase 6 should turn the placeholder Vite example into a real React app that demonstrates published schemas, submissions, server error mapping, step navigation, LTR/RTL behavior, and browser-level verification before builder work begins.

## What Changes

- Convert `examples/vite-react` from a bootstrap placeholder into a runnable Vite React example app.
- Render real single-page and multi-step published schemas using `@your-org/forms-react-renderer`.
- Add fake JSON submission adapters that can return normalized success, validation, conflict, auth, rate-limit, and server-error responses.
- Add example surfaces for LTR and RTL forms so renderer direction and locale behavior can be manually inspected.
- Add Playwright E2E coverage for successful submission, backend validation error mapping, step navigation, hidden-field behavior, keyboard focus, and responsive rendering.
- Capture desktop and narrow viewport screenshots for the phase report.
- Fix local TypeScript/package alias issues needed for the example to import the TSX renderer entrypoint correctly.

## Capabilities

### New Capabilities

- `renderer-example-e2e`: Browser-runnable renderer example, fake backend response flows, and Playwright verification for respondent behavior.

### Modified Capabilities

- `react-renderer-foundation`: Clarify that the renderer foundation must be proven through a real Vite React example and browser E2E before builder phases begin.

## Impact

- Affected example package: `examples/vite-react`.
- Affected renderer integration: `@your-org/forms-react-renderer` consumed by an app rather than only package tests.
- Affected root tooling: TypeScript path aliases, Vite config, Playwright config, scripts, lockfile, and build/test wiring as needed.
- Affected verification: `pnpm --filter @your-org/forms-example-vite-react dev`, `pnpm --filter @your-org/forms-example-vite-react test:e2e`, screenshots, `pnpm test`, and `pnpm build`.
- No changes to `packages/core` runtime behavior are intended.
- No builder UI work is included in this change.
