import { getGroupMeta } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";

export interface GroupedJsTasksResult {
  groupedTasks: Record<string, Record<string, Task[]>>;
  groupMetaMap: Record<string, ReturnType<typeof getGroupMeta>>;
}

export const groupJsTasks = (tasks: readonly Task[]): GroupedJsTasksResult => {
  const groups: Record<string, Record<string, Task[]>> = {};
  const metaMap: Record<string, ReturnType<typeof getGroupMeta>> = {};

  tasks.forEach((task) => {
    const group = task.group || "Общие";
    const subgroup = task.subgroup || "Разное";

    if (!groups[group]) {
      groups[group] = {};
      metaMap[group] = getGroupMeta(group);
    }
    if (!groups[group][subgroup]) groups[group][subgroup] = [];

    groups[group][subgroup].push(task);
  });

  return { groupedTasks: groups, groupMetaMap: metaMap };
};
