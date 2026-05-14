import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-validators bootstrap placeholder", () => {
  it("documents the validators package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-validators");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
