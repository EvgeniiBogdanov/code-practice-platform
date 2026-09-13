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

export default defineConfig(({ mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  base: process.env.VERCEL ? "/" : "/code-practice-platform/",
  plugins: [
    mode === "development" &&
      codeInspectorPlugin({
        bundler: "vite",
        hotKeys: ["altKey"],
        editor: "code",
        launchType: "open",
      }),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    githubPagesSpaPlugin(),
  ].filter(Boolean),
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
    sourcemap: true,
    rollupOptions: {
      treeshake: {
        // These public APIs only re-export modules. Unused exports must not pull
        // their component CSS and feature implementations into the app shell.
        moduleSideEffects: (id) =>
          /\/src\/(shared\/ui|entities\/task|features\/spaced-repetition)\/index\.ts$/.test(id)
            ? false
            : null,
      },
      output: {
        manualChunks: (id) => {
          // Route availability must not pull trace builders into the initial task bundle.
          if (id.includes("/algorithm-trace/config/available-visualizations.ts")) {
            return "algorithm-availability";
          }
          if (id.includes("@nivo") || id.includes("d3-") || id.includes("@react-spring")) {
            return;
          }
          if (id.includes("node_modules")) {
            if (id.includes("/three/")) {
              return "vendor-three";
            }
            if (id.includes("sucrase")) {
              return "vendor-compiler";
            }
            if (id.includes("prettier")) {
              return "vendor-prettier";
            }
            if (id.includes("@xterm")) {
              return "vendor-xterm";
            }
            if (id.includes("marked") || id.includes("dompurify")) {
              return "vendor-markdown";
            }
            if (id.includes("@tanstack")) {
              return "vendor-router";
            }
            // Keep only the runtime shared by every route in the initial vendor chunk.
            // Editor dependencies and unused Lucide icons follow their lazy consumers.
            if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
              return "vendor-framework";
            }
            return;
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
}));
