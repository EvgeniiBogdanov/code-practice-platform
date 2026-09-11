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
      { id: "basic", label: "Повторы", input: "abcabcbb" },
      { id: "shrink", label: "Несколько сжатий", input: "pwwkew" },
      { id: "same", label: "Один символ", input: "bbbbb" },
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
      { id: "basic", label: "Сдвиг окна", input: "1, 12, -5, -6, 50, 3", parameter: "4" },
      { id: "negative", label: "Отрицательные средние", input: "-5, -2, -8, -1", parameter: "2" },
      { id: "whole", label: "Окно во весь массив", input: "1, 2, 3", parameter: "3" },
      { id: "single", label: "Один элемент", input: "5", parameter: "1" },
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
      { id: "basic", label: "Расширение и сжатие", input: "2, 3, 1, 2, 4, 3", parameter: "7" },
      { id: "single", label: "Достаточно одного", input: "1, 4, 4", parameter: "4" },
      { id: "none", label: "Недостаточная сумма", input: "1, 1, 1", parameter: "8" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "1" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
