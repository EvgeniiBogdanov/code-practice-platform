import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildBinarySearchTrace,
  buildFirstBadTrace,
  buildRotatedSearchTrace,
  buildSearchInsertTrace,
} from "../model/search-traces";

export const searchDefinitions = {
  algo14: {
    pattern: "Binary Search · точное совпадение",
    invariant:
      "Искомое число может находиться только в [left, right]. Каждый шаг исключает половину.",
    complexity: "O(log n) время · O(1) память",
    inputKind: "sorted",
    parameter: "target",
    build: buildBinarySearchTrace,
    examples: [
      {
        id: "task1",
        label: "Пример 1: [-1, 0, 3, 5, 9, 12], target = 9",
        input: "-1, 0, 3, 5, 9, 12",
        parameter: "9",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [-1, 0, 3, 5, 9, 12], target = 2",
        input: "-1, 0, 3, 5, 9, 12",
        parameter: "2",
        isTask: true,
      },
      { id: "task3", label: "Пример 3: [5], target = 5", input: "5", parameter: "5", isTask: true },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
  algo15: {
    pattern: "Binary Search · позиция вставки",
    invariant: "При пустом диапазоне left указывает на позицию, сохраняющую порядок массива.",
    complexity: "O(log n) время · O(1) память",
    inputKind: "sorted",
    parameter: "target",
    build: buildSearchInsertTrace,
    examples: [
      {
        id: "task1",
        label: "Пример 1: [1, 3, 5, 6], target = 5",
        input: "1, 3, 5, 6",
        parameter: "5",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 3, 5, 6], target = 2",
        input: "1, 3, 5, 6",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [1, 3, 5, 6], target = 7",
        input: "1, 3, 5, 6",
        parameter: "7",
        isTask: true,
      },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
  algo16: {
    pattern: "Binary Search · монотонная граница",
    invariant: "Первая плохая версия остаётся в [left, right]. Плохую середину не исключаем.",
    complexity: "O(log n) вызовов API · O(1) память",
    inputKind: "versions",
    parameter: "firstBad",
    inputLabel: "Число версий n",
    inputHint: "От 1 до 16 версий. firstBad задаёт первую плохую версию (1…n). Индексы сцены с 0.",
    build: buildFirstBadTrace,
    examples: [
      {
        id: "task1",
        label: "Пример 1: n = 5, firstBad = 4",
        input: "5",
        parameter: "4",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: n = 1, firstBad = 1",
        input: "1",
        parameter: "1",
        isTask: true,
      },
      { id: "basic", label: "Граница внутри (n = 8, bad = 4)", input: "8", parameter: "4" },
      { id: "last", label: "Только последняя (n = 5, bad = 5)", input: "5", parameter: "5" },
    ],
  },
  algo17: {
    pattern: "Binary Search · повёрнутый массив",
    invariant: "Одна из половин отсортирована. Проверяем, входит ли target в её границы.",
    complexity: "O(log n) время · O(1) память",
    inputKind: "rotated",
    parameter: "target",
    inputHint:
      "До 16 уникальных целых чисел: отсортированный массив с возможным циклическим сдвигом.",
    build: buildRotatedSearchTrace,
    examples: [
      {
        id: "task1",
        label: "Пример 1: [4, 5, 6, 7, 0, 1, 2], target = 0",
        input: "4, 5, 6, 7, 0, 1, 2",
        parameter: "0",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [4, 5, 6, 7, 0, 1, 2], target = 3",
        input: "4, 5, 6, 7, 0, 1, 2",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [1], target = 0",
        input: "1",
        parameter: "0",
        isTask: true,
      },
      {
        id: "right",
        label: "Правая половина упорядочена (target = 7)",
        input: "6, 7, 0, 1, 2, 4, 5",
        parameter: "7",
      },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
