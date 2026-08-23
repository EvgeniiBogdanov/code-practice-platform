import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
} from "../curriculum/react/data/tasksData";
import { JS_TASKS } from "../curriculum/javascript/data/tasksData";
import { ALGO_TASKS } from "../curriculum/algorithms/data/tasksData";
import { Task, SectionType } from "../types";

export const ALL_REACT_TASKS: Task[] = [
  ...WARMUP_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "warm-up",
    category: t.category || "Разминка",
    section: "react" as SectionType,
  })),
  ...REFACTORING_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "refactoring",
    category: t.category || "Рефакторинг",
    section: "react" as SectionType,
  })),
  ...MAIN_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "middle",
    category: t.category || "Middle",
    section: "react" as SectionType,
  })),
  ...ADVANCED_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "strong",
    category: t.category || "Strong",
    section: "react" as SectionType,
  })),
  ...REACT_TS_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "ts",
    category: t.category || "React + TS (Разминка)",
    section: "react" as SectionType,
  })),
  ...REACT_TS_PRACTICE_TASKS.map((t: any) => ({
    ...t,
    difficulty: t.difficulty || "ts",
    category: t.category || "React + TS (Практика)",
    section: "react" as SectionType,
  })),
];

export const ALL_JS_TASKS: Task[] = JS_TASKS.map((t: any) => ({
  ...t,
  group: t.group,
  subgroup: t.subgroup,
  category: t.group || "JavaScript",
  section: "javascript" as SectionType,
}));

export const ALL_ALGO_TASKS: Task[] = ALGO_TASKS.map((t: any) => ({
  ...t,
  group: t.group,
  subgroup: t.subgroup,
  category: t.group || "Algorithms",
  section: "algorithms" as SectionType,
}));

export const ALL_TASKS: Task[] = [...ALL_REACT_TASKS, ...ALL_JS_TASKS, ...ALL_ALGO_TASKS];

export const TASKS_BY_ID = new Map<string, Task>(ALL_TASKS.map((task) => [String(task.id), task]));

export function getTaskById(taskId: string | number | undefined | null): Task | undefined {
  if (taskId === null || taskId === undefined || taskId === "") return undefined;
  return TASKS_BY_ID.get(String(taskId));
}

export function getTasksBySection(section: SectionType): Task[] {
  if (section === "react") return ALL_REACT_TASKS;
  if (section === "javascript") return ALL_JS_TASKS;
  if (section === "algorithms") return ALL_ALGO_TASKS;
  return [];
}

export function getAdjacentTasks(
  taskId: string | number,
  taskList: Task[] = ALL_TASKS
): { prevTask: Task | null; nextTask: Task | null } {
  const currentIdx = taskList.findIndex((t) => String(t.id) === String(taskId));
  if (currentIdx === -1) {
    return { prevTask: null, nextTask: null };
  }

  return {
    prevTask: currentIdx > 0 ? taskList[currentIdx - 1] : null,
    nextTask: currentIdx < taskList.length - 1 ? taskList[currentIdx + 1] : null,
  };
}

export function searchTasks(query: string, section?: SectionType): Task[] {
  if (!query || !query.trim()) {
    return section ? getTasksBySection(section) : ALL_TASKS;
  }

  const cleanQuery = query.toLowerCase().trim();
  const pool = section ? getTasksBySection(section) : ALL_TASKS;

  return pool.filter((task) => {
    const titleMatch = task.title.toLowerCase().includes(cleanQuery);
    const idMatch = String(task.id).toLowerCase().includes(cleanQuery);
    const categoryMatch = task.category?.toLowerCase().includes(cleanQuery);
    const groupMatch = task.group?.toLowerCase().includes(cleanQuery);
    const descMatch = task.desc?.toLowerCase().includes(cleanQuery);

    return titleMatch || idMatch || categoryMatch || groupMatch || descMatch;
  });
}
