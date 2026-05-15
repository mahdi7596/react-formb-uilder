import { describe, expect, it } from "vitest";

import {
  addNode,
  createEditorStore,
  deleteNode,
  duplicateNode,
  moveNode,
  updateCondition,
  updateFieldType,
  updateLabel,
  updateOptions,
  updateSettings,
  updateSubmittedName,
  updateValidation,
  type BuilderCommandDiagnostic,
  type BuilderSchema
} from "./index.js";

const baseSchema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "builder_phase_7",
  revisionId: "rev_001",
  revisionHash: "sha256:builder",
  status: "draft",
  locale: "en",
  direction: "ltr",
  title: "Builder command test",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    { id: "section_contact", type: "section", label: "Contact", children: ["field_name", "field_email"] },
    {
      id: "field_name",
      type: "field",
      fieldType: "text",
      name: "name",
      label: "Name",
      validation: [{ type: "required" }]
    },
    {
      id: "field_email",
      type: "field",
      fieldType: "email",
      name: "email",
      label: "Email",
      validation: [{ type: "required" }, { type: "email" }]
    },
    {
      id: "field_choice",
      type: "field",
      fieldType: "select",
      name: "choice",
      label: "Choice",
      options: [
        { id: "a", label: "A", value: "a" },
        { id: "b", label: "B", value: "b" }
      ]
    }
  ]
};

function diagnosticCodes(diagnostics: BuilderCommandDiagnostic[]): string[] {
  return diagnostics.map((diagnostic) => diagnostic.code);
}

describe("builder commands", () => {
  it("adds, moves, duplicates, and deletes nodes without mutating the input schema", () => {
    const added = addNode(baseSchema, {
      node: { id: "field_phone", type: "field", fieldType: "phone", name: "phone", label: "Phone" },
      parentId: "section_contact",
      position: 1
    });

    expect(added.changed).toBe(true);
    expect(added.schema).not.toBe(baseSchema);
    expect(baseSchema.nodes).toHaveLength(4);
    expect(added.schema.nodes.find((node) => node.id === "section_contact")?.children).toEqual([
      "field_name",
      "field_phone",
      "field_email"
    ]);

    const moved = moveNode(added.schema, { nodeId: "field_choice", parentId: "section_contact", position: 0 });
    expect(moved.schema.nodes.find((node) => node.id === "section_contact")?.children).toEqual([
      "field_choice",
      "field_name",
      "field_phone",
      "field_email"
    ]);

    const duplicated = duplicateNode(moved.schema, { nodeId: "field_email" });
    const emailCopies = duplicated.schema.nodes.filter((node) => node.id.startsWith("field_email"));
    expect(emailCopies).toHaveLength(2);
    expect(emailCopies[1]?.name).toBe("email_copy");

    const deleted = deleteNode(duplicated.schema, { nodeId: "section_contact" });
    expect(deleted.schema.nodes.some((node) => node.id === "section_contact")).toBe(false);
    expect(deleted.schema.nodes.some((node) => node.id === "field_email")).toBe(false);
    expect(diagnosticCodes(deleted.diagnostics)).toContain("dangerous_field_deleted");
  });

  it("updates fields and reports dangerous contract changes as warnings", () => {
    const renamed = updateSubmittedName(baseSchema, { nodeId: "field_email", name: "contact.email" });
    expect(renamed.schema.nodes.find((node) => node.id === "field_email")?.name).toBe("contact.email");
    expect(renamed.diagnostics).toMatchObject([
      { code: "dangerous_submitted_path_renamed", severity: "warning", nodeId: "field_email" }
    ]);

    const label = updateLabel(renamed.schema, { nodeId: "field_email", label: "Work email" });
    expect(label.schema.nodes.find((node) => node.id === "field_email")?.label).toBe("Work email");

    const validation = updateValidation(label.schema, { nodeId: "field_email", validation: [{ type: "email" }] });
    expect(diagnosticCodes(validation.diagnostics)).toContain("dangerous_requiredness_changed");

    const condition = updateCondition(validation.schema, {
      nodeId: "field_email",
      target: "visibility",
      condition: { field: "name", op: "notEmpty" }
    });
    expect(condition.schema.nodes.find((node) => node.id === "field_email")?.visibility).toEqual({
      field: "name",
      op: "notEmpty"
    });

    const options = updateOptions(condition.schema, {
      nodeId: "field_choice",
      options: [{ id: "a", label: "A+", value: "a_plus" }]
    });
    expect(diagnosticCodes(options.diagnostics)).toContain("dangerous_option_value_changed");

    const fieldType = updateFieldType(options.schema, { nodeId: "field_choice", fieldType: "checkbox" });
    expect(diagnosticCodes(fieldType.diagnostics)).toContain("dangerous_field_type_changed");

    const settings = updateSettings(fieldType.schema, {
      settings: { ...fieldType.schema.settings, preserveHiddenValues: true }
    });
    expect(settings.schema.settings?.preserveHiddenValues).toBe(true);
    expect(diagnosticCodes(settings.diagnostics)).toContain("dangerous_hidden_value_policy_changed");

    const arraySchema: BuilderSchema = {
      ...baseSchema,
      nodes: [
        ...baseSchema.nodes,
        { id: "field_items", type: "field", fieldType: "text", name: "items[].name", label: "Item" }
      ]
    };
    const scalarShape = updateSubmittedName(arraySchema, { nodeId: "field_items", name: "item.name" });
    expect(diagnosticCodes(scalarShape.diagnostics)).toContain("dangerous_shape_changed");
  });

  it("fails closed for unsafe command inputs and no-op commands", () => {
    const duplicate = addNode(baseSchema, {
      node: { id: "field_name", type: "field", fieldType: "text", name: "other", label: "Other" }
    });
    expect(duplicate.changed).toBe(false);
    expect(diagnosticCodes(duplicate.diagnostics)).toContain("duplicate_node_id");

    const unsafe = updateSubmittedName(baseSchema, { nodeId: "field_email", name: "__proto__.polluted" });
    expect(unsafe.changed).toBe(false);
    expect(diagnosticCodes(unsafe.diagnostics)).toContain("invalid_submitted_path");

    const missing = updateLabel(baseSchema, { nodeId: "missing", label: "Missing" });
    expect(missing.changed).toBe(false);
    expect(diagnosticCodes(missing.diagnostics)).toContain("missing_target_node");

    const noop = updateLabel(baseSchema, { nodeId: "field_email", label: "Email" });
    expect(noop.changed).toBe(false);
    expect(noop.diagnostics).toEqual([]);
  });
});

