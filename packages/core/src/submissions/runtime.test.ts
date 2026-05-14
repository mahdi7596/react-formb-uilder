import { describe, expect, it } from "vitest";

import { createSubmissionEnvelope, normalizeSubmissionData, resolveDefaultValues } from "./index.js";

const schema = {
  schemaVersion: "1.0.0",
  formId: "form_submit",
  revisionId: "rev_001",
  revisionHash: "sha256:submit",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "Submit",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    { id: "field_email", type: "field", fieldType: "email", name: "email", defaultValue: "" },
    { id: "field_empty", type: "field", fieldType: "text", name: "emptyText" },
    { id: "field_accept", type: "field", fieldType: "checkbox", name: "accepted" },
    { id: "hidden_source", type: "hidden", fieldType: "hidden", name: "utm.source", defaultValue: "newsletter" }
  ]
} as const;

describe("submission runtime", () => {
  it("resolves defaults and normalizes final data", () => {
    expect(resolveDefaultValues(schema).value).toEqual({ email: "", "utm.source": "newsletter" });
    expect(
      normalizeSubmissionData({
        schema,
        values: { email: "person@example.com", emptyText: "", accepted: false, "utm.source": "newsletter" }
      }).value
    ).toEqual({ email: "person@example.com", accepted: false });
  });

  it("preserves hidden values when configured", () => {
    expect(
      normalizeSubmissionData({
        schema: { ...schema, settings: { ...schema.settings, preserveHiddenValues: true } },
        values: { "utm.source": "newsletter" }
      }).value
    ).toEqual({ utm: { source: "newsletter" } });
  });

  it("creates a normalized envelope and diagnoses invalid file metadata", () => {
    const result = createSubmissionEnvelope({
      schema,
      values: { email: "person@example.com" },
      files: [{ field: "attachment" }],
      locale: "en",
      submissionAttemptId: "attempt_001",
      submittedAt: "2026-05-14T00:00:00.000Z"
    });

    expect(result.value?.formId).toBe("form_submit");
    expect(result.value?.revisionHash).toBe("sha256:submit");
    expect(result.diagnostics.map((item) => item.code)).toContain("invalid_file_metadata");
  });
});
