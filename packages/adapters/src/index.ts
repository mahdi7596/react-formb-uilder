export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface Diagnostic {
  code: string;
  message: string;
  path: string | null;
  severity: "info" | "warning" | "error";
  source: "schema" | "client" | "server" | "adapter" | "compiler";
  meta?: Record<string, unknown>;
}

export interface CanonicalFormSchema extends Record<string, unknown> {
  schemaVersion: string;
  formId: string;
  revisionId: string;
  revisionHash: string;
  status: string;
  locale: string;
  title?: string;
  nodes: unknown[];
}

export interface SubmissionEnvelope extends Record<string, unknown> {
  formId: string;
  revisionId: string;
  revisionHash: string;
  schemaVersion: string;
  submissionAttemptId: string;
  submittedAt: string;
  locale: string;
  data: JsonObject;
  files: unknown[];
}

export interface BackendResponse {
  ok: boolean;
  status: string;
  submissionId?: string | null;
  errors: unknown[];
  message?: string;
}

export type AdapterStatus =
  | "success"
  | "validation_error"
  | "conflict"
  | "auth_error"
  | "rate_limited"
  | "server_error"
  | "network_error"
  | "malformed_response"
  | "dangerous_key"
  | "blocked";

export interface AdapterResultBase {
  status: AdapterStatus;
  message?: string;
  diagnostics: Diagnostic[];
  meta?: JsonObject;
}

export interface AdapterSuccessResult<TData> extends AdapterResultBase {
  ok: true;
  status: "success";
  data: TData;
}

export interface AdapterFailureResult extends AdapterResultBase {
  ok: false;
  status: Exclude<AdapterStatus, "success">;
  conflict?: AdapterConflict;
}

export type AdapterResult<TData> = AdapterSuccessResult<TData> | AdapterFailureResult;

export interface AdapterConflict {
  reason: "stale_draft" | "stale_publish" | "published_revision_immutable" | "host_rejected" | "unknown";
  latestVersion?: string;
  latestRevisionId?: string;
  latestRevisionHash?: string;
  canRetry: boolean;
  canReload: boolean;
}

export interface AdapterRequestContext {
  formId: string;
  locale?: string;
  requestId?: string;
  actorId?: string;
  meta?: JsonObject;
}

