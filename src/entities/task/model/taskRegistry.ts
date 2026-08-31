import type { SectionType, Task } from "../types";
import { getTaskSectionById } from "./curriculum-manifest";
import { loadAllTaskSections, loadTaskSection } from "./task-catalog";

export const getTaskById = async (
  taskId: string | number | undefined | null
): Promise<Task | undefined> => {
  if (taskId === null || taskId === undefined || taskId === "") return undefined;

  const tasks = await loadTaskSection(getTaskSectionById(taskId));
  return tasks.find((task) => String(task.id) === String(taskId));
};

export const getTasksBySection = (section: SectionType): Promise<Task[]> =>
  loadTaskSection(section);

export const getAdjacentTasks = (
  taskId: string | number,
  taskList: Task[]
): { prevTask: Task | null; nextTask: Task | null } => {
  const currentIndex = taskList.findIndex((task) => String(task.id) === String(taskId));
  if (currentIndex === -1) return { prevTask: null, nextTask: null };

  return {
    prevTask: currentIndex > 0 ? taskList[currentIndex - 1] : null,
    nextTask: currentIndex < taskList.length - 1 ? taskList[currentIndex + 1] : null,
  };
};

export const searchTasks = async (query: string, section?: SectionType): Promise<Task[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  const tasks = section ? await loadTaskSection(section) : await loadAllTaskSections();
  if (!normalizedQuery) return tasks;

  return tasks.filter((task) => {
    const searchableText = [
      task.title,
      String(task.id),
      task.category,
      task.group,
      task.subgroup,
      task.desc,
    ];
    return searchableText.some((value) => value?.toLowerCase().includes(normalizedQuery));
  });
};
