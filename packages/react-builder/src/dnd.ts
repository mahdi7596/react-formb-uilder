import type { AddNodeInput, BuilderNode, BuilderSchema, MoveNodeInput } from "./index.js";

export type BuilderDragSourceType = "palette-template" | "canvas-node";
export type BuilderDropTargetType = "canvas-root" | "canvas-node" | "unsupported";
export type BuilderDropPosition = "before" | "after" | "inside";

export interface PaletteTemplateDragPayload {
  type: "palette-template";
  fieldType: string;
  label: string;
  createNode: (context: { schema: BuilderSchema; index: number }) => BuilderNode;
}

export interface CanvasNodeDragPayload {
  type: "canvas-node";
  nodeId: string;
  label: string;
}

export type BuilderDragPayload = PaletteTemplateDragPayload | CanvasNodeDragPayload;

export interface CanvasRootDropTarget {
  type: "canvas-root";
  position?: number;
}

export interface CanvasNodeDropTarget {
  type: "canvas-node";
  nodeId: string;
  position: Exclude<BuilderDropPosition, "inside">;
}

export interface UnsupportedDropTarget {
  type: "unsupported";
  reason: string;
}

export type BuilderDropTarget = CanvasRootDropTarget | CanvasNodeDropTarget | UnsupportedDropTarget;

export type BuilderDndIntent =
  | {
      kind: "addNode";
      input: AddNodeInput;
      insertedNodeId: string;
      announcement: string;
    }
  | {
      kind: "moveNode";
      input: MoveNodeInput;
      announcement: string;
    }
  | {
      kind: "invalid";
      reason: string;
      announcement: string;
    }
  | {
      kind: "noop";
      reason: string;
      announcement: string;
    };

export const CANVAS_ROOT_DROP_ID = "canvas:root";
const PALETTE_PREFIX = "palette:";
const CANVAS_NODE_PREFIX = "canvas-node:";
const CANVAS_DROP_PREFIX = "canvas-drop:";

export function paletteDragId(fieldType: string): string {
  return `${PALETTE_PREFIX}${fieldType}`;
}

export function canvasNodeDragId(nodeId: string): string {
  return `${CANVAS_NODE_PREFIX}${nodeId}`;
}

export function canvasNodeDropId(nodeId: string, position: Exclude<BuilderDropPosition, "inside">): string {
  return `${CANVAS_DROP_PREFIX}${nodeId}:${position}`;
}

export function isPaletteDragId(id: string): boolean {
  return id.startsWith(PALETTE_PREFIX);
}

export function isCanvasNodeDragId(id: string): boolean {
  return id.startsWith(CANVAS_NODE_PREFIX);
}

export function isCanvasNodeDropId(id: string): boolean {
  return id.startsWith(CANVAS_DROP_PREFIX);
}

export function parseCanvasNodeDropId(id: string): CanvasNodeDropTarget | null {
  if (!isCanvasNodeDropId(id)) {
    return null;
  }
  const parts = id.slice(CANVAS_DROP_PREFIX.length).split(":");
  const nodeId = parts[0];
  const position = parts[1];
  if (!nodeId || (position !== "before" && position !== "after")) {
    return null;
  }
  return { type: "canvas-node", nodeId, position };
}

export function resolveDropTarget(id: string | null | undefined): BuilderDropTarget {
  if (!id) {
    return { type: "unsupported", reason: "No drop target is active." };
  }
  if (id === CANVAS_ROOT_DROP_ID) {
    return { type: "canvas-root" };
  }
  const canvasNodeTarget = parseCanvasNodeDropId(id);
  if (canvasNodeTarget) {
    return canvasNodeTarget;
  }
  return { type: "unsupported", reason: "This drop target is not supported." };
}

export function resolveDndIntent(
  schema: BuilderSchema,
  source: BuilderDragPayload | null | undefined,
  target: BuilderDropTarget
): BuilderDndIntent {
  if (!source) {
    return invalidIntent("No drag source is active.");
  }
  if (target.type === "unsupported") {
    return invalidIntent(target.reason);
  }
  if (source.type === "palette-template") {
    return createPaletteAddIntent(schema, source, target);
  }
  return createCanvasMoveIntent(schema, source, target);
}

export function createPaletteAddIntent(
  schema: BuilderSchema,
  source: PaletteTemplateDragPayload,
  target: CanvasRootDropTarget | CanvasNodeDropTarget
): BuilderDndIntent {
  const editableNodes = rootEditableNodes(schema);
  const position = target.type === "canvas-root"
    ? target.position ?? editableNodes.length
    : positionForCanvasTarget(editableNodes, target);
  if (position < 0) {
    return invalidIntent(`Cannot insert ${source.label} at this position.`);
  }
  const node = source.createNode({ schema, index: schema.nodes.length });
  return {
    kind: "addNode",
    input: { node, position },
    insertedNodeId: node.id,
    announcement: `${source.label} inserted at position ${position + 1}.`
  };
}

export function createCanvasMoveIntent(
  schema: BuilderSchema,
  source: CanvasNodeDragPayload,
  target: CanvasRootDropTarget | CanvasNodeDropTarget
): BuilderDndIntent {
  const editableNodes = rootEditableNodes(schema);
  const currentIndex = editableNodes.findIndex((node) => node.id === source.nodeId);
  if (currentIndex === -1) {
    return invalidIntent(`${source.label} is no longer available on the canvas.`);
  }
  const rawTargetPosition = target.type === "canvas-root"
    ? target.position ?? editableNodes.length
    : positionForCanvasTarget(editableNodes, target);
  if (rawTargetPosition < 0) {
    return invalidIntent(`Cannot move ${source.label} to this target.`);
  }
  const positionAfterRemoval = rawTargetPosition > currentIndex ? rawTargetPosition - 1 : rawTargetPosition;
  if (positionAfterRemoval === currentIndex) {
    return {
      kind: "noop",
      reason: "The field was dropped in its current position.",
      announcement: `${source.label} stayed in the same position.`
    };
  }
  return {
    kind: "moveNode",
    input: { nodeId: source.nodeId, position: positionAfterRemoval },
    announcement: `${source.label} moved to position ${positionAfterRemoval + 1}.`
  };
}

export function rootEditableNodes(schema: BuilderSchema): BuilderNode[] {
  const childIds = new Set(schema.nodes.flatMap((node) => node.children ?? []));
  return schema.nodes.filter((node) => !childIds.has(node.id) && isEditableCanvasNode(node));
}

function isEditableCanvasNode(node: BuilderNode): boolean {
  return node.type === "field" || node.type === "hidden" || node.type === "content" || node.type === "section" || node.type === "step" || node.type === "ending";
}

function positionForCanvasTarget(
  editableNodes: BuilderNode[],
  target: CanvasNodeDropTarget
): number {
  const targetIndex = editableNodes.findIndex((node) => node.id === target.nodeId);
  if (targetIndex === -1) {
    return -1;
  }
  return target.position === "before" ? targetIndex : targetIndex + 1;
}

function invalidIntent(reason: string): BuilderDndIntent {
  return {
    kind: "invalid",
    reason,
    announcement: reason
  };
}
