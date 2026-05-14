# Complete Form Builder Component and Interaction Specification

Research date: 2026-05-14

## 1. Executive Summary

This specification defines the field catalog, builder inspector behavior, respondent runtime behavior, logic model, validation model, schema requirements, accessibility expectations, localization rules, analytics implications, integration boundaries, and MVP phasing for the backend-agnostic React form builder.

The product should not copy one competitor. It should combine:

- Tally-like speed for creating simple forms.
- Typeform-like respondent polish and future conversational mode.
- Jotform-like practical breadth without importing its all-in-one complexity into MVP.
- Fillout-like data-connected workflows through adapters, not backend assumptions.
- Cognito-like seriousness about calculations and repeaters, but only after deterministic contracts exist.
- SurveyMonkey-like analytics and survey field awareness.
- Airtable-like data mapping discipline for database-backed forms.

The architecture documents remain the source of truth: use a custom canonical schema for authoring and rendering; generate JSON Schema only as an optional artifact; keep `forms-core` framework-agnostic; keep React renderer and builder in separate packages; store and submit normalized JSON; treat published revisions as immutable; reject executable JavaScript in persisted schema.

Recommended product posture:

- Build a credible MVP with essential fields, structural blocks, normalized submissions, basic validation, simple conditional visibility, basic branching, and a real builder inspector.
- Treat uploads as an MVP field only if implemented as a host-managed upload lifecycle with trusted backend file IDs and strict metadata semantics.
- Keep payments, signatures, matrices, ranking, calculations, repeaters, dynamic lookup, and rich workflow features out of core MVP unless their contracts are explicitly specified first.

## 2. Product Scope and Assumptions

### Source Documents Inspected

- `2026-05-14-react-form-builder-architecture-design.md`
- `AGENTS.md`
- `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
- `openspec/config.yaml`

No OpenSpec change files exist yet under `openspec/`.

### Durable Architecture Decisions

- Canonical product schema is the source of truth.
- JSON Schema generation is optional and does not represent UI behavior, conditional logic, upload lifecycle, custom rendering, or builder metadata unless explicitly supported by a compiler rule.
- `id` and `name` are separate: `id` is internal stable identity; `name` is the submitted data path and is a breaking contract when changed.
- Published revisions are immutable and submissions must include `revisionId`, `revisionHash`, `schemaVersion`, and an idempotency key.
- Unknown custom fields, validators, and predicates fail closed.
- Hidden field semantics must be explicit. Recommended default: exclude conditionally hidden values from final submission unless the schema opts into preserving them.
- Dangerous keys such as `__proto__`, `constructor`, and `prototype` are rejected in schemas, submissions, defaults, props, metadata, and backend responses.
- React Hook Form, if used, must stay behind this product's renderer API.

### Product Positioning

The product is a package-first React/Next.js form builder and renderer for teams that need:

- Backend-agnostic JSON contracts.
- Strong TypeScript and schema discipline.
- Headless design-system integration.
- First-class multilingual, RTL/LTR, and locale behavior.
- Builder UI that can be embedded into a host app.
- Public renderer that can be themed or replaced through slots and registries.

### Assumptions

- The initial buyer is a product or engineering team embedding form-building into its own SaaS/admin product, not a hosted no-code SaaS customer.
- The default builder should use a left palette, central canvas, right inspector, preview mode, logic view, settings, publish/share, and results surfaces.
- The MVP can include user-facing components that are common in competitors, but engineering should only implement behavior whose schema, validation, migration, and submission contracts are specified.

## 3. Competitor Component Inventory

Legend: Yes = clearly supported in official docs reviewed; Partial = supported with narrower behavior or via workaround; Plugin = better treated as integration/widget; Later = not MVP for our product.

| Component/category | Typeform | Jotform | Fillout | Tally | Google Forms | SurveyMonkey | Formstack | Airtable Forms | Other relevant competitors | Recommendation | MVP priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Short/long text | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Table-backed | Paperform, Cognito | Core | Must-have |
| Number/currency/percent | Number limited in Typeform; Yes elsewhere | Yes | Yes | Yes | Validation via short answer | Yes | Yes | Table-backed | Cognito strong | Core number; currency later unless normalized | Must-have number; currency Phase 2 |
| Email/phone/URL | Yes | Yes | Yes | Yes | Email via validation/settings | Yes | Yes | Table-backed | Paperform, Cognito | Core | Must-have |
| Single/multiple choice | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Single/multi select | Paperform | Core | Must-have |
| Dropdown/multiselect | Yes | Yes | Yes | Yes | Dropdown only | Yes | Yes | Select fields | Paperform | Core dropdown; multiselect Phase 2 | Must-have dropdown |
| Consent checkbox | Yes | Yes | Yes | Yes | Partial via checkbox | Partial | Yes | Checkbox | Paperform | Core as single checkbox | Must-have |
| Date/time | Date; scheduling integrations | Yes | Yes | Yes | Yes | Yes | Yes | Date/time fields | Paperform, Cognito | Core date/time | Must-have |
| File upload | Yes paid | Yes | Yes | Yes | Yes with Google sign-in/Drive | Yes | Yes | Attachment | Paperform, Cognito | Core value contract; provider orchestration plugin | Must-have if host-managed |
| Rating/scale/NPS | Opinion scale, rating, NPS | Yes | Yes | Yes | Linear/rating | Strong | Rating | Limited by fields | Paperform | Rating/linear core; NPS Phase 2 | Must-have rating |
| Matrix/grid | Matrix | Yes | Choice matrix | Matrix | Multiple choice/checkbox grid | Strong | Table-like | No classic matrix | Paperform | Phase 2 survey component | Later |
| Ranking | Yes | Yes | Yes | Yes | No | Yes | Partial | No | Paperform | Phase 2 | Later |
| Hidden/URL params | URL parameters | Yes | Yes | Yes | Limited prefill | Custom variables/options | Hidden | Prefill/hide URL | Paperform | Core hidden field with trust warnings | Must-have |
| Sections/pages/endings | Yes | Yes | Yes | Yes | Sections | Pages/intro | Sections/pages | No pagination | Cognito | Core structural nodes | Must-have |
| Calculations/scores | Variables/logic | Widget | Yes | Yes | Quiz scoring | Quiz/NPS | Yes | Formula fields table-side | Cognito, Paperform | Deterministic expression model; Phase 2 | Later |
| Signature | No native core in Typeform docs reviewed | Yes | Yes | Yes | No | No core survey | Yes | Attachment workaround | Paperform, Cognito | Plugin/Phase 2 | Later |
| Payment/product/order | Yes | Strong | Yes | Yes | No | Payments option | Payment/workflows | No | Paperform, Cognito | Plugin/Phase 2 | Later |
| Repeaters/subforms/tables | Limited | Widgets | Subforms/table | Partial | No | Multiple textboxes/grid | Tables | Records only | Cognito strong | Phase 3 unless semantics fully specified | Later |
| Dynamic data/record picker | Integrations | Widgets/integrations | Strong | Limited | No | Integrations | Salesforce rules | Native table | Fillout/Airtable/HubSpot | Adapter/plugin | Phase 3 |
| CAPTCHA/bot protection | Integrations | Yes | Yes | reCAPTCHA | Google account limits | Enterprise options | Yes | Access controls | Turnstile/reCAPTCHA | Extension point | Phase 2 |
| AI follow-up/video/voice/click maps/A-B tests | Typeform AI/video | Widgets | Voice | Limited | No | Strong survey features | Enterprise | No | SurveyMonkey | Enterprise/plugin | Phase 3 |

## 4. Recommended Component Taxonomy

### Core MVP Components

Basic input fields:

- Short text
- Long text
- Number
- Email
- Phone
- URL
- Hidden field
- Read-only/display value

Choice fields:

- Single choice/radio group
- Multiple choice/checkbox group
- Dropdown
- Single checkbox/consent
- Boolean switch

Date, time, and survey basics:

- Date
- Time
- Rating
- Linear/opinion scale

Content and layout:

- Heading
- Paragraph/plain text block
- Image
- Divider
- Section
- Page/step
- Welcome screen
- Ending/thank-you screen

System:

- Submit button configuration
- Basic progress indicator
- URL parameter capture

Conditional MVP:

- Show/hide conditions
- Conditional requiredness if the validation contract is specified
- Page/step branching with deterministic conflict rules

### Phase 2 Components

- Multi-select dropdown
- Image choice
- Matrix/grid and Likert matrix
- Ranking
- NPS, CSAT, CES
- Date range and date-time
- File upload orchestration adapters
- Signature
- Payment/product/order item
- Calculation and score fields
- URL prefill UI
- Dynamic option filtering
- CAPTCHA
- Webhooks and response copy
- Redirects and multiple endings

### Phase 3 / Enterprise / Plugin Components

- Repeaters/subforms/table input
- Voice response
- Video response
- AI clarification questions
- Data lookup/record picker
- Submission picker/edit existing response
- PDF viewer
- HTML/custom embed
- Advanced analytics, A/B tests, click maps
- Approval workflows, audit logs, role-based collaboration
- HIPAA/GDPR/data residency controls

## 5. Global Builder Concepts

The builder should expose product concepts without leaking schema jargon to normal creators.

Core surfaces:

- Left palette: searchable component library grouped by Input, Choice, Date/Time, Rating, Content/Layout, Logic/System, Advanced.
- Central canvas: ordered form structure with selected node outline, drag handles, duplicate/delete/move/hide/required quick actions, and inline label editing.
- Right inspector: context-specific settings for the selected node.
- Preview mode: uses the real renderer and field registry.
- Logic map: shows dependencies, branch destinations, hidden fields, calculated values, and cycle/unsupported diagnostics.
- Theme panel: tokens, density, width, button style, error style, direction, and responsive layout settings.
- Settings panel: form title, locale, direction, submission mode, validation timing, hidden-value policy, response settings, bot protection extension, and publish rules.
- Publish/share panel: draft validation, revision diff warnings, immutable revision creation, embed/install instructions, and generated artifacts.
- Results/analytics panel: submissions table, CSV/JSON export, field summaries, drop-off, and field-level analytics.

Builder principles:

- Every persisted setting must be JSON-serializable.
- All schema edits should be validated immediately and before publish.
- Changing `name`, option values, scalar/array shape, hidden semantics, or upload semantics should produce migration warnings.
- Advanced panels should be collapsed by default for simple forms.
- The canvas should support keyboard selection, duplicate, delete, move, undo, redo, and inspector focus.

## 6. Universal Field Settings

Universal settings for most field nodes:

| Setting | Scope | Notes |
| --- | --- | --- |
| Label/question text | Universal | Required accessible name unless explicitly display-only with alternate accessible label. |
| Internal submitted path/name | Input fields | Must match formal submitted path grammar and reject dangerous keys. |
| Stable node id | Universal | Generated by builder; not user-facing by default. |
| Description/help text | Universal | Plain text by default; rich text only if sanitized feature is enabled. |
| Placeholder | Text-like inputs | Never a replacement for label. |
| Default value | Input fields | Must match field value type; may be static or later dynamic. |
| Required | Input fields | Can be unconditional or conditional once specified. |
| Hidden | Universal | Hidden nodes are not rendered; final value behavior follows form policy. |
| Read-only | Input fields | Displayed but not editable; may still submit if configured. |
| Disabled | Input fields | Visible but not interactive; default should exclude from validation unless configured. |
| Hide label | Visual option | Must preserve accessible label. |
| Width/layout size | Universal | One-column default; multi-column only through explicit layout rules. |
| Validation rules | Input fields | Field-specific rule list with custom error overrides. |
| Conditional visibility | Universal | Declarative condition model; no arbitrary JS. |
| Conditional requiredness | Input fields | Phase 1 only if deterministic with hidden-value semantics. |
| Logic jumps/branching | Page/choice/rating mostly | Global rule list preferred over per-field hidden magic. |
| Data mapping key | Input fields | Maps submitted path to integration/backend field. |
| Analytics name/category | Universal | Defaults from label/name; stable across label changes when possible. |
| Accessibility label override | Universal | Advanced-only; required when visual label hidden or content block interactive. |
| Autofill/autocomplete hint | Text/contact fields | Use HTML autocomplete tokens where applicable. |
| Sensitive data/PII flag | Input fields | Affects masking, retention, export, logging, analytics exclusion. |
| Localization overrides | Universal | Per-locale labels, help, option labels, errors, placeholders. |
| Admin notes | Universal | Builder-only metadata excluded from respondent runtime unless requested. |

Advanced-only settings:

- Conditional default values.
- Conditional option filtering.
- Integration mapping.
- Retention/export behavior.
- Custom validator/predicate keys and versions.
- Backend parity requirement.
- Field-level analytics suppression.

## 7. Component-by-Component Specification

### Short Text

**Purpose:** Collect one-line text such as names, IDs, titles, small notes, codes, and short free-form answers.

**Respondent Runtime:** Single-line input with label, optional description, placeholder, character counter when limits exist, and inline error messages.

**Builder Selection Behavior:** Selecting the field opens Content, Validation, Logic, Appearance, Data, and Advanced inspector groups. Canvas supports inline label edit and quick required/hide toggles.

**Inspector Panels and Options:**

- Content settings: label, submitted path, description, placeholder, default value, autocomplete, input mode.
- Options/choices settings: not applicable.
- Validation settings: required, min characters, max characters, exact length, regex, allowed values, disallowed values, trim whitespace, case transform, custom named validator, custom error messages.
- Logic settings: visibility, conditional requiredness, branching trigger, use in calculations/piping.
- Appearance/layout settings: width, hide label, prefix/suffix text, character counter visibility.
- Data/integration settings: backend mapping key, analytics name, PII/sensitive flag, retention/export policy.
- Advanced settings: unique check adapter, normalization mode, locale override.

**Default Configuration:** Label `Short answer`, generated `name`, empty string default, no validation.

**Data Shape:** `string`; empty value is `""` in runtime and omitted or `null` in final submission according to normalization policy. Exports as text.

**Validation Rules:** Required, length, regex with restricted compatible features, allowed/disallowed values, custom validator. Unique requires backend adapter and async validation, so not core MVP.

**Conditional Logic Interactions:** Can trigger conditions through equals, not equals, contains, empty, not empty, regex match, and changed. Can be hidden/required by conditions. Can be piped into later text.

**Accessibility Requirements:** `<label>` or equivalent accessible name, `aria-describedby` for help/error/counter, `aria-invalid` on error, focus moves to field from error summary.

**Localization Requirements:** Translated label/help/placeholder/errors; case transforms must be locale-aware or disabled by default.

**Mobile Behavior:** Appropriate keyboard via input mode; no viewport zoom from small font sizes.

**Analytics/Reporting:** Text responses are searchable and exportable; not charted by default except top repeated values.

**Edge Cases:** Whitespace-only values, Unicode length vs grapheme length, forbidden keys in `name`, regex portability, accidental PII in analytics.

**MVP Priority:** Must-have.

**Competitor References:** Typeform short text and character limits; Google short answer validation; Formstack field options.

### Long Text

**Purpose:** Collect paragraphs, explanations, comments, and open-ended feedback.

**Respondent Runtime:** Multi-line textarea with optional auto-grow, row height, counter, and help text.

**Builder Selection Behavior:** Inspector emphasizes text length, word count, rows, and content safety.

**Inspector Panels and Options:**

- Content settings: label, name, description, placeholder, default value.
- Options/choices settings: not applicable.
- Validation settings: required, min/max characters, min/max words, regex, profanity/content policy via custom validator.
- Logic settings: visibility, requiredness, piping source.
- Appearance/layout settings: rows, auto-grow, width, counter.
- Data/integration settings: PII flag, analytics exclusion, export wrapping.
- Advanced settings: plain text only; markdown/rich text postponed until sanitization is specified.

**Default Configuration:** Label `Long answer`, generated `name`, empty string default, 4 rows.

**Data Shape:** `string`; export as text with line breaks preserved.

**Validation Rules:** Required, character count, word count, regex, custom named validator.

**Conditional Logic Interactions:** Usable in empty/not empty, contains, regex, and custom predicates. Avoid using long text as a primary branching source in MVP.

**Accessibility Requirements:** Label, help, error linkage; textarea resize must not trap focus.

**Localization Requirements:** Word count must handle non-space-delimited languages carefully; RTL text direction can inherit from form or be auto/manual.

**Mobile Behavior:** Auto-grow with max height to avoid runaway scrolling.

**Analytics/Reporting:** Searchable and exportable; sentiment/AI summaries are Phase 3.

**Edge Cases:** Very long inputs, pasted rich text, newline normalization, sensitive data leakage.

**MVP Priority:** Must-have.

**Competitor References:** Typeform long text; Google paragraph; SurveyMonkey comment box.

### Number

**Purpose:** Collect numeric quantities, ages, counts, measurements, and other scalar numbers.

**Respondent Runtime:** Numeric input with locale-aware display, optional prefix/suffix, min/max/step hints, and invalid input handling.

**Builder Selection Behavior:** Inspector shows number type, precision, bounds, unit, and calculation participation.

**Inspector Panels and Options:**

- Content settings: label, name, description, placeholder, default value, unit suffix/prefix.
- Options/choices settings: not applicable.
- Validation settings: required, integer/decimal, min, max, step, precision, allow negative, disallow zero.
- Logic settings: comparisons, ranges, calculation source.
- Appearance/layout settings: width, alignment, separators, spinner visibility.
- Data/integration settings: numeric export type, unit metadata.
- Advanced settings: currency/percent display should be separate field modes or Phase 2.

**Default Configuration:** Label `Number`, generated `name`, `null` default, decimal allowed false unless configured.

**Data Shape:** JSON number or `null`; empty value is `null`. Export as numeric cell when possible.

**Validation Rules:** Required, integer, min/max, range, step, precision, custom named validator.

**Conditional Logic Interactions:** Supports `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, empty, not empty.

