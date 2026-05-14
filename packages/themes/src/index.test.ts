import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-themes bootstrap placeholder", () => {
  it("documents the themes package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-themes");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
