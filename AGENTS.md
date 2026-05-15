# Agent Startup Instructions

This project is the beginning of a backend-agnostic React form builder. Every new AI or coding agent session must read this file before planning, proposing, or changing code.

## Required Context

Before responding to a new implementation prompt, inspect:

1. `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`
2. `AGENTS.md`
3. Any OpenSpec change files if they are added later under `openspec/`
4. While the product-completion plan is active, inspect `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md` and `docs/superpowers/plans/2026-05-15-form-builder-product-completion-master-plan.md` before proposing or implementing product-completion changes. Stop treating these two files as required startup context once that plan is explicitly marked complete, archived, or superseded by a newer dated plan.

Use the architecture design as the source of truth unless the user explicitly supersedes it in a newer dated document or direct instruction.

## Product Direction

Build a package-first form builder with these durable decisions:

- Use a custom canonical form schema for authoring and rendering.
- Generate JSON Schema only as an optional backend-friendly artifact.
- Keep `forms-core` framework-agnostic and free of React, AJV, Zod, upload providers, design-system components, and transport code.
- Keep React-specific rendering and builder UI in separate packages.
- Keep backend integration based on normalized JSON contracts, not React code or backend-specific assumptions.
- Treat published revisions as immutable.
- Keep React Hook Form, if used, behind this product's own renderer API.
- Do not persist executable JavaScript or React components in schemas.

## Project Skills

This workspace includes project-local skills under `.codex/skills/`. Use them when their trigger matches the task.

### `form-builder-ux-reviewer`

Use when reviewing, auditing, or improving the creator UX of the React form builder, especially:

- component discovery and organization
- adding components through drag and drop
- canvas/drop-zone behavior
- empty, hover, focus, selected, dragging, dropping, invalid-drop, disabled, error, and loading states
- component settings and inspector editing flows
- form structure clarity
- undo/redo expectations
- keyboard and accessibility behavior
- responsive/mobile behavior
- user confidence, feedback, and recovery

This skill is for UX and user-flow quality. It can recommend concrete improvements and can help implement them only when the user explicitly asks for code changes.

### `form-builder-ui-reviewer`

Use when reviewing, auditing, or improving the visual UI execution of the React form builder, especially:

- visual hierarchy and layout balance
- palette/sidebar presentation
- canvas presentation and component block styling
- inspector/settings panel styling
- form field visual design
- spacing, alignment, density, rhythm, and typography
- colors, contrast, borders, shadows, dividers, backgrounds, and surfaces
- icon usage
- empty, hover, focus, selected, dragging, dropping, disabled, error, warning, success, and loading states
- motion, animation, and reduced-motion behavior
- responsive visual behavior
- visual consistency and polish

This skill is for visual UI quality, not product flow strategy. It can recommend concrete visual improvements and can help implement them only when the user explicitly asks for code changes.

Both skills should compare quality against strong modern form builders and creation tools where useful, including Tally, Typeform, Jotform, Fillout, Cognito Forms, Google Forms, SurveyMonkey, Formstack, Webflow, Framer, and Notion-style editors.

## Pre-Implementation Checklist

Before writing product code, make sure the relevant contract is specified. The architecture document calls out these priorities:

- Formal submitted path grammar and dangerous-key rejection.
- Canonical node, validation, condition, error, metadata, submission, and backend response contracts.
- JSON Schema dialect and compiler diagnostics.
- Hidden-field value semantics.
- Custom field, validator, and predicate registration contracts.
- Deterministic condition evaluation with dependency tracking and cycle detection.
- Backend conformance fixtures.
- Explicit decisions on whether repeaters and uploads are in MVP.

If a task would require one of these but it is still unspecified, update or create the specification before implementing behavior.

## Development Rules

- Prefer a monorepo structure matching the architecture document:

  ```text
  packages/
    core/
    react-renderer/
    react-builder/
    validators/
    uploads/
    adapters/
    themes/
    devtools/
  examples/
  docs/
  ```

- Start with contracts, fixtures, and core runtime behavior before UI polish.
- Keep persisted data JSON-serializable and backend-agnostic.
- Fail closed for unknown custom validators, predicates, unsafe schema keys, and unsupported compiler behavior.
- Add tests alongside meaningful behavior, especially for schema parsing, paths, validation, conditions, submissions, responses, and migrations.
- Do not introduce heavyweight design systems or backend-specific persistence unless the user explicitly asks.