**Accessibility Requirements:** Do not rely only on browser spinner; errors explain valid range and format.

**Localization Requirements:** Locale parsing/display for decimal and group separators; submitted value remains JSON number.

**Mobile Behavior:** Numeric keyboard; preserve invalid typed state until blur/submit rather than destroying user input.

**Analytics/Reporting:** Aggregate min, max, average, median, histogram.

**Edge Cases:** Floating precision, scientific notation, huge numbers, currency confusion, locale comma decimal.

**MVP Priority:** Must-have.

**Competitor References:** Google validation; Formstack number format/currency/min/max; Paperform number.

### Email

**Purpose:** Collect email addresses for contact, receipts, identity, and integration mapping.

**Respondent Runtime:** Email input with autocomplete, format validation, optional confirmation field pattern.

**Builder Selection Behavior:** Inspector emphasizes format validation, normalization, verification, CRM mapping, and sensitivity.

**Inspector Panels and Options:**

- Content settings: label, name, help, placeholder, default.
- Options/choices settings: not applicable.
- Validation settings: required, email format, block disposable email via custom validator, allowed domains, disallowed domains, confirmation match, unique adapter.
- Logic settings: visibility, requiredness, branching by domain through custom predicate.
- Appearance/layout settings: width.
- Data/integration settings: CRM/email mapping, PII flag, response copy source.
- Advanced settings: lowercasing, trim, DNS/MX or OTP verification through adapter.

**Default Configuration:** Label `Email`, generated `name` like `email`, trim and lowercase enabled by default.

**Data Shape:** `string`; empty as `""`/omitted by normalization. Export as text.

**Validation Rules:** Required, format, domain allow/block, custom validator, optional backend uniqueness.

**Conditional Logic Interactions:** Empty/not empty, domain-based custom predicate, use for response copy or identity metadata if configured.

**Accessibility Requirements:** Proper label, `autocomplete="email"`, clear error text.

**Localization Requirements:** Error messages translated; IDN domains must be normalized consistently.

**Mobile Behavior:** Email keyboard.

**Analytics/Reporting:** Excluded from aggregate analytics by default due to PII.

**Edge Cases:** Plus addressing, uppercase, IDN/punycode, disposable domains, privacy policies.

**MVP Priority:** Must-have.

**Competitor References:** Typeform built-in email validation; Google email validation; SurveyMonkey email field.

### Phone

**Purpose:** Collect telephone numbers for contact, SMS, WhatsApp, and identity workflows.

**Respondent Runtime:** Phone input with optional country selector and extension field.

**Builder Selection Behavior:** Inspector shows default country, accepted countries, format, and verification adapter.

**Inspector Panels and Options:**

- Content settings: label, name, description, placeholder, default country.
- Options/choices settings: country list and allowed countries.
- Validation settings: required, national/international format, extension allowed, custom validator.
- Logic settings: country or empty/not empty conditions.
- Appearance/layout settings: country selector style, width.
- Data/integration settings: E.164 normalized value, SMS/WhatsApp mapping, PII.
- Advanced settings: OTP verification adapter.

