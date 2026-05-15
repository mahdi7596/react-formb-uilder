// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  BuilderWorkspace,
  Button,
  EmptyState,
  TextInput,
  createBuilderStyles,
  type BuilderSchema
} from "./index.js";

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => null)
  });
});

const emptySchema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "phase_8_builder",
  revisionId: "rev_draft",
  revisionHash: "sha256:phase8",
  status: "draft",
  locale: "en",
  direction: "rtl",
  title: "Phase 8 builder",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: []
};

const populatedSchema: BuilderSchema = {
  ...emptySchema,
  nodes: [
    {
      id: "field_email",
      type: "field",
      fieldType: "email",
      name: "email",
      label: "Email",
      description: "We will use this for updates.",
      validation: [{ type: "required" }]
    },
    {
      id: "field_plan",
      type: "field",
      fieldType: "select",
      name: "plan",
      label: "Plan",
      options: [
        { id: "basic", label: "Basic", value: "basic" },
        { id: "pro", label: "Pro", value: "pro" }
      ]
    }
  ]
};

describe("builder UI primitives", () => {
  it("renders accessible controls, focus states, stable dimensions, and state surfaces", async () => {
    render(
      <main>
        <style>{createBuilderStyles()}</style>
        <Button type="button">Save draft with a long label</Button>
        <TextInput aria-label="Submitted path" dir="ltr" defaultValue="contact.email" />
        <EmptyState title="No fields" description="Add a field from the palette." />
      </main>
    );

    const button = screen.getByRole("button", { name: "Save draft with a long label" });
    button.focus();
    expect(button).toHaveFocus();
    expect(screen.getByLabelText("Submitted path")).toHaveAttribute("dir", "ltr");
    expect(screen.getByText("No fields")).toBeInTheDocument();
    expect(createBuilderStyles()).toContain("min-block-size:38px");

    const result = await axe(document.body);
    expect(result.violations).toEqual([]);
  });
});

describe("BuilderWorkspace shell", () => {
  it("renders an RTL command bar, palette, canvas, inspector, and empty state", () => {
    render(<BuilderWorkspace schema={emptySchema} />);

    expect(screen.getByRole("banner", { name: "Builder command bar" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Component palette" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Form canvas" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Inspector" })).toBeInTheDocument();
    expect(screen.getByText("Start with a component")).toBeInTheDocument();
    expect(screen.getByText("Nothing selected")).toBeInTheDocument();
    expect(document.querySelector(".rfb-builder")).toHaveAttribute("dir", "rtl");
  });

  it("supports preview toggle and restores edit canvas", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={populatedSchema} />);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByRole("region", { name: "Form preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toHaveAttribute("aria-pressed", "true");
    await user.type(screen.getByLabelText("Email"), "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByRole("button", { name: "Email" })).toBeInTheDocument();
  });
});

describe("builder palette and canvas", () => {
  it("filters palette items, recovers empty search, and click-add inserts through the store", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={emptySchema} />);

    await user.type(screen.getByLabelText("Search components"), "email");
    expect(screen.getByRole("button", { name: "Add Email" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Number" })).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText("Search components"));
    await user.type(screen.getByLabelText("Search components"), "zzzz");
    expect(screen.getByText("No components found")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    await user.click(screen.getByRole("button", { name: "Add Email" }));
    expect(screen.getByRole("button", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByText(/email input preview/i)).toBeInTheDocument();
    expect(screen.getByText("Email", { selector: "span.rfb-help" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();
  });

  it("selects nodes, edits inline labels, and runs quick actions with diagnostics", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={populatedSchema} />);

    await user.click(screen.getByRole("button", { name: "Email" }));
    await user.clear(screen.getByLabelText("Label"));
    await user.type(screen.getByLabelText("Label"), "Work email");
    expect(screen.getByRole("button", { name: "Work email" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Work email" }));
    const inline = screen.getByLabelText("Inline field label");
    await user.clear(inline);
    await user.type(inline, "Primary email");
    fireEvent.blur(inline);
    expect(screen.getByRole("button", { name: "Primary email" })).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Duplicate field" })[0] as HTMLElement);
    expect(screen.getAllByText(/email input preview/i)).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: "Delete field" })[0] as HTMLElement);
    expect(screen.getByText("Deleting a submittable field can break stored responses.")).toBeInTheDocument();
  });
});

describe("builder inspector", () => {
  it("edits content, validation, logic, accessibility, options, and data contract settings through commands", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={populatedSchema} />);

    await user.click(screen.getByRole("button", { name: "Plan" }));
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Choose the subscription plan.");
    expect(screen.getByDisplayValue("Choose the subscription plan.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Options"), {
      target: { value: "Starter=starter\nEnterprise=enterprise" }
    });
    const optionsValue = (screen.getByLabelText("Options") as HTMLTextAreaElement).value;
    expect(optionsValue).toContain("Starter=starter");
    expect(optionsValue).toContain("Enterprise=enterprise");
    expect(screen.getAllByText("Changing option values can break stored responses.").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: "Validation" }));
    const required = screen.getByLabelText("Required field");
    await user.click(required);
    expect(required).toBeChecked();

    await user.click(screen.getByRole("tab", { name: "Logic" }));
    fireEvent.change(screen.getByLabelText("Visibility condition JSON"), {
      target: { value: "{\"field\":\"email\",\"op\":\"notEmpty\"}" }
    });
    expect((screen.getByLabelText("Visibility condition JSON") as HTMLTextAreaElement).value).toContain("\"field\": \"email\"");

    await user.click(screen.getByRole("tab", { name: "Accessibility" }));
    await user.clear(screen.getByLabelText("Helper text"));
    await user.type(screen.getByLabelText("Helper text"), "Screen-reader friendly help.");
    expect(screen.getByDisplayValue("Screen-reader friendly help.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Data" }));
    fireEvent.change(screen.getByLabelText("Submitted path"), {
      target: { value: "__proto__.polluted" }
    });
    expect(screen.getAllByText("Submitted path is invalid or unsafe.").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Node id")).toHaveValue("field_plan");
  });
});

describe("builder responsive surface", () => {
  it("includes responsive CSS rules for tablet and mobile layouts", () => {
    const styles = createBuilderStyles();
    expect(styles).toContain("@media (max-width: 1024px)");
    expect(styles).toContain("@media (max-width: 720px)");
    expect(styles).toContain("inline-size:min(360px,88vw)");
  });
});
