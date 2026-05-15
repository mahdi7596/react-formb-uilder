# Complete Form Builder Feature And Component Inventory

Research date: 2026-05-15

Status: research inventory for owner review. This is not an implementation plan.

## 1. Executive Summary

The current product is a strong technical MVP foundation, not yet a complete commercial form builder. The architecture work is solid: a canonical custom schema, framework-agnostic core, React renderer and builder packages, optional JSON Schema compiler, normalized submissions, immutable published revisions, safety checks, adapter boundaries, and a real-renderer preview are already the right base. The demo feeling comes from the builder experience and component catalog being much smaller and rougher than serious form builders.

The strongest products do not only offer more field names. They offer complete creator workflows around those fields:

- Visual option management for dropdowns, radios, checkboxes, image choices, ranking, matrix rows, and scoring values.
- Field-specific inspector panels instead of raw text or JSON editing.
- A visual logic builder for show, hide, require, skip, end, redirect, calculate, score, filter options, and integration conditions.
- Content and layout blocks that let a form feel like a real page or guided flow, not only a list of inputs.
- Submission outcomes: thank-you screens, redirects, response copies, exports, webhooks, notifications, PDF generation, analytics, and partial submissions.
- Localization and regional behavior, including RTL, translated builder/runtime labels, locale-aware dates, numbers, currencies, and market-specific validators.

The fastest path from MVP to credible product is not payments or AI. It is making the existing builder feel like a real authoring tool:

1. Add a product-grade options editor with add, delete, reorder, duplicate, default, disabled, "other", bulk paste, stable values, labels, and migration warnings.
2. Add a visual condition and logic builder that writes the existing safe declarative condition model.
3. Expand the builder palette to expose all already-supported core/renderer field types and essential content blocks.
4. Replace raw JSON/text inspector controls with field-specific settings sections.
5. Add Persian/RTL/Iran readiness: Persian UI strings, mirrored controls, Persian digit normalization, Jalali display strategy, Iran province/city field, Iranian mobile, postal code, and national ID validators.

The riskiest features are repeaters/subforms, upload orchestration, payments, calculations/scoring, signatures, dynamic data lookup, edit-existing-response, rich text/HTML/embed, collaboration/permissions, and analytics. Each needs explicit contracts before implementation.

Recommended next OpenSpec change after owner review: `specify-product-grade-field-and-inspector-model`. It should define the complete field catalog, option model, inspector tabs, visual settings schemas, migration warnings, and builder UX contracts before adding more implementation phases.

## 2. Research Method And Sources

Local source-of-truth documents inspected:

- `AGENTS.md`
- `docs/architecture/2026-05-14-react-form-builder-architecture-design.md`
- `docs/architecture/2026-05-14-react-technical-architecture-decisions.md`
- `docs/research/2026-05-14-end-user-form-builder-competitor-research.md`
- `docs/research/2026-05-14-complete-form-builder-component-interaction-specification.md`
- `docs/research/complete-form-builder-component-audit-standard-prompt.md`
- current OpenSpec specs under `openspec/specs/`

Current implementation inspected:

- `packages/core/src/schema/index.ts`
- `packages/react-renderer/src/index.tsx`
- `packages/react-builder/src/ui.tsx`
- builder, renderer, core, validators, adapters, themes tests and package boundaries

Official product documentation and product materials were checked for:

- Jotform, Typeform, Tally, Fillout, Formstack, Paperform, Cognito Forms, Google Forms, Microsoft Forms, SurveyMonkey, Airtable Forms, HubSpot Forms, Wufoo, Formsort, Form.io, SurveyJS, Zoho Forms, Gravity Forms, WPForms.
- Adjacent tools: Webflow, Framer, Notion Forms, Airtable Interfaces/Form views, Retool forms, Softr-style app builders.

The research lens was not "copy the biggest product." The lens was: translate proven creator and respondent capabilities into this product's architecture while preserving:

- Canonical custom form schema is the source of truth.
- JSON Schema is optional and backend-friendly only.
- `packages/core` stays framework-agnostic.
- React renderer and builder stay separate.
- Persisted schemas remain JSON-serializable.
- No executable JavaScript or React components in schemas.
- Published revisions are immutable.
- Unknown custom fields, validators, predicates, unsafe keys, and unsupported compiler behavior fail closed.
- Builder preview uses the real renderer.

## 3. Competitor Matrix

Legend: Core = table-stakes capability; Advanced = common in serious paid products; Enterprise = workflow, compliance, or team feature; Plugin = integration/provider-specific.

