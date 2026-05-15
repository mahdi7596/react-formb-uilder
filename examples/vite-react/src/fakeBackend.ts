import type { BackendResponse, SubmissionEnvelope, ValidationErrorContract } from "@your-org/forms-core";
import {
  adapterFailure,
  adapterSuccess,
  staleDraftConflict,
  type CanonicalFormSchema,
  type FormPersistenceAdapter,
  type PublishedRevisionMetadata,
  type SubmitFormData
} from "@your-org/forms-adapters";

export type BackendScenario = "success" | "validation_error" | "conflict" | "auth_error" | "rate_limited" | "server_error";

export interface FakeSubmissionOptions {
  scenario: BackendScenario;
  validationPath: string;
  onEnvelope: (envelope: SubmissionEnvelope) => void;
  onResponse: (response: BackendResponse) => void;
}

export function createFakeSubmissionAdapter(options: FakeSubmissionOptions) {
  return async (envelope: SubmissionEnvelope) => {
    options.onEnvelope(envelope);
    const response = createFakeResponse(options.scenario, options.validationPath);
    options.onResponse(response);
    return adapterSuccess<SubmitFormData>({ response });
  };
}

export interface FakePersistenceHost {
  adapter: FormPersistenceAdapter;
  latestPublished: () => PublishedRevisionMetadata | null;
  forceNextSaveConflict: () => void;
  forceNextPublishConflict: () => void;
}

export function createFakePersistenceHost(initialSchema: CanonicalFormSchema): FakePersistenceHost {
  let version = 1;
  let saveConflict = false;
  let publishConflict = false;
  let draftSchema: CanonicalFormSchema = { ...initialSchema, status: "draft" };
  const publishedRevisions: PublishedRevisionMetadata[] = [];

  const draft = () => ({
    formId: draftSchema.formId,
    draftId: "draft_example_001",
    revisionId: draftSchema.revisionId,
    revisionHash: draftSchema.revisionHash,
    status: "draft" as const,
    version: `v${version}`,
    updatedAt: new Date(0).toISOString()
  });

  const adapter: FormPersistenceAdapter = {
    loadForm: () => adapterSuccess({ schema: draftSchema, draft: draft() }),
    saveDraft: (request) => {
      if (saveConflict || (request.version && request.version !== `v${version}`)) {
        saveConflict = false;
        return staleDraftConflict({ latestVersion: `v${version}`, latestRevisionHash: draftSchema.revisionHash });
      }
      version += 1;
      draftSchema = { ...request.schema, status: "draft", revisionHash: `sha256:draft-${version}` };
      return adapterSuccess({
        schema: draftSchema,
        draft: draft(),
        savedAt: new Date(1000 * version).toISOString()
      });
    },
    publishRevision: (request) => {
      if (publishConflict) {
        publishConflict = false;
        return adapterFailure("conflict", { message: "The fake host rejected this stale publish request." });
      }
      const published: PublishedRevisionMetadata = {
        formId: request.schema.formId,
        revisionId: `rev_published_${publishedRevisions.length + 1}`,
        revisionHash: `sha256:published-${publishedRevisions.length + 1}`,
        status: "published",
        schemaVersion: request.schema.schemaVersion,
        publishedAt: new Date(2000 * (publishedRevisions.length + 1)).toISOString(),
        locale: request.schema.locale,
        immutable: true,
        ...(request.schema.title ? { title: request.schema.title } : {})
      };
      publishedRevisions.push(published);
      draftSchema = {
        ...request.schema,
        status: "published",
        revisionId: published.revisionId,
        revisionHash: published.revisionHash
      };
      return adapterSuccess({ schema: draftSchema, published });
    },
    listRevisions: () => {
      const latestPublished = publishedRevisions.at(-1);
      return adapterSuccess({
        revisions: [draft(), ...publishedRevisions],
        ...(latestPublished ? { latestPublished } : {})
      });
    },
    loadPublishedForm: () => {
      const published = publishedRevisions.at(-1);
      if (!published) {
        return adapterFailure("validation_error", { message: "No published revision exists yet." });
      }
      return adapterSuccess({ schema: { ...draftSchema, status: "published" }, published });
    },
    submitForm: (request) => {
      const response = createFakeResponse("success", Object.keys(request.envelope.data)[0] ?? "email");
      return adapterSuccess({ response });
    }
  };

  return {
    adapter,
    latestPublished: () => publishedRevisions.at(-1) ?? null,
    forceNextSaveConflict: () => {
      saveConflict = true;
    },
    forceNextPublishConflict: () => {
      publishConflict = true;
    }
  };
}

export function createFakeResponse(scenario: BackendScenario, validationPath: string): BackendResponse {
  if (scenario === "success") {
    return {
      ok: true,
      status: "success",
      submissionId: "sub_example_001",
      message: "Example submission received.",
      errors: []
    };
  }

  if (scenario === "validation_error") {
    return {
      ok: false,
      status: "validation_error",
      submissionId: null,
      message: "Please fix the highlighted fields.",
      errors: [
        {
          path: validationPath,
          code: "server_validation",
          message: "The fake backend rejected this value.",
          source: "server"
        },
        {
          path: null,
          code: "example_global_validation",
          message: "This global validation message came from the fake backend.",
          source: "server"
        }
      ] as ValidationErrorContract[]
    };
  }

  const messages: Record<Exclude<BackendScenario, "success" | "validation_error">, string> = {
    conflict: "This published revision was superseded.",
    auth_error: "You are not allowed to submit this form.",
    rate_limited: "Too many attempts. Please wait before retrying.",
    server_error: "The fake backend hit a server error."
  };

  return {
    ok: false,
    status: scenario,
    submissionId: null,
    message: messages[scenario],
    errors: []
  };
}

export function prettyJson(value: unknown): string {
  if (value === null || value === undefined) {
    return "No data yet.";
  }
  return JSON.stringify(value, null, 2);
}
