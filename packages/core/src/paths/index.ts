import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";

export type SubmittedPath = string & { readonly __submittedPath: unique symbol };

export interface SubmittedPathContract {
  path: string;
  kind: "schema" | "runtime-error";
}

export const DANGEROUS_KEYS = ["__proto__", "constructor", "prototype"] as const;

export type DangerousKey = (typeof DANGEROUS_KEYS)[number];

const SCHEMA_PATH_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*(\[\])?(\.[A-Za-z_][A-Za-z0-9_-]*(\[\])?)*$/;

const RUNTIME_PATH_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*(\[(\d+)\])?(\.[A-Za-z_][A-Za-z0-9_-]*(\[(\d+)\])?)*$/;

export function isSubmittedPath(value: string, kind: "schema" | "runtime-error" = "schema"): boolean {
  return parseSubmittedPath(value, { kind }).ok;
}

export function hasDangerousKey(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if ((DANGEROUS_KEYS as readonly string[]).includes(key) || hasDangerousKey(nested)) {
      return true;
    }
  }

  return false;
}

export type SubmittedPathKind = "schema" | "runtime-error";

export type SubmittedPathSegment =
  | { type: "property"; key: string }
  | { type: "array"; key: string; index: number | null };

export interface ParsedSubmittedPath {
  kind: SubmittedPathKind;
  raw: string;
  segments: SubmittedPathSegment[];
}

export type RuntimeResult<T> =
  | { ok: true; value: T; diagnostics: Diagnostic[] }
  | { ok: false; value?: undefined; diagnostics: Diagnostic[] };

export function parseSubmittedPath(
  value: string,
  options: { kind?: SubmittedPathKind } = {}
): RuntimeResult<ParsedSubmittedPath> {
  const kind = options.kind ?? "schema";
  const diagnostics: Diagnostic[] = [];
  const pattern = kind === "schema" ? SCHEMA_PATH_PATTERN : RUNTIME_PATH_PATTERN;

  if (!pattern.test(value)) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.invalidSubmittedPath,
        message: `Invalid submitted path: ${value}`,
        path: value
      })
    );
  }

  const segments = value.split(".").flatMap<SubmittedPathSegment>((part) => {
    const schemaArray = part.match(/^([A-Za-z_][A-Za-z0-9_-]*)\[\]$/);
    const runtimeArray = part.match(/^([A-Za-z_][A-Za-z0-9_-]*)\[(\d+)\]$/);
    const key = schemaArray?.[1] ?? runtimeArray?.[1] ?? part;

    if ((DANGEROUS_KEYS as readonly string[]).includes(key)) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.dangerousKey,
          message: `Dangerous submitted path segment: ${key}`,
          path: value
        })
      );
    }

    if (schemaArray) {
      return [{ type: "array", key, index: null }];
    }

    if (runtimeArray) {
      return [{ type: "array", key, index: Number(runtimeArray[2]) }];
    }

    return [{ type: "property", key }];
  });

  if (diagnostics.length > 0) {
    return { ok: false, diagnostics };
  }

  return { ok: true, value: { kind, raw: value, segments }, diagnostics: [] };
}

export function serializeSubmittedPath(path: ParsedSubmittedPath): string {
  return path.segments
    .map((segment) => {
      if (segment.type === "property") {
        return segment.key;
      }

      return `${segment.key}[${segment.index ?? ""}]`;
    })
    .join(".");
}

export function getValueAtPath(
  source: unknown,
  path: string,
  options: { kind?: SubmittedPathKind } = {}
): RuntimeResult<unknown> {
  const parsed = parseSubmittedPath(path, options);
  if (!parsed.ok) {
    return parsed;
  }

  let current: unknown = source;
  for (const segment of parsed.value.segments) {
    if (!current || typeof current !== "object") {
      return { ok: true, value: undefined, diagnostics: [] };
    }

    const container = current as Record<string, unknown>;
    current = container[segment.key];
    if (segment.type === "array" && segment.index !== null) {
      current = Array.isArray(current) ? current[segment.index] : undefined;
    }
  }

  return { ok: true, value: current, diagnostics: [] };
}

export function setValueAtPath(
  source: unknown,
  path: string,
  value: unknown,
  options: { kind?: SubmittedPathKind } = {}
): RuntimeResult<Record<string, unknown>> {
  const parsed = parseSubmittedPath(path, options);
  if (!parsed.ok) {
    return parsed;
  }

  const root = isPlainRecord(source) ? clonePlain(source) : {};
  let current: Record<string, unknown> = root;

  for (const [index, segment] of parsed.value.segments.entries()) {
    const isLast = index === parsed.value.segments.length - 1;

    if (segment.type === "array") {
      const arrayValue = Array.isArray(current[segment.key]) ? [...(current[segment.key] as unknown[])] : [];
      current[segment.key] = arrayValue;

      if (segment.index === null) {
        if (isLast) {
          current[segment.key] = value;
          continue;
        }

        if (!isPlainRecord(arrayValue[0])) {
          arrayValue[0] = {};
        }
        current = arrayValue[0] as Record<string, unknown>;
        continue;
      }

      if (isLast) {
        arrayValue[segment.index] = value;
        continue;
      }

      if (!isPlainRecord(arrayValue[segment.index])) {
        arrayValue[segment.index] = {};
      }
      current = arrayValue[segment.index] as Record<string, unknown>;
      continue;
    }

    if (isLast) {
      current[segment.key] = value;
      continue;
    }

    if (!isPlainRecord(current[segment.key])) {
      current[segment.key] = {};
    }
    current = current[segment.key] as Record<string, unknown>;
  }

  return { ok: true, value: root, diagnostics: [] };
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clonePlain(value: Record<string, unknown>): Record<string, unknown> {
  const cloned: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    cloned[key] = Array.isArray(nested)
      ? [...nested]
      : isPlainRecord(nested)
        ? clonePlain(nested)
        : nested;
  }
  return cloned;
}
