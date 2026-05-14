# React Technical Architecture Decisions

Decision date: 2026-05-14

Status: approved baseline for implementation.

This document records the React-side architecture decisions for the backend-agnostic React form builder. It complements `2026-05-14-react-form-builder-architecture-design.md`, which remains the broader product architecture source of truth.

## Goals

- Build a package-first React form builder and renderer that can be embedded into React and Next.js applications.
- Keep the form-builder domain model backend-agnostic and JSON-serializable.
- Keep React, UI state, drag-and-drop, form state, and server state separated from core schema/runtime logic.
- Use component-driven design and component-driven architecture from the beginning.
- Prepare for a future design system without choosing or hard-coding the full visual system yet.

## Recommended Package Architecture

Use a TypeScript monorepo with package boundaries that mirror the product architecture:

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
  vite-react/
  next-app-router/
docs/
  architecture/
  schema/
  integration/
  accessibility/
  migrations/
  security/
```

`packages/core` is framework-agnostic and owns schema contracts, traversal, submitted path parsing, dangerous-key rejection, condition evaluation, validation primitives, normalization, migration helpers, and diagnostics. It must not depend on React, React Hook Form, TanStack Query, drag-and-drop libraries, AJV, Zod, CSS, design-system components, upload providers, or transport code.

`packages/react-renderer` owns the public respondent renderer, field registry, slots, renderer hooks, step orchestration, accessibility wiring, and optional internal React Hook Form integration.

`packages/react-builder` owns the admin builder UI: palette, canvas/tree, inspector, schema editing commands, undo/redo, drag-and-drop behavior, preview using the real renderer, publish checks, and adapter-driven persistence.

`packages/validators` owns JSON Schema generation, AJV-related helpers, optional Zod helpers, compiler diagnostics, and backend-friendly validation artifacts. JSON Schema generation is not part of `core`.

`packages/adapters` owns thin helper clients for agreed JSON contracts. It must not define product behavior.

## React App Architecture

### Options Considered

- Feature-folder app only: fastest at the start, but package boundaries become blurry.
- Single app first, extract packages later: low initial friction, high later extraction cost.
- Package-first monorepo: more initial structure, but correct for a reusable form-builder product.

### Decision

Use package-first architecture from the beginning.

### Why It Fits

The product is not just one app. It is a set of reusable packages: a framework-agnostic core, a React renderer, a React builder, validators, adapters, themes, and examples. Package-first architecture keeps contracts honest and prevents React implementation details from leaking into backend-agnostic schema logic.

### When It Might Become Wrong

If the project is intentionally narrowed to a single private app that will never publish packages or embed into host apps, this structure may be heavier than needed.

## State Management

### Options Considered

- React Context and `useReducer`: useful for local or scoped state, but can create broad re-renders when used as a global editor store.
- Zustand: small, selector-based, suitable for builder/editor state.
- Redux Toolkit: strong tooling and predictability, but more ceremony.
- XState: excellent for explicit workflows and state machines, but too heavy for all editor state.

### Decision

Use separate state tools by responsibility:

- React local state for small component state.
- Zustand-style editor store for `react-builder` state such as selection, canvas state, UI mode, drag state, history, and command orchestration.
- TanStack Query for server/persistence state.
- React Hook Form only inside `react-renderer` where appropriate.
- Core domain state transitions should be implemented as pure functions and commands, not as React component logic.

### Why It Fits

A form builder has multiple different kinds of state. Builder schema editing, selected node state, drag state, undo/redo, draft persistence, and respondent form values should not all be managed by one tool. Separating them keeps responsibilities clear and makes the core runtime testable outside React.

### When It Might Become Wrong

If real-time collaboration, multiplayer editing, complex workflow automation, or explicit publish state machines become central, introduce dedicated workflow or collaboration primitives such as XState, CRDT-backed stores, or event-sourced command logs.

## React Hook Form Usage

### Options Considered

- Use React Hook Form everywhere: inappropriate for schema editor state.
- Avoid React Hook Form entirely: misses a strong renderer-performance tool.
- Use React Hook Form internally in the renderer only: best balance.

### Decision

React Hook Form may be used internally in `packages/react-renderer`, but it must be hidden behind this product's renderer API.

Public APIs must not expose React Hook Form types, resolvers, `FieldArray` APIs, or `formState`. Host applications should not be forced to use React Hook Form unless they opt into an explicit low-level integration.

### Why It Fits

Respondent form rendering benefits from efficient field registration and isolated updates. The admin builder, however, edits schema trees and metadata; that is not ordinary input form state.

### When It Might Become Wrong

If repeaters, hidden-field semantics, custom focus contracts, or renderer lifecycle requirements fight React Hook Form's model, prefer the product runtime contract over RHF and replace or reduce RHF usage.

## TanStack Query Usage

### Options Considered

- No server-state library: okay for toy examples, messy for drafts, revisions, publishing, async options, and submissions.
- SWR: small and useful for fetching, less complete for mutation-heavy workflows.
- TanStack Query: strong caching, mutations, invalidation, async status, and optimistic workflow support.

### Decision

Use TanStack Query for server/persistence state in builder adapters and examples.

Typical uses:

- `loadForm`
- `saveDraft`
- `publishRevision`
- `listRevisions`
- `loadPublishedForm`
- `submitForm`
- async option sources
- upload prepare/finalize helpers when uploads are specified

TanStack Query must not be required by `core`.

### Why It Fits

The builder and renderer will need clean handling for loading, saving, retries, conflicts, stale data, and mutation status. TanStack Query keeps this out of UI components and avoids hand-rolled cache logic.

### When It Might Become Wrong

If a host application has a strict server-state standard, adapters should allow integration without forcing TanStack Query as a public requirement.

## Drag-And-Drop Library

### Options Considered

- Native HTML drag-and-drop: weak touch, keyboard, and complex editor support.
- `react-dnd`: powerful but heavier.
- `dnd-kit`: modern React primitives, sortable patterns, extensible sensors, and good fit for builder UI.
- Atlassian pragmatic drag-and-drop: worth watching, but not the default baseline.

### Decision

Use `dnd-kit` for `packages/react-builder`, wrapped behind builder-specific drag abstractions.

Drag callbacks should call schema-editing commands. They must not directly mutate schema shape inside UI components.

### Why It Fits

The builder needs sortable fields, canvas insertion, palette-to-canvas insertion, keyboard-accessible movement, invalid-drop feedback, and future tree-like behavior. `dnd-kit` fits those needs without making drag-and-drop the architecture.

### When It Might Become Wrong

If nested tree editing becomes the dominant hard problem and another maintained library handles accessible tree DnD more safely, reassess the drag layer while preserving the command boundary.

## Form Schema And Data Model

### Options Considered

- JSON Schema as authoring source of truth.
- Custom canonical schema.
- Hybrid: custom canonical schema plus generated JSON Schema.

### Decision

Use a custom canonical form schema as the source of truth for authoring and rendering. Generate JSON Schema only as an optional backend-friendly artifact. Use JSON Schema Draft 2020-12 as the default dialect unless a later explicit compatibility decision changes it.

### Why It Fits

Builder UX, conditional logic, custom fields, steps, renderer slots, upload semantics, and metadata need a product schema. JSON Schema is valuable for backend structural validation and documentation, but it should not define UI behavior.

### When It Might Become Wrong

If the product becomes only an API-schema-driven renderer with minimal builder behavior, a JSON Schema-first architecture could be reconsidered.

## Validation Strategy

Use layered validation:

- Schema validation before save and publish.
- Client runtime validation from the canonical schema.
- Server validation independent of the frontend.
- Generated JSON Schema for submitted data where representable.
- Compiler diagnostics for unsupported JSON Schema generation.
- Custom validators and predicates registered by key and version.
- Unknown custom fields, validators, and predicates fail closed.

Validation logic belongs in `core` or `validators`, not inside React UI components.

## Component-Driven Architecture

### Decision

Yes, this project is explicitly component-driven in both architecture and design practice.

Use components as stable product boundaries, not just visual fragments:

- Renderer field components must follow a field contract and receive renderer-managed ids, accessibility state, value bindings, error state, required/disabled state, and focus behavior.
- Builder components must be composed from reusable surfaces such as palette item, canvas node, inspector section, property row, command button, empty state, loading state, and error state.
- Shared UI primitives should be reused consistently across packages.
- Feature components should delegate schema edits to commands and domain functions.
- The builder preview must use the real renderer instead of duplicating renderer behavior.

### Component Categories

- `ui` primitives: buttons, icon buttons, inputs, selects, panels, tabs, dialogs, tooltips, menus, empty/loading/error states.
- `renderer` components: field chrome, labels, descriptions, errors, progress, step navigation, field adapters.
- `builder` components: palette, canvas, tree, inspector, logic editor, preview, publish panels.
- `feature` components: cohesive user workflows composed from primitives and domain hooks.

### Reusable Component Rule

Create reusable components when they represent a stable product concept, repeated UI pattern, or accessibility-sensitive control. Avoid speculative abstraction before a pattern exists, but do not duplicate field chrome, panel shells, command controls, inspector rows, or state displays.

## Component Organization

Recommended `react-renderer` shape:

```text
packages/react-renderer/src/
  components/
  fields/
  registry/
  hooks/
  runtime/
  slots/
  accessibility/
  adapters/
  testing/
