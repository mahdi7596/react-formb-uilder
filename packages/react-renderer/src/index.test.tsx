/**
 * @vitest-environment jsdom
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { Ref } from "react";
import type { BackendResponse, SubmissionEnvelope, ValidationErrorContract } from "@your-org/forms-core";
import { adapterFailure, adapterSuccess } from "@your-org/forms-adapters";

import {
  FormRenderer,
  createDefaultFieldRegistry,
  createRendererStyles,
  type FieldRenderer
} from "./index.js";
import * as publicExports from "./index.js";

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => null)
  });
});

afterEach(() => {
  cleanup();
});

const baseSchema = {
  schemaVersion: "1.0.0",
  formId: "contact",
  revisionId: "rev_001",
  revisionHash: "sha256_renderer",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "Contact form",
  description: "Tell us how to reach you.",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  }
};

function successResponse(submissionId: string): BackendResponse {
  return {
    ok: true,
    status: "success",
    submissionId,
    errors: []
  };
}

describe("FormRenderer", () => {
  it("renders built-in fields with accessible labels, descriptions, states, and styling hooks", async () => {
    const schema = {
      ...baseSchema,
      nodes: [
        {
          id: "name",
          type: "field",
          fieldType: "text",
          name: "name",
          label: "Full name",
          description: "Use your legal name.",
          validation: [{ type: "required" }]
        },
        { id: "bio", type: "field", fieldType: "textarea", name: "bio", label: "Bio" },
        { id: "age", type: "field", fieldType: "number", name: "age", label: "Age" },
        { id: "email", type: "field", fieldType: "email", name: "email", label: "Email" },
        { id: "phone", type: "field", fieldType: "phone", name: "phone", label: "Phone" },
        { id: "website", type: "field", fieldType: "url", name: "website", label: "Website" },
        {
          id: "promo",
          type: "field",
          fieldType: "text",
          name: "promo",
          label: "Promo code",
          enabledWhen: { field: "accepted", op: "eq", value: true }
        },
        { id: "date", type: "field", fieldType: "date", name: "date", label: "Preferred date" },
        {
          id: "reason",
          type: "field",
          fieldType: "select",
          name: "reason",
          label: "Reason",
          options: [
            { id: "support", label: "Support", value: "support" },
            { id: "disabled", label: "Disabled", value: "disabled", disabled: true }
          ]
        },
        {
          id: "contact_method",
          type: "field",
          fieldType: "radio",
          name: "contactMethod",
          label: "Contact method",
          options: [
            { id: "email", label: "Email", value: "email" },
            { id: "phone", label: "Phone", value: "phone" }
          ]
        },
        { id: "accepted", type: "field", fieldType: "checkbox", name: "accepted", label: "I agree" },
        {
          id: "features",
          type: "field",
          fieldType: "checkboxGroup",
          name: "features",
          label: "Features",
          options: [
            { id: "forms", label: "Forms", value: "forms" },
            { id: "reports", label: "Reports", value: "reports" }
          ]
        },
        { id: "enabled", type: "field", fieldType: "switch", name: "enabled", label: "Enabled" },
        { id: "time", type: "field", fieldType: "time", name: "time", label: "Preferred time" },
        { id: "rating", type: "field", fieldType: "rating", name: "rating", label: "Rating" },
        { id: "scale", type: "field", fieldType: "linearScale", name: "scale", label: "Scale" },
        { id: "readonly", type: "field", fieldType: "text", name: "readonly", label: "Read only", readOnly: true, defaultValue: "Fixed" },
        { id: "token", type: "hidden", name: "token", defaultValue: "secret" },
        { id: "resume", type: "field", fieldType: "fileMetadata", name: "resume", label: "Resume metadata" }
      ]
    };

    const { container } = render(<FormRenderer schema={schema} />);

    expect(screen.getByRole("heading", { name: "Contact form" })).toBeTruthy();
    expect(screen.getByText("Tell us how to reach you.")).toBeTruthy();
    const name = screen.getByLabelText("Full name");
    expect(name).toHaveAttribute("aria-describedby", expect.stringContaining("description"));
    expect(name).toBeRequired();
    expect(screen.getByText("Use your legal name.")).toBeTruthy();
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
    expect(screen.getByLabelText("Age")).toHaveAttribute("type", "number");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("type", "email");
    expect(screen.getByRole("textbox", { name: "Phone" })).toHaveAttribute("type", "tel");
    expect(screen.getByRole("textbox", { name: "Website" })).toHaveAttribute("type", "url");
    expect(screen.getByLabelText("Promo code")).toBeDisabled();
    expect(screen.getByLabelText("Preferred date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Preferred time")).toHaveAttribute("type", "time");
    expect(screen.getByLabelText("Reason")).toHaveAttribute("data-rfb-field-type", "select");
    expect(screen.queryByRole("option", { name: "Disabled" })).toBeNull();
    expect(screen.getByRole("radiogroup", { name: "Contact method" })).toBeTruthy();
    expect(screen.getByLabelText("I agree")).toHaveAttribute("type", "checkbox");
    expect(screen.getByRole("group", { name: "Features" })).toBeTruthy();
    expect(screen.getByLabelText("Enabled")).toHaveAttribute("role", "switch");
    expect(screen.getByLabelText("Rating")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Scale")).toHaveAttribute("type", "range");
    expect(screen.getByLabelText("Read only")).toHaveAttribute("readonly");
    expect(container.querySelector(".rfb-field [name='token']")).toBeNull();
    expect(container.querySelector("input[type='hidden'][name='token']")).toBeTruthy();
    expect(screen.getByLabelText("Resume metadata")).toBeTruthy();
    expect(container.querySelector(".rfb-form")).toBeTruthy();
    expect(container.querySelector("[data-rfb-field-type='text']")).toBeTruthy();
    const rendererStyles = createRendererStyles();
    expect(rendererStyles).toContain("--rfb-color-primary:#315CFF;");
    expect(rendererStyles).toContain("--rfb-field-gap");
    expect(rendererStyles).toContain(".rfb-field[data-rfb-invalid=\"true\"]");
    expect(rendererStyles).toContain(".rfb-navigation");
    expect(rendererStyles).toContain(":focus-visible");
    expect(rendererStyles).toContain("prefers-reduced-motion: reduce");
    expect((await axe(container)).violations).toHaveLength(0);
  });

  it("uses core-backed visibility, validation, submission normalization, and envelopes", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async (_envelope: SubmissionEnvelope): Promise<BackendResponse> => successResponse("sub_1"));
    const schema = {
      ...baseSchema,
      nodes: [
        { id: "has_company", type: "field", fieldType: "checkbox", name: "hasCompany", label: "Has company" },
        {
          id: "company",
          type: "field",
          fieldType: "text",
          name: "company",
          label: "Company",
          visibility: { field: "hasCompany", op: "eq", value: true },
          validation: [{ type: "required" }]
        }
      ]
    };

    render(
      <FormRenderer
        schema={schema}
        attemptIdFactory={() => "attempt_1"}
        clock={() => "2026-05-14T10:00:00.000Z"}
        onSubmit={onSubmit}
      />
    );

    expect(screen.queryByLabelText("Company")).toBeNull();
    await user.click(screen.getByLabelText("Has company"));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByLabelText("Company")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Company")).toHaveFocus();
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const envelope = onSubmit.mock.calls[0]?.[0];
    expect(envelope).toMatchObject({
      formId: "contact",
      revisionId: "rev_001",
      revisionHash: "sha256_renderer",
      submissionAttemptId: "attempt_1",
      submittedAt: "2026-05-14T10:00:00.000Z",
      data: { hasCompany: true, company: "Acme" }
    });
    expect(screen.getByText("Submission received.")).toBeTruthy();
  });

  it("renders sections and validates the current step before advancing", async () => {
    const user = userEvent.setup();
    const schema = {
      ...baseSchema,
      settings: { ...baseSchema.settings, navigation: "steps" },
      nodes: [
        { id: "step_contact", type: "step", label: "Contact", children: ["email"] },
        {
          id: "step_hidden",
          type: "step",
          label: "Hidden extra",
          children: ["extra"],
          visibility: { field: "email", op: "eq", value: "show-extra@example.com" }
        },
        { id: "step_details", type: "step", label: "Details", children: ["details_section"] },
        { id: "email", type: "field", fieldType: "email", name: "email", label: "Email", validation: [{ type: "required" }] },
        { id: "extra", type: "field", fieldType: "text", name: "extra", label: "Extra" },
        { id: "details_section", type: "section", label: "Details section", children: ["age"] },
        { id: "age", type: "field", fieldType: "number", name: "age", label: "Age" }
      ]
    };

    render(<FormRenderer schema={schema} />);

    expect(screen.getByRole("heading", { name: "Contact" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("required")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toHaveFocus();
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByRole("heading", { name: "Hidden extra" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Details" })).toBeTruthy();
    expect(screen.getByText("Details section")).toBeTruthy();
    expect(screen.getByLabelText("Age")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous" })).toBeTruthy();
  });

  it("renders content, layout, welcome, and ending nodes without submitted values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async (_envelope: SubmissionEnvelope): Promise<BackendResponse> => successResponse("sub_content"));
    const schema = {
      ...baseSchema,
      nodes: [
        { id: "welcome", type: "content", contentType: "welcome", label: "Welcome", description: "Before you start." },
        { id: "heading", type: "content", contentType: "heading", label: "Profile", props: { level: 3 } },
        { id: "paragraph", type: "content", contentType: "paragraph", props: { text: "Tell us who should receive updates." } },
        { id: "image", type: "content", contentType: "image", props: { src: "https://example.test/banner.png", alt: "Team banner", caption: "Our team" } },
        { id: "divider", type: "content", contentType: "divider" },
        { id: "spacer", type: "content", contentType: "spacer", props: { size: "large" } },
        { id: "name", type: "field", fieldType: "text", name: "name", label: "Name" },
        { id: "ending", type: "ending", label: "Thanks", description: "Your response is in." }
      ]
    };

    const { container } = render(<FormRenderer schema={schema} onSubmit={onSubmit} />);

    expect(screen.getByRole("heading", { name: "Welcome" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Profile", level: 3 })).toBeTruthy();
    expect(screen.getByText("Tell us who should receive updates.")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Team banner" })).toHaveAttribute("src", "https://example.test/banner.png");
    expect(screen.getByText("Our team")).toBeTruthy();
    expect(container.querySelector(".rfb-content-divider")).toBeTruthy();
    expect(container.querySelector(".rfb-content-spacer")).toHaveAttribute("data-rfb-spacer-size", "large");

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0]?.data).toEqual({ name: "Jane" });
    expect(screen.getByRole("heading", { name: "Thanks" })).toBeTruthy();
    expect(screen.getByText("Your response is in.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Submit" })).toBeNull();
  });

  it("maps normalized backend errors to fields and global messages", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async (_envelope: SubmissionEnvelope): Promise<BackendResponse> => ({
      ok: false,
      status: "validation_error",
      submissionId: null,
      message: "Please fix the highlighted fields.",
      errors: [
        { path: "email", code: "invalid_email", message: "Use a work email.", source: "server" },
        { path: null, code: "global", message: "Submission blocked.", source: "server" }
      ] as ValidationErrorContract[]
    }));
    const schema = {
      ...baseSchema,
      nodes: [{ id: "email", type: "field", fieldType: "email", name: "email", label: "Email" }]
    };

    render(<FormRenderer schema={schema} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Use a work email.")).toBeTruthy();
    expect(screen.getByText("Submission blocked.")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("uses Persian runtime strings and RTL direction by locale", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FormRenderer
        schema={{
          ...baseSchema,
          locale: "fa-IR",
          direction: "rtl",
          title: "فرم تماس",
          nodes: [{ id: "name", type: "field", fieldType: "text", name: "name", label: "نام" }]
        }}
      />
    );

    expect(container.querySelector(".rfb-form")).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("button", { name: "ارسال" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "ارسال" }));
    expect(await screen.findByText("پاسخ شما ثبت شد.")).toBeTruthy();
  });

  it("submits through normalized adapter results", async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockResolvedValueOnce(adapterFailure("server_error", { message: "Adapter failed." }))
      .mockResolvedValueOnce(adapterSuccess({ response: successResponse("sub_adapter") }));
    const schema = {
      ...baseSchema,
      nodes: [{ id: "email", type: "field", fieldType: "email", name: "email", label: "Email" }]
    };

    render(<FormRenderer schema={schema} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("Adapter failed.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("Submission received.")).toBeTruthy();
  });

  it("supports custom field registry entries and slots without giving slots core semantics", async () => {
    const user = userEvent.setup();
    const customField: FieldRenderer = (props) => (
      <input
        aria-label={props.label}
        data-custom-field={props.node.id}
        id={props.ids.inputId}
        value={String(props.value ?? "")}
        onBlur={props.onBlur}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        ref={props.focusRef as Ref<HTMLInputElement>}
      />
    );
    const registry = createDefaultFieldRegistry({ text: customField });
    const onSubmit = vi.fn(async (_envelope: SubmissionEnvelope): Promise<BackendResponse> => successResponse("sub_2"));
    const schema = {
      ...baseSchema,
      nodes: [{ id: "name", type: "field", fieldType: "text", name: "name", label: "Name" }]
    };

    render(
      <FormRenderer
        schema={schema}
        registry={registry}
        onSubmit={onSubmit}
        slots={{
          FieldChrome: ({ field, children }) => (
            <div data-slot-field={field.id}>
              <span>Slot chrome</span>
              {children}
            </div>
          )
        }}
      />
    );

    expect(screen.getByText("Slot chrome")).toBeTruthy();
    expect(screen.getByLabelText("Name")).toHaveAttribute("data-custom-field", "name");
    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]?.data).toEqual({ name: "Jane" });
  });

  it("fails closed for unknown fields and keeps public exports product-owned", () => {
    const schema = {
      ...baseSchema,
      nodes: [{ id: "mystery", type: "field", fieldType: "mystery", name: "mystery", label: "Mystery" }]
    };

    render(<FormRenderer schema={schema} />);

    expect(screen.getByRole("status")).toHaveTextContent("Unsupported field");
    expect(Object.keys(publicExports).join(" ")).not.toMatch(/react-hook-form|resolver|fieldArray|formState/i);
  });
});