| Product | Strongest lesson | Field breadth | Logic | Data/workflow | Differentiator for us |
| --- | --- | --- | --- | --- | --- |
| Jotform | Breadth, templates, widgets, payments, signatures, reports | Very broad | Show/hide, calculations, updates, page logic | Payments, PDFs, approvals, integrations | Match breadth over time, but keep contracts cleaner and backend-agnostic |
| Typeform | Conversational flow and polish | Broad for lead/survey forms | Branching, outcomes, scoring, variables | Payments, integrations, AI creation | Add one-question-at-a-time mode after classic builder is credible |
| Tally | Notion-like fast creation | Broad enough, including ranking, matrix, payments, signatures | Logic blocks, calculations, answer piping | PDFs, partial submissions, version history | Speed and keyboard-first creation are essential |
| Fillout | Data-connected forms | 50+ fields and content blocks | Logic, calculations, hidden fields, repeat/subforms | Airtable, Notion, HubSpot, Salesforce, update forms | Adapter model should support dynamic options and record update |
| Formstack | Enterprise workflows | Broad business fields | Conditional logic and workflows | Approvals, documents, signatures, security | Enterprise work belongs in adapters/plugins, not core MVP |
| Paperform | Page-like branded forms | 27+ fields, payments, appointments, signature | Logic and calculations | Payments, bookings, emails | Renderer/theme slots must allow branded pages |
| Cognito Forms | Calculations and repeaters | Business-form rich | Conditional logic everywhere | Repeaters, payments, lookup, workflows | Repeaters/calculations need real contracts before shipping |
| Google Forms | Simple baseline | Basic but familiar | Section branching | Sheets, quizzes, collaboration | Simple forms must be fast and obvious |
| Microsoft Forms | Office survey/quiz baseline | Choice, text, rating, date, ranking, Likert, upload, NPS | Forward branching | Excel, multilingual, accessibility docs | Multilingual and keyboard/screen-reader readiness matter |
| SurveyMonkey | Survey science | Strong survey catalog | Skip logic, advanced branching | Analytics, A/B tests, click maps | Matrix, ranking, NPS, analytics become Phase 2/3 |
| Airtable Forms | Database-backed forms | Table-field driven | Conditional fields, prefill/hide URL values | Records, attachments, field IDs | Data mapping and hidden URL values need privacy warnings |
| HubSpot Forms | CRM lead capture | CRM property-driven | Conditional logic, redirects, multi-step | CRM sync, lead workflows | Adapter mapping, response classification, consent matter |
| Wufoo | Classic form builder | Broad standard fields | Rules, notifications, payments | Reports, payments | Practical admin workflows still expected |
| Formsort | Flow optimization | Question and content components | Conditional steps/groups/redirects | Analytics events, variants, uploads | Partial submissions and analytics events need idempotency |
| Form.io | Developer JSON form platform | Very broad components | Simple/advanced conditions, JSON Logic, custom JS | APIs, embeds, custom components | We should avoid executable JS while keeping declarative power |
| SurveyJS | Developer survey/form library | Very broad survey catalog | Expressions, triggers, panels | Creator, PDF, dashboard | Useful architecture benchmark for expressions and panels |
| Zoho Forms | Business field catalog | Broad, including subform, uploads, audio/video, IDs | Rules | Payments, approvals, CRM | Iran/regional validators can make us more localized |
| Gravity Forms | WordPress power forms | Broad, add-on ecosystem | Conditional logic, calculations | Payments, uploads, add-ons | Plugin boundaries should be first-class |
| WPForms | WordPress UX-friendly forms | Broad, including repeater, rich text, NPS, payments | Conditional logic | Payments, surveys, signatures | Inspector UX should expose power without raw schema |
| Webflow | Visual layout and states | Simple form elements | Basic states/actions | Styling, redirects, custom actions | Form layout and states must feel designed |
| Framer | Design-native forms | 10+ input types | Design states, redirects | Webhooks, Sheets, spam protection | Visual states and icons matter in the builder |
| Notion Forms | Database-native forms | Database property driven | Limited conditional logic | Database records, share links | Quick creation and property mapping matter |
| Retool Forms | Internal tool/database forms | Component-driven | Validation and event handlers | Queries and database CRUD | Generate from schema/data is valuable later |

## 4. Component Inventory

| Component | Common aliases | Competitor support pattern | Recommended product placement |
| --- | --- | --- | --- |
| Short text | Text, single line, single textbox | Universal | Core, renderer, builder |
| Long text | Paragraph, comment box, textarea | Universal | Core, renderer, builder |
| Rich text answer | Rich text, formatted response | WPForms and some advanced products | Phase 3, plugin or strict sanitized field |
| Number | Numeric, integer, decimal | Universal | Core, renderer, builder |
| Currency | Price, money, amount | Jotform, Paperform, Cognito, Zoho, Form.io | Core value contract plus validators; builder Phase 2 |
| Percent | Percentage | Airtable/Fillout data-style products | Validators Phase 2 |
| Email | Email address | Universal | Core, renderer, builder |
| Phone | Phone number | Universal | Core plus validators; Iran-aware Phase 2 |
| URL | Website | Broad | Core, renderer, builder |
| Password/secret | Secret, masked text | Developer/admin tools more than survey tools | Phase 2, sensitive-data contract |
| Hidden field | URL param, tracking field, variable | Broad | Core and builder settings |
| Read-only/display value | Calculation display, display-only value | Broad | Core display/computed contract |
| Single choice | Radio, multiple choice single | Universal | Core, renderer, builder |
| Multiple choice | Checkboxes, multiple select choices | Universal | Core, renderer, builder |
| Single checkbox | Consent, decision box, yes/no | Universal | Core, renderer, builder |
| Dropdown | Select, single select | Universal | Core, renderer, builder |
| Multi-select | Multi dropdown, multiple select | Broad | Core value contract; builder Phase 2 |
| Image choice | Picture choice | Jotform, SurveyMonkey, Typeform-like products | Phase 2 |
| Boolean switch | Toggle, yes/no | Common | Core, renderer, builder |
| Ranking | Rank order | Tally, Typeform, SurveyMonkey, Microsoft | Phase 2 |
| Matrix/grid | Matrix, Likert, choice grid | Google, SurveyMonkey, Tally, Microsoft, WPForms | Phase 2 |
| Best-worst scale | MaxDiff, best/worst | SurveyMonkey | Phase 3 survey module |
| Date | Date picker | Universal | Core, renderer, builder |
| Time | Time picker | Broad | Core, renderer, builder |
| Date-time | Timestamp | Zoho, Form.io, data-backed tools | Phase 2 |
| Date range | Start/end date | Paperform and scheduling tools | Phase 2 |
| Time duration | Duration | Airtable/Fillout data-style tools | Phase 2 |
| Appointment | Booking, scheduling | Paperform, Typeform via integrations, Calendly embeds | Adapter/plugin |
| Rating | Icons, stars, hearts, smileys | Broad | Core, renderer, builder |
| Opinion/linear scale | Scale, linear scale | Google, SurveyMonkey, Typeform | Core, renderer, builder |
| NPS | Net Promoter Score | SurveyMonkey, Typeform, Microsoft, WPForms | Phase 2 survey module |
| CSAT/CES | Satisfaction/effort score | Survey products | Phase 2/3 |
| Slider | Number slider | SurveyMonkey, Paperform, WPForms, Zoho | Phase 2 |
| Name | First/last/title/suffix | Broad | Compound field Phase 2 |
| Address | Address block | Broad | Compound field Phase 2 |
| Contact info | Contact block | Typeform, survey/CRM products | Phase 2 |
| Company/job title | CRM/contact fields | HubSpot, SurveyMonkey | Phase 2 presets |
| Iran province/city | Province, city, ostan/shahr | Regional requirement, not common globally | Core custom field key plus Iran plugin/validators |
| File upload | Attachment | Broad | Metadata in core; orchestration in uploads/adapters |
| Image upload | Camera/photo upload | Paperform, Zoho, WPForms | Uploads Phase 2 |
| Signature | E-signature, drawn signature | Jotform, Tally, Paperform, Formstack, WPForms | Plugin/Phase 2 with upload lifecycle |
| Payment | Stripe/PayPal/Square checkout | Jotform, Typeform, Tally, Paperform, Cognito | Plugin/adapter |
| Product/order item | Product, SKU, quantity, total | Paperform, WPForms, Jotform, Cognito | Plugin/Phase 2 |
| Coupon/discount | Promo code | WPForms, payment products | Payment plugin |
| Table/repeating rows | Data grid, edit grid | Cognito, Form.io, Fillout, WPForms | Phase 3 after contracts |
| Repeater/subform | Repeating section, subform, panel dynamic | Cognito, Fillout, Form.io, WPForms | Phase 3 |
| Location | Coordinates, map | Fillout, WPForms/Zoho-style | Adapter/plugin |
| Voice/video response | Audio/video upload/recording | Zoho, VideoAsk-like adjacent tools | Phase 3/plugin |

