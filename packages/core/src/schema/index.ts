import type { ConditionExpression } from "../conditions/index.js";
import { extractConditionDependencies } from "../conditions/index.js";
import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic, type DiagnosticCode } from "../diagnostics/index.js";
import { isSubmittedPath } from "../paths/index.js";
import { findDangerousKeys, hasExecutableCode } from "../safety/index.js";
import type { ValidationRule } from "../validation/index.js";

export type SchemaVersion = "1.0.0";
export type FormStatus = "draft" | "published" | "archived";
export type Direction = "ltr" | "rtl" | "auto";
export type SubmitMode = "final";
export type NavigationMode = "singlePage" | "steps";
export type ValidationTiming = "onSubmit" | "onBlur" | "onChange";

export interface FormSettings {
  submitMode: SubmitMode;
  navigation: NavigationMode;
  validationTiming: ValidationTiming;
  preserveHiddenValues: boolean;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface BaseNode {
  id: string;
  type: string;
  label?: string;
  description?: string;
  visibility?: ConditionExpression | null;
  enabledWhen?: ConditionExpression | null;
  ui?: JsonObject;
  meta?: JsonObject;
}

export interface OptionContract {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FieldNode extends BaseNode {
  type: "field";
  fieldType: string;
  name: string;
  defaultValue?: JsonValue;
  validation?: ValidationRule[];
  props?: JsonObject;
  options?: OptionContract[];
}

export interface HiddenNode extends BaseNode {
  type: "hidden";
  fieldType: "hidden";
  name: string;
  defaultValue?: JsonValue;
  props?: JsonObject;
}

export interface ContainerNode extends BaseNode {
  type: "section" | "step";
  children: string[];
}

export interface ContentNode extends BaseNode {
  type: "content";
  contentType: "heading" | "paragraph" | "image" | "divider" | "spacer" | "welcome" | string;
  props?: JsonObject;
}

export interface EndingNode extends BaseNode {
  type: "ending";
  props?: JsonObject;
}

export type FormNode = FieldNode | HiddenNode | ContainerNode | ContentNode | EndingNode;

export interface LocalizationContract {
  title?: string;
  description?: string;
  nodes?: Record<string, { label?: string; description?: string; placeholder?: string }>;
}

export interface CanonicalFormSchema {
  schemaVersion: SchemaVersion;
  formId: string;
  revisionId: string;
  revisionHash: string;
  status: FormStatus;
  locale: string;
  direction: Direction;
  title: string;
  description?: string;
  settings: FormSettings;
  nodes: FormNode[];
  localizations?: Record<string, LocalizationContract>;
  meta?: JsonObject;
}

export interface SchemaAnalysisResult {
  diagnostics: Diagnostic[];
  nodesById: Map<string, FormNode>;
  fieldsByPath: Map<string, FieldNode | HiddenNode>;
}

const BUILT_IN_NODE_TYPES = new Set(["field", "hidden", "section", "step", "content", "ending"]);
const BUILT_IN_FIELD_TYPES = new Set([
  "text",
  "textarea",
  "number",
  "email",
  "phone",
  "url",
  "radio",
  "checkboxGroup",
  "select",
  "checkbox",
  "switch",
  "date",
  "time",
  "rating",
  "linearScale",
  "fileMetadata"
]);
const BUILT_IN_RULES = new Set([
  "required",
  "minLength",
  "maxLength",
  "minWords",
  "maxWords",
  "min",
  "max",
  "integer",
  "step",
  "pattern",
  "email",
  "url",
  "option",
  "selectionCount",
  "accepted"
]);

export function analyzeSchema(schema: unknown): SchemaAnalysisResult {
  const diagnostics: Diagnostic[] = [];
  const nodesById = new Map<string, FormNode>();
  const fieldsByPath = new Map<string, FieldNode | HiddenNode>();

  addDangerDiagnostics(schema, diagnostics);
  if (hasExecutableCode(schema)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.executableCodeProhibited);
  }

  if (!isRecord(schema)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
    return { diagnostics, nodesById, fieldsByPath };
  }

  if (typeof schema.schemaVersion !== "string") {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
  }

  const nodes = Array.isArray(schema.nodes) ? schema.nodes.filter(isRecord) : [];
  const schemaRegisteredValidators = readRegisteredValidators(schema);

  for (const rawNode of nodes) {
    const node = rawNode as unknown as FormNode;
    if (typeof rawNode.id === "string") {
      if (nodesById.has(rawNode.id)) {
        addDiagnostic(diagnostics, DIAGNOSTIC_CODES.duplicateNodeId, rawNode.id);
      }
      nodesById.set(rawNode.id, node);
    }

    if (rawNode.type === "repeater") {
      addDiagnostic(diagnostics, DIAGNOSTIC_CODES.repeaterNotSupported);
    } else if (typeof rawNode.type !== "string" || !BUILT_IN_NODE_TYPES.has(rawNode.type)) {
      addDiagnostic(diagnostics, DIAGNOSTIC_CODES.unknownNodeType);
    }

    if (rawNode.type === "field" || rawNode.type === "hidden") {
      collectFieldDiagnostics(rawNode, fieldsByPath, diagnostics, schemaRegisteredValidators);
    } else if (rawNode.type === "content" || rawNode.type === "ending") {
      collectContentDiagnostics(rawNode, diagnostics);
    }
  }

  collectConditionDiagnostics(nodes, fieldsByPath, diagnostics);
  return { diagnostics: dedupeDiagnostics(diagnostics), nodesById, fieldsByPath };
}

function collectContentDiagnostics(node: Record<string, unknown>, diagnostics: Diagnostic[]): void {
  const props = isRecord(node.props) ? node.props : {};
  const contentType = node.type === "ending" ? "ending" : node.contentType;
  if (contentType === "image" && !hasNonEmptyText(props.alt)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.missingAccessibleContent, String(node.id ?? "image"));
  }
  if ((contentType === "heading" || contentType === "welcome" || contentType === "ending") && !hasReadableContent(node, props)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.missingAccessibleContent, String(node.id ?? contentType));
  }
}

