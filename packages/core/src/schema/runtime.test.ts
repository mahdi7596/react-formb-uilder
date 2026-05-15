import { describe, expect, it } from "vitest";

import { analyzeSchema } from "./index.js";

const baseSchema = {
  schemaVersion: "1.0.0",
  formId: "form_runtime",
  revisionId: "rev_001",
  revisionHash: "sha256:runtime",
  status: "draft",
  locale: "en",
  direction: "ltr",
  title: "Runtime",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    { id: "field_email", type: "field", fieldType: "email", name: "email" },
    { id: "field_company", type: "field", fieldType: "text", name: "company.name" }
  ]
} as const;

describe("schema analysis runtime", () => {
  it("indexes nodes by id and submitted path", () => {
    const result = analyzeSchema(baseSchema);

    expect(result.diagnostics).toEqual([]);
    expect(result.nodesById.get("field_email")?.id).toBe("field_email");
    expect(result.fieldsByPath.get("company.name")?.id).toBe("field_company");
  });

  it("diagnoses duplicate ids, duplicate paths, unknown types, and unsupported scope", () => {
    const result = analyzeSchema({
      ...baseSchema,
      nodes: [
        { id: "dup", type: "field", fieldType: "email", name: "email" },
        { id: "dup", type: "field", fieldType: "mystery", name: "email" },
        { id: "repeat", type: "repeater", children: [] },
        { id: "upload", type: "field", fieldType: "fileUpload", name: "attachment" }
      ]
    });

    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "duplicate_node_id",
        "duplicate_submitted_path",
        "unknown_field_type",
        "repeater_not_supported",
        "upload_lifecycle_not_supported"
      ])
    );
  });

  it("diagnoses invalid conditions and condition cycles", () => {
    const result = analyzeSchema({
      ...baseSchema,
      nodes: [
        {
          id: "field_a",
          type: "field",
          fieldType: "text",
          name: "a",
          visibility: { field: "b", op: "notEmpty" }
        },
        {
          id: "field_b",
          type: "field",
          fieldType: "text",
          name: "b",
          visibility: { field: "a", op: "notEmpty" }
        },
        {
          id: "field_c",
          type: "field",
          fieldType: "text",
          name: "c",
          visibility: { field: "missing", op: "eq", value: true }
        }
      ]
    });

    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining(["condition_cycle", "invalid_condition"])
    );
  });

  it("accepts supported content and layout nodes without submitted paths", () => {
    const result = analyzeSchema({
      ...baseSchema,
      nodes: [
        { id: "welcome", type: "content", contentType: "welcome", label: "Welcome", description: "Start here." },
        { id: "heading", type: "content", contentType: "heading", label: "Contact details" },
        { id: "paragraph", type: "content", contentType: "paragraph", props: { text: "Tell us about your request." } },
        { id: "image", type: "content", contentType: "image", props: { src: "https://example.test/banner.png", alt: "Office banner" } },
        { id: "divider", type: "content", contentType: "divider" },
        { id: "spacer", type: "content", contentType: "spacer", props: { size: "medium" } },
        { id: "section", type: "section", label: "Section", children: ["field_email"] },
        { id: "step", type: "step", label: "Step", children: ["field_company"] },
        { id: "thanks", type: "ending", label: "Thank you", description: "We received your request." },
        ...baseSchema.nodes
      ]
    });

    expect(result.diagnostics).toEqual([]);
    expect(Array.from(result.fieldsByPath.keys())).toEqual(["email", "company.name"]);
  });

  it("diagnoses missing accessible content on image, heading, welcome, and ending nodes", () => {
    const result = analyzeSchema({
      ...baseSchema,
      nodes: [
        { id: "image", type: "content", contentType: "image", props: { src: "https://example.test/banner.png" } },
        { id: "heading", type: "content", contentType: "heading" },
        { id: "welcome", type: "content", contentType: "welcome", props: { text: " " } },
        { id: "ending", type: "ending" }
      ]
    });

    expect(result.diagnostics.map((item) => `${item.code}:${item.path}`)).toEqual([
      "missing_accessible_content:image",
      "missing_accessible_content:heading",
      "missing_accessible_content:welcome",
      "missing_accessible_content:ending"
    ]);
  });
});
