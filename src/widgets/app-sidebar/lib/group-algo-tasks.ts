import { ALL_ALGO_TASKS, getAlgoGroupMeta, Task } from "@/entities/task";

export function groupAlgoTasks(): {
  groupedTasks: Record<string, Task[]>;
  groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>>;
} {
  const groupedTasks: Record<string, Task[]> = {};
  const groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>> = {};

  ALL_ALGO_TASKS.forEach((task) => {
    const groupName = task.group || "Общие";
    if (!groupedTasks[groupName]) {
      groupedTasks[groupName] = [];
      groupMetaMap[groupName] = getAlgoGroupMeta(groupName);
    }
    groupedTasks[groupName].push(task);
  });

  return { groupedTasks, groupMetaMap };
}
