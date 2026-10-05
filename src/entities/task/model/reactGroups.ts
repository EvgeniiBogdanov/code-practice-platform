import type { Task } from "../types";

export const REACT_GROUP_CATEGORIES = {
  "group-warmup": "Разминка",
  "group-refactoring": "Рефакторинг",
  "group-middle": "UI-компоненты и паттерны",
  "group-strong": "Управление состоянием",
  "group-lifecycle": "Жизненный цикл и рантайм",
  "group-ts": "TypeScript: Паттерны типизации",
  "group-ts-practice": "TypeScript: Прикладные сценарии",
} as const satisfies Record<string, string>;

export type ReactGroupId = keyof typeof REACT_GROUP_CATEGORIES;

const REACT_GROUP_IDS = Object.keys(REACT_GROUP_CATEGORIES) as ReactGroupId[];

export const getReactGroupId = (task: Pick<Task, "category">): ReactGroupId | undefined =>
  REACT_GROUP_IDS.find((groupId) => REACT_GROUP_CATEGORIES[groupId] === task.category);

export const isTaskInReactGroup = (task: Pick<Task, "category">, groupId: string): boolean =>
  getReactGroupId(task) === groupId;
