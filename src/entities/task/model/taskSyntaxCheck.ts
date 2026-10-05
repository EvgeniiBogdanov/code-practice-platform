import { Task } from "../types";

export const CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS = new Set<string>();

export const isCandidateLinterDisabled = (task?: Task | null): boolean => {
  if (!task) return false;
  return CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has(String(task.id));
};
