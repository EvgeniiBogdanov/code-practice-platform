/**
 * Language Detector & Capability Resolver
 */

import { LanguageId, LanguageCapabilities } from "./languageTypes";

export function getLanguageId(filepath = "main.jsx"): LanguageId {
  if (!filepath || typeof filepath !== "string") return "javascript";

  const lower = filepath.toLowerCase().trim();
  const ext = lower.split(".").pop() || "";

  switch (ext) {
    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "jsx":
      return "javascriptreact";
    case "ts":
    case "mts":
    case "cts":
      return "typescript";
    case "tsx":
      return "typescriptreact";
    case "css":
    case "scss":
    case "less":
      return "css";
    case "html":
    case "htm":
      return "html";
    case "json":
      return "json";
    case "sql":
      return "sql";
    case "md":
    case "markdown":
      return "markdown";
    default:
      return "javascript";
  }
}

export function getLanguageCapabilities(languageId: LanguageId): LanguageCapabilities {
  switch (languageId) {
    case "javascript":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: false,
        supportsHtmlTags: false,
        supportsSql: false,
        supportsAutoImport: true,
        supportsJavaScriptGlobals: true,
      };

    case "javascriptreact":
      return {
        languageId,
        supportsJsx: true,
        supportsTypeScript: false,
        supportsReactHooks: true,
        supportsEmmet: true,
        supportsCssProperties: true,
        supportsHtmlTags: true,
        supportsSql: false,
        supportsAutoImport: true,
        supportsJavaScriptGlobals: true,
      };

    case "typescript":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: true,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: false,
        supportsHtmlTags: false,
        supportsSql: false,
        supportsAutoImport: true,
        supportsJavaScriptGlobals: true,
      };

    case "typescriptreact":
      return {
        languageId,
        supportsJsx: true,
        supportsTypeScript: true,
        supportsReactHooks: true,
        supportsEmmet: true,
        supportsCssProperties: true,
        supportsHtmlTags: true,
        supportsSql: false,
        supportsAutoImport: true,
        supportsJavaScriptGlobals: true,
      };

    case "css":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: true,
        supportsHtmlTags: false,
        supportsSql: false,
        supportsAutoImport: false,
        supportsJavaScriptGlobals: false,
      };

    case "html":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: true,
        supportsCssProperties: false,
        supportsHtmlTags: true,
        supportsSql: false,
        supportsAutoImport: false,
        supportsJavaScriptGlobals: false,
      };

    case "json":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: false,
        supportsHtmlTags: false,
        supportsSql: false,
        supportsAutoImport: false,
        supportsJavaScriptGlobals: false,
      };

    case "sql":
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: false,
        supportsHtmlTags: false,
        supportsSql: true,
        supportsAutoImport: false,
        supportsJavaScriptGlobals: false,
      };

    case "markdown":
    case "plaintext":
    default:
      return {
        languageId,
        supportsJsx: false,
        supportsTypeScript: false,
        supportsReactHooks: false,
        supportsEmmet: false,
        supportsCssProperties: false,
        supportsHtmlTags: false,
        supportsSql: false,
        supportsAutoImport: false,
        supportsJavaScriptGlobals: false,
      };
  }
}
