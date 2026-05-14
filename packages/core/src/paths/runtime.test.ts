import { describe, expect, it } from "vitest";

import {
  getValueAtPath,
  parseSubmittedPath,
  serializeSubmittedPath,
  setValueAtPath
} from "./index.js";

describe("submitted path runtime", () => {
  it("parses and serializes schema and runtime paths", () => {
    const schemaPath = parseSubmittedPath("items[].quantity");
    const runtimePath = parseSubmittedPath("addresses[0].city", { kind: "runtime-error" });

    expect(schemaPath.ok).toBe(true);
    expect(runtimePath.ok).toBe(true);
    if (schemaPath.ok && runtimePath.ok) {
      expect(serializeSubmittedPath(schemaPath.value)).toBe("items[].quantity");
      expect(serializeSubmittedPath(runtimePath.value)).toBe("addresses[0].city");
    }
  });

  it("rejects invalid and dangerous paths", () => {
    expect(parseSubmittedPath("user..email").diagnostics.map((item) => item.code)).toContain(
      "invalid_submitted_path"
    );
    expect(parseSubmittedPath("__proto__.polluted").diagnostics.map((item) => item.code)).toContain(
      "dangerous_key"
    );
  });

  it("gets and sets values without prototype pollution", () => {
    const setResult = setValueAtPath({}, "user.email", "person@example.com");
    expect(setResult.ok).toBe(true);
    if (setResult.ok) {
      expect(setResult.value).toEqual({ user: { email: "person@example.com" } });
      expect(getValueAtPath(setResult.value, "user.email").value).toBe("person@example.com");
    }

    const unsafe = setValueAtPath({}, "__proto__.polluted", true);
    expect(unsafe.ok).toBe(false);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
