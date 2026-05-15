# Design

## Template Set

The example app will expose production-looking modes:

- English customer intake with content blocks, structured options, consent, hidden campaign source, and ending screen.
- Persian RTL customer intake with Persian labels, Iran province/city select examples, Persian submit strings, and RTL layout.
- Multi-step project request with sections and current-step validation.
- Logic example demonstrating conditional visibility and conditional requiredness without raw JSON editing.
- Renderer-only embed mode focused on public rendering without builder workflow noise.

## Boundaries

Province/city stays an example schema option list. The core package will not receive regional datasets or backend-specific geographic assumptions.

Renderer-only embed mode uses `FormRenderer` directly with fake normalized submission behavior. Builder mode still uses `BuilderWorkspace` and preview still uses the real renderer.

## Testing

Playwright coverage will check:

- Realistic English submission envelope.
- Persian RTL intake output and stable submitted values.
- Structured options appear in renderer and builder preview.
- Logic field appears/hides through the real renderer.
- Renderer-only embed mode does not require the builder surface.

