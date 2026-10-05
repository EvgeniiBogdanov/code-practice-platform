import type { Task } from "../../../types";

// Sources (candidate, solution, explanation) are resolved from `filepath`,
// and the visible number is derived from the task position in the curriculum.
export type TypeScriptTaskMeta = Required<
  Pick<Task, "title" | "desc" | "difficulty" | "tags" | "checklist" | "questions" | "articles" | "filepath">
> & {
  id: `typescript-${number}`;
};

export interface TypeScriptTaskGroup {
  name: string;
  tasks: TypeScriptTaskMeta[];
}

export const NO_SUPPRESSION_CHECK = "Решение не скрывает ошибки через any или подавляющие директивы.";
