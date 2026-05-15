import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  FormRenderer,
  createRendererStyles,
  type RendererSchema
} from "@your-org/forms-react-renderer";
import {
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useReducer,
  useState
} from "react";

import {
  addNode,
  buildPublishChecklist,
  compareDraftToPublished,
  createEditorStore,
  deleteNode,
  duplicateNode,
  moveNode,
  updateCondition,
  updateLabel,
  updateNodeProperties,
  updateOptions,
  updateSubmittedName,
  updateValidation,
  type BuilderActivePanel,
  type BuilderArtifactBundle,
  type BuilderCommandDiagnostic,
  type BuilderCommandResult,
  type BuilderEditorState,
  type BuilderEditorStore,
  type BuilderNode,
  type BuilderOption,
  type BuilderPersistenceState,
  type BuilderSchema,
  type BuilderValidationRule,
  type PublishedRevisionMetadata,
  type PublishChecklist
} from "./index.js";
import {
  CANVAS_ROOT_DROP_ID,
  canvasNodeDragId,
  canvasNodeDropId,
  paletteDragId,
  resolveDndIntent,
  resolveDropTarget,
  rootEditableNodes as getRootEditableNodes,
  type BuilderDndIntent,
  type BuilderDragPayload
} from "./dnd.js";

export interface BuilderWorkspaceProps {
  schema: BuilderSchema;
  store?: BuilderEditorStore;
  persistenceState?: BuilderPersistenceState | undefined;
  publishChecklist?: PublishChecklist | undefined;
  artifactBundle?: BuilderArtifactBundle | undefined;
  latestPublishedRevision?: PublishedRevisionMetadata | null | undefined;
  onSaveDraft?: ((schema: BuilderSchema) => void) | undefined;
  onRetrySave?: (() => void) | undefined;
  onReloadLatest?: (() => void) | undefined;
  onPreserveLocalEdits?: (() => void) | undefined;
  onPublish?: ((schema: BuilderSchema) => void) | undefined;
  direction?: "rtl" | "ltr";
  locale?: string;
  className?: string;
}

export interface PaletteItemDefinition {
  fieldType: string;
  label: string;
  description: string;
  group: string;
  icon: string;
  createNode: (context: PaletteNodeContext) => BuilderNode;
}

export interface PaletteNodeContext {
  schema: BuilderSchema;
  index: number;
}

export function BuilderWorkspace(props: BuilderWorkspaceProps): ReactNode {
  const store = useMemo(
    () => props.store ?? createEditorStore({ schema: props.schema }),
    [props.schema, props.store]
  );
  const { state, actions } = useEditorStoreController(store);
  const direction = props.direction ?? state.schema.direction ?? "rtl";
  const selectedNode = state.selectedNodeId ? findNode(state.schema, state.selectedNodeId) : null;
  const diagnostics = state.commandStatus.diagnostics;
  const isPreview = state.canvasMode === "preview";
  const publishChecklist = useMemo(
    () => props.publishChecklist ?? buildPublishChecklist({
      schema: state.schema,
      artifactBundle: props.artifactBundle,
      commandDiagnostics: diagnostics,
      latestPublished: props.latestPublishedRevision
    }),
    [diagnostics, props.artifactBundle, props.latestPublishedRevision, props.publishChecklist, state.schema]
  );
  const revisionComparison = useMemo(
    () => compareDraftToPublished(state.schema, props.latestPublishedRevision),
    [props.latestPublishedRevision, state.schema]
  );
  const [announcement, setAnnouncement] = useState("Drag and keyboard movement ready.");
  const [activeDrag, setActiveDrag] = useState<BuilderDragPayload | null>(null);
  const [overDropId, setOverDropId] = useState<string | null>(null);
  const [dropFeedback, setDropFeedback] = useState<{ status: "idle" | "valid" | "invalid"; message: string }>({
    status: "idle",
    message: ""
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const payload = event.active.data.current?.payload as BuilderDragPayload | undefined;
    if (!payload) {
      return;
    }
    setActiveDrag(payload);
    setDropFeedback({ status: "idle", message: "" });
    actions.setDragState({
      status: "dragging",
      ...(payload.type === "canvas-node" ? { activeNodeId: payload.nodeId } : {})
    });
    announce(`${payload.label} drag started. Move to a canvas drop target.`);
  }, [actions, announce]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const id = event.over?.id ? String(event.over.id) : null;
    const payload = (event.active.data.current?.payload as BuilderDragPayload | undefined) ?? activeDrag;
    setOverDropId(id);
    if (!payload || !id) {
      setDropFeedback({ status: "idle", message: "" });
      return;
    }
    const target = resolveDropTarget(id);
    const intent = resolveDndIntent(state.schema, payload, target);
    if (intent.kind === "invalid") {
      actions.setDragState({
        status: "invalid",
        ...(payload.type === "canvas-node" ? { activeNodeId: payload.nodeId } : {})
      });
      setDropFeedback({ status: "invalid", message: intent.announcement });
      announce(intent.announcement);
      return;
    }
    actions.setDragState({
      status: "dragging",
      ...(target.type === "canvas-node" ? { overNodeId: target.nodeId } : {}),
      ...(payload.type === "canvas-node" ? { activeNodeId: payload.nodeId } : {})
    });
    setDropFeedback({ status: "valid", message: "Valid drop target." });
  }, [actions, activeDrag, announce, state.schema]);

  const resetDragState = useCallback(() => {
    setActiveDrag(null);
    setOverDropId(null);
    actions.setDragState({ status: "idle" });
  }, [actions]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const payload = event.active.data.current?.payload as BuilderDragPayload | undefined;
    const target = resolveDropTarget(event.over?.id ? String(event.over.id) : null);
    const intent = resolveDndIntent(state.schema, payload, target);
    const result = actions.applyDndIntent(intent);
    const status = intent.kind === "invalid" ? "invalid" : "idle";
    setDropFeedback({ status, message: intent.announcement });
    announce(intent.announcement);
    resetDragState();
    if (result?.changed) {
      actions.setDragState({ status: "dropping" });
      actions.setDragState({ status: "idle" });
    }
  }, [actions, announce, resetDragState, state.schema]);

  const handleDragCancel = useCallback(() => {
    const label = activeDrag?.label ?? "Item";
    setDropFeedback({ status: "idle", message: `${label} drag cancelled.` });
    announce(`${label} drag cancelled.`);
    resetDragState();
  }, [activeDrag, announce, resetDragState]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={["rfb-builder", props.className].filter(Boolean).join(" ")}
        dir={direction}
        data-preview-mode={isPreview ? "true" : "false"}
        data-active-panel={state.activePanel}
        data-drag-status={state.dragState.status}
      >
        <BuilderStyles />
        <LiveRegion message={announcement} />
        <CommandBar
          state={state}
          diagnostics={diagnostics}
          persistenceState={props.persistenceState}
          publishChecklist={publishChecklist}
          onUndo={() => { actions.undo(); announce("Undo complete."); }}
          onRedo={() => { actions.redo(); announce("Redo complete."); }}
          onTogglePreview={() => actions.setCanvasMode(isPreview ? "edit" : "preview")}
          onSaveDraft={() => { props.onSaveDraft?.(state.schema); announce("Save draft requested."); }}
          onPublish={() => { props.onPublish?.(state.schema); announce("Publish requested."); }}
        />
        <BuilderWorkflowPanels
          persistenceState={props.persistenceState}
          publishChecklist={publishChecklist}
          artifactBundle={props.artifactBundle}
          revisionComparison={revisionComparison}
          onRetrySave={props.onRetrySave}
          onReloadLatest={props.onReloadLatest}
          onPreserveLocalEdits={props.onPreserveLocalEdits}
        />
        <div className="rfb-builder-layout">
          <Palette
            schema={state.schema}
            onAdd={(item) => {
              const result = actions.addFromPalette(item);
              announce(result.changed ? `${item.label} inserted.` : `${item.label} was not inserted.`);
            }}
          />
          <main className="rfb-canvas-region" role="region" aria-label="Form canvas">
            {dropFeedback.message ? (
              <div
                className="rfb-drop-feedback"
                data-status={dropFeedback.status}
                role={dropFeedback.status === "invalid" ? "alert" : "status"}
              >
                {dropFeedback.message}
              </div>
            ) : null}
            {isPreview ? (
              <PreviewFrame schema={state.schema} />
            ) : (
              <Canvas
                schema={state.schema}
                selectedNodeId={state.selectedNodeId}
                diagnostics={diagnostics}
                dragState={state.dragState}
                overDropId={overDropId}
                onSelect={actions.selectNode}
                onEditLabel={actions.updateLabel}
                onDuplicate={actions.duplicateNode}
                onDelete={actions.deleteNode}
                onMove={(nodeId, direction) => {
                  const result = actions.moveNode(nodeId, direction);
                  const label = readNode(state.schema, nodeId)?.label ?? "Field";
                  announce(result.changed ? `${label} moved ${direction}.` : `${label} cannot move ${direction}.`);
                }}
              />
            )}
          </main>
          <Inspector
            state={state}
            selectedNode={selectedNode}
            onSelectPanel={actions.setActivePanel}
            onUpdateLabel={actions.updateLabel}
            onUpdateDescription={actions.updateDescription}
            onUpdatePlaceholder={actions.updatePlaceholder}
            onUpdateOptions={actions.updateOptions}
            onUpdateRequired={actions.updateRequired}
            onUpdateCondition={actions.updateCondition}
            onUpdateSubmittedName={actions.updateSubmittedName}
          />
        </div>
        <DragOverlay>
          {activeDrag ? <DragOverlayCard label={activeDrag.label} type={activeDrag.type} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

function LiveRegion(props: { message: string }): ReactNode {
  return (
    <div className="rfb-sr-only" role="status" aria-live="polite" aria-atomic="true">
      {props.message}
    </div>
  );
}

function DragOverlayCard(props: { label: string; type: string }): ReactNode {
  return (
    <div className="rfb-drag-overlay" role="presentation">
      <span>{props.label}</span>
      <small>{props.type === "palette-template" ? "New field" : "Move field"}</small>
    </div>
  );
}

function PaletteDragHandle(props: { item: PaletteItemDefinition }): ReactNode {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: paletteDragId(props.item.fieldType),
    data: {
      payload: {
        type: "palette-template",
        fieldType: props.item.fieldType,
        label: props.item.label,
        createNode: props.item.createNode
      } satisfies BuilderDragPayload
    }
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      className="rfb-drag-handle"
      aria-label={`Drag ${props.item.label}`}
      data-dragging={isDragging ? "true" : "false"}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
    >
      ::
    </button>
  );
}

function CanvasDragHandle(props: { node: BuilderNode }): ReactNode {
  const label = readNodeLabel(props.node);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: canvasNodeDragId(props.node.id),
    data: {
      payload: {
        type: "canvas-node",
        nodeId: props.node.id,
        label
      } satisfies BuilderDragPayload
    }
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      className="rfb-drag-handle"
      aria-label={`Drag ${label}`}
      data-dragging={isDragging ? "true" : "false"}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
    >
      ::
    </button>
  );
}

