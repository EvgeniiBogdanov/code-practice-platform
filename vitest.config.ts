import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/widgets": path.resolve(__dirname, "./src/widgets"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
