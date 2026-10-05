import type { Task } from "../types";

export const getTaskSolutionSource = (task: Pick<Task, "rawSolution" | "solution">): string =>
  typeof task.rawSolution === "string"
    ? task.rawSolution
    : typeof task.solution === "string"
      ? task.solution
      : "";
