import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BuilderWorkspace, type BuilderSchema } from "../src/index.ts";

const schema: BuilderSchema = {
  schemaVersion: "1.0.0",
  formId: "phase_8_harness",
  revisionId: "rev_draft",
  revisionHash: "sha256:phase8",
  status: "draft",
  locale: "fa",
  direction: "rtl",
  title: "Phase 8 builder harness",
  settings: {
    submitMode: "final",
    navigation: "singlePage",
    validationTiming: "onSubmit",
    preserveHiddenValues: false
  },
  nodes: [
    {
      id: "field_name",
      type: "field",
      fieldType: "text",
      name: "fullName",
      label: "Full name",
      description: "Shown in the live renderer preview.",
      validation: [{ type: "required" }]
    }
  ]
};

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element.");
}

createRoot(root).render(
  <StrictMode>
    <BuilderWorkspace schema={schema} />
  </StrictMode>
);
