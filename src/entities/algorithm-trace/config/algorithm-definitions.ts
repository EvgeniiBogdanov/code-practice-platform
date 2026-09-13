import { backtrackingDefinitions } from "./backtracking-definitions";
import { gridDefinitions } from "./grid-definitions";
import { treeDefinitions } from "./tree-definitions";
import { listDefinitions } from "./list-definitions";
import { stackDefinitions } from "./stack-definitions";
import { hashDefinitions } from "./hash-definitions";
import { windowDefinitions } from "./window-definitions";
import { prefixDefinitions } from "./prefix-definitions";
import { searchDefinitions } from "./search-definitions";
import {
  buildMoveZeroesTrace,
  buildRemoveDuplicatesTrace,
  buildRemoveElementTrace,
} from "../model/compact-traces";
import {
  buildPalindromeTrace,
  buildParityTrace,
  buildTwoSumTrace,
} from "../model/converging-traces";
import { buildThreeSumTrace } from "../model/three-sum-trace";
import type { AlgorithmDefinition } from "../model/algorithm-trace";
import type { VisualizedAlgorithmId } from "./available-visualizations";

const definitions: Record<VisualizedAlgorithmId, AlgorithmDefinition> = /* @__PURE__ */ (() => ({
  ...stackDefinitions,
  ...listDefinitions,
  ...treeDefinitions,
  ...gridDefinitions,
  ...backtrackingDefinitions,
  ...hashDefinitions,
  ...windowDefinitions,
  ...prefixDefinitions,
  ...searchDefinitions,
  algo38: {
    pattern: "Чтение → запись",
    invariant: "До write — только оставленные числа. read проверяет каждый элемент.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    parameter: "val",
    build: buildRemoveElementTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [3, 2, 2, 3], val = 3",
        input: "3, 2, 2, 3",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [0, 1, 2, 2, 3, 0, 4, 2], val = 2",
        input: "0, 1, 2, 2, 3, 0, 4, 2",
        parameter: "2",
        isTask: true,
      },
      { id: "all", label: "Удаляем всё: [2, 2, 2], val = 2", input: "2, 2, 2", parameter: "2" },
      { id: "none", label: "Нет совпадений: [1, 3, 4], val = 2", input: "1, 3, 4", parameter: "2" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "2" },
    ],
  },
  algo36: {
    pattern: "Медленный и быстрый",
    invariant: "До slow включительно — уникальные числа. fast ищет следующее новое значение.",
    complexity: "O(n) время · O(1) память",
    inputKind: "sorted",
    build: buildRemoveDuplicatesTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 1, 2]",
        input: "1, 1, 2",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
        input: "0, 0, 1, 1, 1, 2, 2, 3, 3, 4",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [1]",
        input: "1",
        isTask: true,
      },
      {
        id: "task-4",
        label: "Пример 4: []",
        input: "[]",
        isTask: true,
      },
      { id: "same", label: "Все одинаковые: [2, 2, 2, 2]", input: "2, 2, 2, 2" },
      { id: "unique", label: "Без дубликатов: [-3, -1, 0, 2]", input: "-3, -1, 0, 2" },
    ],
  },
  algo35: {
    pattern: "Медленный и быстрый",
    invariant: "До slow — ненулевые числа в исходном порядке. Между slow и fast — нули.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    build: buildMoveZeroesTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [0, 1, 0, 3, 12]",
        input: "0, 1, 0, 3, 12",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [0]",
        input: "0",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [1, 2, 3]",
        input: "1, 2, 3",
        isTask: true,
      },
      {
        id: "task-4",
        label: "Пример 4: [0, 0, 1]",
        input: "0, 0, 1",
        isTask: true,
      },
      { id: "zero", label: "Только нули: [0, 0, 0]", input: "0, 0, 0" },
      { id: "none", label: "Без нулей: [1, -2, 3]", input: "1, -2, 3" },
      { id: "empty", label: "Пустой массив: []", input: "[]" },
    ],
  },
  algo2: {
    pattern: "Встречные указатели",
    invariant:
      "Пары снаружи уже проверены. Сравниваем только буквы a–z и цифры 0–9, без учёта регистра.",
    complexity: "O(n) время · O(1) память",
    inputKind: "text",
    build: buildPalindromeTrace,
    examples: [
      {
        id: "task-1",
        label: 'Пример 1: "A man, a plan, a canal: Panama"',
        input: "A man, a plan, a canal: Panama",
        isTask: true,
      },
      {
        id: "task-2",
        label: 'Пример 2: "race a car"',
        input: "race a car",
        isTask: true,
      },
      {
        id: "task-3",
        label: 'Пример 3: " "',
        input: " ",
        isTask: true,
      },
      { id: "basic", label: "Регистр и знаки: A,b a", input: "A,b a" },
      { id: "signs", label: "Только знаки: , : ", input: " , : " },
      { id: "empty", label: "Пустая строка", input: "" },
    ],
  },
  algo37: {
    pattern: "Разделение на месте",
    invariant: "До left — чётные. После right — нечётные. Между ними — непроверенная часть.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    build: buildParityTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [3, 1, 2, 4]",
        input: "3, 1, 2, 4",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [0]",
        input: "0",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [1, 2]",
        input: "1, 2",
        isTask: true,
      },
      {
        id: "task-4",
        label: "Пример 4: [2, 4, 6]",
        input: "2, 4, 6",
        isTask: true,
      },
      {
        id: "task-5",
        label: "Пример 5: [1, 3, 5]",
        input: "1, 3, 5",
        isTask: true,
      },
      { id: "negative", label: "Отрицательные: [-3, -2, -1, 0, 4]", input: "-3, -2, -1, 0, 4" },
      { id: "empty", label: "Пустой массив: []", input: "[]" },
    ],
  },
  algo1: {
    pattern: "Встречные указатели",
    invariant:
      "Пара может быть только между left и right. Сортировка позволяет исключать целые границы.",
    complexity: "O(n) время · O(1) память",
    inputKind: "sorted",
    parameter: "target",
    build: buildTwoSumTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [2, 7, 11, 15], target = 9",
        input: "2, 7, 11, 15",
        parameter: "9",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [2, 3, 4], target = 6",
        input: "2, 3, 4",
        parameter: "6",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [-1, 0], target = -1",
        input: "-1, 0",
        parameter: "-1",
        isTask: true,
      },
      {
        id: "moves",
        label: "Движение обеих границ: [1, 3, 4, 5, 7, 11], target = 9",
        input: "1, 3, 4, 5, 7, 11",
        parameter: "9",
      },
      {
        id: "negative",
        label: "Отрицательные: [-5, -2, 0, 3, 7], target = 1",
        input: "-5, -2, 0, 3, 7",
        parameter: "1",
      },
      { id: "none", label: "Нет пары: [1, 2, 4], target = 10", input: "1, 2, 4", parameter: "10" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
  algo3: {
    pattern: "Якорь + два указателя",
    invariant: "Фиксируем i и ищем пару справа. Пропускаем дубликаты якоря и найденной пары.",
    complexity: "O(n²) время · O(n) копия + ответ",
    inputKind: "array",
    build: buildThreeSumTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [-1, 0, 1, 2, -1, -4]",
        input: "-1, 0, 1, 2, -1, -4",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [0, 1, 1]",
        input: "0, 1, 1",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [0, 0, 0]",
        input: "0, 0, 0",
        isTask: true,
      },
      { id: "duplicates", label: "Пропуск дубликатов: [-2, 0, 0, 2, 2]", input: "-2, 0, 0, 2, 2" },
      { id: "empty", label: "Пустой массив: []", input: "[]" },
    ],
  },
}))();

export const getAlgorithmDefinition = (taskId: string): AlgorithmDefinition | undefined =>
  Object.hasOwn(definitions, taskId) ? definitions[taskId as VisualizedAlgorithmId] : undefined;
