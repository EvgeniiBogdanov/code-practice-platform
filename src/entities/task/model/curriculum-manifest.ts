import { SectionType } from "../types";

export const CURRICULUM_COUNTS: Record<SectionType, number> = {
  javascript: 226,
  react: 83,
  algorithms: 34,
};

export const getTaskSectionById = (taskId: string | number): SectionType => {
  const id = String(taskId);

  if (id.startsWith("js")) return "javascript";
  if (id.startsWith("algo")) return "algorithms";
  return "react";
};
