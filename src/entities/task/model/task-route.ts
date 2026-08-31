import { SectionType, Task } from "../types";

export type TaskRoute = `/${SectionType}/$taskId`;

export const getTaskRoute = (task: Pick<Task, "section">): TaskRoute => {
  return `/${task.section}/$taskId`;
};
