import { isTaskCompleted, isTaskUnsolved } from "@/entities/progress";
import type { SkillTaskStatus } from "@/entities/skill";

/** Maps a stored task status onto the skill math's vocabulary; any other value counts as not started. */
export const toSkillStatus = (status: unknown): SkillTaskStatus =>
  isTaskCompleted(status) ? "solved" : isTaskUnsolved(status) ? "unsolved" : null;