## 5. Feature Inventory

| Feature | Market expectation | Product scope recommendation |
| --- | --- | --- |
| Conditional visibility | Table stakes | Core condition runtime, builder visual rule editor |
| Conditional requiredness | Common in serious tools | Core validation semantics plus builder UI |
| Conditional defaults | Advanced | Need default-value expression contract |
| Conditional option filtering | Advanced/data-connected | Adapter-backed options plus condition contract |
| Skip logic/branching | Table stakes for multi-step forms | Core step routing with cycle/forward rules |
| Multiple endings | Common in Typeform/Tally/Fillout | Renderer and builder Phase 2 |
| Calculations | Common in Tally/Cognito/Paperform | Need deterministic expression contract |
| Scores/quizzes | Common in Google/Microsoft/SurveyMonkey | Phase 2 survey/quiz contract |
| Answer piping | Common in Typeform/Tally/Paperform | Renderer text interpolation, no executable code |
| URL parameter capture | Table stakes | Core hidden/default source contract and privacy warnings |
| Prefill | Table stakes for CRM/database forms | Adapter and URL prefill model |
| Dynamic options | Fillout/Airtable/HubSpot class | Adapter contract, cache, loading/error states |
| Data lookup/record picker | Advanced | Adapter/plugin, not core-only |
| Edit existing response | Advanced | Adapter contract and revision safety |
| Partial submissions | Advanced but important | Submission frequency and idempotency contract |
| Save and continue later | Advanced | Token/session adapter contract |
| Drafts | Builder table stakes | Already foundation-level, needs polished UX |
| Version history | Serious product expectation | Already architected, needs UI |
| Publish flow | Table stakes | Already foundation-level, needs migration warnings |
| Revision diff warnings | Critical for package product | Core/builders/devtools |
| Dangerous submitted path changes | Critical | Already core concept; needs builder UX warnings |
| Undo/redo | Builder table stakes | Already foundation-level, needs icons and command labels |
| Duplicate/delete/move | Builder table stakes | Present but visually rough |
| Drag and drop | Builder table stakes | Present foundation, needs richer nested/layout behavior |
| Keyboard add/reorder | Accessibility table stakes | Present foundation, needs full quick-add workflow |
| Component search/quick add | Tally/Notion expectation | Builder Phase 1 |
| Preview | Table stakes | Present and correctly uses real renderer |
| Theme/design customization | Table stakes | Themes readiness exists; needs product UI |
| Localization/RTL | Required for this product | Needs dedicated OpenSpec and implementation |
| Accessibility checks | Serious product expectation | Devtools/builder diagnostics |
| CAPTCHA/bot protection | Common | Plugin/adapter |
| Webhooks | Common | Adapters Phase 2 |
| Email notifications | Common | Adapter/examples |
| Response copy | Common | Adapter/examples |
| Redirects | Common | Renderer/builder setting |
| PDF generation | Common advanced | Adapter/plugin |
| CSV/JSON export | Table stakes for hosted-like demo | Examples/adapters/devtools |
| Analytics/drop-off | Advanced but visible | Devtools/adapters Phase 3 |
| Integrations | Expected | Thin adapters and plugin boundaries |
| Collaboration/permissions | Enterprise | Host app/plugin, not core MVP |
| Audit logs | Enterprise | Adapter/event contract |
| Templates | Table stakes for adoption | Examples/docs and builder import |
| AI form generation | Market differentiator | Later, creates schema drafts only |

## 6. Component-By-Component Deep Specification

The table below compresses the required behavior for each component into implementation-relevant rows. All persisted configuration must be JSON-serializable. All custom behavior is referenced by registered string keys, never executable code.

