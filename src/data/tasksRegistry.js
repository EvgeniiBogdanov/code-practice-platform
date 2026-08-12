import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
  REACT_TASKS,
} from "../react/data/tasksData";
import { JS_TASKS } from "../javascript/data/tasksData";
import { ALGO_TASKS } from "../algorithms/data/tasksData";

/**
 * Единый реестр задач платформы.
 * Каждая задача гарантированно имеет:
 * - section: 'react' | 'javascript' | 'algorithms'
 * - difficulty
 * - category
 *
 * Предоставляет O(1) поиск задач по ID через Map.
 */

export const ALL_REACT_TASKS = [
  ...WARMUP_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "warm-up",
    category: t.category || "Разминка",
    section: "react",
  })),
  ...REFACTORING_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "warm-up",
    category: t.category || "Рефакторинг",
    section: "react",
  })),
  ...MAIN_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "middle",
    category: t.category || "Middle",
    section: "react",
  })),
  ...ADVANCED_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "strong",
    category: t.category || "Strong",
    section: "react",
  })),
  ...REACT_TS_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "ts",
    category: t.category || "React + TS (Разминка)",
    section: "react",
  })),
  ...REACT_TS_PRACTICE_TASKS.map((t) => ({
    ...t,
    difficulty: t.difficulty || "ts",
    category: t.category || "React + TS (Практика)",
    section: "react",
  })),
];

export const ALL_JS_TASKS = JS_TASKS.map((t) => ({
  ...t,
  group: t.group,
  subgroup: t.subgroup,
  category: t.group || "JavaScript",
  section: "javascript",
}));

export const ALL_ALGO_TASKS = ALGO_TASKS.map((t) => ({
  ...t,
  group: t.group,
  subgroup: t.subgroup,
  category: t.group || "Algorithms",
  section: "algorithms",
}));

/**
 * Полный массив всех задач всех разделов тренажёра
 */
export const ALL_TASKS = [
  ...ALL_REACT_TASKS,
  ...ALL_JS_TASKS,
  ...ALL_ALGO_TASKS,
];

/**
 * Map для мгновенного O(1) поиска задачи по ID
 */
export const TASKS_BY_ID = new Map(
  ALL_TASKS.map((task) => [String(task.id), task])
);

/**
 * Получить задачу по ID за O(1).
 * @param {string | number} taskId
 * @returns {object | undefined}
 */
export function getTaskById(taskId) {
  if (taskId === null || taskId === undefined || taskId === "") return undefined;
  return TASKS_BY_ID.get(String(taskId));
}

/**
 * Надёжно определить секцию задачи ('react' | 'javascript' | 'algorithms') за O(1).
 * @param {object | string | number} taskOrId
 * @returns {'react' | 'javascript' | 'algorithms'}
 */
export function resolveTaskSection(taskOrId) {
  if (!taskOrId) return "react";

  if (typeof taskOrId === "object") {
    if (
      taskOrId.section === "algorithms" ||
      taskOrId.section === "javascript" ||
      taskOrId.section === "react"
    ) {
      return taskOrId.section;
    }
    const found = getTaskById(taskOrId.id);
    if (found?.section) return found.section;
  } else {
    const found = getTaskById(taskOrId);
    if (found?.section) return found.section;
  }

  // Fallback по ID-префиксу на случай кастомных/динамических объектов
  const idStr = String(typeof taskOrId === "object" ? taskOrId.id || "" : taskOrId);
  if (idStr.startsWith("algo")) return "algorithms";
  if (idStr.startsWith("js")) return "javascript";

  return "react";
}
