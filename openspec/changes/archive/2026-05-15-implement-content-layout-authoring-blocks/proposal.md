# Implement Content Layout Authoring Blocks

## Summary

Implement Phase 18 from the product-completion master plan: content, layout, welcome, ending, section, and page/step blocks that make authored forms feel like real forms instead of only input lists.

## Problem

The canonical contracts already reserve content/layout node types, but the current product still behaves like an input-only builder in important places:

- Content blocks are not first-class palette items.
- The renderer fails closed for content and ending nodes instead of rendering supported blocks.
- The builder canvas only shows field and hidden nodes.
- Non-submittable nodes still expose submitted-path editing surfaces.
- Image alt text and other accessible content requirements are not surfaced clearly.

## Goals

- Add heading, paragraph/text, divider, spacer, image, welcome screen, ending screen, section, and page/step authoring blocks.
- Render supported content/layout nodes in the real renderer and builder preview.
- Keep content/layout nodes non-submittable and JSON-serializable.
- Surface accessible-content diagnostics for image alt text and required content labels.
- Preserve package boundaries and canonical-schema source of truth.

## Non-Goals

- Rich text, HTML embeds, PDF viewers, payments, uploads, repeaters, or calculations.
- Full nested drag-and-drop tree editing.
- A full i18n framework for every new string.
- Backend persistence changes.

