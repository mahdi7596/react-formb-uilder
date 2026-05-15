import type { ConditionExpression, PredicateRegistration } from "../conditions/index.js";
import { evaluateCondition, isEmpty } from "../conditions/index.js";
import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";

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

export interface ValidationOption {
  value: string;
  disabled?: boolean;
}

export interface ValidatorRegistration {
  key: string;
  version: string;
  fieldTypes: string[];
  async?: boolean;
  validate?: (value: unknown, params?: Record<string, unknown>) => string | null;
}

export interface ValidateFieldValueInput {
  fieldType: string;
  value: unknown;
  rules: ValidationRule[];
  values?: Record<string, unknown>;
  options?: ValidationOption[];
  hidden?: boolean;
  disabled?: boolean;
  validators?: ValidatorRegistration[];
  predicates?: PredicateRegistration[];
}

export interface FieldValidationError {
  code: string;
  message?: string;
}

export interface ValidateFieldValueResult {
  errors: FieldValidationError[];
  diagnostics: Diagnostic[];
}

export function validateFieldValue(input: ValidateFieldValueInput): ValidateFieldValueResult {
  if (input.hidden || input.disabled) {
    return { errors: [], diagnostics: [] };
  }

  const errors: FieldValidationError[] = [];
  const diagnostics: Diagnostic[] = [];

  for (const rule of input.rules) {
    if (rule.when) {
      const condition = evaluateCondition(rule.when, {
        values: input.values ?? {},
        ...(input.predicates ? { predicates: input.predicates } : {})
      });
      diagnostics.push(...condition.diagnostics);
      if (condition.diagnostics.length > 0 || !condition.value) {
        continue;
      }
    }

    const type = rule.type;

    if (type.startsWith("custom:")) {
      const validator = input.validators?.find(
        (candidate) => candidate.key === type && candidate.version === rule.version
      );
      if (!validator || validator.async || !validator.fieldTypes.includes(input.fieldType)) {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedCustomRegistration }));
        continue;
      }
      const code = validator.validate?.(input.value, rule.params);
      if (code) {
        errors.push(validationError(code, rule.message));
      }
      continue;
    }

    switch (type) {
      case "required":
        if (input.fieldType === "checkbox" ? input.value !== true : isEmpty(input.value)) {
          errors.push(validationError("required", rule.message));
        }
        break;
      case "minLength":
        if (typeof input.value === "string" && input.value.length < numberParam(rule, "min")) {
          errors.push(validationError("too_short", rule.message));
        }
        break;
      case "maxLength":
        if (typeof input.value === "string" && input.value.length > numberParam(rule, "max")) {
          errors.push(validationError("too_long", rule.message));
        }
        break;
      case "minWords":
        if (typeof input.value === "string" && wordCount(input.value) < numberParam(rule, "min")) {
          errors.push(validationError("too_few_words", rule.message));
        }
        break;
      case "maxWords":
        if (typeof input.value === "string" && wordCount(input.value) > numberParam(rule, "max")) {
          errors.push(validationError("too_many_words", rule.message));
        }
        break;
      case "min":
        if (typeof input.value === "number" && input.value < numberParam(rule, "min")) {
          errors.push(validationError("too_small", rule.message));
        }
        break;
      case "max":
        if (typeof input.value === "number" && input.value > numberParam(rule, "max")) {
          errors.push(validationError("too_large", rule.message));
        }
        break;
      case "integer":
        if (typeof input.value !== "number" || !Number.isInteger(input.value)) {
          errors.push(validationError("invalid_integer", rule.message));
        }
        break;
      case "step":
        if (typeof input.value === "number" && !matchesStep(input.value, numberParam(rule, "step", 1))) {
          errors.push(validationError("invalid_step", rule.message));
        }
        break;
      case "pattern":
        validatePattern(input.value, rule, errors, diagnostics);
        break;
      case "email":
        if (typeof input.value !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
          errors.push(validationError("invalid_email", rule.message));
        }
        break;
      case "url":
        if (typeof input.value !== "string" || !/^https?:\/\/\S+\.\S+/.test(input.value)) {
          errors.push(validationError("invalid_url", rule.message));
        }
        break;
      case "option":
        if (!input.options?.some((option) => !option.disabled && option.value === input.value)) {
          errors.push(validationError("invalid_option", rule.message));
        }
        break;
      case "selectionCount": {
        const count = Array.isArray(input.value) ? input.value.length : 0;
        const min = numberParam(rule, "min", 0);
        const max = numberParam(rule, "max", Number.POSITIVE_INFINITY);
        if (count < min || count > max) {
          errors.push(validationError("invalid_selection_count", rule.message));
        }
        break;
      }
      case "accepted":
        if (input.value !== true) {
          errors.push(validationError("not_accepted", rule.message));
        }
        break;
      default:
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unknownValidationRule }));
        break;
    }
  }

  return { errors, diagnostics };
}

function numberParam(rule: ValidationRule, key: string, fallback = 0): number {
  const value = rule.params?.[key];
  return typeof value === "number" ? value : fallback;
}

function validationError(code: string, message?: string): FieldValidationError {
  return message ? { code, message } : { code };
}

function wordCount(value: string): number {
  return value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
}

function matchesStep(value: number, step: number): boolean {
  const quotient = value / step;
  return Math.abs(quotient - Math.round(quotient)) < Number.EPSILON * 100;
}

function validatePattern(
  value: unknown,
  rule: ValidationRule,
  errors: FieldValidationError[],
  diagnostics: Diagnostic[]
): void {
  const pattern = rule.params?.pattern;
  if (typeof pattern !== "string" || pattern.length > 200 || pattern.includes("(?<")) {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedRegex }));
    return;
  }

  try {
    if (typeof value === "string" && !new RegExp(pattern).test(value)) {
      errors.push(validationError("pattern_mismatch", rule.message));
    }
  } catch {
    diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedRegex }));
  }
}