**Default Configuration:** Label `Phone`, E.164 normalization when country is known.

**Data Shape:** Recommended `{ "raw": "...", "country": "US", "e164": "+15551234567", "extension": null }` or simpler `string` in MVP if compound values are postponed. Pick one before implementation.

**Validation Rules:** Required, format, allowed country, custom backend parity validator.

**Conditional Logic Interactions:** Empty/not empty, country equals, verified status if adapter exists.

**Accessibility Requirements:** Country selector and number input must have separate labels or combined accessible description.

**Localization Requirements:** Default country may follow locale; formatting must not alter submitted canonical value.

**Mobile Behavior:** Telephone keyboard; country selector usable by search.

**Analytics/Reporting:** PII; exclude from charts by default.

**Edge Cases:** Extensions, country ambiguity, leading zeros, SMS-capable vs landline.

**MVP Priority:** Must-have, but use a conservative string contract if compound phone is not specified.

**Competitor References:** Typeform phone validation; SurveyMonkey phone with extensions; Paperform phone formatting.

### URL

**Purpose:** Collect websites, profile links, documents, and reference URLs.

**Respondent Runtime:** URL input with optional protocol normalization.

**Builder Selection Behavior:** Inspector surfaces protocol behavior and domain allow/block rules.

**Inspector Panels and Options:** Content, validation, logic, appearance, data, advanced groups with URL-specific protocol handling, allowed domains, disallowed domains, social presets, and normalization.

**Default Configuration:** Label `Website`, generated `name`, allow `https://` and `http://`, normalize missing protocol to `https://` only if enabled.

**Data Shape:** `string`; export as URL text.

**Validation Rules:** Required, URL format, protocol allowlist, domain allow/block, custom validator.

**Conditional Logic Interactions:** Empty/not empty, domain custom predicate.

**Accessibility Requirements:** Label and clear protocol error.

**Localization Requirements:** Translated errors; IDN domain normalization.

**Mobile Behavior:** URL keyboard.

**Analytics/Reporting:** Search/export only.

**Edge Cases:** Missing protocol, internal URLs, malicious URLs, URL length, privacy.

**MVP Priority:** Must-have.

**Competitor References:** Typeform website validation; Paperform URL; Google text validation.

### Single Choice / Radio Group

**Purpose:** Let respondents choose one option from a controlled list.

**Respondent Runtime:** Radio list, segmented choice, cards, or select-style display depending on option count and appearance.

**Builder Selection Behavior:** Inspector opens Choices panel by default with option editing.

**Inspector Panels and Options:**

- Content settings: label, name, description.
- Options/choices settings: option label, stable option id, submitted value, description, image, default selected, bulk paste/import, reorder, duplicate, disable/hide option, "Other" option, randomize, alphabetical sort.
- Validation settings: required, allowed option values.
- Logic settings: branch by option, conditional visibility, scoring, option filtering.
- Appearance/layout settings: list/card/button style, columns, image size.
- Data/integration settings: custom values, integration mapping.
- Advanced settings: exclusive values, pipe selected label/value.

**Default Configuration:** Three blank options, no default, required off.

**Data Shape:** Submitted option `value` as `string`; display label snapshot stored in submission metadata if reporting needs historical labels.

**Validation Rules:** Required; selected value must exist and be enabled unless historical submission.

**Conditional Logic Interactions:** Primary branching source; supports selected/is one of/is not one of.

**Accessibility Requirements:** Native radio semantics or ARIA radiogroup; arrow key behavior; option descriptions linked.

**Localization Requirements:** Option labels translated; option `value` stable and not translated.

**Mobile Behavior:** Large touch targets; convert dense layouts to single column.

**Analytics/Reporting:** Counts, percentages, bar/pie charts; export label and value when configured.

**Edge Cases:** Duplicate values, label changes, randomization with logic, deleted options with old submissions.

**MVP Priority:** Must-have.

**Competitor References:** Google multiple choice; SurveyMonkey multiple choice; Fillout custom values.

### Multiple Choice / Checkbox Group

**Purpose:** Let respondents select zero, one, or many options from a list.

**Respondent Runtime:** Checkbox list with optional min/max selection counter and exclusive options.

**Builder Selection Behavior:** Same as single choice plus min/max and exclusivity controls.

**Inspector Panels and Options:** Same as single choice, plus min selections, max selections, exact selections, none-of-the-above exclusive option, select all, per-option score/price metadata.

**Default Configuration:** Three blank options, no default, min/max unset.

**Data Shape:** `string[]` of selected option values. Empty is `[]`.

**Validation Rules:** Required means at least one unless min configured; min/max/exact selections; allowed options.

**Conditional Logic Interactions:** Contains, does not contain, contains any/all, count comparisons.

**Accessibility Requirements:** Fieldset/legend or equivalent group labeling; individual checkbox labels.

**Localization Requirements:** Stable values; translated labels.

**Mobile Behavior:** Single column for long options.

**Analytics/Reporting:** Per-option counts; total selections may exceed response count.

**Edge Cases:** Exclusive options with other selected values, max count after hidden option, option value migration.

**MVP Priority:** Must-have.

**Competitor References:** Google checkboxes; SurveyMonkey checkboxes; Fillout custom values.

### Dropdown

**Purpose:** Compact single selection, especially for long lists.

**Respondent Runtime:** Native select or accessible combobox, optionally searchable for long lists.

**Builder Selection Behavior:** Choices panel plus long-list warnings.

**Inspector Panels and Options:** Option list, placeholder, default option, clearability, searchability, option groups, custom values, dynamic options later.

**Default Configuration:** Placeholder `Select one`, three options.

**Data Shape:** `string` selected value or `null`.

**Validation Rules:** Required, allowed option.

**Conditional Logic Interactions:** Same as single choice.

**Accessibility Requirements:** Prefer native select for MVP; custom combobox must fully implement keyboard and screen reader behavior.

**Localization Requirements:** Translated labels; stable values.

**Mobile Behavior:** Native picker acceptable; searchable custom picker for large lists later.

**Analytics/Reporting:** Same as single choice.

**Edge Cases:** Huge lists, async options, option removed after default selected.

**MVP Priority:** Must-have.

**Competitor References:** Google dropdown; SurveyMonkey dropdown; Fillout dropdown/custom values.

### Multi-Select Dropdown

**Purpose:** Compact multiple selection for long lists.

**Respondent Runtime:** Searchable multi-select with chips or checklist popover.

**Builder Selection Behavior:** Warns when selected as MVP-disabled unless Phase 2 enabled.

**Inspector Panels and Options:** Same as dropdown plus min/max, clear all, option grouping, async source adapter.

**Default Configuration:** Placeholder `Select one or more`, no defaults.

**Data Shape:** `string[]`.

**Validation Rules:** Min/max/exact selection and allowed values.

**Conditional Logic Interactions:** Same as checkbox group.

**Accessibility Requirements:** Custom combobox complexity; must be audited before release.

**Localization Requirements:** Chip labels translated; values stable.

**Mobile Behavior:** Full-screen picker recommended.

**Analytics/Reporting:** Same as checkbox group.

**Edge Cases:** Keyboard complexity, huge async lists, duplicate labels.

**MVP Priority:** Phase 2.

**Competitor References:** Tally, Fillout, Paperform.

### Single Checkbox / Consent

**Purpose:** Capture consent, agreement, acknowledgement, or boolean confirmation.

**Respondent Runtime:** One checkbox with required agreement support and optional legal text.

**Builder Selection Behavior:** Content panel emphasizes checkbox label and consent copy.

**Inspector Panels and Options:** Label, checkbox text, required must be checked, description/terms, default checked, submitted boolean value, audit metadata flag.

**Default Configuration:** Unchecked, required off.

**Data Shape:** `boolean`; empty/default false unless omitted by normalization policy.

**Validation Rules:** Required means value must be true.

**Conditional Logic Interactions:** True/false, checked/unchecked.

**Accessibility Requirements:** Label must describe what is being agreed to; links in text must be keyboard accessible.

**Localization Requirements:** Translate legal text carefully; preserve versioned consent content snapshot.

**Mobile Behavior:** Large target.

**Analytics/Reporting:** True/false counts; consent snapshot retained.

**Edge Cases:** Default checked may be illegal in some jurisdictions; legal copy changes across revisions.

**MVP Priority:** Must-have.

**Competitor References:** Typeform checkbox/legal-style usage; Google checkbox; Formstack required fields.

### Boolean Switch

**Purpose:** Capture an on/off preference where switch semantics are clearer than checkbox.

**Respondent Runtime:** Toggle switch with visible on/off labels.

**Builder Selection Behavior:** Similar to consent but non-legal.

**Inspector Panels and Options:** Label, on label, off label, default, required? usually not, data mapping.

**Default Configuration:** False.

**Data Shape:** `boolean`.

**Validation Rules:** Optional required true if explicitly configured.

**Conditional Logic Interactions:** True/false.

**Accessibility Requirements:** Use native checkbox or ARIA switch with correct name/role/value.

**Localization Requirements:** Translate on/off labels.

**Mobile Behavior:** Touch target large enough.

**Analytics/Reporting:** True/false counts.

**Edge Cases:** Switch implies immediate state; in forms it still submits with form.

**MVP Priority:** Should-have.

**Competitor References:** SurveyMonkey/GetFeedback toggle patterns; general builder convention.

### Date

**Purpose:** Collect a calendar date without time.

**Respondent Runtime:** Date input or accessible date picker with typed fallback.

**Builder Selection Behavior:** Inspector shows date format, constraints, relative rules, and timezone caveats.

**Inspector Panels and Options:** Label, name, placeholder, default date, min/max absolute date, min/max relative date, allowed weekdays, blocked dates later, include year, display format.

**Default Configuration:** No default, Gregorian ISO submitted value.

**Data Shape:** `YYYY-MM-DD` string; empty `null`.

**Validation Rules:** Required, min, max, allowed weekdays, custom predicate.

**Conditional Logic Interactions:** Before/after/on/between, empty/not empty, age/duration only through Phase 2 calculation helpers.

**Accessibility Requirements:** Date picker must be keyboard usable; typed entry must be possible.

**Localization Requirements:** Display localized; submit ISO. Jalali display needs explicit calendar support and canonical Gregorian/ISO mapping decision.

