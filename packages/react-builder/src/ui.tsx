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
import { createBuilderThemeStyles } from "@your-org/forms-themes";
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
  messages?: Partial<BuilderMessages>;
  className?: string;
}

export interface BuilderMessages {
  components: string;
  searchComponents: string;
  inspector: string;
  selectFieldSettings: string;
  nothingSelected: string;
  nothingSelectedDescription: string;
  content: string;
  validation: string;
  logic: string;
  accessibility: string;
  data: string;
  preview: string;
  edit: string;
  saveDraft: string;
  saving: string;
  publish: string;
  label: string;
  description: string;
  placeholder: string;
  submittedPath: string;
  nodeId: string;
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
  const messages = { ...defaultBuilderMessages(props.locale ?? state.schema.locale), ...props.messages };
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
          messages={messages}
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
            messages={messages}
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
            messages={messages}
            selectedNode={selectedNode}
            onSelectPanel={actions.setActivePanel}
            onUpdateLabel={actions.updateLabel}
            onUpdateDescription={actions.updateDescription}
            onUpdatePlaceholder={actions.updatePlaceholder}
            onUpdateOptions={actions.updateOptions}
            onUpdateDefaultValue={actions.updateDefaultValue}
            onUpdateRequired={actions.updateRequired}
            onUpdateValidationRules={actions.updateValidationRules}
            onUpdateCondition={actions.updateCondition}
            onUpdateVisibilityCondition={actions.updateVisibilityCondition}
            onUpdateNodeProperties={actions.updateNodeProperties}
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
  return createBuilderThemeStyles();
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
  messages: BuilderMessages;
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
          {props.persistenceState?.status === "saving" ? props.messages.saving : props.messages.saveDraft}
        </Button>
        <Button type="button" variant="primary" onClick={props.onPublish} disabled={!props.publishChecklist.canPublish}>
          {props.messages.publish}
        </Button>
        <Button type="button" variant={isPreview ? "accent" : "secondary"} aria-pressed={isPreview} onClick={props.onTogglePreview}>
          {isPreview ? props.messages.edit : props.messages.preview}
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

function Palette(props: { schema: BuilderSchema; messages: BuilderMessages; onAdd: (item: PaletteItemDefinition) => void }): ReactNode {
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
      <h2 className="rfb-panel-title">{props.messages.components}</h2>
      <div className="rfb-palette-search">
        <label className="rfb-label" htmlFor="rfb-palette-search">{props.messages.searchComponents}</label>
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
      aria-label={`${nodeKindLabel(props.node)} ${readNodeLabel(props.node)}`}
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
                aria-label="Inline node label"
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
            {props.index + 1}. {nodeTypeLabel(props.node)} / <span className="rfb-code" dir="ltr">{props.node.name ?? props.node.id}</span>
          </span>
        </div>
        <div className="rfb-node-actions" aria-label="Node quick actions">
          <IconButton type="button" aria-label="Move field up" onClick={(event) => { event.stopPropagation(); props.onMove(props.node.id, "up"); }}>↑</IconButton>
          <IconButton type="button" aria-label="Move field down" onClick={(event) => { event.stopPropagation(); props.onMove(props.node.id, "down"); }}>↓</IconButton>
          <IconButton type="button" aria-label="Duplicate field" onClick={(event) => { event.stopPropagation(); props.onDuplicate(props.node.id); }}>⧉</IconButton>
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
  messages: BuilderMessages;
  selectedNode: BuilderNode | null;
  onSelectPanel: (panel: BuilderActivePanel) => void;
  onUpdateLabel: (nodeId: string, label: string) => void;
  onUpdateDescription: (nodeId: string, description: string) => void;
  onUpdatePlaceholder: (nodeId: string, placeholder: string) => void;
  onUpdateOptions: (nodeId: string, options: BuilderOption[]) => void;
  onUpdateDefaultValue: (nodeId: string, value: unknown) => void;
  onUpdateRequired: (nodeId: string, required: boolean) => void;
  onUpdateValidationRules: (nodeId: string, validation: BuilderValidationRule[]) => void;
  onUpdateCondition: (nodeId: string, conditionText: string) => void;
  onUpdateVisibilityCondition: (nodeId: string, condition: unknown) => void;
  onUpdateNodeProperties: (nodeId: string, properties: Partial<BuilderNode>) => void;
  onUpdateSubmittedName: (nodeId: string, name: string) => void;
}): ReactNode {
  const node = props.selectedNode;
  const tabs: BuilderActivePanel[] = ["content", "validation", "logic", "accessibility", "data"];
  return (
    <aside className="rfb-inspector" role="region" aria-label="Inspector">
      <div className="rfb-inspector-header">
        <h2 className="rfb-panel-title">{props.messages.inspector}</h2>
        <span className="rfb-help">{node ? readNodeLabel(node) : props.messages.selectFieldSettings}</span>
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
            {props.messages[tab]}
          </button>
        ))}
      </div>
      <div className="rfb-inspector-body">
        {node ? renderInspectorPanel(props.state.activePanel, node, props) : (
          <EmptyState title={props.messages.nothingSelected} description={props.messages.nothingSelectedDescription} />
        )}
      </div>
    </aside>
  );
}

