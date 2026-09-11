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
      { id: "basic", label: "Число найдено", input: "-1, 0, 3, 5, 9, 12", parameter: "9" },
      { id: "none", label: "Числа нет", input: "-1, 0, 3, 5, 9, 12", parameter: "2" },
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
      { id: "basic", label: "Вставка между числами", input: "1, 3, 5, 6", parameter: "2" },
      { id: "found", label: "Число уже есть", input: "1, 3, 5, 6", parameter: "5" },
      { id: "end", label: "Вставка в конец", input: "1, 3, 5, 6", parameter: "7" },
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
      { id: "basic", label: "Граница внутри", input: "8", parameter: "4" },
      { id: "first", label: "Все плохие", input: "5", parameter: "1" },
      { id: "last", label: "Только последняя", input: "5", parameter: "5" },
      { id: "single", label: "Одна версия", input: "1", parameter: "1" },
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
      { id: "basic", label: "После поворота", input: "4, 5, 6, 7, 0, 1, 2", parameter: "0" },
      {
        id: "right",
        label: "Правая половина упорядочена",
        input: "6, 7, 0, 1, 2, 4, 5",
        parameter: "7",
      },
      { id: "none", label: "Числа нет", input: "4, 5, 6, 7, 0, 1, 2", parameter: "3" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
