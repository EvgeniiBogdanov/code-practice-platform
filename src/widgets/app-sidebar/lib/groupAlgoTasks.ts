import { ALL_ALGO_TASKS, getAlgoGroupMeta, Task } from "@/entities/task";

export interface GroupedAlgoTasksResult {
  groupedTasks: Record<string, Task[]>;
  groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>>;
}

export const groupAlgoTasks = (): GroupedAlgoTasksResult => {
  const groups: Record<string, Task[]> = {};
  const metaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>> = {};

  ALL_ALGO_TASKS.forEach((task) => {
    const group = task.group || "Общие";

    if (!groups[group]) {
      groups[group] = [];
      metaMap[group] = getAlgoGroupMeta(group);
    }

    groups[group].push(task);
  });

  return { groupedTasks: groups, groupMetaMap: metaMap };
};