describe("builder editor store", () => {
  it("tracks UI state separately from schema state", () => {
    const store = createEditorStore({ schema: baseSchema });

    store.selectNode("field_email");
    store.setActivePanel("validation");
    store.setCanvasMode("preview");
    store.setDragState({ activeNodeId: "field_email", overNodeId: "section_contact", status: "dragging" });

    expect(store.getState().schema).toBe(baseSchema);
    expect(store.getState()).toMatchObject({
      selectedNodeId: "field_email",
      activePanel: "validation",
      canvasMode: "preview",
      dragState: { activeNodeId: "field_email", overNodeId: "section_contact", status: "dragging" }
    });
  });

  it("executes commands and supports bounded undo and redo history", () => {
    const store = createEditorStore({ schema: baseSchema, historyLimit: 2, clock: () => "2026-05-15T00:00:00.000Z" });

    const first = store.executeCommand("updateLabel", (schema) =>
      updateLabel(schema, { nodeId: "field_email", label: "Work email" })
    );
    expect(first.changed).toBe(true);
    expect(store.getState().canUndo).toBe(true);

    store.executeCommand("updateSubmittedName", (schema) =>
      updateSubmittedName(schema, { nodeId: "field_email", name: "contact.email" })
    );
    store.executeCommand("updateLabel", (schema) =>
      updateLabel(schema, { nodeId: "field_name", label: "Full name" })
    );

    expect(store.getState().history.undo).toHaveLength(2);
    expect(store.getState().schema.nodes.find((node) => node.id === "field_name")?.label).toBe("Full name");

    store.undo();
    expect(store.getState().schema.nodes.find((node) => node.id === "field_name")?.label).toBe("Name");
    expect(store.getState().canRedo).toBe(true);

    store.redo();
    expect(store.getState().schema.nodes.find((node) => node.id === "field_name")?.label).toBe("Full name");

    store.undo();
    store.executeCommand("updateLabel", (schema) =>
      updateLabel(schema, { nodeId: "field_choice", label: "Decision" })
    );
    expect(store.getState().canRedo).toBe(false);
  });

  it("does not record no-op commands in history", () => {
    const store = createEditorStore({ schema: baseSchema });

    const result = store.executeCommand("updateLabel", (schema) =>
      updateLabel(schema, { nodeId: "field_email", label: "Email" })
    );

    expect(result.changed).toBe(false);
    expect(store.getState().history.undo).toHaveLength(0);
  });
});
