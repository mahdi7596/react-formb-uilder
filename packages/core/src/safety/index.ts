import { DANGEROUS_KEYS, type DangerousKey } from "../paths/index.js";

export interface DangerousKeyFinding {
  key: DangerousKey;
  path: string;
}

export function findDangerousKeys(value: unknown, path = "$"): DangerousKeyFinding[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const findings: DangerousKeyFinding[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const childPath = `${path}.${key}`;
    if ((DANGEROUS_KEYS as readonly string[]).includes(key)) {
      findings.push({ key: key as DangerousKey, path: childPath });
    }
    findings.push(...findDangerousKeys(nested, childPath));
  }

  return findings;
}

export function hasExecutableCode(value: unknown): boolean {
  if (typeof value === "string") {
    return /\bfunction\b|=>|\breturn\b|React\.createElement|<\s*[A-Z][A-Za-z0-9]*/.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(hasExecutableCode);
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasExecutableCode);
  }

  return false;
}
