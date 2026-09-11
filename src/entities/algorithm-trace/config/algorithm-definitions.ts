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
      { id: "basic", label: "Удаление числа", input: "3, 2, 2, 3", parameter: "3" },
      {
        id: "mixed",
        label: "Несколько вхождений",
        input: "0, 1, 2, 2, 3, 0, 4, 2",
        parameter: "2",
      },
      { id: "all", label: "Удаляем всё", input: "2, 2, 2", parameter: "2" },
      { id: "none", label: "Нет совпадений", input: "1, 3, 4", parameter: "2" },
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
      { id: "basic", label: "Повторяющиеся числа", input: "0, 0, 1, 1, 2, 2, 3" },
      { id: "same", label: "Все одинаковые", input: "2, 2, 2, 2" },
      { id: "unique", label: "Без дубликатов", input: "-3, -1, 0, 2" },
      { id: "single", label: "Одно число", input: "1" },
      { id: "empty", label: "Пустой массив", input: "[]" },
    ],
  },
  algo35: {
    pattern: "Медленный и быстрый",
    invariant: "До slow — ненулевые числа в исходном порядке. Между slow и fast — нули.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    build: buildMoveZeroesTrace,
    examples: [
      { id: "basic", label: "Нули между числами", input: "0, 1, 0, 3, 12" },
      { id: "zero", label: "Только нули", input: "0, 0, 0" },
      { id: "none", label: "Без нулей", input: "1, -2, 3" },
      { id: "single", label: "Одно число", input: "0" },
      { id: "empty", label: "Пустой массив", input: "[]" },
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
      { id: "basic", label: "Регистр и знаки", input: "A,b a" },
      { id: "classic", label: "Panama", input: "A man, a plan, a canal: Panama" },
      { id: "false", label: "Не палиндром", input: "race a car" },
      { id: "signs", label: "Только знаки", input: " , : " },
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
      { id: "basic", label: "Чётные и нечётные", input: "3, 1, 2, 4, 7, 6" },
      { id: "negative", label: "Отрицательные числа", input: "-3, -2, -1, 0, 4" },
      { id: "even", label: "Только чётные", input: "2, 4, 6" },
      { id: "odd", label: "Только нечётные", input: "1, 3, 5" },
      { id: "empty", label: "Пустой массив", input: "[]" },
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
      { id: "basic", label: "Поиск с двух сторон", input: "1, 2, 4, 6, 8, 9", parameter: "10" },
      { id: "moves", label: "Движение обеих границ", input: "1, 3, 4, 5, 7, 11", parameter: "9" },
      { id: "negative", label: "Отрицательные числа", input: "-5, -2, 0, 3, 7", parameter: "1" },
      { id: "none", label: "Нет пары", input: "1, 2, 4", parameter: "10" },
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
      { id: "basic", label: "Две уникальные тройки", input: "-1, 0, 1, 2, -1, -4" },
      { id: "duplicates", label: "Пропуск дубликатов", input: "-2, 0, 0, 2, 2" },
      { id: "zeros", label: "Все нули", input: "0, 0, 0, 0" },
      { id: "none", label: "Нет троек", input: "0, 1, 1" },
      { id: "empty", label: "Пустой массив", input: "[]" },
    ],
  },
}))();

export const getAlgorithmDefinition = (taskId: string): AlgorithmDefinition | undefined =>
  Object.hasOwn(definitions, taskId) ? definitions[taskId as VisualizedAlgorithmId] : undefined;
