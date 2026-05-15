import { describe, expect, it } from "vitest";

import { adapterFailure } from "@your-org/forms-adapters";
import { createBuilderArtifactBundle } from "@your-org/forms-validators";

import {
  buildPublishChecklist,
  compareDraftToPublished,
  createPersistenceState,
  type BuilderSchema
} from "./index.js";

const schema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "form_publish",
  revisionId: "rev_draft",
  revisionHash: "sha256:draft",
  status: "draft",
  locale: "en",
  direction: "ltr",
  title: "Publish form",
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
      label: "Email",
      validation: [{ type: "required" }]
    }
  ]
};

describe("builder persistence and publish model", () => {
  it("creates product-owned persistence states", () => {
    expect(createPersistenceState("saving")).toMatchObject({
      status: "saving",
      canRetry: false,
      canReload: false,
      diagnostics: []
    });
    expect(createPersistenceState("conflicted", { message: "Stale draft" })).toMatchObject({
      status: "conflicted",
      message: "Stale draft",
      canReload: true
    });
  });

  it("allows publishing when schema and artifacts have no blocking diagnostics", () => {
    const artifactBundle = createBuilderArtifactBundle(schema, { generatedAt: "deterministic" });
    const checklist = buildPublishChecklist({ schema, artifactBundle });

    expect(checklist.canPublish).toBe(true);
    expect(checklist.blocking).toEqual([]);
  });

  it("blocks publishing on metadata, compiler, schema, and adapter errors", () => {
    const unsafeSchema: BuilderSchema = {
      ...schema,
      title: "",
      nodes: [
        {
          id: "unsafe",
          type: "field",
          fieldType: "mystery",
          name: "constructor"
        }
      ]
    };
    const artifactBundle = createBuilderArtifactBundle(unsafeSchema, { generatedAt: "deterministic" });
    const checklist = buildPublishChecklist({
      schema: unsafeSchema,
      artifactBundle,
      adapterResult: adapterFailure("conflict", { message: "Stale publish" })
    });

    expect(checklist.canPublish).toBe(false);
    expect(checklist.blocking.map((item) => item.code)).toEqual(
      expect.arrayContaining(["missing_required_metadata", "dangerous_key", "unknown_field_type", "conflict"])
    );
  });

  it("surfaces dangerous command diagnostics as warnings", () => {
    const checklist = buildPublishChecklist({
      schema,
      commandDiagnostics: [
        {
          code: "dangerous_submitted_path_renamed",
          severity: "warning",
          message: "Changing a submitted path can break stored responses.",
          nodeId: "email"
        }
      ]
    });

    expect(checklist.canPublish).toBe(true);
    expect(checklist.warnings).toEqual([
      expect.objectContaining({
        source: "builder",
        code: "dangerous_submitted_path_renamed",
        nodeId: "email"
      })
    ]);
  });

  it("compares draft metadata against latest published revision", () => {
    expect(
      compareDraftToPublished(schema, {
        formId: "form_publish",
        revisionId: "rev_published",
        revisionHash: "sha256:published",
        status: "published",
        schemaVersion: "1.0.0",
        publishedAt: "2026-05-15T00:00:00.000Z",
        immutable: true
      })
    ).toMatchObject({
      latestPublished: { revisionId: "rev_published", immutable: true },
      currentRevisionHash: "sha256:draft",
      warnings: [expect.objectContaining({ code: "revision_hash_changed" })]
    });
  });
});