| Component | Respondent runtime | Builder configuration | Value shape and validation | Logic, accessibility, localization, backend, JSON Schema, migration |
| --- | --- | --- | --- | --- |
| Short text | One-line text input with label, help, placeholder, errors, autocomplete | Label, name, description, placeholder, default, min/max length, regex, trim/case, autocomplete, sensitive flag | `string`; required, min/max/exact length, pattern, custom validator | Conditions use string operators. Accessible label required. Normalize Persian/Arabic digits optionally. JSON Schema string. Changing to non-string is breaking. |
| Long text | Multi-line textarea with optional counter | Rows, max length, placeholder, default, resize behavior | `string`; length/pattern/custom rules | Same as short text. Mobile keyboard multiline. JSON Schema string. |
| Rich text answer | Sanitized rich editor or plain fallback | Allowed formatting, links/images, max length, sanitizer profile | Sanitized string or structured rich-text JSON | High security risk. Requires sanitizer contract, export model, accessibility toolbar. JSON Schema likely string/object with diagnostics. Phase 3. |
| Number | Numeric input with locale-aware display | Decimal/integer mode, min/max/step, units, prefix/suffix | `number` or decimal string for precision-sensitive modes | Persian digit parsing, decimal separators, mobile numeric keyboard. JSON Schema number/integer. Changing precision mode is risky. |
| Currency | Amount input with currency display | Currency code, minor units, decimals, min/max, display locale | Prefer decimal string plus currency code, or number minor units after contract | Needs money contract before implementation. JSON Schema string pattern or object. Payment plugins consume but do not own core value. |
| Percent | Numeric percent input | Scale 0-1 vs 0-100, decimals, min/max | `number` with explicit scale | Must not silently change scale. JSON Schema number. Migration warning on scale change. |
| Email | Email input | Placeholder, domain allow/deny, autocomplete | `string`; email validation | HTML autocomplete `email`. Backend must revalidate. JSON Schema `format: email`. |
| Phone | Tel input | Country default, allowed countries, format, extension, E.164 normalization | Prefer object `{raw,countryCode,e164,extension}` or string after contract | Iran mobile validation belongs in validators. JSON Schema depends on shape. Changing string/object is breaking. |
| URL | URL input | Protocol requirement, allowed domains | `string`; URL validation | JSON Schema `format: uri` where representable. |
| Password/secret | Masked input, no autocomplete unless allowed | Min/max, complexity, reveal toggle, retention, submit policy | `string`, sensitive | Security: redact logs/analytics/exports. Usually out of ordinary survey scope. |
| Hidden field | Not rendered | Name, source URL param/static/adapter, default, preserve policy, trust warning | Scalar/array/object based on declared value type | Must warn that URL-hidden values are not secure. Hidden semantics already core-critical. JSON Schema includes if submitted. |
| Read-only/display value | Visible text/value, non-editable | Source static/default/calculation, submit or display-only | Any declared type if submitted | If submitted, mark read-only in schema and backend contract. Not same as disabled. |
| Single choice/radio | Radio list/cards, one selected | Options editor, stable values, labels, descriptions, disabled options, randomize, "other", default | `string`/`number`/`boolean` option value; required, allowed option | Needs real option editor. Accessibility radio group. RTL ordering. JSON Schema enum. Changing option value is breaking; label change is not. |
| Multiple choice/checkbox group | Checkbox list/cards, many selected | Options, min/max selected, exclusive "none", other, randomize | Array of option values | JSON Schema array enum items. Must validate unknown options fail closed. |
| Single checkbox/consent | One checkbox with consent text | Required checked, legal copy, link handling, default | `boolean` | Consent should store label/version snapshot in submission meta if legal. JSON Schema boolean. |
| Dropdown | Native/select or combobox for long lists | Options, placeholder, searchable, clearable, default | Single option value or null | Native select for accessibility unless custom combobox fully tested. JSON Schema enum. |
| Multi-select | Combobox/tags/listbox | Options, min/max, search, clear, select all | Array values | Requires robust keyboard listbox behavior. JSON Schema array enum. Phase 2. |
| Image choice | Clickable image cards | Images, alt text, labels, values, single/multiple, layout | Single value or array | Alt text required. Image asset lifecycle. JSON Schema enum/array. |
| Boolean switch | Toggle with label | On/off labels, default, required? | `boolean` | Must have checkbox semantics. Avoid switch for required legal consent. |
| Ranking | Drag/drop or numbered order list | Options, min/max ranked, require all, randomize initial order | Ordered array of option values | Keyboard reorder required. JSON Schema array enum with uniqueItems. Phase 2. |
| Matrix/grid | Rows x columns table | Row labels, column labels/values, single/multiple per row, weights, required rows | Object keyed by row id to value(s), or array rows after contract | Mobile layout critical. Keyboard table navigation. JSON Schema object/array. Phase 2. |
| Likert scale | Matrix with agreement columns | Scale labels, row statements, neutral, required | Same as matrix | Survey analytics need weights. |
| Best-worst scale | Select best and worst per task | Items, task generation, validation no same best/worst | Object `{best,worst}` per set | Survey-specific advanced field. Phase 3. |
| Date | Date input/calendar | Format, min/max, past/future, disabled dates, calendar system | ISO date string `YYYY-MM-DD` | Jalali display can map to Gregorian storage or explicit calendar contract. JSON Schema string format/date. |
| Time | Time input | 12/24 hour, minute step, min/max | `HH:mm` or ISO time string | Locale display separate from submitted shape. JSON Schema string format/time. |
| Date-time | Date and time | Timezone handling, default now, min/max | ISO datetime string plus timezone policy | High migration risk if timezone policy changes. Phase 2. |
| Date range | Start/end dates | Include time, min duration, max duration, no overlap | Object `{start,end}` | Cross-field validation. JSON Schema object. |
| Duration | Time duration | Units, min/max, display format | ISO 8601 duration or numeric seconds after contract | Needs precise shape. Phase 2. |
| Appointment | Calendar booking UI | Provider, availability, timezone, buffers, cancellation | Booking object/provider reference | Adapter/plugin only. Needs provider lifecycle and privacy contract. |
| Rating/star | Click/select icons | Symbol, scale, labels, allow clear, default | `number` | Keyboard arrow/select support. JSON Schema number enum/range. |
| Opinion/linear scale | Numeric buttons/range labels | Min/max, step, left/right labels, icons | `number` | RTL may mirror visual order but preserve values. JSON Schema number. |
| NPS | 0-10 recommendation scale | Labels, follow-up, category thresholds | `number` 0-10 | Analytics classify detractor/passive/promoter. Phase 2. |
| CSAT/CES | Satisfaction/effort score | Scale type, labels, thresholds | `number` | Survey analytics module. |
| Slider | Range slider with value | Min/max/step, marks, unit, show value | `number` | Keyboard arrow/page/home/end. JSON Schema number. |
| Name | Compound first/last/etc. | Visible subfields, required per part, locale order | Object or flattened paths after contract | Requires submitted path strategy. JSON Schema object. Phase 2. |
| Address | Compound address | Country list, required parts, province/state, postal | Object or flattened paths | Iran province/city variant can specialize. JSON Schema object. |
| Contact info | Name/email/phone/company block | Included subfields and mapping | Object or multiple named fields | Better as builder preset over multiple fields unless compound contract defined. |
| Company/job title | Text presets | Labels and autocomplete | `string` | Likely presets in builder, not new core types. |
| File upload | File picker/progress, list of uploaded files | Max files, types, max size, provider, virus scan status | Array of trusted file metadata | Current core supports metadata, not orchestration. Upload lifecycle belongs in `packages/uploads`/adapters. JSON Schema metadata object/array. |
| Image upload | Camera/gallery/upload | Same as file plus image dimensions/preview/crop | File metadata with image attrs | Mobile camera behavior. Uploads Phase 2. |
| Signature | Draw/type/upload signature | Required, clear, typed vs drawn, legal text | File metadata or signature asset object | Pointer-only is accessibility risk; provide typed alternative. Upload lifecycle required. |
| Payment | Hosted checkout/payment question | Provider, products, amount, currency, coupons, taxes | Payment intent/reference, not card data | Never store card data. Plugin/adapter. JSON Schema only references result object. |
| Product/order item | Product selector, quantity, total | SKU, price, inventory, quantity, variants | Array/object order line items | Pricing/currency/calculation contract. |
| Coupon/discount | Code entry | Provider validation, allowed codes | Discount result object | Payment plugin. |
| Table/repeating rows | Spreadsheet-like rows | Columns, add/delete rows, min/max rows, summaries | Array of row objects | Needs path grammar, validation, focus, migration. Phase 3. |
| Repeater/subform | Add repeated groups | Child fields, min/max items, labels, summary | Array of objects | Core currently rejects repeaters. Needs full OpenSpec before implementation. |
| Location | Map/current location | Coordinates, address lookup, permissions | `{lat,lng,accuracy,address?}` | Privacy-sensitive. Adapter/plugin. |
| Voice response | Recorder/upload | Max duration, transcript, consent | File metadata plus transcript | Plugin. Accessibility fallback text. |
| Video response | Camera/upload | Max duration/size, thumbnail, transcript | File metadata plus transcript | Plugin. High privacy/storage cost. |

