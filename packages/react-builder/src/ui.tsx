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
  type BuilderCommandDiagnostic,
  type BuilderCommandResult,
  type BuilderEditorState,
  type BuilderEditorStore,
  type BuilderNode,
  type BuilderOption,
  type BuilderSchema,
  type BuilderValidationRule
} from "./index.js";

export interface BuilderWorkspaceProps {
  schema: BuilderSchema;
  store?: BuilderEditorStore;
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

  return (
    <div
      className={["rfb-builder", props.className].filter(Boolean).join(" ")}
      dir={direction}
      data-preview-mode={isPreview ? "true" : "false"}
      data-active-panel={state.activePanel}
    >
      <BuilderStyles />
      <CommandBar
        state={state}
        diagnostics={diagnostics}
        onUndo={actions.undo}
        onRedo={actions.redo}
        onTogglePreview={() => actions.setCanvasMode(isPreview ? "edit" : "preview")}
      />
      <div className="rfb-builder-layout">
        <Palette
          schema={state.schema}
          onAdd={(item) => actions.addFromPalette(item)}
        />
        <main className="rfb-canvas-region" role="region" aria-label="Form canvas">
          {isPreview ? (
            <PreviewFrame schema={state.schema} />
          ) : (
            <Canvas
              schema={state.schema}
              selectedNodeId={state.selectedNodeId}
              diagnostics={diagnostics}
              onSelect={actions.selectNode}
              onEditLabel={actions.updateLabel}
              onDuplicate={actions.duplicateNode}
              onDelete={actions.deleteNode}
              onMove={actions.moveNode}
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
.rfb-button:focus-visible,.rfb-icon-button:focus-visible,.rfb-input:focus-visible,.rfb-textarea:focus-visible,.rfb-select:focus-visible,.rfb-tab:focus-visible,.rfb-node:focus-visible{outline:3px solid var(--fb-focus);outline-offset:2px;}
.rfb-empty,.rfb-alert{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface-muted);padding:24px;color:var(--fb-muted);display:grid;gap:8px;}
.rfb-alert{padding:12px 14px;background:var(--fb-primary-container);color:var(--fb-on-primary-container);}
.rfb-alert[data-severity="error"]{background:#FFF2F0;color:var(--fb-danger);border-color:#FFD6D0;}
.rfb-alert[data-severity="warning"]{background:#FFF7E6;color:var(--fb-warning);border-color:#FFE0A3;}
.rfb-alert[data-severity="success"]{background:#ECFDF3;color:var(--fb-success);border-color:#B7E4CB;}
.rfb-badge{border-radius:999px;background:var(--fb-primary-container);color:var(--fb-on-primary-container);font-size:12px;line-height:16px;font-weight:700;min-block-size:24px;padding:4px 8px;display:inline-flex;align-items:center;max-inline-size:100%;}
.rfb-palette-search{margin-block-end:16px;}
.rfb-palette-group{display:grid;gap:8px;margin-block-end:18px;}
.rfb-palette-group h3{font-size:12px;line-height:16px;margin:0;color:var(--fb-muted);text-transform:uppercase;}
.rfb-palette-item{inline-size:100%;border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:10px;text-align:start;display:grid;grid-template-columns:32px 1fr;gap:10px;cursor:pointer;}
.rfb-palette-item:hover,.rfb-node:hover{border-color:var(--fb-border-strong);box-shadow:var(--fb-shadow);}
.rfb-palette-icon{block-size:32px;inline-size:32px;border-radius:var(--fb-radius-sm);background:var(--fb-primary-container);color:var(--fb-on-primary-container);display:grid;place-items:center;font-weight:800;}
.rfb-palette-copy{display:grid;gap:2px;min-inline-size:0;}
.rfb-palette-copy strong,.rfb-node-label{overflow-wrap:anywhere;}
.rfb-palette-copy span,.rfb-node-meta,.rfb-help{color:var(--fb-muted);font-size:12px;line-height:16px;}
.rfb-node{border:1px solid var(--fb-border);border-radius:var(--fb-radius);background:var(--fb-surface);padding:14px;display:grid;gap:10px;cursor:pointer;}
.rfb-node[data-selected="true"]{border-color:var(--fb-primary);box-shadow:0 0 0 3px var(--fb-primary-container);}
.rfb-node-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.rfb-node-title{display:grid;gap:3px;min-inline-size:0;}
.rfb-node-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;}
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
@media (max-width: 1024px){.rfb-builder-layout{grid-template-columns:260px minmax(320px,1fr);grid-template-areas:"palette canvas";}.rfb-inspector{position:fixed;inset-block:56px 0;inset-inline-start:0;inline-size:min(360px,88vw);z-index:10;box-shadow:0 12px 32px rgba(15,23,42,.14);}.rfb-builder[data-active-panel="preview"] .rfb-inspector{display:none;}}
@media (max-width: 720px){.rfb-command-bar{block-size:auto;min-block-size:56px;align-items:flex-start;flex-direction:column;padding-block:12px}.rfb-command-actions{inline-size:100%;overflow:auto}.rfb-builder-layout{display:flex;flex-direction:column;block-size:auto;min-block-size:0}.rfb-palette{border-inline-start:0;border-block-end:1px solid var(--fb-border);max-block-size:260px}.rfb-canvas-region{padding:16px}.rfb-inspector{position:static;inline-size:auto;box-shadow:none;border-inline-end:0;border-block-start:1px solid var(--fb-border)}.rfb-preview-frame{padding:16px}.rfb-builder{min-height:100vh;overflow:auto}}
@media (prefers-reduced-motion: no-preference){.rfb-button,.rfb-icon-button,.rfb-palette-item,.rfb-node,.rfb-tab{transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease,color .16s ease;}}
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
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
}): ReactNode {
  const isPreview = props.state.canvasMode === "preview";
  const errorCount = props.diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;
  const warningCount = props.diagnostics.filter((diagnostic) => diagnostic.severity === "warning").length;

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
            <button
              className="rfb-palette-item"
              type="button"
              key={item.fieldType}
              onClick={() => props.onAdd(item)}
              aria-label={`Add ${item.label}`}
            >
              <span className="rfb-palette-icon" aria-hidden="true">{item.icon}</span>
              <span className="rfb-palette-copy">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </span>
            </button>
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
        <EmptyState
          title="Start with a component"
          description="Use the component palette to add the first field to this form."
        />
      </div>
    );
  }
  return (
    <div className="rfb-canvas" aria-label="Editable form structure">
      {nodes.map((node, index) => (
        <CanvasNode
          key={node.id}
          node={node}
          index={index}
          selected={props.selectedNodeId === node.id}
          diagnostics={props.diagnostics.filter((diagnostic) => diagnostic.nodeId === node.id)}
          onSelect={props.onSelect}
          onEditLabel={props.onEditLabel}
          onDuplicate={props.onDuplicate}
          onDelete={props.onDelete}
          onMove={props.onMove}
        />
      ))}
    </div>
  );
}

function CanvasNode(props: {
  node: BuilderNode;
  index: number;
  selected: boolean;
  diagnostics: BuilderCommandDiagnostic[];
  onSelect: (nodeId: string) => void;
  onEditLabel: (nodeId: string, label: string) => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onMove: (nodeId: string, direction: "up" | "down") => void;
}): ReactNode {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(readNodeLabel(props.node));

  const commit = () => {
    const next = draft.trim();
    if (next) {
      props.onEditLabel(props.node.id, next);
    }
    setIsEditing(false);
  };

  return (
    <article
      className="rfb-node"
      tabIndex={0}
      data-selected={props.selected ? "true" : "false"}
      aria-label={`Field ${readNodeLabel(props.node)}`}
      onClick={() => props.onSelect(props.node.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          props.onSelect(props.node.id);
        }
      }}
    >
      <div className="rfb-node-header">
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
