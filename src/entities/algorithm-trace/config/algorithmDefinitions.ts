import { backtrackingDefinitions } from "./backtrackingDefinitions";
import { gridDefinitions } from "./gridDefinitions";
import { treeDefinitions } from "./treeDefinitions";
import { listDefinitions } from "./listDefinitions";
import { stackDefinitions } from "./stackDefinitions";
import { hashDefinitions } from "./hashDefinitions";
import { windowDefinitions } from "./windowDefinitions";
import { prefixDefinitions } from "./prefixDefinitions";
import { searchDefinitions } from "./searchDefinitions";
import { pointerDefinitions } from "./pointerDefinitions";
import { parsingStackDefinitions } from "./parsingStackDefinitions";
import { graphDefinitions } from "./graphDefinitions";
import { dpDefinitions } from "./dpDefinitions";
import {
  buildMoveZeroesTrace,
  buildRemoveDuplicatesTrace,
  buildRemoveElementTrace,
} from "../model/compactTraces";
import {
  buildPalindromeTrace,
  buildParityTrace,
  buildTwoSumTrace,
} from "../model/convergingTraces";
import { buildThreeSumTrace } from "../model/threeSumTrace";
import type { AlgorithmDefinition } from "../model/algorithmTrace";
import type { VisualizedAlgorithmId } from "./availableVisualizations";

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
  ...pointerDefinitions,
  ...parsingStackDefinitions,
  ...graphDefinitions,
  ...dpDefinitions,
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
        label: "Пример 1: [5, 1, 5, 5, 2], val = 5",
        input: "5, 1, 5, 5, 2",
        parameter: "5",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [4, 4, 0, 7, 4, 9], val = 4",
        input: "4, 4, 0, 7, 4, 9",
        parameter: "4",
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
        label: "Пример 1: [2, 2, 2, 5, 7, 7]",
        input: "2, 2, 2, 5, 7, 7",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [-1, 0, 0, 4]", input: "-1, 0, 0, 4", isTask: true },
      { id: "task-3", label: "Пример 3: [8]", input: "8", isTask: true },
      { id: "task-4", label: "Пример 4: []", input: "[]", isTask: true },
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
        label: "Пример 1: [4, 0, 5, 0, 0, 7]",
        input: "4, 0, 5, 0, 0, 7",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [0, 0, 9]", input: "0, 0, 9", isTask: true },
      { id: "task-3", label: "Пример 3: [2, 8]", input: "2, 8", isTask: true },
      { id: "task-4", label: "Пример 4: [0]", input: "0", isTask: true },
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
        label: 'Пример 1: "Was it a car or a cat I saw?"',
        input: "Was it a car or a cat I saw?",
        isTask: true,
      },
      {
        id: "task-2",
        label: 'Пример 2: "Step on no pets!"',
        input: "Step on no pets!",
        isTask: true,
      },
      { id: "task-3", label: 'Пример 3: "Hello, world"', input: "Hello, world", isTask: true },
      { id: "task-4", label: 'Пример 4: "?!"', input: "?!", isTask: true },
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
      { id: "task-1", label: "Пример 1: [5, 8, 1, 6]", input: "5, 8, 1, 6", isTask: true },
      { id: "task-2", label: "Пример 2: [7, 2]", input: "7, 2", isTask: true },
      { id: "task-3", label: "Пример 3: [4, 10]", input: "4, 10", isTask: true },
      { id: "task-4", label: "Пример 4: [9, 3, 11]", input: "9, 3, 11", isTask: true },
      { id: "task-5", label: "Пример 5: [0]", input: "0", isTask: true },
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
        label: "Пример 1: [1, 3, 4, 6, 9], target = 13",
        input: "1, 3, 4, 6, 9",
        parameter: "13",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [-5, -2, 0, 3, 8], target = 1",
        input: "-5, -2, 0, 3, 8",
        parameter: "1",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [2, 2, 5], target = 4",
        input: "2, 2, 5",
        parameter: "4",
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
      { id: "task-1", label: "Пример 1: [-2, 0, 1, 1, 2]", input: "-2, 0, 1, 1, 2", isTask: true },
      { id: "task-2", label: "Пример 2: [1, 2, -4, 3]", input: "1, 2, -4, 3", isTask: true },
      { id: "task-3", label: "Пример 3: [5, 6, 7]", input: "5, 6, 7", isTask: true },
      { id: "task-4", label: "Пример 4: [0, 0, 0, 0]", input: "0, 0, 0, 0", isTask: true },
      { id: "duplicates", label: "Пропуск дубликатов: [-2, 0, 0, 2, 2]", input: "-2, 0, 0, 2, 2" },
      { id: "empty", label: "Пустой массив: []", input: "[]" },
    ],
  },
}))();

export const getAlgorithmDefinition = (taskId: string): AlgorithmDefinition | undefined =>
  Object.hasOwn(definitions, taskId) ? definitions[taskId as VisualizedAlgorithmId] : undefined;
