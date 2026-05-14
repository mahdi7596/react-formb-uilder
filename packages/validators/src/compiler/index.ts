import {
  analyzeSchema,
  createDiagnostic,
  DIAGNOSTIC_CODES,
  extractConditionDependencies,
  findDangerousKeys,
  parseSubmittedPath,
  type Diagnostic,
  type DiagnosticCode,
  type DiagnosticSeverity
} from "@your-org/forms-core";

import { createRootJsonSchema, type JsonSchemaObject } from "../json-schema/index.js";

export interface CompilerDiagnostic extends Diagnostic {
  severity: DiagnosticSeverity;
}

export interface ValidationPlanEntry {
  nodeId: string;
  path: string;
  ruleType: string;
  reason: "conditional" | "custom" | "not-representable";
}

export interface ConditionDependencyEntry {
  nodeId: string;
  dependsOn: string[];
  source: "visibility" | "enabledWhen" | "validation";
}

export interface JsonSchemaCompilerResult {
  schema: JsonSchemaObject;
  diagnostics: CompilerDiagnostic[];
  validationPlan: ValidationPlanEntry[];
  conditionDependencies: ConditionDependencyEntry[];
}

export interface JsonSchemaCompilerOptions {
  additionalProperties?: boolean;
}

const STRING_FIELDS = new Set(["text", "textarea", "phone"]);
const NUMBER_FIELDS = new Set(["number", "rating", "linearScale"]);
const SINGLE_CHOICE_FIELDS = new Set(["radio", "select"]);
const BUILT_IN_FIELDS = new Set([
  ...STRING_FIELDS,
  ...NUMBER_FIELDS,
  ...SINGLE_CHOICE_FIELDS,
  "email",
  "url",
  "date",
  "time",
  "checkbox",
  "switch",
  "checkboxGroup",
  "hidden",
  "fileMetadata"
]);

export function compileJsonSchema(
  schemaInput: unknown,
  options: JsonSchemaCompilerOptions = {}
): JsonSchemaCompilerResult {
  const schema = createRootJsonSchema();
  schema.additionalProperties = options.additionalProperties ?? false;
  const diagnostics: CompilerDiagnostic[] = [];
  const validationPlan: ValidationPlanEntry[] = [];
  const conditionDependencies: ConditionDependencyEntry[] = [];

  for (const finding of findDangerousKeys(schemaInput)) {
    diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.dangerousKey, "error", finding.path));
  }

  const analysis = analyzeSchema(schemaInput);
  for (const diagnostic of analysis.diagnostics) {
    diagnostics.push(mapCoreDiagnostic(diagnostic));
  }

  if (!isRecord(schemaInput)) {
    return {
      schema,
      diagnostics: dedupeDiagnostics(diagnostics),
      validationPlan,
      conditionDependencies
    };
  }

  for (const node of readNodes(schemaInput)) {
    collectConditionArtifacts(node, diagnostics, validationPlan, conditionDependencies);

    if (node.type === "repeater") {
      diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.repeaterNotSupported, "error", `nodes.${String(node.id ?? "")}`));
      continue;
    }

    if (node.type !== "field" && node.type !== "hidden") {
      continue;
    }

    if (typeof node.name !== "string") {
      diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.invalidSubmittedPath, "error", `nodes.${String(node.id ?? "")}.name`));
      continue;
    }

    const parsedPath = parseSubmittedPath(node.name);
    if (!parsedPath.ok) {
      diagnostics.push(...parsedPath.diagnostics.map(mapCoreDiagnostic));
      continue;
    }

    if (parsedPath.value.segments.some((segment) => segment.type === "array")) {
      diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.repeaterNotSupported, "error", node.name));
      continue;
    }

    const fieldSchema = compileFieldSchema(node, diagnostics);
    if (!fieldSchema) {
      continue;
    }

    applyValidationRules(node, fieldSchema, diagnostics, validationPlan);
    setSchemaAtPath(schema, parsedPath.value.segments.map((segment) => segment.key), fieldSchema, isRequired(node));
  }

  sortRequired(schema);
  return {
    schema,
    diagnostics: dedupeDiagnostics(diagnostics),
    validationPlan,
    conditionDependencies
  };
}

