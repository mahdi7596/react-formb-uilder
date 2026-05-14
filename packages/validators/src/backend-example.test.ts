import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

describe("backend JSON Schema consumption docs", () => {
  it("documents backend-oriented generated schema usage without React imports", () => {
    const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
    const text = readFileSync(
      join(projectRoot, "docs/integration/backend-json-schema.md"),
      "utf8"
    );

    expect(text).toContain("compileJsonSchema");
    expect(text).toContain("diagnostics");
    expect(text).not.toContain("react-renderer");
    expect(text).not.toContain("react-builder");
  });
});
