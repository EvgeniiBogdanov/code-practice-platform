import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import featureSliced from "@conarti/eslint-plugin-feature-sliced";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/routeTree.gen.ts",
      "**/*.d.ts",
      "**/scratch/**",
      "**/src/entities/task/curriculum/**",
      "**/src/shared/data/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      ".claude/**",
    ],
  },

  // 2. Base JS Recommended
  js.configs.recommended,

  // 3. TypeScript Recommended
  ...tseslint.configs.recommended,

  // 4. Configuration for Node / Build files
  {
    files: ["*.config.{js,ts}", "vite.config.js", "scripts/**/*.mjs", "e2e/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 5. React, TypeScript & FSD Configuration for Application Source
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // --- React & React Hooks Rules ---
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
      "react-hooks/exhaustive-deps": "error",

      // --- TypeScript Rules ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description", minimumDescriptionLength: 5 },
      ],
      "@typescript-eslint/no-empty-object-type": "off",

      // --- Project Size & Style Standards ---
      "max-lines": [
        "error",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": "off",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  // 6. Exceptions
  {
    // main.tsx is the entry, not a Fast Refresh boundary. File routes keep their components next
    // to the exported `Route`; with autoCodeSplitting the router plugin owns their HMR.
    files: ["src/main.tsx", "src/routes/**"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    // Test suites group many scenarios per module; size limits target production code.
    files: ["src/**/*.{test,spec}.{ts,tsx}"],
    rules: { "max-lines": "off" },
  },
  {
    // Tech debt: files that already exceed 300 lines. Split them and remove from this list;
    // never add new entries.
    files: [
      "src/entities/algorithm-trace/model/graphTraces.ts",
      "src/entities/algorithm-trace/model/mergeTraces.ts",
      "src/entities/algorithm-trace/model/parsingStackTraces.ts",
      "src/entities/ui-state/model/uiStore.ts",
      "src/features/code-editor/model/useCodeEditor.ts",
      "src/features/code-editor/model/useIntelliSense.ts",
      "src/features/code-editor/ui/CodeEditor/CodeEditor.tsx",
      "src/pages/group-overview/model/useGroupOverview.ts",
      "src/pages/open-editor/ui/OpenEditorPage.tsx",
      "src/pages/task/ui/CandidateTab/CandidateTab.tsx",
      "src/pages/task/ui/TaskPage.tsx",
      "src/shared/lib/code-editor/languages/reactKnowledge.ts",
      "src/shared/lib/code-editor/typescriptDiagnostics.ts",
      "src/shared/lib/code-runners/nodeWorker.ts",
      "src/shared/lib/code-runners/sandboxHtmlBuilder.ts",
      "src/shared/lib/storage/solutionsService.ts",
      "src/shared/ui/UiDiagramScene/lib/createDiagramScene.ts",
    ],
    rules: { "max-lines": "off" },
  },

  // 7. Feature-Sliced Design (FSD) Architectural Rules
  {
    ...featureSliced({
      layersSlices: {
        allowTypeImports: true,
        ignoreFiles: ["**/src/routes/**", "**/src/app/**"],
      },
      publicApi: {
        ignoreFiles: ["**/src/app/**"],
      },
      noCrossSegmentReexport: false,
      sortImports: false,
    }),
    files: ["src/**/*.{ts,tsx,js,jsx}"],
  },

  // 8. Prettier integration (turns off conflicting ESLint rules)
  prettierConfig
);
