import { describe, expect, it } from "vitest";

import { exampleBoundary } from "./index.js";

describe("@your-org/forms-example-vite-react bootstrap placeholder", () => {
  it("documents the example package boundary", () => {
    expect(exampleBoundary.name).toBe("@your-org/forms-example-vite-react");
    expect(exampleBoundary.phase).toBe("bootstrap-placeholder");
  });
});
