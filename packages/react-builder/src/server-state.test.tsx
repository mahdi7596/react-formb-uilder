// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { adapterSuccess, staleDraftConflict, type FormPersistenceAdapter } from "@your-org/forms-adapters";

import { useBuilderServerState, type BuilderSchema } from "./index.js";

const schema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "form_server_state",
  revisionId: "rev_draft",
  revisionHash: "sha256:draft",
  status: "draft",
  locale: "en",
  direction: "ltr",
  title: "Server state",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: []
};

const draft = {
  formId: "form_server_state",
  draftId: "draft_1",
  revisionId: "rev_draft",
  revisionHash: "sha256:draft",
  status: "draft",
  version: "v1"
} as const;

function wrapper(props: { children: ReactNode }): ReactNode {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
  return <QueryClientProvider client={client}>{props.children}</QueryClientProvider>;
}

describe("builder server-state hooks", () => {
  it("exposes product-owned load, save, publish, revision, and submit states", async () => {
    const adapter: FormPersistenceAdapter = {
      loadForm: vi.fn(() => adapterSuccess({ schema, draft })),
      saveDraft: vi.fn(() => adapterSuccess({ schema, draft: { ...draft, version: "v2" }, savedAt: "2026-05-15T00:00:00.000Z" })),
      publishRevision: vi.fn(() =>
        adapterSuccess({
          schema: { ...schema, status: "published" },
          published: {
            formId: "form_server_state",
            revisionId: "rev_1",
            revisionHash: "sha256:published",
            status: "published" as const,
            schemaVersion: "1.0.0",
            publishedAt: "2026-05-15T00:01:00.000Z",
            immutable: true as const
          }
        })
      ),
      listRevisions: vi.fn(() => adapterSuccess({ revisions: [draft] })),
      loadPublishedForm: vi.fn(() =>
        adapterSuccess({
          schema: { ...schema, status: "published" },
          published: {
            formId: "form_server_state",
            revisionId: "rev_1",
            revisionHash: "sha256:published",
            status: "published" as const,
            schemaVersion: "1.0.0",
            publishedAt: "2026-05-15T00:01:00.000Z",
            immutable: true as const
          }
        })
      ),
      submitForm: vi.fn(() =>
        adapterSuccess({
          response: {
            ok: true,
            status: "success",
            submissionId: "sub_1",
            errors: [],
            message: "Submitted."
          }
        })
      )
    };

    const { result } = renderHook(
      () => useBuilderServerState({ adapter, request: { formId: "form_server_state" } }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.draft?.draft.version).toBe("v1"));
    await expect(result.current.saveDraft({ formId: "form_server_state", schema, draft })).resolves.toMatchObject({
      ok: true,
      data: { draft: { version: "v2" } }
    });
    await expect(result.current.publishRevision({ formId: "form_server_state", schema, draft })).resolves.toMatchObject({
      ok: true,
      data: { published: { immutable: true } }
    });
    await expect(
      result.current.submitForm({
        formId: "form_server_state",
        envelope: {
          formId: "form_server_state",
          revisionId: "rev_1",
          revisionHash: "sha256:published",
          schemaVersion: "1.0.0",
          submissionAttemptId: "attempt_1",
          submittedAt: "2026-05-15T00:02:00.000Z",
          locale: "en",
          data: {},
          files: []
        }
      })
    ).resolves.toMatchObject({ ok: true, data: { response: { status: "success" } } });
  });

  it("maps stale save conflicts to product persistence state", async () => {
    const adapter: FormPersistenceAdapter = {
      loadForm: vi.fn(() => adapterSuccess({ schema, draft })),
      saveDraft: vi.fn(() => staleDraftConflict({ latestVersion: "v2" })),
      publishRevision: vi.fn(),
      listRevisions: vi.fn(() => adapterSuccess({ revisions: [draft] })),
      loadPublishedForm: vi.fn(),
      submitForm: vi.fn()
    };

    const { result } = renderHook(
      () => useBuilderServerState({ adapter, request: { formId: "form_server_state" } }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.draft).not.toBeNull());
    await result.current.saveDraft({ formId: "form_server_state", schema, draft });
    await waitFor(() => expect(result.current.persistenceState.status).toBe("conflicted"));
    expect(result.current.persistenceState.canReload).toBe(true);
  });
});
