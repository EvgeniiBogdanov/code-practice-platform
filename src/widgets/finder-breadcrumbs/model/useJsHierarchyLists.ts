import { useMemo } from "react";
import { getGroupMeta } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useProgressStore, selectIsTaskCompleted } from "@/entities/progress";
import { useReviewStore, getGroupCompletionClass } from "@/entities/review";

export const useJsHierarchyLists = (currentGroupName: string | null) => {
  const progressState = useProgressStore();
  const reviews = useReviewStore((state) => state.reviews);
  const { tasks } = useTaskSection("javascript");

  const jsGroupsList = useMemo(() => {
    const groupsMap = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const g = t.group || "Общие";
      if (!groupsMap.has(g)) groupsMap.set(g, []);
      groupsMap.get(g)!.push(t);
    });
    return Array.from(groupsMap.entries()).map(([name, tasks]) => {
      const completedCount = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
      const completionClass = getGroupCompletionClass(tasks, reviews, progressState.completedTasks);
      const meta = getGroupMeta(name);
      return { name, tasks, completedCount, completionClass, meta };
    });
  }, [progressState, reviews, tasks]);

  const jsSubgroupsList = useMemo(() => {
    if (!currentGroupName) return [];
    const groupTasks = tasks.filter((t) => t.group === currentGroupName);
    const subgroupsMap = new Map<string, Task[]>();
    groupTasks.forEach((t) => {
      const s = t.subgroup || "Разное";
      if (!subgroupsMap.has(s)) subgroupsMap.set(s, []);
      subgroupsMap.get(s)!.push(t);
    });
    return Array.from(subgroupsMap.entries()).map(([name, tasks]) => {
      const completedCount = tasks.filter((t) => selectIsTaskCompleted(progressState, t.id)).length;
      const completionClass = getGroupCompletionClass(tasks, reviews, progressState.completedTasks);
      return { name, tasks, completedCount, completionClass };
    });
  }, [currentGroupName, progressState, reviews, tasks]);

  return { jsGroupsList, jsSubgroupsList, progressState, reviews, tasks };
};
