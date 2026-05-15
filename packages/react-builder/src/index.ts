import { hasDangerousKey, isSubmittedPath } from "@your-org/forms-core";

export * from "./persistence.js";
export * from "./server-state.js";

export type BuilderDiagnosticSeverity = "warning" | "error";

export interface BuilderCommandDiagnostic {
  code: string;
  severity: BuilderDiagnosticSeverity;
  message: string;
  nodeId?: string;
  command?: BuilderCommandName;
  meta?: Record<string, unknown>;
}

export interface BuilderNode extends Record<string, unknown> {
  id: string;
  type: string;
  fieldType?: string;
  name?: string;
  label?: string;
  children?: string[];
  options?: BuilderOption[];
  validation?: BuilderValidationRule[];
  visibility?: unknown;
  enabledWhen?: unknown;
}

export interface BuilderOption extends Record<string, unknown> {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface BuilderValidationRule extends Record<string, unknown> {
  type: string;
}

export interface BuilderSchema extends Record<string, unknown> {
  schemaVersion: string;
  formId: string;
  revisionId: string;
  revisionHash: string;
  status: string;
  locale: string;
  direction?: "ltr" | "rtl";
  title?: string;
  settings?: Record<string, unknown>;
  nodes: BuilderNode[];
}

export type BuilderCommandName =
  | "addNode"
  | "deleteNode"
  | "duplicateNode"
  | "moveNode"
  | "updateLabel"
  | "updateSubmittedName"
  | "updateValidation"
  | "updateCondition"
  | "updateOptions"
  | "updateFieldType"
  | "updateNodeProperties"
  | "updateSettings";

export interface BuilderCommandResult {
  schema: BuilderSchema;
  changed: boolean;
  diagnostics: BuilderCommandDiagnostic[];
  command: BuilderCommandName;
  label?: string;
}

export interface AddNodeInput {
  node: BuilderNode;
  parentId?: string;
  position?: number;
}

export interface DeleteNodeInput {
  nodeId: string;
}

export interface DuplicateNodeInput {
  nodeId: string;
}

export interface MoveNodeInput {
  nodeId: string;
  parentId?: string;
  position?: number;
}

export interface UpdateNodeInput {
  nodeId: string;
}

export interface UpdateLabelInput extends UpdateNodeInput {
  label: string;
}

export interface UpdateSubmittedNameInput extends UpdateNodeInput {
  name: string;
}

export interface UpdateValidationInput extends UpdateNodeInput {
  validation: BuilderValidationRule[];
}

export interface UpdateConditionInput extends UpdateNodeInput {
  target: "visibility" | "enabledWhen";
  condition: unknown;
}

export interface UpdateOptionsInput extends UpdateNodeInput {
  options: BuilderOption[];
}

export interface UpdateFieldTypeInput extends UpdateNodeInput {
  fieldType: string;
}

export interface UpdateNodePropertiesInput extends UpdateNodeInput {
  properties: Partial<Omit<BuilderNode, "id" | "type" | "name" | "fieldType" | "validation" | "visibility" | "enabledWhen" | "options">>;
}

export interface UpdateSettingsInput {
  settings: Record<string, unknown>;
}

export interface BuilderHistoryEntry {
  command: BuilderCommandName;
  label: string;
  timestamp: string;
  previousSchema: BuilderSchema;
  nextSchema: BuilderSchema;
  diagnostics: BuilderCommandDiagnostic[];
}

export interface BuilderHistoryState {
  undo: BuilderHistoryEntry[];
  redo: BuilderHistoryEntry[];
  limit: number;
}

export type BuilderActivePanel = "content" | "validation" | "logic" | "accessibility" | "data" | "preview";
export type BuilderCanvasMode = "edit" | "preview" | "logic";

export interface BuilderDragState {
  activeNodeId?: string;
  overNodeId?: string;
  status: "idle" | "dragging" | "dropping" | "invalid";
}

export interface BuilderCommandStatus {
  lastCommand?: BuilderCommandName;
  diagnostics: BuilderCommandDiagnostic[];
}

export interface BuilderEditorState {
  schema: BuilderSchema;
  selectedNodeId: string | null;
  activePanel: BuilderActivePanel;
  canvasMode: BuilderCanvasMode;
  dragState: BuilderDragState;
  commandStatus: BuilderCommandStatus;
  history: BuilderHistoryState;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CreateEditorStoreOptions {
  schema: BuilderSchema;
  historyLimit?: number;
  clock?: () => string;
}

export interface BuilderEditorStore {
  getState: () => BuilderEditorState;
  selectNode: (nodeId: string | null) => void;
  setActivePanel: (panel: BuilderActivePanel) => void;
  setCanvasMode: (mode: BuilderCanvasMode) => void;
  setDragState: (state: BuilderDragState) => void;
  executeCommand: (
    command: BuilderCommandName,
    executor: (schema: BuilderSchema) => BuilderCommandResult
  ) => BuilderCommandResult;
  undo: () => BuilderCommandResult | null;
  redo: () => BuilderCommandResult | null;
}

export function addNode(schema: BuilderSchema, input: AddNodeInput): BuilderCommandResult {
  const diagnostics = validateSchemaAndNode("addNode", schema, input.node);
  if (findNode(schema, input.node.id)) {
    diagnostics.push(error("duplicate_node_id", "Node id already exists.", "addNode", input.node.id));
  }
  if (input.parentId && !findNode(schema, input.parentId)) {
    diagnostics.push(error("missing_target_node", "Parent node does not exist.", "addNode", input.parentId));
  }
  if (hasErrors(diagnostics)) {
    return result("addNode", schema, false, diagnostics);
  }

  const next = cloneSchema(schema);
  next.nodes.push(cloneNode(input.node));
  if (input.parentId) {
    const parent = findNode(next, input.parentId);
    if (parent) {
      parent.children = insertInto(parent.children ?? [], input.node.id, input.position);
    }
  }
  return result("addNode", next, !sameSchema(schema, next), diagnostics);
}

export function deleteNode(schema: BuilderSchema, input: DeleteNodeInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  if (!target) {
    return result("deleteNode", schema, false, [error("missing_target_node", "Node does not exist.", "deleteNode", input.nodeId)]);
  }
  const idsToDelete = collectDescendantIds(schema, input.nodeId);
  idsToDelete.add(input.nodeId);
  const diagnostics = [...schema.nodes.filter((node) => idsToDelete.has(node.id) && isSubmittable(node)).map((node) =>
    warning("dangerous_field_deleted", "Deleting a submittable field can break stored responses.", "deleteNode", node.id, {
      submittedPath: node.name
    })
  )];
  const next = cloneSchema(schema);
  next.nodes = next.nodes
    .filter((node) => !idsToDelete.has(node.id))
    .map((node) => ({ ...node, children: (node.children ?? []).filter((id) => !idsToDelete.has(id)) }));
  return result("deleteNode", next, !sameSchema(schema, next), diagnostics);
}

export function duplicateNode(schema: BuilderSchema, input: DuplicateNodeInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  if (!target) {
    return result("duplicateNode", schema, false, [error("missing_target_node", "Node does not exist.", "duplicateNode", input.nodeId)]);
  }
  const next = cloneSchema(schema);
  const duplicate = cloneNode(target);
  duplicate.id = uniqueId(schema, target.id);
  if (duplicate.name) {
    duplicate.name = uniqueSubmittedName(schema, duplicate.name);
  }
  next.nodes.splice(indexAfter(next, target.id), 0, duplicate);
  const parent = findParent(next, target.id);
  if (parent) {
    const sourceIndex = parent.children?.indexOf(target.id) ?? -1;
    parent.children = insertInto(parent.children ?? [], duplicate.id, sourceIndex + 1);
  }
  return result("duplicateNode", next, true, []);
}

export function moveNode(schema: BuilderSchema, input: MoveNodeInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  if (!target) {
    return result("moveNode", schema, false, [error("missing_target_node", "Node does not exist.", "moveNode", input.nodeId)]);
  }
  if (input.parentId && !findNode(schema, input.parentId)) {
    return result("moveNode", schema, false, [error("missing_target_node", "Parent node does not exist.", "moveNode", input.parentId)]);
  }
  const next = cloneSchema(schema);
  for (const node of next.nodes) {
    if (node.children) {
      node.children = node.children.filter((id) => id !== input.nodeId);
    }
  }
  if (input.parentId) {
    const parent = findNode(next, input.parentId);
    if (parent) {
      parent.children = insertInto(parent.children ?? [], input.nodeId, input.position);
    }
  } else {
    const current = next.nodes.findIndex((node) => node.id === input.nodeId);
    const [node] = next.nodes.splice(current, 1);
    if (node) {
      next.nodes.splice(clampPosition(input.position, next.nodes.length), 0, node);
    }
  }
  return result("moveNode", next, !sameSchema(schema, next), []);
}

export function updateLabel(schema: BuilderSchema, input: UpdateLabelInput): BuilderCommandResult {
  return updateNode(schema, "updateLabel", input.nodeId, (node) => ({ ...node, label: input.label }));
}

export function updateSubmittedName(schema: BuilderSchema, input: UpdateSubmittedNameInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  if (!target) {
    return result("updateSubmittedName", schema, false, [error("missing_target_node", "Node does not exist.", "updateSubmittedName", input.nodeId)]);
  }
  if (!isSubmittedPath(input.name)) {
    return result("updateSubmittedName", schema, false, [error("invalid_submitted_path", "Submitted path is invalid or unsafe.", "updateSubmittedName", input.nodeId)]);
  }
  if (target.name === input.name) {
    return result("updateSubmittedName", schema, false, []);
  }
  const diagnostics = [
    warning("dangerous_submitted_path_renamed", "Changing a submitted path can break stored responses.", "updateSubmittedName", input.nodeId, {
      from: target.name,
      to: input.name
    }),
    ...shapeDiagnostics("updateSubmittedName", input.nodeId, target.name, input.name)
  ];
  return updateNode(schema, "updateSubmittedName", input.nodeId, (node) => ({ ...node, name: input.name }), diagnostics);
}

export function updateValidation(schema: BuilderSchema, input: UpdateValidationInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  const diagnostics = target && requirednessChanged(target.validation, input.validation)
    ? [warning("dangerous_requiredness_changed", "Changing requiredness can affect response compatibility.", "updateValidation", input.nodeId)]
    : [];
  return updateNode(schema, "updateValidation", input.nodeId, (node) => ({ ...node, validation: clone(input.validation) }), diagnostics);
}

export function updateCondition(schema: BuilderSchema, input: UpdateConditionInput): BuilderCommandResult {
  return updateNode(schema, "updateCondition", input.nodeId, (node) => ({ ...node, [input.target]: clone(input.condition) }));
}

export function updateOptions(schema: BuilderSchema, input: UpdateOptionsInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  const diagnostics = target ? optionDiagnostics(target.options, input.options, input.nodeId) : [];
  return updateNode(schema, "updateOptions", input.nodeId, (node) => ({ ...node, options: clone(input.options) }), diagnostics);
}

export function updateFieldType(schema: BuilderSchema, input: UpdateFieldTypeInput): BuilderCommandResult {
  const target = findNode(schema, input.nodeId);
  const diagnostics = target && target.fieldType !== input.fieldType
    ? [
        warning("dangerous_field_type_changed", "Changing field type can affect stored response shape.", "updateFieldType", input.nodeId, {
          from: target.fieldType,
          to: input.fieldType
        }),
        ...shapeDiagnostics("updateFieldType", input.nodeId, target.fieldType, input.fieldType)
      ]
    : [];
  return updateNode(schema, "updateFieldType", input.nodeId, (node) => ({ ...node, fieldType: input.fieldType }), diagnostics);
}

export function updateNodeProperties(schema: BuilderSchema, input: UpdateNodePropertiesInput): BuilderCommandResult {
  return updateNode(schema, "updateNodeProperties", input.nodeId, (node) => ({
    ...node,
    ...clone(input.properties)
  }));
}

export function updateSettings(schema: BuilderSchema, input: UpdateSettingsInput): BuilderCommandResult {
  if (hasDangerousKey(input.settings)) {
    return result("updateSettings", schema, false, [error("dangerous_key", "Settings contain a dangerous key.", "updateSettings")]);
  }
  const diagnostics = schema.settings?.preserveHiddenValues !== input.settings.preserveHiddenValues
    ? [
        warning(
          "dangerous_hidden_value_policy_changed",
          "Changing hidden value policy can alter submitted data.",
          "updateSettings",
          undefined,
          { from: schema.settings?.preserveHiddenValues, to: input.settings.preserveHiddenValues }
        )
      ]
    : [];
  const next = cloneSchema(schema);
  next.settings = clone(input.settings);
  return result("updateSettings", next, !sameSchema(schema, next), diagnostics);
}

export function createEditorStore(options: CreateEditorStoreOptions): BuilderEditorStore {
  const clock = options.clock ?? (() => new Date().toISOString());
  let state: BuilderEditorState = withAvailability({
    schema: options.schema,
    selectedNodeId: null,
    activePanel: "content",
    canvasMode: "edit",
    dragState: { status: "idle" },
    commandStatus: { diagnostics: [] },
    history: { undo: [], redo: [], limit: options.historyLimit ?? 50 },
    canUndo: false,
    canRedo: false
  });

  const setState = (next: BuilderEditorState): void => {
    state = withAvailability(next);
  };

  return {
    getState: () => state,
    selectNode: (nodeId) => setState({ ...state, selectedNodeId: nodeId }),
    setActivePanel: (panel) => setState({ ...state, activePanel: panel }),
    setCanvasMode: (mode) => setState({ ...state, canvasMode: mode }),
    setDragState: (dragState) => setState({ ...state, dragState }),
    executeCommand: (command, executor) => {
      const previousSchema = state.schema;
      const commandResult = executor(previousSchema);
      if (!commandResult.changed) {
        setState({ ...state, commandStatus: { lastCommand: command, diagnostics: commandResult.diagnostics } });
        return commandResult;
      }
      const entry: BuilderHistoryEntry = {
        command,
        label: command,
        timestamp: clock(),
        previousSchema,
        nextSchema: commandResult.schema,
        diagnostics: commandResult.diagnostics
      };
      setState({
        ...state,
        schema: commandResult.schema,
        selectedNodeId: selectedAfter(commandResult.schema, state.selectedNodeId),
        commandStatus: { lastCommand: command, diagnostics: commandResult.diagnostics },
        history: {
          ...state.history,
          undo: [...state.history.undo, entry].slice(-state.history.limit),
          redo: []
        }
      });
      return commandResult;
    },
    undo: () => {
      const entry = state.history.undo.at(-1);
      if (!entry) {
        return null;
      }
      setState({
        ...state,
        schema: entry.previousSchema,
        commandStatus: { lastCommand: entry.command, diagnostics: entry.diagnostics },
        history: {
          ...state.history,
          undo: state.history.undo.slice(0, -1),
          redo: [...state.history.redo, entry].slice(-state.history.limit)
        }
      });
      return result(entry.command, entry.previousSchema, true, entry.diagnostics);
    },
    redo: () => {
      const entry = state.history.redo.at(-1);
      if (!entry) {
        return null;
      }
      setState({
        ...state,
        schema: entry.nextSchema,
        commandStatus: { lastCommand: entry.command, diagnostics: entry.diagnostics },
        history: {
          ...state.history,
          undo: [...state.history.undo, entry].slice(-state.history.limit),
          redo: state.history.redo.slice(0, -1)
        }
      });
      return result(entry.command, entry.nextSchema, true, entry.diagnostics);
    }
  };
}

function updateNode(
  schema: BuilderSchema,
  command: BuilderCommandName,
  nodeId: string,
  updater: (node: BuilderNode) => BuilderNode,
  diagnostics: BuilderCommandDiagnostic[] = []
): BuilderCommandResult {
  const target = findNode(schema, nodeId);
  if (!target) {
    return result(command, schema, false, [error("missing_target_node", "Node does not exist.", command, nodeId)]);
  }
  const updated = updater(cloneNode(target));
  if (hasDangerousKey(updated)) {
    return result(command, schema, false, [error("dangerous_key", "Updated node contains a dangerous key.", command, nodeId)]);
  }
  const next = cloneSchema(schema);
  next.nodes = next.nodes.map((node) => (node.id === nodeId ? updated : node));
  return result(command, next, !sameSchema(schema, next), diagnostics);
}

function validateSchemaAndNode(command: BuilderCommandName, schema: BuilderSchema, node: BuilderNode): BuilderCommandDiagnostic[] {
  const diagnostics: BuilderCommandDiagnostic[] = [];
  if (hasDangerousKey(node)) {
    diagnostics.push(error("dangerous_key", "Node contains a dangerous key.", command, node.id));
  }
  if (node.name && !isSubmittedPath(node.name)) {
    diagnostics.push(error("invalid_submitted_path", "Submitted path is invalid or unsafe.", command, node.id));
  }
  if (schema.nodes.some((existing) => existing.id === node.id)) {
    diagnostics.push(error("duplicate_node_id", "Node id already exists.", command, node.id));
  }
  return diagnostics;
}

function optionDiagnostics(previous: BuilderOption[] = [], next: BuilderOption[], nodeId: string): BuilderCommandDiagnostic[] {
  const nextValues = new Set(next.map((option) => option.value));
  const previousValues = new Set(previous.map((option) => option.value));
  for (const value of previousValues) {
    if (!nextValues.has(value)) {
      return [
        warning("dangerous_option_value_changed", "Changing option values can break stored responses.", "updateOptions", nodeId, {
          removedValue: value
        })
      ];
    }
  }
  return [];
}

function requirednessChanged(previous: BuilderValidationRule[] = [], next: BuilderValidationRule[] = []): boolean {
  return previous.some((rule) => rule.type === "required") !== next.some((rule) => rule.type === "required");
}

function shapeDiagnostics(
  command: BuilderCommandName,
  nodeId: string,
  previous: unknown,
  next: unknown
): BuilderCommandDiagnostic[] {
  const beforeArray = String(previous ?? "").includes("[]");
  const afterArray = String(next ?? "").includes("[]");
  if (beforeArray === afterArray) {
    return [];
  }
  return [
    warning("dangerous_shape_changed", "Changing scalar/array shape can affect backend contracts.", command, nodeId, {
      from: previous,
      to: next
    })
  ];
}

function collectDescendantIds(schema: BuilderSchema, nodeId: string): Set<string> {
  const ids = new Set<string>();
  const node = findNode(schema, nodeId);
  for (const childId of node?.children ?? []) {
    ids.add(childId);
    for (const descendantId of collectDescendantIds(schema, childId)) {
      ids.add(descendantId);
    }
  }
  return ids;
}

function selectedAfter(schema: BuilderSchema, selectedNodeId: string | null): string | null {
  return selectedNodeId && findNode(schema, selectedNodeId) ? selectedNodeId : null;
}

function findNode(schema: BuilderSchema, nodeId: string): BuilderNode | undefined {
  return schema.nodes.find((node) => node.id === nodeId);
}

function findParent(schema: BuilderSchema, nodeId: string): BuilderNode | undefined {
  return schema.nodes.find((node) => node.children?.includes(nodeId));
}

function insertInto(children: string[], nodeId: string, position?: number): string[] {
  const next = children.filter((id) => id !== nodeId);
  next.splice(clampPosition(position, next.length), 0, nodeId);
  return next;
}

function clampPosition(position: number | undefined, length: number): number {
  if (typeof position !== "number" || Number.isNaN(position)) {
    return length;
  }
  return Math.max(0, Math.min(position, length));
}

function uniqueId(schema: BuilderSchema, baseId: string): string {
  const ids = new Set(schema.nodes.map((node) => node.id));
  let index = 1;
  let candidate = `${baseId}_copy`;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${baseId}_copy_${index}`;
  }
  return candidate;
}

function uniqueSubmittedName(schema: BuilderSchema, baseName: string): string {
  const names = new Set(schema.nodes.map((node) => node.name).filter(Boolean));
  let index = 1;
  let candidate = `${baseName}_copy`;
  while (names.has(candidate)) {
    index += 1;
    candidate = `${baseName}_copy_${index}`;
  }
  return candidate;
}

function indexAfter(schema: BuilderSchema, nodeId: string): number {
  const index = schema.nodes.findIndex((node) => node.id === nodeId);
  return index === -1 ? schema.nodes.length : index + 1;
}

function isSubmittable(node: BuilderNode): boolean {
  return (node.type === "field" || node.type === "hidden") && typeof node.name === "string";
}

function cloneSchema(schema: BuilderSchema): BuilderSchema {
  return clone(schema);
}

function cloneNode(node: BuilderNode): BuilderNode {
  return clone(node);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sameSchema(left: BuilderSchema, right: BuilderSchema): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function withAvailability(state: BuilderEditorState): BuilderEditorState {
  return {
    ...state,
    canUndo: state.history.undo.length > 0,
    canRedo: state.history.redo.length > 0
  };
}

function result(
  command: BuilderCommandName,
  schema: BuilderSchema,
  changed: boolean,
  diagnostics: BuilderCommandDiagnostic[],
  label = command
): BuilderCommandResult {
  return { command, schema, changed, diagnostics, label };
}

function warning(
  code: string,
  message: string,
  command: BuilderCommandName,
  nodeId?: string,
  meta?: Record<string, unknown>
): BuilderCommandDiagnostic {
  return diagnostic("warning", code, message, command, nodeId, meta);
}

function error(
  code: string,
  message: string,
  command: BuilderCommandName,
  nodeId?: string,
  meta?: Record<string, unknown>
): BuilderCommandDiagnostic {
  return diagnostic("error", code, message, command, nodeId, meta);
}

function diagnostic(
  severity: BuilderDiagnosticSeverity,
  code: string,
  message: string,
  command: BuilderCommandName,
  nodeId?: string,
  meta?: Record<string, unknown>
): BuilderCommandDiagnostic {
  return {
    code,
    severity,
    message,
    command,
    ...(nodeId ? { nodeId } : {}),
    ...(meta ? { meta } : {})
  };
}

function hasErrors(diagnostics: BuilderCommandDiagnostic[]): boolean {
  return diagnostics.some((diagnostic) => diagnostic.severity === "error");
}

export * from "./ui.js";
export * from "./dnd.js";
