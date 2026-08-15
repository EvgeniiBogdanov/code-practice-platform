import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function githubPagesSpaPlugin() {
  return {
    name: "github-pages-spa-404",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      const notFoundPath = path.join(distDir, "404.html");
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log("✓ Copied dist/index.html to dist/404.html for GitHub Pages SPA routing");
      }
    },
  };
}

export default defineConfig({
  base: "/code-practice-platform/",
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    githubPagesSpaPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("sucrase")) {
              return "vendor-compiler";
            }
            if (id.includes("prettier")) {
              return "vendor-prettier";
            }
            if (id.includes("@xterm")) {
              return "vendor-xterm";
            }
            if (id.includes("@tanstack")) {
              return "vendor-router";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            return "vendor-framework";
          }
          if (id.includes("/src/react/tasks/") || id.includes("/src/react/solutions/") || id.includes("/src/react/data/")) {
            return "tasks-react";
          }
          if (id.includes("/src/javascript/")) {
            return "tasks-javascript";
          }
          if (id.includes("/src/algorithms/")) {
            return "tasks-algorithms";
          }
          if (id.includes("cheatSheetData.js")) {
            return "data-cheatsheet";
          }
          if (id.includes("taskExplanations.js")) {
            return "task-explanations";
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 4000,
    open: true,
  },
});
