import { ProgressState, ProgressTaskItem, SectionProgressStats } from "../types";

export const selectIsTaskCompleted = (state: ProgressState, taskId: string | number): boolean => {
  const status = state.completedTasks[String(taskId)];
  return status === "solved" || (status as unknown) === true;
};

export const selectTaskStatus = (
  state: ProgressState,
  taskId: string | number
): "solved" | "unsolved" | "unstarted" => {
  const status = state.completedTasks[String(taskId)];
  if (status === "solved" || (status as unknown) === true) return "solved";
  if (status === "unsolved") return "unsolved";
  return "unstarted";
};

export const selectChecklistChecked = (state: ProgressState, key: string): boolean => {
  return Boolean(state.checklistState[key]);
};

export const selectSectionStats = (
  state: ProgressState,
  tasks: ProgressTaskItem[]
): SectionProgressStats => {
  if (!tasks || tasks.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const total = tasks.length;
  let completed = 0;

  for (const task of tasks) {
    const status = state.completedTasks[String(task.id)];
    if (status === "solved" || (status as unknown) === true) {
      completed++;
    }
  }

  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage };
};
