import type { Task } from "../types";

type TestedTask = Pick<Task, "section" | "rawTests">;

/** TypeScript tasks are checked by the compiler: `rawTests` holds type tests. */
export function isTypeTestTask(task?: TestedTask | null): boolean {
  return Boolean(task?.rawTests) && task?.section === "typescript";
}

/** Every other task with `rawTests` is checked by running the solution against them. */
export function isDrillTestTask(task?: TestedTask | null): boolean {
  return Boolean(task?.rawTests) && task?.section !== "typescript";
}
