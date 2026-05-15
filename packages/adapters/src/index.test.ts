import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  adapterFailure,
  adapterSuccess,
  dangerousKeyDiagnostics,
  immutablePublishedRevisionConflict,
  normalizeAdapterData,
  packageBoundary,
  staleDraftConflict,
  type FormPersistenceAdapter,
  type CanonicalFormSchema,
  type LoadFormData,
  type PublishedRevisionMetadata
} from "./index.js";

const schema: CanonicalFormSchema = {
  schemaVersion: "1.0.0",
  formId: "form_adapter",
  revisionId: "rev_draft",
  revisionHash: "sha256:draft",
  status: "draft",
  locale: "en",
  direction: "ltr",
  title: "Adapter form",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    {
      id: "email",
      type: "field",
      fieldType: "email",
      name: "email",
      label: "Email"
    }
  ]
};

const draft = {
  formId: "form_adapter",
  draftId: "draft_1",
  revisionId: "rev_draft",
  revisionHash: "sha256:draft",
  status: "draft",
  version: "v1",
  updatedAt: "2026-05-15T00:00:00.000Z"
} as const;

const published: PublishedRevisionMetadata = {
  formId: "form_adapter",
  revisionId: "rev_1",
  revisionHash: "sha256:published",
  status: "published",
  schemaVersion: "1.0.0",
  publishedAt: "2026-05-15T00:01:00.000Z",
  title: "Adapter form",
  locale: "en",
  immutable: true
};

describe("@your-org/forms-adapters contracts", () => {
  it("documents the package boundary", () => {
    expect(packageBoundary).toEqual({
      name: "@your-org/forms-adapters",
      responsibility: "thin host integration helpers for agreed JSON contracts",
      phase: "persistence-publish-adapters"
    });
  });

  it("normalizes successful load, save, publish, list, published load, and submit results", async () => {
    const adapter: FormPersistenceAdapter = {
      loadForm: () => adapterSuccess<LoadFormData>({ schema, draft }),
      saveDraft: () => adapterSuccess({ schema, draft, savedAt: "2026-05-15T00:02:00.000Z" }),
      publishRevision: () => adapterSuccess({ schema: { ...schema, status: "published" }, published }),
      listRevisions: () => adapterSuccess({ revisions: [draft, published], latestPublished: published }),
      loadPublishedForm: () => adapterSuccess({ schema: { ...schema, status: "published" }, published }),
      submitForm: () =>
        adapterSuccess({
          response: {
            ok: true,
            status: "success",
            submissionId: "sub_1",
            errors: [],
            message: "Submitted."
          }
        })
    };

    await expect(Promise.resolve(adapter.loadForm({ formId: "form_adapter" }))).resolves.toMatchObject({
      ok: true,
      data: { draft: { version: "v1" } }
    });
    await expect(Promise.resolve(adapter.saveDraft({ formId: "form_adapter", schema, draft }))).resolves.toMatchObject({
      ok: true,
      data: { savedAt: "2026-05-15T00:02:00.000Z" }
    });
    await expect(Promise.resolve(adapter.publishRevision({ formId: "form_adapter", schema, draft }))).resolves.toMatchObject({
      ok: true,
      data: { published: { immutable: true, revisionId: "rev_1" } }
    });
    await expect(Promise.resolve(adapter.listRevisions({ formId: "form_adapter" }))).resolves.toMatchObject({
      ok: true,
      data: { revisions: expect.arrayContaining([expect.objectContaining({ revisionId: "rev_1" })]) }
    });
    await expect(Promise.resolve(adapter.loadPublishedForm({ formId: "form_adapter" }))).resolves.toMatchObject({
      ok: true,
      data: { published: { revisionHash: "sha256:published" } }
    });
    await expect(
      Promise.resolve(
        adapter.submitForm({
          formId: "form_adapter",
          envelope: {
            formId: "form_adapter",
            revisionId: "rev_1",
            revisionHash: "sha256:published",
            schemaVersion: "1.0.0",
            submissionAttemptId: "attempt_1",
            submittedAt: "2026-05-15T00:03:00.000Z",
            locale: "en",
            data: { email: "person@example.com" },
            files: [],
            meta: {}
          }
        })
      )
    ).resolves.toMatchObject({
      ok: true,
      data: { response: { status: "success" } }
    });
  });

  it("represents stale draft and immutable publish conflicts", () => {
    expect(staleDraftConflict({ latestVersion: "v2", latestRevisionHash: "sha256:new" })).toMatchObject({
      ok: false,
      status: "conflict",
      conflict: {
        reason: "stale_draft",
        latestVersion: "v2",
        latestRevisionHash: "sha256:new",
        canReload: true,
        canRetry: false
      }
    });

    expect(immutablePublishedRevisionConflict({ latestRevisionId: "rev_1" })).toMatchObject({
      ok: false,
      status: "conflict",
      conflict: {
        reason: "published_revision_immutable",
        latestRevisionId: "rev_1",
        canReload: true,
        canRetry: false
      }
    });
  });

  it("normalizes failure statuses without throwing transport-specific errors", () => {
    expect(adapterFailure("network_error", { message: "Offline" })).toMatchObject({
      ok: false,
      status: "network_error",
      message: "Offline",
      diagnostics: []
    });
    expect(adapterFailure("malformed_response")).toMatchObject({
      ok: false,
      status: "malformed_response"
    });
  });

  it("rejects dangerous keys in adapter data", () => {
    const diagnostics = dangerousKeyDiagnostics({ safe: true, constructor: { prototype: "nope" } });
    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(["dangerous_key", "dangerous_key"]);
    expect(diagnostics.every((diagnostic) => diagnostic.source === "adapter")).toBe(true);

    expect(normalizeAdapterData(JSON.parse('{"__proto__":"unsafe"}'))).toMatchObject({
      ok: false,
      status: "dangerous_key",
      diagnostics: [expect.objectContaining({ code: "dangerous_key" })]
    });
  });

  it("keeps core free of adapter, React, TanStack Query, and transport dependencies", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const packageJson = JSON.parse(readFileSync(resolve(here, "../../core/package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {}),
      ...Object.keys(packageJson.peerDependencies ?? {})
    ];

    expect(dependencyNames).not.toEqual(expect.arrayContaining([
      "@your-org/forms-adapters",
      "react",
      "react-dom",
      "@tanstack/react-query",
      "axios",
      "graphql"
    ]));
  });
});
