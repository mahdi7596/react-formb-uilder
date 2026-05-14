import { describe, expect, it } from "vitest";

import { DIAGNOSTIC_CODES, isSubmittedPath } from "./index.js";

describe("@your-org/forms-core contract exports", () => {
  it("exports framework-neutral path and diagnostic contracts", () => {
    expect(isSubmittedPath("contact.email")).toBe(true);
    expect(isSubmittedPath("bad path")).toBe(false);
    expect(DIAGNOSTIC_CODES.dangerousKey).toBe("dangerous_key");
  });
});
