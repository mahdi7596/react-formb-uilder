import { describe, expect, it } from "vitest";

import { compileJsonSchema } from "./index.js";
import type { JsonSchemaObject } from "./json-schema/index.js";

const baseSchema = {
  schemaVersion: "1.0.0",
  formId: "form_json_schema",
  revisionId: "rev_001",
  revisionHash: "sha256:jsonschema",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "JSON Schema",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: []
} as const;

function rootProperties(schema: JsonSchemaObject): Record<string, JsonSchemaObject> {
  expect(schema.properties).toBeDefined();
  return schema.properties ?? {};
}

describe("json schema compiler", () => {
  it("emits a Draft 2020-12 root submitted-data schema", () => {
    const result = compileJsonSchema({
      ...baseSchema,
      nodes: [{ id: "email", type: "field", fieldType: "email", name: "email" }]
    });

    expect(result.schema).toMatchObject({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      additionalProperties: false,
      properties: {
        email: { type: "string", format: "email" }
      }
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("maps MVP field types and validation rules", () => {
    const result = compileJsonSchema({
      ...baseSchema,
      nodes: [
        {
          id: "name",
          type: "field",
          fieldType: "text",
          name: "name",
          validation: [
            { type: "required" },
            { type: "minLength", params: { min: 2 } },
            { type: "maxLength", params: { max: 80 } },
            { type: "pattern", params: { pattern: "^[A-Za-z ]+$" } }
          ]
        },
        {
          id: "age",
          type: "field",
          fieldType: "number",
          name: "age",
          validation: [
            { type: "integer" },
            { type: "min", params: { min: 18 } },
            { type: "max", params: { max: 120 } },
            { type: "step", params: { step: 1 } }
          ]
        },
        { id: "accepted", type: "field", fieldType: "checkbox", name: "accepted" },
        {
          id: "reason",
          type: "field",
          fieldType: "select",
          name: "reason",
          options: [
            { id: "support", label: "Support", value: "support" },
            { id: "sales", label: "Sales", value: "sales" }
          ]
        },
        {
          id: "topics",
          type: "field",
          fieldType: "checkboxGroup",
          name: "topics",
          options: [
            { id: "a", label: "A", value: "a" },
            { id: "b", label: "B", value: "b" }
          ],
          validation: [{ type: "selectionCount", params: { min: 1, max: 2 } }]
        },
        { id: "attachment", type: "field", fieldType: "fileMetadata", name: "attachment" }
      ]
    });

    expect(result.schema.required).toEqual(["name"]);
    const properties = rootProperties(result.schema);

    expect(properties.name).toMatchObject({
      type: "string",
      minLength: 2,
      maxLength: 80,
      pattern: "^[A-Za-z ]+$"
    });
    expect(properties.age).toMatchObject({
      type: "integer",
      minimum: 18,
      maximum: 120,
      multipleOf: 1
    });
    expect(properties.accepted).toEqual({ type: "boolean" });
    expect(properties.reason).toMatchObject({ enum: ["support", "sales"] });
    expect(properties.topics).toMatchObject({
      type: "array",
      items: { enum: ["a", "b"] },
      minItems: 1,
      maxItems: 2
    });
    expect(properties.attachment).toMatchObject({
      type: "array",
      items: {
        type: "object",
        required: ["fileId"],
        additionalProperties: false
      }
    });
  });

  it("builds nested object properties from submitted paths", () => {
    const result = compileJsonSchema({
      ...baseSchema,
      nodes: [{ id: "email", type: "field", fieldType: "email", name: "user.email" }]
    });

    const properties = rootProperties(result.schema);

    expect(properties.user).toMatchObject({
      type: "object",
      additionalProperties: false,
      properties: {
        email: { type: "string", format: "email" }
      }
    });
    expect(properties["user.email"]).toBeUndefined();
  });

  it("returns diagnostics, validation plan, and condition dependencies for non-representable behavior", () => {
    const result = compileJsonSchema({
      ...baseSchema,
      nodes: [
        {
          id: "company",
          type: "field",
          fieldType: "text",
          name: "company",
          visibility: { field: "hasCompany", op: "eq", value: true },
          validation: [
            { type: "required", when: { field: "hasCompany", op: "eq", value: true } },
            { type: "custom:businessEmail", version: "1.0.0" },
            { type: "pattern", params: { pattern: "(?<=a)b" } }
          ]
        },
        { id: "unknown", type: "field", fieldType: "mystery", name: "mystery" },
        { id: "repeat", type: "repeater", children: [] }
      ]
    });

    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "condition_not_representable",
        "custom_validator_not_representable",
        "unsupported_regex",
        "unknown_field_type",
        "repeater_not_supported"
      ])
    );
    expect(result.diagnostics.every((item) => item.severity === "warning" || item.severity === "error")).toBe(
      true
    );
    expect(result.validationPlan).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "company", ruleType: "required" })])
    );
    expect(result.conditionDependencies).toEqual(
      expect.arrayContaining([expect.objectContaining({ nodeId: "company", dependsOn: ["hasCompany"] })])
    );
  });
});
