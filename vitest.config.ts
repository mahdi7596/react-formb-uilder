import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@your-org/forms-core": resolve(__dirname, "packages/core/src/index.ts"),
      "@your-org/forms-validators": resolve(__dirname, "packages/validators/src/index.ts")
    }
  },
  test: {
    environment: "node",
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "packages/*/src/**/*.test.ts",
      "packages/*/src/**/*.test.tsx",
      "examples/*/src/**/*.test.ts",
      "examples/*/src/**/*.test.tsx"
    ]
  }
});
