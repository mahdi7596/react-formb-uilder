export interface Diagnostic {
  code: string;
  message?: string;
}

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