function compileFieldSchema(
  node: Record<string, unknown>,
  diagnostics: CompilerDiagnostic[]
): JsonSchemaObject | null {
  const fieldType = node.type === "hidden" ? "hidden" : node.fieldType;

  if (typeof fieldType !== "string" || (!BUILT_IN_FIELDS.has(fieldType) && fieldType !== "fileUpload")) {
    diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.unknownFieldType, "error", `nodes.${String(node.id ?? "")}.fieldType`));
    return null;
  }

  if (fieldType === "fileUpload" || hasUploadLifecycle(node)) {
    diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.uploadLifecycleNotSupported, "error", `nodes.${String(node.id ?? "")}`));
    return null;
  }

  if (STRING_FIELDS.has(fieldType) || fieldType === "hidden") {
    return { type: "string" };
  }
  if (fieldType === "email") {
    return { type: "string", format: "email" };
  }
  if (fieldType === "url") {
    return { type: "string", format: "uri" };
  }
  if (fieldType === "date") {
    return { type: "string", format: "date" };
  }
  if (fieldType === "time") {
    return { type: "string", pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$" };
  }
  if (NUMBER_FIELDS.has(fieldType)) {
    return { type: "number" };
  }
  if (fieldType === "checkbox" || fieldType === "switch") {
    return { type: "boolean" };
  }
  if (SINGLE_CHOICE_FIELDS.has(fieldType)) {
    return { enum: readEnabledOptionValues(node) };
  }
  if (fieldType === "checkboxGroup") {
    return { type: "array", items: { enum: readEnabledOptionValues(node) } };
  }
  if (fieldType === "fileMetadata") {
    return fileMetadataSchema();
  }

  diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.unknownFieldType, "error", `nodes.${String(node.id ?? "")}.fieldType`));
  return null;
}

function applyValidationRules(
  node: Record<string, unknown>,
  fieldSchema: JsonSchemaObject,
  diagnostics: CompilerDiagnostic[],
  validationPlan: ValidationPlanEntry[]
): void {
  for (const rule of readValidationRules(node)) {
    const ruleType = typeof rule.type === "string" ? rule.type : "";
    if (isRecord(rule.when)) {
      validationPlan.push(planEntry(node, ruleType, "conditional"));
      diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.conditionNotRepresentable, "warning", `nodes.${String(node.id ?? "")}.validation`));
    }

    if (ruleType.startsWith("custom:")) {
      validationPlan.push(planEntry(node, ruleType, "custom"));
      diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.customValidatorNotRepresentable, "warning", `nodes.${String(node.id ?? "")}.validation`));
      continue;
    }

    switch (ruleType) {
      case "minLength":
        setNumberKeyword(fieldSchema, "minLength", rule, "min");
        break;
      case "maxLength":
        setNumberKeyword(fieldSchema, "maxLength", rule, "max");
        break;
      case "min":
        setNumberKeyword(fieldSchema, "minimum", rule, "min");
        break;
      case "max":
        setNumberKeyword(fieldSchema, "maximum", rule, "max");
        break;
      case "integer":
        fieldSchema.type = "integer";
        break;
      case "step":
        setNumberKeyword(fieldSchema, "multipleOf", rule, "step");
        break;
      case "pattern": {
        const pattern = isRecord(rule.params) ? rule.params.pattern : undefined;
        if (typeof pattern !== "string" || pattern.includes("(?<") || pattern.length > 200) {
          diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.unsupportedRegex, "error", `nodes.${String(node.id ?? "")}.validation`));
        } else {
          fieldSchema.pattern = pattern;
        }
        break;
      }
      case "selectionCount":
        setNumberKeyword(fieldSchema, "minItems", rule, "min");
        setNumberKeyword(fieldSchema, "maxItems", rule, "max");
        break;
      case "required":
      case "email":
      case "url":
      case "option":
      case "accepted":
        break;
      case "":
        break;
      default:
        validationPlan.push(planEntry(node, ruleType, "not-representable"));
        break;
    }
  }
}

function collectConditionArtifacts(
  node: Record<string, unknown>,
  diagnostics: CompilerDiagnostic[],
  validationPlan: ValidationPlanEntry[],
  conditionDependencies: ConditionDependencyEntry[]
): void {
  for (const source of ["visibility", "enabledWhen"] as const) {
    if (!isRecord(node[source])) {
      continue;
    }
    const dependsOn = extractConditionDependencies(node[source] as never);
    conditionDependencies.push({ nodeId: String(node.id ?? ""), dependsOn, source });
    diagnostics.push(compilerDiagnostic(DIAGNOSTIC_CODES.conditionNotRepresentable, "warning", `nodes.${String(node.id ?? "")}.${source}`));
  }

  for (const rule of readValidationRules(node)) {
    if (isRecord(rule.when)) {
      const dependsOn = extractConditionDependencies(rule.when as never);
      conditionDependencies.push({ nodeId: String(node.id ?? ""), dependsOn, source: "validation" });
    }
  }
}

