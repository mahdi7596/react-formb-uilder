import { describe, expect, it } from "vitest";

import { evaluateCondition, extractConditionDependencies } from "./index.js";

describe("condition runtime", () => {
  it("evaluates logical and field operators with missing-value behavior", () => {
    expect(evaluateCondition({ all: [{ field: "age", op: "gte", value: 18 }] }, { values: { age: 20 } }).value).toBe(true);
    expect(evaluateCondition({ field: "missing", op: "empty" }, { values: {} }).value).toBe(true);
    expect(evaluateCondition({ field: "missing", op: "notEmpty" }, { values: {} }).value).toBe(false);
    expect(evaluateCondition({ field: "tags", op: "contains", value: "a" }, { values: { tags: ["a"] } }).value).toBe(true);
  });

  it("collects dependencies and diagnoses unknown predicates", () => {
    expect(extractConditionDependencies({ all: [{ field: "email", op: "notEmpty" }] })).toEqual(["email"]);
    expect(
      evaluateCondition({ predicate: "isBusinessEmail", version: "1.0.0", args: ["email"] }, { values: {} })
        .diagnostics.map((item) => item.code)
    ).toContain("unsupported_custom_registration");
  });

  it("diagnoses invalid logical arrays and complexity limits", () => {
    expect(evaluateCondition({ all: [] }, { values: {} }).diagnostics.map((item) => item.code)).toContain(
      "invalid_condition"
    );
    expect(
      evaluateCondition(
        { not: { not: { not: { not: { field: "a", op: "eq", value: true } } } } },
        { values: {}, limits: { maxDepth: 2 } }
      ).diagnostics.map((item) => item.code)
    ).toContain("invalid_condition");
  });
});
