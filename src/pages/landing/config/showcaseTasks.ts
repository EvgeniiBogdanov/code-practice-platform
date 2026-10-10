import type { SectionType } from "@/entities/task/meta";

/** Real curriculum tasks used by the landing previews; ids match the workspace routes. */
export interface ShowcaseTask {
  id: string;
  section: SectionType;
  title: string;
  group: string;
  subgroup?: string;
}

export const DEBOUNCE_TASK: ShowcaseTask = {
  id: "js70",
  section: "javascript",
  title: "Практическая задача - debounce",
  group: "Асинхронность",
  subgroup: "Контроль частоты",
};

export const SHOWCASE_TASKS: readonly ShowcaseTask[] = [
  DEBOUNCE_TASK,
  {
    id: "js158",
    section: "javascript",
    title: "Полифил Promise.all",
    group: "Асинхронность",
    subgroup: "Полифилы",
  },
  {
    id: "js171",
    section: "javascript",
    title: "Шина событий (EventEmitter / PubSub)",
    group: "Паттерны проектирования",
    subgroup: "Паттерн Наблюдатель",
  },
  { id: "algo4", section: "algorithms", title: "Two Sum", group: "Hash Map" },
  {
    id: "js116",
    section: "javascript",
    title: "Ограничение параллельности (concurrency pool)",
    group: "Асинхронность",
    subgroup: "Продвинутые паттерны",
  },
  {
    id: "js165",
    section: "javascript",
    title: "Реализация функции throttle",
    group: "Асинхронность",
    subgroup: "Контроль частоты",
  },
  { id: "algo3", section: "algorithms", title: "3Sum", group: "Two Pointers" },
  {
    id: "typescript-22",
    section: "typescript",
    title: "Типизированный EventEmitter",
    group: "Практические паттерны",
  },
  {
    id: "typescript-17",
    section: "typescript",
    title: "Шаблонные строки для имён событий",
    group: "Mapped и Conditional Types",
  },
  {
    id: "a1",
    section: "react",
    title: "Загрузка данных через useReducer",
    group: "Управление состоянием",
  },
  {
    id: "r12",
    section: "react",
    title: "Модальное окно через React Portals",
    group: "Рефакторинг",
  },
];

export const getShowcaseTaskPath = (task: ShowcaseTask): string => `/${task.section}/${task.id}`;
