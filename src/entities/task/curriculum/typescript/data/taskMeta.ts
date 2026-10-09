import type { Task } from "../../../types";

// Sources (candidate, solution, explanation) are resolved from `filepath`,
// and the visible number is derived from the task position in the curriculum.
/** Checklist item that is ticked automatically once all the named tests pass. */
export interface LinkedChecklistItem {
  text: string;
  tests: readonly string[];
}

export type TypeScriptChecklistItem = string | LinkedChecklistItem;

export type TypeScriptTaskMeta = Required<
  Pick<Task, "title" | "desc" | "difficulty" | "tags" | "questions" | "articles" | "filepath">
> & {
  id: `typescript-${number}`;
  checklist: readonly TypeScriptChecklistItem[];
};

/** Links a checklist item to the names of tests in `tests.ts` (see `tests/README.md`). */
export const linked = (text: string, ...tests: string[]): LinkedChecklistItem => ({
  text,
  tests,
});

export interface TypeScriptTaskGroup {
  name: string;
  tasks: TypeScriptTaskMeta[];
}

export const NO_SUPPRESSION_CHECK = "Решение не скрывает ошибки через any или подавляющие директивы.";
