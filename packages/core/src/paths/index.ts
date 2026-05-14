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
  return (kind === "schema" ? SCHEMA_PATH_PATTERN : RUNTIME_PATH_PATTERN).test(value);
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
