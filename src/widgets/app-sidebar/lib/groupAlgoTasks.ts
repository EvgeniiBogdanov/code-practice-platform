import { getAlgoGroupMeta } from "@/entities/task/groups";
import type { Task } from "@/entities/task/meta";

export function groupAlgoTasks(tasks: readonly Task[]): {
  groupedTasks: Record<string, Task[]>;
  groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>>;
} {
  const groupedTasks: Record<string, Task[]> = {};
  const groupMetaMap: Record<string, ReturnType<typeof getAlgoGroupMeta>> = {};

  tasks.forEach((task) => {
    const groupName = task.group || "Общие";
    if (!groupedTasks[groupName]) {
      groupedTasks[groupName] = [];
      groupMetaMap[groupName] = getAlgoGroupMeta(groupName);
    }
    groupedTasks[groupName].push(task);
  });

  return { groupedTasks, groupMetaMap };
}
