import {
  analyzeSchema,
  type CanonicalFormSchema,
  type Diagnostic,
  type DiagnosticSeverity
} from "@your-org/forms-core";
import type {
  AdapterResult,
  DraftRevisionMetadata,
  PublishedRevisionMetadata,
  RevisionListEntry
} from "@your-org/forms-adapters";
import type {
  BuilderArtifactBundle,
  CompilerDiagnostic
} from "@your-org/forms-validators";

import type { BuilderCommandDiagnostic, BuilderSchema } from "./index.js";

export type { BuilderArtifactBundle } from "@your-org/forms-validators";
export type { PublishedRevisionMetadata } from "@your-org/forms-adapters";

export type BuilderPersistenceStatus =
  | "idle"
  | "loading"
  | "dirty"
  | "saving"
  | "saved"
  | "failed"
  | "retrying"
  | "conflicted";

export interface BuilderPersistenceState {
  status: BuilderPersistenceStatus;
  message?: string;
  draft?: DraftRevisionMetadata;
  lastSavedAt?: string;
  canRetry: boolean;
  canReload: boolean;
  diagnostics: BuilderWorkflowDiagnostic[];
}

export interface BuilderWorkflowDiagnostic {
  code: string;
  message: string;
  path: string | null;
  severity: "info" | "warning" | "error";
  source: "schema" | "client" | "server" | "adapter" | "compiler";
  meta?: Record<string, unknown>;
}

export type PublishCheckSeverity = "error" | "warning" | "info";
export type PublishCheckSource = "schema" | "compiler" | "builder" | "metadata" | "adapter" | "revision";

export interface PublishCheckItem {
  id: string;
  source: PublishCheckSource;
  severity: PublishCheckSeverity;
  label: string;
  message: string;
  code?: string;
  nodeId?: string;
  path?: string | null;
}

export interface PublishChecklist {
  items: PublishCheckItem[];
  blocking: PublishCheckItem[];
  warnings: PublishCheckItem[];
  canPublish: boolean;
}

export interface RevisionComparison {
  latestPublished?: PublishedRevisionMetadata;
  currentRevisionId: string;
  currentRevisionHash: string;
  warnings: PublishCheckItem[];
}

export interface BuildPublishChecklistInput {
  schema: BuilderSchema | CanonicalFormSchema;
  artifactBundle?: BuilderArtifactBundle | undefined;
  commandDiagnostics?: BuilderCommandDiagnostic[] | undefined;
  adapterResult?: AdapterResult<unknown> | undefined;
  latestPublished?: PublishedRevisionMetadata | RevisionListEntry | null | undefined;
}

const REQUIRED_SCHEMA_METADATA = ["schemaVersion", "formId", "revisionId", "revisionHash", "locale", "title", "nodes"] as const;

export function createPersistenceState(
  status: BuilderPersistenceStatus,
  options: Partial<Omit<BuilderPersistenceState, "status" | "diagnostics" | "canRetry" | "canReload">> & {
    diagnostics?: BuilderWorkflowDiagnostic[];
    canRetry?: boolean;
    canReload?: boolean;
  } = {}
): BuilderPersistenceState {
  return {
    status,
    diagnostics: options.diagnostics ?? [],
    canRetry: options.canRetry ?? status === "failed",
    canReload: options.canReload ?? status === "conflicted",
    ...(options.message ? { message: options.message } : {}),
    ...(options.draft ? { draft: options.draft } : {}),
    ...(options.lastSavedAt ? { lastSavedAt: options.lastSavedAt } : {})
  };
}

export function buildPublishChecklist(input: BuildPublishChecklistInput): PublishChecklist {
  const items: PublishCheckItem[] = [
    ...metadataChecks(input.schema),
    ...schemaDiagnosticChecks(input.schema),
    ...compilerDiagnosticChecks(input.artifactBundle?.diagnostics ?? []),
    ...builderDiagnosticChecks(input.commandDiagnostics ?? []),
    ...adapterChecks(input.adapterResult),
    ...compareDraftToPublished(input.schema, input.latestPublished).warnings
  ];
  const blocking = items.filter((item) => item.severity === "error");
  const warnings = items.filter((item) => item.severity === "warning");
  return {
    items,
    blocking,
    warnings,
    canPublish: blocking.length === 0
  };
}