function CanvasDropZone(props: { id: string; label: string; active: boolean }): ReactNode {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });
  return (
    <div
      ref={setNodeRef}
      className="rfb-drop-zone"
      data-active={props.active || isOver ? "true" : "false"}
      aria-label={props.label}
      role="separator"
    >
      <span>{props.label}</span>
    </div>
  );
}

export function BuilderStyles(): ReactNode {
  return (
    <style>
      {createRendererStyles()}
      {createBuilderStyles()}
    </style>
  );
}

export function createBuilderStyles(): string {
  return `
.rfb-builder{--fb-primary:#315CFF;--fb-on-primary:#FFFFFF;--fb-primary-container:#E8EDFF;--fb-on-primary-container:#12205C;--fb-accent:#087568;--fb-surface:#FFFFFF;--fb-surface-muted:#F6F7FB;--fb-on-surface:#172033;--fb-muted:#667085;--fb-border:#DDE3EE;--fb-border-strong:#AEB8C8;--fb-danger:#B42318;--fb-warning:#9A6500;--fb-success:#147A4D;--fb-info:#155EEF;--fb-focus:#315CFF;--fb-radius:8px;--fb-radius-sm:4px;--fb-shadow:0 1px 2px rgba(15,23,42,.08);background:var(--fb-surface-muted);color:var(--fb-on-surface);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:720px;overflow:hidden;}
.rfb-builder *{box-sizing:border-box;}
.rfb-command-bar{block-size:56px;background:var(--fb-surface);border-block-end:1px solid var(--fb-border);display:flex;align-items:center;justify-content:space-between;gap:16px;padding-inline:16px;}
.rfb-command-title{min-inline-size:0;display:grid;gap:2px;}
.rfb-command-title h1{font-size:16px;line-height:20px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rfb-command-title span{color:var(--fb-muted);font-size:12px;line-height:16px;}
.rfb-command-actions{display:flex;align-items:center;gap:8px;min-inline-size:max-content;}
.rfb-command-diagnostics{display:flex;align-items:center;gap:8px;min-inline-size:0;overflow:auto;}
.rfb-command-diagnostics span{font-size:12px;line-height:16px;color:var(--fb-warning);white-space:nowrap;}
.rfb-workflow-panels{background:var(--fb-surface-muted);border-block-end:1px solid var(--fb-border);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:12px 16px;}
.rfb-workflow-row{display:grid;gap:6px;min-inline-size:0;}
.rfb-workflow-card{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:12px;display:grid;gap:10px;min-inline-size:0;}
.rfb-workflow-card summary{cursor:pointer;font-weight:800;}
.rfb-workflow-card-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.rfb-check-list{display:grid;gap:8px;margin:0;padding:0;list-style:none;}
.rfb-check-list li{border-inline-start:3px solid var(--fb-info);padding-inline-start:8px;display:grid;gap:2px;min-inline-size:0;}
.rfb-check-list li[data-severity="error"]{border-color:var(--fb-danger);}
.rfb-check-list li[data-severity="warning"]{border-color:var(--fb-warning);}
.rfb-check-list li span{color:var(--fb-muted);font-size:12px;line-height:16px;overflow-wrap:anywhere;}
.rfb-artifact-grid{display:flex;gap:8px;flex-wrap:wrap;}
.rfb-artifact-code{max-block-size:180px;overflow:auto;border:1px solid var(--fb-border);border-radius:var(--fb-radius-sm);background:var(--fb-surface-muted);padding:10px;font-size:12px;line-height:18px;}
.rfb-builder-layout{display:grid;grid-template-columns:280px minmax(320px,1fr) 340px;grid-template-areas:"palette canvas inspector";block-size:calc(100vh - 56px);min-block-size:664px;}
[dir="rtl"] .rfb-builder-layout{grid-template-areas:"palette canvas inspector";}
[dir="ltr"] .rfb-builder-layout{grid-template-areas:"inspector canvas palette";}
.rfb-palette{grid-area:palette;background:var(--fb-surface);border-inline-start:1px solid var(--fb-border);overflow:auto;padding:16px;}
.rfb-inspector{grid-area:inspector;background:var(--fb-surface);border-inline-end:1px solid var(--fb-border);overflow:auto;}
.rfb-canvas-region{grid-area:canvas;overflow:auto;padding:24px;}
.rfb-canvas{inline-size:min(760px,100%);margin-inline:auto;display:grid;gap:12px;}
.rfb-panel-title{font-size:14px;line-height:20px;font-weight:700;margin:0 0 12px;}
.rfb-stack{display:grid;gap:12px;}
.rfb-inline{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.rfb-button,.rfb-icon-button{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);color:var(--fb-on-surface);font:600 14px/20px inherit;min-block-size:38px;padding:8px 12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;white-space:nowrap;}
.rfb-button[data-variant="primary"]{background:var(--fb-primary);border-color:var(--fb-primary);color:var(--fb-on-primary);}
.rfb-button[data-variant="accent"]{background:var(--fb-accent);border-color:var(--fb-accent);color:var(--fb-on-primary);}
.rfb-button:disabled,.rfb-icon-button:disabled{cursor:not-allowed;opacity:.52;}
.rfb-icon-button{inline-size:36px;padding:0;}
.rfb-input,.rfb-textarea,.rfb-select{inline-size:100%;border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);color:var(--fb-on-surface);font:400 14px/20px inherit;padding:8px 10px;min-block-size:38px;}
.rfb-textarea{resize:vertical;min-block-size:76px;}
.rfb-input[dir="ltr"],.rfb-code{direction:ltr;text-align:left;font-family:"Roboto Mono","SFMono-Regular",Consolas,monospace;}
.rfb-button:focus-visible,.rfb-icon-button:focus-visible,.rfb-input:focus-visible,.rfb-textarea:focus-visible,.rfb-select:focus-visible,.rfb-tab:focus-visible,.rfb-node:focus-visible,.rfb-drag-handle:focus-visible{outline:3px solid var(--fb-focus);outline-offset:2px;}
.rfb-sr-only{position:absolute;inline-size:1px;block-size:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.rfb-empty,.rfb-alert{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface-muted);padding:24px;color:var(--fb-muted);display:grid;gap:8px;}
.rfb-alert{padding:12px 14px;background:var(--fb-primary-container);color:var(--fb-on-primary-container);}
.rfb-alert[data-severity="error"]{background:#FFF2F0;color:var(--fb-danger);border-color:#FFD6D0;}
.rfb-alert[data-severity="warning"]{background:#FFF7E6;color:var(--fb-warning);border-color:#FFE0A3;}
.rfb-alert[data-severity="success"]{background:#ECFDF3;color:var(--fb-success);border-color:#B7E4CB;}
.rfb-badge{border-radius:999px;background:var(--fb-primary-container);color:var(--fb-on-primary-container);font-size:12px;line-height:16px;font-weight:700;min-block-size:24px;padding:4px 8px;display:inline-flex;align-items:center;max-inline-size:100%;}
.rfb-palette-search{margin-block-end:16px;}
.rfb-palette-group{display:grid;gap:8px;margin-block-end:18px;}
.rfb-palette-group h3{font-size:12px;line-height:16px;margin:0;color:var(--fb-muted);text-transform:uppercase;}
.rfb-palette-item{inline-size:100%;border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:10px;text-align:start;display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:10px;align-items:start;}
.rfb-palette-item:hover,.rfb-node:hover{border-color:var(--fb-border-strong);box-shadow:var(--fb-shadow);}
.rfb-palette-icon{block-size:32px;inline-size:32px;border-radius:var(--fb-radius-sm);background:var(--fb-primary-container);color:var(--fb-on-primary-container);display:grid;place-items:center;font-weight:800;}
.rfb-palette-copy{display:grid;gap:2px;min-inline-size:0;}
.rfb-palette-copy strong,.rfb-node-label{overflow-wrap:anywhere;}
.rfb-palette-copy span,.rfb-node-meta,.rfb-help{color:var(--fb-muted);font-size:12px;line-height:16px;}
.rfb-node{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:14px;display:grid;gap:10px;cursor:pointer;}
.rfb-node[data-dragging="true"]{opacity:.56;}
.rfb-node[data-drop-active="true"]{border-color:var(--fb-primary);background:var(--fb-primary-container);}
.rfb-node[data-selected="true"]{border-color:var(--fb-primary);box-shadow:0 0 0 3px var(--fb-primary-container);}
.rfb-node-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:flex-start;gap:12px;}
.rfb-node-title{display:grid;gap:3px;min-inline-size:0;}
.rfb-node-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;}
.rfb-drag-handle{border:1px solid var(--fb-border);border-radius:var(--fb-radius-sm);background:var(--fb-surface-muted);color:var(--fb-muted);font:800 14px/18px inherit;inline-size:32px;min-block-size:32px;display:grid;place-items:center;cursor:grab;touch-action:none;}
.rfb-drag-handle[data-dragging="true"]{cursor:grabbing;background:var(--fb-primary-container);color:var(--fb-on-primary-container);border-color:var(--fb-primary);}
.rfb-drop-zone{border:1px dashed transparent;border-radius:var(--fb-radius-sm);min-block-size:30px;display:grid;place-items:center;color:transparent;font-size:12px;line-height:16px;}
.rfb-drop-zone[data-active="true"]{border-color:var(--fb-primary);background:var(--fb-primary-container);color:var(--fb-on-primary-container);}
.rfb-drop-zone span{pointer-events:none;}
.rfb-drop-feedback{inline-size:min(760px,100%);margin:0 auto 12px;border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:10px 12px;color:var(--fb-muted);font-size:13px;line-height:18px;}
.rfb-drop-feedback[data-status="valid"]{border-color:var(--fb-primary);background:var(--fb-primary-container);color:var(--fb-on-primary-container);}
.rfb-drop-feedback[data-status="invalid"]{border-color:#FFD6D0;background:#FFF2F0;color:var(--fb-danger);}
.rfb-drag-overlay{border:1px solid var(--fb-primary);border-radius:var(--fb-radius);background:var(--fb-surface);box-shadow:0 16px 42px rgba(15,23,42,.18);padding:10px 12px;min-inline-size:180px;display:grid;gap:2px;}
.rfb-drag-overlay span{font-weight:800;overflow-wrap:anywhere;}
.rfb-drag-overlay small{color:var(--fb-muted);}
.rfb-field-preview{border:1px dashed var(--fb-border);border-radius:var(--fb-radius-sm);padding:10px;color:var(--fb-muted);background:var(--fb-surface-muted);}
.rfb-inspector-header{padding:16px;border-block-end:1px solid var(--fb-border);}
.rfb-tabs{display:flex;gap:0;border-block-end:1px solid var(--fb-border);overflow:auto;}
.rfb-tab{border:0;border-inline-end:1px solid var(--fb-border);background:var(--fb-surface);padding:10px 12px;min-block-size:40px;font-weight:700;color:var(--fb-muted);cursor:pointer;white-space:nowrap;}
.rfb-tab[aria-selected="true"]{color:var(--fb-primary);box-shadow:inset 0 -3px 0 var(--fb-primary);}
.rfb-inspector-body{padding:16px;display:grid;gap:16px;}
.rfb-inspector-row{display:grid;gap:6px;}
.rfb-inspector-row label,.rfb-label{font-size:14px;line-height:20px;font-weight:700;}
.rfb-preview-frame{inline-size:min(760px,100%);margin-inline:auto;background:var(--fb-surface);border:1px solid var(--fb-border);border-radius:var(--fb-radius);padding:24px;}
.rfb-diagnostics{display:grid;gap:8px;}
@media (max-width: 1024px){.rfb-workflow-panels{grid-template-columns:repeat(2,minmax(0,1fr));}.rfb-builder-layout{grid-template-columns:260px minmax(320px,1fr);grid-template-areas:"palette canvas";}.rfb-inspector{position:fixed;inset-block:56px 0;inset-inline-start:0;inline-size:min(360px,88vw);z-index:10;box-shadow:0 12px 32px rgba(15,23,42,.14);}.rfb-builder[data-active-panel="preview"] .rfb-inspector{display:none;}}
@media (max-width: 720px){.rfb-command-bar{block-size:auto;min-block-size:56px;align-items:flex-start;flex-direction:column;padding-block:12px}.rfb-command-actions{inline-size:100%;overflow:auto}.rfb-workflow-panels{grid-template-columns:1fr;padding:12px}.rfb-builder-layout{display:flex;flex-direction:column;block-size:auto;min-block-size:0}.rfb-palette{border-inline-start:0;border-block-end:1px solid var(--fb-border);max-block-size:260px}.rfb-canvas-region{padding:16px}.rfb-inspector{position:static;inline-size:auto;box-shadow:none;border-inline-end:0;border-block-start:1px solid var(--fb-border)}.rfb-preview-frame{padding:16px}.rfb-builder{min-height:100vh;overflow:auto}}
@media (prefers-reduced-motion: no-preference){.rfb-button,.rfb-icon-button,.rfb-palette-item,.rfb-node,.rfb-tab,.rfb-drop-zone,.rfb-drag-handle{transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease,color .16s ease,opacity .16s ease;}}
`;
}

