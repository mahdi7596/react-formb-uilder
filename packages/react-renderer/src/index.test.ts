import { describe, expect, it } from "vitest";

import { packageBoundary } from "./index.js";

describe("@your-org/forms-react-renderer bootstrap placeholder", () => {
  it("documents the renderer package boundary", () => {
    expect(packageBoundary.name).toBe("@your-org/forms-react-renderer");
    expect(packageBoundary.phase).toBe("bootstrap-placeholder");
  });
});
