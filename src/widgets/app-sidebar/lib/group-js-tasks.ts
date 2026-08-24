import { ALL_JS_TASKS, getGroupMeta, Task } from "@/entities/task";

export interface GroupedJsTasksResult {
  groupedTasks: Record<string, Record<string, Task[]>>;
  groupMetaMap: Record<string, ReturnType<typeof getGroupMeta>>;
}

export const groupJsTasks = (): GroupedJsTasksResult => {
  const groups: Record<string, Record<string, Task[]>> = {};
  const metaMap: Record<string, ReturnType<typeof getGroupMeta>> = {};

  ALL_JS_TASKS.forEach((task) => {
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
