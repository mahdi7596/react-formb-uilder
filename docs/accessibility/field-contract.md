# Field Accessibility Contract

Renderer fields and builder field previews must preserve accessible names, descriptions, errors, required state, disabled state, and focus behavior. This applies to built-in fields and custom field registry entries.

## Renderer-Managed Props

Custom field renderers receive `RendererFieldProps` from `@your-org/forms-react-renderer`:

- `ids.inputId`
- `ids.labelId`
- `ids.descriptionId`
- `ids.errorId`
- `label`
- `description`
- `required`
- `disabled`
- `errors`
- `focusRef`
- `value`
- `options`
- `onChange`
- `onBlur`

Custom controls must use these props rather than inventing separate ids or unmanaged focus targets.

## Labels And Descriptions

Every visible input must have an accessible name. Prefer:

- native `<label htmlFor={ids.inputId}>`
- `aria-labelledby={ids.labelId}`
- group semantics for radio and checkbox groups

Descriptions should be referenced with `aria-describedby` when present. If a field has both description and error text, include both ids in the described-by list.

## Errors

When a field has errors:

- set `aria-invalid="true"` on the control or group
- reference `ids.errorId`
- render visible error text
- keep the field focus target stable so first-invalid focus works

Error text must not rely only on color. The default theme also adds borders and inset cues for invalid fields.

## Required And Disabled

Required fields should expose native `required` where applicable and visible required context in field chrome. Disabled fields should use native `disabled` for controls where possible and preserve the canonical hidden/disabled submission semantics from core.

## Group Fields

Radio groups, checkbox groups, consent groups, and similar grouped controls should use:

- `<fieldset>` and `<legend>`, or
- `role="group"` / `role="radiogroup"` with an accessible name

Each option must have its own label.

## Hidden Fields

Hidden fields may render an `<input type="hidden">` but should not create confusing visible controls. Hidden values are excluded from final submission unless schema settings explicitly preserve them.

## Custom Field Example

```tsx
import type { RendererFieldProps } from "@your-org/forms-react-renderer";

export function CurrencyField(props: RendererFieldProps) {
  const describedBy = [
    props.description ? props.ids.descriptionId : "",
    props.errors.length ? props.ids.errorId : ""
  ].filter(Boolean).join(" ") || undefined;

  return (
    <input
      ref={props.focusRef as React.Ref<HTMLInputElement>}
      id={props.ids.inputId}
      aria-labelledby={props.ids.labelId}
      aria-describedby={describedBy}
      aria-invalid={props.errors.length > 0 ? "true" : "false"}
      required={props.required}
      disabled={props.disabled}
      value={typeof props.value === "string" ? props.value : ""}
      onBlur={props.onBlur}
      onChange={(event) => props.onChange(event.currentTarget.value)}
      inputMode="decimal"
      className="rfb-input"
    />
  );
}
```

The schema stores `fieldType: "currency"` only. The React component lives in host code and is registered through the renderer field registry.

## Direction And Motion

Forms may render in LTR or RTL. Human language should follow the schema or host direction. Technical values such as submitted paths, JSON, ids, URLs, and emails should remain LTR for readability.

Respect reduced-motion preferences. Default theme helpers include reduced-motion CSS; custom components should avoid essential animation-only feedback.

## Related Docs

- [React renderer integration](../integration/react-renderer.md)
- [Canonical schema](../schema/canonical-schema-v1.md)
- [Hidden value semantics](../schema/hidden-value-semantics-v1.md)
- [Backend response](../schema/backend-response-v1.md)
- [Schema and submission safety](../security/schema-and-submission-safety.md)