## 7. Builder UX Requirements

A credible builder needs these surfaces:

- Left palette grouped by Basic, Choice, Date/Time, Survey, Contact, Uploads, Content, Layout, Logic, Integrations, Advanced.
- Component search and quick add, including keyboard `/` or command palette behavior inspired by Tally/Notion.
- Canvas blocks with product icons, field type names, labels, required/hidden/logic badges, error badges, drag handles, duplicate, delete, move up/down, and collapse controls.
- Real option editor for choices. Admins must add options one by one, bulk paste lists, reorder options, edit labels and stable values separately, disable options, set defaults, and add "Other".
- Inspector tabs: Content, Choices, Validation, Logic, Appearance, Data, Accessibility, Advanced.
- Visual rule editor. No admin should need to write JSON for common logic.
- Preview using the real renderer, with desktop/mobile and LTR/RTL modes.
- Publish panel with checklist, diff warnings, dangerous submitted path warnings, JSON Schema compiler diagnostics, and revision creation.
- Results/devtools panel for submission preview, normalized JSON, hidden value behavior, and backend response simulation.
- Empty, loading, saving, conflict, invalid-drop, disabled, selected, focus, hover, drag, publish-blocked, and schema-error states.
- Icon buttons for movement, duplicate, delete, undo, redo, preview, publish, settings, search, add, collapse, and expand. Text-only "Up", "Dn", and "Cp" controls are not production-grade.

## 8. Respondent Runtime Requirements

The runtime should support:

- Classic multi-question page forms.
- Multi-step/page forms with progress and back/next behavior.
- Future one-question-at-a-time conversational mode.
- Field chrome: label, description, required marker, optional marker policy, error text, success/warning text, counters, help tooltips.
- Hidden, disabled, read-only, and conditionally required behavior from core rules.
- Draft save/restore and partial submission only after contracts exist.
- Multiple endings and redirects after Phase 2.
- Accessible validation timing, focus movement, and error summary.
- RTL mirroring, localized labels, localized validation messages, and locale-aware formatting.
- Mobile-first layouts for matrix, ranking, file upload, signature, and date/time controls.

## 9. Inspector Settings Model

Universal settings:

- Content: label, description, placeholder, default value, submitted name/path.
- Validation: required, field-specific rules, custom registered validators, error messages.
- Logic: visibility, requiredness, jump/ending, default, option filtering, calculation dependencies.
- Appearance: width, layout, label visibility, input size, icon, helper/counter display.
- Data: backend mapping, analytics name, PII/sensitive flag, retention/export policy.
- Accessibility: accessible label override, described-by help, focus behavior, keyboard notes.
- Advanced: custom field key/version, custom validator key/version, migration notes, developer metadata.

Choice settings:

- Options as structured rows: `id`, `label`, `value`, `description`, `disabled`, `default`, `score`, `image`, `metadata`.
- Values are stable submitted contract values. Labels are translatable display text.
- Reordering labels is safe. Changing values, deleting options with responses, changing single to multiple, or changing option type requires migration warnings.

Logic settings:

- `when`: field, operator, value, condition group.
- `then`: show/hide, require/unrequire, jump, end, redirect, set default, calculate, assign score, filter options, fire integration.
- Builder should emit the existing declarative condition model and reject unsupported operations.

## 10. Logic, Branching, Calculations, And Data Flow

Table-stakes logic:

- Show/hide fields, content, sections, pages, and endings.
- Require/unrequire fields.
- Skip to a later step or ending.
- Redirect after submit.
- Use hidden fields and URL params.

Advanced logic:

- Multiple condition groups with AND/OR.
- Conditional option filtering.
- Conditional defaults.
- Answer piping in labels, descriptions, thank-you screens, and emails.
- Calculations and scoring.
- Integration conditions and webhooks.

Required contracts before advanced implementation:

