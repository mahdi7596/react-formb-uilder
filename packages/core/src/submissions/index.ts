import type { JsonObject } from "../schema/index.js";
import { evaluateCondition } from "../conditions/index.js";
import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";
import { setValueAtPath } from "../paths/index.js";
import { findDangerousKeys } from "../safety/index.js";

export interface FileMetadata {
  field: string;
  fileId: string;
  name?: string;
  mimeType?: string;
  size?: number;
  meta?: JsonObject;
}

export interface SubmissionEnvelope {
  formId: string;
  revisionId: string;
  revisionHash: string;
  schemaVersion: string;
  submissionAttemptId: string;
  submittedAt: string;
  locale: string;
  data: JsonObject;
  files: FileMetadata[];
  meta?: JsonObject;
}

export interface SubmissionRuntimeResult<T> {
  value?: T;
  diagnostics: Diagnostic[];
}

export interface NormalizeSubmissionInput {
  schema: Record<string, unknown>;
  values: Record<string, unknown>;
}

export interface CreateSubmissionEnvelopeInput extends NormalizeSubmissionInput {
  files?: unknown[];
  locale: string;
  submissionAttemptId: string;
  submittedAt: string;
  meta?: JsonObject;
}

export function resolveDefaultValues(schema: Record<string, unknown>): SubmissionRuntimeResult<Record<string, unknown>> {
  const defaults: Record<string, unknown> = {};
  const diagnostics = dangerousDiagnostics(schema);
  for (const node of readNodes(schema)) {
    if ((node.type === "field" || node.type === "hidden") && typeof node.name === "string" && "defaultValue" in node) {
      defaults[node.name] = node.defaultValue;
    }
  }
  return { value: defaults, diagnostics };
}

export function normalizeSubmissionData(
  input: NormalizeSubmissionInput
): SubmissionRuntimeResult<Record<string, unknown>> {
  const diagnostics = dangerousDiagnostics(input.values);
  const output: Record<string, unknown> = {};
  const preserveHidden = readSettings(input.schema).preserveHiddenValues === true;

  for (const node of readNodes(input.schema)) {
    if (node.type !== "field" && node.type !== "hidden") {
      continue;
    }
    if (typeof node.name !== "string") {
      continue;
    }

    const hidden = isNodeHidden(node, input.values) || node.type === "hidden";
    const disabled = isNodeDisabled(node, input.values);
    if ((hidden && !preserveHidden) || disabled) {
      continue;
    }

    const value = input.values[node.name];
    if (shouldOmitValue(node, value)) {
      continue;
    }

    const setResult = setValueAtPath(output, node.name, value);
    diagnostics.push(...setResult.diagnostics);
    if (setResult.ok) {
      Object.assign(output, setResult.value);
    }
  }

  return { value: output, diagnostics: dedupeDiagnostics(diagnostics) };
}

export function createSubmissionEnvelope(
  input: CreateSubmissionEnvelopeInput
): SubmissionRuntimeResult<SubmissionEnvelope> {
  const diagnostics: Diagnostic[] = [];
  if (!input.submissionAttemptId || !input.submittedAt || !input.locale) {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidSubmissionEnvelope }));
  }
  diagnostics.push(...dangerousDiagnostics(input.meta ?? {}));

  const normalized = normalizeSubmissionData(input);
  diagnostics.push(...normalized.diagnostics);

  const files = normalizeFiles(input.files ?? [], diagnostics);
  const envelope: SubmissionEnvelope = {
    formId: String(input.schema.formId ?? ""),
    revisionId: String(input.schema.revisionId ?? ""),
    revisionHash: String(input.schema.revisionHash ?? ""),
    schemaVersion: String(input.schema.schemaVersion ?? ""),
    submissionAttemptId: input.submissionAttemptId,
    submittedAt: input.submittedAt,
    locale: input.locale,
    data: (normalized.value ?? {}) as JsonObject,
    files,
    ...(input.meta ? { meta: input.meta } : {})
  };

  if (!envelope.formId || !envelope.revisionId || !envelope.revisionHash || !envelope.schemaVersion) {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidSubmissionEnvelope }));
  }

  return { value: envelope, diagnostics: dedupeDiagnostics(diagnostics) };
}

function normalizeFiles(files: unknown[], diagnostics: Diagnostic[]): FileMetadata[] {
  const normalized: FileMetadata[] = [];
  for (const file of files) {
    if (!isRecord(file) || typeof file.field !== "string" || typeof file.fileId !== "string") {
      diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidFileMetadata }));
      continue;
    }
    diagnostics.push(...dangerousDiagnostics(file.meta ?? {}));
    normalized.push(file as unknown as FileMetadata);
  }
  return normalized;
}

function readNodes(schema: Record<string, unknown>): Record<string, unknown>[] {
  return Array.isArray(schema.nodes) ? schema.nodes.filter(isRecord) : [];
}

function readSettings(schema: Record<string, unknown>): Record<string, unknown> {
  return isRecord(schema.settings) ? schema.settings : {};
}

function isNodeHidden(node: Record<string, unknown>, values: Record<string, unknown>): boolean {
  if (!isRecord(node.visibility)) {
    return false;
  }
  return !evaluateCondition(node.visibility as never, { values }).value;
}

function isNodeDisabled(node: Record<string, unknown>, values: Record<string, unknown>): boolean {
  if (!isRecord(node.enabledWhen)) {
    return false;
  }
  return !evaluateCondition(node.enabledWhen as never, { values }).value;
}

function shouldOmitValue(node: Record<string, unknown>, value: unknown): boolean {
  if (node.fieldType === "checkbox" || node.fieldType === "switch") {
    return value === undefined || value === null;
  }
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function dangerousDiagnostics(value: unknown): Diagnostic[] {
  return findDangerousKeys(value).map((finding) =>
    createDiagnostic({ code: DIAGNOSTIC_CODES.dangerousKey, path: finding.path })
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
