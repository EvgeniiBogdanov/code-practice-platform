import { SectionType } from "../types";

export const CURRICULUM_COUNTS: Record<SectionType, number> = {
  javascript: 257,
  typescript: 54,
  react: 101,
  algorithms: 58,
  "system-design": 6,
};

export const getTaskSectionById = (taskId: string | number): SectionType => {
  const id = String(taskId);

  if (id.startsWith("js")) return "javascript";
  if (id.startsWith("typescript-")) return "typescript";
  if (id.startsWith("algo")) return "algorithms";
  if (id.startsWith("sd-")) return "system-design";
  return "react";
};