**Mobile Behavior:** Native date picker acceptable where available.

**Analytics/Reporting:** Timeline, grouping by day/month/year.

**Edge Cases:** Timezone off-by-one, locale calendars, impossible dates.

**MVP Priority:** Must-have.

**Competitor References:** Google date; Typeform date formats; Paperform date.

### Time

**Purpose:** Collect a time of day or duration.

**Respondent Runtime:** Time input with optional 12/24-hour display.

**Builder Selection Behavior:** Inspector distinguishes time-of-day from duration.

**Inspector Panels and Options:** Label, name, default, min/max time, step, display format, timezone relevance.

**Default Configuration:** Time-of-day mode, no default.

**Data Shape:** Time-of-day as `HH:mm` or `HH:mm:ss`; duration as ISO 8601 duration or structured `{ hours, minutes, seconds }`. Choose before implementation.

**Validation Rules:** Required, min, max, step.

**Conditional Logic Interactions:** Before/after/between.

**Accessibility Requirements:** Typed fallback and clear format help.

**Localization Requirements:** Display 12/24 per locale; submitted canonical value stable.

**Mobile Behavior:** Native time picker.

**Analytics/Reporting:** Distribution by hour.

**Edge Cases:** Timezone, daylight saving, duration confusion.

**MVP Priority:** Must-have if canonical value is specified.

**Competitor References:** Google time/duration; Fillout time picker; Paperform time.

### Date Range

**Purpose:** Collect start and end dates for travel, bookings, periods, and eligibility.

**Respondent Runtime:** Two coordinated date inputs or range picker.

**Builder Selection Behavior:** Inspector shows start/end names and constraints.

**Inspector Panels and Options:** Start/end labels and names, min/max, min/max duration, allow same day, blocked dates.

**Default Configuration:** Empty start/end.

**Data Shape:** `{ "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }`.

**Validation Rules:** Required both, end after/on start, duration bounds.

**Conditional Logic Interactions:** Date comparisons and duration calculations.

**Accessibility Requirements:** Two labeled inputs; errors specify start/end.

**Localization Requirements:** Display localized; submit ISO.

**Mobile Behavior:** Avoid cramped range calendars.

**Analytics/Reporting:** Range length summaries.

**Edge Cases:** Missing one side, timezone, inclusive/exclusive end.

**MVP Priority:** Phase 2.

**Competitor References:** Fillout date range; Paperform multiple date/date articles.

### Rating / Star Rating

**Purpose:** Collect quick satisfaction or quality scores.

**Respondent Runtime:** Select a value from icons or numeric buttons.

**Builder Selection Behavior:** Inspector shows scale length, icon style, labels, and scoring.

**Inspector Panels and Options:** Label, name, scale min/max, icon type, low/high labels, default, required, allow clear.

**Default Configuration:** 1-5 star rating, no default.

**Data Shape:** JSON number or `null`.

**Validation Rules:** Required; min/max inherent.

**Conditional Logic Interactions:** Numeric comparisons.

**Accessibility Requirements:** Radio group semantics; each option has clear accessible label.

**Localization Requirements:** Low/high labels translated.

**Mobile Behavior:** Large buttons.

**Analytics/Reporting:** Average, distribution, trend.

**Edge Cases:** Icon-only ambiguity, RTL visual order.

**MVP Priority:** Must-have.

**Competitor References:** Google rating; SurveyMonkey star rating; Fillout star rating.

### Linear / Opinion Scale

**Purpose:** Collect numeric attitude or likelihood on a scale.

**Respondent Runtime:** Horizontal or vertical scale of numeric choices with endpoint labels.

**Builder Selection Behavior:** Inspector shows min/max, labels, and NPS shortcut warning.

**Inspector Panels and Options:** Min, max, step, endpoint labels, display numeric labels, required.

**Default Configuration:** 1-5 scale.

**Data Shape:** JSON number.

**Validation Rules:** Required; value in scale.

**Conditional Logic Interactions:** Numeric comparisons and score participation.

**Accessibility Requirements:** Radio group; endpoint labels associated.

**Localization Requirements:** Translated endpoint labels; RTL order decision explicit.

**Mobile Behavior:** Wrap or vertical layout for small screens.

**Analytics/Reporting:** Average, distribution.

**Edge Cases:** Scale direction in RTL, changing max after submissions.

**MVP Priority:** Must-have.

**Competitor References:** Google linear scale; Typeform opinion scale; Paperform scale.

### NPS

**Purpose:** Measure likelihood to recommend on a standardized 0-10 scale.

**Respondent Runtime:** 0-10 buttons with detractor/passive/promoter semantics for reporting.

**Builder Selection Behavior:** Inspector locks scale by default and lets creator edit labels.

**Inspector Panels and Options:** Question text, low/high labels, required, follow-up prompt, reporting labels.

**Default Configuration:** 0-10 scale.

**Data Shape:** JSON number 0-10.

**Validation Rules:** Required; integer 0-10.

**Conditional Logic Interactions:** Branch by detractor/passive/promoter or numeric ranges.

**Accessibility Requirements:** Radio group with clear labels.

**Localization Requirements:** Translate labels; keep scoring semantics invariant.

**Mobile Behavior:** Responsive wrapped buttons.

**Analytics/Reporting:** NPS calculation and segments.

**Edge Cases:** Altering scale breaks NPS; use opinion scale if customized.

**MVP Priority:** Phase 2.

**Competitor References:** Typeform NPS; SurveyMonkey NPS auto-analysis.

### Matrix / Grid

**Purpose:** Collect repeated ratings or choices across rows and columns.

**Respondent Runtime:** Table on desktop; row-by-row cards on mobile.

**Builder Selection Behavior:** Inspector edits rows, columns, single/multiple per row, required per row.

**Inspector Panels and Options:** Row labels/values, column labels/values, single vs multiple, required rows, one choice per column, randomize rows/columns, scoring weights, mobile layout.

**Default Configuration:** Three rows, three columns, single per row.

**Data Shape:** Single: `{ [rowValue]: columnValue }`; multiple: `{ [rowValue]: string[] }`.

**Validation Rules:** Required rows, allowed columns, exclusivity.

**Conditional Logic Interactions:** Phase 2 only; can trigger by row value or aggregate score.

**Accessibility Requirements:** Native table semantics where possible; mobile transformation must preserve labels.

**Localization Requirements:** Row/column labels translated; values stable.

**Mobile Behavior:** Never force horizontal scrolling as only path.

**Analytics/Reporting:** Heatmap/table summaries.

**Edge Cases:** Large grids, screen reader complexity, randomization with logic.

**MVP Priority:** Phase 2.

**Competitor References:** Google grids; SurveyMonkey matrix; Fillout choice matrix; Paperform matrix.

### Ranking

**Purpose:** Ask respondents to order options by preference.

**Respondent Runtime:** Drag-and-drop with keyboard reorder controls and optional numeric dropdown fallback.

**Builder Selection Behavior:** Inspector edits options and ranking constraints.

**Inspector Panels and Options:** Options, required, rank all vs top N, randomize initial order, tie policy.

**Default Configuration:** Rank all options.

**Data Shape:** `string[]` ordered option values.

**Validation Rules:** Required, min ranked, max ranked, no duplicates.

**Conditional Logic Interactions:** Branch by first choice/top N in Phase 2.

**Accessibility Requirements:** Keyboard move up/down, announced position changes.

**Localization Requirements:** Option labels translated; values stable.

**Mobile Behavior:** Drag handles and move buttons.

**Analytics/Reporting:** Average rank, first-choice counts.

**Edge Cases:** Option deletion, randomization, long lists.

**MVP Priority:** Phase 2.

**Competitor References:** SurveyMonkey ranking; Fillout ranking; Paperform rank.

### File Upload

**Purpose:** Attach files such as resumes, images, documents, and evidence.

**Respondent Runtime:** File picker/dropzone with allowed type/count/size hints, upload progress, replace/remove controls, and error recovery.

**Builder Selection Behavior:** Inspector must show security and lifecycle warnings.

**Inspector Panels and Options:** Label, name, accepted MIME/extensions, max file size, max count, image-only mode, required, preview, replace policy, retention, private/public access hint, upload adapter key.

**Default Configuration:** Metadata-only host-managed upload, one file, no public URL assumption.

**Data Shape:** Final submission contains trusted references, not raw binaries:

```json
{
  "field": "resume",
  "files": [
    {
      "fileId": "file_123",
      "name": "resume.pdf",
      "mimeType": "application/pdf",
      "size": 48122,
      "status": "accepted"
    }
  ]
}
```

Backend treats `fileId` as authority and resolves trusted metadata server-side.

**Validation Rules:** Required, count, allowed types, max size. Backend must enforce everything again.

**Conditional Logic Interactions:** Empty/not empty, file count, status accepted/rejected.

**Accessibility Requirements:** Keyboard accessible button/dropzone, progress announcements, clear error messages.

**Localization Requirements:** File size formatting and errors translated.

**Mobile Behavior:** Camera/gallery support only if configured; retry failed uploads.

**Analytics/Reporting:** Count and type summaries; secure download links through host backend.

**Edge Cases:** Orphaned uploads, virus scanning, rejected files, finalization, unauthorized reuse, privacy retention.

**MVP Priority:** Must-have only as contract plus host-managed adapter; provider orchestration Phase 2.

**Competitor References:** Google file upload limits and Drive storage; Formstack file upload limits/webhook transfer; Fillout file integrations.

### Signature

**Purpose:** Capture an electronic acknowledgement signature for waivers, approvals, and consent workflows.

**Respondent Runtime:** Draw/type/upload signature panel with clear action and consent text.

**Builder Selection Behavior:** Inspector surfaces legal and audit limitations.

**Inspector Panels and Options:** Draw/type/upload modes, required, consent statement, signer name/email mapping, timestamp/IP audit metadata, export image/PDF behavior.

**Default Configuration:** Draw mode, required true only if explicitly added.

**Data Shape:** File/reference object plus signer metadata.

**Validation Rules:** Required signature, signer field match if configured.

**Conditional Logic Interactions:** Empty/not empty; hidden signature should not block submission.

**Accessibility Requirements:** Non-draw alternative required for keyboard users.

**Localization Requirements:** Consent text translated and versioned.

**Mobile Behavior:** Touch drawing; clear and undo.

**Analytics/Reporting:** Not charted; export/audit artifact.

**Edge Cases:** Legal validity varies by jurisdiction, accessibility of canvas signature, PDF generation.

