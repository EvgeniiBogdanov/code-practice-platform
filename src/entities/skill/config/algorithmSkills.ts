import type { SkillDefinition, SkillStep } from "../types";

// Steps follow the learning chains pinned by `taskLearningOrder.test.ts`.
const chainSkill = (
  id: string,
  title: string,
  requires: readonly string[],
  steps: readonly (readonly [title: string, taskIds: readonly string[]])[]
): SkillDefinition => ({
  id,
  section: "algorithms",
  title,
  requires,
  steps: steps.map(([stepTitle, taskIds]): SkillStep => ({ title: stepTitle, match: { taskIds } })),
});

export const ALGORITHM_SKILLS: readonly SkillDefinition[] = [
  chainSkill(
    "algo.hash-map",
    "Hash Map",
    ["js.collections"],
    [
      ["Множества", ["algo6"]],
      ["Поиск дополнения", ["algo4"]],
      ["Частотные словари", ["algo5", "algo7"]],
      ["Массив как хеш-таблица", ["algo45"]],
    ]
  ),
  chainSkill(
    "algo.two-pointers",
    "Two Pointers",
    ["js.loops"],
    [
      ["Чтение и запись", ["algo38", "algo36", "algo35"]],
      ["Параллельные входы", ["algo47", "algo51"]],
      ["Разбор строк", ["algo57"]],
      ["Указатели с двух концов", ["algo2", "algo37", "algo1", "algo3"]],
      ["Метка последнего вхождения", ["algo46"]],
      ["Расширение от центра", ["algo48"]],
    ]
  ),
  chainSkill(
    "algo.sliding-window",
    "Sliding Window",
    ["algo.two-pointers"],
    [
      ["Фиксированное окно", ["algo9"]],
      ["Динамическое окно", ["algo10", "algo8"]],
    ]
  ),
  chainSkill(
    "algo.prefix-sum",
    "Prefix Sum",
    ["algo.hash-map"],
    [
      ["Построение и запросы", ["algo39", "algo11"]],
      ["Баланс слева и справа", ["algo13"]],
      ["Префикс и хеш-таблица", ["algo12"]],
    ]
  ),
  chainSkill(
    "algo.binary-search",
    "Binary Search",
    [],
    [
      ["Поиск и границы", ["algo14", "algo15", "algo16"]],
      ["Повёрнутый массив", ["algo17"]],
    ]
  ),
  chainSkill(
    "algo.stack",
    "Stack",
    [],
    [
      ["Базовый LIFO", ["algo40", "algo18", "algo49"]],
      ["Стек с дополнительным состоянием", ["algo19"]],
      ["Вложенные контексты", ["algo50", "algo58"]],
      ["Монотонный стек", ["algo20"]],
    ]
  ),
  chainSkill(
    "algo.linked-list",
    "Linked List",
    ["algo.two-pointers"],
    [
      ["Перестановка указателей", ["algo21", "algo22"]],
      ["Быстрый и медленный указатели", ["algo23"]],
    ]
  ),
  chainSkill(
    "algo.dfs",
    "Depth-First Search",
    ["algo.stack", "js.recursion"],
    [
      ["Прямой обход", ["algo41"]],
      ["Высота снизу вверх", ["algo24", "algo27"]],
      ["Преобразование дерева", ["algo25"]],
      ["Сравнение структур", ["algo26"]],
    ]
  ),
  chainSkill(
    "algo.bfs",
    "Breadth-First Search",
    ["algo.dfs"],
    [
      ["Уровни дерева", ["algo42", "algo28"]],
      ["Заливка и компоненты", ["algo43", "algo29"]],
      ["Несколько источников", ["algo30"]],
      ["Топологическая сортировка", ["algo52", "algo53"]],
    ]
  ),
  chainSkill(
    "algo.backtracking",
    "Backtracking",
    ["algo.dfs"],
    [
      ["Перебор вариантов", ["algo44", "algo31", "algo32"]],
      ["Перебор с ограничениями", ["algo33", "algo34"]],
    ]
  ),
  chainSkill(
    "algo.dp",
    "Dynamic Programming",
    ["algo.backtracking"],
    [
      ["Одномерные рекуррентности", ["algo54"]],
      ["Взять или пропустить", ["algo55"]],
      ["Неограниченный рюкзак", ["algo56"]],
    ]
  ),
];
