import type { Task } from "../types";

export const getTaskSolutionSource = (task: Pick<Task, "rawSolution" | "solution">): string =>
  task.rawSolution ?? task.solution ?? "";
