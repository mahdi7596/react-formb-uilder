# React Renderer Integration

Use `@your-org/forms-react-renderer` when a host React app needs to render a published canonical schema and submit a normalized envelope.

## First Render

```tsx
import { FormRenderer, createRendererStyles } from "@your-org/forms-react-renderer";
import type { BackendResponse, SubmissionEnvelope } from "@your-org/forms-core";

export function PublicForm({ schema }: { schema: Record<string, unknown> }) {
  async function submit(envelope: SubmissionEnvelope): Promise<BackendResponse> {
    const response = await fetch("/api/forms/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(envelope)
    });
    return response.json() as Promise<BackendResponse>;
  }

  return (
    <>
      <style>{createRendererStyles()}</style>
      <FormRenderer schema={schema} onSubmit={submit} />
    </>
  );
}
```

The renderer accepts a canonical schema-like object and normalizes runtime behavior through `@your-org/forms-core`. It creates submission envelopes with `formId`, `revisionId`, `revisionHash`, `schemaVersion`, `submissionAttemptId`, `submittedAt`, `locale`, `data`, `files`, and `meta`.

## Submission Adapter

`onSubmit` receives a product-owned `SubmissionEnvelope`. It may return:

- a normalized `BackendResponse`
- an adapter result containing `SubmitFormData`
- `void` for host-controlled success handling

The renderer maps normalized backend statuses to UI state:

- `success`
- `validation_error`
- `server_error`
- `auth_error`
- `rate_limited`
- `conflict`

Field errors should use submitted paths from the backend response contract. Global messages appear in `.rfb-messages`.

## Validation And Focus

The renderer uses core validation primitives for visible, enabled fields. When validation fails, it focuses the first invalid registered field target and exposes:

- `aria-invalid`
- error text referenced by accessible attributes
- `.rfb-field[data-rfb-invalid="true"]`
- `.rfb-error`

Hidden or disabled values are filtered according to the canonical hidden-value policy unless the schema explicitly preserves hidden values.

## Styling And Theme Options

Default styling is optional:

```tsx
import { createRendererStyles } from "@your-org/forms-react-renderer";
import { createRendererThemeStyles } from "@your-org/forms-themes";
```

Use `createRendererStyles()` for package default styles, import `@your-org/forms-themes` directly for scoped variables, or replace styling entirely through stable hooks.

Stable class hooks include:

- `.rfb-form`
- `.rfb-field`
- `.rfb-label`
- `.rfb-description`
- `.rfb-error`
- `.rfb-section`
- `.rfb-step`
- `.rfb-messages`
- `.rfb-navigation`
- `.rfb-submit-button`

Stable data attributes include:

- `data-rfb-field-type`
- `data-rfb-invalid`
- `data-rfb-disabled`
- `data-rfb-submission-status`
- `data-rfb-current-step`

## Field Registry Overrides

Custom field rendering is registered in React code, not persisted in the schema. The schema stores a string key such as `fieldType: "currency"`, while the host supplies a renderer for that key.

```tsx
import type { FieldRegistry, RendererFieldProps } from "@your-org/forms-react-renderer";

function CurrencyField(props: RendererFieldProps) {
  return (
    <input
      ref={props.focusRef as React.Ref<HTMLInputElement>}
      id={props.ids.inputId}
      aria-labelledby={props.ids.labelId}
      aria-describedby={[props.description ? props.ids.descriptionId : "", props.errors.length ? props.ids.errorId : ""]
        .filter(Boolean)
        .join(" ") || undefined}
      aria-invalid={props.errors.length > 0 ? "true" : "false"}
      required={props.required}
      disabled={props.disabled}
      value={typeof props.value === "string" ? props.value : ""}
      onBlur={props.onBlur}
      onChange={(event) => props.onChange(event.currentTarget.value)}
      className="rfb-input"
      inputMode="decimal"
    />
  );
}

const registry: Partial<FieldRegistry> = {
  currency: CurrencyField
};

<FormRenderer schema={schema} registry={registry} />;
```

Custom fields must preserve renderer-managed ids, labels, descriptions, error references, disabled/required state, values, and focus refs. Do not expose React Hook Form types or store React components in schemas.

## Slots

Slots let hosts replace chrome without owning core behavior:

- `Form`
- `Section`
- `Step`
- `FieldChrome`
- `Messages`
- `Navigation`

Slots receive product-owned props. They should render accessible UI and call provided navigation/submit callbacks rather than bypassing renderer validation or submission behavior.

## Related Docs

- [Field accessibility contract](../accessibility/field-contract.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
- [Submission envelope](../schema/submission-envelope-v1.md)
- [Backend response](../schema/backend-response-v1.md)
- [Hidden value semantics](../schema/hidden-value-semantics-v1.md)