function hasReadableContent(node: Record<string, unknown>, props: Record<string, unknown>): boolean {
  return hasNonEmptyText(node.label) || hasNonEmptyText(node.description) || hasNonEmptyText(props.text) || hasNonEmptyText(props.title);
}

function collectFieldDiagnostics(
  node: Record<string, unknown>,
  fieldsByPath: Map<string, FieldNode | HiddenNode>,
  diagnostics: Diagnostic[],
  schemaRegisteredValidators: Set<string>
): void {
  if (typeof node.name !== "string" || !isSubmittedPath(node.name)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.invalidSubmittedPath);
  } else {
    if (fieldsByPath.has(node.name)) {
      addDiagnostic(diagnostics, DIAGNOSTIC_CODES.duplicateSubmittedPath, node.name);
    }
    fieldsByPath.set(node.name, node as unknown as FieldNode | HiddenNode);
  }

  if (node.type === "field") {
    if (node.fieldType === "fileUpload" || hasUploadLifecycle(node)) {
      addDiagnostic(diagnostics, DIAGNOSTIC_CODES.uploadLifecycleNotSupported);
    } else if (typeof node.fieldType !== "string" || !BUILT_IN_FIELD_TYPES.has(node.fieldType)) {
      addDiagnostic(diagnostics, DIAGNOSTIC_CODES.unknownFieldType);
    }

    const validation = Array.isArray(node.validation) ? node.validation.filter(isRecord) : [];
    for (const rule of validation) {
      if (typeof rule.type !== "string") {
        addDiagnostic(diagnostics, DIAGNOSTIC_CODES.unknownValidationRule);
      } else if (!BUILT_IN_RULES.has(rule.type) && !rule.type.startsWith("custom:")) {
        addDiagnostic(diagnostics, DIAGNOSTIC_CODES.unknownValidationRule);
      } else if (rule.type.startsWith("custom:")) {
        const registered = readRegisteredValidators(node).has(rule.type) || schemaRegisteredValidators.has(rule.type);
        if (!registered) {
          addDiagnostic(diagnostics, DIAGNOSTIC_CODES.unsupportedCustomRegistration);
        }
      }
    }
  }
}

function collectConditionDiagnostics(
  nodes: Record<string, unknown>[],
  fieldsByPath: Map<string, FieldNode | HiddenNode>,
  diagnostics: Diagnostic[]
): void {
  const dependencyByNode = new Map<string, string[]>();
  const nodeNameById = new Map<string, string>();
  const nodeIdByName = new Map<string, string>();

  for (const node of nodes) {
    if (typeof node.id === "string" && typeof node.name === "string") {
      nodeNameById.set(node.id, node.name);
      nodeIdByName.set(node.name, node.id);
    }
  }

  for (const node of nodes) {
    if (typeof node.id !== "string") {
      continue;
    }

    const dependencies = [
      ...readConditionDependencies(node.visibility),
      ...readConditionDependencies(node.enabledWhen),
      ...readValidationConditionDependencies(node)
    ];
    dependencyByNode.set(node.id, dependencies);

    for (const dependency of dependencies) {
      if (!fieldsByPath.has(dependency)) {
        addDiagnostic(diagnostics, DIAGNOSTIC_CODES.invalidCondition, dependency);
      }
    }
  }

  for (const [nodeId, dependencies] of dependencyByNode) {
    for (const dependency of dependencies) {
      const dependencyNodeId = nodeIdByName.get(dependency);
      if (!dependencyNodeId) {
        continue;
      }
      const reciprocal = dependencyByNode.get(dependencyNodeId) ?? [];
      const ownName = nodeNameById.get(nodeId);
      if (ownName && reciprocal.includes(ownName)) {
        addDiagnostic(diagnostics, DIAGNOSTIC_CODES.conditionCycle, nodeId);
      }
    }
  }
}

function readConditionDependencies(value: unknown): string[] {
  return isCondition(value) ? extractConditionDependencies(value) : [];
}

function readValidationConditionDependencies(node: Record<string, unknown>): string[] {
  const validation = Array.isArray(node.validation) ? node.validation.filter(isRecord) : [];
  return validation.flatMap((rule) => readConditionDependencies(rule.when));
}

function isCondition(value: unknown): value is ConditionExpression {
  return isRecord(value);
}

function readRegisteredValidators(node: Record<string, unknown>): Set<string> {
  const meta = isRecord(node.meta) ? node.meta : {};
  const validators = Array.isArray(meta.registeredValidators) ? meta.registeredValidators : [];
  return new Set(validators.filter((value): value is string => typeof value === "string"));
}

function hasUploadLifecycle(node: Record<string, unknown>): boolean {
  const props = isRecord(node.props) ? node.props : {};
  return "uploadLifecycle" in props || "prepareUpload" in props || "finalizeUpload" in props;
}

function hasNonEmptyText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function addDangerDiagnostics(value: unknown, diagnostics: Diagnostic[]): void {
  for (const finding of findDangerousKeys(value)) {
    addDiagnostic(diagnostics, DIAGNOSTIC_CODES.dangerousKey, finding.path);
  }
}

function addDiagnostic(diagnostics: Diagnostic[], code: DiagnosticCode, path?: string): void {
  diagnostics.push(createDiagnostic({ code, path: path ?? null }));
}

function dedupeDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
  const seen = new Set<string>();
  return diagnostics.filter((diagnostic) => {
    const key = `${diagnostic.code}:${diagnostic.path ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
