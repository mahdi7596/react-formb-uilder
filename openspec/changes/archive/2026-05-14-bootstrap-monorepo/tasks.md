## 1. Repository Setup

- [x] 1.1 Initialize git in `/Users/mahdi/Documents/work/form-builder` if it is not already initialized
- [x] 1.2 Set the default local branch to `main`
- [x] 1.3 Add `origin` remote pointing to `https://github.com/mahdi7596/react-formb-uilder.git`
- [x] 1.4 Create `.gitignore` covering Node dependencies, package-manager stores, build output, coverage, Playwright output, logs, environment files, and OS files

## 2. Workspace Configuration

- [x] 2.1 Create root `package.json` with private workspace metadata and scripts for `build`, `test`, `lint`, `typecheck`, `format`, and `clean`
- [x] 2.2 Create `pnpm-workspace.yaml` including `packages/*` and `examples/*`
- [x] 2.3 Create root base TypeScript configuration for package configs to extend
- [x] 2.4 Create root Vitest configuration
- [x] 2.5 Add minimal lint and format configuration or document any intentional deferral in the Phase 0 report

## 3. Package And Example Scaffold

- [x] 3.1 Create package directories for `packages/core`, `packages/react-renderer`, `packages/react-builder`, `packages/validators`, `packages/adapters`, and `packages/themes`
- [x] 3.2 Add package `package.json` files with placeholder names, export maps, and package-local scripts
- [x] 3.3 Add package TypeScript configs extending the root base config
- [x] 3.4 Add placeholder source entrypoints required for typecheck and build verification
- [x] 3.5 Create `examples/vite-react` placeholder directory and package metadata without implementing renderer behavior

## 4. Documentation Scaffold

- [x] 4.1 Create documentation directories for schema, integration, accessibility, migrations, security, development, and reports
- [x] 4.2 Add README boundary notes to each Phase 0 package explaining responsibilities and forbidden dependencies
- [x] 4.3 Add `docs/development/phase-workflow.md` documenting phase verification, reports, owner review, and approval gates
- [x] 4.4 Ensure package documentation states that Phase 0 contains no product runtime behavior

## 5. Verification

- [x] 5.1 Run `pnpm install`
- [x] 5.2 Run `pnpm typecheck`
- [x] 5.3 Run `pnpm test`
- [x] 5.4 Run `pnpm build`
- [x] 5.5 Run lint and format verification if configured
- [x] 5.6 Confirm `packages/core/package.json` does not depend on React, React Hook Form, TanStack Query, dnd-kit, AJV, Zod, upload providers, or transport clients

## 6. Phase Report And Handoff

- [x] 6.1 Write `docs/reports/2026-05-14-phase-0-project-setup.md`
- [x] 6.2 Include changed files, decisions, scripts, dependency boundaries, commands run, results, known limitations, and owner review checklist in the report
- [x] 6.3 Commit Phase 0 artifacts after verification succeeds or document why commit is deferred
- [x] 6.4 Stop after Phase 0 and request owner review before Phase 1 begins
