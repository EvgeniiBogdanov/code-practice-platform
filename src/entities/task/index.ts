export * from "./types";
export * from "./model/curriculumManifest";
export * from "./model/sectionsConfig";
export * from "./model/taskTree";
export * from "./model/taskFiles";
export * from "./model/taskRoute";
export * from "./model/taskCatalog";
export * from "./model/taskRegistry";
export * from "./curriculum/typescript/data/groupConfig";
export * from "./model/scriptGroupMeta";
export * from "./model/taskSyntaxCheck";
export * from "./ui/TaskDifficultyBadge";
export * from "./ui/TaskCard";
export * from "./ui/TaskMetaBadges";
export * from "./lib/getJsTaskBadges";
export * from "./lib/getJsTaskProbability";
export * from "./lib/getAlgoTaskBadges";
export * from "./lib/getAlgoTaskProbability";

export { REACT_GROUPS_CONFIG } from "./curriculum/react/data/groupConfig";
export { JS_GROUP_CONFIG, getGroupMeta } from "./curriculum/javascript/data/groupConfig";
export {
  ALGO_GROUP_CONFIG,
  getAlgoGroupMeta,
  getAlgoGroupMetaByInfoId,
} from "./curriculum/algorithms/data/groupConfig";
export { loadTaskExplanations, getCachedTaskExplanation } from "./model/taskExplanations";

export { getTaskSolutionSource } from "./lib/getTaskSolutionSource";
