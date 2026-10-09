/** Messages and results exchanged with the TypeScript editor worker. */

export interface TypeScriptSourceInput {
  code: string;
  filepath: string;
  files: ReadonlyArray<{ name?: string; code?: string }>;
}

/** Source of the type tests; `code` of the request is the learner's solution. */
export interface TypeTestsInput extends TypeScriptSourceInput {
  tests: string;
}

export interface TypeScriptDiagnosticRequest extends TypeScriptSourceInput {
  id: number;
  kind:
    | "diagnostics"
    | "completions"
    | "hover"
    | "signature"
    | "rename"
    | "codefix"
    | "definition"
    | "tests";
  position?: number;
  /** Source of the type tests for the `tests` kind. */
  tests?: string;
  /** Range and error code of the diagnostic to fix (`codefix`). */
  end?: number;
  errorCode?: number;
}

export interface TypeScriptDiagnosticResponse {
  id: number;
  kind: TypeScriptDiagnosticRequest["kind"];
  problems?: EditorDiagnostic[];
  completions?: TypeScriptCompletion[];
  hover?: TypeScriptHover | null;
  signature?: TypeScriptSignature | null;
  rename?: TypeScriptRenameEdit[];
  codefixes?: TypeScriptCodeFix[];
  definition?: TypeScriptLocation | null;
  report?: TypeTestReport;
}

export interface EditorDiagnostic {
  id: string;
  line: number;
  col: number;
  /** Absolute range in the checked file. */
  start: number;
  end: number;
  message: string;
  code: number;
  /** `hint` marks unused code: it is dimmed, not counted as a problem. */
  severity: "error" | "warning" | "hint";
  /** The analysis itself failed; the range is meaningless and nothing is underlined. */
  synthetic?: boolean;
}

export interface TypeScriptCompletion {
  label: string;
  insertText: string;
  kind: string;
  replaceStart: number;
  replaceEnd: number;
  /** Module to import the symbol from when the entry is an auto-import. */
  autoImport?: { symbol: string; module: string; isDefault: boolean };
}

export interface TypeScriptHover {
  signature: string;
  documentation: string;
}

export interface TypeScriptSignature {
  signature: string;
  activeParameter: number;
  documentation: string;
  /** Character ranges of each parameter inside `signature`. */
  parameters: Array<{ start: number; end: number }>;
}

export interface TypeScriptLocation {
  filepath: string;
  start: number;
  end: number;
}

/** `prefixText`/`suffixText` wrap the new name where plain replacement would change meaning. */
export interface TypeScriptRenameEdit extends TypeScriptLocation {
  prefixText?: string;
  suffixText?: string;
}

export interface TypeScriptTextChange extends TypeScriptLocation {
  newText: string;
}

export interface TypeScriptCodeFix {
  description: string;
  changes: TypeScriptTextChange[];
}

/** One `test()` call of the tests source. Offsets and lines are relative to that source. */
export interface TypeTestCase {
  /** Stable key: `${describe}/${name}`. */
  id: string;
  name: string;
  describe: string | null;
  line: number;
  start: number;
  end: number;
}

export type TypeTestFailure =
  | { kind: "mismatch"; expected: string; actual: string; message: string }
  | { kind: "expected-error"; snippet: string }
  | { kind: "diagnostic"; message: string; code: number };

/** `skipped`: the solution could not be analysed (syntax error), so nothing was checked. */
export type TypeTestStatus = "passed" | "failed" | "skipped";

export interface TypeTestResult {
  case: TypeTestCase;
  status: TypeTestStatus;
  failure: TypeTestFailure | null;
}

export type TypeTestCompileReason = "errors" | "syntax" | "nocheck" | "reserved";

export interface TypeTestCompileResult {
  passed: boolean;
  problems: EditorDiagnostic[];
  reason: TypeTestCompileReason | null;
  /** Human-readable explanation for `syntax`, `nocheck` and `reserved`. */
  message: string | null;
}

export interface TypeTestReport {
  compile: TypeTestCompileResult;
  results: TypeTestResult[];
  /** Broken tests source (content bug), shown as "tests are damaged". */
  fileError: string | null;
  /** Includes the compile case. */
  passed: number;
  total: number;
  durationMs: number;
}
