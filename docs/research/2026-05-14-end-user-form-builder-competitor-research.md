# End-User Form Builder Competitor Research

Research date: 2026-05-14

This document lists the strongest form builders that real users interact with through product UIs. It intentionally focuses on no-code and low-code products first, because these are the products our builder experience will be judged against. Developer libraries such as SurveyJS, Form.io, RJSF, JSON Forms, Uniforms, and Formily should be studied separately as implementation and architecture references.

## Ranking Criteria

Products are ranked by a mix of:

- market visibility and category reputation
- quality of end-user builder experience
- breadth of field types and logic
- workflows after submission
- integrations and data destinations
- brand/customization flexibility
- enterprise readiness
- lessons relevant to a backend-agnostic, RTL-first React form builder

## Ranked Shortlist

| Rank | Product | Best For | Why It Matters |
| ---: | --- | --- | --- |
| 1 | Jotform | All-in-one form building | Huge template library, drag-and-drop builder, payments, widgets, conditional logic, workflows, signatures, reports, and integrations. This is the broadest feature benchmark. |
| 2 | Typeform | Conversational forms | The strongest reference for one-question-at-a-time flow, visual polish, friendly completion experience, AI-assisted creation, and lead-generation forms. |
| 3 | Tally | Minimal fast form creation | The best reference for speed, simplicity, generous free usage, Notion-like editing, and low-friction publishing. |
| 4 | Fillout | Database-connected forms | Strong reference for Airtable, Notion, HubSpot, Salesforce, scheduling, prefill, update forms, and database-backed workflows. |
| 5 | Formstack | Enterprise workflows | Strong reference for approvals, document generation, e-signature workflows, permissions, security, and regulated business processes. |
| 6 | Paperform | Branded forms and payment flows | Strong reference for beautiful forms that feel like landing pages, AI-assisted logic/calculations, payments, bookings, and branded experiences. |
| 7 | Cognito Forms | Calculations and payments | Strong reference for calculations, repeating sections, conditional requirements, invoices, and payment conditions. |
| 8 | Google Forms | Simple free forms | The baseline for simple form creation, collaboration, quizzes, sections, and low learning curve. |
| 9 | Microsoft Forms | Microsoft 365 surveys and quizzes | The baseline for enterprise office users, branching, Excel export, multilingual reach, and real-time reporting. |
| 10 | SurveyMonkey | Surveys, analytics, research | Strong reference for surveys, question banks, AI creation, skip logic, multilingual surveys, analytics, and enterprise security. |
| 11 | Airtable Forms | Forms directly over structured data | Important because forms are attached to database tables, fields, attachments, API workflows, and conditional form fields. |
| 12 | HubSpot Forms | CRM lead capture | Important because the form is not the product by itself; the value is CRM sync, lead scoring, segmentation, analytics, and follow-up workflows. |

## Product Notes

### 1. Jotform

Jotform is the broadest product benchmark. Its public materials emphasize 35M+ users, 20,000+ templates, 150+ integrations, drag-and-drop building, conditional logic, payment gateways, recurring payments, widgets, workflows, reports, e-signature, and no-code customization.

What to inspect:

- Field palette and drag-and-drop builder ergonomics.
- Conditional logic UI for show/hide, requiredness, routing, and calculations.
- Payment field setup and payment provider diversity.
- Template selection, onboarding, and AI form generation.
- Submission table, reports, PDF generation, signatures, and workflow automation.

Lessons for us:

- Users expect form builders to include actions after submission, not only field rendering.
- The builder must keep complex features discoverable without making simple forms feel heavy.
- Jotform's breadth is impressive, but our advantage can be cleaner architecture, stronger developer embedding, first-class RTL, and design-system integration.

Sources:

- https://www.jotform.com/features/
- https://learn.g2.com/best-online-form-builders
- https://www.techradar.com/best/best-online-form-builder

### 2. Typeform

