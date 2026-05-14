import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-react-builder bootstrap placeholder", () => {
  it("documents the builder package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-react-builder");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
