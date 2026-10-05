/**
 * Highlighter Types & Options
 */

export interface DiagnosticProblem {
  line: number;
  col: number;
  message: string;
  /** `hint` dims unused code instead of underlining it. */
  severity: "error" | "warning" | "info" | "hint";
  /** Absolute document range. */
  start: number;
  end: number;
  /** Concerns the whole analysis (worker failed), not a place in the code: never underlined. */
  synthetic?: boolean;
}

/** Squiggle class for the first problem overlapping `[start, start + length)`. */
export const getProblemClass = (
  problems: ReadonlyArray<DiagnosticProblem>,
  start: number,
  length: number
): string => {
  const problem = problems.find(
    (item) =>
      !item.synthetic && start < Math.max(item.end, item.start + 1) && start + length > item.start
  );
  if (!problem) return "";
  if (problem.severity === "hint") return " hl-unused-dimmed";
  return problem.severity === "warning" ? " hl-squiggly-warning" : " hl-squiggly-error";
};

export interface HighlightOptions {
  supportsJsx?: boolean;
  supportsTypeScript?: boolean;
  bracketPair?: [number, number] | null;
  problems?: DiagnosticProblem[];
  multiSelections?: Array<{ start: number; end: number }>;
  showColorSwatches?: boolean;
  jsxTextRanges?: ReadonlyArray<{ start: number; end: number }>;
}

export type HighlighterFunction = (code: string, options?: HighlightOptions) => string;

export const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