export function Button(props: ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "secondary" | "accent" }): ReactNode {
  const { variant = "secondary", className, ...buttonProps } = props;
  return <button {...buttonProps} className={["rfb-button", className].filter(Boolean).join(" ")} data-variant={variant} />;
}

export function IconButton(props: ComponentPropsWithoutRef<"button">): ReactNode {
  const { className, ...buttonProps } = props;
  return <button {...buttonProps} className={["rfb-icon-button", className].filter(Boolean).join(" ")} />;
}

export function TextInput(props: ComponentPropsWithoutRef<"input">): ReactNode {
  const { className, ...inputProps } = props;
  return <input {...inputProps} className={["rfb-input", className].filter(Boolean).join(" ")} />;
}

export function Textarea(props: ComponentPropsWithoutRef<"textarea">): ReactNode {
  const { className, ...textareaProps } = props;
  return <textarea {...textareaProps} className={["rfb-textarea", className].filter(Boolean).join(" ")} />;
}

export function Select(props: ComponentPropsWithoutRef<"select">): ReactNode {
  const { className, ...selectProps } = props;
  return <select {...selectProps} className={["rfb-select", className].filter(Boolean).join(" ")} />;
}

export function EmptyState(props: { title: string; description: string; action?: ReactNode }): ReactNode {
  return (
    <div className="rfb-empty" role="status">
      <strong>{props.title}</strong>
      <span>{props.description}</span>
      {props.action}
    </div>
  );
}