export function compareDraftToPublished(
  schema: BuilderSchema | CanonicalFormSchema,
  latestPublished?: PublishedRevisionMetadata | RevisionListEntry | null
): RevisionComparison {
  const currentRevisionId = stringValue(schema.revisionId);
  const currentRevisionHash = stringValue(schema.revisionHash);
  const normalized = normalizePublished(latestPublished);
  const warnings: PublishCheckItem[] = [];
  if (normalized && normalized.revisionHash && normalized.revisionHash !== currentRevisionHash) {
    warnings.push({
      id: "revision.hash_changed",
      source: "revision",
      severity: "warning",
      label: "Revision differs from published version",
      message: `Current draft hash ${currentRevisionHash || "missing"} differs from latest published hash ${normalized.revisionHash}.`,
      code: "revision_hash_changed"
    });
  }
  return {
    ...(normalized ? { latestPublished: normalized } : {}),
    currentRevisionId,
    currentRevisionHash,
    warnings
  };
}

function metadataChecks(schema: BuilderSchema | CanonicalFormSchema): PublishCheckItem[] {
  return REQUIRED_SCHEMA_METADATA.flatMap((key) => {
    const value = schema[key];
    const missing = key === "nodes" ? !Array.isArray(value) || value.length === 0 : value === undefined || value === null || value === "";
    return missing
      ? [{
          id: `metadata.${key}`,
          source: "metadata" as const,
          severity: "error" as const,
          label: `Missing ${key}`,
          message: `Publish requires schema metadata field "${key}".`,
          code: "missing_required_metadata",
          path: key
        }]
      : [];
  });
}

function schemaDiagnosticChecks(schema: BuilderSchema | CanonicalFormSchema): PublishCheckItem[] {
  return analyzeSchema(schema).diagnostics.map((diagnostic, index) => diagnosticToCheck(diagnostic, "schema", index));
}

function compilerDiagnosticChecks(diagnostics: CompilerDiagnostic[]): PublishCheckItem[] {
  return diagnostics.map((diagnostic, index) => diagnosticToCheck(diagnostic, "compiler", index));
}

function builderDiagnosticChecks(diagnostics: BuilderCommandDiagnostic[]): PublishCheckItem[] {
  return diagnostics
    .filter((diagnostic) => diagnostic.code.startsWith("dangerous_") || diagnostic.severity === "error")
    .map((diagnostic, index) => ({
      id: `builder.${diagnostic.code}.${index}`,
      source: "builder",
      severity: diagnostic.severity === "error" ? "error" : "warning",
      label: diagnostic.code.replaceAll("_", " "),
      message: diagnostic.message,
      code: diagnostic.code,
      ...(diagnostic.nodeId ? { nodeId: diagnostic.nodeId } : {})
    }));
}

function adapterChecks(result: AdapterResult<unknown> | undefined): PublishCheckItem[] {
  if (!result || result.ok) {
    return [];
  }
  return [{
    id: `adapter.${result.status}`,
    source: "adapter",
    severity: result.status === "conflict" || result.status === "blocked" ? "error" : "warning",
    label: result.status.replaceAll("_", " "),
    message: result.message ?? `Adapter returned ${result.status}.`,
    code: result.status
  }];
}

function diagnosticToCheck(diagnostic: Diagnostic, source: PublishCheckSource, index: number): PublishCheckItem {
  return {
    id: `${source}.${diagnostic.code}.${index}`,
    source,
    severity: severityFor(diagnostic.severity),
    label: diagnostic.code.replaceAll("_", " "),
    message: diagnostic.message,
    code: diagnostic.code,
    path: diagnostic.path
  };
}

function severityFor(severity: DiagnosticSeverity): PublishCheckSeverity {
  if (severity === "error") {
    return "error";
  }
  if (severity === "warning") {
    return "warning";
  }
  return "info";
}

function normalizePublished(value: PublishedRevisionMetadata | RevisionListEntry | null | undefined): PublishedRevisionMetadata | undefined {
  if (!value || value.status !== "published" || !value.revisionHash) {
    return undefined;
  }
  return {
    formId: value.formId,
    revisionId: value.revisionId,
    revisionHash: value.revisionHash,
    status: "published",
    schemaVersion: "schemaVersion" in value && typeof value.schemaVersion === "string" ? value.schemaVersion : "1.0.0",
    publishedAt: value.publishedAt ?? "",
    immutable: true,
    ...(value.title ? { title: value.title } : {}),
    ...(value.locale ? { locale: value.locale } : {}),
    ...(value.version ? { version: value.version } : {})
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