Typeform is the benchmark for conversational forms. It presents questions one at a time and focuses on completion experience, brand feel, engagement, lead qualification, AI-assisted creation, and polished templates.

What to inspect:

- One-question-at-a-time flow.
- Keyboard-first respondent experience.
- Progress, transitions, endings, and lead qualification patterns.
- AI form creation and AI question suggestions.
- Design customization model.

Lessons for us:

- We should support both classic page/section forms and conversational mode eventually.
- A form renderer can feel like a product experience, not just a data-entry screen.
- RTL support must include conversational navigation, progress, directional icons, transitions, and keyboard behavior.

Sources:

- https://www.typeform.com/platform-overview
- https://help.typeform.com/hc/en-us/articles/360053660271-My-first-form
- https://help.typeform.com/hc/en-us/articles/14955071444244-use-ai-to-create-new-typeforms

### 3. Tally

Tally is a strong simplicity benchmark. It offers unlimited forms and responses on the free plan and supports input blocks, ranking, matrix, dropdown, multi-select, file upload, payments, signatures, conditional logic, hidden fields, calculated fields, answer piping, embeds, reCAPTCHA, custom domains, version history, partial submissions, and PDF generation.

What to inspect:

- Notion-like editor flow.
- How advanced features are hidden until needed.
- Publishing and embedding flow.
- Free-plan ergonomics and upgrade boundaries.
- Version history and collaboration model.

Lessons for us:

- The fastest builder experience may beat a more powerful but heavier UI.
- Blocks should be easy to add from the keyboard.
- We can learn from Tally's calm editing model while still building a stronger schema/runtime contract.

Sources:

- https://tally.so/help/features
- https://www.involve.me/blog/best-online-form-builders

### 4. Fillout

Fillout is the strongest database-connected form reference. It is popular with Airtable and Notion users and supports forms that create and update records, prefill data, show filtered choices, and connect to app/database workflows.

What to inspect:

- Airtable, Notion, HubSpot, and Salesforce binding flows.
- Record update forms and prefilled forms.
- Conditional logic against external data.
- Drop-off tracking and multi-page form support.
- How it handles schema changes in connected systems.

Lessons for us:

- Backend-agnostic does not mean data-agnostic. Users will want fields generated from existing backend/database schemas.
- We should design adapters so host apps can provide options, prefill, lookup, and update behavior without making core backend-specific.
- Schema dependency diagnostics will matter when external fields change.

Sources:

- https://www.fillout.com/docs/notion
- https://support.fillout.com/help/form-dependencies
- https://www.notion.com/en-gb/integrations/fillout

### 5. Formstack

Formstack is an enterprise workflow benchmark. Its Forms and Workflows products emphasize AI form creation, permissions, subaccounts, approvals, API connectors, data capture, document generation, and e-signatures.

What to inspect:

- Approval workflows.
- Multi-step workflow builder across Forms, Documents, and Sign.
- User permissions and enterprise account structure.
- Branding, compliance, and data governance features.
- Form-to-form prefill.

Lessons for us:

- Enterprise value appears after submission: approvals, generated documents, signatures, and system updates.
- We should keep MVP focused, but preserve extension points for workflow products later.
- Permissions, versioning, auditability, and immutable published revisions should be treated as core architecture decisions.

Sources:

- https://www.formstack.com/online-forms/features
- https://www.formstack.com/products/workflows
- https://help.formstack.com/hc/en-us/articles/44593193335187-Workflows-Overview

### 6. Paperform

Paperform is a benchmark for branded, page-like forms. It positions itself around forms, surveys, payment flows, bookings, AI generation, AI logic/calculation suggestions, and response insights.

What to inspect:

- Document-like form authoring.
- Branding controls and visual customization.
- Payment and booking flows.
- AI-generated forms, logic, calculations, and insights.
- How it balances form content with marketing-page presentation.

Lessons for us:

- Some users want forms that feel like lightweight landing pages.
- Our default renderer should be plain, but slots/themes must allow rich branded experiences.
- We should avoid locking layout too tightly to a basic questionnaire model.