## React Technical Architecture Rules

The approved React-side architecture is documented in `docs/architecture/2026-05-14-react-technical-architecture-decisions.md`. Future agents must follow it unless the user explicitly supersedes it with a newer dated decision.

### Chosen React Libraries

- Use TypeScript and a package-first monorepo.
- Use React for `packages/react-renderer` and `packages/react-builder`; never introduce React into `packages/core`.
- Use React Hook Form only as an internal implementation detail of `packages/react-renderer` where it fits respondent form state. Do not expose React Hook Form types, resolvers, field arrays, or form state in public package APIs.
- Use TanStack Query for server/persistence state in builder adapters and examples, including load, save draft, publish, revision listing, submission, async options, and future upload prepare/finalize flows. Do not require TanStack Query in `packages/core`.
- Use `dnd-kit` as the default drag-and-drop library for `packages/react-builder`, wrapped behind builder-specific drag abstractions.
- Use Vitest for core/domain tests, React Testing Library for React component tests, Playwright for end-to-end builder/renderer flows, and axe-compatible checks for accessibility.

### Package And Folder Boundaries

- Keep `packages/core` framework-agnostic. It owns schema contracts, submitted path parsing, dangerous-key rejection, traversal, condition evaluation, validation primitives, normalization, submission contracts, migrations, and diagnostics.
- Keep JSON Schema generation, AJV-related helpers, optional Zod helpers, compiler diagnostics, and backend-friendly validation artifacts in `packages/validators` or a later compiler package, not in `packages/core`.
- Keep `packages/react-renderer` responsible for respondent rendering, field registry, slots, renderer hooks, accessibility wiring, step orchestration, and optional internal React Hook Form integration.
- Keep `packages/react-builder` responsible for palette, canvas/tree, inspector, schema editing commands, undo/redo, drag-and-drop, preview, publish checks, and adapter-driven persistence.
- Keep `packages/adapters` thin. Adapters implement agreed JSON contracts and must not define product behavior.

### Component-Driven Architecture Rules

- This project is explicitly component-driven in both architecture and design practice.
- Build stable product components, not only visual fragments.
- Use reusable primitives for buttons, icon buttons, inputs, panels, tabs, dialogs, tooltips, menus, empty states, loading states, error states, inspector rows, field chrome, labels, descriptions, and validation messages.
- Renderer field components must follow a field contract and receive renderer-managed ids, accessibility state, value bindings, error state, required/disabled state, and focus behavior.
- Builder feature components must delegate schema changes to commands or domain functions instead of mutating schema directly.
- The builder preview must use the real renderer. Do not duplicate renderer behavior in the builder.
- Create reusable components when they represent a stable product concept, repeated pattern, or accessibility-sensitive control. Avoid speculative abstractions, but do not duplicate established primitives or field chrome.

### State-Management Rules

- Use React local state for small component-local UI state.
- Use a Zustand-style editor store for builder state such as selected node, active panel, canvas mode, drag state, command status, and history.
- Keep schema mutations in command functions that can be tested without React.
- Use TanStack Query for async server state, mutation state, caching, invalidation, retries, and conflicts.
- Do not use React Hook Form for builder schema editing.
- Do not put domain invariants inside React components.

### Form-State Rules

- React Hook Form may be used inside `packages/react-renderer` for respondent form values and field registration, but the public renderer API must remain product-owned.
- The product's canonical schema, validation model, hidden-value semantics, and normalized submission contract override any React Hook Form convenience.
- If React Hook Form conflicts with repeaters, hidden fields, custom fields, or accessibility/focus contracts, change the integration rather than weakening the product contract.

### Server-State Rules

- Load, save, publish, submission, revisions, async options, and future upload lifecycle calls should go through adapter contracts.
- TanStack Query usage belongs in React packages, examples, or host integration helpers; never in `packages/core`.
- Persist and exchange normalized JSON contracts, not React state or library-specific objects.

### Drag-And-Drop Rules

- Use `dnd-kit` for builder drag-and-drop.
- Keep drag sensors, overlays, sortable behavior, collision rules, and invalid-drop feedback inside a builder DnD layer.
- Drag callbacks must call schema editing commands. Do not directly mutate schema from drag UI components.
- Drag-and-drop must support keyboard and accessible movement patterns before being considered complete.

### Validation And Schema Rules

