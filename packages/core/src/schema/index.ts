import type { ConditionExpression } from "../conditions/index.js";
import type { ValidationRule } from "../validation/index.js";

export type SchemaVersion = "1.0.0";
export type FormStatus = "draft" | "published" | "archived";
export type Direction = "ltr" | "rtl" | "auto";
export type SubmitMode = "final";
export type NavigationMode = "singlePage" | "steps";
export type ValidationTiming = "onSubmit" | "onBlur" | "onChange";

export interface FormSettings {
  submitMode: SubmitMode;
  navigation: NavigationMode;
  validationTiming: ValidationTiming;
  preserveHiddenValues: boolean;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface BaseNode {
  id: string;
  type: string;
  label?: string;
  description?: string;
  visibility?: ConditionExpression | null;
  enabledWhen?: ConditionExpression | null;
  ui?: JsonObject;
  meta?: JsonObject;
}

export interface OptionContract {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface FieldNode extends BaseNode {
  type: "field";
  fieldType: string;
  name: string;
  defaultValue?: JsonValue;
  validation?: ValidationRule[];
  props?: JsonObject;
  options?: OptionContract[];
}

export interface HiddenNode extends BaseNode {
  type: "hidden";
  fieldType: "hidden";
  name: string;
  defaultValue?: JsonValue;
  props?: JsonObject;
}

export interface ContainerNode extends BaseNode {
  type: "section" | "step";
  children: string[];
}

export interface ContentNode extends BaseNode {
  type: "content";
  contentType: "heading" | "paragraph" | "image" | "divider" | string;
  props?: JsonObject;
}

export interface EndingNode extends BaseNode {
  type: "ending";
  props?: JsonObject;
}

export type FormNode = FieldNode | HiddenNode | ContainerNode | ContentNode | EndingNode;

export interface LocalizationContract {
  title?: string;
  description?: string;
  nodes?: Record<string, { label?: string; description?: string; placeholder?: string }>;
}

export interface CanonicalFormSchema {
  schemaVersion: SchemaVersion;
  formId: string;
  revisionId: string;
  revisionHash: string;
  status: FormStatus;
  locale: string;
  direction: Direction;
  title: string;
  description?: string;
  settings: FormSettings;
  nodes: FormNode[];
  localizations?: Record<string, LocalizationContract>;
  meta?: JsonObject;
}
