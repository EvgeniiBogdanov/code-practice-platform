/**
 * Highlighter Types & Options
 */

export interface DiagnosticProblem {
  line: number;
  col: number;
  message: string;
  severity: "error" | "warning" | "info";
  symbol?: string;
  typo?: string;
}

export interface HighlightOptions {
  highlightWord?: string;
  bracketPair?: [number, number] | null;
  problems?: DiagnosticProblem[];
  unusedImports?: Set<string> | null;
  multiSelections?: Array<{ start: number; end: number }>;
  showColorSwatches?: boolean;
}

export type HighlighterFunction = (code: string, options?: HighlightOptions) => string;

export const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
