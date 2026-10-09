import { useCallback } from "react";
import { requestEditorReveal, type EditorDiagnostic } from "@/shared/lib/code-editor";

/** Lets the panel point at code: selects a compiler error in the solution open in the editor. */
export const useTypeTestsNavigation = (
  solutionFilename: string
): { showCompileProblem: (problem: EditorDiagnostic) => void } => ({
  showCompileProblem: useCallback(
    (problem) =>
      requestEditorReveal({
        filepath: solutionFilename,
        start: problem.start,
        end: Math.max(problem.start, problem.end),
      }),
    [solutionFilename]
  ),
});
