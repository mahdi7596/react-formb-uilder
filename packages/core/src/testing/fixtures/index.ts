import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic, type DiagnosticCode } from "../../diagnostics/index.js";
import { hasDangerousKey, isSubmittedPath } from "../../paths/index.js";
import { fixtureManifest } from "./manifest.js";
import type { FixtureCategory, FixtureContractResult, FixtureExpectation, FixtureManifest, FixtureManifestEntry, LoadedFixtureEntry } from "./types.js";

export { fixtureManifest } from "./manifest.js";
export type {
  FixtureCategory,
  FixtureContractResult,
  FixtureExpectation,
  FixtureManifest,
  FixtureManifestEntry,
  LoadedFixtureEntry
} from "./types.js";

const FIXTURE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "json");
const BUILT_IN_FIELD_TYPES = new Set(["text", "textarea", "email", "url", "number", "checkbox", "radio", "select", "fileMetadata"]);
const BUILT_IN_NODE_TYPES = new Set(["field", "hidden", "section", "step", "content", "ending"]);
const BUILT_IN_VALIDATION_RULES = new Set([
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
const BACKEND_RESPONSE_STATUSES = new Set(["success", "validation_error", "server_error", "auth_error", "rate_limited", "conflict"]);

export function fixturePath(manifestEntry: FixtureManifestEntry): string {
  return join(FIXTURE_ROOT, manifestEntry.path);
}

export function loadFixtureEntries(): LoadedFixtureEntry[] {
  return fixtureManifest.fixtures.map((manifestEntry) => ({
    manifestEntry,
    data: JSON.parse(readFileSync(fixturePath(manifestEntry), "utf8")) as unknown
  }));
}

export function checkFixtureContract(entry: LoadedFixtureEntry): Diagnostic[] {
  const codes = new Set<DiagnosticCode>();

  if (hasDangerousKey(entry.data)) {
    codes.add(DIAGNOSTIC_CODES.dangerousKey);
  }

  if (entry.manifestEntry.category === "schema") {
    collectSchemaDiagnostics(entry.data, codes);
  }

  if (entry.manifestEntry.category === "submission") {
    collectSubmissionDiagnostics(entry.data, codes);
  }

  if (entry.manifestEntry.category === "response") {
    collectResponseDiagnostics(entry.data, codes);
  }

  if (entry.manifestEntry.category === "compiler-diagnostic") {
    collectCompilerDiagnostic(entry.data, codes);
  }

  return [...codes].map((code) =>
    createDiagnostic({
      code,
      message: `Fixture ${entry.manifestEntry.id} produced ${code}`,
      source: sourceForCategory(entry.manifestEntry.category)
    })
  );
}

export function checkAllFixtureContracts(): FixtureContractResult[] {
  return loadFixtureEntries().map((entry) => ({
    fixtureId: entry.manifestEntry.id,
    diagnostics: checkFixtureContract(entry)
  }));
}

function collectSchemaDiagnostics(value: unknown, codes: Set<DiagnosticCode>): void {
  if (!isRecord(value)) {
    codes.add(DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
    return;
  }

  if (typeof value.schemaVersion !== "string") {
    codes.add(DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
  }

  const nodes = Array.isArray(value.nodes) ? value.nodes.filter(isRecord) : [];
  const nodeIds = new Set<string>();
  const names = new Set<string>();
  const registeredValidators = readRegisteredValidators(value);

  for (const node of nodes) {
    if (typeof node.id === "string") {
      if (nodeIds.has(node.id)) {
        codes.add(DIAGNOSTIC_CODES.duplicateNodeId);
      }
      nodeIds.add(node.id);
    }

    if (node.type === "repeater") {
      codes.add(DIAGNOSTIC_CODES.repeaterNotSupported);
    } else if (typeof node.type !== "string" || !BUILT_IN_NODE_TYPES.has(node.type)) {
      codes.add(DIAGNOSTIC_CODES.unknownNodeType);
    }

    if (node.type === "field" || node.type === "hidden") {
      const name = node.name;
      if (typeof name !== "string" || !isSubmittedPath(name)) {
        codes.add(DIAGNOSTIC_CODES.invalidSubmittedPath);
      } else {
        if (names.has(name)) {
          codes.add(DIAGNOSTIC_CODES.duplicateSubmittedPath);
        }
        names.add(name);
      }
    }

    if (node.type === "field") {
      collectFieldDiagnostics(node, registeredValidators, codes);
    }
  }

  collectConditionDiagnostics(nodes, names, codes);
}

function collectFieldDiagnostics(
  node: Record<string, unknown>,
  registeredValidators: Set<string>,
  codes: Set<DiagnosticCode>
): void {
  if (node.fieldType === "fileUpload" || hasUploadLifecycle(node)) {
    codes.add(DIAGNOSTIC_CODES.uploadLifecycleNotSupported);
  } else if (typeof node.fieldType !== "string" || !BUILT_IN_FIELD_TYPES.has(node.fieldType)) {
    codes.add(DIAGNOSTIC_CODES.unknownFieldType);
  }

  if (hasExecutableCode(node)) {
    codes.add(DIAGNOSTIC_CODES.executableCodeProhibited);
  }

  const validation = Array.isArray(node.validation) ? node.validation.filter(isRecord) : [];
  for (const rule of validation) {
    const type = rule.type;
    if (typeof type !== "string") {
      codes.add(DIAGNOSTIC_CODES.unknownValidationRule);
    } else if (BUILT_IN_VALIDATION_RULES.has(type)) {
      continue;
    } else if (type.startsWith("custom:")) {
      if (!registeredValidators.has(type)) {
        codes.add(DIAGNOSTIC_CODES.unsupportedCustomRegistration);
      }
    } else {
      codes.add(DIAGNOSTIC_CODES.unknownValidationRule);
    }
  }
}

function collectConditionDiagnostics(
  nodes: Record<string, unknown>[],
  submittedPaths: Set<string>,
  codes: Set<DiagnosticCode>
): void {
  const nodeById = new Map<string, Record<string, unknown>>();
  const dependencyByNode = new Map<string, string[]>();

  for (const node of nodes) {
    if (typeof node.id === "string") {
      nodeById.set(node.id, node);
    }
  }

  for (const node of nodes) {
    if (typeof node.id !== "string") {
      continue;
    }

    const dependencies = readConditionFields(node.visibility);
    dependencyByNode.set(node.id, dependencies);
    for (const dependency of dependencies) {
      if (!submittedPaths.has(dependency)) {
        codes.add(DIAGNOSTIC_CODES.invalidCondition);
      }
    }
  }

  for (const [nodeId, dependencies] of dependencyByNode) {
    for (const dependency of dependencies) {
      const dependedNode = nodes.find((node) => node.name === dependency);
      if (isRecord(dependedNode) && typeof dependedNode.id === "string") {
        const reciprocal = dependencyByNode.get(dependedNode.id) ?? [];
        const originalNode = nodeById.get(nodeId);
        if (isRecord(originalNode) && typeof originalNode.name === "string" && reciprocal.includes(originalNode.name)) {
          codes.add(DIAGNOSTIC_CODES.conditionCycle);
        }
      }
    }
  }
}

function collectSubmissionDiagnostics(value: unknown, codes: Set<DiagnosticCode>): void {
  if (!isRecord(value)) {
    codes.add(DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
    return;
  }

  if (typeof value.revisionHash !== "string" || typeof value.submissionAttemptId !== "string") {
    codes.add(DIAGNOSTIC_CODES.invalidSubmissionEnvelope);
  }

  if (value.revisionHash === "sha256:mismatch") {
    codes.add(DIAGNOSTIC_CODES.revisionHashMismatch);
  }

  const data = isRecord(value.data) ? value.data : {};
  for (const key of Object.keys(data)) {
    if (!isSubmittedPath(key, "runtime-error")) {
      codes.add(DIAGNOSTIC_CODES.invalidSubmittedPath);
    }
  }

  const meta = isRecord(value.meta) ? value.meta : {};
  const requiredPaths = Array.isArray(meta.requiredPaths) ? meta.requiredPaths.filter((path): path is string => typeof path === "string") : [];
  for (const requiredPath of requiredPaths) {
    if (!(requiredPath in data)) {
      codes.add(DIAGNOSTIC_CODES.missingRequiredField);
    }
  }

  if (typeof data.email === "string" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    codes.add(DIAGNOSTIC_CODES.invalidEmail);
  }

  if (typeof data.website === "string" && !/^https?:\/\/\S+\.\S+/.test(data.website)) {
    codes.add(DIAGNOSTIC_CODES.invalidUrl);
  }

  if (data.reason === "invalid-option") {
    codes.add(DIAGNOSTIC_CODES.invalidOption);
  }

  if (Array.isArray(value.files)) {
    for (const file of value.files) {
      if (!isRecord(file) || typeof file.field !== "string" || typeof file.fileId !== "string") {
        codes.add(DIAGNOSTIC_CODES.invalidFileMetadata);
      }
    }
  }

  if (meta.preserveHiddenValues === false && "utm.source" in data) {
    codes.add(DIAGNOSTIC_CODES.hiddenValueExcluded);
  }
}

function collectResponseDiagnostics(value: unknown, codes: Set<DiagnosticCode>): void {
  if (!isRecord(value)) {
    codes.add(DIAGNOSTIC_CODES.invalidBackendResponse);
    return;
  }

  if (typeof value.status !== "string" || !BACKEND_RESPONSE_STATUSES.has(value.status)) {
    codes.add(DIAGNOSTIC_CODES.invalidBackendResponse);
  }
}

function collectCompilerDiagnostic(value: unknown, codes: Set<DiagnosticCode>): void {
  if (isRecord(value) && typeof value.code === "string" && isDiagnosticCode(value.code)) {
    codes.add(value.code);
  }
}

function readRegisteredValidators(value: Record<string, unknown>): Set<string> {
  const meta = isRecord(value.meta) ? value.meta : {};
  const validators = Array.isArray(meta.registeredValidators) ? meta.registeredValidators : [];
  return new Set(validators.filter((validator): validator is string => typeof validator === "string"));
}

function readConditionFields(value: unknown): string[] {
  if (!isRecord(value)) {
    return [];
  }

  const fields: string[] = [];
  if (typeof value.field === "string") {
    fields.push(value.field);
  }

  for (const key of ["all", "any"] as const) {
    if (Array.isArray(value[key])) {
      for (const child of value[key]) {
        fields.push(...readConditionFields(child));
      }
    }
  }

  if ("not" in value) {
    fields.push(...readConditionFields(value.not));
  }

  return fields;
}

function hasUploadLifecycle(value: Record<string, unknown>): boolean {
  const props = isRecord(value.props) ? value.props : {};
  return "uploadLifecycle" in props || "prepareUpload" in props || "finalizeUpload" in props;
}

function hasExecutableCode(value: unknown): boolean {
  if (typeof value === "string") {
    return /\bfunction\b|=>|\breturn\b/.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(hasExecutableCode);
  }

  if (isRecord(value)) {
    return Object.values(value).some(hasExecutableCode);
  }

  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isDiagnosticCode(value: string): value is DiagnosticCode {
  return Object.values(DIAGNOSTIC_CODES).includes(value as DiagnosticCode);
}

function sourceForCategory(category: FixtureCategory): Diagnostic["source"] {
  if (category === "compiler-diagnostic") {
    return "compiler";
  }

  if (category === "response") {
    return "server";
  }

  return "schema";
}