```

Recommended `react-builder` shape:

```text
packages/react-builder/src/
  app/
  features/
    palette/
    canvas/
    inspector/
    preview/
    publishing/
  components/
  hooks/
  state/
  commands/
  dnd/
  adapters/
  testing/
```

Recommended `core` shape:

```text
packages/core/src/
  schema/
  paths/
  traversal/
  conditions/
  validation/
  normalization/
  submissions/
  migrations/
  diagnostics/
  testing/
```

## Separation Of Domain Logic From UI

React components should not own domain rules. They should render state, collect user intent, and call commands or hooks.

Domain logic belongs in:

- `core` for framework-neutral schema/runtime behavior.
- `react-builder/commands` for editor commands that transform schemas.
- `react-renderer/runtime` for React-specific orchestration around core behavior.
- `validators` for JSON Schema and optional validator integrations.
- `adapters` for transport helpers only.

## Testing Strategy

Use these layers:

- Vitest for `core`, command functions, schema parsing, path grammar, validation, conditions, normalization, migrations, and diagnostics.
- React Testing Library for renderer and builder components.
- Playwright for builder flows, preview parity, drag-and-drop, keyboard workflows, and end-to-end examples.
- Accessibility checks with axe-compatible tooling for renderer and builder flows.
- Contract fixtures for schema validation, valid/invalid submissions, backend responses, compiler warnings, and conflict responses.
- Visual regression only for the default theme once there is a real visual system.

Rendered frontend changes must use `build-web-apps:frontend-testing-debugging` when practical, with the Browser plugin preferred when available.

## Performance And Scalability Rules

Use the Vercel React best-practices skills when writing, reviewing, or refactoring React/Next.js code:

- `$vercel-react-best-practices` at `/Users/mahdi/.agents/skills/vercel-react-best-practices/SKILL.md`
- `$build-web-apps:react-best-practices` at `/Users/mahdi/.codex/plugins/cache/openai-curated/build-web-apps/08373044/skills/react-best-practices/SKILL.md`

Apply their guidance especially for:

- avoiding async waterfalls
- keeping bundles small
- avoiding broad barrel imports
- dynamically loading heavy builder-only features
- using selectors and derived state to reduce re-renders
- avoiding inline component definitions
- keeping expensive calculations memoized at the right boundary
- using `startTransition` or deferred values for non-urgent UI updates
- keeping server/client data serialization small in Next.js examples

## Design System Readiness

Do not create the full design system as part of these React architecture decisions.

Prepare for the future design system by:

- using headless or minimally styled primitives
- centralizing reusable UI components
- supporting slots in the renderer
- exposing CSS variables, class hooks, and data attributes where appropriate
- avoiding hard-coded product styling in domain components
- keeping visual styling out of `core`
- making accessibility contracts part of component APIs

When the project is ready to define the design system, use the `design-md-creator` skill at `/Users/mahdi/.codex/skills/design-md-creator/SKILL.md` to create or upgrade a project-level `DESIGN.md`.

## Libraries And Patterns To Avoid

Avoid:

- React dependencies in `core`.
- React components, executable JavaScript, or backend-specific assumptions in persisted schemas.
- Exposing React Hook Form as the public renderer contract.
- Using JSON Schema as the authoring source of truth.
- Duplicating renderer logic inside builder preview.
- Putting schema mutation rules directly inside components or drag callbacks.
- Making TanStack Query required for framework-agnostic packages.
- Adding a heavyweight design system before the design-system decision.
- Implementing repeaters or upload orchestration before their contracts are specified.
- Hiding unknown custom validators, predicates, or unsupported compiler behavior.
- Broad barrel imports that make package boundaries and bundles harder to reason about.

## Skill Usage Rules

Future agents should use these skills when relevant:

- `$vercel-react-best-practices` for React/Next.js code, performance, data fetching, bundle size, and component refactors.
- `$build-web-apps:react-best-practices` for React/Next.js implementation and review inside Build Web Apps workflows.
- `$build-web-apps:frontend-testing-debugging` for rendered frontend validation, UI regression checks, browser screenshots, console checks, responsive QA, and interaction proof.
- `design-md-creator` later, when creating or upgrading the project design system and `DESIGN.md`.
- `form-builder-ux-reviewer` for creator UX decisions.
- `form-builder-ui-reviewer` for visual UI quality decisions.

