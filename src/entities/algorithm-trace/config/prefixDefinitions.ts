import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildPivotTrace,
  buildRangeSumTrace,
  buildRunningSumTrace,
  buildSubarraySumTrace,
} from "../model/prefixTraces";

export const prefixDefinitions = {
  algo39: {
    pattern: "Prefix Sum · накопление",
    invariant: "P[i] равен сумме nums[0…i].",
    complexity: "O(n) время · O(n) результат",
    inputKind: "array",
    build: buildRunningSumTrace,
    examples: [
      { id: "task-1", label: "Пример 1: [5, -2, 4]", input: "5, -2, 4", isTask: true },
      { id: "task-2", label: "Пример 2: [0, 0, 1]", input: "0, 0, 1", isTask: true },
      { id: "task-3", label: "Пример 3: []", input: "[]", isTask: true },
      { id: "negative", label: "С отрицательными: [3, -5, 2, 4]", input: "3, -5, 2, 4" },
    ],
  },
  algo11: {
    pattern: "Prefix Sum · запрос диапазона",
    invariant: "P[0] = 0; сумма [left, right] равна P[right + 1] − P[left].",
    complexity: "O(n) подготовка · O(1) запрос · O(n) память",
    inputKind: "array",
    parameter: "left, right",
    inputHint: "Непустой массив до 16 чисел. Диапазон: 0 ≤ left ≤ right < длины.",
    build: buildRangeSumTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [4, -1, 3, 0, 5, -2], [1, 3]",
        input: "4, -1, 3, 0, 5, -2",
        parameter: "1, 3",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [4, -1, 3, 0, 5, -2], [0, 5]",
        input: "4, -1, 3, 0, 5, -2",
        parameter: "0, 5",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [4, -1, 3, 0, 5, -2], [4, 4]",
        input: "4, -1, 3, 0, 5, -2",
        parameter: "4, 4",
        isTask: true,
      },
      {
        id: "single",
        label: "Один элемент: [4, -2, 7], [1, 1]",
        input: "4, -2, 7",
        parameter: "1, 1",
      },
    ],
  },
  algo13: {
    pattern: "Prefix Sum · баланс сумм",
    invariant: "rightSum = totalSum − leftSum − nums[i]. Сам опорный элемент исключён.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    build: buildPivotTrace,
    examples: [
      { id: "task-1", label: "Пример 1: [3, 5, 1, 7, 1]", input: "3, 5, 1, 7, 1", isTask: true },
      { id: "task-2", label: "Пример 2: [4, -4, 9]", input: "4, -4, 9", isTask: true },
      { id: "task-3", label: "Пример 3: [1, 2]", input: "1, 2", isTask: true },
      { id: "task-4", label: "Пример 4: [0]", input: "0", isTask: true },
      { id: "empty", label: "Пустой массив: []", input: "[]" },
    ],
  },
  algo12: {
    pattern: "Prefix Sum + Hash Map · частоты сумм",
    invariant: "Каждый прежний префикс currentSum − k даёт подмассив с суммой k.",
    complexity: "O(n) время · O(n) память",
    inputKind: "array",
    parameter: "k",
    build: buildSubarraySumTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [2, -1, 1, 2], k = 2",
        input: "2, -1, 1, 2",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [3, 0, 3], k = 3",
        input: "3, 0, 3",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [1, 2, 1], k = 5",
        input: "1, 2, 1",
        parameter: "5",
        isTask: true,
      },
      {
        id: "many",
        label: "Повторные префиксы: [0, 0, 0], k = 0",
        input: "0, 0, 0",
        parameter: "0",
      },
      { id: "empty", label: "Пустой массив: [], k = -1", input: "[]", parameter: "-1" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
