import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildLongestSubstringTrace,
  buildMaxAverageTrace,
  buildMinWindowTrace,
} from "../model/windowTraces";

export const windowDefinitions = {
  algo8: {
    pattern: "Sliding Window · уникальные символы",
    invariant:
      "Перед добавлением символа удаляем слева всё до его предыдущего вхождения включительно.",
    complexity: "O(n) время · O(Σ) память",
    inputKind: "text",
    build: buildLongestSubstringTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "pizzaparty"', input: "pizzaparty", isTask: true },
      { id: "task-2", label: 'Пример 2: "aaaa"', input: "aaaa", isTask: true },
      { id: "task-3", label: 'Пример 3: "abba"', input: "abba", isTask: true },
      { id: "task-4", label: 'Пример 4: "qwerty"', input: "qwerty", isTask: true },
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
        label: "Пример 1: [2, 9, -4, 7, 5, 1], k = 2",
        input: "2, 9, -4, 7, 5, 1",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [-3, -1, -7], k = 1",
        input: "-3, -1, -7",
        parameter: "1",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [6, 2, 4, 8], k = 4",
        input: "6, 2, 4, 8",
        parameter: "4",
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
        label: "Пример 1: target = 9, [1, 4, 2, 5, 3, 1]",
        input: "1, 4, 2, 5, 3, 1",
        parameter: "9",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: target = 6, [6, 1, 1]",
        input: "6, 1, 1",
        parameter: "6",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: target = 15, [2, 3, 4]",
        input: "2, 3, 4",
        parameter: "15",
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