**MVP Priority:** Phase 2/plugin.

**Competitor References:** Formstack signatures; Paperform signature; Cognito signature.

### Payment / Product / Order Item

**Purpose:** Collect payment, donation, product, subscription, or order data.

**Respondent Runtime:** Product choices, amount summary, payment provider checkout, success/failure/cancel states.

**Builder Selection Behavior:** Inspector requires provider adapter and PCI boundary warning.

**Inspector Panels and Options:** Fixed/calculated amount, currency, product list, quantities, coupons, tax, provider, payment timing, receipt, refunds, webhook behavior.

**Default Configuration:** Disabled until provider adapter configured.

**Data Shape:** Submission stores payment intent/reference, amount, currency, line item snapshot, provider status.

**Validation Rules:** Required payment success if configured; amount nonnegative; currency allowed.

**Conditional Logic Interactions:** Amount can derive from choices/calculations in Phase 2; branch on payment status after provider callback.

**Accessibility Requirements:** Provider UI must meet accessibility; error/failure states announced.

**Localization Requirements:** Currency/number formatting; tax labels localized.

**Mobile Behavior:** Wallet/provider optimized flows.

**Analytics/Reporting:** Revenue, conversion, failed payments, refunds.

**Edge Cases:** PCI, double charges, idempotency, webhook race, refunds, abandoned payment.

**MVP Priority:** Phase 2/plugin.

**Competitor References:** Jotform payment integrations; Paperform price/product/subscription; SurveyMonkey payments.

### Hidden Field

**Purpose:** Capture URL parameters, UTM data, host-injected values, routing context, or server-provided defaults without showing the field to respondents.

**Respondent Runtime:** Not visible.

**Builder Selection Behavior:** Inspector emphasizes trust warning: hidden values are client-visible and client-editable unless server-injected and signed.

**Inspector Panels and Options:** Name, default/static value, URL parameter source, preserve/submit policy, PII flag, use in logic, integration mapping.

**Default Configuration:** Empty, submitted only if explicitly mapped or source exists.

**Data Shape:** Usually `string`; may be typed by configured value kind.

**Validation Rules:** Type/length and allowlist; server must not trust client values.

**Conditional Logic Interactions:** Can trigger visibility, branching, prefill, and integration routing.

**Accessibility Requirements:** None at runtime; should not create focus target.

**Localization Requirements:** Usually invariant.

**Mobile Behavior:** Not applicable.

**Analytics/Reporting:** UTM/source dimensions; PII hidden values excluded from public analytics.

**Edge Cases:** Tampering, leaking secrets in URLs, conflicting URL/source/default, hidden vs conditionally hidden semantics.

**MVP Priority:** Must-have.

**Competitor References:** Tally hidden fields; Fillout URL parameters/hidden fields; Typeform URL parameters.

### Read-Only / Display Value

**Purpose:** Show a prefilled, calculated, or integration-provided value without letting respondents edit it.

**Respondent Runtime:** Text-like display with optional copyable value.

**Builder Selection Behavior:** Inspector shows source and submission policy.

**Inspector Panels and Options:** Label, value source, submit value toggle, formatting, sensitive masking.

**Default Configuration:** Static display value, not submitted unless mapped.

**Data Shape:** Depends on source; include snapshot if submitted.

**Validation Rules:** None unless submitted value has type contract.

**Conditional Logic Interactions:** Can be controlled by conditions; calculated value source Phase 2.

**Accessibility Requirements:** If informational, semantic text; if copyable, button accessible.

**Localization Requirements:** Format by locale.

**Mobile Behavior:** Wrap long text.

**Analytics/Reporting:** Usually excluded.

**Edge Cases:** Users may assume read-only means authoritative; avoid secrets.

**MVP Priority:** Should-have.

**Competitor References:** Fillout answer piping/read-only references; Formstack read-only fields.

### Password / Secret Input

**Purpose:** Collect short sensitive secrets only when the host app has a clear security need.

**Respondent Runtime:** Masked input with reveal toggle if enabled, password-manager autocomplete behavior, and no analytics capture.

**Builder Selection Behavior:** Inspector warns that secrets should usually be handled by the host app, not stored in form submissions.

**Inspector Panels and Options:** Content label/name/help; no choices; validation for required/min/max/pattern; logic limited to empty/not empty; appearance width/reveal toggle; data flags always sensitive; advanced retention and encryption metadata.

**Default Configuration:** Masked, sensitive flag true, analytics disabled.

**Data Shape:** `string`, preferably omitted from normal exports or redacted by policy.

**Validation Rules:** Required, length, pattern, custom validator.

**Conditional Logic Interactions:** Empty/not empty only in MVP; never pipe into text.

**Accessibility Requirements:** Reveal button has accessible pressed state and label.

**Localization Requirements:** Translated security/error text.

**Mobile Behavior:** Password keyboard and password-manager compatibility.

**Analytics/Reporting:** Excluded.

**Edge Cases:** Secret leakage in logs, exports, defaults, URL prefill, and browser autocomplete.

**MVP Priority:** Later/plugin.

**Competitor References:** Fillout password field; common enterprise forms.

### Name / Contact Info Compound Block

**Purpose:** Collect structured identity details faster than separate primitive fields.

**Respondent Runtime:** Compound group for first/last name, full name, company, job title, email, and phone depending on configuration.

**Builder Selection Behavior:** Inspector edits subfields and generated child paths.

**Inspector Panels and Options:** Content group label/subfield labels; no choices; validation per subfield and group requiredness; logic on group or subfields; appearance one/two-column layout; data mapping to CRM/contact models; advanced subfield enable/disable.

**Default Configuration:** Name block with first and last name enabled.

**Data Shape:** Object, for example `{ "first": "Jane", "last": "Doe" }`; email/phone should use their own canonical field contracts.

**Validation Rules:** Required subfields, length, email/phone when included.

**Conditional Logic Interactions:** Group empty/not empty and subfield comparisons.

**Accessibility Requirements:** Fieldset/legend, individual labels, grouped errors.

**Localization Requirements:** Name order and labels may vary by locale.

**Mobile Behavior:** Stack subfields on narrow screens.

**Analytics/Reporting:** PII; table/export only.

**Edge Cases:** Single-name cultures, honorifics, suffixes, organization contacts.

**MVP Priority:** Phase 2; MVP can compose primitive fields.

**Competitor References:** Typeform Contact Info; SurveyMonkey Name/Email/Phone forms questions.

### Address

**Purpose:** Collect postal address data for shipping, billing, identity, or location workflows.

**Respondent Runtime:** Compound address fields with optional country selector and postal code validation.

**Builder Selection Behavior:** Inspector configures country restrictions, required subfields, and mapping.

**Inspector Panels and Options:** Content/subfield labels; country/options restrictions; validation per subfield; logic by country/region; appearance layout; data mapping to shipping/CRM fields; advanced address autocomplete adapter.

**Default Configuration:** Line 1, line 2, city, region, postal code, country.

**Data Shape:** Object with stable keys: `{ "line1": "", "line2": "", "city": "", "region": "", "postalCode": "", "country": "US" }`.

**Validation Rules:** Required subfields, postal format adapter, allowed countries.

**Conditional Logic Interactions:** Country/region can trigger follow-up fields, shipping methods, tax/payment later.

**Accessibility Requirements:** Fieldset/legend and explicit labels.

**Localization Requirements:** Address order, region labels, postal code names, and required parts vary by country.

**Mobile Behavior:** Autocomplete and stacked layout.

**Analytics/Reporting:** PII; geocoding is integration/plugin only.

**Edge Cases:** Non-postal countries, long addresses, right-to-left addresses, autocomplete provider privacy.

**MVP Priority:** Phase 2; MVP can compose primitive fields.

**Competitor References:** SurveyMonkey address; Paperform address; Cognito address.

### Image Choice / Picture Choice

**Purpose:** Let respondents choose options represented by images.

**Respondent Runtime:** Accessible card/radio/checkbox group with image, label, optional description.

**Builder Selection Behavior:** Choices inspector adds image upload/URL and alt text per option.

**Inspector Panels and Options:** Content label/name; choices with label/value/image/alt/description; validation required/min/max; logic same as choice fields; appearance card columns/aspect ratio; data custom values; advanced randomization.

**Default Configuration:** Two image options, single-select.

**Data Shape:** `string` or `string[]` option values.

**Validation Rules:** Same as single/multiple choice.

**Conditional Logic Interactions:** Same as single/multiple choice.

**Accessibility Requirements:** Each image option must have text label; alt describes image if it adds meaning.

**Localization Requirements:** Labels and alt text translated; option values stable.

**Mobile Behavior:** One or two columns depending width.

**Analytics/Reporting:** Choice counts; image assets shown in reporting optionally.

**Edge Cases:** Missing images, large assets, randomization with logic, image-only ambiguity.

**MVP Priority:** Phase 2.

**Competitor References:** SurveyMonkey image choice; Typeform picture choice; Fillout picture choice; Paperform multiple choice images.

### Color Picker

**Purpose:** Collect a color value for design preferences, product customization, or categorization.

**Respondent Runtime:** Swatches and/or color input with text fallback.

**Builder Selection Behavior:** Inspector defines allowed swatches and free-pick policy.

**Inspector Panels and Options:** Content label/name; choices swatches; validation required/allowed colors; logic by value; appearance swatch size; data hex/RGB format; advanced palette localization.

**Default Configuration:** Hex color string, free pick disabled unless configured.

**Data Shape:** Hex string such as `#3366ff`.

**Validation Rules:** Required, valid color, allowed swatch list.

**Conditional Logic Interactions:** Equals/in list.

**Accessibility Requirements:** Swatches have names, not color alone.

**Localization Requirements:** Color names translated if shown.

**Mobile Behavior:** Native color picker fallback acceptable.

**Analytics/Reporting:** Swatch counts.

**Edge Cases:** Contrast, arbitrary colors, alpha values, browser color input support.

**MVP Priority:** Later.

**Competitor References:** Fillout color picker; Paperform color picker.

### Location Coordinates

**Purpose:** Capture geographic coordinates or selected location.

**Respondent Runtime:** Permission-based location capture or map/search adapter with manual fallback.

**Builder Selection Behavior:** Inspector requires adapter and privacy warning.

**Inspector Panels and Options:** Content label/name; no choices unless map provider; validation required/accuracy radius; logic by empty/not empty or region via custom predicate; appearance map/list; data lat/lng shape; advanced provider key.