function setSchemaAtPath(root: JsonSchemaObject, path: string[], fieldSchema: JsonSchemaObject, required: boolean): void {
  let current = root;
  for (const [index, segment] of path.entries()) {
    const last = index === path.length - 1;
    current.properties ??= {};
    if (last) {
      current.properties[segment] = fieldSchema;
      if (required) {
        current.required = [...new Set([...(current.required ?? []), segment])];
      }
      return;
    }

    const existing = current.properties[segment];
    if (!existing) {
      current.properties[segment] = {
        type: "object",
        additionalProperties: false,
        properties: {}
      };
    }
    let next = current.properties[segment];
    if (!next) {
      next = {
        type: "object",
        additionalProperties: false,
        properties: {}
      };
      current.properties[segment] = next;
    }
    current = next;
  }
}

function isRequired(node: Record<string, unknown>): boolean {
  return readValidationRules(node).some((rule) => rule.type === "required" && !isRecord(rule.when));
}

function fileMetadataSchema(): JsonSchemaObject {
  return {
    type: "array",
    items: {
      type: "object",
      required: ["fileId"],
      additionalProperties: false,
      properties: {
        fileId: { type: "string" },
        name: { type: "string" },
        mimeType: { type: "string" },
        size: { type: "number", minimum: 0 }
      }
    }
  };
}

function readNodes(schema: Record<string, unknown>): Record<string, unknown>[] {
  return Array.isArray(schema.nodes) ? schema.nodes.filter(isRecord) : [];
}

function readValidationRules(node: Record<string, unknown>): Record<string, unknown>[] {
  return Array.isArray(node.validation) ? node.validation.filter(isRecord) : [];
}

function readEnabledOptionValues(node: Record<string, unknown>): string[] {
  const options = Array.isArray(node.options) ? node.options.filter(isRecord) : [];
  return options
    .filter((option) => option.disabled !== true && typeof option.value === "string")
    .map((option) => option.value as string);
}

function setNumberKeyword(
  schema: JsonSchemaObject,
  keyword: "minLength" | "maxLength" | "minimum" | "maximum" | "multipleOf" | "minItems" | "maxItems",
  rule: Record<string, unknown>,
  param: string
): void {
  const value = isRecord(rule.params) ? rule.params[param] : undefined;
  if (typeof value === "number") {
    schema[keyword] = value;
  }
}

function hasUploadLifecycle(node: Record<string, unknown>): boolean {
  const props = isRecord(node.props) ? node.props : {};
  return "uploadLifecycle" in props || "prepareUpload" in props || "finalizeUpload" in props;
}

function planEntry(
  node: Record<string, unknown>,
  ruleType: string,
  reason: ValidationPlanEntry["reason"]
): ValidationPlanEntry {
  return {
    nodeId: String(node.id ?? ""),
    path: typeof node.name === "string" ? node.name : "",
    ruleType,
    reason
  };
}

function mapCoreDiagnostic(diagnostic: Diagnostic): CompilerDiagnostic {
  const warningCodes: DiagnosticCode[] = [
    DIAGNOSTIC_CODES.conditionNotRepresentable,
    DIAGNOSTIC_CODES.customValidatorNotRepresentable
  ];
  return {
    ...diagnostic,
    severity: warningCodes.includes(diagnostic.code) ? "warning" : diagnostic.severity
  };
}

function compilerDiagnostic(
  code: DiagnosticCode,
  severity: DiagnosticSeverity,
  path: string | null = null
): CompilerDiagnostic {
  return createDiagnostic({ code, severity, source: "compiler", path }) as CompilerDiagnostic;
}

function dedupeDiagnostics(diagnostics: CompilerDiagnostic[]): CompilerDiagnostic[] {
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

function sortRequired(schema: JsonSchemaObject): void {
  if (schema.required) {
    schema.required.sort();
  }
  for (const nested of Object.values(schema.properties ?? {})) {
    sortRequired(nested);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
