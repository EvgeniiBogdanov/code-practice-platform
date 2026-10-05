import {
  getAlgoTaskProbabilityInfo,
  getJsTaskProbabilityInfo,
  type TaskProbabilityInfo,
} from "@/entities/task";
import type { ShowcaseTask } from "../config/showcaseTasks";

/** Interview probability from the same tables the workspace uses for its gauge badges. */
export const getShowcaseProbability = (task: ShowcaseTask): TaskProbabilityInfo | null =>
  task.section === "algorithms" ? getAlgoTaskProbabilityInfo(task) : getJsTaskProbabilityInfo(task);