function renderInspectorPanel(
  panel: BuilderActivePanel,
  node: BuilderNode,
  actions: {
    state: BuilderEditorState;
    onUpdateLabel: (nodeId: string, label: string) => void;
    onUpdateDescription: (nodeId: string, description: string) => void;
    onUpdatePlaceholder: (nodeId: string, placeholder: string) => void;
    onUpdateOptions: (nodeId: string, options: BuilderOption[]) => void;
    onUpdateDefaultValue: (nodeId: string, value: unknown) => void;
    onUpdateRequired: (nodeId: string, required: boolean) => void;
    onUpdateValidationRules: (nodeId: string, validation: BuilderValidationRule[]) => void;
    onUpdateCondition: (nodeId: string, conditionText: string) => void;
    onUpdateVisibilityCondition: (nodeId: string, condition: unknown) => void;
    onUpdateNodeProperties: (nodeId: string, properties: Partial<BuilderNode>) => void;
    onUpdateSubmittedName: (nodeId: string, name: string) => void;
    messages: BuilderMessages;
  }
): ReactNode {
  if (panel === "validation") {
    return <ValidationEditor node={node} onUpdateValidation={(validation) => actions.onUpdateValidationRules(node.id, validation)} />;
  }
  if (panel === "logic") {
    return (
      <LogicEditor
        node={node}
        schema={actions.state.schema}
        onUpdateVisibility={(condition) => actions.onUpdateVisibilityCondition(node.id, condition)}
        onUpdateValidation={(validation) => actions.onUpdateValidationRules(node.id, validation)}
      />
    );
  }
  if (panel === "accessibility") {
    return (
      <div className="rfb-stack">
        <InspectorRow label={actions.messages.label} htmlFor="rfb-a11y-label">
          <TextInput id="rfb-a11y-label" value={readNodeLabel(node)} onChange={(event) => actions.onUpdateLabel(node.id, event.currentTarget.value)} />
        </InspectorRow>
        <InspectorRow label={actions.messages.description} htmlFor="rfb-a11y-description">
          <Textarea id="rfb-a11y-description" value={String(node.description ?? "")} onChange={(event) => actions.onUpdateDescription(node.id, event.currentTarget.value)} />
        </InspectorRow>
      </div>
    );
  }
  if (panel === "data") {
    if (!isSubmittableNode(node)) {
      return (
        <div className="rfb-stack">
          <Alert severity="info">This block does not create submitted data.</Alert>
          <InspectorRow label={actions.messages.nodeId} htmlFor="rfb-data-id">
            <TextInput id="rfb-data-id" dir="ltr" value={node.id} readOnly />
          </InspectorRow>
        </div>
      );
    }
    return (
      <div className="rfb-stack">
        <InspectorRow label={actions.messages.submittedPath} htmlFor="rfb-data-name" help="Unsafe paths fail closed through builder diagnostics.">
          <TextInput id="rfb-data-name" dir="ltr" value={String(node.name ?? "")} onChange={(event) => actions.onUpdateSubmittedName(node.id, event.currentTarget.value)} />
        </InspectorRow>
        <InspectorRow label={actions.messages.nodeId} htmlFor="rfb-data-id">
          <TextInput id="rfb-data-id" dir="ltr" value={node.id} readOnly />
        </InspectorRow>
      </div>
    );
  }
  return (
    <div className="rfb-stack">
      <InspectorRow label={actions.messages.label} htmlFor="rfb-content-label">
        <TextInput id="rfb-content-label" value={readNodeLabel(node)} onChange={(event) => actions.onUpdateLabel(node.id, event.currentTarget.value)} />
      </InspectorRow>
      <InspectorRow label={actions.messages.description} htmlFor="rfb-content-description">
        <Textarea id="rfb-content-description" value={String(node.description ?? "")} onChange={(event) => actions.onUpdateDescription(node.id, event.currentTarget.value)} />
      </InspectorRow>
      {isFieldNode(node) ? (
        <InspectorRow label={actions.messages.placeholder} htmlFor="rfb-content-placeholder">
          <TextInput id="rfb-content-placeholder" value={String(node.placeholder ?? "")} onChange={(event) => actions.onUpdatePlaceholder(node.id, event.currentTarget.value)} />
        </InspectorRow>
      ) : null}
      <ContentLayoutSettings node={node} onUpdate={(properties) => actions.onUpdateNodeProperties(node.id, properties)} />
      {supportsOptions(node) ? (
        <OptionsEditor
          node={node}
          onUpdateOptions={(options) => actions.onUpdateOptions(node.id, options)}
          onUpdateDefaultValue={(value) => actions.onUpdateDefaultValue(node.id, value)}
        />
      ) : null}
    </div>
  );
}

function ValidationEditor(props: {
  node: BuilderNode;
  onUpdateValidation: (validation: BuilderValidationRule[]) => void;
}): ReactNode {
  if (!isFieldNode(props.node)) {
    return (
      <div className="rfb-stack">
        <Alert severity="info">This block is not submittable, so field validation rules do not apply.</Alert>
      </div>
    );
  }
  const validation = props.node.validation ?? [];
  const setRule = (type: string, enabled: boolean, params?: Record<string, unknown>) => {
    props.onUpdateValidation(setValidationRule(validation, type, enabled, params));
  };
  const setRuleParam = (type: string, key: string, rawValue: string) => {
    const value = rawValue === "" ? undefined : Number(rawValue);
    props.onUpdateValidation(setValidationRuleParam(validation, type, key, Number.isFinite(value) ? value : undefined));
  };

  return (
    <div className="rfb-stack">
      <label className="rfb-inline">
        <input
          type="checkbox"
          checked={isRequiredNode(props.node)}
          onChange={(event) => setRule("required", event.currentTarget.checked)}
        />
        Required field
      </label>
      <Alert severity="warning">Changing requiredness can affect stored responses.</Alert>
      {supportsTextValidation(props.node) ? (
        <>
          <NumberRuleInput
            id="rfb-validation-min-length"
            label="Minimum characters"
            rule={findValidationRule(validation, "minLength")}
            paramKey="min"
            onChange={(value) => setRuleParam("minLength", "min", value)}
          />
          <NumberRuleInput
            id="rfb-validation-max-length"
            label="Maximum characters"
            rule={findValidationRule(validation, "maxLength")}
            paramKey="max"
            onChange={(value) => setRuleParam("maxLength", "max", value)}
          />
          <InspectorRow label="Pattern" htmlFor="rfb-validation-pattern" help="Regular expression pattern. Unsupported regex features fail closed in core validation.">
            <TextInput
              id="rfb-validation-pattern"
              dir="ltr"
              value={String(readRuleParam(findValidationRule(validation, "pattern"), "pattern") ?? "")}
              onChange={(event) => {
                const pattern = event.currentTarget.value;
                setRule("pattern", pattern.trim().length > 0, pattern.trim() ? { pattern } : undefined);
              }}
            />
          </InspectorRow>
        </>
      ) : null}
      {supportsNumberValidation(props.node) ? (
        <>
          <NumberRuleInput
            id="rfb-validation-min-number"
            label="Minimum number"
            rule={findValidationRule(validation, "min")}
            paramKey="min"
            onChange={(value) => setRuleParam("min", "min", value)}
          />
          <NumberRuleInput
            id="rfb-validation-max-number"
            label="Maximum number"
            rule={findValidationRule(validation, "max")}
            paramKey="max"
            onChange={(value) => setRuleParam("max", "max", value)}
          />
        </>
      ) : null}
      {props.node.fieldType === "email" ? (
        <label className="rfb-inline">
          <input
            type="checkbox"
            checked={hasValidationRule(validation, "email")}
            onChange={(event) => setRule("email", event.currentTarget.checked)}
          />
          Validate email format
        </label>
      ) : null}
      {props.node.fieldType === "url" ? (
        <label className="rfb-inline">
          <input
            type="checkbox"
            checked={hasValidationRule(validation, "url")}
            onChange={(event) => setRule("url", event.currentTarget.checked)}
          />
          Validate URL format
        </label>
      ) : null}
      {props.node.fieldType === "checkboxGroup" ? (
        <>
          <NumberRuleInput
            id="rfb-validation-min-selected"
            label="Minimum selected"
            rule={findValidationRule(validation, "selectionCount")}
            paramKey="min"
            onChange={(value) => setSelectionCountParam(validation, props.onUpdateValidation, "min", value)}
          />
          <NumberRuleInput
            id="rfb-validation-max-selected"
            label="Maximum selected"
            rule={findValidationRule(validation, "selectionCount")}
            paramKey="max"
            onChange={(value) => setSelectionCountParam(validation, props.onUpdateValidation, "max", value)}
          />
        </>
      ) : null}
    </div>
  );
}