- Expression language, supported operators, type system, rounding behavior, date math, currency math, dependency graph, cycle detection, and backend parity.
- Rule execution order and conflict resolution when multiple rules target the same node.
- Hidden value semantics when a field becomes hidden after being answered.
- Branching constraints to avoid loops or orphaned required fields.
- Submitted data behavior for calculated, read-only, hidden, disabled, and display-only nodes.

Package mapping:

- `packages/core`: condition evaluation, dependency tracking, hidden semantics, type-safe diagnostics.
- `packages/react-builder`: visual rule editor, dependency graph view, migration warnings.
- `packages/react-renderer`: runtime rule application, focus/navigation behavior, piping display.
- `packages/validators`: JSON Schema diagnostics for unrepresentable rules.
- `packages/devtools`: rule debugger and condition trace.

## 11. Validation Requirements

Validation must be layered:

- Schema validation before save and publish.
- Runtime client validation from canonical schema.
- Backend validation from normalized contract and optional generated JSON Schema.
- Compiler diagnostics for unsupported JSON Schema generation.
- Custom validators by registered key and version only.

Field validation inventory:

- Text: required, min/max/exact length, regex, allowed/disallowed, email, URL, domain, trim.
- Number/currency/percent: min/max, integer/decimal, step, precision, currency code, nonnegative.
- Choices: required, allowed values, min/max selected, unique, disallow unknown values.
- Date/time: min/max, past/future, weekday/weekend, disabled dates, timezone policy.
- File/upload: max files, file types, size, provider status, trusted file IDs.
- Matrix/ranking: required rows, unique ranking, best/worst cannot match.
- Compound fields: per-subfield and group-level requiredness.
- Iran validators: mobile number, landline optional, national ID, postal code, province/city consistency, Persian/Arabic digit normalization.

Validation UX:

- Inline errors near fields.
- Optional error summary.
- Focus first invalid field on submit.
- Do not validate hidden fields unless policy says preserved hidden values must remain valid.
- Disabled/read-only validation semantics must be explicit.

## 12. Accessibility And Keyboard Requirements

Builder:

- Keyboard add, select, reorder, duplicate, delete, undo, redo, and inspector focus.
- Visible focus rings.
- Screen-reader announcements for drag start, valid drop, invalid drop, reorder, add, duplicate, delete.
- Icon buttons need accessible names and tooltips.
- Drag-and-drop must have keyboard alternatives before nested layouts are considered complete.

Renderer:

- Every input has an accessible name.
- Help text and errors are connected with `aria-describedby`.
- Required and invalid states are exposed semantically.
- Radio/checkbox groups use fieldsets or equivalent group semantics.
- Custom combobox/listbox/slider/ranking controls follow ARIA keyboard patterns.
- Matrix fields need a mobile alternative and meaningful row/column labels.
- Signature fields need non-pointer alternatives.
- File upload needs keyboard upload/remove, progress, and error announcements.

## 13. Localization, RTL, Date/Time, Number, And Currency Requirements

Localization is not just translation. It affects schema, renderer, builder, validation, and migration:

- Persist stable node ids and option values independent from translated labels.
- Store translations for labels, descriptions, placeholders, help, errors, option labels, endings, buttons, and notifications.
- Support `dir: "rtl" | "ltr" | "auto"` at form and locale level.
- Mirror directional icons and movement controls in RTL while preserving logical value order where required.
- Normalize Persian and Arabic digits before numeric validation when locale policy enables it.
- Define date storage separately from display calendar. Recommended: store ISO Gregorian dates initially; support Jalali display/input through renderer and validation mapping after an explicit contract.
- Currency requires ISO currency code, decimal/minor-unit policy, locale display, and precision-safe submitted shape.
- Phone/address/province fields need country-specific validators and datasets as packages or plugins, not hard-coded into core.

Recommended Iran/Persian package boundary:

- `packages/core`: generic locale/direction/value contracts.
- `packages/validators`: Iran validators by registered keys.
- `packages/react-renderer`: Persian digit normalization, RTL rendering, Jalali display adapter.
- `packages/react-builder`: Persian builder strings and Iran field presets.
- `packages/adapters` or plugin: Iran province/city dataset and dynamic option updates.

## 14. Backend And Submission Contract Implications

The normalized submission contract should remain the product boundary:

- Always include form id, revision id, revision hash, schema version, locale, submitted data, file metadata, and idempotency/attempt identifiers.
- Submitted names are backend contracts. Changing them after publish is dangerous.
- Option submitted values are backend contracts. Changing labels is safe; changing values is dangerous.
- Hidden URL-prefilled values are not secure. Backend must not trust them for identity, price, role, or permissions.
- File uploads should submit trusted backend/provider file ids and metadata, not browser `File` objects.
- Payment fields should submit provider references and verified statuses, never raw card data.
- Partial submissions need a separate status and frequency contract.
- Edit-existing-response needs revision compatibility and conflict handling.

## 15. JSON Schema Compiler Implications

Representable:

- Basic scalar fields.
- Email/URL formats.
- Required fields.
- Min/max length, pattern, min/max number, enum, arrays of enums.
- Simple object shapes for compound fields after specified.
- File metadata shapes if upload lifecycle is represented as metadata only.

Diagnostic or unsupported without extra contracts:

- Conditional visibility as UI behavior.
- Branching, endings, redirects, and answer piping.
- Calculations and scoring unless expression output type is known.
- Dynamic options and external lookup.
- Upload provider lifecycle.
- Payment provider lifecycle.
- Rich text sanitization profiles.
- Repeaters before path and validation semantics are finalized.
- Custom validators/predicates not registered with backend parity.

Compiler should fail closed with diagnostics rather than silently generating weak schemas.

## 16. Migration And Revisioning Implications

Dangerous changes:

- Changing submitted name/path.
- Changing field scalar/array/object shape.
- Changing option value or deleting an option that may exist in submissions.
- Changing hidden value policy.
- Changing currency precision or value representation.
- Changing date/time timezone or calendar storage policy.
- Changing upload field from single to multiple or provider lifecycle.
- Moving fields into/out of repeater contexts.
- Changing custom field, validator, or predicate key/version.

