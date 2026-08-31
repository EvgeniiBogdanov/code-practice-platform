export * from "./types";
export * from "./model/curriculum-manifest";
export * from "./model/sectionsConfig";
export * from "./model/taskTree";
export * from "./model/taskFiles";
export * from "./model/task-route";
export * from "./ui/TaskDifficultyBadge";
export * from "./ui/TaskCard";

export { REACT_GROUPS_CONFIG } from "./curriculum/react/data/groupConfig";
export { JS_GROUP_CONFIG, getGroupMeta } from "./curriculum/javascript/data/groupConfig";
export {
  ALGO_GROUP_CONFIG,
  getAlgoGroupMeta,
  getAlgoGroupMetaByInfoId,
} from "./curriculum/algorithms/data/groupConfig";
export { TASK_EXPLANATIONS } from "./curriculum/taskExplanations";
