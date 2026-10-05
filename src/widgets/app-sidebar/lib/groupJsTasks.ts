import { getScriptGroupMeta } from "@/entities/task";
import type { Task } from "@/entities/task/meta";

export interface GroupedJsTasksResult {
  groupedTasks: Record<string, Record<string, Task[]>>;
  groupMetaMap: Record<string, ReturnType<typeof getScriptGroupMeta>>;
}

export const groupJsTasks = (
  tasks: readonly Task[],
  section: "javascript" | "typescript" = "javascript"
): GroupedJsTasksResult => {
  const groups: Record<string, Record<string, Task[]>> = {};
  const metaMap: Record<string, ReturnType<typeof getScriptGroupMeta>> = {};

  tasks.forEach((task) => {
    const group = task.group || "Общие";
    const subgroup = task.subgroup || "Разное";

    if (!groups[group]) {
      groups[group] = {};
      metaMap[group] = getScriptGroupMeta(group, section);
    }
    if (!groups[group][subgroup]) groups[group][subgroup] = [];

    groups[group][subgroup].push(task);
  });

  return { groupedTasks: groups, groupMetaMap: metaMap };
};