function NumberRuleInput(props: {
  id: string;
  label: string;
  rule: BuilderValidationRule | undefined;
  paramKey: string;
  onChange: (value: string) => void;
}): ReactNode {
  return (
    <InspectorRow label={props.label} htmlFor={props.id}>
      <TextInput
        id={props.id}
        type="number"
        dir="ltr"
        value={String(readRuleParam(props.rule, props.paramKey) ?? "")}
        onChange={(event) => props.onChange(event.currentTarget.value)}
      />
    </InspectorRow>
  );
}

function LogicEditor(props: {
  node: BuilderNode;
  schema: BuilderSchema;
  onUpdateVisibility: (condition: unknown) => void;
  onUpdateValidation: (validation: BuilderValidationRule[]) => void;
}): ReactNode {
  const fields = props.schema.nodes.filter((node) => node.id !== props.node.id && typeof node.name === "string");
  const visibility = readVisualCondition(props.node.visibility);
  const conditionalRequired = readVisualCondition(findValidationRule(props.node.validation, "required")?.when);
  const preserveHiddenValues = Boolean(props.schema.settings?.preserveHiddenValues);
  const updateVisibility = (next: VisualConditionState) => {
    props.onUpdateVisibility(visualConditionToSchema(next));
  };
  const updateConditionalRequired = (next: VisualConditionState, enabled: boolean) => {
    const condition = enabled ? visualConditionToSchema(next) : undefined;
    props.onUpdateValidation(setRequiredCondition(props.node.validation ?? [], enabled, condition));
  };

  return (
    <div className="rfb-stack">
      {props.node.type === "hidden" ? (
        <Alert severity="info">
          Hidden values are {preserveHiddenValues ? "preserved in submissions" : "excluded from submissions unless explicitly preserved"} by the current form settings.
        </Alert>
      ) : (
        <Alert severity="info">
          Hidden fields are excluded from final submissions unless the schema opts into preserving hidden values.
        </Alert>
      )}
      <section className="rfb-stack" aria-label="Visibility logic">
        <div className="rfb-inline">
          <strong>Visibility</strong>
          <Select
            aria-label="Visibility behavior"
            value={visibility.behavior}
            onChange={(event) => {
              const behavior = event.currentTarget.value as VisualConditionBehavior;
              updateVisibility({
                ...visibility,
                behavior,
                rows: behavior === "always" ? visibility.rows : ensureConditionRows(visibility.rows, fields)
              });
            }}
          >
            <option value="always">Always show</option>
            <option value="showWhen">Show when conditions match</option>
            <option value="hideWhen">Hide when conditions match</option>
          </Select>
        </div>
        {visibility.supported ? null : <Alert severity="warning">This field has an existing condition shape that the visual editor cannot fully edit yet.</Alert>}
        {visibility.behavior !== "always" ? (
          <VisualConditionRows
            idPrefix="visibility"
            fields={fields}
            state={visibility}
            onChange={updateVisibility}
          />
        ) : null}
      </section>
      <section className="rfb-stack" aria-label="Conditional requiredness">
        <label className="rfb-inline">
          <input
            type="checkbox"
            checked={conditionalRequired.behavior !== "always"}
            onChange={(event) => updateConditionalRequired(
              conditionalRequired.behavior === "always"
                ? { ...conditionalRequired, behavior: "showWhen", rows: ensureConditionRows(conditionalRequired.rows, fields) }
                : conditionalRequired,
              event.currentTarget.checked
            )}
          />
          Require only when conditions match
        </label>
        {conditionalRequired.supported ? null : <Alert severity="warning">The existing required condition is not editable by this visual builder yet.</Alert>}
        {conditionalRequired.behavior !== "always" ? (
          <VisualConditionRows
            idPrefix="required"
            fields={fields}
            state={conditionalRequired}
            onChange={(next) => updateConditionalRequired(next, true)}
          />
        ) : null}
      </section>
      <details className="rfb-workflow-card">
        <summary>Advanced condition JSON</summary>
        <pre className="rfb-code rfb-artifact-code" aria-label="Read-only condition JSON">
          {JSON.stringify({
            visibility: props.node.visibility ?? null,
            requiredWhen: findValidationRule(props.node.validation, "required")?.when ?? null
          }, null, 2)}
        </pre>
      </details>
      <Alert severity="warning">
        Phase 16 supports show, hide, and conditional requiredness. Skip logic, redirects, calculations, option filtering, and branching need later contracts.
      </Alert>
    </div>
  );
}