**Default Configuration:** Disabled until location adapter configured.

**Data Shape:** `{ "lat": 35.6892, "lng": 51.3890, "accuracy": 25, "source": "browser" }`.

**Validation Rules:** Required, bounds/geofence via custom validator.

**Conditional Logic Interactions:** Region/geofence predicates later.

**Accessibility Requirements:** Manual coordinate/address alternative.

**Localization Requirements:** Number formatting display only; submitted numbers stable.

**Mobile Behavior:** Browser permission flow; clear retry.

**Analytics/Reporting:** Map views only with privacy controls.

**Edge Cases:** Consent, precision, spoofing, provider costs.

**MVP Priority:** Phase 3/plugin.

**Competitor References:** Fillout location coordinates.

### CAPTCHA / Bot Protection

**Purpose:** Reduce spam and automated submissions.

**Respondent Runtime:** Challenge, invisible check, honeypot, or turnstile depending adapter.

**Builder Selection Behavior:** Inspector configures provider and fallback behavior.

**Inspector Panels and Options:** Content challenge placement; no choices; validation provider token required; logic not a trigger; appearance theme; data excluded from submission data; advanced provider keys/server verification.

**Default Configuration:** Off; extension point available.

**Data Shape:** Provider token transported separately in submission metadata, not stored as answer.

**Validation Rules:** Server-side verification required.

**Conditional Logic Interactions:** None; can block submit.

**Accessibility Requirements:** Provider must have accessible alternative.

**Localization Requirements:** Provider language setting.

**Mobile Behavior:** Must not block mobile completion with unusable challenge.

**Analytics/Reporting:** Spam/blocked counts.

**Edge Cases:** Privacy, false positives, vendor outage, accessibility.

**MVP Priority:** Phase 2 extension point.

**Competitor References:** Fillout CAPTCHA; Tally reCAPTCHA; common enterprise forms.

### Calculation Field

**Purpose:** Derive text, number, boolean, date, score, or price values from prior inputs.

**Respondent Runtime:** Hidden or visible calculated display that updates deterministically.

**Builder Selection Behavior:** Opens formula/rule builder and dependency diagnostics.

**Inspector Panels and Options:** Content label/name/display; no choices; validation type and error behavior; logic as source and target; appearance formatting; data submit/exclude toggle; advanced expression version and backend parity.

**Default Configuration:** Hidden calculation, not submitted until configured.

**Data Shape:** Typed result plus metadata; examples: number, string, boolean, ISO date.

**Validation Rules:** Type correctness, dependency availability, no cycles.

**Conditional Logic Interactions:** Can trigger conditions only after dependency graph passes.

**Accessibility Requirements:** Visible calculations announce updates politely when relevant.

**Localization Requirements:** Display formatting localized; evaluation canonical.

**Mobile Behavior:** No special behavior beyond visible display.

**Analytics/Reporting:** Aggregate according to result type.

**Edge Cases:** Infinite loops, missing values, backend parity, floating math, expression migration.

**MVP Priority:** Phase 2.

**Competitor References:** Cognito calculations; Paperform calculations; Fillout calculations; Tally calculated fields.

### Score Field / Quiz Outcome

**Purpose:** Assign points and compute quiz, assessment, qualification, or segmentation outcomes.

**Respondent Runtime:** Usually hidden during form; may show result on ending.

**Builder Selection Behavior:** Inspector connects option weights, answer keys, and outcome ranges.

**Inspector Panels and Options:** Content name/result labels; choices source scoring; validation score bounds; logic ending selection; appearance result display; data include score/outcome; advanced multiple score buckets.

**Default Configuration:** Hidden numeric score.

**Data Shape:** `{ "score": 12, "outcome": "qualified" }`.

**Validation Rules:** No cycles; referenced fields must exist.

**Conditional Logic Interactions:** Drives branching/endings.

**Accessibility Requirements:** Result text accessible on ending.

**Localization Requirements:** Outcome labels translated.

**Mobile Behavior:** No special behavior.

**Analytics/Reporting:** Score distribution, pass/fail, outcomes.

**Edge Cases:** Changed scoring after submissions, partial answers, multi-branch outcomes.

**MVP Priority:** Phase 2.

**Competitor References:** Typeform scoring; SurveyMonkey quizzes; Google Forms quizzes.

### Appointment / Scheduling Embed

**Purpose:** Let respondents book a time with calendar availability.

**Respondent Runtime:** Embedded scheduler or native slot picker through adapter.

**Builder Selection Behavior:** Requires scheduling provider adapter.

**Inspector Panels and Options:** Content label; choices service/calendar/event type; validation required booking; logic by booked/not booked; appearance embed height; data event reference; advanced timezone and cancellation policy.

**Default Configuration:** Disabled until adapter configured.

**Data Shape:** `{ "eventId": "...", "startsAt": "...", "endsAt": "...", "timezone": "..." }`.

**Validation Rules:** Booking token/event id required; server verifies.

**Conditional Logic Interactions:** Branch on booked status.

**Accessibility Requirements:** Provider accessibility must be validated; fallback contact option recommended.

**Localization Requirements:** Timezone, date/time locale, translated provider UI where possible.

**Mobile Behavior:** Full-width scheduler.

**Analytics/Reporting:** Booked slots and conversion.

**Edge Cases:** Availability race, cancellations, timezone, provider outage.

**MVP Priority:** Phase 3/plugin.

**Competitor References:** Typeform Calendly; Paperform appointments; Fillout scheduling/database workflows.

### Data Lookup / Record Picker

**Purpose:** Let respondents choose or load records from host systems such as CRM, database, or CMS.

**Respondent Runtime:** Search/select records with loading, empty, and error states.

**Builder Selection Behavior:** Inspector configures adapter, display fields, submitted id, and dependency diagnostics.

**Inspector Panels and Options:** Content label/name; choices from adapter; validation required/allowed; logic selected record fields; appearance result template; data mapping; advanced caching/auth.

**Default Configuration:** Disabled until adapter configured.

**Data Shape:** Opaque record id plus optional display snapshot.

**Validation Rules:** Required, selected id exists, permission check server-side.

**Conditional Logic Interactions:** Can prefill, filter options, and branch from selected record metadata.

**Accessibility Requirements:** Accessible combobox/listbox.

**Localization Requirements:** Display fields localized by adapter where possible.

**Mobile Behavior:** Search-first full-screen picker.

**Analytics/Reporting:** Record id counts; careful with PII.

**Edge Cases:** Deleted records, stale options, auth leaks, N+1 calls.

**MVP Priority:** Phase 3/plugin.

**Competitor References:** Fillout record picker/dynamic data; Airtable data-backed forms.

### Repeater / Subform / Table Input

**Purpose:** Collect arrays of repeated objects such as attendees, addresses, line items, or employment history.

**Respondent Runtime:** Add/remove/reorder repeated item groups or spreadsheet-like rows.

**Builder Selection Behavior:** Builder edits an item template with nested child fields and array constraints.

**Inspector Panels and Options:** Content label/name/item label; choices not applicable; validation min/max items and per-child rules; logic item-level and aggregate later; appearance card/table mode; data array path; advanced stable item key behavior and migration diagnostics.

**Default Configuration:** One empty item template, min 0, max unset.

**Data Shape:** Array of objects, e.g. `addresses: [{ "city": "Tehran" }]`; runtime stable keys are separate from submitted indexes.

**Validation Rules:** Min/max items, child validation, unique per item if configured.

**Conditional Logic Interactions:** Requires dependency model for item paths and aggregate predicates.

**Accessibility Requirements:** Add/remove/reorder controls, item labels, error summaries, keyboard reorder.

**Localization Requirements:** Item labels and pluralization.

**Mobile Behavior:** Card mode; table mode only when usable.

**Analytics/Reporting:** Flattened exports and nested JSON exports.

**Edge Cases:** Reordering corrupting state, nested repeaters, path grammar, backend errors, migrations.

**MVP Priority:** Phase 3 unless one-level semantics are fully specified.

**Competitor References:** Cognito repeating sections/tables; Fillout subforms/table.

### Voice Response

**Purpose:** Collect spoken answers where text is inconvenient or richer qualitative input is needed.

**Respondent Runtime:** Record, playback, delete, re-record, upload/transcription status.

**Builder Selection Behavior:** Inspector requires media/upload adapter and retention policy.

**Inspector Panels and Options:** Content prompt/name; no choices; validation duration/required; logic uploaded/transcribed status; appearance recorder style; data file/transcript mapping; advanced transcription language.

**Default Configuration:** Disabled until media adapter configured.

**Data Shape:** File reference plus optional transcript.

**Validation Rules:** Required, max duration, accepted status.

**Conditional Logic Interactions:** Empty/not empty; transcript predicates later.

**Accessibility Requirements:** Text alternative path required.

**Localization Requirements:** Recording instructions and transcription language.

**Mobile Behavior:** Microphone permissions and retry.

**Analytics/Reporting:** Media review and transcript search.

**Edge Cases:** Consent, browser support, background noise, storage costs.

**MVP Priority:** Phase 3/plugin.

**Competitor References:** Fillout voice recording; Typeform video/AI-adjacent response patterns.

### Video Response

**Purpose:** Collect recorded video answers for interviews, applications, or qualitative feedback.

**Respondent Runtime:** Camera/microphone permission, record, preview, replace, upload progress.

**Builder Selection Behavior:** Inspector requires media adapter and consent/retention settings.

**Inspector Panels and Options:** Content prompt/name; validation duration/required; logic uploaded status; appearance recorder; data media reference; advanced transcoding/transcript settings.

**Default Configuration:** Disabled until media adapter configured.

**Data Shape:** File reference plus optional thumbnail/transcript metadata.

**Validation Rules:** Required, max duration/size, accepted status.

**Conditional Logic Interactions:** Empty/not empty.

**Accessibility Requirements:** Alternative response path or caption/transcript workflow.

**Localization Requirements:** Instructions and consent text translated.

**Mobile Behavior:** Camera permissions, orientation, retry.

**Analytics/Reporting:** Media review only.

**Edge Cases:** Consent, upload failures, large files, privacy.

**MVP Priority:** Phase 3/plugin.

**Competitor References:** Typeform video response.

### Send Response Copy / Download PDF / Fill Again Button

**Purpose:** Provide post-submit utility actions on ending screens.

**Respondent Runtime:** Buttons or email input on ending page after success.

**Builder Selection Behavior:** Ending screen inspector adds these as system actions.

