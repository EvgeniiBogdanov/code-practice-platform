import { ProgressState, ProgressTaskItem, SectionProgressStats } from "../types";

export const isTaskCompleted = (status: unknown): boolean => {
  return status === "solved" || status === true;
};

export const selectIsTaskCompleted = (state: ProgressState, taskId: string | number): boolean => {
  return isTaskCompleted(state.completedTasks[String(taskId)]);
};

export const selectIsTaskUnsolved = (state: ProgressState, taskId: string | number): boolean => {
  return state.completedTasks[String(taskId)] === "unsolved";
};

export const selectTaskStatus = (
  state: ProgressState,
  taskId: string | number
): "solved" | "unsolved" | "unstarted" => {
  const status = state.completedTasks[String(taskId)];
  if (isTaskCompleted(status)) return "solved";
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
    if (isTaskCompleted(status)) {
      completed++;
    }
  }

  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage };
};