function VisualConditionRows(props: {
  idPrefix: string;
  fields: BuilderNode[];
  state: VisualConditionState;
  onChange: (state: VisualConditionState) => void;
}): ReactNode {
  const rows = props.state.rows.length > 0 ? props.state.rows : [emptyConditionRow(props.fields)];
  const updateRow = (index: number, patch: Partial<VisualConditionRow>) => {
    props.onChange({ ...props.state, rows: rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row) });
  };
  const addRow = () => {
    props.onChange({ ...props.state, rows: [...rows, emptyConditionRow(props.fields)] });
  };
  const removeRow = (index: number) => {
    props.onChange({ ...props.state, rows: rows.filter((_row, rowIndex) => rowIndex !== index) });
  };

  return (
    <div className="rfb-stack">
      <InspectorRow label="Condition match" htmlFor={`rfb-${props.idPrefix}-group`}>
        <Select
          id={`rfb-${props.idPrefix}-group`}
          value={props.state.group}
          onChange={(event) => props.onChange({ ...props.state, group: event.currentTarget.value as VisualConditionGroup })}
        >
          <option value="all">All conditions</option>
          <option value="any">Any condition</option>
        </Select>
      </InspectorRow>
      {rows.map((row, index) => (
        <fieldset className="rfb-workflow-card" key={`${props.idPrefix}-${index}`}>
          <legend>{`Condition ${index + 1}`}</legend>
          <InspectorRow label="Field" htmlFor={`rfb-${props.idPrefix}-field-${index}`}>
            <Select
              id={`rfb-${props.idPrefix}-field-${index}`}
              value={row.field}
              onChange={(event) => updateRow(index, { field: event.currentTarget.value })}
            >
              {props.fields.map((field) => (
                <option key={field.id} value={String(field.name)}>
                  {readNodeLabel(field)}
                </option>
              ))}
            </Select>
          </InspectorRow>
          <InspectorRow label="Operator" htmlFor={`rfb-${props.idPrefix}-op-${index}`}>
            <Select
              id={`rfb-${props.idPrefix}-op-${index}`}
              value={row.op}
              onChange={(event) => updateRow(index, { op: event.currentTarget.value as VisualConditionOperator })}
            >
              <option value="eq">Equals</option>
              <option value="neq">Does not equal</option>
              <option value="notEmpty">Is filled</option>
              <option value="empty">Is empty</option>
              <option value="contains">Contains</option>
              <option value="gt">Greater than</option>
              <option value="gte">Greater than or equal</option>
              <option value="lt">Less than</option>
              <option value="lte">Less than or equal</option>
            </Select>
          </InspectorRow>
          {conditionNeedsValue(row.op) ? (
            <InspectorRow label="Value" htmlFor={`rfb-${props.idPrefix}-value-${index}`}>
              <TextInput
                id={`rfb-${props.idPrefix}-value-${index}`}
                dir="ltr"
                value={row.value}
                onChange={(event) => updateRow(index, { value: event.currentTarget.value })}
              />
            </InspectorRow>
          ) : null}
          <IconButton type="button" aria-label={`Remove condition ${index + 1}`} onClick={() => removeRow(index)} disabled={rows.length === 1}>×</IconButton>
        </fieldset>
      ))}
      <Button type="button" onClick={addRow}>Add condition</Button>
    </div>
  );
}

function OptionsEditor(props: {
  node: BuilderNode;
  onUpdateOptions: (options: BuilderOption[]) => void;
  onUpdateDefaultValue: (value: unknown) => void;
}): ReactNode {
  const options = props.node.options ?? [];
  const [bulkText, setBulkText] = useState("");
  const isMulti = props.node.fieldType === "checkboxGroup";

  const updateAt = (index: number, patch: Partial<BuilderOption>) => {
    props.onUpdateOptions(options.map((option, optionIndex) => optionIndex === index ? { ...option, ...patch } : option));
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= options.length) {
      return;
    }
    const next = [...options];
    const [option] = next.splice(index, 1);
    if (option) {
      next.splice(target, 0, option);
      props.onUpdateOptions(next);
    }
  };
  const addOption = (label = "New option") => {
    props.onUpdateOptions([...options, createOption(label, options)]);
  };
  const duplicate = (index: number) => {
    const source = options[index];
    if (!source) {
      return;
    }
    props.onUpdateOptions([
      ...options.slice(0, index + 1),
      createOption(`${source.label} copy`, options, `${source.value}_copy`),
      ...options.slice(index + 1)
    ]);
  };
  const remove = (index: number) => {
    const removed = options[index];
    const next = options.filter((_option, optionIndex) => optionIndex !== index);
    props.onUpdateOptions(next);
    if (removed && isDefaultSelected(props.node, removed.value)) {
      props.onUpdateDefaultValue(isMulti ? removeFromDefaultArray(props.node.defaultValue, removed.value) : undefined);
    }
  };
  const setDefault = (value: string, checked: boolean) => {
    if (isMulti) {
      props.onUpdateDefaultValue(updateDefaultArray(props.node.defaultValue, value, checked));
      return;
    }
    props.onUpdateDefaultValue(checked ? value : undefined);
  };
  const bulkAdd = () => {
    const created = parseBulkOptions(bulkText, options);
    if (created.length > 0) {
      props.onUpdateOptions([...options, ...created]);
      setBulkText("");
    }
  };

  return (
    <section className="rfb-stack" aria-label="Structured options editor">
      <div className="rfb-inline">
        <strong>Options</strong>
        <Button type="button" onClick={() => addOption()}>Add option</Button>
      </div>
      {options.map((option, index) => (
        <fieldset className="rfb-workflow-card" key={option.id ?? `${option.value}-${index}`}>
          <legend className="rfb-sr-only">{`Option ${index + 1}`}</legend>
          <InspectorRow label={`Option ${index + 1} label`} htmlFor={`rfb-option-label-${option.id ?? index}`}>
            <TextInput
              id={`rfb-option-label-${option.id ?? index}`}
              value={option.label}
              onChange={(event) => updateAt(index, { label: event.currentTarget.value })}
            />
          </InspectorRow>
          <InspectorRow label={`Option ${index + 1} submitted value`} htmlFor={`rfb-option-value-${option.id ?? index}`} help="Changing this value can affect stored responses.">
            <TextInput
              id={`rfb-option-value-${option.id ?? index}`}
              dir="ltr"
              value={option.value}
              onChange={(event) => updateAt(index, { value: slug(event.currentTarget.value) })}
            />
          </InspectorRow>
          <div className="rfb-inline">
            <label className="rfb-inline">
              <input
                type={isMulti ? "checkbox" : "radio"}
                name={`default-${props.node.id}`}
                checked={isDefaultSelected(props.node, option.value)}
                onChange={(event) => setDefault(option.value, event.currentTarget.checked)}
              />
              Default
            </label>
            <label className="rfb-inline">
              <input
                type="checkbox"
                checked={Boolean(option.disabled)}
                onChange={(event) => {
                  const checked = event.currentTarget.checked;
                  props.onUpdateOptions(options.map((item, optionIndex) => {
                    if (optionIndex !== index) {
                      return item;
                    }
                    if (checked) {
                      return { ...item, disabled: true };
                    }
                    const enabledOption = { ...item };
                    delete enabledOption.disabled;
                    return enabledOption;
                  }));
                }}
              />
              Disabled
            </label>
          </div>
          <div className="rfb-inline" aria-label={`Actions for option ${index + 1}`}>
            <IconButton type="button" aria-label={`Move option ${index + 1} up`} onClick={() => move(index, -1)}>↑</IconButton>
            <IconButton type="button" aria-label={`Move option ${index + 1} down`} onClick={() => move(index, 1)}>↓</IconButton>
            <IconButton type="button" aria-label={`Duplicate option ${index + 1}`} onClick={() => duplicate(index)}>⧉</IconButton>
            <IconButton type="button" aria-label={`Delete option ${index + 1}`} onClick={() => remove(index)}>×</IconButton>
          </div>
        </fieldset>
      ))}
      <InspectorRow label="Bulk add options" htmlFor="rfb-content-options-bulk" help="Paste one label per line, or label=value to provide stable submitted values.">
        <Textarea id="rfb-content-options-bulk" value={bulkText} onChange={(event) => setBulkText(event.currentTarget.value)} />
      </InspectorRow>
      <Button type="button" onClick={bulkAdd} disabled={bulkText.trim().length === 0}>Add pasted options</Button>
    </section>
  );
}

