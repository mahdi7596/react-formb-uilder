import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "dev",
  resolve: {
    alias: {
      "@your-org/forms-core": resolve(__dirname, "dev/core-browser.ts"),
      "@your-org/forms-react-renderer": resolve(__dirname, "../react-renderer/src/index.tsx")
    }
  },
  server: {
    strictPort: true
  }
});
