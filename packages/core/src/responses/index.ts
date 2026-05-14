import type { JsonObject } from "../schema/index.js";
import type { ValidationErrorContract } from "../validation/index.js";
import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";
import { isSubmittedPath } from "../paths/index.js";
import { findDangerousKeys } from "../safety/index.js";

export type BackendResponseStatus =
  | "success"
  | "validation_error"
  | "server_error"
  | "auth_error"
  | "rate_limited"
  | "conflict";

export interface BackendResponse {
  ok: boolean;
  status: BackendResponseStatus;
  submissionId: string | null;
  errors: ValidationErrorContract[];
  message?: string;
  meta?: JsonObject;
}

export interface ParsedBackendResponse {
  ok: boolean;
  status: BackendResponseStatus;
  submissionId: string | null;
  fieldErrors: ValidationErrorContract[];
  globalErrors: ValidationErrorContract[];
  message?: string;
  meta?: JsonObject;
}

export interface ParseBackendResponseResult {
  value?: ParsedBackendResponse;
  diagnostics: Diagnostic[];
}

const BACKEND_STATUSES = new Set(["success", "validation_error", "server_error", "auth_error", "rate_limited", "conflict"]);

export function parseBackendResponse(value: unknown): ParseBackendResponseResult {
  const diagnostics: Diagnostic[] = [];
  if (!isRecord(value)) {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidBackendResponse }));
    return { value: fallbackResponse(), diagnostics };
  }

  diagnostics.push(...dangerousDiagnostics(value.meta));
  const status = typeof value.status === "string" && BACKEND_STATUSES.has(value.status)
    ? (value.status as BackendResponseStatus)
    : null;
  if (!status) {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidBackendResponse }));
  }

  const errors = Array.isArray(value.errors) ? value.errors.filter(isRecord) : [];
  const fieldErrors: ValidationErrorContract[] = [];
  const globalErrors: ValidationErrorContract[] = [];

  for (const error of errors) {
    diagnostics.push(...dangerousDiagnostics(error.params));
    if (error.path === null) {
      globalErrors.push(error as unknown as ValidationErrorContract);
    } else if (typeof error.path === "string" && isSubmittedPath(error.path, "runtime-error")) {
      fieldErrors.push(error as unknown as ValidationErrorContract);
    } else {
      diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidSubmittedPath }));
    }
  }

  const parsed: ParsedBackendResponse = {
    ok: value.ok === true && status === "success",
    status: status ?? "server_error",
    submissionId: typeof value.submissionId === "string" ? value.submissionId : null,
    fieldErrors,
    globalErrors,
    ...(typeof value.message === "string" ? { message: value.message } : {}),
    ...(isRecord(value.meta) ? { meta: value.meta as JsonObject } : {})
  };

  return { value: parsed, diagnostics: dedupeDiagnostics(diagnostics) };
}

function fallbackResponse(): ParsedBackendResponse {
  return { ok: false, status: "server_error", submissionId: null, fieldErrors: [], globalErrors: [] };
}

function dangerousDiagnostics(value: unknown): Diagnostic[] {
  return findDangerousKeys(value).map((finding) =>
    createDiagnostic({ code: DIAGNOSTIC_CODES.dangerousKey, path: finding.path, source: "server" })
  );
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