**Inspector Panels and Options:** Content button labels; no choices; validation email required if response copy; logic show by ending/outcome; appearance button style; data delivery mapping; advanced PDF template and email adapter.

**Default Configuration:** Off.

**Data Shape:** Delivery action metadata, not answer data.

**Validation Rules:** Email format for response copy; backend delivery status.

**Conditional Logic Interactions:** Show on specific endings or outcomes.

**Accessibility Requirements:** Buttons accessible; delivery status announced.

**Localization Requirements:** Button/status text translated.

**Mobile Behavior:** Full-width buttons if needed.

**Analytics/Reporting:** Delivery/download/fill-again events.

**Edge Cases:** PII in email/PDF, failed delivery, redirect conflicts.

**MVP Priority:** Phase 2.

**Competitor References:** Fillout ending blocks; Airtable response copy/submit another; Google response receipts.

## 8. Layout, Page, and Structural Components

### Heading

**Purpose:** Introduce sections and improve scanability.

**Runtime:** Renders semantic heading at configured level relative to form structure.

**Builder:** Inline text edit; inspector controls text, level, alignment, spacing.

**Data Shape:** No submitted value.

**MVP Priority:** Must-have.

### Paragraph / Statement

**Purpose:** Provide instructions, context, consent text, or explanatory copy.

**Runtime:** Plain text by default; rich text only through sanitized feature.

**Builder:** Text editor with limited formatting if enabled.

**Data Shape:** No submitted value.

**MVP Priority:** Must-have.

### Image

**Purpose:** Add visual context, branding, product reference, or survey stimulus.

**Runtime:** Image with alt text and responsive sizing.

**Builder:** Upload/select image, alt text, caption, alignment.

**Data Shape:** Asset reference, no submitted value.

**MVP Priority:** Must-have if asset storage contract exists; otherwise URL-only content block.

### Video / PDF / HTML Embed

**Purpose:** Rich media and external content.

**Runtime:** Embedded media with fallback links.

**Builder:** URL/embed config and accessibility warnings.

**Data Shape:** Content config only.

**MVP Priority:** Phase 3/plugin due security and accessibility.

### Divider / Spacer / Callout

**Purpose:** Visual grouping and emphasis.

**Runtime:** Non-interactive layout elements.

**Builder:** Style/spacing controls.

**Data Shape:** No submitted value.

**MVP Priority:** Divider must-have; spacer/callout Phase 2.

### Section / Group

**Purpose:** Group related fields and apply shared visibility/layout.

**Runtime:** Fieldset/section with optional heading and description.

**Builder:** Drag fields into section; inspector controls title, collapsible later, visibility, layout.

**Data Shape:** No value unless group maps object nesting through child names.

**MVP Priority:** Must-have.

### Page / Step

**Purpose:** Split long forms into navigable steps.

**Runtime:** Current page visible; back/next/submit controls; progress optional.

**Builder:** Page tree, reorder, page title, validation before advance, branch destinations.

**Data Shape:** Structural only.

**MVP Priority:** Must-have.

### Welcome Screen

**Purpose:** Introduce the form before questions.

**Runtime:** Title, description, start button.

**Builder:** Content and button label settings.

**Data Shape:** Structural only.

**MVP Priority:** Should-have.

### Ending / Thank-You Screen

**Purpose:** Confirm submission, show message, redirect, or invite another response.

**Runtime:** Success state after normalized response.

**Builder:** Message, redirect URL, submit another response, response copy, conditional ending Phase 2.

**Data Shape:** Structural only.

**MVP Priority:** Must-have.

## 9. Logic, Branching, Calculations, and Data Flow

### Rule Model

Recommended rule shape:

```json
{
  "id": "rule_001",
  "when": {
    "all": [
      { "source": "field", "path": "country", "op": "eq", "value": "IR" }
    ]
  },
  "then": [
    { "action": "show", "targetId": "province" }
  ],
  "priority": 100
}
```

Sources:

- Field value
- Page/step state
- Hidden field or URL parameter
- Submission metadata
- Calculation value in Phase 2
- External data in Phase 3

Operators:

- `eq`, `neq`
- `contains`, `not_contains`
- `contains_any`, `contains_all`
- `gt`, `gte`, `lt`, `lte`, `between`
- `empty`, `not_empty`
- `matches_regex` with restricted regex
- `selected`, `not_selected`
- Named custom predicate with key and version

Actions:

- Show/hide
- Require/unrequire
- Enable/disable
- Jump to page
- End form
- Set value later
- Calculate value later
- Filter options later
- Trigger webhook later
- Assign score later

Conflict resolution:

- Publish must detect contradictory rules targeting the same node/property.
- For visibility, default is visible unless explicit hidden default or rule action says hide.
- For branching, first matching rule by priority wins; fallback is next page.
- Rule order must be stable and shown in the logic map.
- Cycle detection is required before publishing calculations or predicates that reference derived state.

### Data Flow

1. Load published immutable schema and validate it.
2. Initialize values from defaults, URL parameters, host prefill, and draft adapter.
3. Evaluate visibility/enabled/required graph.
4. Render visible nodes through registry.
5. Validate field changes according to validation timing.
6. Normalize values according to hidden-field and empty-value policy.
7. Submit canonical envelope with `revisionId`, `revisionHash`, and `submissionAttemptId`.
8. Map backend normalized response to field/global errors or success ending.

### Calculations

Calculations are Phase 2 because they create a runtime language. Before implementation, specify:

- Expression syntax or rule-builder model.
- Type system: text, number, boolean, date, array.
- Dependency graph and cycle detection.
- Missing value behavior.
- Locale-independent numeric/date evaluation.
- Backend parity requirements.
- Unsupported JSON Schema compiler diagnostics.

## 10. Validation Model

Validation layers:

- Schema validation before draft save and publish.
- Runtime validation for immediate UX.
- Submission normalization validation before transport.
- Backend validation through host app using generated JSON Schema or native validation.
- Backend response mapping to field/global errors.

Built-in validation rules:

- `required`
- `minLength`, `maxLength`, `exactLength`
- `minWords`, `maxWords`
- `pattern` with restricted regex
- `email`
- `url`
- `phone` through validator adapter
- `min`, `max`, `integer`, `decimal`, `step`, `precision`
- `minSelections`, `maxSelections`, `exactSelections`
- `dateMin`, `dateMax`, `timeMin`, `timeMax`
- `fileType`, `fileSize`, `fileCount`
- `oneOf`, `notOneOf`
- `custom` named validator with version

Error contract:

```json
{
  "path": "email",
  "code": "invalid_email",
  "message": "Enter a valid email address.",
  "params": {},
  "source": "server"
}
```

Validation behavior:

- Hidden fields are not validated unless `validateWhenHidden` is explicitly enabled.
- Required condition is evaluated after visibility unless configured otherwise.
- Unknown validators block publish.
- Client validation is UX only; backend validation remains authoritative.
- Custom error messages are localized per locale and should fall back to system defaults.

## 11. Builder Inspector UX

Recommended inspector tabs:

- Content: label, name, description, placeholder, defaults, content text.
- Choices: options, values, descriptions, images, sort/randomize, custom values.
- Validation: required, field-specific rules, custom errors.
- Logic: visibility, requiredness, branching, dependencies.
- Appearance: width, layout, hide label, field style, media alignment.
- Data: submitted path, integration mapping, analytics key, PII, retention/export.
- Advanced: custom field config, validator versions, migration warnings, debug metadata.

Selection behavior:

- Selecting a canvas node opens relevant tab based on component type.
- Choice components open Choices first; text inputs open Content; structural nodes open Content/Appearance.
- Invalid settings show inline in inspector and as publish-blocking diagnostics.
- Dangerous changes show warnings: submitted path rename, deleted field, scalar-to-array, option value change, file/payment semantic change, requiredness change.
- Quick actions on canvas: duplicate, delete, move, hide, required, open logic, more.

Keyboard builder behavior:

- Arrow keys move selection in tree/canvas.
- Enter opens inline edit.
- Delete removes selected node after confirmation for fields with submitted paths.
- Cmd/Ctrl+D duplicates.
- Cmd/Ctrl+Z/Y undo/redo.
- Modifier plus arrow reorders.

## 12. Respondent Runtime Behavior

Runtime requirements:

- Render from immutable published schema.
- Use stable field ids for DOM relationships and accessible descriptions.
- Keep visible runtime responsive across mobile and desktop.
- Validate current step before next when configured.
- Preserve draft values through adapter if host provides one.
- Focus first invalid field after failed submit and show error summary.
- On conditional reveal, do not steal focus unless user action directly caused navigation.
- On conditional hide, apply hidden-value policy immediately and clear validation errors unless preserving hidden values.
- Prevent double submit with idempotency key and pending state.
- Map backend validation errors to fields by normalized submitted path.
- Render global errors when `path` is null.

Respondent completion states:

- Initial/loading
- Ready
- Step validating
- Submitting
- Submission success
- Validation error
- Server/auth/rate-limit/conflict error
- Closed/not accepting responses

## 13. Accessibility and Keyboard Behavior

Core requirements:

- Every field has a stable accessible name.
- Labels, descriptions, errors, counters, and inputs are linked.
- Field groups use fieldset/legend or equivalent semantics.
- Custom fields receive renderer-managed ids, `aria-describedby`, invalid/required/disabled state, and focus target contract.
- Error summary appears before form body after failed submit and links to invalid fields.
- Step navigation is keyboard accessible.
- Conditional content changes are announced when needed but not noisy.
- Media requires alt text or decorative marking.
- Image choice, ranking, matrix, custom combobox, signature, upload, and date picker require dedicated a11y review before release.
- Color alone never communicates required, selected, error, or progress states.
- Motion and transitions respect reduced motion.

Keyboard runtime behavior:

- Tab follows visual/logical order.
- Enter submits only where expected; textareas preserve newline.
- Radio groups support arrow navigation.
- Checkbox groups support space.
- Ranking supports keyboard reorder.
- Escape closes popovers/comboboxes.

## 14. Localization, RTL, Date/Time, Number, and Currency Rules

Localization model:

- Schema has default locale and optional localized records.
- Translatable strings: labels, descriptions, placeholders, option labels, errors, button text, ending messages.
- Stable values, ids, submitted paths, and option values are not translated.
- Missing translation falls back to default locale with diagnostics.

Direction:

