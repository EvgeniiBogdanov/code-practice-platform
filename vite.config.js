import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { codeInspectorPlugin } from "code-inspector-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

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
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  base: process.env.VERCEL ? "/" : "/code-practice-platform/",
  plugins: [
    codeInspectorPlugin({
      bundler: "vite",
      hotKeys: ["altKey"],
      editor: "code",
      launchType: "open",
    }),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    githubPagesSpaPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/app": path.resolve(__dirname, "src/app"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/shared": path.resolve(__dirname, "src/shared"),
    },
  },
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
          if (id.includes("/curriculum/react/")) {
            return "tasks-react";
          }
          if (id.includes("/curriculum/javascript/")) {
            return "tasks-javascript";
          }
          if (id.includes("/curriculum/algorithms/")) {
            return "tasks-algorithms";
          }
          if (id.includes("cheatSheetData")) {
            return "data-cheatsheet";
          }
          if (id.includes("taskExplanations")) {
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
