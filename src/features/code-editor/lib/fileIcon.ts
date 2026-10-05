import { getLanguageId } from "@/shared/lib/code-editor";

export type FileIconKind = "js" | "jsx" | "ts" | "tsx" | "css" | "html" | "json" | "other";

/** Icon family of a file, from its language, so tabs and toolbar agree. */
export const getFileIconKind = (filename: string): FileIconKind => {
  switch (getLanguageId(filename)) {
    case "javascript":
      return "js";
    case "javascriptreact":
      return "jsx";
    case "typescript":
      return "ts";
    case "typescriptreact":
      return "tsx";
    case "css":
    case "scss":
    case "less":
      return "css";
    case "html":
      return "html";
    case "json":
      return "json";
    default:
      return "other";
  }
};
