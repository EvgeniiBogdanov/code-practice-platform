/**
 * Language Modes & Capabilities Types
 */

export type LanguageId =
  | "javascript"
  | "javascriptreact"
  | "typescript"
  | "typescriptreact"
  | "css"
  | "html"
  | "json"
  | "sql"
  | "markdown"
  | "plaintext";

export interface LanguageCapabilities {
  languageId: LanguageId;
  supportsJsx: boolean;
  supportsTypeScript: boolean;
  supportsReactHooks: boolean;
  supportsEmmet: boolean;
  supportsCssProperties: boolean;
  supportsHtmlTags: boolean;
  supportsSql: boolean;
  supportsAutoImport: boolean;
  supportsJavaScriptGlobals: boolean;
}
