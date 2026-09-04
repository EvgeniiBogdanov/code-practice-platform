import { useEffect, useSyncExternalStore } from "react";
import type { SectionType, Task, TaskDifficulty } from "../types";

const EMPTY_TASKS: Task[] = [];
const sectionCache: Partial<Record<SectionType, Task[]>> = {};
const sectionPromises: Partial<Record<SectionType, Promise<Task[]>>> = {};
const listeners = new Set<() => void>();
let allTasksSnapshot: Task[] = EMPTY_TASKS;

type RawTask = Omit<Task, "section"> & { section?: SectionType };

const normalizeTasks = (
  tasks: readonly RawTask[],
  section: SectionType,
  fallbackCategory: string,
  fallbackDifficulty?: TaskDifficulty
): Task[] =>
  tasks.map((task) => ({
    ...task,
    section,
    category: task.category ?? task.group ?? fallbackCategory,
    difficulty: task.difficulty ?? fallbackDifficulty,
  }));

const SECTION_LOADERS: Record<SectionType, () => Promise<Task[]>> = {
  javascript: async () => {
    const module = await import("../curriculum/javascript/data/tasksData");
    return normalizeTasks(module.JS_TASKS as readonly RawTask[], "javascript", "JavaScript");
  },
  react: async () => {
    const module = await import("../curriculum/react/data/tasksData");
    return [
      ...normalizeTasks(module.WARMUP_TASKS as readonly RawTask[], "react", "Разминка", "warm-up"),
      ...normalizeTasks(
        module.REFACTORING_TASKS as readonly RawTask[],
        "react",
        "Рефакторинг",
        "refactoring"
      ),
      ...normalizeTasks(
        module.MAIN_TASKS as readonly RawTask[],
        "react",
        "UI-компоненты и паттерны",
        "middle"
      ),
      ...normalizeTasks(
        module.ADVANCED_TASKS as readonly RawTask[],
        "react",
        "Управление состоянием",
        "strong"
      ),
      ...normalizeTasks(
        module.REACT_TS_TASKS as readonly RawTask[],
        "react",
        "TypeScript: Паттерны типизации",
        "ts"
      ),
      ...normalizeTasks(
        module.REACT_TS_PRACTICE_TASKS as readonly RawTask[],
        "react",
        "TypeScript: Прикладные сценарии",
        "ts"
      ),
      ...normalizeTasks(
        module.LIFECYCLE_TASKS as readonly RawTask[],
        "react",
        "Жизненный цикл и рантайм",
        "strong"
      ),
    ];
  },
  algorithms: async () => {
    const module = await import("../curriculum/algorithms/data/tasksData");
    return normalizeTasks(module.ALGO_TASKS as readonly RawTask[], "algorithms", "Algorithms");
  },
};

const emitChange = (): void => {
  allTasksSnapshot = Object.values(sectionCache).flat();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const loadTaskSection = (section: SectionType): Promise<Task[]> => {
  const cached = sectionCache[section];
  if (cached) return Promise.resolve(cached);

  const pending = sectionPromises[section];
  if (pending) return pending;

  const promise = SECTION_LOADERS[section]()
    .then((tasks) => {
      sectionCache[section] = tasks;
      emitChange();
      return tasks;
    })
    .finally(() => {
      delete sectionPromises[section];
    });
  sectionPromises[section] = promise;
  return promise;
};

export const loadAllTaskSections = async (): Promise<Task[]> => {
  const sections = await Promise.all([
    loadTaskSection("javascript"),
    loadTaskSection("react"),
    loadTaskSection("algorithms"),
  ]);
  return sections.flat();
};

export const getLoadedTaskSection = (section: SectionType): Task[] =>
  sectionCache[section] ?? EMPTY_TASKS;

export const getLoadedTaskById = (
  taskId: string | number | undefined | null,
  section?: SectionType
): Task | undefined => {
  if (taskId === null || taskId === undefined || taskId === "") return undefined;
  const sections = section
    ? [getLoadedTaskSection(section)]
    : Object.values(sectionCache);
  return sections.flat().find((task) => String(task.id) === String(taskId));
};

export const useTaskSection = (
  section: SectionType,
  enabled = true
): { tasks: Task[]; isLoading: boolean } => {
  const tasks = useSyncExternalStore(
    subscribe,
    () => getLoadedTaskSection(section),
    () => EMPTY_TASKS
  );

  useEffect(() => {
    if (enabled) void loadTaskSection(section).catch(() => undefined);
  }, [enabled, section]);

  return { tasks, isLoading: enabled && !sectionCache[section] };
};

export const useAllTaskSections = (
  enabled = true
): { tasks: Task[]; isLoading: boolean } => {
  const tasks = useSyncExternalStore(subscribe, () => allTasksSnapshot, () => EMPTY_TASKS);

  useEffect(() => {
    if (enabled) void loadAllTaskSections().catch(() => undefined);
  }, [enabled]);

  const isLoading = enabled && Object.keys(sectionCache).length < 3;
  return { tasks, isLoading };
};

export const useTaskById = (
  taskId: string | number,
  section: SectionType
): { task: Task | undefined; isLoading: boolean } => {
  const { tasks, isLoading } = useTaskSection(section);
  return {
    task: tasks.find((item) => String(item.id) === String(taskId)),
    isLoading,
  };
};
