# React Builder Integration

Use `@your-org/forms-react-builder` when a host admin app needs a visual authoring surface for canonical schemas.

## First Embed

```tsx
import {
  BuilderWorkspace,
  buildPublishChecklist,
  createPersistenceState,
  type BuilderSchema
} from "@your-org/forms-react-builder";
import { createBuilderArtifactBundle } from "@your-org/forms-validators";

export function AdminBuilder({ schema }: { schema: BuilderSchema }) {
  const artifactBundle = createBuilderArtifactBundle(schema);
  const publishChecklist = buildPublishChecklist({ schema, artifactBundle });

  return (
    <BuilderWorkspace
      schema={schema}
      persistenceState={createPersistenceState("idle")}
      publishChecklist={publishChecklist}
      artifactBundle={artifactBundle}
      onSaveDraft={(nextSchema) => {
        // Call your host adapter here.
        console.log(nextSchema.revisionId);
      }}
      onPublish={(nextSchema) => {
        // Publish through normalized backend contracts.
        console.log(nextSchema.revisionHash);
      }}
    />
  );
}
```

`BuilderWorkspace` renders the command bar, workflow panels, palette, canvas, inspector, drag-and-drop layer, and preview. Preview uses the real public renderer instead of duplicate builder-only field rendering.

## Palette And Structured Options

The builder palette includes the MVP-hardening fields currently supported by the product contracts, including text, long text, email, phone, URL, number, date, time, dropdown, radio group, checkbox group, checkbox, switch, rating, linear scale, hidden field, read-only value, and file metadata.

Choice-like fields use structured option editing instead of raw `label=value` text:

- labels are creator-facing and can later be localized
- submitted values are stable backend contracts
- options can be added, duplicated, deleted, reordered, disabled, and bulk pasted
- default values use option submitted values rather than labels
- dangerous option-value changes surface through command diagnostics

Bulk paste accepts either one label per line or `label=value` pairs. The builder generates unique option ids and submitted values when needed.

## Production Templates And Examples

The Vite example under `examples/vite-react` now demonstrates production-style templates instead of a toy-only harness:

- English customer intake with content blocks, structured options, consent, hidden metadata, and an ending screen.
- Persian RTL customer intake with Iran province/city option presets. These are example-level options, not hard-coded regional data in `packages/core`.
- Multi-step project request with sections and current-step validation.
- Visual logic example using safe declarative conditions for visibility and requiredness.
- Renderer-only embed mode that mounts `FormRenderer` without the builder surface.

Use the example as a host integration reference for real-renderer preview parity, normalized fake backend submissions, and owner review of visible output.

## Visual Validation And Logic

The inspector includes field-aware validation controls for common rules. Creators can configure requiredness, text length, numeric min/max values, pattern matching, email/URL format checks, and checkbox-group min/max selections without editing raw schema JSON.

The logic panel supports the first safe visual logic workflows:

- show a field when AND/OR conditions match
- hide a field when AND/OR conditions match
- require a field only when AND/OR conditions match
- inspect the generated condition JSON as read-only debug output

Phase 16 logic writes the existing declarative condition model. Unsupported logic such as skip routing, redirects, calculations, scoring, conditional option filtering, and branching is intentionally shown as unsupported until later contracts define it.

## Command Boundary

Schema edits must flow through command/store behavior. UI components should collect creator intent and call commands such as:

- `addNode`
- `deleteNode`
- `duplicateNode`
- `moveNode`
- `updateLabel`
- `updateSubmittedName`
- `updateValidation`
- `updateCondition`
- `updateOptions`
- `updateNodeProperties`

Commands return a result containing the next schema, changed flag, command name, and diagnostics. This keeps dangerous-change warnings testable outside React.

## Persistence And Publish Inputs

Host apps provide persistence and publish behavior through callbacks and normalized data:

- `persistenceState`: idle, loading, dirty, saving, saved, failed, conflicted, or blocked state for creator feedback
- `publishChecklist`: publish blockers and warnings
- `artifactBundle`: JSON Schema, compiler diagnostics, validation plan, condition dependencies, and fixture references from `@your-org/forms-validators`
- `latestPublishedRevision`: immutable published revision metadata
- `onSaveDraft`, `onRetrySave`, `onReloadLatest`, `onPreserveLocalEdits`, `onPublish`

Backend transport stays outside the builder package. Use `@your-org/forms-adapters` contracts to normalize host behavior.

## Creator Workflow States

The builder exposes visible surfaces for:

- draft loading
- dirty edits
- saving
- saved confirmation
- failed save
- stale draft conflict
- reload latest
- preserve local edits
- publish blockers
- publish warnings
- publish success
- generated artifacts
- revision warnings

These states should be driven by host adapter results and builder diagnostics, not raw transport exceptions.

## Theme And Host Styling

`BuilderWorkspace` injects package default styles through `createBuilderStyles()` and renderer preview styles. Hosts can override `--rfb-*` variables with `className`:

```tsx
<BuilderWorkspace className="admin-builder" schema={schema} />
```

```css
.admin-builder {
  --rfb-color-primary: #087568;
  --rfb-component-builder-canvas-max-width: 820px;
}
```

Stable hooks include:

- `.rfb-builder`
- `.rfb-command-bar`
- `.rfb-workflow-panels`
- `.rfb-palette`
- `.rfb-canvas-region`
- `.rfb-inspector`
- `.rfb-node`
- `.rfb-drag-handle`
- `.rfb-drop-zone`
- `.rfb-drop-feedback`
- `.rfb-alert`
- `.rfb-badge`
- `.rfb-tab`

Stable attributes include:

- `data-active-panel`
- `data-can-publish`
- `data-dragging`
- `data-drop-active`
- `data-status`
- `data-severity`
- `aria-selected`

## Direction And Technical Values

The builder is RTL-aware and uses logical CSS. Technical values such as submitted paths, schema ids, revision ids, URLs, and JSON should remain LTR for readability inside RTL screens.

## Related Docs

- [Backend contracts](backend-contracts.md)
- [JSON Schema generation](json-schema-generation.md)
- [Revisions and dangerous changes](../migrations/revisions-and-dangerous-changes.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
- [Theme package](../../packages/themes/README.md)
