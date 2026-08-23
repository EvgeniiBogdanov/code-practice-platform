import { ALL_JS_TASKS, Task } from "@/entities/task";
import { safeDecodeURI } from "@/shared/lib/url";

export interface JsHierarchyNames {
  currentGroupName: string | null;
  currentSubgroupName: string | null;
}

export const resolveJsHierarchyNames = (
  currentTask: Task | null,
  paramId: string | null
): JsHierarchyNames => {
  if (currentTask) {
    return {
      currentGroupName: currentTask.group || null,
      currentSubgroupName: currentTask.subgroup || null,
    };
  }
  if (paramId) {
    if (paramId.startsWith("group-")) {
      const raw = safeDecodeURI(paramId.replace(/^group-/, ""));
      const matched = ALL_JS_TASKS.find((t) => t.group === raw);
      return {
        currentGroupName: matched?.group || raw,
        currentSubgroupName: null,
      };
    }
    if (paramId.startsWith("subgroup-")) {
      const raw = safeDecodeURI(paramId.replace(/^subgroup-/, ""));
      const matched = ALL_JS_TASKS.find(
        (t) =>
          (t.group && t.subgroup && `${t.group}-${t.subgroup}` === raw) ||
          (t.group && t.subgroup && `${t.group}/${t.subgroup}` === raw) ||
          (t.group &&
            t.subgroup &&
            raw.startsWith(`${t.group}-`) &&
            raw.slice(t.group.length + 1) === t.subgroup) ||
          t.subgroup === raw
      );
      if (matched) {
        return {
          currentGroupName: matched.group || null,
          currentSubgroupName: matched.subgroup || null,
        };
      }
      return {
        currentGroupName: null,
        currentSubgroupName: raw,
      };
    }
  }
  return { currentGroupName: null, currentSubgroupName: null };
};
