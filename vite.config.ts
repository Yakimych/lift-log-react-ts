/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Keep the classic JSX runtime so the codebase's `import * as React`
  // stays required (works with React 16 and `noUnusedLocals`).
  plugins: [react({ jsxRuntime: "classic" })],
  // Keep supporting the existing REACT_APP_* env vars (e.g. on Netlify)
  // in addition to Vite's native VITE_* prefix.
  envPrefix: ["VITE_", "REACT_APP_"],
  resolve: {
    // Honour the `src/...` absolute imports used across the store modules.
    alias: [
      {
        find: /^src\//,
        replacement: fileURLToPath(new URL("./src/", import.meta.url))
      }
    ]
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
