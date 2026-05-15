import type { RendererSchema } from "@your-org/forms-react-renderer";

export type ExampleMode = "intake" | "persian" | "multi" | "logic" | "embed";

export interface ExampleDefinition {
  mode: ExampleMode;
  label: string;
  description: string;
  schema: RendererSchema;
  validationPath: string;
  builderEnabled: boolean;
}

export const englishCustomerIntakeSchema: RendererSchema = {
  schemaVersion: "1.0.0",
  formId: "customer_intake_en",
  revisionId: "rev_customer_intake_en_001",
  revisionHash: "sha256:customer-intake-en",
  status: "published",
  locale: "en",
  direction: "ltr",
  title: "Customer project intake",
  description: "A production-style customer intake form with content, structured options, consent, and a thank-you ending.",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    { id: "welcome", type: "content", contentType: "welcome", label: "Tell us what you need", description: "We use these details to route your request to the right team." },
    { id: "heading_contact", type: "content", contentType: "heading", label: "Contact details", props: { level: 3 } },
    { id: "copy_contact", type: "content", contentType: "paragraph", props: { text: "Use a work email so our team can follow up with the right context." } },
    { id: "full_name", type: "field", fieldType: "text", name: "contact.fullName", label: "Full name", validation: [{ type: "required" }] },
    { id: "email", type: "field", fieldType: "email", name: "contact.email", label: "Work email", validation: [{ type: "required" }, { type: "email" }] },
    { id: "company", type: "field", fieldType: "text", name: "company.name", label: "Company name", validation: [{ type: "required" }] },
    { id: "heading_request", type: "content", contentType: "heading", label: "Request details", props: { level: 3 } },
    {
      id: "request_type",
      type: "field",
      fieldType: "select",
      name: "request.type",
      label: "What do you want to build?",
      options: [
        { id: "new_form", label: "New form workflow", value: "new_form" },
        { id: "migration", label: "Migrate existing forms", value: "migration" },
        { id: "integration", label: "Connect forms to backend systems", value: "integration" },
        { id: "analytics", label: "Improve analytics and conversion", value: "analytics" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "timeline",
      type: "field",
      fieldType: "radio",
      name: "request.timeline",
      label: "Target timeline",
      options: [
        { id: "this_month", label: "This month", value: "this_month" },
        { id: "quarter", label: "This quarter", value: "quarter" },
        { id: "exploring", label: "Still exploring", value: "exploring" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "channels",
      type: "field",
      fieldType: "checkboxGroup",
      name: "request.channels",
      label: "Where should responses go?",
      options: [
        { id: "crm", label: "CRM", value: "crm" },
        { id: "email", label: "Email notification", value: "email" },
        { id: "webhook", label: "Webhook", value: "webhook" },
        { id: "csv", label: "CSV export", value: "csv" }
      ],
      validation: [{ type: "selectionCount", params: { min: 1 } }]
    },
    { id: "summary", type: "field", fieldType: "textarea", name: "request.summary", label: "Project summary", validation: [{ type: "required" }, { type: "minLength", params: { min: 12 } }] },
    { id: "consent", type: "field", fieldType: "checkbox", name: "consent.followUp", label: "I agree to be contacted about this request", validation: [{ type: "required" }] },
    { id: "hidden_campaign", type: "hidden", name: "meta.campaign", defaultValue: "product-template-phase-19" },
    { id: "ending", type: "ending", label: "Request received", description: "Thanks. Your project request has been captured and is ready for review." }
  ]
};

export const persianCustomerIntakeSchema: RendererSchema = {
  ...englishCustomerIntakeSchema,
  formId: "customer_intake_fa",
  revisionId: "rev_customer_intake_fa_001",
  revisionHash: "sha256:customer-intake-fa",
  locale: "fa-IR",
  direction: "rtl",
  title: "فرم دریافت درخواست مشتری",
  description: "نمونه واقعی فارسی برای دریافت اطلاعات مشتری با گزینه‌های پایدار و چیدمان راست به چپ.",
  nodes: [
    { id: "welcome_fa", type: "content", contentType: "welcome", label: "درخواست خود را ثبت کنید", description: "این اطلاعات به تیم کمک می‌کند درخواست شما را دقیق‌تر بررسی کند." },
    { id: "heading_contact_fa", type: "content", contentType: "heading", label: "اطلاعات تماس", props: { level: 3 } },
    { id: "full_name_fa", type: "field", fieldType: "text", name: "contact.fullName", label: "نام و نام خانوادگی", validation: [{ type: "required" }] },
    { id: "mobile_fa", type: "field", fieldType: "phone", name: "contact.mobile", label: "شماره موبایل", description: "مثال: 09123456789", validation: [{ type: "required" }] },
    { id: "email_fa", type: "field", fieldType: "email", name: "contact.email", label: "ایمیل", validation: [{ type: "email" }] },
    {
      id: "province_fa",
      type: "field",
      fieldType: "select",
      name: "location.province",
      label: "استان",
      options: [
        { id: "tehran", label: "تهران", value: "tehran" },
        { id: "isfahan", label: "اصفهان", value: "isfahan" },
        { id: "fars", label: "فارس", value: "fars" },
        { id: "khorasan_razavi", label: "خراسان رضوی", value: "khorasan_razavi" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "city_fa",
      type: "field",
      fieldType: "select",
      name: "location.city",
      label: "شهر",
      options: [
        { id: "tehran_city", label: "تهران", value: "tehran" },
        { id: "isfahan_city", label: "اصفهان", value: "isfahan" },
        { id: "shiraz", label: "شیراز", value: "shiraz" },
        { id: "mashhad", label: "مشهد", value: "mashhad" }
      ],
      validation: [{ type: "required" }]
    },
    { id: "heading_request_fa", type: "content", contentType: "heading", label: "جزئیات درخواست", props: { level: 3 } },
    {
      id: "request_type_fa",
      type: "field",
      fieldType: "radio",
      name: "request.type",
      label: "نوع درخواست",
      options: [
        { id: "consulting", label: "مشاوره", value: "consulting" },
        { id: "implementation", label: "پیاده‌سازی", value: "implementation" },
        { id: "support", label: "پشتیبانی", value: "support" }
      ],
      validation: [{ type: "required" }]
    },
    { id: "summary_fa", type: "field", fieldType: "textarea", name: "request.summary", label: "توضیح درخواست", validation: [{ type: "required" }] },
    { id: "consent_fa", type: "field", fieldType: "checkbox", name: "consent.followUp", label: "با تماس جهت پیگیری موافقم", validation: [{ type: "required" }] },
    { id: "hidden_campaign_fa", type: "hidden", name: "meta.campaign", defaultValue: "persian-template-phase-19" },
    { id: "ending_fa", type: "ending", label: "درخواست شما ثبت شد", description: "از شما متشکریم. اطلاعات درخواست برای بررسی آماده است." }
  ]
};

export const multiStepProjectSchema: RendererSchema = {
  ...englishCustomerIntakeSchema,
  formId: "project_request_steps",
  revisionId: "rev_project_request_steps_001",
  revisionHash: "sha256:project-request-steps",
  title: "Project request",
  description: "A multi-step request form with sections, current-step validation, and structured options.",
  settings: { ...englishCustomerIntakeSchema.settings, navigation: "steps" },
  nodes: [
    { id: "step_contact", type: "step", label: "Contact", children: ["section_contact"] },
    { id: "section_contact", type: "section", label: "Contact details", children: ["full_name", "email", "company"] },
    { id: "full_name", type: "field", fieldType: "text", name: "contact.fullName", label: "Full name", validation: [{ type: "required" }] },
    { id: "email", type: "field", fieldType: "email", name: "contact.email", label: "Work email", validation: [{ type: "required" }, { type: "email" }] },
    { id: "company", type: "field", fieldType: "text", name: "company.name", label: "Company name", validation: [{ type: "required" }] },
    { id: "step_scope", type: "step", label: "Scope", children: ["section_scope"] },
    { id: "section_scope", type: "section", label: "Project scope", children: ["request_type", "timeline", "summary"] },
    englishCustomerIntakeSchema.nodes.find((node) => node.id === "request_type")!,
    englishCustomerIntakeSchema.nodes.find((node) => node.id === "timeline")!,
    englishCustomerIntakeSchema.nodes.find((node) => node.id === "summary")!,
    { id: "ending", type: "ending", label: "Project request received", description: "The multi-step request has been submitted." }
  ]
};

export const visualLogicSchema: RendererSchema = {
  ...englishCustomerIntakeSchema,
  formId: "logic_showcase",
  revisionId: "rev_logic_showcase_001",
  revisionHash: "sha256:logic-showcase",
  title: "Conditional routing request",
  description: "Shows safe visual logic: fields appear and become required from declarative conditions.",
  nodes: [
    { id: "welcome_logic", type: "content", contentType: "welcome", label: "Logic without raw JSON", description: "Choose integration and the follow-up field appears." },
    {
      id: "request_type",
      type: "field",
      fieldType: "select",
      name: "request.type",
      label: "Request type",
      options: [
        { id: "new_form", label: "New form", value: "new_form" },
        { id: "integration", label: "Backend integration", value: "integration" },
        { id: "reporting", label: "Reporting workflow", value: "reporting" }
      ],
      validation: [{ type: "required" }]
    },
    {
      id: "integration_target",
      type: "field",
      fieldType: "text",
      name: "request.integrationTarget",
      label: "Which backend should this connect to?",
      visibility: { field: "request.type", op: "eq", value: "integration" },
      validation: [{ type: "required", when: { field: "request.type", op: "eq", value: "integration" } }]
    },
    { id: "summary", type: "field", fieldType: "textarea", name: "request.summary", label: "Short summary", validation: [{ type: "required" }] },
    { id: "ending", type: "ending", label: "Logic request received", description: "The conditional form submitted successfully." }
  ]
};

export const rendererOnlyEmbedSchema: RendererSchema = {
  ...englishCustomerIntakeSchema,
  formId: "renderer_only_embed",
  revisionId: "rev_renderer_only_embed_001",
  revisionHash: "sha256:renderer-only-embed",
  title: "Newsletter preference center",
  description: "Renderer-only embed for a host page that does not need the builder.",
  nodes: [
    { id: "heading", type: "content", contentType: "heading", label: "Choose what you want to receive", props: { level: 3 } },
    { id: "email", type: "field", fieldType: "email", name: "email", label: "Email", validation: [{ type: "required" }, { type: "email" }] },
    {
      id: "topics",
      type: "field",
      fieldType: "checkboxGroup",
      name: "topics",
      label: "Topics",
      options: [
        { id: "product", label: "Product updates", value: "product" },
        { id: "engineering", label: "Engineering notes", value: "engineering" },
        { id: "events", label: "Events", value: "events" }
      ],
      validation: [{ type: "selectionCount", params: { min: 1 } }]
    },
    { id: "ending", type: "ending", label: "Preferences saved", description: "Your newsletter preferences have been updated." }
  ]
};

export const examples: Record<ExampleMode, ExampleDefinition> = {
  intake: {
    mode: "intake",
    label: "Customer intake",
    description: "English production template with content blocks, structured choices, consent, hidden campaign metadata, and a thank-you ending.",
    schema: englishCustomerIntakeSchema,
    validationPath: "contact.email",
    builderEnabled: true
  },
  persian: {
    mode: "persian",
    label: "Persian intake",
    description: "Persian RTL customer intake with Iran province/city option presets and stable backend values.",
    schema: persianCustomerIntakeSchema,
    validationPath: "contact.mobile",
    builderEnabled: true
  },
  multi: {
    mode: "multi",
    label: "Multi-step request",
    description: "Production-style multi-step request form with sections and current-step validation.",
    schema: multiStepProjectSchema,
    validationPath: "contact.email",
    builderEnabled: true
  },
  logic: {
    mode: "logic",
    label: "Visual logic",
    description: "Conditional visibility and requiredness using the safe declarative condition model.",
    schema: visualLogicSchema,
    validationPath: "request.integrationTarget",
    builderEnabled: true
  },
  embed: {
    mode: "embed",
    label: "Renderer-only embed",
    description: "A host-page embed that renders and submits a published schema without mounting the builder.",
    schema: rendererOnlyEmbedSchema,
    validationPath: "email",
    builderEnabled: false
  }
};
