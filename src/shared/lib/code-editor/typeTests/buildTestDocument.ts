import { TYPE_TESTS_PRELUDE } from "./typeTestsPrelude";

export const TEST_DOCUMENT_PATH = "/__type-tests__.ts";

export type TestDocumentSegment = "prelude" | "solution" | "tests";

export interface TestDocument {
  text: string;
  solutionStart: number;
  testsStart: number;
  solutionLength: number;
  testsLength: number;
}

// The semicolon keeps an unterminated last statement of the solution from absorbing the tests.
const SOLUTION_SEPARATOR = "\n;\n";

/** Prelude + solution + tests in one module scope, so tests see the solution's declarations. */
export const buildTestDocument = (solution: string, tests: string): TestDocument => {
  const solutionStart = TYPE_TESTS_PRELUDE.length + 1;
  const testsStart = solutionStart + solution.length + SOLUTION_SEPARATOR.length;
  return {
    text: `${TYPE_TESTS_PRELUDE}\n${solution}${SOLUTION_SEPARATOR}${tests}`,
    solutionStart,
    testsStart,
    solutionLength: solution.length,
    testsLength: tests.length,
  };
};

/** Maps an offset of the assembled document back to the file it came from. */
export const mapToSource = (
  document: TestDocument,
  offset: number
): { segment: TestDocumentSegment; offset: number } => {
  if (offset >= document.testsStart) {
    return { segment: "tests", offset: offset - document.testsStart };
  }
  if (offset >= document.solutionStart) {
    return {
      segment: "solution",
      offset: Math.min(offset - document.solutionStart, document.solutionLength),
    };
  }
  return { segment: "prelude", offset };
};
