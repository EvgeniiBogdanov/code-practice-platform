import { Task } from "../types";

export const CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS = new Set<string>([
  "js188",
  "js127",
  "js128",
  "js73",
  "js74",
]);

export const isCandidateLinterDisabled = (task?: Task | null): boolean => {
  if (!task) return false;
  if (task.disableCandidateLinter) return true;
  return CANDIDATE_SYNTAX_CHECK_DISABLED_TASK_IDS.has(String(task.id));
};
