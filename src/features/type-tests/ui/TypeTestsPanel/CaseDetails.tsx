import React from "react";
import type {
  EditorDiagnostic,
  TypeTestCompileResult,
  TypeTestResult,
} from "@/shared/lib/code-editor";
import { TypeBlock } from "./TypeBlock";
import styles from "./CaseDetails.module.css";

const MAX_LISTED_PROBLEMS = 5;

export interface CaseDetailsProps {
  result: TypeTestResult;
  compile: TypeTestCompileResult;
}

/** Why a case failed or was skipped, in the words of the failure kind. */
export const CaseDetails = ({ result, compile }: CaseDetailsProps): React.JSX.Element => {
  const { failure } = result;
  return (
    <div className={styles.details}>
      {result.status === "skipped" && (
        <p className={styles.text}>
          Не проверено{compile.message ? `. ${compile.message}` : ": сначала исправьте решение."}
        </p>
      )}
      {failure?.kind === "mismatch" && (
        <div className={styles.compare}>
          <TypeBlock label="Ожидалось" code={failure.expected} />
          <TypeBlock label="Получено" code={failure.actual} />
        </div>
      )}
      {failure?.kind === "expected-error" && (
        <>
          <p className={styles.text}>Ожидалась ошибка типа, но код скомпилировался.</p>
          {failure.snippet && (
            <TypeBlock label="Эта строка должна быть ошибкой" code={failure.snippet} />
          )}
        </>
      )}
      {failure?.kind === "diagnostic" && <p className={styles.message}>{failure.message}</p>}
      {failure && !compile.passed && (
        <p className={styles.hint}>Сначала исправьте ошибки компиляции в решении.</p>
      )}
    </div>
  );
};

export interface CompileDetailsProps {
  compile: TypeTestCompileResult;
  onShowProblem: (problem: EditorDiagnostic) => void;
}

/** Why the "solution compiles" case failed: the compiler errors, or the reason they are not shown. */
export const CompileDetails = ({
  compile,
  onShowProblem,
}: CompileDetailsProps): React.JSX.Element => {
  const listed = compile.problems.slice(0, MAX_LISTED_PROBLEMS);
  const hidden = compile.problems.length - listed.length;
  return (
    <div className={styles.details}>
      {compile.message && <p className={styles.message}>{compile.message}</p>}
      {listed.length > 0 && (
        <ul className={styles.problems}>
          {listed.map((problem) => (
            <li key={problem.id}>
              <button type="button" className={styles.link} onClick={() => onShowProblem(problem)}>
                {problem.line}:{problem.col} — {problem.message}
              </button>
            </li>
          ))}
        </ul>
      )}
      {hidden > 0 && <p className={styles.hint}>и ещё {hidden}</p>}
    </div>
  );
};
