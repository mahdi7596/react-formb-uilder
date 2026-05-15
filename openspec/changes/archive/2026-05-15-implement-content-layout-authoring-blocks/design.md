# Design

## Scope

Phase 18 turns existing reserved node contracts into usable MVP-grade authoring and runtime behavior.

## Schema Model

Supported Phase 18 nodes:

- `content` with `contentType`:
  - `heading`
  - `paragraph`
  - `image`
  - `divider`
  - `spacer`
  - `welcome`
- `section` container with `children`
- `step` container with `children`
- `ending` screen node

All node data remains plain JSON. Content nodes do not have submitted paths. Image data is stored in `props.src`, `props.alt`, and optional `props.caption`.

## Renderer

The renderer will render:

- headings with semantic heading tags, clamped to levels 2-6
- paragraphs as text blocks
- images with required `alt`
- dividers as `hr`
- spacers as decorative layout blocks
- welcome screens as accessible sections
- ending screens after successful submission
- sections and steps in canonical child order

Builder preview continues to use `FormRenderer`.

## Builder

The builder palette gains Content and Layout groups. Canvas root ordering includes fields, hidden nodes, content blocks, sections, steps, and endings. Inspector content settings adapt to each node type:

- heading/welcome/ending: title and description
- paragraph: body text
- image: source URL, alt text, caption
- spacer: height
- section/step: label and description

Data tab does not expose submitted path editing for non-submittable nodes.

## Validation

Core schema analysis emits an accessibility diagnostic when:

- image nodes have no non-empty alt text
- heading/welcome/ending nodes have no readable label/text/title

JSON Schema compiler ignores non-submittable content/layout nodes.

