export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message?: string;
  path?: string | null;
}

export type DiagnosticSeverity = "info" | "warning" | "error";
export type DiagnosticCode =
  | "dangerous_key"
  | "invalid_submitted_path"
  | "missing_required_schema_field"
  | "duplicate_node_id"
  | "duplicate_submitted_path"
  | "unknown_node_type"
  | "unknown_field_type"
  | "invalid_validation_rule"
  | "invalid_condition_reference"
  | "condition_cycle"
  | "unsupported_custom_validator"
  | "unsupported_custom_predicate"
  | "repeater_not_supported"
  | "upload_orchestration_not_supported"
  | "executable_schema_code";

export const DIAGNOSTIC_CODES = {
  dangerousKey: "dangerous_key",
  invalidSubmittedPath: "invalid_submitted_path",
  missingRequiredSchemaField: "missing_required_schema_field",
  duplicateNodeId: "duplicate_node_id",
  duplicateSubmittedPath: "duplicate_submitted_path",
  unknownNodeType: "unknown_node_type",
  unknownFieldType: "unknown_field_type",
  invalidValidationRule: "invalid_validation_rule",
  invalidConditionReference: "invalid_condition_reference",
  conditionCycle: "condition_cycle",
  unsupportedCustomValidator: "unsupported_custom_validator",
  unsupportedCustomPredicate: "unsupported_custom_predicate",
  repeaterNotSupported: "repeater_not_supported",
  uploadOrchestrationNotSupported: "upload_orchestration_not_supported",
  executableSchemaCode: "executable_schema_code"
} as const;

export interface ValidationRule {
  type: string;
  message?: string;
}

export interface FieldValidationError {
  code: string;
  message?: string;
}

export interface BackendResponse {
  ok: boolean;
  status: string;
  submissionId?: string | null;
  errors?: ValidationErrorContract[];
  message?: string;
}

export interface ValidationErrorContract {
  path?: string;
  code: string;
  message?: string;
}

export interface SubmissionEnvelope {
  formId: string;
  revisionId: string;
  schemaVersion: string;
  submittedAt: string;
  locale: string;
  data: Record<string, unknown>;
  files: unknown[];
  meta: Record<string, unknown>;
}

export interface CanonicalFormSchema extends Record<string, unknown> {
  schemaVersion: string;
  formId: string;
  revisionId: string;
  revisionHash?: string;
  status?: string;
  locale: string;
  direction?: "ltr" | "rtl";
  title?: string;
  nodes: Array<Record<string, unknown>>;
}

export interface SchemaAnalysisResult {
  diagnostics: Diagnostic[];
}

export function hasDangerousKey(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }
  for (const key of Object.keys(value)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return true;
    }
    if (hasDangerousKey((value as Record<string, unknown>)[key])) {
      return true;
    }
  }
  return false;
}

export function isSubmittedPath(path: string): boolean {
  if (!path || path.includes("__proto__") || path.includes("constructor") || path.includes("prototype")) {
    return false;
  }
  return /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[\])*$/u.test(path);
}

export function createDiagnostic(
  code: DiagnosticCode | string,
  severity: DiagnosticSeverity,
  message: string,
  path?: string | null
): Diagnostic {
  return {
    code,
    severity,
    message,
    ...(path !== undefined ? { path } : {})
  };
}

export function analyzeSchema(schema: unknown): SchemaAnalysisResult {
  const diagnostics: Diagnostic[] = [];
  if (!schema || typeof schema !== "object") {
    return {
      diagnostics: [
        createDiagnostic(
          DIAGNOSTIC_CODES.missingRequiredSchemaField,
          "error",
          "Schema must be an object.",
          null
        )
      ]
    };
  }

  const record = schema as Record<string, unknown>;
  for (const key of ["schemaVersion", "formId", "revisionId", "locale", "nodes"]) {
    if (record[key] === undefined || record[key] === null || record[key] === "") {
      diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.missingRequiredSchemaField, "error", `Missing required schema field "${key}".`, key));
    }
  }

  if (hasDangerousKey(record)) {
    diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.dangerousKey, "error", "Schema contains a dangerous key.", null));
  }

  const nodes = Array.isArray(record.nodes) ? record.nodes : [];
  const ids = new Set<string>();
  const submittedPaths = new Set<string>();
  for (const [index, nodeInput] of nodes.entries()) {
    if (!nodeInput || typeof nodeInput !== "object") {
      diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.unknownNodeType, "error", "Node must be an object.", `nodes.${index}`));
      continue;
    }
    const node = nodeInput as Record<string, unknown>;
    const nodePath = `nodes.${index}`;
    if (typeof node.id === "string") {
      if (ids.has(node.id)) {
        diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.duplicateNodeId, "error", "Duplicate node id.", `${nodePath}.id`));
      }
      ids.add(node.id);
    }
    if (typeof node.name === "string") {
      if (!isSubmittedPath(node.name)) {
        diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.invalidSubmittedPath, "error", "Submitted path is invalid or unsafe.", `${nodePath}.name`));
      }
      if (submittedPaths.has(node.name)) {
        diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.duplicateSubmittedPath, "error", "Duplicate submitted path.", `${nodePath}.name`));
      }
      submittedPaths.add(node.name);
    }
    if (node.type === "repeater") {
      diagnostics.push(createDiagnostic(DIAGNOSTIC_CODES.repeaterNotSupported, "error", "Repeaters are not supported in the MVP.", nodePath));
    }
  }

  return { diagnostics };
}

export function evaluateCondition(): { value: boolean; diagnostics: Diagnostic[] } {
  return { value: true, diagnostics: [] };
}

export function resolveDefaultValues(schema: { nodes?: Array<{ name?: string; defaultValue?: unknown }> }): { value: Record<string, unknown>; diagnostics: Diagnostic[] } {
  const value: Record<string, unknown> = {};
  for (const node of schema.nodes ?? []) {
    if (node.name && node.defaultValue !== undefined) {
      value[node.name] = node.defaultValue;
    }
  }
  return { value, diagnostics: [] };
}

export function createSubmissionEnvelope(input: {
  schema: { formId: string; revisionId: string; schemaVersion: string };
  values: Record<string, unknown>;
  locale: string;
  submittedAt: string;
  meta?: Record<string, unknown>;
}): { value: SubmissionEnvelope; diagnostics: Diagnostic[] } {
  return {
    value: {
      formId: input.schema.formId,
      revisionId: input.schema.revisionId,
      schemaVersion: input.schema.schemaVersion,
      submittedAt: input.submittedAt,
      locale: input.locale,
      data: input.values,
      files: [],
      meta: input.meta ?? {}
    },
    diagnostics: []
  };
}

export function validateFieldValue(input: {
  value: unknown;
  rules?: ValidationRule[];
}): { errors: FieldValidationError[]; diagnostics: Diagnostic[] } {
  const errors: FieldValidationError[] = [];
  if (input.rules?.some((rule) => rule.type === "required") && (input.value === undefined || input.value === "")) {
    errors.push({ code: "required", message: "This field is required." });
  }
  return { errors, diagnostics: [] };
}

export function parseBackendResponse(response: BackendResponse): {
  value: BackendResponse & { fieldErrors: ValidationErrorContract[]; globalErrors: ValidationErrorContract[] };
  diagnostics: Diagnostic[];
} {
  const errors = response.errors ?? [];
  return {
    value: {
      ...response,
      fieldErrors: errors.filter((error) => error.path),
      globalErrors: errors.filter((error) => !error.path)
    },
    diagnostics: []
  };
}
