import { describe, expect, it } from "vitest";

import { validateFieldValue } from "./index.js";

describe("validation runtime", () => {
  it("validates required, string, numeric, format, options, counts, and accepted rules", () => {
    expect(validateFieldValue({ fieldType: "text", value: "", rules: [{ type: "required" }] }).errors[0]?.code).toBe("required");
    expect(validateFieldValue({ fieldType: "text", value: "a", rules: [{ type: "minLength", params: { min: 2 } }] }).errors[0]?.code).toBe("too_short");
    expect(validateFieldValue({ fieldType: "number", value: 1.2, rules: [{ type: "integer" }] }).errors[0]?.code).toBe("invalid_integer");
    expect(validateFieldValue({ fieldType: "email", value: "bad", rules: [{ type: "email" }] }).errors[0]?.code).toBe("invalid_email");
    expect(validateFieldValue({ fieldType: "url", value: "bad", rules: [{ type: "url" }] }).errors[0]?.code).toBe("invalid_url");
    expect(validateFieldValue({ fieldType: "select", value: "x", options: [{ value: "a" }], rules: [{ type: "option" }] }).errors[0]?.code).toBe("invalid_option");
    expect(validateFieldValue({ fieldType: "checkbox", value: false, rules: [{ type: "accepted" }] }).errors[0]?.code).toBe("not_accepted");
  });

  it("diagnoses unsupported patterns and unknown custom validators", () => {
    expect(
      validateFieldValue({
        fieldType: "text",
        value: "abc",
        rules: [{ type: "pattern", params: { pattern: "(?<=a)b" } }]
      }).diagnostics.map((item) => item.code)
    ).toContain("unsupported_regex");

    expect(
      validateFieldValue({
        fieldType: "text",
        value: "abc",
        rules: [{ type: "custom:businessEmail", version: "1.0.0" }]
      }).diagnostics.map((item) => item.code)
    ).toContain("unsupported_custom_registration");
  });

  it("skips hidden and disabled fields by default", () => {
    expect(
      validateFieldValue({ fieldType: "text", value: "", rules: [{ type: "required" }], hidden: true })
        .errors
    ).toEqual([]);
    expect(
      validateFieldValue({ fieldType: "text", value: "", rules: [{ type: "required" }], disabled: true })
        .errors
    ).toEqual([]);
  });
});
