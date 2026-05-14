# Standard Prompt: Complete End-User Form Builder Component Audit and Interaction Specification

You are a senior product architect, UX systems designer, frontend architect, and form-builder domain researcher. Your task is to produce a complete, implementation-ready specification for a modern end-user form builder.

This work must be based on:

1. `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`
2. `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
3. Fresh web research into leading form builders and survey builders, including but not limited to Typeform, Jotform, Fillout, Tally, Google Forms, SurveyMonkey, Formstack, Airtable Forms, Paperform, Cognito Forms, Wufoo, Formsort, and enterprise/workflow-oriented products where relevant.

If either local document is missing, explicitly say so, then continue by creating a best-effort specification from the available context and web research. Do not invent claims about the missing documents. Where a decision depends on missing context, mark it as an assumption.

## Goal

Create a deep, precise, component-by-component blueprint for a complete form builder. The output should answer:

- What form components must the product support?
- What settings should appear when a user selects each component in the builder?
- How should each component behave in the respondent form runtime?
- How should each component interact with validation, conditional logic, calculations, branching, layout, theming, data mapping, analytics, accessibility, localization, and integrations?
- What should be included in the MVP, what should be added next, and what can remain advanced or enterprise-only?

The final result must be detailed enough that a product team, designer, and engineering team can build the form builder without needing another discovery phase.

## Required Research Method

First inspect the two provided local documents in full. Extract:

- Architecture decisions already made.
- Data model or schema decisions already made.
- UX assumptions already made.
- Target users and product positioning.
- Competitor findings already collected.
- Any open questions, constraints, or trade-offs.

Then perform fresh web research. Use official product documentation wherever possible. Include direct source links in the final output. At minimum, inspect current documentation for:

- Typeform question types and question settings.
- Fillout field types, hidden fields, logic, custom values, and advanced blocks.
- Tally input blocks, hidden fields, calculations, payments, embeds, and block settings.
- Google Forms question types, validation, section branching, file uploads, grids, scales, date/time.
- SurveyMonkey question types, page elements, survey options, ranking, matrix, NPS, A/B tests, click maps.
- Formstack field options, field settings, hidden/read-only/unique/default/placeholder/min/max/currency/format behavior.
- Airtable Forms field display options, required fields, data-backed fields, submission behavior, branding, redirect, copy response, submit-another-response.

Also inspect at least three additional competitors or adjacent tools if the earlier research did not already cover them.

For every claim, prefer official docs over marketing pages, blogs, or third-party summaries. Use third-party analysis only to identify gaps or common patterns, not as the source of truth.

## Output Format

Produce a structured markdown document with these sections:

1. Executive Summary
2. Product Scope and Assumptions
3. Competitor Component Inventory
4. Recommended Component Taxonomy
5. Global Builder Concepts
6. Universal Field Settings
7. Component-by-Component Specification
8. Layout, Page, and Structural Components
9. Logic, Branching, Calculations, and Data Flow
10. Validation Model
11. Builder Inspector UX
12. Respondent Runtime Behavior
13. Accessibility and Keyboard Behavior
14. Localization, RTL, Date/Time, Number, and Currency Rules
15. Data Schema Requirements
16. Analytics and Reporting Implications
17. Integrations and Webhook Implications
18. MVP vs Later Phases
19. Open Questions and Product Decisions Needed
20. Source Links

## Competitor Component Inventory

Create a comparison table. Rows should be component categories. Columns should include at least:

- Component/category
- Typeform
- Jotform
- Fillout
- Tally
- Google Forms
- SurveyMonkey
- Formstack
- Airtable Forms
- Other relevant competitors
- Recommendation for our product
- MVP priority

Use this inventory to identify:

- Common baseline components that every credible form builder needs.
- Differentiating advanced components.
- Components that are useful but risky because they increase complexity.
- Components that should be implemented as integrations or plugins rather than core fields.

## Recommended Component Taxonomy

Define a clean component taxonomy for our form builder. Use categories similar to:

### Basic Input Fields

- Short text
- Long text / textarea
- Number
- Email
- Phone
- URL / website
- Password / secret input
- Hidden field
- Read-only/display-only value

### Choice Fields

- Single choice / radio group
- Multiple choice / checkbox group
- Dropdown
- Multi-select dropdown
- Image choice / picture choice
- Boolean switch
- Single checkbox / consent checkbox
- Ranking
- Matrix / grid
- Choice matrix
- Best-worst scale if justified

### Date, Time, and Scheduling

- Date picker
- Time picker
- Date-time picker
- Date range
- Time duration
- Appointment/scheduling embed or integration

### Rating and Survey Fields

- Rating
- Star rating
- Opinion scale
- Linear scale
- NPS
- CSAT
- CES if justified
- Slider
- Likert matrix

### Contact and Identity Blocks

- Name
- Contact info compound block
- Address
- Email
- Phone
- Company
- Job title
- Social/profile links if justified

### Rich Collection Fields

- File upload
- Image upload
- Signature
- Voice recording
- Video response
- Location coordinates
- Payment
- Product/order item
- Table / repeating rows
- Subform / repeatable group

### Content and Layout Blocks

- Heading
- Paragraph/text block
- Statement
- Image
- Video
- PDF viewer
- HTML/embed block
- Divider
- Spacer
- Banner/callout
- Progress bar
- Section
- Collapsible section
- Page break
- Welcome screen
- Ending screen / thank-you page
- Multi-question page

### System and Utility Blocks

- CAPTCHA / bot protection
- Calculation field
- Score field
- UTM/URL parameter capture
- Data lookup / record picker
- Submission picker / edit existing response
- Send response copy
- Download PDF
- Fill again button

For each category, decide which components belong in core, which belong in plugin/integration architecture, and which should wait.

## Universal Field Settings

Define settings that should be available across most or all field components. Include:

- Field label/question text.
- Internal field name/key.
- Description/help text/supporting text.
- Placeholder.
- Default value.
- Required toggle.
- Hidden toggle.
- Read-only toggle.
- Disabled state if supported.
- Hide label toggle.
- Width/layout size.
- Field alignment where relevant.
- Validation rules.
- Error message customization.
- Conditional visibility.
- Conditional requirement.
- Conditional default value.
- Conditional option filtering.
- Logic jumps/branching.
- Calculation participation.
- Data mapping key.
- Integration mapping.
- Analytics name/category.
- Accessibility label override.
- Autofill/autocomplete hint.
- Sensitive data flag.
- PII classification.
- Retention/export behavior.
- Localization overrides.
- Admin notes/internal description.

Clarify which settings are universal, which are category-specific, and which are advanced-only.

## Component-by-Component Specification

For every component, provide this exact structure:

### Component Name

**Purpose:** What user problem this component solves.

**Respondent Runtime:** What the respondent sees and how they interact with it.

**Builder Selection Behavior:** What happens when the creator selects this component in the form builder.

**Inspector Panels and Options:**

- Content settings.
- Options/choices settings.
- Validation settings.
- Logic settings.
- Appearance/layout settings.
- Data/integration settings.
- Advanced settings.

**Default Configuration:** What should be created when the component is first added.

**Data Shape:** The stored response format. Include type, examples, empty value behavior, and export behavior.

**Validation Rules:** Built-in validation and custom validation options.

**Conditional Logic Interactions:** How this field can trigger logic, be controlled by logic, or participate in calculations.

**Accessibility Requirements:** Labeling, keyboard behavior, ARIA, screen reader expectations, focus order, error announcement.

**Localization Requirements:** Directionality, translated labels/options, date/time/number formatting, locale-specific validation.

**Mobile Behavior:** Any mobile-specific interaction details.

**Analytics/Reporting:** How results should be displayed, aggregated, filtered, charted, or excluded.

**Edge Cases:** Ambiguous behavior, invalid states, migration concerns, large option lists, file/security issues, empty values, duplicate values.

**MVP Priority:** Must-have, should-have, later, enterprise/plugin.

**Competitor References:** Which competitors support similar behavior and source links.

## Required Deep-Dive Examples

Go especially deep for these components:

### Short Text

Document options such as label, internal key, placeholder, description, default value, min/max characters, exact length, regex pattern, allowed/disallowed values, trim whitespace, case transform, autocomplete hint, input mode, required, unique, hidden, read-only, conditional visibility, conditional required, custom error messages, PII flag, and integration mapping.

### Long Text

Include row height, auto-grow, min/max characters, min/max words, rich text allowed or plain text only, markdown allowed or not, profanity/content moderation if relevant, AI follow-up/clarification if considered, and export behavior.

### Number

Include integer/decimal, min, max, step, precision, currency, percent, thousands separators, negative numbers, unit suffix/prefix, slider alternative, calculation participation, locale parsing, and invalid input behavior.

### Email

Include format validation, DNS/MX validation if supported, disposable email blocking, verification/OTP, confirmation email field, autofill, lowercasing, uniqueness, and CRM mapping.

### Phone

Include country selector, default country, international format, national format display, extension support, SMS OTP, WhatsApp compatibility if relevant, and formatting by locale.

### URL

Include protocol handling, allowed domains, social URL presets, link preview optionality, and normalization.

### Single Choice / Multiple Choice

Include option text, option value, internal custom value, description per option, image per option, randomization, alphabetical sort, bulk paste/import, "Other" option, none-of-the-above, exclusive options, min/max selections, scoring, price per option, hidden options, conditional options, pipe selected label/value into later questions, and export format.

### Dropdown / Multi-Select

Include searchability, typeahead, long list behavior, async options, data-source-backed options, option grouping, default option, placeholder, clearability, and mobile picker behavior.

### Matrix / Grid

Include row/column definitions, single vs multiple choice per row, required per row, randomization, column exclusivity, Likert mode, scoring, accessibility, mobile responsive transformation, and reporting.

### Date / Time / Date Range

Include min/max dates, relative constraints, blocked dates, allowed weekdays, date format, timezone, time format, duration mode, default to today/now, locale calendars, Jalali/Gregorian consideration if relevant, and export format.

### File Upload

Include allowed file types, max file size, max file count, upload progress, virus scanning assumption, storage provider, private/public access, retention, preview, image-only mode, required upload behavior, replacing files, failed upload recovery, and export links.

### Payment

Include amount modes, fixed price, calculated price, product list, quantity, coupon/discount, tax, currency, payment provider, payment before/after submission, failure/cancel behavior, receipt, refunds, PCI boundaries, and webhook behavior.

### Signature

Include draw/type/upload modes, clear action, consent text, timestamp/IP audit metadata if needed, export image/PDF behavior, and legal caveats.

### Hidden Field

Include URL parameter capture, UTM fields, default values, server-side injected values, security limits, use in conditions/calculations, hidden-but-exported behavior, and prevention of trusting client-side values.

### Section/Page/Ending Blocks

Include navigation, progress, back button, page validation, skip logic, branching destinations, multi-question page behavior, section collapse, thank-you states, redirects, submit another response, response copy, and partial submission.

## Logic and Interaction Model

Specify how components interact through:

- Show/hide conditions.
- Require/unrequire conditions.
- Skip logic and branching.
- Page jumps.
- Ending selection.
- Calculations.
- Scores and quiz outcomes.
- Dynamic default values.
- Dynamic option filtering.
- Piping/recalling previous answers into text.
- URL parameter prefill.
- External data lookup.
- Webhooks and integration triggers.
- Partial submissions and autosave.

Define a recommended rule model, such as:

- Trigger source: field, page, calculation, URL parameter, submission metadata.
- Operator: equals, not equals, contains, does not contain, selected, not selected, greater than, less than, between, empty, not empty, matches regex.
- Action: show, hide, require, skip to page, end form, set value, calculate value, filter options, send notification, trigger webhook, assign score.
- Conflict resolution: priority, order, first-match, all-match, fallback.

## Builder UX Requirements

Describe the builder layout:

- Left component palette.
- Central canvas.
- Right inspector panel.
- Preview mode.
- Logic map.
- Theme panel.
- Settings panel.
- Publish/share panel.
- Results/analytics panel.

When a user selects a field on the canvas:

- The right inspector should switch to that component's settings.
- The selected field should show handles/actions for duplicate, delete, move, hide, required, logic, and more options.
- The inspector should show only relevant options by default, with advanced settings grouped/collapsed.
- Invalid configuration should be visible before publishing.
- Changes should update live preview.
- Keyboard interactions should support selecting, moving, duplicating, deleting, undo/redo, and opening settings.

Specify exact inspector tabs or groups, for example:

- Content
- Choices
- Validation
- Logic
- Appearance
- Data
- Advanced

## Data Schema Requirements

Design a component schema that supports:

- Stable IDs.
- Component type.
- Versioning/migrations.
- Label and rich content.
- Field key/internal name.
- Settings object.
- Validation object.
- Logic object or references to global logic rules.
- Layout metadata.
- Data mapping.
- Localization records.
- Accessibility metadata.
- Analytics metadata.
- Integration metadata.

Also define a response schema that supports:

- Raw value.
- Display value.
- Normalized value.
- Validation status.
- Field metadata snapshot at submission time.
- File/payment/signature references.
- Partial submission state.
- Submitter metadata.

## MVP Prioritization

Create three phases:

### Phase 1: Complete Credible MVP

Must include enough components to compete with a basic modern form builder:

- Short text
- Long text
- Email
- Phone
- URL
- Number
- Single choice
- Multiple choice
- Dropdown
- Checkbox/consent
- Date
- Time
- File upload
- Rating/linear scale
- Hidden field
- Heading
- Paragraph
- Image
- Divider
- Page/section
- Thank-you ending
- Required/hidden/default/placeholder/help text
- Basic validation
- Basic conditional visibility
- Basic branching
- Basic theming
- Submission storage/export

### Phase 2: Advanced Builder

Should include:

- Matrix/grid
- Ranking
- NPS/CSAT
- Date range
- Multi-select
- Image choice
- Signature
- Payment
- Calculations/scores
- URL prefill
- Custom values
- Dynamic option filtering
- Partial submissions
- Webhooks
- Integrations
- Response copy
- Redirects
- Multi-ending logic

### Phase 3: Differentiators / Enterprise / Plugins

Consider:

- Voice/video response
- AI clarification questions
- Data lookup/record picker
- Subforms/repeating groups
- Table input
- CAPTCHA
- PDF viewer
- HTML/custom embed
- Advanced analytics
- A/B tests
- Click map/image heatmap
- Approval workflows
- Audit logs
- Role-based collaboration
- HIPAA/GDPR/data residency controls

Revise these phases based on the local architecture document and competitor research.

## Quality Bar

The final document must be concrete, not generic. Avoid saying "add validation options" without specifying exactly which validation options apply. Avoid saying "support logic" without defining triggers, operators, actions, and conflicts.

Every major component must include:

- Builder options.
- Runtime behavior.
- Data shape.
- Validation behavior.
- Logic behavior.
- Accessibility behavior.
- Localization behavior.
- Reporting behavior.
- MVP priority.

If a component is too complex for core MVP, explain why and recommend whether it belongs in Phase 2, Phase 3, enterprise, or plugin architecture.

## Sources to Consider from Initial Web Check

Use these as starting points, then verify current details:

- Typeform question types: https://help.typeform.com/hc/en-us/articles/360051789692-question-types
- Fillout field types: https://www.fillout.com/help/question-types
- Tally input blocks: https://tally.so/help/input-blocks
- Google Forms question types: https://support.google.com/docs/answer/7322334?hl=en
- SurveyMonkey question types and page elements: https://help.surveymonkey.com/en/surveymonkey/create/question-types/
- Formstack field options: https://help.formstack.com/hc/en-us/articles/44592314376851-Field-Options
- Airtable form views: https://support.airtable.com/docs/getting-started-with-airtable-form-views

## Final Deliverable

Return a single polished markdown document titled:

`Complete Form Builder Component and Interaction Specification`

It must be written as a practical product and engineering specification, not as a blog post. Include tables where helpful. Include source links. Make assumptions explicit. End with a concise list of decisions the product owner must approve before implementation.