function ContentLayoutSettings(props: {
  node: BuilderNode;
  onUpdate: (properties: Partial<BuilderNode>) => void;
}): ReactNode {
  const updateProps = (patch: Record<string, unknown>) => {
    props.onUpdate({ props: { ...(props.node.props ?? {}), ...patch } });
  };

  if (props.node.type === "content" && props.node.contentType === "paragraph") {
    return (
      <InspectorRow label="Body text" htmlFor="rfb-content-body">
        <Textarea
          id="rfb-content-body"
          value={String(props.node.props?.text ?? "")}
          onChange={(event) => updateProps({ text: event.currentTarget.value })}
        />
      </InspectorRow>
    );
  }

  if (props.node.type === "content" && props.node.contentType === "image") {
    return (
      <>
        <InspectorRow label="Image URL" htmlFor="rfb-content-image-src">
          <TextInput
            id="rfb-content-image-src"
            dir="ltr"
            value={String(props.node.props?.src ?? "")}
            onChange={(event) => updateProps({ src: event.currentTarget.value })}
          />
        </InspectorRow>
        <InspectorRow label="Alt text" htmlFor="rfb-content-image-alt" help="Required for accessibility and publish checks.">
          <TextInput
            id="rfb-content-image-alt"
            value={String(props.node.props?.alt ?? "")}
            onChange={(event) => updateProps({ alt: event.currentTarget.value })}
          />
        </InspectorRow>
        <InspectorRow label="Caption" htmlFor="rfb-content-image-caption">
          <TextInput
            id="rfb-content-image-caption"
            value={String(props.node.props?.caption ?? "")}
            onChange={(event) => updateProps({ caption: event.currentTarget.value })}
          />
        </InspectorRow>
      </>
    );
  }

  if (props.node.type === "content" && props.node.contentType === "heading") {
    return (
      <InspectorRow label="Heading level" htmlFor="rfb-content-heading-level">
        <Select
          id="rfb-content-heading-level"
          value={String(props.node.props?.level ?? 3)}
          onChange={(event) => updateProps({ level: Number(event.currentTarget.value) })}
        >
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </Select>
      </InspectorRow>
    );
  }

  if (props.node.type === "content" && props.node.contentType === "spacer") {
    return (
      <InspectorRow label="Spacer size" htmlFor="rfb-content-spacer-size">
        <Select
          id="rfb-content-spacer-size"
          value={String(props.node.props?.size ?? "medium")}
          onChange={(event) => updateProps({ size: event.currentTarget.value })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Select>
      </InspectorRow>
    );
  }

  if (props.node.type === "section" || props.node.type === "step") {
    return <Alert severity="info">Fields can be moved into this block through command APIs; nested visual editing is planned after this phase.</Alert>;
  }

  if (props.node.type === "ending") {
    return <Alert severity="info">This ending screen replaces the form after a successful submission.</Alert>;
  }

  return null;
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
    updateDefaultValue: (nodeId: string, value: unknown) => BuilderCommandResult;
    updateRequired: (nodeId: string, required: boolean) => BuilderCommandResult;
    updateValidationRules: (nodeId: string, validation: BuilderValidationRule[]) => BuilderCommandResult;
    updateCondition: (nodeId: string, conditionText: string) => BuilderCommandResult;
    updateVisibilityCondition: (nodeId: string, condition: unknown) => BuilderCommandResult;
    updateNodeProperties: (nodeId: string, properties: Partial<BuilderNode>) => BuilderCommandResult;
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
    updateDefaultValue: (nodeId: string, value: unknown) => run(() =>
      store.executeCommand("updateNodeProperties", (schema) => updateNodeProperties(schema, { nodeId, properties: { defaultValue: value } }))
    ),
    updateRequired: (nodeId: string, required: boolean) => run(() =>
      store.executeCommand("updateValidation", (schema) => updateValidation(schema, { nodeId, validation: setRequired(readNode(schema, nodeId)?.validation, required) }))
    ),
    updateValidationRules: (nodeId: string, validation: BuilderValidationRule[]) => run(() =>
      store.executeCommand("updateValidation", (schema) => updateValidation(schema, { nodeId, validation }))
    ),
    updateCondition: (nodeId: string, conditionText: string) => run(() =>
      store.executeCommand("updateCondition", (schema) => updateCondition(schema, { nodeId, target: "visibility", condition: parseCondition(conditionText) }))
    ),
    updateVisibilityCondition: (nodeId: string, condition: unknown) => run(() =>
      store.executeCommand("updateCondition", (schema) => updateCondition(schema, { nodeId, target: "visibility", condition }))
    ),
    updateNodeProperties: (nodeId: string, properties: Partial<BuilderNode>) => run(() =>
      store.executeCommand("updateNodeProperties", (schema) => updateNodeProperties(schema, { nodeId, properties }))
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
  fieldDefinition("url", "URL", "Website or link input", "Basic", "↗"),
  fieldDefinition("number", "Number", "Numeric response", "Basic", "1"),
  fieldDefinition("date", "Date", "Calendar date input", "Date and time", "D"),
  fieldDefinition("time", "Time", "Clock time input", "Date and time", "T"),
  fieldDefinition("select", "Dropdown", "Single select menu", "Choices", "V", [
    { id: "option_1", label: "First option", value: "first" },
    { id: "option_2", label: "Second option", value: "second" }
  ]),
  fieldDefinition("radio", "Radio group", "Visible single choice", "Choices", "O", [
    { id: "option_1", label: "Yes", value: "yes" },
    { id: "option_2", label: "No", value: "no" }
  ]),
  fieldDefinition("checkboxGroup", "Checkbox group", "Multiple choice list", "Choices", "☑", [
    { id: "option_1", label: "First option", value: "first" },
    { id: "option_2", label: "Second option", value: "second" }
  ]),
  fieldDefinition("checkbox", "Checkbox", "True or false choice", "Choices", "C"),
  fieldDefinition("switch", "Switch", "On or off toggle", "Choices", "S"),
  fieldDefinition("rating", "Rating", "Numeric rating response", "Survey", "★"),
  fieldDefinition("linearScale", "Linear scale", "Range scale response", "Survey", "—"),
  hiddenFieldDefinition(),
  readOnlyFieldDefinition(),
  fieldDefinition("fileMetadata", "File metadata", "Trusted file references", "Advanced", "F"),
  contentDefinition("heading", "Heading", "Section title text", "Content", "H"),
  contentDefinition("paragraph", "Paragraph", "Explanatory text block", "Content", "P"),
  contentDefinition("image", "Image", "Image with required alt text", "Content", "I"),
  contentDefinition("divider", "Divider", "Horizontal divider", "Layout", "—"),
  contentDefinition("spacer", "Spacer", "Vertical spacing block", "Layout", "↕"),
  contentDefinition("welcome", "Welcome screen", "Intro screen before questions", "Layout", "W"),
  containerDefinition("section", "Section", "Grouped form area", "Layout", "§"),
  containerDefinition("step", "Page / step", "Multi-page form step", "Layout", "□"),
  endingDefinition()
];

export const builderMessageDictionaries = {
  en: {
    components: "Components",
    searchComponents: "Search components",
    inspector: "Inspector",
    selectFieldSettings: "Select a field to edit settings.",
    nothingSelected: "Nothing selected",
    nothingSelectedDescription: "Select a canvas field to edit its settings.",
    content: "Content",
    validation: "Validation",
    logic: "Logic",
    accessibility: "Accessibility",
    data: "Data",
    preview: "Preview",
    edit: "Edit",
    saveDraft: "Save draft",
    saving: "Saving",
    publish: "Publish",
    label: "Label",
    description: "Description",
    placeholder: "Placeholder",
    submittedPath: "Submitted path",
    nodeId: "Node id"
  },
  fa: {
    components: "اجزای فرم",
    searchComponents: "جستجوی اجزا",
    inspector: "تنظیمات",
    selectFieldSettings: "یک فیلد را برای ویرایش تنظیمات انتخاب کنید.",
    nothingSelected: "چیزی انتخاب نشده",
    nothingSelectedDescription: "از بوم فرم یک فیلد را انتخاب کنید.",
    content: "محتوا",
    validation: "اعتبارسنجی",
    logic: "منطق",
    accessibility: "دسترس‌پذیری",
    data: "داده",
    preview: "پیش‌نمایش",
    edit: "ویرایش",
    saveDraft: "ذخیره پیش‌نویس",
    saving: "در حال ذخیره",
    publish: "انتشار",
    label: "برچسب",
    description: "توضیح",
    placeholder: "متن راهنما",
    submittedPath: "مسیر ارسالی",
    nodeId: "شناسه گره"
  }
} as const satisfies Record<string, BuilderMessages>;

function defaultBuilderMessages(locale: string): BuilderMessages {
  return locale.toLowerCase().startsWith("fa") ? builderMessageDictionaries.fa : builderMessageDictionaries.en;
}

type VisualConditionBehavior = "always" | "showWhen" | "hideWhen";
type VisualConditionGroup = "all" | "any";
type VisualConditionOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "empty" | "notEmpty" | "contains";

interface VisualConditionRow {
  field: string;
  op: VisualConditionOperator;
  value: string;
}

interface VisualConditionState {
  behavior: VisualConditionBehavior;
  group: VisualConditionGroup;
  rows: VisualConditionRow[];
  supported: boolean;
}

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

function hiddenFieldDefinition(): PaletteItemDefinition {
  return {
    fieldType: "hidden",
    label: "Hidden field",
    description: "Submitted value not shown to respondents",
    group: "Logic and system",
    icon: "H",
    createNode: ({ schema, index }) => {
      const id = uniqueNodeId(schema, `hidden_${index + 1}`);
      return {
        id,
        type: "hidden",
        fieldType: "hidden",
        name: uniqueSubmittedName(schema, "hidden_value"),
        label: "Hidden field",
        defaultValue: ""
      };
    }
  };
}

function readOnlyFieldDefinition(): PaletteItemDefinition {
  return {
    fieldType: "readOnly",
    label: "Read-only value",
    description: "Visible value respondents cannot edit",
    group: "Basic",
    icon: "R",
    createNode: ({ schema, index }) => {
      const id = uniqueNodeId(schema, `field_read_only_${index + 1}`);
      return {
        id,
        type: "field",
        fieldType: "text",
        name: uniqueSubmittedName(schema, "read_only_value"),
        label: "Read-only value",
        readOnly: true,
        defaultValue: "",
        validation: []
      };
    }
  };
}

function contentDefinition(
  contentType: "heading" | "paragraph" | "image" | "divider" | "spacer" | "welcome",
  label: string,
  description: string,
  group: string,
  icon: string
): PaletteItemDefinition {
  return {
    fieldType: `content:${contentType}`,
    label,
    description,
    group,
    icon,
    createNode: ({ schema, index }) => {
      const id = uniqueNodeId(schema, `content_${contentType}_${index + 1}`);
      return {
        id,
        type: "content",
        contentType,
        label,
        description: defaultContentDescription(contentType),
        props: defaultContentProps(contentType)
      };
    }
  };
}

function containerDefinition(type: "section" | "step", label: string, description: string, group: string, icon: string): PaletteItemDefinition {
  return {
    fieldType: type,
    label,
    description,
    group,
    icon,
    createNode: ({ schema, index }) => ({
      id: uniqueNodeId(schema, `${type}_${index + 1}`),
      type,
      label,
      description,
      children: []
    })
  };
}

function endingDefinition(): PaletteItemDefinition {
  return {
    fieldType: "ending",
    label: "Ending screen",
    description: "Thank-you screen after submission",
    group: "Layout",
    icon: "✓",
    createNode: ({ schema, index }) => ({
      id: uniqueNodeId(schema, `ending_${index + 1}`),
      type: "ending",
      label: "Thank you",
      description: "Your response has been received."
    })
  };
}

function defaultContentDescription(contentType: string): string {
  if (contentType === "welcome") {
    return "Introduce the form before respondents start.";
  }
  if (contentType === "image") {
    return "Add helpful visual context.";
  }
  if (contentType === "paragraph") {
    return "";
  }
  return "";
}

function defaultContentProps(contentType: string): Record<string, unknown> {
  if (contentType === "paragraph") {
    return { text: "Add explanatory text." };
  }
  if (contentType === "heading") {
    return { level: 3 };
  }
  if (contentType === "image") {
    return { src: "", alt: "", caption: "" };
  }
  if (contentType === "spacer") {
    return { size: "medium" };
  }
  return {};
}

function readNode(schema: BuilderSchema, nodeId: string): BuilderNode | undefined {
  return schema.nodes.find((node) => node.id === nodeId);
}

function findNode(schema: BuilderSchema, nodeId: string): BuilderNode | null {
  return readNode(schema, nodeId) ?? null;
}

function rootEditableNodes(schema: BuilderSchema): BuilderNode[] {
  const childIds = new Set(schema.nodes.flatMap((node) => node.children ?? []));
  return schema.nodes.filter((node) => !childIds.has(node.id) && isEditableCanvasNode(node));
}

function readNodeLabel(node: BuilderNode): string {
  if (node.type === "content" && node.contentType === "paragraph" && typeof node.props?.text === "string" && node.props.text.trim()) {
    return node.label ?? node.props.text;
  }
  return node.label ?? node.name ?? node.id;
}

function nodeKindLabel(node: BuilderNode): string {
  if (node.type === "field" || node.type === "hidden") {
    return "Field";
  }
  if (node.type === "content") {
    return "Content block";
  }
  if (node.type === "section") {
    return "Section";
  }
  if (node.type === "step") {
    return "Step";
  }
  if (node.type === "ending") {
    return "Ending";
  }
  return "Node";
}

function nodeTypeLabel(node: BuilderNode): string {
  if (node.type === "content") {
    return String(node.contentType ?? "content");
  }
  return String(node.fieldType ?? node.type);
}

function previewTextForNode(node: BuilderNode): string {
  if (node.type === "content") {
    if (node.contentType === "heading") {
      return "Heading text block";
    }
    if (node.contentType === "paragraph") {
      return "Paragraph text block";
    }
    if (node.contentType === "image") {
      return "Image block with alt text";
    }
    if (node.contentType === "divider") {
      return "Divider block";
    }
    if (node.contentType === "spacer") {
      return "Spacer block";
    }
    if (node.contentType === "welcome") {
      return "Welcome screen";
    }
  }
  if (node.type === "section") {
    return `${node.children?.length ?? 0} child nodes`;
  }
  if (node.type === "step") {
    return "Page or step container";
  }
  if (node.type === "ending") {
    return "Thank-you ending screen";
  }
  if (node.fieldType === "select") {
    return "Dropdown preview";
  }
  if (node.fieldType === "radio") {
    return "Radio options preview";
  }
  if (node.fieldType === "checkbox") {
    return "Checkbox preview";
  }
  if (node.fieldType === "checkboxGroup") {
    return "Checkbox group preview";
  }
  if (node.fieldType === "switch") {
    return "Switch preview";
  }
  if (node.fieldType === "rating") {
    return "Rating preview";
  }
  if (node.fieldType === "linearScale") {
    return "Linear scale preview";
  }
  if (node.fieldType === "textarea") {
    return "Long text response preview";
  }
  if (node.type === "hidden") {
    return "Hidden submitted value";
  }
  if (node.readOnly) {
    return "Read-only response preview";
  }
  return `${node.fieldType ?? node.type} input preview`;
}

function isFieldNode(node: BuilderNode): boolean {
  return node.type === "field" || node.type === "hidden";
}

function isSubmittableNode(node: BuilderNode): boolean {
  return isFieldNode(node) && typeof node.name === "string";
}

function isEditableCanvasNode(node: BuilderNode): boolean {
  return isFieldNode(node) || node.type === "content" || node.type === "section" || node.type === "step" || node.type === "ending";
}

function supportsOptions(node: BuilderNode): boolean {
  return node.fieldType === "select" || node.fieldType === "radio" || node.fieldType === "checkboxGroup";
}

function isRequiredNode(node: BuilderNode): boolean {
  return (node.validation ?? []).some((rule) => rule.type === "required");
}

function setRequired(validation: BuilderValidationRule[] = [], required: boolean): BuilderValidationRule[] {
  const withoutRequired = validation.filter((rule) => rule.type !== "required");
  return required ? [{ type: "required" }, ...withoutRequired] : withoutRequired;
}

function hasValidationRule(validation: BuilderValidationRule[] = [], type: string): boolean {
  return validation.some((rule) => rule.type === type);
}

function findValidationRule(validation: BuilderValidationRule[] = [], type: string): BuilderValidationRule | undefined {
  return validation.find((rule) => rule.type === type);
}

function setValidationRule(
  validation: BuilderValidationRule[] = [],
  type: string,
  enabled: boolean,
  params?: Record<string, unknown>
): BuilderValidationRule[] {
  const withoutRule = validation.filter((rule) => rule.type !== type);
  if (!enabled) {
    return withoutRule;
  }
  return [...withoutRule, params ? { type, params } : { type }];
}

function setValidationRuleParam(
  validation: BuilderValidationRule[] = [],
  type: string,
  key: string,
  value: unknown
): BuilderValidationRule[] {
  const existing = findValidationRule(validation, type);
  const nextParams = { ...readRuleParams(existing) };
  if (value === undefined || value === "") {
    delete nextParams[key];
  } else {
    nextParams[key] = value;
  }
  const enabled = Object.keys(nextParams).length > 0;
  return setValidationRule(validation, type, enabled, nextParams);
}

function setSelectionCountParam(
  validation: BuilderValidationRule[],
  onUpdateValidation: (validation: BuilderValidationRule[]) => void,
  key: "min" | "max",
  rawValue: string
): void {
  const value = rawValue === "" ? undefined : Number(rawValue);
  onUpdateValidation(setValidationRuleParam(validation, "selectionCount", key, Number.isFinite(value) ? value : undefined));
}

function setRequiredCondition(
  validation: BuilderValidationRule[] = [],
  enabled: boolean,
  condition: unknown
): BuilderValidationRule[] {
  const withoutRequired = validation.filter((rule) => rule.type !== "required");
  if (!enabled || condition === undefined) {
    return withoutRequired;
  }
  return [{ type: "required", when: condition }, ...withoutRequired];
}

function readRuleParams(rule: BuilderValidationRule | undefined): Record<string, unknown> {
  return rule && typeof rule.params === "object" && rule.params !== null && !Array.isArray(rule.params)
    ? rule.params as Record<string, unknown>
    : {};
}

function readRuleParam(rule: BuilderValidationRule | undefined, key: string): unknown {
  return readRuleParams(rule)[key];
}

function supportsTextValidation(node: BuilderNode): boolean {
  return node.fieldType === "text" || node.fieldType === "textarea" || node.fieldType === "email" || node.fieldType === "url";
}

function supportsNumberValidation(node: BuilderNode): boolean {
  return node.fieldType === "number" || node.fieldType === "rating" || node.fieldType === "linearScale";
}

function readVisualCondition(condition: unknown): VisualConditionState {
  const empty: VisualConditionState = { behavior: "always", group: "all", rows: [], supported: true };
  if (condition === undefined || condition === null || condition === "") {
    return empty;
  }
  if (isRecord(condition) && "not" in condition) {
    const nested = readVisualCondition(condition.not);
    return { ...nested, behavior: nested.supported ? "hideWhen" : "always" };
  }
  const conditionRecord = isRecord(condition) ? condition : {};
  const group = Array.isArray(conditionRecord.all) ? "all" : Array.isArray(conditionRecord.any) ? "any" : null;
  const expressions = group ? conditionRecord[group] as unknown[] : [condition];
  const rows: VisualConditionRow[] = [];
  for (const expression of expressions) {
    if (!isRecord(expression) || typeof expression.field !== "string" || typeof expression.op !== "string" || !isVisualOperator(expression.op)) {
      return { ...empty, supported: false };
    }
    rows.push({
      field: expression.field,
      op: expression.op,
      value: conditionNeedsValue(expression.op) ? String(expression.value ?? "") : ""
    });
  }
  return { behavior: "showWhen", group: group ?? "all", rows, supported: true };
}

function visualConditionToSchema(state: VisualConditionState): unknown {
  if (state.behavior === "always") {
    return undefined;
  }
  const rows = state.rows.filter((row) => row.field.trim().length > 0);
  if (rows.length === 0) {
    return undefined;
  }
  const expressions = rows.map((row) => {
    const expression: Record<string, unknown> = { field: row.field, op: row.op };
    if (conditionNeedsValue(row.op)) {
      expression.value = coerceConditionValue(row.value);
    }
    return expression;
  });
  const condition = { [state.group]: expressions };
  return state.behavior === "hideWhen" ? { not: condition } : condition;
}

function emptyConditionRow(fields: BuilderNode[]): VisualConditionRow {
  return {
    field: String(fields[0]?.name ?? ""),
    op: "eq",
    value: ""
  };
}

function ensureConditionRows(rows: VisualConditionRow[], fields: BuilderNode[]): VisualConditionRow[] {
  return rows.length > 0 ? rows : [emptyConditionRow(fields)];
}

function conditionNeedsValue(op: VisualConditionOperator): boolean {
  return op !== "empty" && op !== "notEmpty";
}

function isVisualOperator(value: string): value is VisualConditionOperator {
  return ["eq", "neq", "gt", "gte", "lt", "lte", "empty", "notEmpty", "contains"].includes(value);
}

function coerceConditionValue(value: string): string | number | boolean {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  const numberValue = Number(value);
  return value.trim() !== "" && Number.isFinite(numberValue) ? numberValue : value;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function createOption(label: string, existing: BuilderOption[], preferredValue = label): BuilderOption {
  const value = uniqueOptionValue(existing, slug(preferredValue));
  return {
    id: uniqueOptionId(existing, `option_${value}`),
    label,
    value
  };
}

function parseBulkOptions(value: string, existing: BuilderOption[]): BuilderOption[] {
  const created: BuilderOption[] = [];
  for (const line of value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
    const [labelPart, valuePart] = line.split("=");
    const label = labelPart?.trim() || `Option ${existing.length + created.length + 1}`;
    created.push(createOption(label, [...existing, ...created], valuePart?.trim() || label));
  }
  return created;
}

function uniqueOptionValue(existing: BuilderOption[], baseValue: string): string {
  const values = new Set(existing.map((option) => option.value));
  let candidate = baseValue || "option";
  let index = 1;
  while (values.has(candidate)) {
    index += 1;
    candidate = `${baseValue}_${index}`;
  }
  return candidate;
}

function uniqueOptionId(existing: BuilderOption[], baseId: string): string {
  const ids = new Set(existing.map((option) => option.id).filter(Boolean));
  let candidate = baseId || "option";
  let index = 1;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${baseId}_${index}`;
  }
  return candidate;
}

function isDefaultSelected(node: BuilderNode, value: string): boolean {
  return Array.isArray(node.defaultValue) ? node.defaultValue.map(String).includes(value) : node.defaultValue === value;
}

function updateDefaultArray(defaultValue: unknown, value: string, checked: boolean): string[] {
  const current = Array.isArray(defaultValue) ? defaultValue.map(String) : [];
  if (checked && !current.includes(value)) {
    return [...current, value];
  }
  if (!checked) {
    return current.filter((item) => item !== value);
  }
  return current;
}

function removeFromDefaultArray(defaultValue: unknown, value: string): string[] {
  return Array.isArray(defaultValue) ? defaultValue.map(String).filter((item) => item !== value) : [];
}

function groupBy<T>(items: T[], keyForItem: (item: T) => string): Array<{ key: string; items: T[] }> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyForItem(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return Array.from(map.entries()).map(([key, groupItems]) => ({ key, items: groupItems }));
}
