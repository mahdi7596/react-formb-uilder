## 1. Example Package And Tooling Setup

- [ ] 1.1 Replace the placeholder example package description/scripts with Vite app scripts for `dev`, `build`, `preview`, `typecheck`, and `test:e2e`
- [ ] 1.2 Add example dependencies for React, React DOM, Vite, `@vitejs/plugin-react`, `@your-org/forms-react-renderer`, and Playwright
- [ ] 1.3 Update example TypeScript config for TSX, DOM app files, Vite client types, and package references to core and renderer
- [ ] 1.4 Update root TypeScript path aliases so `@your-org/forms-react-renderer` resolves to the renderer TSX source entrypoint
- [ ] 1.5 Add Vite config for the example package with local package aliases
- [ ] 1.6 Add Playwright config scoped to `examples/vite-react` and wired to the Vite dev server
- [ ] 1.7 Remove or replace obsolete placeholder source/test files without relying on generated `dist/` artifacts

## 2. Example Schemas And Fake Backend Contracts

- [ ] 2.1 Create local published single-page schema with required fields, conditional visibility, disabled state, hidden field, choice field, and file metadata field
- [ ] 2.2 Create local published multi-step schema with at least two steps, section children, current-step validation, and final submission
- [ ] 2.3 Create local published RTL schema with `direction: "rtl"` and visible RTL labels/content
- [ ] 2.4 Create fake normalized backend response fixtures or factories for success, validation error, conflict, auth error, rate-limit, and server-error states
- [ ] 2.5 Create fake submission adapters that accept renderer-created submission envelopes and expose the last envelope for browser/E2E inspection
- [ ] 2.6 Ensure fake adapters use product-owned JSON contracts and do not introduce real transport or backend-specific assumptions

## 3. Vite React App Implementation

- [ ] 3.1 Add browser entry files such as `index.html`, `src/main.tsx`, and app-level CSS
- [ ] 3.2 Build an example app shell with simple mode controls for single-page, multi-step, RTL, and backend status scenarios
- [ ] 3.3 Render all forms through `FormRenderer` from `@your-org/forms-react-renderer`
- [ ] 3.4 Apply `createRendererStyles()` plus local example CSS for readable manual inspection
- [ ] 3.5 Display submission status, backend scenario controls, and last normalized submission envelope in a host-app debug panel
- [ ] 3.6 Demonstrate hidden-field filtering through visible envelope output after submission
- [ ] 3.7 Keep example components focused on host-app composition rather than duplicating renderer field behavior
- [ ] 3.8 Update the example README with how to run the app, run E2E tests, and understand the demo modes

## 4. Browser E2E Tests

- [ ] 4.1 Add Playwright test for successful single-page form submission and success feedback
- [ ] 4.2 Add Playwright test for server validation error mapping to field error, global error, invalid state, and focus
- [ ] 4.3 Add Playwright test for multi-step validation, next/previous navigation, and final submission
- [ ] 4.4 Add Playwright test proving hidden or conditionally hidden fields are excluded from visible normalized submission output
- [ ] 4.5 Add Playwright test for keyboard focus behavior after invalid submit
- [ ] 4.6 Add Playwright test or assertions for RTL mode rendering and narrow viewport usability
- [ ] 4.7 Keep selectors based on accessible names, roles, stable test ids, or stable renderer data attributes

## 5. Browser Verification And Screenshots

- [ ] 5.1 Run `pnpm --filter @your-org/forms-example-vite-react dev` and keep the server available for owner inspection
- [ ] 5.2 Use the Browser plugin to inspect the local example in desktop viewport
- [ ] 5.3 Use the Browser plugin to inspect the local example in a narrow viewport
- [ ] 5.4 Capture desktop screenshot for the phase report
- [ ] 5.5 Capture narrow viewport screenshot for the phase report
- [ ] 5.6 Check browser console health for runtime errors during manual inspection
- [ ] 5.7 Record the local URL and screenshot paths in the phase report

## 6. Verification, Report, And Commit

- [ ] 6.1 Run `pnpm install` if dependencies or lockfile changed
- [ ] 6.2 Run `pnpm --filter @your-org/forms-example-vite-react typecheck`
- [ ] 6.3 Run `pnpm --filter @your-org/forms-example-vite-react build`
- [ ] 6.4 Run `pnpm --filter @your-org/forms-example-vite-react test:e2e`
- [ ] 6.5 Run `pnpm test`
- [ ] 6.6 Run `pnpm build`
- [ ] 6.7 Confirm `packages/core` still has no dependency on React, Vite, Playwright, renderer, or the example package
- [ ] 6.8 Run `openspec validate implement-renderer-example-e2e --strict`
- [ ] 6.9 Write `docs/reports/2026-05-14-phase-6-renderer-example-e2e.md`
- [ ] 6.10 Include changed files, example modes, browser URL, screenshots, commands run, results, dependency boundary check, known limitations, and owner review checklist in the report
- [ ] 6.11 Commit Phase 6 proposal artifacts, implementation, tests, screenshots, and report after verification succeeds
- [ ] 6.12 Stop after Phase 6 and request owner review before Phase 7 builder command/store work begins
