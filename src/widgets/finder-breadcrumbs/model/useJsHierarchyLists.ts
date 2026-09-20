import { useMemo } from "react";
import { getScriptGroupMeta } from "@/entities/task";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, getGroupCompletionClass } from "@/entities/review";

export const useJsHierarchyLists = (
  currentGroupName: string | null,
  section: "javascript" | "typescript" = "javascript"
) => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);
  const { tasks } = useTaskSection(section);

  const jsGroupsList = useMemo(() => {
    const groupsMap = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const g = t.group || "Общие";
      if (!groupsMap.has(g)) groupsMap.set(g, []);
      groupsMap.get(g)!.push(t);
    });
    return Array.from(groupsMap.entries()).map(([name, groupTasksList]) => {
      const activeGroupTasks = groupTasksList.filter(
        (t) => !excludedTaskIds.includes(String(t.id))
      );
      const completedCount = activeGroupTasks.filter((t) =>
        selectIsTaskCompleted(progressState, t.id)
      ).length;
      const completionClass = getGroupCompletionClass(
        activeGroupTasks,
        reviews,
        progressState.completedTasks
      );
      const meta = getScriptGroupMeta(name, section);
      return { name, tasks: activeGroupTasks, completedCount, completionClass, meta };
    });
  }, [progressState, reviews, tasks, excludedTaskIds, section]);

  const jsSubgroupsList = useMemo(() => {
    if (!currentGroupName) return [];
    const groupTasks = tasks.filter((t) => t.group === currentGroupName);
    const subgroupsMap = new Map<string, Task[]>();
    groupTasks.forEach((t) => {
      const s = t.subgroup || "Разное";
      if (!subgroupsMap.has(s)) subgroupsMap.set(s, []);
      subgroupsMap.get(s)!.push(t);
    });
    return Array.from(subgroupsMap.entries()).map(([name, subTasksList]) => {
      const activeSubTasks = subTasksList.filter((t) => !excludedTaskIds.includes(String(t.id)));
      const completedCount = activeSubTasks.filter((t) =>
        selectIsTaskCompleted(progressState, t.id)
      ).length;
      const completionClass = getGroupCompletionClass(
        activeSubTasks,
        reviews,
        progressState.completedTasks
      );
      return { name, tasks: activeSubTasks, completedCount, completionClass };
    });
  }, [currentGroupName, progressState, reviews, tasks, excludedTaskIds]);

  return { jsGroupsList, jsSubgroupsList, progressState, reviews, tasks };
};
