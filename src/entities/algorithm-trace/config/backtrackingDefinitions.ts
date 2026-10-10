import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildSubsetsTrace,
  buildPermutationsTrace,
  buildCombinationsTrace,
  buildParenthesesTrace,
  buildBinaryStringsTrace,
} from "../model/backtrackingTraces";

export const backtrackingDefinitions = {
  algo31: {
    pattern: "Backtracking · подмножества",
    invariant: "Каждый путь — ответ; следующий индекс строго больше предыдущего.",
    complexity: "O(n × 2ⁿ) время с выводом · O(n) рекурсия",
    inputKind: "subsets",
    inputLabel: "Уникальные числа",
    inputHint: "До 5 уникальных чисел. Каждый узел дерева даёт отдельное подмножество.",
    examples: [
      { id: "task-1", label: "Пример 1: [4, 7] (4 подмножества)", input: "4,7", isTask: true },
      { id: "task-2", label: "Пример 2: [1, 5, 9] (8 подмножеств)", input: "1,5,9", isTask: true },
      {
        id: "empty",
        label: "Пустое множество []",
        input: "[]",
      },
    ],
    build: buildSubsetsTrace,
  },
  algo32: {
    pattern: "Backtracking · перестановки и used",
    invariant: "Индекс используется в текущем пути один раз; после возврата его метка снимается.",
    complexity: "O(n × n!) время с выводом · O(n) рекурсия",
    inputKind: "permutations",
    inputLabel: "Уникальные числа",
    inputHint: "До 4 уникальных чисел; ограничение защищает от факториального роста трассы.",
    examples: [
      { id: "task-1", label: "Пример 1: [7, 8] (2 перестановки)", input: "7,8", isTask: true },
      { id: "task-2", label: "Пример 2: [4, 5, 6] (6 перестановок)", input: "4,5,6", isTask: true },
      {
        id: "empty",
        label: "Пустая перестановка []",
        input: "[]",
      },
    ],
    build: buildPermutationsTrace,
  },
  algo33: {
    pattern: "Backtracking · повторный выбор и отсечение",
    invariant: "Индекс не уменьшается; remaining < 0 отсекает ветвь, remaining = 0 даёт решение.",
    complexity: "Экспоненциальное время · O(target / min) глубина",
    inputKind: "combinations",
    inputLabel: "Кандидаты",
    inputHint: "До 4 уникальных положительных чисел; target от 1 до 10. Повторный выбор разрешён.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [3, 4, 5], target = 8",
        input: "3,4,5",
        parameter: "8",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [2, 5], target = 9",
        input: "2,5",
        parameter: "9",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [4, 6], target = 5 (нет наборов)",
        input: "4,6",
        parameter: "5",
        isTask: true,
      },
    ],
    parameter: "target",
    build: buildCombinationsTrace,
  },
  algo34: {
    pattern: "Backtracking · баланс скобок",
    invariant: "Всегда 0 ≤ close ≤ open ≤ n. Невалидное закрытие даже не создаёт ветвь.",
    complexity: "O(n × Cₙ) время с выводом · O(n) рекурсия",
    inputKind: "parentheses",
    inputLabel: "Число пар n",
    inputHint: "n от 0 до 3. Ветви: добавить открывающую или допустимую закрывающую скобку.",
    examples: [
      { id: "task-1", label: "Пример 1: n = 2 (2 комбинации)", input: "2", isTask: true },
      { id: "task-2", label: "Пример 2: n = 3 (5 комбинаций)", input: "3", isTask: true },
      {
        id: "zero",
        label: "Ноль пар (n = 0)",
        input: "0",
      },
    ],
    build: buildParenthesesTrace,
  },
  algo44: {
    pattern: "Backtracking · бинарное дерево выбора",
    invariant: "На каждой глубине выбираем 0 или 1; ответ — путь длины n.",
    complexity: "O(n × 2ⁿ) время с выводом · O(n) рекурсия",
    inputKind: "binary",
    inputLabel: "Длина n",
    inputHint: "n от 0 до 4. Каждая ветвь добавляет один разряд.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: n = 2 (4 строки)",
        input: "2",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: n = 1 (2 строки)",
        input: "1",
        isTask: true,
      },
      {
        id: "task3",
        label: 'Пример 3: n = 0 (строка "")',
        input: "0",
        isTask: true,
      },
      {
        id: "three",
        label: "Три разряда (n = 3)",
        input: "3",
      },
    ],
    build: buildBinaryStringsTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
