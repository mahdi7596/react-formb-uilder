import type { SubmittedPath } from "../paths/index.js";

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
