import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@your-org/forms-core": resolve(__dirname, "src/core-browser.ts"),
      "@your-org/forms-adapters": resolve(__dirname, "../../packages/adapters/src/index.ts"),
      "@your-org/forms-react-builder": resolve(__dirname, "../../packages/react-builder/src/index.ts"),
      "@your-org/forms-validators": resolve(__dirname, "../../packages/validators/src/index.ts"),
      "@your-org/forms-react-renderer": resolve(__dirname, "../../packages/react-renderer/src/index.tsx")
    }
  },
  server: {
    host: "127.0.0.1"
  },
  preview: {
    host: "127.0.0.1"
  }
});
