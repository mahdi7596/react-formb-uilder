import type { RendererSchema } from "@your-org/forms-react-renderer";

export type ExampleMode = "single" | "validation" | "multi" | "rtl";

export interface ExampleDefinition {
  mode: ExampleMode;
  label: string;
  description: string;
  schema: RendererSchema;
  validationPath: string;
}

export const singlePageSchema: RendererSchema = {
  schemaVersion: "1.0.0",
  formId: "example_single_page",
  revisionId: "rev_single_001",
  revisionHash: "sha256:example-single",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "Conference Registration",
  description: "A single-page published schema rendered by the React renderer package.",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    {
      id: "field_full_name",
      type: "field",
      fieldType: "text",
      name: "fullName",
      label: "Full name",
      description: "Use the name that should appear on your badge.",
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
      id: "field_track",
      type: "field",
      fieldType: "select",
      name: "track",
      label: "Preferred track",
      options: [
        { id: "product", label: "Product", value: "product" },
        { id: "engineering", label: "Engineering", value: "engineering" },
        { id: "operations", label: "Operations", value: "operations", disabled: true }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "field_company_toggle",
      type: "field",
      fieldType: "checkbox",
      name: "hasCompany",
      label: "I am registering for a company"
    },
    {
      id: "field_company",
      type: "field",
      fieldType: "text",
      name: "company",
      label: "Company name",
      visibility: { field: "hasCompany", op: "eq", value: true },
      validation: [{ type: "required" }]
    },
    {
      id: "field_consent",
      type: "field",
      fieldType: "checkbox",
      name: "consent",
      label: "I agree to be contacted about this registration",
      validation: [{ type: "required" }]
    },
    {
      id: "field_reference",
      type: "field",
      fieldType: "text",
      name: "referenceCode",
      label: "Reference code",
      description: "Enabled after consent is checked.",
      enabledWhen: { field: "consent", op: "eq", value: true }
    },
    {
      id: "field_resume",
      type: "field",
      fieldType: "fileMetadata",
      name: "attachments",
      label: "Attachment metadata",
      description: "Metadata only; this example does not upload files.",
      defaultValue: []
    },
    {
      id: "hidden_source",
      type: "hidden",
      name: "source",
      defaultValue: "vite-example"
    }
  ]
};

export const multiStepSchema: RendererSchema = {
  schemaVersion: "1.0.0",
  formId: "example_multi_step",
  revisionId: "rev_multi_001",
  revisionHash: "sha256:example-multi",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "Partner Intake",
  description: "A multi-step schema with current-step validation.",
  settings: {
    submitMode: "final",
    navigation: "steps",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    { id: "step_contact", type: "step", label: "Contact", children: ["section_contact"] },
    { id: "section_contact", type: "section", label: "Contact details", children: ["field_partner_name", "field_partner_email"] },
    {
      id: "field_partner_name",
      type: "field",
      fieldType: "text",
      name: "contact.name",
      label: "Contact name",
      validation: [{ type: "required" }]
    },
    {
      id: "field_partner_email",
      type: "field",
      fieldType: "email",
      name: "contact.email",
      label: "Contact email",
      validation: [{ type: "required" }, { type: "email" }]
    },
    { id: "step_details", type: "step", label: "Project", children: ["section_project"] },
    { id: "section_project", type: "section", label: "Project details", children: ["field_project_type", "field_project_summary"] },
    {
      id: "field_project_type",
      type: "field",
      fieldType: "radio",
      name: "project.type",
      label: "Project type",
      options: [
        { id: "pilot", label: "Pilot", value: "pilot" },
        { id: "production", label: "Production", value: "production" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "field_project_summary",
      type: "field",
      fieldType: "textarea",
      name: "project.summary",
      label: "Project summary",
      validation: [{ type: "required" }]
    }
  ]
};

export const rtlSchema: RendererSchema = {
  ...singlePageSchema,
  formId: "example_rtl",
  revisionId: "rev_rtl_001",
  revisionHash: "sha256:example-rtl",
  locale: "fa",
  direction: "rtl",
  title: "ثبت نام رویداد",
  description: "نمونه راست به چپ که با همان رندرر واقعی نمایش داده می شود.",
  nodes: [
    {
      id: "field_full_name_rtl",
      type: "field",
      fieldType: "text",
      name: "fullName",
      label: "نام کامل",
      validation: [{ type: "required" }]
    },
    {
      id: "field_email_rtl",
      type: "field",
      fieldType: "email",
      name: "email",
      label: "ایمیل",
      validation: [{ type: "required" }, { type: "email" }]
    },
    {
      id: "field_track_rtl",
      type: "field",
      fieldType: "select",
      name: "track",
      label: "مسیر مورد علاقه",
      options: [
        { id: "product", label: "محصول", value: "product" },
        { id: "engineering", label: "مهندسی", value: "engineering" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "field_consent_rtl",
      type: "field",
      fieldType: "checkbox",
      name: "consent",
      label: "با تماس درباره ثبت نام موافقم",
      validation: [{ type: "required" }]
    },
    {
      id: "hidden_source_rtl",
      type: "hidden",
      name: "source",
      defaultValue: "vite-example-rtl"
    }
  ]
};

export const examples: Record<ExampleMode, ExampleDefinition> = {
  single: {
    mode: "single",
    label: "Single page",
    description: "Required fields, conditional company field, disabled reference code, hidden source, and metadata-only file field.",
    schema: singlePageSchema,
    validationPath: "email"
  },
  validation: {
    mode: "validation",
    label: "Server validation",
    description: "The same single-page schema, wired to a fake backend validation response.",
    schema: singlePageSchema,
    validationPath: "email"
  },
  multi: {
    mode: "multi",
    label: "Multi-step",
    description: "Current-step validation, previous/next navigation, sections, and final submission.",
    schema: multiStepSchema,
    validationPath: "contact.email"
  },
  rtl: {
    mode: "rtl",
    label: "RTL",
    description: "Persian labels and right-to-left layout using the same renderer.",
    schema: rtlSchema,
    validationPath: "email"
  }
};
