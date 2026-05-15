import { describe, expect, it } from "vitest";

import {
  CANVAS_ROOT_DROP_ID,
  canvasNodeDropId,
  canvasNodeDragId,
  createCanvasMoveIntent,
  createPaletteAddIntent,
  paletteDragId,
  parseCanvasNodeDropId,
  resolveDndIntent,
  resolveDropTarget,
  rootEditableNodes,
  type CanvasNodeDragPayload,
  type PaletteTemplateDragPayload
} from "./dnd.js";
import type { BuilderSchema } from "./index.js";

const schema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "dnd_test",
  revisionId: "rev_draft",
  revisionHash: "sha256:dnd",
  status: "draft",
  locale: "en",
  title: "DnD test",
  nodes: [
    { id: "field_name", type: "field", fieldType: "text", name: "name", label: "Name" },
    { id: "field_email", type: "field", fieldType: "email", name: "email", label: "Email" },
    { id: "field_plan", type: "field", fieldType: "select", name: "plan", label: "Plan" }
  ]
};

const paletteSource: PaletteTemplateDragPayload = {
  type: "palette-template",
  fieldType: "email",
  label: "Email",
  createNode: ({ index }) => ({
    id: `field_email_${index + 1}`,
    type: "field",
    fieldType: "email",
    name: `email_${index + 1}`,
    label: "Email",
    validation: []
  })
};

const canvasSource: CanvasNodeDragPayload = {
  type: "canvas-node",
  nodeId: "field_name",
  label: "Name"
};

describe("builder dnd ids and targets", () => {
  it("creates stable ids and parses canvas drop ids", () => {
    expect(paletteDragId("email")).toBe("palette:email");
    expect(canvasNodeDragId("field_email")).toBe("canvas-node:field_email");
    expect(canvasNodeDropId("field_email", "before")).toBe("canvas-drop:field_email:before");
    expect(parseCanvasNodeDropId("canvas-drop:field_email:after")).toEqual({
      type: "canvas-node",
      nodeId: "field_email",
      position: "after"
    });
    expect(resolveDropTarget(CANVAS_ROOT_DROP_ID)).toEqual({ type: "canvas-root" });
    expect(resolveDropTarget("unknown")).toEqual({ type: "unsupported", reason: "This drop target is not supported." });
  });
});

describe("builder dnd intent resolution", () => {
  it("keeps palette and canvas payloads separate", () => {
    expect(paletteSource.type).toBe("palette-template");
    expect(canvasSource.type).toBe("canvas-node");
    expect(rootEditableNodes(schema).map((node) => node.id)).toEqual(["field_name", "field_email", "field_plan"]);
  });

  it("converts valid palette drops into add-node inputs", () => {
    const intent = createPaletteAddIntent(schema, paletteSource, { type: "canvas-node", nodeId: "field_email", position: "before" });

    expect(intent.kind).toBe("addNode");
    if (intent.kind !== "addNode") {
      throw new Error("Expected add-node intent.");
    }
    expect(intent.input.position).toBe(1);
    expect(intent.input.node.id).toBe("field_email_4");
    expect(intent.insertedNodeId).toBe("field_email_4");
    expect(intent.announcement).toContain("position 2");
  });

  it("converts valid canvas drops into move-node inputs", () => {
    const intent = createCanvasMoveIntent(schema, canvasSource, { type: "canvas-node", nodeId: "field_plan", position: "after" });

    expect(intent.kind).toBe("moveNode");
    if (intent.kind !== "moveNode") {
      throw new Error("Expected move-node intent.");
    }
    expect(intent.input).toEqual({ nodeId: "field_name", position: 2 });
    expect(intent.announcement).toContain("position 3");
  });

  it("detects no-op reorder without producing move input", () => {
    const intent = createCanvasMoveIntent(schema, canvasSource, { type: "canvas-node", nodeId: "field_email", position: "before" });

    expect(intent.kind).toBe("noop");
    expect(intent.announcement).toContain("same position");
  });

  it("classifies invalid drops without schema mutation intent", () => {
    const intent = resolveDndIntent(schema, paletteSource, resolveDropTarget("unsupported:target"));

    expect(intent.kind).toBe("invalid");
    expect(intent.announcement).toBe("This drop target is not supported.");
  });
});
