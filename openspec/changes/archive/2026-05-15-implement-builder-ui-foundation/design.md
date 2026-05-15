## Context

The project is a package-first, backend-agnostic React form builder. `packages/core` owns canonical schema contracts and runtime logic without React. `packages/react-renderer` owns respondent rendering. Phase 7 added `packages/react-builder` command and editor-store APIs for schema editing, diagnostics, UI state, and undo/redo, but intentionally did not add visual builder UI.

Phase 8 is the first creator-facing surface. It must follow `DESIGN.md`, remain RTL-first, and use the Phase 7 commands/store as the only schema mutation boundary. The owner should be able to manually review the builder output after this phase and decide whether visual or UX corrections are needed before drag-and-drop work starts.

The repository also contains unfinished Phase 6 example edits under `examples/vite-react` and related lockfile/config changes. Those changes are out of scope for Phase 8 unless explicitly brought back by the owner.

## Goals / Non-Goals

**Goals:**

- Build the first usable `packages/react-builder` visual workspace: command bar, right palette, center canvas, left inspector, and preview mode.
- Provide package-local reusable UI primitives that follow the provisional tokens and component roles in `DESIGN.md`.
- Let a creator build a simple form through click-add, canvas selection, inline label editing, quick actions, and inspector edits.
- Route all schema-changing UI behavior through Phase 7 builder commands and editor-store actions.
- Render builder preview with the real `packages/react-renderer` renderer.
- Cover desktop, tablet, and mobile layouts with RTL-first behavior and accessibility-friendly keyboard/focus paths.
- Add tests, browser checks, reviewer-skill review, screenshots, and a phase report.

**Non-Goals:**

- Drag-and-drop insertion or reordering. Phase 9 owns dnd-kit and accessible drag workflows.
- Persistence, revisions, save/publish backends, TanStack Query adapter flows, or conflict handling.
- A finalized product brand or full design system. This phase uses the provisional `DESIGN.md` tokens and local primitives.
- New canonical schema contracts, validators, migrations, uploads, repeaters, or backend conformance behavior.
- Using React Hook Form for builder schema editing.
- Refactoring or completing the dirty Phase 6 `examples/vite-react` work.

## Decisions

### Build UI in `packages/react-builder` as package components

The builder workspace should be implemented as exportable React package components rather than only as an example app. A host app or future example can mount the builder shell, while tests can exercise the same package surface.

Alternatives considered:

- Build only inside `examples/vite-react`: faster to inspect but blurs package ownership and conflicts with unfinished Phase 6 example changes.
- Build only isolated primitives without a shell: safer but would not meet the phase exit criteria for manual creator review.

### Use a thin package-local preview or test harness for browser verification

Phase 8 needs Playwright and Browser-plugin verification. If no clean app surface exists, implementation should add a minimal package-local harness for the builder UI that is not part of public package behavior. This avoids mixing Phase 8 with the unfinished Phase 6 example app.

Alternatives considered:

- Reuse `examples/vite-react`: useful later, but currently dirty from Phase 6 and should not be pulled into this proposal.
- Skip browser verification: insufficient for a visual builder shell.

### Keep schema edits behind commands and store actions

Palette click-add, canvas quick actions, inline label editing, and inspector fields must call the Phase 7 commands through the editor store. React components can own transient UI state such as text input drafts, open menus, or active responsive drawer state, but they must not directly mutate canonical schema objects.

Alternatives considered:

- Mutate local schema objects in components and sync later: faster initially but creates a second mutation path and undermines undo/redo and diagnostics.
- Put more domain logic into React hooks: convenient for UI, but violates the architecture rule that domain invariants stay out of React components.

### Preview uses `packages/react-renderer`

Builder preview must mount the real renderer with the current editor schema. Canvas authoring blocks can have builder-specific chrome, but preview cannot duplicate respondent field behavior.

Alternatives considered:

- Rebuild preview fields inside builder: visually faster but would drift from runtime behavior.
- Delay preview: simpler, but the owner specifically needs visible output and preview parity before later workflows.

### Add primitives that are stable product concepts, not a heavyweight UI framework

Phase 8 should create package-local primitives for common controls and states listed in `DESIGN.md`: buttons, icon buttons, inputs, textareas, selects, panels, tabs, tooltips, menus, empty/loading/error states, inspector rows, field chrome, labels, descriptions, and validation messages. These primitives should expose semantic props, data attributes, class hooks, logical CSS properties, and accessible names while avoiding a full external design-system dependency.

Alternatives considered:

- Add a large component library: accelerates UI but violates the current design-system readiness rule.
- Inline every control in feature components: avoids abstraction but creates immediate duplication and accessibility drift.

### Responsive behavior starts pragmatic

Desktop is the primary experience with top command bar, right palette, center canvas, and left inspector. Tablet should collapse the inspector into a drawer or sheet while keeping component discovery available. Mobile should favor preview, field ordering, and quick-edit flows rather than forcing the dense three-panel layout into a narrow viewport.

Alternatives considered:

- Desktop-only first: easier, but Phase 8 explicitly requires responsive behavior.
- Fully equal mobile editor: too much scope before core desktop authoring and drag-and-drop exist.

## Risks / Trade-offs

- [Risk] The UI may depend on command behavior that is still coarse from Phase 7. -> Mitigation: keep UI interactions narrow, use existing commands first, and add only command-level behavior that is required and covered by tests.
- [Risk] Preview may expose renderer limitations from Phase 5. -> Mitigation: treat renderer gaps as documented limitations unless they block preview mounting; do not duplicate renderer behavior in builder.
- [Risk] Package-local styling may drift from future design-system decisions. -> Mitigation: use `DESIGN.md` tokens, CSS variables, data attributes, and small primitives so later design-system extraction is straightforward.
- [Risk] Browser verification needs a runnable surface while the main example is dirty. -> Mitigation: use a minimal package-local harness or a clean dedicated builder preview surface and document it in the phase report.
- [Risk] Adding many primitives at once could over-abstract. -> Mitigation: implement primitives only where the shell, palette, canvas, inspector, or preview actually uses them.