export interface DraftRevisionMetadata {
  formId: string;
  draftId: string;
  revisionId: string;
  revisionHash: string;
  status: "draft";
  version?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface PublishedRevisionMetadata {
  formId: string;
  revisionId: string;
  revisionHash: string;
  status: "published";
  schemaVersion: string;
  publishedAt: string;
  title?: string;
  locale?: string;
  version?: string;
  immutable: true;
}

export interface RevisionListEntry {
  formId: string;
  revisionId: string;
  status: "draft" | "published" | "archived";
  revisionHash?: string;
  title?: string;
  locale?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  schema?: CanonicalFormSchema;
}

export interface LoadFormRequest extends AdapterRequestContext {
  draftId?: string;
}

export interface LoadFormData {
  schema: CanonicalFormSchema;
  draft: DraftRevisionMetadata;
}

export interface SaveDraftRequest extends AdapterRequestContext {
  schema: CanonicalFormSchema;
  draft: Pick<DraftRevisionMetadata, "draftId" | "revisionId" | "revisionHash">;
  version?: string;
}

export interface SaveDraftData {
  schema: CanonicalFormSchema;
  draft: DraftRevisionMetadata;
  savedAt: string;
}

export interface PublishRevisionRequest extends AdapterRequestContext {
  schema: CanonicalFormSchema;
  draft: Pick<DraftRevisionMetadata, "draftId" | "revisionId" | "revisionHash">;
  version?: string;
}

export interface PublishRevisionData {
  schema: CanonicalFormSchema;
  published: PublishedRevisionMetadata;
}

export interface ListRevisionsRequest extends AdapterRequestContext {
  includeSchemas?: boolean;
}

export interface ListRevisionsData {
  revisions: RevisionListEntry[];
  latestPublished?: PublishedRevisionMetadata;
}

export interface LoadPublishedFormRequest extends AdapterRequestContext {
  revisionId?: string;
}

export interface LoadPublishedFormData {
  schema: CanonicalFormSchema;
  published: PublishedRevisionMetadata;
}

export interface SubmitFormRequest extends AdapterRequestContext {
  envelope: SubmissionEnvelope;
}

export interface SubmitFormData {
  response: BackendResponse;
}

export interface FormPersistenceAdapter {
  loadForm: (request: LoadFormRequest) => AdapterMaybePromise<AdapterResult<LoadFormData>>;
  saveDraft: (request: SaveDraftRequest) => AdapterMaybePromise<AdapterResult<SaveDraftData>>;
  publishRevision: (request: PublishRevisionRequest) => AdapterMaybePromise<AdapterResult<PublishRevisionData>>;
  listRevisions: (request: ListRevisionsRequest) => AdapterMaybePromise<AdapterResult<ListRevisionsData>>;
  loadPublishedForm: (request: LoadPublishedFormRequest) => AdapterMaybePromise<AdapterResult<LoadPublishedFormData>>;
  submitForm: (request: SubmitFormRequest) => AdapterMaybePromise<AdapterResult<SubmitFormData>>;
}

export type AdapterMaybePromise<T> = T | Promise<T>;

export function adapterSuccess<TData>(
  data: TData,
  options: Omit<Partial<AdapterSuccessResult<TData>>, "ok" | "status" | "data" | "diagnostics"> & {
    diagnostics?: Diagnostic[];
  } = {}
): AdapterSuccessResult<TData> {
  return {
    ok: true,
    status: "success",
    data,
    diagnostics: options.diagnostics ?? [],
    ...(options.message ? { message: options.message } : {}),
    ...(options.meta ? { meta: options.meta } : {})
  };
}

export function adapterFailure(
  status: AdapterFailureResult["status"],
  options: Omit<Partial<AdapterFailureResult>, "ok" | "status" | "diagnostics"> & {
    diagnostics?: Diagnostic[];
  } = {}
): AdapterFailureResult {
  return {
    ok: false,
    status,
    diagnostics: options.diagnostics ?? [],
    ...(options.message ? { message: options.message } : {}),
    ...(options.meta ? { meta: options.meta } : {}),
    ...(options.conflict ? { conflict: options.conflict } : {})
  };
}

export function staleDraftConflict(input: {
  latestVersion?: string;
  latestRevisionId?: string;
  latestRevisionHash?: string;
  message?: string;
} = {}): AdapterFailureResult {
  return adapterFailure("conflict", {
    message: input.message ?? "Draft has changed on the host.",
    conflict: {
      reason: "stale_draft",
      canRetry: false,
      canReload: true,
      ...(input.latestVersion ? { latestVersion: input.latestVersion } : {}),
      ...(input.latestRevisionId ? { latestRevisionId: input.latestRevisionId } : {}),
      ...(input.latestRevisionHash ? { latestRevisionHash: input.latestRevisionHash } : {})
    }
  });
}

export function immutablePublishedRevisionConflict(input: {
  latestRevisionId?: string;
  latestRevisionHash?: string;
  message?: string;
} = {}): AdapterFailureResult {
  return adapterFailure("conflict", {
    message: input.message ?? "Published revisions are immutable.",
    conflict: {
      reason: "published_revision_immutable",
      canRetry: false,
      canReload: true,
      ...(input.latestRevisionId ? { latestRevisionId: input.latestRevisionId } : {}),
      ...(input.latestRevisionHash ? { latestRevisionHash: input.latestRevisionHash } : {})
    }
  });
}

export function dangerousKeyDiagnostics(value: unknown, path = "$"): Diagnostic[] {
  return findDangerousKeys(value, path).map((finding) =>
    ({
      code: "dangerous_key",
      path: finding.path,
      source: "adapter",
      severity: "error",
      message: `Adapter data contains dangerous key "${finding.key}".`
    })
  );
}

export function normalizeAdapterData<TData>(data: TData, options: { path?: string; message?: string } = {}): AdapterResult<TData> {
  const diagnostics = dangerousKeyDiagnostics(data, options.path ?? "$");
  if (diagnostics.length > 0) {
    return adapterFailure("dangerous_key", {
      message: options.message ?? "Adapter data was rejected because it contains dangerous keys.",
      diagnostics
    });
  }
  return adapterSuccess(data);
}

export function normalizeUnknownAdapterError(error: unknown): AdapterFailureResult {
  if (error instanceof Error) {
    return adapterFailure("server_error", { message: error.message });
  }
  return adapterFailure("server_error", { message: "Adapter operation failed." });
}

export const packageBoundary = {
  name: "@your-org/forms-adapters",
  responsibility: "thin host integration helpers for agreed JSON contracts",
  phase: "persistence-publish-adapters"
} as const;

function findDangerousKeys(value: unknown, path = "$"): Array<{ key: string; path: string }> {
  if (!value || typeof value !== "object") {
    return [];
  }
  const findings: Array<{ key: string; path: string }> = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const childPath = `${path}.${key}`;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      findings.push({ key, path: childPath });
    }
    findings.push(...findDangerousKeys(nested, childPath));
  }
  return findings;
}
