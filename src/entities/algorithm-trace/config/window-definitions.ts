import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildLongestSubstringTrace,
  buildMaxAverageTrace,
  buildMinWindowTrace,
} from "../model/window-traces";

export const windowDefinitions = {
  algo8: {
    pattern: "Sliding Window · уникальные символы",
    invariant:
      "Перед добавлением символа удаляем слева всё до его предыдущего вхождения включительно.",
    complexity: "O(n) время · O(Σ) память",
    inputKind: "text",
    build: buildLongestSubstringTrace,
    examples: [
      {
        id: "task-1",
        label: 'Пример 1: "abcabcbb"',
        input: "abcabcbb",
        isTask: true,
      },
      {
        id: "task-2",
        label: 'Пример 2: "bbbbb"',
        input: "bbbbb",
        isTask: true,
      },
      {
        id: "task-3",
        label: 'Пример 3: "pwwkew"',
        input: "pwwkew",
        isTask: true,
      },
      { id: "empty", label: "Пустая строка", input: "" },
    ],
  },
  algo9: {
    pattern: "Sliding Window · фиксированный размер",
    invariant:
      "При сдвиге вычитаем уходящее число и добавляем входящее. Размер полного окна всегда k.",
    complexity: "O(n) время · O(1) память",
    inputKind: "window",
    parameter: "k",
    inputHint: "До 16 целых чисел. Размер окна: 1 ≤ k ≤ длины массива.",
    build: buildMaxAverageTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 12, -5, -6, 50, 3], k = 4",
        input: "1, 12, -5, -6, 50, 3",
        parameter: "4",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [5], k = 1",
        input: "5",
        parameter: "1",
        isTask: true,
      },
      {
        id: "negative",
        label: "Отрицательные средние: [-5, -2, -8, -1], k = 2",
        input: "-5, -2, -8, -1",
        parameter: "2",
      },
      {
        id: "whole",
        label: "Окно во весь массив: [1, 2, 3], k = 3",
        input: "1, 2, 3",
        parameter: "3",
      },
    ],
  },
  algo10: {
    pattern: "Sliding Window · минимальное окно",
    invariant: "Расширяем справа; пока сумма ≥ target, запоминаем длину и сжимаем слева.",
    complexity: "O(n) время · O(1) память",
    inputKind: "positive",
    parameter: "target",
    inputHint: "До 16 положительных целых чисел. target > 0. Пустой массив: [].",
    build: buildMinWindowTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: target = 7, [2, 3, 1, 2, 4, 3]",
        input: "2, 3, 1, 2, 4, 3",
        parameter: "7",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: target = 4, [1, 4, 4]",
        input: "1, 4, 4",
        parameter: "4",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: target = 11, [1, 1, 1, 1, 1, 1, 1, 1]",
        input: "1, 1, 1, 1, 1, 1, 1, 1",
        parameter: "11",
        isTask: true,
      },
      {
        id: "none",
        label: "Недостаточная сумма: [1, 1, 1], target = 8",
        input: "1, 1, 1",
        parameter: "8",
      },
      { id: "empty", label: "Пустой массив: [], target = 1", input: "[]", parameter: "1" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
