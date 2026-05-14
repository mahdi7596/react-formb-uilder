import { describe, expect, it } from "vitest";

import { parseBackendResponse } from "./index.js";

describe("backend response runtime", () => {
  it("parses success and maps field/global validation errors", () => {
    expect(parseBackendResponse({ ok: true, status: "success", submissionId: "sub_1", errors: [] }).value?.ok).toBe(true);

    const result = parseBackendResponse({
      ok: false,
      status: "validation_error",
      submissionId: null,
      errors: [
        { path: "email", code: "invalid_email", source: "server" },
        { path: null, code: "form_closed", source: "server" }
      ]
    });

    expect(result.value?.fieldErrors).toHaveLength(1);
    expect(result.value?.globalErrors).toHaveLength(1);
  });

  it("diagnoses unknown status, invalid paths, and dangerous params", () => {
    expect(
      parseBackendResponse({ ok: false, status: "teapot", submissionId: null, errors: [] }).diagnostics.map(
        (item) => item.code
      )
    ).toContain("invalid_backend_response");

    const result = parseBackendResponse({
      ok: false,
      status: "validation_error",
      submissionId: null,
      errors: [{ path: "bad path", code: "bad", source: "server", params: { prototype: true } }]
    });

    expect(result.diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining(["invalid_submitted_path", "dangerous_key"])
    );
  });
});
