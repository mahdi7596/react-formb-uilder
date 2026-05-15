// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { createBuilderArtifactBundle } from "@your-org/forms-validators";

import {
  BuilderWorkspace,
  Button,
  EmptyState,
  TextInput,
  createBuilderStyles,
  createPersistenceState,
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
    const builderStyles = createBuilderStyles();
    expect(builderStyles).toContain("--rfb-color-primary:#315CFF;");
    expect(builderStyles).toContain("--fb-primary:var(--rfb-color-primary);");
    expect(builderStyles).toContain("min-block-size:38px");
    expect(builderStyles).toContain(":focus-visible");
    expect(builderStyles).toContain("prefers-reduced-motion: reduce");

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

  it("uses Persian builder strings in RTL mode while technical values remain LTR", () => {
    render(<BuilderWorkspace schema={{ ...populatedSchema, locale: "fa-IR", direction: "rtl" }} />);

    expect(screen.getByText("اجزای فرم")).toBeInTheDocument();
    expect(screen.getByLabelText("جستجوی اجزا")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ذخیره پیش‌نویس" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "انتشار" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "اعتبارسنجی" })).toBeInTheDocument();
    expect(document.querySelector(".rfb-builder")).toHaveAttribute("dir", "rtl");
    expect(screen.getByText("email")).toHaveAttribute("dir", "ltr");
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

  it("renders persistence, publish, revision, and generated artifact workflow states", async () => {
    const user = userEvent.setup();
    const onSaveDraft = vi.fn();
    const onPublish = vi.fn();
    const onReloadLatest = vi.fn();
    const artifactBundle = createBuilderArtifactBundle(populatedSchema, {
      generatedAt: "2026-05-15T00:00:00.000Z"
    });

    render(
      <BuilderWorkspace
        schema={populatedSchema}
        persistenceState={createPersistenceState("conflicted", { message: "Host has a newer draft." })}
        artifactBundle={artifactBundle}
        latestPublishedRevision={{
          formId: "phase_8_builder",
          revisionId: "rev_published",
          revisionHash: "sha256:published",
          status: "published",
          schemaVersion: "1.0.0",
          publishedAt: "2026-05-15T00:00:00.000Z",
          immutable: true
        }}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
        onReloadLatest={onReloadLatest}
      />
    );

    expect(screen.getByRole("region", { name: "Persistence and publish workflow" })).toBeInTheDocument();
    expect(screen.getByText("Draft conflicted")).toBeInTheDocument();
    expect(screen.getByText("Host has a newer draft.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Publish checklist" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Revision warnings" })).toBeInTheDocument();
    expect(screen.getByText("Generated artifacts")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save draft" }));
    await user.click(screen.getByRole("button", { name: "Publish" }));
    await user.click(screen.getByRole("button", { name: "Reload latest" }));

    expect(onSaveDraft).toHaveBeenCalledTimes(1);
    expect(onSaveDraft).toHaveBeenCalledWith(populatedSchema);
    expect(onPublish).toHaveBeenCalledTimes(1);
    expect(onPublish).toHaveBeenCalledWith(populatedSchema);
    expect(onReloadLatest).toHaveBeenCalledTimes(1);
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
    expect(screen.getByRole("button", { name: "Add URL" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Checkbox group" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Switch" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Time" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Rating" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Linear scale" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Hidden field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Read-only value" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add File metadata" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search components"), "zzzz");
    expect(screen.getByText("No components found")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    await user.click(screen.getByRole("button", { name: "Add Email" }));
    expect(screen.getByRole("button", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByText(/email input preview/i)).toBeInTheDocument();
    expect(screen.getByText("Email", { selector: "span.rfb-help" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();
    expect(screen.getByText("Email inserted.")).toBeInTheDocument();
  });

  it("renders drag handles, drop zones, and command-backed keyboard movement feedback", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={populatedSchema} />);

    expect(screen.getAllByRole("button", { name: "Drag Email" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("article", { name: "Field Email" })).toBeInTheDocument();
    expect(screen.getByLabelText("Drop after Plan")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Move field up" })[0] as HTMLElement);
    expect(screen.getByText("Email cannot move up.")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Move field down" })[0] as HTMLElement);
    expect(screen.getByText("Email moved down.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByText("Undo complete.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Redo" }));
    expect(screen.getByText("Redo complete.")).toBeInTheDocument();
  });

  it("selects nodes, edits inline labels, and runs quick actions with diagnostics", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={populatedSchema} />);

    await user.click(screen.getByRole("button", { name: "Email" }));
    await user.clear(screen.getByLabelText("Label"));
    await user.type(screen.getByLabelText("Label"), "Work email");
    expect(screen.getByRole("button", { name: "Work email" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Work email" }));
    const inline = screen.getByLabelText("Inline node label");
    await user.clear(inline);
    await user.type(inline, "Primary email");
    fireEvent.blur(inline);
    expect(screen.getByRole("button", { name: "Primary email" })).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Duplicate field" })[0] as HTMLElement);
    expect(screen.getAllByText(/email input preview/i)).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: "Delete field" })[0] as HTMLElement);
    expect(screen.getAllByText("Deleting a submittable field can break stored responses.").length).toBeGreaterThan(0);
  });

  it("adds and edits content, layout, and ending blocks as real canvas nodes", async () => {
    const user = userEvent.setup();
    render(<BuilderWorkspace schema={emptySchema} />);

    expect(screen.getByRole("button", { name: "Add Heading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Paragraph" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Image" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Divider" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Spacer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Welcome screen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Section" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Page / step" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Ending screen" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add Heading" }));
    expect(screen.getByRole("article", { name: "Content block Heading" })).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Label"));
    await user.type(screen.getByLabelText("Label"), "Personal information");
    await user.selectOptions(screen.getByLabelText("Heading level"), "2");
    expect(screen.getByRole("button", { name: "Personal information" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add Paragraph" }));
    await user.clear(screen.getByLabelText("Body text"));
    await user.type(screen.getByLabelText("Body text"), "Use accurate details.");
    expect(screen.getByDisplayValue("Use accurate details.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add Image" }));
    await user.type(screen.getByLabelText("Image URL"), "https://example.test/banner.png");
    await user.type(screen.getByLabelText("Alt text"), "Team banner");
    await user.type(screen.getByLabelText("Caption"), "Our team");
    expect(screen.getByDisplayValue("Team banner")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Data" }));
    expect(screen.getByText("This block does not create submitted data.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Submitted path")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Add Ending screen" }));
    expect(screen.getByRole("article", { name: "Ending Thank you" })).toBeInTheDocument();
    expect(screen.getByText("Thank-you ending screen")).toBeInTheDocument();
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

    await user.clear(screen.getByLabelText("Option 1 label"));
    await user.type(screen.getByLabelText("Option 1 label"), "Starter");
    await user.clear(screen.getByLabelText("Option 1 submitted value"));
    await user.type(screen.getByLabelText("Option 1 submitted value"), "starter");
    expect(screen.getAllByText("Changing option values can break stored responses.").length).toBeGreaterThan(0);

    await user.click(screen.getAllByLabelText("Default", { selector: "input" })[0] as HTMLElement);
    await user.click(screen.getAllByLabelText("Disabled", { selector: "input" })[0] as HTMLElement);
    await user.click(screen.getByRole("button", { name: "Duplicate option 1" }));
    expect(screen.getByDisplayValue("Starter copy")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Move option 2 up" }));
    await user.click(screen.getByRole("button", { name: "Delete option 2" }));
    await user.type(screen.getByLabelText("Bulk add options"), "Team=team\nEnterprise=enterprise");
    await user.click(screen.getByRole("button", { name: "Add pasted options" }));
    expect(screen.getByDisplayValue("Team")).toBeInTheDocument();
    expect(screen.getByDisplayValue("enterprise")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Validation" }));
    const required = screen.getByLabelText("Required field");
    await user.click(required);
    expect(required).toBeChecked();

    await user.click(screen.getByRole("tab", { name: "Logic" }));
    await user.selectOptions(screen.getByLabelText("Visibility behavior"), "showWhen");
    await user.selectOptions(screen.getAllByLabelText("Operator")[0] as HTMLElement, "notEmpty");
    expect(screen.getByLabelText("Read-only condition JSON").textContent).toContain("\"field\": \"email\"");
    expect(screen.getByLabelText("Read-only condition JSON").textContent).toContain("\"op\": \"notEmpty\"");

    await user.click(screen.getByLabelText("Require only when conditions match"));
    expect(screen.getByLabelText("Read-only condition JSON").textContent).toContain("\"requiredWhen\"");

    await user.click(screen.getByRole("tab", { name: "Accessibility" }));
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Screen-reader friendly help.");
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
    expect(styles).toContain(".rfb-workflow-card[data-can-publish=\"false\"]");
    expect(styles).toContain(".rfb-node[data-drop-active=\"true\"]");
    expect(styles).toContain(".rfb-drop-feedback[data-status=\"invalid\"]");
  });
});
