import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-adapters bootstrap placeholder", () => {
  it("documents the adapters package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-adapters");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