- Use the custom canonical form schema as the source of truth for authoring and rendering.
- Generate JSON Schema as an optional backend-friendly artifact only. The default dialect is Draft 2020-12 unless a newer dated decision changes it.
- Keep validation layered: schema validation, client runtime validation, backend validation, compiler diagnostics, and conformance fixtures.
- Unknown custom fields, validators, predicates, unsafe schema keys, and unsupported compiler behavior must fail closed.
- Do not store executable JavaScript or React components in persisted schemas.

### Testing Rules

- Add tests alongside meaningful behavior.
- Test core schema, paths, validation, conditions, normalization, submissions, backend responses, migrations, and diagnostics with Vitest.
- Test React rendering, field accessibility, conditional behavior, step navigation, and builder interactions with React Testing Library.
- Test builder flows, preview parity, drag-and-drop, keyboard workflows, and examples with Playwright.
- Use accessibility checks for built-in and custom field contracts.
- For rendered frontend changes, use the `build-web-apps:frontend-testing-debugging` skill when applicable, with the Browser plugin preferred when available.

### React Best-Practices Skills

Future agents must use these skills when relevant:

- `$vercel-react-best-practices` at `/Users/mahdi/.agents/skills/vercel-react-best-practices/SKILL.md` when writing, reviewing, or refactoring React/Next.js code, data fetching, performance, or bundle behavior.
- `$build-web-apps:react-best-practices` at `/Users/mahdi/.codex/plugins/cache/openai-curated/build-web-apps/08373044/skills/react-best-practices/SKILL.md` when working on React/Next.js implementation through the Build Web Apps workflow.
- `$build-web-apps:frontend-testing-debugging` at `/Users/mahdi/.codex/plugins/cache/openai-curated/build-web-apps/08373044/skills/frontend-testing-debugging/SKILL.md` when validating rendered frontend changes, UI bugs, local app flows, console health, screenshots, responsive behavior, or interaction proof.

Apply React best-practices guidance especially for async waterfalls, bundle size, direct imports over broad barrel imports, dynamic imports for heavy builder-only features, selector-based subscriptions, derived state, memoization boundaries, avoiding inline component definitions, transitions/deferred rendering, event-listener cleanup, and Next.js serialization boundaries.

### Design-System Readiness

- Do not define the full visual design system until the user asks for that phase.
- Prepare for a future design system with headless or minimally styled primitives, reusable components, renderer slots, CSS variables, data attributes, class hooks, semantic HTML, accessible names, and clear component contracts.
- Do not hard-code product styling in `packages/core` or domain logic.
- When creating or upgrading the design system, use the `design-md-creator` skill at `/Users/mahdi/.codex/skills/design-md-creator/SKILL.md` to create a project-level `DESIGN.md`.

### Anti-Duplication And Clean-Code Rules

- Do not duplicate field rendering between builder preview and public renderer.
- Do not duplicate schema mutation logic inside UI components.
- Do not create separate validation paths that drift from the canonical schema contracts.
- Keep components focused, named by product responsibility, and small enough to understand independently.
- Prefer pure functions for domain behavior and command functions for schema edits.
- Add abstractions only when they remove real duplication, stabilize an important boundary, or match an established local pattern.
- Keep persisted data JSON-serializable and backend-agnostic.

## Prompt Handoff Protocol

When a new user prompt starts a meaningful task:

1. Re-read the architecture document sections relevant to the request.
2. Check whether an existing spec, task list, or implementation already covers it.
3. Check whether a project-local skill applies, especially `form-builder-ux-reviewer` for creator UX or `form-builder-ui-reviewer` for visual UI quality.
4. For development that continues the product after the MVP release candidate while the product-completion plan is active, start from `docs/superpowers/plans/2026-05-15-form-builder-product-completion-master-plan.md` and read `docs/research/2026-05-15-complete-form-builder-feature-component-inventory.md` as the source for competitor findings, component behavior, feature gaps, Persian/RTL/Iran requirements, and recommended OpenSpec changes. Once that plan is complete, archived, or superseded, follow the newer active plan instead.
5. Preserve newer user decisions over older draft architecture text.
6. If you create new durable decisions, document them in a dated Markdown file or an OpenSpec change so the next AI can inspect them.
7. Keep final notes concise and include which files changed and what verification was run.

The goal is that a future AI can enter this workspace cold, inspect this file plus the architecture design, and continue the form builder without rediscovering the project direction.
