import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildPivotTrace,
  buildRangeSumTrace,
  buildRunningSumTrace,
  buildSubarraySumTrace,
} from "../model/prefix-traces";

export const prefixDefinitions = {
  algo39: {
    pattern: "Prefix Sum · накопление",
    invariant: "P[i] равен сумме nums[0…i].",
    complexity: "O(n) время · O(n) результат",
    inputKind: "array",
    build: buildRunningSumTrace,
    examples: [
      { id: "basic", label: "Накопление суммы", input: "1, 2, 3, 4" },
      { id: "negative", label: "С отрицательными", input: "3, -5, 2, 4" },
      { id: "empty", label: "Пустой массив", input: "[]" },
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
        id: "basic",
        label: "Вычитание префиксов",
        input: "-2, 0, 3, -5, 2, -1",
        parameter: "2, 5",
      },
      { id: "whole", label: "Весь массив", input: "-2, 0, 3, -5, 2, -1", parameter: "0, 5" },
      { id: "single", label: "Один элемент", input: "4, -2, 7", parameter: "1, 1" },
    ],
  },
  algo13: {
    pattern: "Prefix Sum · баланс сумм",
    invariant: "rightSum = totalSum − leftSum − nums[i]. Сам опорный элемент исключён.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    build: buildPivotTrace,
    examples: [
      { id: "basic", label: "Равновесие в середине", input: "1, 7, 3, 6, 5, 6" },
      { id: "edge", label: "Опора на краю", input: "2, 1, -1" },
      { id: "none", label: "Нет равновесия", input: "1, 2, 3" },
      { id: "empty", label: "Пустой массив", input: "[]" },
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
      { id: "basic", label: "Два подмассива", input: "1, 1, 1", parameter: "2" },
      { id: "zero", label: "Нули и отрицательные", input: "1, -1, 0", parameter: "0" },
      { id: "many", label: "Повторные префиксы", input: "0, 0, 0", parameter: "0" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "-1" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
