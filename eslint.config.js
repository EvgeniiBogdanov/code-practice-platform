import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import fsdPlugin from "@conarti/eslint-plugin-feature-sliced";
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
    ],
  },

  // 2. Base JS Recommended
  js.configs.recommended,

  // 3. TypeScript Recommended
  ...tseslint.configs.recommended,

  // 4. Configuration for Node / Build files
  {
    files: ["*.config.{js,ts}", "vite.config.js"],
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
      "@conarti/feature-sliced": fsdPlugin,
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
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // --- TypeScript Rules ---
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      // --- Feature-Sliced Design (FSD) Architectural Rules ---
      "@conarti/feature-sliced/layers-slices": [
        "error",
        {
          allowTypeImports: true,
          ignoreInFilesPatterns: ["**/src/routes/**", "**/src/app/**"],
        },
      ],
      "@conarti/feature-sliced/public-api": [
        "error",
        {
          ignoreInFilesPatterns: ["**/src/app/**"],
        },
      ],
      "@conarti/feature-sliced/absolute-relative": "error",

      // --- Project Size & Style Standards ---
      "max-lines": [
        "warn",
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-lines-per-function": "off",
      "prefer-arrow-callback": "warn",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },

  // 6. Prettier integration (turns off conflicting ESLint rules)
  prettierConfig
);