Safe or usually safe changes:

- Label, description, placeholder, help text.
- Option label when value remains stable.
- Visual layout width.
- Translations.
- Non-contract theme settings.

Builder must show diff warnings before publish and preserve immutable published revisions.

## 17. Integration And Plugin Boundaries

Core product packages:

- `packages/core`: schema contracts, path safety, conditions, hidden semantics, validation primitives, normalization, migrations, diagnostics.
- `packages/react-renderer`: respondent rendering, accessibility, field registry, slots, runtime navigation.
- `packages/react-builder`: palette, canvas, inspector, commands, undo/redo, DnD, preview, publish checks.
- `packages/validators`: JSON Schema compiler and backend-friendly diagnostics.
- `packages/uploads`: upload contracts, prepare/finalize helpers, progress and trusted metadata.
- `packages/adapters`: REST/GraphQL/fetch helpers for agreed JSON contracts.
- `packages/themes`: starter theme tokens and CSS variables.
- `packages/devtools`: schema, condition, submission, migration, and compiler inspection.

Plugin/adapter features:

- Payments and coupons.
- Appointment scheduling.
- CAPTCHA/bot protection.
- Email notifications.
- Webhooks.
- PDF generation.
- CRM/database lookup and update.
- AI generation.
- Analytics destinations.
- Collaboration/permissions/audit logs, unless host app provides them.

## 18. MVP Vs Phase 2 Vs Phase 3 Vs Enterprise Recommendations

MVP completion hardening:

- Expose all existing field types in builder: text, textarea, number, email, phone, URL, radio, checkbox group, select, checkbox, switch, date, time, rating, linear scale, hidden, read-only/display.
- Add content blocks: heading, paragraph, image, divider, section, page/step, welcome, ending.
- Add visual options editor.
- Add visual validation editor for common rules.
- Add visual logic editor for show/hide and requiredness.
- Add icons/tooltips for builder actions.
- Add Persian/RTL strings and digit normalization foundation.

Phase 2:

- Multi-select, image choice, ranking, matrix/Likert, NPS/CSAT/CES, slider.
- Date-time, date range, duration.
- File upload orchestration and image upload.
- Multiple endings, redirects, response copy, webhooks.
- Calculations/scoring after expression contract.
- Theme/customization UI.
- Templates and quick-start examples.
- Iran province/city, mobile, national ID, postal validators.

Phase 3:

- Repeaters/subforms/table rows.
- Dynamic options, lookup/record picker, edit existing response.
- Partial submissions and save/continue later.
- Signature.
- PDF generation.
- Analytics/drop-off.
- Conversational one-question-at-a-time mode.

Enterprise/plugin:

- Payments/products/coupons/taxes.
- Approval workflows.
- Collaboration/roles/permissions.
- Audit logs.
- HIPAA/GDPR/data residency controls.
- AI generation and AI field suggestions.
- Voice/video response.
- A/B tests, click maps, journey analytics.

Out of scope for persisted schema:

- Arbitrary executable JavaScript.
- Persisted React components.
- Backend-specific ORM models.
- Raw payment card data.
- Trusting hidden URL values for security decisions.

## 19. Gap Analysis Against Our Current Product

What we have:

- Good package boundaries.
- Core canonical schema and safety foundation.
- Submitted path and dangerous key protection.
- Conditions, validation, submissions, backend responses, migrations, diagnostics.
- JSON Schema compiler package.
- React renderer foundation.
- Builder shell with palette, canvas, inspector, preview, DnD, keyboard workflow, publish checklist, persistence states, and revision comparisons.
- Preview correctly uses the real renderer.

What feels demo-like today:

- Builder palette exposes only a narrow set of fields: text, textarea, email, phone, number, date, select, radio, checkbox.
- Core supports more field types than the builder exposes, including URL, checkbox group, switch, time, rating, linear scale, and file metadata.
- Dropdown/radio options are edited as a textarea using `First option=first` lines. This is the clearest "demo" signal.
- Logic is edited as raw condition JSON. Serious builders provide rule builders.
- Quick actions use text abbreviations like Up, Dn, Cp instead of icons with tooltips.
- Inspector settings are generic and shallow compared with field-specific panels.
- No visible Persian UI, Iran validators, Iran province/city fields, Jalali behavior, or Persian digit normalization.
- No content/layout block catalog in the builder.
- No visual validation builder.
- No templates or examples showing real production forms.
- No results/submissions/analytics surface beyond adapter foundations.
- No dynamic options, lookup, partial submissions, save/continue, file upload lifecycle, signatures, payments, or calculations yet.

The conclusion: the phases finished the MVP architecture and foundation, not the full product vision. That was a good first stage, but now the product needs a second planning cycle focused on real builder/admin UX, full component catalog, localization, and advanced contracts.

## 20. Recommended OpenSpec Changes To Create Next

Recommended first change:

`specify-product-grade-field-and-inspector-model`

Scope:

- Complete field catalog for MVP hardening and Phase 2.
- Structured option model.
- Field-specific inspector settings.
- Content/layout block model.
- Visual validation editor contract.
- Migration warnings for names, values, shapes, hidden policies, and field type changes.
- Builder accessibility states and icon-button requirements.

Recommended second change:

`implement-choice-options-editor-and-expanded-palette`

Scope:

- Add missing builder palette entries for currently supported field types.
- Replace textarea option editing with structured rows, add/reorder/delete, bulk paste, stable values, defaults, disabled, and "other".
- Add tests for option migration warnings and renderer parity.

Recommended third change:

`implement-visual-logic-builder-foundation`

Scope:

- Visual show/hide and requiredness rules.
- AND/OR condition groups using existing condition model.
- No raw JSON for common logic.
- Diagnostics for unsupported operators.

Recommended fourth change:

`specify-persian-iran-localization-pack`

Scope:

- Persian builder/runtime strings.
- RTL mirroring.
- Persian/Arabic digit normalization.
- Jalali display/input decision.
- Iran province/city field model.
- Iranian mobile, postal code, and national ID validators.

