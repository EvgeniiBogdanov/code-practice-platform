import { Task } from "../types";

/**
 * Groups tasks by their subgroup property.
 * Tasks without a subgroup are assigned to the "Основные задачи" group.
 */
export const groupTasksBySubgroup = (tasks: Task[]): Record<string, Task[]> => {
  const map: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const sub = task.subgroup || "Основные задачи";
    if (!map[sub]) {
      map[sub] = [];
    }
    map[sub].push(task);
  });

  return map;
};

/**
 * Returns true if at least one task in the list belongs to a subgroup.
 */
export const hasTaskSubgroups = (tasks: Task[]): boolean => {
  return tasks.some((t) => Boolean(t.subgroup));
};

/**
 * Constructs a canonical composite key for subgroup state management.
 */
export const getSubgroupKey = (groupName: string, subgroupName: string): string => {
  return `${groupName}/${subgroupName}`;
};