- Form-level `dir`: `ltr`, `rtl`, or `auto`.
- Field-level override allowed for mixed-language text inputs.
- Icons and navigation arrows mirror in RTL where semantic direction changes.
- Numeric and code inputs may remain LTR inside RTL forms.

Date/time:

- Submitted dates use ISO `YYYY-MM-DD`.
- Submitted datetimes, if added, must define timezone and use ISO 8601.
- Display calendar can be localized; Jalali/Gregorian support requires explicit canonical mapping.

Numbers/currency:

- Submitted numbers are JSON numbers where precision permits.
- Currency should use decimal string/minor units in Phase 2 to avoid floating errors.
- Locale display uses configured locale but does not change canonical submission.

## 15. Data Schema Requirements

Canonical node minimum:

```json
{
  "id": "field_email",
  "type": "field",
  "fieldType": "email",
  "name": "email",
  "label": "Email",
  "description": "We will use this for updates.",
  "defaultValue": "",
  "validation": [{ "type": "required" }],
  "visibility": null,
  "ui": { "width": "full" },
  "meta": {}
}
```

Form schema requirements:

- `schemaVersion`
- `formId`
- `revisionId`
- `revisionHash`
- `status`
- `locale`
- `dir`
- `title`
- `settings`
- `nodes`
- `logicRules`
- `localizations`
- `extensions`

Settings requirements:

- `submitMode`
- `navigation`
- `validationTiming`
- `hiddenValuePolicy`
- `emptyValuePolicy`
- `unknownFieldPolicy`
- `maxNodes`, `maxDepth`, `maxConditionComplexity`

Submission envelope:

```json
{
  "formId": "contact-intake",
  "revisionId": "rev_2026_05_14_001",
  "revisionHash": "sha256_...",
  "schemaVersion": "1.0.0",
  "submissionAttemptId": "attempt_abc123",
  "submittedAt": "2026-05-14T10:30:00.000Z",
  "locale": "en",
  "data": {
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  },
  "files": [],
  "meta": {
    "source": "public-renderer",
    "requestId": "req_abc"
  }
}
```

Compiler outputs:

- Submitted data JSON Schema using a locked dialect.
- Validation plan.
- Condition dependency graph.
- Unsupported feature warnings.
- Documentation metadata.

## 16. Analytics and Reporting Implications

MVP analytics:

- Submission count over time.
- Completion count and completion rate.
- Step/page drop-off.
- Field error frequency.
- Choice/rating summaries.
- Text search and export.
- CSV and JSON export.

Field reporting:

- Text: searchable table; top repeated values only.
- Number: min/max/average/median/histogram.
- Choice: counts and percentages.
- Multi-choice: per-option counts, total selections.
- Date/time: grouped timelines.
- Rating/scale: average and distribution.
- File/signature/payment: operational reports, not public charts.

PII/sensitive fields:

- Excluded from charts by default.
- Masked in logs.
- Configurable export permissions later.

Phase 2/3 analytics:

- NPS, CSAT, CES.
- Matrix heatmaps.
- Ranking analysis.
- Funnel/drop-off by branch.
- A/B tests and click maps.
- Integration delivery status.

## 17. Integrations and Webhook Implications

Integration boundaries:

- Core schema stores mapping metadata, not vendor logic.
- Adapters perform transport and mapping.
- Integration failures return normalized statuses.
- Webhooks are post-submit extension points, not required for renderer correctness.

Recommended integration model:

```json
{
  "integrationMappings": [
    {
      "id": "map_email_to_crm",
      "fieldPath": "email",
      "target": {
        "adapter": "crm",
        "entity": "contact",
        "property": "email"
      }
    }
  ]
}
```

Implications:

- Dynamic options require option source adapters, caching, loading/error states, and dependency diagnostics.
- Record update forms require explicit identity, authorization, and conflict semantics.
- File integrations require secure link strategy and expiration policy.
- Payment integrations require idempotency, webhook verification, and provider status reconciliation.

## 18. MVP vs Later Phases

### Phase 1: Complete Credible MVP

Must include:

- Canonical schema v1 and formal path grammar.
- Dangerous-key rejection.
- Immutable publish revision contract.
- Normalized submission and backend response contracts.
- Core runtime engine without React.
- React renderer with field registry and slots.
- React builder with palette, canvas/tree, inspector, preview, save draft, publish hooks.
- Fields: short text, long text, number, email, phone, URL, single choice, multiple choice, dropdown, single checkbox/consent, date, time, rating/linear scale, hidden field.
- Blocks: heading, paragraph, image if asset contract exists, divider, section, page/step, ending.
- Validation: required, length, regex, email, URL, numeric min/max, selection min/max, date/time bounds, custom named validators with fail-closed diagnostics.
- Logic: simple conditional visibility and basic branching.
- JSON Schema compiler for submitted data with diagnostics.
- Conformance fixtures.
- Basic analytics/export.

Conditional MVP inclusions:

- File upload only as host-managed file metadata contract plus adapter interface.
- Welcome screen if it does not complicate navigation semantics.

### Phase 2: Advanced Builder

- Multi-select dropdown.
- Matrix/grid.
- Ranking.
- NPS/CSAT/CES.
- Date range/date-time.
- Image choice.
- Signature.
- Payment/product/order.
- Calculations/scores.
- Dynamic option filtering.
- URL prefill UI.
- Webhooks.
- Response copy and redirects.
- Multi-ending logic.
- CAPTCHA extension.
- File upload orchestration adapters.

### Phase 3: Differentiators / Enterprise / Plugins

- Repeaters/subforms/tables.
- Data lookup/record picker.
- Submission editing/update forms.
- Voice/video response.
- AI clarification.
- PDF viewer and HTML/embed block.
- Advanced analytics, A/B tests, click maps.
- Approval workflows.
- Audit logs and role collaboration.
- Data residency, HIPAA/GDPR controls.

## 19. Open Questions and Product Decisions Needed

Decisions required before implementation:

1. Approve the Phase 1 component list and confirm that repeaters, payments, signatures, matrices, calculations, and dynamic lookup are not MVP.
2. Decide whether file upload is in MVP as metadata-only host-managed upload, or deferred entirely.
3. Lock the submitted path grammar, including escaping and array syntax.
4. Lock JSON Schema dialect, recommended Draft 2020-12.
5. Choose empty value normalization by field type: omit, `null`, empty string, or empty array.
6. Choose hidden-value policy defaults: recommended exclude conditionally hidden values from final submission.
7. Decide phone value shape: simple string for MVP or compound object.
8. Decide time/duration canonical shapes before implementing time fields.
9. Define option value migration policy and reporting label snapshots.
10. Decide whether rich text is excluded from MVP or allowed through a sanitized block.
11. Define custom field/validator/predicate registration contracts with versioning.
12. Define backend conformance fixture format and required examples.
13. Decide default builder UX style: Tally-like document editing, classic drag canvas, or hybrid. Recommendation: hybrid palette/canvas/inspector with keyboard quick-add.

## 20. Source Links

Local project sources:

- `2026-05-14-react-form-builder-architecture-design.md`
- `AGENTS.md`
- `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
- `docs/research/complete-form-builder-component-audit-standard-prompt.md`

Official and primary competitor sources:

- Typeform question types: https://help.typeform.com/hc/en-us/articles/360051789692-question-types
- Typeform answer validation: https://help.typeform.com/hc/en-us/articles/47605590883476-Answer-validation
- Typeform recall information: https://help.typeform.com/hc/en-us/articles/360052320011-Use-Recall-information-to-reference-form-answers-variables-and-more
- Typeform URL parameters: https://help.typeform.com/hc/en-us/articles/360052676612-Using-URL-parameters-formerly-Hidden-Fields
- Typeform accessibility checker: https://help.typeform.com/hc/en-us/articles/11826172113812-Check-if-your-form-is-accessible
- Fillout field types: https://www.fillout.com/docs/help/question-types
- Fillout logic: https://www.fillout.com/help/logic
- Fillout conditional hiding: https://www.fillout.com/docs/help/conditional-hiding
- Fillout URL parameters/hidden fields: https://www.fillout.com/docs/url-parameters
- Fillout custom values: https://www.fillout.com/help/custom-values
- Fillout prefill fields: https://www.fillout.com/docs/prefill-fields
- Fillout dynamic data: https://www.fillout.com/docs/fetch-dynamic-data
- Fillout accessibility: https://www.fillout.com/docs/forms-accessibility
- Tally input blocks: https://tally.so/help/input-blocks
- Tally hidden fields: https://tally.so/help/hidden-fields
- Tally calculated fields: https://tally.so/help/form-calculator
- Google Forms question types: https://support.google.com/docs/answer/7322334?hl=en
- Google Forms validation rules: https://support.google.com/docs/answer/3378864?hl=en
- Google Forms responses: https://support.google.com/docs/answer/139706
- SurveyMonkey question types and page elements: https://help.surveymonkey.com/en/surveymonkey/create/question-types/
- Formstack field options: https://help.formstack.com/hc/en-us/articles/44592314376851-Field-Options
- Formstack conditional logic: https://help.formstack.com/hc/en-us/articles/44592316217619-Conditional-Logic-for-Formstack-Forms
- Formstack calculations: https://help.formstack.com/hc/en-us/articles/44592319728275-Creating-Calculations
- Formstack file uploads: https://help.formstack.com/s/article/File-Upload-Fields
- Formstack signatures: https://help.formstack.com/hc/en-us/articles/44592649180563-Signatures
- Airtable form views: https://support.airtable.com/docs/getting-started-with-airtable-form-views
- Airtable building and sharing forms: https://support.airtable.com/docs/building-and-sharing-forms-in-airtable
- Paperform field types: https://paperform.co/help/articles/what-types-of-questions-or-fields-do-paperform-forms-have/
- Paperform calculations: https://paperform.co/help/articles/calculations-guide/
- Cognito Forms field reference: https://www.cognitoforms.com/support/16/building-forms/form-field-reference
- Cognito Forms calculations: https://www.cognitoforms.com/support/2/calculations
- Cognito Forms repeating sections/tables: https://www.cognitoforms.com/support/51/calculations/repeating-sectionstables
- Jotform conditional logic: https://www.jotform.com/help/57-smart-forms-conditional-logic-for-online-forms/
- Jotform payment integrations: https://www.jotform.com/help/323-Mastering-Payment-Form-Integrations-with-JotForm
- Jotform form builder/mobile elements overview: https://www.jotform.com/help/572-How-to-Create-Your-First-Form-with-JotForm-Mobile-Forms