Recommended fifth change:

`specify-calculations-uploads-and-repeaters-contracts`

Scope:

- Separate designs for calculation expressions, upload lifecycle, and repeater paths before implementation.

## 21. Source Links

Official/product sources reviewed:

- Jotform features: https://www.jotform.com/features/
- Jotform conditional logic: https://www.jotform.com/help/57-smart-forms-using-conditional-logic/
- Jotform widgets: https://www.jotform.com/widgets/
- Typeform question types: https://help.typeform.com/hc/en-us/articles/360051789692-Question-types
- Typeform file upload: https://help.typeform.com/hc/en-us/articles/360051567012-file-upload-question
- Typeform logic limitations: https://help.typeform.com/hc/en-us/articles/5821097529620-Why-doesn-t-my-question-work-with-logic
- Tally help center: https://tally.so/help
- Tally features: https://tally.so/help/features
- Tally conditional logic: https://tally.so/help/conditional-form-logic
- Tally file uploads: https://tally.so/help/file-uploads
- Tally create a form: https://tally.so/help/create-a-form
- Fillout field types: https://www.fillout.com/docs/help/question-types
- Fillout logic: https://www.fillout.com/help/logic
- Fillout database field types: https://www.fillout.com/help/database/field-types
- Formstack forms features: https://www.formstack.com/online-forms/features
- Formstack workflows: https://www.formstack.com/products/workflows
- Paperform field types: https://paperform.co/help/articles/what-types-of-questions-or-fields-do-paperform-forms-have/
- Paperform help center: https://paperform.co/help/
- Cognito conditional logic: https://www.cognitoforms.com/support/47/calculations/conditional-logic
- Cognito calculations: https://www.cognitoforms.com/support/2/calculations
- Cognito repeating sections/tables: https://www.cognitoforms.com/support/51/calculations/repeating-sectionstables
- Cognito repeating sections product page: https://www.cognitoforms.com/product/repeating-sections-tables
- Cognito payment settings: https://www.cognitoforms.com/support/434/collecting-payment/payment-settings
- Google Forms question types: https://support.google.com/docs/answer/7322334
- Google Forms editing basics: https://support.google.com/docs/answer/2839737
- Google Forms branching by section: https://support.google.com/docs/answer/141062
- Microsoft Forms create a form: https://support.microsoft.com/en-us/office/create-a-form-with-microsoft-forms-4ffb64cc-7d5d-402f-b82e-b1d49418fd9d
- Microsoft Forms branching: https://support.microsoft.com/en-us/office/use-branching-logic-in-your-form-0a092a1c-8fe4-441c-9fc6-cd0aad3b52b2
- Microsoft Forms multilingual forms: https://support.microsoft.com/en-us/office/create-a-multilingual-form-13aa253d-6b73-4f28-b9a1-4a94cece2a75
- Microsoft Forms accessibility with screen readers: https://support.microsoft.com/en-us/office/use-a-screen-reader-to-create-a-new-form-in-microsoft-forms-bce4990c-f74f-488c-8e56-c587e05749db
- SurveyMonkey question types: https://help.surveymonkey.com/en/surveymonkey/create/question-types/
- SurveyMonkey skip logic: https://help.surveymonkey.com/en/surveymonkey/create/question-skip-logic/
- Airtable form views: https://support.airtable.com/docs/getting-started-with-airtable-form-views
- Airtable building and sharing forms: https://support.airtable.com/docs/building-and-sharing-forms-in-airtable
- Airtable form prefill: https://support.airtable.com/docs/prefilling-a-form
- Airtable attachment fields: https://support.airtable.com/docs/attachment-field
- HubSpot create and edit forms: https://knowledge.hubspot.com/forms/create-and-edit-forms
- HubSpot dependent fields: https://knowledge.hubspot.com/forms/use-dependent-form-fields
- Wufoo features: https://www.wufoo.com/features/
- Formsort questions: https://docs.formsort.com/building-flows/adding-content/question-reference
- Formsort flows: https://docs.formsort.com/core-concepts/understanding-flows
- Formsort integrations: https://docs.formsort.com/integrations
- Formsort analytics events: https://docs.formsort.com/integrations/getting-data-out/analytics
- Form.io form components: https://help.form.io/userguide/form-building/form-components
- Form.io logic and conditions: https://help.form.io/userguide/form-building/logic-and-conditions
- Form.io component settings: https://help.form.io/userguide/forms/form-building/form-components/component-settings
- SurveyJS creator end-user guide: https://surveyjs.io/survey-creator/documentation/end-user-guide
- SurveyJS conditional logic and dynamic text: https://surveyjs.io/form-library/documentation/design-survey/conditional-logic
- SurveyJS display logic: https://surveyjs.io/survey-creator/documentation/end-user-guide/form-display-logic
- Zoho Forms field types overview: https://help.zoho.com/portal/en/kb/forms/field-types/articles/field-types-overview
- Zoho Forms form fields: https://help.zoho.com/portal/en/kb/forms/field-types/form-fields/overview/articles/form-fields
- Zoho Forms payment field: https://help.zoho.com/portal/en/kb/forms/payment-options/articles/setting-up-payment-field
- Gravity Forms fields: https://docs.gravityforms.com/fields/
- Gravity Forms file upload: https://docs.gravityforms.com/file-upload/
- WPForms field types: https://wpforms.com/categories/docs/field-types/
- WPForms payment fields: https://wpforms.com/docs/a-complete-guide-to-payment-field-types-in-wpforms/
- Webflow forms overview: https://help.webflow.com/hc/en-us/articles/33961347548563
- Framer native form field types: https://www.framer.com/help/articles/add-different-field-types-to-native-form/
- Framer forms overview: https://www.framer.com/help/articles/how-can-i-add-a-contact-form-to-my-framer-website/
- Framer Forms update: https://www.framer.com/updates/forms
- Notion Forms help: https://www.notion.com/help/forms
- Retool forms overview: https://retool.com/blog/retool-forms
- Softr Forms documentation: https://docs.softr.io/softr-forms
