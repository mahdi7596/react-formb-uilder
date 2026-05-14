import type { ConditionExpression } from "../conditions/index.js";

export type BuiltInValidationRuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "minWords"
  | "maxWords"
  | "min"
  | "max"
  | "integer"
  | "step"
  | "pattern"
  | "email"
  | "url"
  | "option"
  | "selectionCount"
  | "accepted";

export interface ValidationRule {
  type: BuiltInValidationRuleType | string;
  version?: string;
  message?: string;
  params?: Record<string, unknown>;
  when?: ConditionExpression;
}

export interface ValidationErrorContract {
  path: string | null;
  code: string;
  message?: string;
  params?: Record<string, unknown>;
  source: "schema" | "client" | "server" | "adapter" | "compiler";
}