export function Alert(props: { severity?: "info" | "warning" | "error" | "success"; children: ReactNode }): ReactNode {
  return (
    <div className="rfb-alert" role={props.severity === "error" ? "alert" : "status"} data-severity={props.severity ?? "info"}>
      {props.children}
    </div>
  );
}

export function Badge(props: { children: ReactNode; dir?: "ltr" | "rtl" }): ReactNode {
  return <span className="rfb-badge" dir={props.dir}>{props.children}</span>;
}

function CommandBar(props: {
  state: BuilderEditorState;
  diagnostics: BuilderCommandDiagnostic[];
  persistenceState?: BuilderPersistenceState | undefined;
  publishChecklist: PublishChecklist;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}): ReactNode {
  const isPreview = props.state.canvasMode === "preview";
  const errorCount = props.diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;
  const warningCount = props.diagnostics.filter((diagnostic) => diagnostic.severity === "warning").length;
  const saveDisabled = props.persistenceState?.status === "saving" || props.persistenceState?.status === "loading";

  return (
    <header className="rfb-command-bar" role="banner" aria-label="Builder command bar">
      <div className="rfb-command-title">
        <h1>{props.state.schema.title ?? "Untitled form"}</h1>
        <span>
          {props.state.schema.status} revision / {props.state.schema.locale}
        </span>
      </div>
      <div className="rfb-command-actions">
        <IconButton type="button" aria-label="Undo" onClick={props.onUndo} disabled={!props.state.canUndo}>U</IconButton>
        <IconButton type="button" aria-label="Redo" onClick={props.onRedo} disabled={!props.state.canRedo}>R</IconButton>
        <Badge>{errorCount} errors</Badge>
        <Badge>{warningCount} warnings</Badge>
        <Button type="button" onClick={props.onSaveDraft} disabled={saveDisabled}>
          {props.persistenceState?.status === "saving" ? "Saving" : "Save draft"}
        </Button>
        <Button type="button" variant="primary" onClick={props.onPublish} disabled={!props.publishChecklist.canPublish}>
          Publish
        </Button>
        <Button type="button" variant={isPreview ? "accent" : "secondary"} aria-pressed={isPreview} onClick={props.onTogglePreview}>
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>
      {props.diagnostics.length > 0 ? (
        <div className="rfb-command-diagnostics" role="status" aria-label="Command diagnostics">
          {props.diagnostics.map((diagnostic) => (
            <span key={`${diagnostic.code}-${diagnostic.message}`}>{diagnostic.message}</span>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function BuilderWorkflowPanels(props: {
  persistenceState?: BuilderPersistenceState | undefined;
  publishChecklist: PublishChecklist;
  artifactBundle?: BuilderArtifactBundle | undefined;
  revisionComparison: ReturnType<typeof compareDraftToPublished>;
  onRetrySave?: (() => void) | undefined;
  onReloadLatest?: (() => void) | undefined;
  onPreserveLocalEdits?: (() => void) | undefined;
}): ReactNode {
  const showRevision = props.revisionComparison.latestPublished || props.revisionComparison.warnings.length > 0;
  return (
    <section className="rfb-workflow-panels" aria-label="Persistence and publish workflow">
      {props.persistenceState ? (
        <PersistenceStatusPanel
          state={props.persistenceState}
          onRetrySave={props.onRetrySave}
          onReloadLatest={props.onReloadLatest}
          onPreserveLocalEdits={props.onPreserveLocalEdits}
        />
      ) : null}
      <PublishChecklistPanel checklist={props.publishChecklist} />
      {showRevision ? <RevisionWarningPanel comparison={props.revisionComparison} /> : null}
      {props.artifactBundle ? <GeneratedArtifactPanel bundle={props.artifactBundle} /> : null}
    </section>
  );
}

function PersistenceStatusPanel(props: {
  state: BuilderPersistenceState;
  onRetrySave?: (() => void) | undefined;
  onReloadLatest?: (() => void) | undefined;
  onPreserveLocalEdits?: (() => void) | undefined;
}): ReactNode {
  const severity = props.state.status === "failed" || props.state.status === "conflicted" ? "warning" : props.state.status === "saved" ? "success" : "info";
  return (
    <Alert severity={severity}>
      <div className="rfb-workflow-row">
        <strong>Draft {props.state.status}</strong>
        <span>{props.state.message ?? persistenceMessage(props.state)}</span>
        {props.state.status === "conflicted" ? (
          <span className="rfb-inline">
            <Button type="button" onClick={props.onReloadLatest}>Reload latest</Button>
            <Button type="button" onClick={props.onRetrySave} disabled={!props.state.canRetry}>Retry</Button>
            <Button type="button" onClick={props.onPreserveLocalEdits}>Keep local edits</Button>
          </span>
        ) : null}
        {props.state.status === "failed" ? (
          <Button type="button" onClick={props.onRetrySave} disabled={!props.state.canRetry}>Retry save</Button>
        ) : null}
      </div>
    </Alert>
  );
}

function PublishChecklistPanel(props: { checklist: PublishChecklist }): ReactNode {
  const items = props.checklist.items.slice(0, 6);
  return (
    <div className="rfb-workflow-card" role="region" aria-label="Publish checklist" data-can-publish={props.checklist.canPublish ? "true" : "false"}>
      <div className="rfb-workflow-card-header">
        <strong>Publish checklist</strong>
        <Badge>{props.checklist.blocking.length} blockers</Badge>
        <Badge>{props.checklist.warnings.length} warnings</Badge>
      </div>
      {items.length > 0 ? (
        <ul className="rfb-check-list">
          {items.map((item) => (
            <li key={item.id} data-severity={item.severity}>
              <strong>{item.label}</strong>
              <span>{item.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        <span className="rfb-help">No publish blockers detected.</span>
      )}
    </div>
  );
}

function RevisionWarningPanel(props: { comparison: ReturnType<typeof compareDraftToPublished> }): ReactNode {
  return (
    <div className="rfb-workflow-card" role="region" aria-label="Revision warnings">
      <div className="rfb-workflow-card-header">
        <strong>Revision review</strong>
        {props.comparison.latestPublished ? <Badge dir="ltr">{props.comparison.latestPublished.revisionId}</Badge> : null}
      </div>
      <span className="rfb-help" dir="ltr">
        Draft {props.comparison.currentRevisionId || "missing"} / {props.comparison.currentRevisionHash || "missing"}
      </span>
      {props.comparison.warnings.length > 0 ? (
        <ul className="rfb-check-list">
          {props.comparison.warnings.map((warning) => (
            <li key={warning.id} data-severity="warning">
              <strong>{warning.label}</strong>
              <span>{warning.message}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function GeneratedArtifactPanel(props: { bundle: BuilderArtifactBundle }): ReactNode {
  return (
    <details className="rfb-workflow-card">
      <summary>Generated artifacts</summary>
      <div className="rfb-artifact-grid">
        <Badge dir="ltr">{props.bundle.dialect}</Badge>
        <Badge>{props.bundle.diagnostics.length} diagnostics</Badge>
        <Badge>{props.bundle.validationPlan.length} validation-plan entries</Badge>
        <Badge>{props.bundle.conditionDependencies.length} condition dependencies</Badge>
        <Badge>{props.bundle.fixtureReferences.length} fixtures</Badge>
      </div>
      <pre className="rfb-code rfb-artifact-code">{JSON.stringify(props.bundle.schema, null, 2)}</pre>
    </details>
  );
}

function persistenceMessage(state: BuilderPersistenceState): string {
  switch (state.status) {
    case "loading":
      return "Loading draft from host persistence.";
    case "dirty":
      return "Local edits have not been saved.";
    case "saving":
      return "Saving draft.";
    case "saved":
      return state.lastSavedAt ? `Saved at ${state.lastSavedAt}.` : "Draft saved.";
    case "failed":
      return "Draft save failed.";
    case "retrying":
      return "Retrying draft save.";
    case "conflicted":
      return "Draft has a host conflict.";
    case "idle":
      return "Draft persistence is idle.";
  }
}

function Palette(props: { schema: BuilderSchema; onAdd: (item: PaletteItemDefinition) => void }): ReactNode {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const groups = useMemo(() => {
    const filtered = paletteCatalog.filter((item) =>
      [item.label, item.description, item.group, item.fieldType].join(" ").toLowerCase().includes(normalized)
    );
    return groupBy(filtered, (item) => item.group);
  }, [normalized]);
  const hasResults = groups.length > 0;

  return (
    <aside className="rfb-palette" role="region" aria-label="Component palette">
      <h2 className="rfb-panel-title">Components</h2>
      <div className="rfb-palette-search">
        <label className="rfb-label" htmlFor="rfb-palette-search">Search components</label>
        <TextInput
          id="rfb-palette-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Text, email, select"
        />
      </div>
      {hasResults ? groups.map((group) => (
        <section className="rfb-palette-group" key={group.key} aria-label={group.key}>
          <h3>{group.key}</h3>
          {group.items.map((item) => (
            <div
              className="rfb-palette-item"
              key={item.fieldType}
            >
              <span className="rfb-palette-icon" aria-hidden="true">{item.icon}</span>
              <span className="rfb-palette-copy">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
              <span className="rfb-inline">
                <PaletteDragHandle item={item} />
                <IconButton type="button" onClick={() => props.onAdd(item)} aria-label={`Add ${item.label}`}>+</IconButton>
              </span>
            </div>
          ))}
        </section>
      )) : (
        <EmptyState
          title="No components found"
          description="Clear the search to show the full component palette."
          action={<Button type="button" onClick={() => setQuery("")}>Clear search</Button>}
        />
      )}
      <p className="rfb-help">{props.schema.nodes.length} nodes in this form.</p>
    </aside>
  );
}

function Canvas(props: {
  schema: BuilderSchema;
  selectedNodeId: string | null;
  diagnostics: BuilderCommandDiagnostic[];
  dragState: BuilderEditorState["dragState"];
  overDropId: string | null;
  onSelect: (nodeId: string | null) => void;
  onEditLabel: (nodeId: string, label: string) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onMove: (nodeId: string, direction: "up" | "down") => void;
}): ReactNode {
  const nodes = rootEditableNodes(props.schema);
  if (nodes.length === 0) {
    return (
      <div className="rfb-canvas">
        <CanvasDropZone id={CANVAS_ROOT_DROP_ID} label="Drop first field here" active={props.overDropId === CANVAS_ROOT_DROP_ID} />
        <EmptyState
          title="Start with a component"
          description="Use the component palette to add or drag the first field to this form."
        />
      </div>
    );
  }
  return (
    <div className="rfb-canvas" aria-label="Editable form structure">
      {nodes.map((node, index) => {
        const afterId = canvasNodeDropId(node.id, "after");
        return (
          <div className="rfb-canvas-slot" key={node.id}>
            <CanvasNode
              node={node}
              index={index}
              selected={props.selectedNodeId === node.id}
              dragging={props.dragState.activeNodeId === node.id && props.dragState.status === "dragging"}
              dropActive={props.overDropId === canvasNodeDropId(node.id, "before")}
              diagnostics={props.diagnostics.filter((diagnostic) => diagnostic.nodeId === node.id)}
              onSelect={props.onSelect}
              onEditLabel={props.onEditLabel}
              onDuplicate={props.onDuplicate}
              onDelete={props.onDelete}
              onMove={props.onMove}
            />
            {index === nodes.length - 1 ? (
              <CanvasDropZone id={afterId} label={`Drop after ${readNodeLabel(node)}`} active={props.overDropId === afterId} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function CanvasNode(props: {
  node: BuilderNode;
  index: number;
  selected: boolean;
  dragging: boolean;
  dropActive: boolean;
  diagnostics: BuilderCommandDiagnostic[];
  onSelect: (nodeId: string) => void;
  onEditLabel: (nodeId: string, label: string) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onMove: (nodeId: string, direction: "up" | "down") => void;
}): ReactNode {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(readNodeLabel(props.node));
  const { setNodeRef, isOver } = useDroppable({ id: canvasNodeDropId(props.node.id, "before") });

  const commit = () => {
    const next = draft.trim();
    if (next) {
      props.onEditLabel(props.node.id, next);
    }
    setIsEditing(false);
  };

  return (
    <article
      ref={setNodeRef}
      className="rfb-node"
      tabIndex={0}
      data-selected={props.selected ? "true" : "false"}
      data-dragging={props.dragging ? "true" : "false"}
      data-drop-active={props.dropActive || isOver ? "true" : "false"}
      aria-label={`Field ${readNodeLabel(props.node)}`}
      onClick={() => props.onSelect(props.node.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          props.onSelect(props.node.id);
        }
      }}
    >
      <div className="rfb-node-header">
        <CanvasDragHandle node={props.node} />
        <div className="rfb-node-title">
          {isEditing ? (
            <form
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                commit();
              }}
            >
              <TextInput
                aria-label="Inline field label"
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                onBlur={commit}
                autoFocus
              />
            </form>
          ) : (
            <button className="rfb-button rfb-node-label" type="button" onClick={() => setIsEditing(true)}>
              {readNodeLabel(props.node)}
            </button>
          )}
          <span className="rfb-node-meta">
            {props.index + 1}. {props.node.fieldType ?? props.node.type} / <span className="rfb-code" dir="ltr">{props.node.name ?? props.node.id}</span>
          </span>
        </div>
        <div className="rfb-node-actions" aria-label="Field quick actions">
          <IconButton type="button" aria-label="Move field up" onClick={(event) => { event.stopPropagation(); props.onMove(props.node.id, "up"); }}>Up</IconButton>
          <IconButton type="button" aria-label="Move field down" onClick={(event) => { event.stopPropagation(); props.onMove(props.node.id, "down"); }}>Dn</IconButton>
          <IconButton type="button" aria-label="Duplicate field" onClick={(event) => { event.stopPropagation(); props.onDuplicate(props.node.id); }}>Cp</IconButton>
          <IconButton type="button" aria-label="Delete field" onClick={(event) => { event.stopPropagation(); props.onDelete(props.node.id); }}>×</IconButton>
        </div>
      </div>
      <div className="rfb-field-preview" aria-hidden="true">{previewTextForNode(props.node)}</div>
      {props.diagnostics.length > 0 ? (
        <div className="rfb-diagnostics">
          {props.diagnostics.map((diagnostic) => (
            <Alert key={`${diagnostic.code}-${diagnostic.message}`} severity={diagnostic.severity === "error" ? "error" : "warning"}>
              {diagnostic.message}
            </Alert>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function Inspector(props: {
  state: BuilderEditorState;
  selectedNode: BuilderNode | null;
  onSelectPanel: (panel: BuilderActivePanel) => void;
  onUpdateLabel: (nodeId: string, label: string) => void;
  onUpdateDescription: (nodeId: string, description: string) => void;
  onUpdatePlaceholder: (nodeId: string, placeholder: string) => void;
  onUpdateOptions: (nodeId: string, options: BuilderOption[]) => void;
  onUpdateRequired: (nodeId: string, required: boolean) => void;
  onUpdateCondition: (nodeId: string, conditionText: string) => void;
  onUpdateSubmittedName: (nodeId: string, name: string) => void;
}): ReactNode {
  const node = props.selectedNode;
  const tabs: BuilderActivePanel[] = ["content", "validation", "logic", "accessibility", "data"];
  return (
    <aside className="rfb-inspector" role="region" aria-label="Inspector">
      <div className="rfb-inspector-header">
        <h2 className="rfb-panel-title">Inspector</h2>
        <span className="rfb-help">{node ? readNodeLabel(node) : "Select a field to edit settings."}</span>
      </div>
      <div className="rfb-tabs" role="tablist" aria-label="Inspector tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className="rfb-tab"
            role="tab"
            type="button"
            aria-selected={props.state.activePanel === tab}
            onClick={() => props.onSelectPanel(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div className="rfb-inspector-body">
        {node ? renderInspectorPanel(props.state.activePanel, node, props) : (
          <EmptyState title="Nothing selected" description="Select a canvas field to edit its settings." />
        )}
      </div>
    </aside>
  );
}

function renderInspectorPanel(
  panel: BuilderActivePanel,
  node: BuilderNode,
  actions: {
    onUpdateLabel: (nodeId: string, label: string) => void;
    onUpdateDescription: (nodeId: string, description: string) => void;
    onUpdatePlaceholder: (nodeId: string, placeholder: string) => void;
    onUpdateOptions: (nodeId: string, options: BuilderOption[]) => void;
    onUpdateRequired: (nodeId: string, required: boolean) => void;
    onUpdateCondition: (nodeId: string, conditionText: string) => void;
    onUpdateSubmittedName: (nodeId: string, name: string) => void;
  }
): ReactNode {
  if (panel === "validation") {
    return (
      <div className="rfb-stack">
        <label className="rfb-inline">
          <input
            type="checkbox"
            checked={isRequiredNode(node)}
            onChange={(event) => actions.onUpdateRequired(node.id, event.currentTarget.checked)}
          />
          Required field
        </label>
        <Alert severity="warning">Changing requiredness can affect stored responses.</Alert>
      </div>
    );
  }
  if (panel === "logic") {
    return (
      <InspectorRow label="Visibility condition JSON" htmlFor="rfb-logic-condition" help="Use declarative condition JSON only. Executable JavaScript is not stored.">
        <Textarea
          id="rfb-logic-condition"
          dir="ltr"
          value={JSON.stringify(node.visibility ?? "", null, 2)}
          onChange={(event) => actions.onUpdateCondition(node.id, event.currentTarget.value)}
        />
      </InspectorRow>
    );
  }
  if (panel === "accessibility") {
    return (
      <div className="rfb-stack">
        <InspectorRow label="Accessible label" htmlFor="rfb-a11y-label">
          <TextInput id="rfb-a11y-label" value={readNodeLabel(node)} onChange={(event) => actions.onUpdateLabel(node.id, event.currentTarget.value)} />
        </InspectorRow>
        <InspectorRow label="Helper text" htmlFor="rfb-a11y-description">
          <Textarea id="rfb-a11y-description" value={String(node.description ?? "")} onChange={(event) => actions.onUpdateDescription(node.id, event.currentTarget.value)} />
        </InspectorRow>
      </div>
    );
  }
  if (panel === "data") {
    return (
      <div className="rfb-stack">
        <InspectorRow label="Submitted path" htmlFor="rfb-data-name" help="Unsafe paths fail closed through builder diagnostics.">
          <TextInput id="rfb-data-name" dir="ltr" value={String(node.name ?? "")} onChange={(event) => actions.onUpdateSubmittedName(node.id, event.currentTarget.value)} />
        </InspectorRow>
        <InspectorRow label="Node id" htmlFor="rfb-data-id">
          <TextInput id="rfb-data-id" dir="ltr" value={node.id} readOnly />
        </InspectorRow>
      </div>
    );
  }
  return (
    <div className="rfb-stack">
      <InspectorRow label="Label" htmlFor="rfb-content-label">
        <TextInput id="rfb-content-label" value={readNodeLabel(node)} onChange={(event) => actions.onUpdateLabel(node.id, event.currentTarget.value)} />
      </InspectorRow>
      <InspectorRow label="Description" htmlFor="rfb-content-description">
        <Textarea id="rfb-content-description" value={String(node.description ?? "")} onChange={(event) => actions.onUpdateDescription(node.id, event.currentTarget.value)} />
      </InspectorRow>
      <InspectorRow label="Placeholder" htmlFor="rfb-content-placeholder">
        <TextInput id="rfb-content-placeholder" value={String(node.placeholder ?? "")} onChange={(event) => actions.onUpdatePlaceholder(node.id, event.currentTarget.value)} />
      </InspectorRow>
      {supportsOptions(node) ? (
        <InspectorRow label="Options" htmlFor="rfb-content-options" help="One option per line. Use label=value to set a stable submitted value.">
          <Textarea id="rfb-content-options" value={formatOptions(node.options)} onChange={(event) => actions.onUpdateOptions(node.id, parseOptions(event.currentTarget.value))} />
        </InspectorRow>
      ) : null}
    </div>
  );
}

function InspectorRow(props: { label: string; htmlFor: string; help?: string; children: ReactNode }): ReactNode {
  return (
    <div className="rfb-inspector-row">
      <label htmlFor={props.htmlFor}>{props.label}</label>
      {props.children}
      {props.help ? <span className="rfb-help">{props.help}</span> : null}
    </div>
  );
}

function PreviewFrame(props: { schema: BuilderSchema }): ReactNode {
  return (
    <div className="rfb-preview-frame" role="region" aria-label="Form preview">
      <FormRenderer schema={props.schema as RendererSchema} />
    </div>
  );
}

function useEditorStoreController(store: BuilderEditorStore): {
  state: BuilderEditorState;
  actions: {
    selectNode: (nodeId: string | null) => void;
    setActivePanel: (panel: BuilderActivePanel) => void;
    setCanvasMode: (mode: "edit" | "preview" | "logic") => void;
    addFromPalette: (item: PaletteItemDefinition) => BuilderCommandResult;
    applyDndIntent: (intent: BuilderDndIntent) => BuilderCommandResult | null;
    updateLabel: (nodeId: string, label: string) => BuilderCommandResult;
    updateDescription: (nodeId: string, description: string) => BuilderCommandResult;
    updatePlaceholder: (nodeId: string, placeholder: string) => BuilderCommandResult;
    updateOptions: (nodeId: string, options: BuilderOption[]) => BuilderCommandResult;
    updateRequired: (nodeId: string, required: boolean) => BuilderCommandResult;
    updateCondition: (nodeId: string, conditionText: string) => BuilderCommandResult;
    updateSubmittedName: (nodeId: string, name: string) => BuilderCommandResult;
    duplicateNode: (nodeId: string) => BuilderCommandResult;
    deleteNode: (nodeId: string) => BuilderCommandResult;
    moveNode: (nodeId: string, direction: "up" | "down") => BuilderCommandResult;
    setDragState: (dragState: BuilderEditorState["dragState"]) => void;
    undo: () => void;
    redo: () => void;
  };
} {
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const refresh = useCallback(() => forceRender(), []);
  const run = useCallback((operation: () => BuilderCommandResult): BuilderCommandResult => {
    const result = operation();
    refresh();
    return result;
  }, [refresh]);

  const actions = useMemo(() => ({
    selectNode: (nodeId: string | null) => {
      store.selectNode(nodeId);
      refresh();
    },
    setActivePanel: (panel: BuilderActivePanel) => {
      store.setActivePanel(panel);
      refresh();
    },
    setCanvasMode: (mode: "edit" | "preview" | "logic") => {
      store.setCanvasMode(mode);
      if (mode === "preview") {
        store.setActivePanel("preview");
      }
      refresh();
    },
    addFromPalette: (item: PaletteItemDefinition) => run(() => {
      const state = store.getState();
      const node = item.createNode({ schema: state.schema, index: state.schema.nodes.length });
      const result = store.executeCommand("addNode", (schema) => addNode(schema, { node }));
      if (result.changed) {
        store.selectNode(node.id);
        store.setActivePanel("content");
      }
      return result;
    }),
    applyDndIntent: (intent: BuilderDndIntent) => {
      if (intent.kind === "addNode") {
        return run(() => {
          const result = store.executeCommand("addNode", (schema) => addNode(schema, intent.input));
          if (result.changed) {
            store.selectNode(intent.insertedNodeId);
            store.setActivePanel("content");
          }
          return result;
        });
      }
      if (intent.kind === "moveNode") {
        return run(() => {
          const result = store.executeCommand("moveNode", (schema) => moveNode(schema, intent.input));
          if (result.changed) {
            store.selectNode(intent.input.nodeId);
          }
          return result;
        });
      }
      refresh();
      return null;
    },
    updateLabel: (nodeId: string, label: string) => run(() =>
      store.executeCommand("updateLabel", (schema) => updateLabel(schema, { nodeId, label }))
    ),
    updateDescription: (nodeId: string, description: string) => run(() =>
      store.executeCommand("updateNodeProperties", (schema) => updateNodeProperties(schema, { nodeId, properties: { description } }))
    ),
    updatePlaceholder: (nodeId: string, placeholder: string) => run(() =>
      store.executeCommand("updateNodeProperties", (schema) => updateNodeProperties(schema, { nodeId, properties: { placeholder } }))
    ),
    updateOptions: (nodeId: string, options: BuilderOption[]) => run(() =>
      store.executeCommand("updateOptions", (schema) => updateOptions(schema, { nodeId, options }))
    ),
    updateRequired: (nodeId: string, required: boolean) => run(() =>
      store.executeCommand("updateValidation", (schema) => updateValidation(schema, { nodeId, validation: setRequired(readNode(schema, nodeId)?.validation, required) }))
    ),
    updateCondition: (nodeId: string, conditionText: string) => run(() =>
      store.executeCommand("updateCondition", (schema) => updateCondition(schema, { nodeId, target: "visibility", condition: parseCondition(conditionText) }))
    ),
    updateSubmittedName: (nodeId: string, name: string) => run(() =>
      store.executeCommand("updateSubmittedName", (schema) => updateSubmittedName(schema, { nodeId, name }))
    ),
    duplicateNode: (nodeId: string) => run(() =>
      store.executeCommand("duplicateNode", (schema) => duplicateNode(schema, { nodeId }))
    ),
    deleteNode: (nodeId: string) => run(() =>
      store.executeCommand("deleteNode", (schema) => deleteNode(schema, { nodeId }))
    ),
    moveNode: (nodeId: string, direction: "up" | "down") => run(() => {
      const schema = store.getState().schema;
      const currentIndex = rootEditableNodes(schema).findIndex((node) => node.id === nodeId);
      const position = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      return store.executeCommand("moveNode", (currentSchema) => moveNode(currentSchema, { nodeId, position }));
    }),
    setDragState: (dragState: BuilderEditorState["dragState"]) => {
      store.setDragState(dragState);
      refresh();
    },
    undo: () => {
      store.undo();
      refresh();
    },
    redo: () => {
      store.redo();
      refresh();
    }
  }), [refresh, run, store]);

  return { state: store.getState(), actions };
}

export const paletteCatalog: PaletteItemDefinition[] = [
  fieldDefinition("text", "Text", "Short answer field", "Basic", "T"),
  fieldDefinition("textarea", "Long text", "Multi-line response", "Basic", "L"),
  fieldDefinition("email", "Email", "Validated email input", "Basic", "@"),
  fieldDefinition("phone", "Phone", "Telephone input", "Basic", "#"),
  fieldDefinition("number", "Number", "Numeric response", "Basic", "1"),
  fieldDefinition("date", "Date", "Calendar date input", "Basic", "D"),
  fieldDefinition("select", "Dropdown", "Single select menu", "Choices", "V", [
    { id: "option_1", label: "First option", value: "first" },
    { id: "option_2", label: "Second option", value: "second" }
  ]),
  fieldDefinition("radio", "Radio group", "Visible single choice", "Choices", "O", [
    { id: "option_1", label: "Yes", value: "yes" },
    { id: "option_2", label: "No", value: "no" }
  ]),
  fieldDefinition("checkbox", "Checkbox", "True or false choice", "Choices", "C")
];

const tabLabels: Record<BuilderActivePanel, string> = {
  content: "Content",
  validation: "Validation",
  logic: "Logic",
  accessibility: "Accessibility",
  data: "Data",
  preview: "Preview"
};

function fieldDefinition(
  fieldType: string,
  label: string,
  description: string,
  group: string,
  icon: string,
  options?: BuilderOption[]
): PaletteItemDefinition {
  return {
    fieldType,
    label,
    description,
    group,
    icon,
    createNode: ({ schema, index }) => {
      const base = fieldType.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
      const id = uniqueNodeId(schema, `field_${base}_${index + 1}`);
      const name = uniqueSubmittedName(schema, base);
      return {
        id,
        type: "field",
        fieldType,
        name,
        label,
        ...(fieldType === "checkbox" ? { defaultValue: false } : {}),
        ...(options ? { options } : {}),
        validation: []
      };
    }
  };
}

function readNode(schema: BuilderSchema, nodeId: string): BuilderNode | undefined {
  return schema.nodes.find((node) => node.id === nodeId);
}

function findNode(schema: BuilderSchema, nodeId: string): BuilderNode | null {
  return readNode(schema, nodeId) ?? null;
}

function rootEditableNodes(schema: BuilderSchema): BuilderNode[] {
  const childIds = new Set(schema.nodes.flatMap((node) => node.children ?? []));
  return schema.nodes.filter((node) => !childIds.has(node.id) && (node.type === "field" || node.type === "hidden"));
}

function readNodeLabel(node: BuilderNode): string {
  return node.label ?? node.name ?? node.id;
}

function previewTextForNode(node: BuilderNode): string {
  if (node.fieldType === "select") {
    return "Dropdown preview";
  }
  if (node.fieldType === "radio") {
    return "Radio options preview";
  }
  if (node.fieldType === "checkbox") {
    return "Checkbox preview";
  }
  if (node.fieldType === "textarea") {
    return "Long text response preview";
  }
  return `${node.fieldType ?? node.type} input preview`;
}

function supportsOptions(node: BuilderNode): boolean {
  return node.fieldType === "select" || node.fieldType === "radio";
}

function isRequiredNode(node: BuilderNode): boolean {
  return (node.validation ?? []).some((rule) => rule.type === "required");
}

function setRequired(validation: BuilderValidationRule[] = [], required: boolean): BuilderValidationRule[] {
  const withoutRequired = validation.filter((rule) => rule.type !== "required");
  return required ? [{ type: "required" }, ...withoutRequired] : withoutRequired;
}

function parseCondition(value: string): unknown {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return { invalidJson: trimmed };
  }
}

function formatOptions(options: BuilderOption[] = []): string {
  return options.map((option) => option.label === option.value ? option.value : `${option.label}=${option.value}`).join("\n");
}

function parseOptions(value: string): BuilderOption[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [labelPart, valuePart] = line.split("=");
      const label = labelPart?.trim() || `Option ${index + 1}`;
      const optionValue = valuePart?.trim() || slug(label);
      return { id: `option_${index + 1}`, label, value: optionValue };
    });
}

function uniqueNodeId(schema: BuilderSchema, baseId: string): string {
  const ids = new Set(schema.nodes.map((node) => node.id));
  let candidate = baseId;
  let index = 1;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${baseId}_${index}`;
  }
  return candidate;
}

function uniqueSubmittedName(schema: BuilderSchema, baseName: string): string {
  const names = new Set(schema.nodes.map((node) => node.name).filter(Boolean));
  let candidate = baseName;
  let index = 1;
  while (names.has(candidate)) {
    index += 1;
    candidate = `${baseName}_${index}`;
  }
  return candidate;
}

function slug(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return normalized || "option";
}

function groupBy<T>(items: T[], keyForItem: (item: T) => string): Array<{ key: string; items: T[] }> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyForItem(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return Array.from(map.entries()).map(([key, groupItems]) => ({ key, items: groupItems }));
}