Sources:

- https://paperform.co/
- https://paperform.co/form-builders/best-form-builders/

### 7. Cognito Forms

Cognito Forms is a strong benchmark for business forms with calculations. It supports formulas, conditional calculations, repeating sections, lookup/person fields, payments through Stripe, PayPal, and Square, conditional payment processing, invoices, and file/signature-style business workflows.

What to inspect:

- Calculation editor and advanced calculation mode.
- Repeating sections and tables.
- Conditional requiredness and visibility.
- Payment settings and conditional payments.
- Internal field names and developer mode.

Lessons for us:

- Calculations become a runtime language, not just a UI feature.
- If we include calculations, we need a deterministic expression model, dependency tracking, cycle detection, and backend parity rules.
- Repeaters should not ship until their path, validation, accessibility, and migration semantics are specified.

Sources:

- https://www.cognitoforms.com/product
- https://www.cognitoforms.com/support/2/calculations
- https://www.cognitoforms.com/support/434/collecting-payment/payment-settings

### 8. Google Forms

Google Forms is the simplicity baseline. It is fast, free, collaborative, supports sections, quizzes, basic conditional logic, Google Sheets export, and familiar Google Workspace sharing.

What to inspect:

- First-time creation speed.
- Collaboration and sharing.
- Quiz mode and grading.
- Sheets integration.
- Where it intentionally stays limited.

Lessons for us:

- A simple form must be possible in under a minute.
- Complexity should be optional.
- Export and spreadsheet-like submission views are table stakes.

Sources:

- https://support.google.com/docs/answer/7032287
- https://www.techradar.com/reviews/google-forms

### 9. Microsoft Forms

Microsoft Forms is the Microsoft 365 baseline. It supports surveys, polls, quizzes, built-in intelligence, branching, multilingual reach, real-time charts, Excel export, and easy collaboration in Microsoft environments.

What to inspect:

- Branching UI.
- Quiz and education workflows.
- Report charts and Excel export.
- Microsoft 365 sharing and permissions.
- Multilingual support.

Lessons for us:

- Built-in reporting matters even for simple forms.
- Enterprise users expect native export and permission patterns.
- Multilingual and RTL support should be first-class, not a plugin.

Sources:

- https://www.microsoft.com/en-us/microsoft-365/online-surveys-polls-quizzes
- https://support.microsoft.com/en-us/office/use-branching-logic-in-your-form-0a092a1c-8fe4-441c-9fc6-cd0aad3b52b2

### 10. SurveyMonkey

SurveyMonkey is a survey and analytics benchmark. It offers AI survey creation, AI import, question recommendations, question banks, 400+ templates, 25+ question types, skip logic, custom themes, payments, multilingual surveys, analytics, collaboration, workflows, integrations, and enterprise security.

What to inspect:

- Question bank and expert templates.
- Survey analytics and reporting.
- AI survey creation and import.
- Skip logic and survey path design.
- Multilingual surveys and enterprise controls.

Lessons for us:

- For survey use cases, analytics and question quality matter as much as form layout.
- AI can assist not only creation but also question type selection and response insights.
- We may need a future distinction between forms, surveys, quizzes, and assessments.

Sources:

- https://www.surveymonkey.com/product/features/
- https://www.techradar.com/best/best-survey-tools

### 11. Airtable Forms

Airtable Forms matter because the form writes directly to a structured database table. Airtable form views support attachments, mobile-friendly forms, API-connected records, conditional fields, and interface forms.

What to inspect:

- Field-to-form generation from an existing table.
- Conditional form fields.
- Attachment handling.
- Interface forms versus classic form views.
- How schema changes affect forms.

Lessons for us:

- Many customers will want to generate forms from existing data models.
- A future backend adapter should map form paths to backend fields without coupling core to a vendor.
- The builder should flag broken external dependencies clearly.

Sources:

- https://support.airtable.com/docs/getting-started-with-airtable-form-views
- https://support.airtable.com/docs/building-and-sharing-forms-in-airtable

### 12. HubSpot Forms

HubSpot Forms matter because forms are part of a CRM and marketing automation system. HubSpot emphasizes lead capture, drag-and-drop forms, landing pages, chatbots, CRM sync, segmented lists, lead scoring, campaign tracking, analytics, and follow-up workflows.

What to inspect:

- CRM property mapping.
- Contact creation/update behavior.
- Lead scoring and segmentation.
- Campaign analytics and attribution.
- Form-to-workflow automation.

Lessons for us:

- Forms are often an entry point into a larger business process.
- Submission adapters should make it easy to map data into CRM-style systems.
- We should separate the form contract from the post-submit workflow engine so host apps can own business logic.

Sources:

- https://www.hubspot.com/products/marketing/lead-capture
- https://www.hubspot.com/products/marketing/forms

## Feature Matrix

| Feature Area | Strongest References | Product Implication For Us |
| --- | --- | --- |
| Fast simple creation | Tally, Google Forms, Microsoft Forms | MVP must allow a simple form quickly, with no schema jargon exposed to normal users. |
| Broad all-in-one capability | Jotform | Long-term product needs templates, payments, integrations, reports, signatures, and workflows. |
| Conversational UX | Typeform | Renderer should eventually support conversational mode as a rendering strategy. |
| Database-connected forms | Fillout, Airtable, HubSpot | Adapters should support prefill, options, lookups, create/update behavior, and dependency diagnostics. |
| Enterprise workflows | Formstack | Preserve extension points for approvals, docs, signatures, permissions, and audit logs. |
| Calculations | Cognito Forms, Paperform, Tally | Calculations require a deterministic expression language and compiler/runtime diagnostics. |
| Surveys and analytics | SurveyMonkey, Typeform | Response analytics and question quality become product areas beyond schema rendering. |
| Payments | Jotform, Cognito Forms, Paperform, SurveyMonkey | Payments should be out of MVP unless lifecycle, security, and provider contracts are specified. |
| File uploads | Jotform, Tally, Cognito Forms, Airtable | File metadata and upload lifecycle must be designed carefully before shipping. |
| Collaboration/versioning | Tally, Google Forms, Formstack | Version history, roles, publish states, and immutable revisions should be part of the architecture. |
| Multilingual/RTL | Microsoft Forms, SurveyMonkey, our own requirement | Our differentiator should be first-class RTL and localization across builder and renderer. |

## What We Should Build Toward

The strongest strategic direction is not to clone one product. We should combine the best ideas:

- Tally's speed and calm editing.
- Typeform's polished respondent experience.
- Jotform's field breadth and practical business features.
- Fillout's data-connected workflows.
- Cognito's calculation seriousness.
- Formstack's enterprise workflow thinking.
- SurveyMonkey's analytics and question quality.

Our differentiator should be:

- backend-agnostic JSON contracts
- package-first React/Next.js integration
- headless renderer and design-system slots
- first-class RTL/LTR and multilingual behavior
- explicit schema versioning and migrations
- deterministic validation, conditions, and compiler diagnostics
- clean separation between schema, renderer, builder, adapters, and future workflow features

## Immediate Inspection Plan

Before implementing builder UI, inspect these products manually in this order:

1. Tally: fastest creation model and block editing.
2. Typeform: respondent experience and conversational flow.
3. Jotform: field palette, logic, templates, payments, and reports.
4. Fillout: database-connected fields, prefill, and update forms.
5. Cognito Forms: calculations, repeaters, and conditional payments.
6. Formstack: approvals, workflow builder, permissions, and enterprise process design.

For each inspection, capture:

- first-run onboarding flow
- field creation and editing flow
- conditional logic UX
- validation UX
- multi-step or conversational behavior
- preview/publish/embed flow
- submission management
- localization and RTL gaps
- what to copy conceptually
- what to avoid

