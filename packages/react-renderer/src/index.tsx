import {
  createContext,
  createElement,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  type Ref
} from "react";

import {
  evaluateCondition,
  parseBackendResponse,
  resolveDefaultValues,
  createSubmissionEnvelope,
  validateFieldValue,
  type BackendResponse,
  type Diagnostic,
  type FieldValidationError,
  type SubmissionEnvelope,
  type ValidationErrorContract,
  type ValidationRule
} from "@your-org/forms-core";
import type { AdapterResult, SubmitFormData } from "@your-org/forms-adapters";

export interface RendererOption {
  id?: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RendererNode extends Record<string, unknown> {
  id: string;
  type: string;
  fieldType?: string;
  name?: string;
  label?: string;
  description?: string;
  children?: string[];
  options?: RendererOption[];
  validation?: ValidationRule[];
  defaultValue?: unknown;
}

export interface RendererSchema extends Record<string, unknown> {
  schemaVersion: string;
  formId: string;
  revisionId: string;
  revisionHash: string;
  locale: string;
  title?: string;
  description?: string;
  settings?: {
    navigation?: "singlePage" | "steps";
    preserveHiddenValues?: boolean;
    [key: string]: unknown;
  };
  nodes: RendererNode[];
}

export interface RendererFieldIds {
  inputId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
}

export interface RendererFieldProps {
  ids: RendererFieldIds;
  node: RendererNode;
  schema: RendererSchema;
  label: string;
  description?: string;
  value: unknown;
  options: RendererOption[];
  required: boolean;
  disabled: boolean;
  errors: string[];
  focusRef: Ref<HTMLElement>;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

export type FieldRenderer = (props: RendererFieldProps) => ReactNode;
export type FieldRegistry = Record<string, FieldRenderer>;

export interface FieldChromeSlotProps {
  field: RendererNode;
  ids: RendererFieldIds;
  label: string;
  description?: string;
  required: boolean;
  disabled: boolean;
  errors: string[];
  children: ReactNode;
}

export interface FormSlotProps {
  children: ReactNode;
  schema: RendererSchema;
  status: RendererSubmissionStatus;
}

export interface SectionSlotProps {
  node: RendererNode;
  children: ReactNode;
}

export interface StepSlotProps {
  node: RendererNode;
  children: ReactNode;
  currentStep: number;
  stepCount: number;
}

export interface MessageSlotProps {
  messages: string[];
  status: RendererSubmissionStatus;
}

export interface NavigationSlotProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export interface RendererSlots {
  Form?: (props: FormSlotProps) => ReactNode;
  Section?: (props: SectionSlotProps) => ReactNode;
  Step?: (props: StepSlotProps) => ReactNode;
  FieldChrome?: (props: FieldChromeSlotProps) => ReactNode;
  Messages?: (props: MessageSlotProps) => ReactNode;
  Navigation?: (props: NavigationSlotProps) => ReactNode;
}

export type RendererSubmissionStatus = "idle" | "submitting" | "success" | "validation_error" | "server_error" | "auth_error" | "rate_limited" | "conflict";

export type SubmissionAdapterResult = BackendResponse | AdapterResult<SubmitFormData> | void;
export type SubmissionAdapter = (envelope: SubmissionEnvelope) => Promise<SubmissionAdapterResult> | SubmissionAdapterResult;

export interface FormRendererProps {
  schema: RendererSchema | Record<string, unknown>;
  registry?: FieldRegistry;
  slots?: RendererSlots;
  onSubmit?: SubmissionAdapter;
  attemptIdFactory?: () => string;
  clock?: () => string;
  locale?: string;
  meta?: Record<string, unknown>;
  className?: string;
}

export interface FormRendererContextValue {
  schema: RendererSchema;
  values: Record<string, unknown>;
  status: RendererSubmissionStatus;
  setValue: (name: string, value: unknown) => void;
}

export const FormRendererContext = createContext<FormRendererContextValue | null>(null);

export function useFormRenderer(): FormRendererContextValue {
  const context = useContext(FormRendererContext);
  if (!context) {
    throw new Error("useFormRenderer must be used inside FormRendererProvider.");
  }
  return context;
}

export interface FormRendererProviderProps extends FormRendererContextValue {
  children?: ReactNode;
}

export function FormRendererProvider({ children, ...value }: FormRendererProviderProps): ReactNode {
  return createElement(FormRendererContext.Provider, { value }, children);
}

export function createDefaultFieldRegistry(overrides: Partial<FieldRegistry> = {}): FieldRegistry {
  return {
    text: TextField,
    textarea: TextareaField,
    number: NumberField,
    email: EmailField,
    phone: PhoneField,
    date: DateField,
    select: SelectField,
    radio: RadioField,
    checkbox: CheckboxField,
    hidden: HiddenField,
    fileMetadata: FileMetadataField,
    ...overrides
  };
}

export function createRendererStyles(): string {
  return [
    ".rfb-form{--rfb-field-gap:0.75rem;--rfb-border-color:#d0d7de;--rfb-error-color:#b42318;display:grid;gap:1rem;}",
    ".rfb-field{display:grid;gap:0.35rem;}",
    ".rfb-label{font-weight:600;}",
    ".rfb-description{color:#57606a;font-size:0.925rem;}",
    ".rfb-error{color:var(--rfb-error-color);font-size:0.925rem;}",
    ".rfb-input{border:1px solid var(--rfb-border-color);border-radius:6px;padding:0.5rem 0.625rem;}",
    ".rfb-navigation{display:flex;gap:0.5rem;}"
  ].join("\n");
}

export function FormRenderer(props: FormRendererProps): ReactNode {
  const schema = normalizeSchema(props.schema);
  const registry = useMemo(() => props.registry ?? createDefaultFieldRegistry(), [props.registry]);
  const slots = props.slots ?? {};
  const nodeModel = useMemo(() => createNodeModel(schema), [schema]);
  const defaultValues = useMemo(() => resolveDefaultValues(schema).value ?? {}, [schema]);
  const [values, setValues] = useState<Record<string, unknown>>(() => defaultValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [globalMessages, setGlobalMessages] = useState<string[]>([]);
  const [status, setStatus] = useState<RendererSubmissionStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const focusTargets = useRef(new Map<string, HTMLElement>());

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const isVisible = useCallback(
    (node: RendererNode): boolean => {
      if (!isRecord(node.visibility)) {
        return true;
      }
      return evaluateCondition(node.visibility as never, { values }).value === true;
    },
    [values]
  );

  const isDisabled = useCallback(
    (node: RendererNode): boolean => {
      if (!isRecord(node.enabledWhen)) {
        return false;
      }
      return evaluateCondition(node.enabledWhen as never, { values }).value !== true;
    },
    [values]
  );

  const visibleSteps = useMemo(
    () => schema.nodes.filter((node) => node.type === "step" && isVisible(node)),
    [schema.nodes, isVisible]
  );
  const activeStep = visibleSteps[Math.min(currentStep, Math.max(visibleSteps.length - 1, 0))];

  const validateNodes = useCallback(
    (nodesToValidate: RendererNode[]): boolean => {
      const nextErrors: Record<string, string[]> = {};
      const diagnostics: Diagnostic[] = [];
      for (const node of nodesToValidate) {
        if (!isSubmittableField(node) || !node.name || !isVisible(node) || isDisabled(node)) {
          continue;
        }
        const result = validateFieldValue({
          fieldType: fieldTypeForNode(node),
          value: values[node.name],
          rules: readValidation(node),
          options: readOptions(node)
        });
        diagnostics.push(...result.diagnostics);
        if (result.errors.length > 0) {
          nextErrors[node.name] = result.errors.map(errorToMessage);
        }
      }
      setFieldErrors(nextErrors);
      focusFirstError(nextErrors, focusTargets.current);
      return Object.keys(nextErrors).length === 0 && diagnostics.length === 0;
    },
    [isDisabled, isVisible, values]
  );

  const currentStepFields = useCallback((): RendererNode[] => {
    if (!activeStep) {
      return [];
    }
    return flattenRenderableChildren(activeStep, nodeModel, isVisible).filter(isSubmittableField);
  }, [activeStep, isVisible, nodeModel]);

  const handleBackendResponse = useCallback((response: BackendResponse) => {
    const parsed = parseBackendResponse(response);
    const parsedResponse = parsed.value;
    if (!parsedResponse) {
      setStatus("server_error");
      setGlobalMessages(["Submission failed."]);
      return;
    }

    setStatus(parsedResponse.status);
    if (parsedResponse.ok) {
      setGlobalMessages([parsedResponse.message ?? "Submission received."]);
      return;
    }

    const serverFieldErrors: Record<string, string[]> = {};
    for (const error of parsedResponse.fieldErrors) {
      if (typeof error.path === "string") {
        serverFieldErrors[error.path] = [...(serverFieldErrors[error.path] ?? []), error.message ?? error.code];
      }
    }
    setFieldErrors(serverFieldErrors);
    setGlobalMessages([
      ...parsedResponse.globalErrors.map((error) => error.message ?? error.code),
      ...(parsedResponse.message ? [parsedResponse.message] : [])
    ]);
    focusFirstError(serverFieldErrors, focusTargets.current);
  }, []);

  const submit = useCallback(async () => {
    const fields = schema.settings?.navigation === "steps"
      ? currentStepFields()
      : schema.nodes.filter(isSubmittableField);
    if (!validateNodes(fields)) {
      return;
    }

    const envelopeResult = createSubmissionEnvelope({
      schema,
      values,
      locale: props.locale ?? schema.locale,
      submissionAttemptId: props.attemptIdFactory?.() ?? `attempt_${Date.now()}`,
      submittedAt: props.clock?.() ?? new Date().toISOString(),
      ...(props.meta ? { meta: props.meta as never } : {})
    });
    if (!envelopeResult.value || envelopeResult.diagnostics.length > 0) {
      setStatus("server_error");
      setGlobalMessages(["Unable to create a valid submission."]);
      return;
    }

    setStatus("submitting");
    const response = await props.onSubmit?.(envelopeResult.value);
    if (!response) {
      setStatus("success");
      setGlobalMessages(["Submission received."]);
      return;
    }

    if (isAdapterResult(response)) {
      if (!response.ok) {
        setStatus(rendererStatusFromAdapter(response.status));
        setGlobalMessages([response.message ?? "Submission failed."]);
        return;
      }
      handleBackendResponse(response.data.response as unknown as BackendResponse);
      return;
    }

    handleBackendResponse(response);
  }, [currentStepFields, handleBackendResponse, props, schema, validateNodes, values]);

  const goNext = useCallback(() => {
    if (!validateNodes(currentStepFields())) {
      return;
    }
    setCurrentStep((value) => Math.min(value + 1, Math.max(visibleSteps.length - 1, 0)));
  }, [currentStepFields, validateNodes, visibleSteps.length]);

  const goPrevious = useCallback(() => {
    setCurrentStep((value) => Math.max(value - 1, 0));
  }, []);

  const renderNode = (node: RendererNode): ReactNode => {
    if (!isVisible(node)) {
      return null;
    }
    if (node.type === "section") {
      const children = flattenDirectChildren(node, nodeModel).map((child) =>
        createElement(Fragment, { key: child.id }, renderNode(child))
      );
      const section = createElement(
        "section",
        { className: "rfb-section", "data-rfb-node-type": "section" },
        node.label ? createElement("h3", { className: "rfb-section-title" }, node.label) : null,
        children
      );
      return slots.Section ? slots.Section({ node, children: section }) : section;
    }
    if (node.type === "step") {
      const children = flattenDirectChildren(node, nodeModel).map((child) =>
        createElement(Fragment, { key: child.id }, renderNode(child))
      );
      const step = createElement(
        "section",
        { className: "rfb-step", "data-rfb-node-type": "step", "data-rfb-current-step": "true" },
        node.label ? createElement("h3", { className: "rfb-step-title" }, node.label) : null,
        children
      );
      return slots.Step ? slots.Step({ node, children: step, currentStep, stepCount: visibleSteps.length }) : step;
    }
    if (node.type !== "field" && node.type !== "hidden") {
      return createElement("div", { role: "status", className: "rfb-unsupported" }, "Unsupported node");
    }
    return renderFieldNode(node);
  };

  const renderFieldNode = (node: RendererNode): ReactNode => {
    const fieldType = fieldTypeForNode(node);
    const renderer = registry[fieldType];
    if (!renderer || !node.name) {
      return createElement(
        "div",
        { role: "status", className: "rfb-unsupported", "data-rfb-field-type": fieldType },
        "Unsupported field"
      );
    }
    const ids = createFieldIds(node);
    const errors = node.name ? fieldErrors[node.name] ?? [] : [];
    const fieldProps: RendererFieldProps = {
      ids,
      node,
      schema,
      label: node.label ?? node.name,
      ...(node.description ? { description: node.description } : {}),
      value: values[node.name],
      options: readOptions(node),
      required: isRequired(node),
      disabled: isDisabled(node),
      errors,
      focusRef: (element) => {
        if (element instanceof HTMLElement) {
          focusTargets.current.set(node.name ?? node.id, element);
        }
      },
      onChange: (value) => setValue(node.name ?? node.id, value),
      onBlur: () => setTouched((current) => ({ ...current, [node.name ?? node.id]: true }))
    };
    const field = renderer(fieldProps);
    if (node.type === "hidden") {
      return field;
    }
    const chromeProps: FieldChromeSlotProps = {
      field: node,
      ids,
      label: fieldProps.label,
      ...(fieldProps.description ? { description: fieldProps.description } : {}),
      required: fieldProps.required,
      disabled: fieldProps.disabled,
      errors,
      children: field
    };
    return slots.FieldChrome ? slots.FieldChrome(chromeProps) : DefaultFieldChrome(chromeProps);
  };

  const content = schema.settings?.navigation === "steps" && activeStep
    ? renderNode(activeStep)
    : nodeModel.rootNodes.map((node) => createElement(Fragment, { key: node.id }, renderNode(node)));

  const navigation = schema.settings?.navigation === "steps" && activeStep
    ? renderNavigation({
      canGoPrevious: currentStep > 0,
      canGoNext: currentStep < visibleSteps.length - 1,
      isSubmitting: status === "submitting",
      onPrevious: goPrevious,
      onNext: goNext,
      onSubmit: () => {
        void submit();
      }
    }, slots)
    : createElement(
        "button",
        { type: "button", className: "rfb-button rfb-submit-button", onClick: () => void submit(), disabled: status === "submitting" },
        "Submit"
      );

  const messages = slots.Messages
    ? slots.Messages({ messages: globalMessages, status })
    : createElement(
      "div",
      { className: "rfb-messages", "data-rfb-submission-status": status },
      globalMessages.map((message) => createElement("p", { key: message }, message))
    );

  const form = createElement(
    "form",
    {
      className: ["rfb-form", props.className].filter(Boolean).join(" "),
      "data-rfb-submission-status": status,
      onSubmit: (event: FormEvent) => {
        event.preventDefault();
        void submit();
      }
    },
    schema.title ? createElement("h2", null, schema.title) : null,
    schema.description ? createElement("p", className("rfb-form-description"), schema.description) : null,
    createElement(FormRendererProvider, { schema, values, status, setValue }, content),
    messages,
    createElement("div", { className: "rfb-navigation" }, navigation)
  );

  return slots.Form ? slots.Form({ children: form, schema, status }) : form;
}

function DefaultFieldChrome(props: FieldChromeSlotProps): ReactNode {
  const describedBy = [props.description ? props.ids.descriptionId : null, props.errors.length > 0 ? props.ids.errorId : null]
    .filter(Boolean)
    .join(" ") || undefined;
  return createElement(
    "div",
    {
      className: "rfb-field",
      "data-rfb-field-type": fieldTypeForNode(props.field),
      "data-rfb-invalid": props.errors.length > 0 ? "true" : "false",
      "data-rfb-disabled": props.disabled ? "true" : "false"
    },
    props.field.fieldType === "radio"
      ? null
      : createElement("label", { id: props.ids.labelId, className: "rfb-label", htmlFor: props.ids.inputId }, props.label),
    props.description ? createElement("div", { id: props.ids.descriptionId, className: "rfb-description" }, props.description) : null,
    cloneWithDescribedBy(props.children, describedBy),
    props.errors.length > 0
      ? createElement("div", { id: props.ids.errorId, className: "rfb-error", role: "alert" }, props.errors.join(", "))
      : null
  );
}

function TextField(props: RendererFieldProps): ReactNode {
  return createInput(props, "text");
}

function EmailField(props: RendererFieldProps): ReactNode {
  return createInput(props, "email");
}

function PhoneField(props: RendererFieldProps): ReactNode {
  return createInput(props, "tel");
}

function DateField(props: RendererFieldProps): ReactNode {
  return createInput(props, "date");
}

function NumberField(props: RendererFieldProps): ReactNode {
  return createInput(props, "number", (value) => value === "" ? undefined : Number(value));
}

function TextareaField(props: RendererFieldProps): ReactNode {
  return createElement("textarea", commonInputProps(props, String(props.value ?? "")));
}

function SelectField(props: RendererFieldProps): ReactNode {
  return createElement(
    "select",
    commonInputProps(props, String(props.value ?? "")),
    createElement("option", { value: "" }, ""),
    ...props.options
      .filter((option) => !option.disabled)
      .map((option) => createElement("option", { key: option.value, value: option.value }, option.label))
  );
}

function RadioField(props: RendererFieldProps): ReactNode {
  return createElement(
    "fieldset",
    {
      className: "rfb-fieldset",
      role: "radiogroup",
      "aria-describedby": describedBy(props),
      "aria-invalid": props.errors.length > 0 ? "true" : undefined,
      disabled: props.disabled
    },
    createElement("legend", { id: props.ids.labelId }, props.label),
    ...props.options.filter((option) => !option.disabled).map((option) => {
      const id = `${props.ids.inputId}-${option.value}`;
      return createElement(
        "label",
        { key: option.value, htmlFor: id },
        createElement("input", {
          id,
          name: props.node.name,
          type: "radio",
          value: option.value,
          checked: props.value === option.value,
          onBlur: props.onBlur,
          onChange: () => props.onChange(option.value),
          ref: props.focusRef as Ref<HTMLInputElement>
        }),
        option.label
      );
    })
  );
}

function CheckboxField(props: RendererFieldProps): ReactNode {
  return createElement("input", {
    ...commonInputProps(props, Boolean(props.value)),
    checked: Boolean(props.value),
    type: "checkbox",
    onChange: (event: ChangeEvent<HTMLInputElement>) => props.onChange(event.currentTarget.checked)
  });
}

function HiddenField(props: RendererFieldProps): ReactNode {
  return createElement("input", {
    id: props.ids.inputId,
    name: props.node.name,
    type: "hidden",
    value: String(props.value ?? "")
  });
}

function FileMetadataField(props: RendererFieldProps): ReactNode {
  return createElement("textarea", {
    ...commonInputProps(props, Array.isArray(props.value) ? JSON.stringify(props.value) : ""),
    placeholder: "[]",
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
      try {
        props.onChange(JSON.parse(event.currentTarget.value || "[]"));
      } catch {
        props.onChange(event.currentTarget.value);
      }
    }
  });
}

function createInput(
  props: RendererFieldProps,
  type: string,
  parse: (value: string) => unknown = (value) => value
): ReactNode {
  return createElement("input", {
    ...commonInputProps(props, props.value ?? ""),
    type,
    onChange: (event: ChangeEvent<HTMLInputElement>) => props.onChange(parse(event.currentTarget.value))
  });
}

function commonInputProps(props: RendererFieldProps, value: unknown): Record<string, unknown> {
  return {
    id: props.ids.inputId,
    name: props.node.name,
    className: "rfb-input",
    "data-rfb-field-type": fieldTypeForNode(props.node),
    "aria-describedby": describedBy(props),
    "aria-invalid": props.errors.length > 0 ? "true" : undefined,
    required: props.required,
    disabled: props.disabled,
    value,
    onBlur: (_event: FocusEvent<HTMLElement>) => props.onBlur(),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      props.onChange(event.currentTarget.value),
    ref: props.focusRef
  };
}

function describedBy(props: RendererFieldProps): string | undefined {
  return [
    props.description ? props.ids.descriptionId : null,
    props.errors.length > 0 ? props.ids.errorId : null
  ].filter(Boolean).join(" ") || undefined;
}

function normalizeSchema(input: FormRendererProps["schema"]): RendererSchema {
  const record = input as RendererSchema;
  return {
    ...record,
    schemaVersion: String(record.schemaVersion ?? ""),
    formId: String(record.formId ?? ""),
    revisionId: String(record.revisionId ?? ""),
    revisionHash: String(record.revisionHash ?? ""),
    locale: String(record.locale ?? "en"),
    nodes: Array.isArray(record.nodes) ? record.nodes.filter(isRendererNode) : []
  };
}

function createNodeModel(schema: RendererSchema): { nodeById: Map<string, RendererNode>; childIds: Set<string>; rootNodes: RendererNode[] } {
  const nodeById = new Map(schema.nodes.map((node) => [node.id, node]));
  const childIds = new Set<string>();
  for (const node of schema.nodes) {
    for (const child of node.children ?? []) {
      childIds.add(child);
    }
  }
  return {
    nodeById,
    childIds,
    rootNodes: schema.nodes.filter((node) => !childIds.has(node.id))
  };
}

function flattenDirectChildren(node: RendererNode, model: { nodeById: Map<string, RendererNode> }): RendererNode[] {
  return (node.children ?? []).map((id) => model.nodeById.get(id)).filter(isRendererNode);
}

function flattenRenderableChildren(
  node: RendererNode,
  model: { nodeById: Map<string, RendererNode> },
  isVisible: (node: RendererNode) => boolean
): RendererNode[] {
  const output: RendererNode[] = [];
  for (const child of flattenDirectChildren(node, model)) {
    if (!isVisible(child)) {
      continue;
    }
    output.push(child);
    if (child.children) {
      output.push(...flattenRenderableChildren(child, model, isVisible));
    }
  }
  return output;
}

function renderNavigation(props: NavigationSlotProps, slots: RendererSlots): ReactNode {
  if (slots.Navigation) {
    return slots.Navigation(props);
  }
  return createElement(
    Fragment,
    null,
    createElement(
      "button",
      { type: "button", className: "rfb-button rfb-previous-button", onClick: props.onPrevious, disabled: !props.canGoPrevious },
      "Previous"
    ),
    props.canGoNext
      ? createElement("button", { type: "button", className: "rfb-button rfb-next-button", onClick: props.onNext }, "Next")
      : createElement(
          "button",
          { type: "button", className: "rfb-button rfb-submit-button", onClick: props.onSubmit, disabled: props.isSubmitting },
          "Submit"
        )
  );
}

function isRendererNode(value: unknown): value is RendererNode {
  return isRecord(value) && typeof value.id === "string" && typeof value.type === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isAdapterResult(value: unknown): value is AdapterResult<SubmitFormData> {
  return isRecord(value) && typeof value.ok === "boolean" && typeof value.status === "string" && "diagnostics" in value;
}

function rendererStatusFromAdapter(status: string): RendererSubmissionStatus {
  if (status === "validation_error" || status === "auth_error" || status === "rate_limited" || status === "conflict") {
    return status;
  }
  return "server_error";
}

function readValidation(node: RendererNode): ValidationRule[] {
  return Array.isArray(node.validation) ? (node.validation as ValidationRule[]) : [];
}

function readOptions(node: RendererNode): RendererOption[] {
  return Array.isArray(node.options) ? node.options.filter(isRendererOption) : [];
}

function isRendererOption(value: unknown): value is RendererOption {
  return isRecord(value) && typeof value.label === "string" && typeof value.value === "string";
}

function isSubmittableField(node: RendererNode): boolean {
  return (node.type === "field" || node.type === "hidden") && typeof node.name === "string";
}

function isRequired(node: RendererNode): boolean {
  return readValidation(node).some((rule) => rule.type === "required" && !isRecord(rule.when));
}

function fieldTypeForNode(node: RendererNode): string {
  return node.type === "hidden" ? "hidden" : String(node.fieldType ?? "");
}

function createFieldIds(node: RendererNode): RendererFieldIds {
  const id = sanitizeId(node.id);
  return {
    inputId: `rfb-${id}-input`,
    labelId: `rfb-${id}-label`,
    descriptionId: `rfb-${id}-description`,
    errorId: `rfb-${id}-error`
  };
}

function sanitizeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function errorToMessage(error: FieldValidationError): string {
  return error.message ?? error.code;
}

function focusFirstError(errors: Record<string, string[]>, targets: Map<string, HTMLElement>): void {
  const first = Object.keys(errors)[0];
  if (!first) {
    return;
  }
  targets.get(first)?.focus();
}

function className(value: string): { className: string } {
  return { className: value };
}

function cloneWithDescribedBy(children: ReactNode, describedBy: string | undefined): ReactNode {
  return children;
}
