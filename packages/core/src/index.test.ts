import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-core bootstrap placeholder", () => {
  it("documents the framework-agnostic package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-core");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
