import type { SubmittedPath } from "../paths/index.js";
import { createDiagnostic, DIAGNOSTIC_CODES, type Diagnostic } from "../diagnostics/index.js";

export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "empty"
  | "notEmpty"
  | "contains"
  | "notContains"
  | "in"
  | "notIn"
  | "matches";

export type ConditionExpression =
  | { all: ConditionExpression[] }
  | { any: ConditionExpression[] }
  | { not: ConditionExpression }
  | { field: SubmittedPath | string; op: ConditionOperator; value?: unknown }
  | { predicate: string; version: string; args: unknown[] };

export interface ConditionDependency {
  nodeId: string;
  dependsOn: string[];
}

export interface PredicateRegistration {
  key: string;
  version: string;
  evaluate?: (args: unknown[], values: Record<string, unknown>) => boolean;
  async?: boolean;
  dependencies?: string[];
}

export interface ConditionEvaluationOptions {
  values: Record<string, unknown>;
  predicates?: PredicateRegistration[];
  limits?: {
    maxDepth?: number;
    maxNodes?: number;
    maxRegexLength?: number;
    maxDependencies?: number;
  };
}

export interface ConditionEvaluationResult {
  value: boolean;
  dependencies: string[];
  diagnostics: Diagnostic[];
}

export function extractConditionDependencies(condition: ConditionExpression): string[] {
  return [...new Set(readDependencies(condition))];
}

export function evaluateCondition(
  condition: ConditionExpression,
  options: ConditionEvaluationOptions
): ConditionEvaluationResult {
  const diagnostics: Diagnostic[] = [];
  const dependencies = extractConditionDependencies(condition);
  const limits = {
    maxDepth: options.limits?.maxDepth ?? 16,
    maxNodes: options.limits?.maxNodes ?? 100,
    maxRegexLength: options.limits?.maxRegexLength ?? 200,
    maxDependencies: options.limits?.maxDependencies ?? 50
  };
  let nodeCount = 0;

  const evaluate = (expr: ConditionExpression, depth: number): boolean => {
    nodeCount += 1;
    if (depth > limits.maxDepth || nodeCount > limits.maxNodes) {
      diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidCondition }));
      return false;
    }

    if ("all" in expr) {
      if (expr.all.length === 0) {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidCondition }));
        return false;
      }
      return expr.all.every((child) => evaluate(child, depth + 1));
    }

    if ("any" in expr) {
      if (expr.any.length === 0) {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidCondition }));
        return false;
      }
      return expr.any.some((child) => evaluate(child, depth + 1));
    }

    if ("not" in expr) {
      return !evaluate(expr.not, depth + 1);
    }

    if ("predicate" in expr) {
      const registration = options.predicates?.find(
        (predicate) => predicate.key === expr.predicate && predicate.version === expr.version
      );
      if (!registration || registration.async) {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedCustomRegistration }));
        return false;
      }
      return Boolean(registration.evaluate?.(expr.args, options.values));
    }

    if (dependencies.length > limits.maxDependencies) {
      diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.invalidCondition }));
      return false;
    }

    return evaluateFieldCondition(expr, options.values, diagnostics, limits.maxRegexLength);
  };

  const value = evaluate(condition, 1);
  return { value, dependencies, diagnostics: dedupeDiagnostics(diagnostics) };
}

function evaluateFieldCondition(
  condition: Extract<ConditionExpression, { field: SubmittedPath | string }>,
  values: Record<string, unknown>,
  diagnostics: Diagnostic[],
  maxRegexLength: number
): boolean {
  const hasValue = Object.prototype.hasOwnProperty.call(values, condition.field);
  const value = values[String(condition.field)];

  switch (condition.op) {
    case "empty":
      return isEmpty(value);
    case "notEmpty":
      return !isEmpty(value);
    case "eq":
      return hasValue ? value === condition.value : condition.value === null;
    case "neq":
      return hasValue ? value !== condition.value : condition.value !== null;
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      if (typeof value !== "number" || typeof condition.value !== "number") {
        return false;
      }
      return condition.op === "gt"
        ? value > condition.value
        : condition.op === "gte"
          ? value >= condition.value
          : condition.op === "lt"
            ? value < condition.value
            : value <= condition.value;
    case "contains":
      return Array.isArray(value)
        ? value.includes(condition.value)
        : typeof value === "string" && typeof condition.value === "string"
          ? value.includes(condition.value)
          : false;
    case "notContains":
      return !evaluateFieldCondition({ ...condition, op: "contains" }, values, diagnostics, maxRegexLength);
    case "in":
      return Array.isArray(condition.value) ? condition.value.includes(value) : false;
    case "notIn":
      return Array.isArray(condition.value) ? !condition.value.includes(value) : true;
    case "matches":
      if (typeof value !== "string" || typeof condition.value !== "string") {
        return false;
      }
      if (condition.value.length > maxRegexLength || condition.value.includes("(?<")) {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedRegex }));
        return false;
      }
      try {
        return new RegExp(condition.value).test(value);
      } catch {
        diagnostics.push(createDiagnostic({ code: DIAGNOSTIC_CODES.unsupportedRegex }));
        return false;
      }
  }
}

export function isEmpty(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function readDependencies(condition: ConditionExpression): string[] {
  if ("field" in condition) {
    return [String(condition.field)];
  }

  if ("all" in condition) {
    return condition.all.flatMap(readDependencies);
  }

  if ("any" in condition) {
    return condition.any.flatMap(readDependencies);
  }

  if ("not" in condition) {
    return readDependencies(condition.not);
  }

  return condition.args.filter((arg): arg is string => typeof arg === "string");
}

function dedupeDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
  const seen = new Set<string>();
  return diagnostics.filter((diagnostic) => {
    const key = `${diagnostic.code}:${diagnostic.path ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
