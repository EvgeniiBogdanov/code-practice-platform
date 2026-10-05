import { SectionType } from "../types";

export const CURRICULUM_COUNTS: Record<SectionType, number> = {
  javascript: 256,
  typescript: 54,
  react: 83,
  algorithms: 44,
};

export const getTaskSectionById = (taskId: string | number): SectionType => {
  const id = String(taskId);

  if (id.startsWith("js")) return "javascript";
  if (id.startsWith("typescript-")) return "typescript";
  if (id.startsWith("algo")) return "algorithms";
  return "react";
};
