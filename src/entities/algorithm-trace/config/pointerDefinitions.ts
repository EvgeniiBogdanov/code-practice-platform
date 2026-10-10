import type { AlgorithmDefinition } from "../model/algorithmTrace";
import { buildCommonElementTrace, buildSymmetricDifferenceTrace } from "../model/mergeTraces";
import { buildClosestPersonTrace, buildPalindromeCenterTrace } from "../model/pointerTraces";
import { buildExpandRangesTrace } from "../model/rangeTraces";

export const pointerDefinitions = {
  algo46: {
    pattern: "Два указателя · последнее занятое место",
    invariant:
      "prev — последнее занятое место слева. Каждое новое занятое место закрывает промежуток; края считаются отдельно.",
    complexity: "O(n) время · O(1) память",
    inputKind: "seats",
    inputLabel: "Места (1 — занято, 0 — свободно)",
    inputHint: "От 2 до 14 мест: 1 — занято, 0 — свободно. Нужно хотя бы по одному каждого вида.",
    build: buildClosestPersonTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 0, 0, 0, 0, 0, 1]",
        input: "1, 0, 0, 0, 0, 0, 1",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [0, 0, 0, 1, 0]", input: "0, 0, 0, 1, 0", isTask: true },
      { id: "task-3", label: "Пример 3: [1, 0, 1, 0, 0]", input: "1, 0, 1, 0, 0", isTask: true },
      { id: "task-4", label: "Пример 4: [1, 0]", input: "1, 0", isTask: true },
      { id: "left", label: "Левый край лучше: [0, 0, 0, 1, 0, 1]", input: "0, 0, 0, 1, 0, 1" },
      {
        id: "gap",
        label: "Большой промежуток: [1, 0, 0, 0, 0, 0, 1]",
        input: "1, 0, 0, 0, 0, 0, 1",
      },
    ],
  },
  algo47: {
    pattern: "Два указателя · слияние",
    invariant:
      "Меньший из текущих элементов точно «свой»: в другом отсортированном массиве его нет. Равные значения исключаются целиком.",
    complexity: "O(n + m) время · O(1) память",
    inputKind: "lists",
    inputLabel: "Два отсортированных массива",
    inputHint: "Два неубывающих массива: [[1,2,3,5],[2,3,4,6]]. До 16 чисел в каждом.",
    stateLabels: {
      active: "Текущие значения",
      done: "В результате",
      rejected: "Общее · исключено",
    },
    build: buildSymmetricDifferenceTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1,2,3,5] и [2,3,4,6]",
        input: "[[1,2,3,5],[2,3,4,6]]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [1,1,2] и [2,3,3]",
        input: "[[1,1,2],[2,3,3]]",
        isTask: true,
      },
      { id: "task-3", label: "Пример 3: [] и [1,2]", input: "[[],[1,2]]", isTask: true },
      { id: "task-4", label: "Пример 4: [1,2] и [1,2]", input: "[[1,2],[1,2]]", isTask: true },
      { id: "tail-a", label: "Хвост первого массива: [1,4,7] и [2]", input: "[[1,4,7],[2]]" },
    ],
  },
  algo48: {
    pattern: "Два указателя · расширение от центра",
    invariant:
      "Каждый палиндром определяется центром. Центров 2n − 1: символ (нечётная длина) и промежуток между символами (чётная).",
    complexity: "O(n²) время · O(1) память",
    inputKind: "shortText",
    inputLabel: "Строка s",
    inputHint: "От 1 до 14 символов ASCII без пробелов.",
    build: buildPalindromeCenterTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "bananas"', input: "bananas", isTask: true },
      { id: "task-2", label: 'Пример 2: "xyzzyq"', input: "xyzzyq", isTask: true },
      { id: "task-3", label: 'Пример 3: "noon"', input: "noon", isTask: true },
      { id: "task-4", label: 'Пример 4: "abcd"', input: "abcd", isTask: true },
      { id: "odd", label: 'Нечётный палиндром: "racecar"', input: "racecar" },
      { id: "same", label: 'Одинаковые символы: "aaaa"', input: "aaaa" },
    ],
  },
  algo51: {
    pattern: "Два указателя · три массива",
    invariant:
      "Значения меньше текущего максимума общими быть не могут: правее в других массивах таких нет. Сдвигаем только их указатели.",
    complexity: "O(p + q + r) время · O(1) память",
    inputKind: "triple",
    inputLabel: "Три неубывающих массива",
    inputHint: "Три неубывающих массива: [[1,2,4,5],[3,3,4],[2,3,4,5,6]]. До 8 чисел в каждом.",
    stateLabels: { active: "Текущее значение", frontier: "Планка (максимум)", done: "Пропущено" },
    build: buildCommonElementTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1,2,4,5], [3,3,4], [2,3,4,5,6]",
        input: "[[1,2,4,5],[3,3,4],[2,3,4,5,6]]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: нет общего числа",
        input: "[[1,2,3],[4,5],[6]]",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: повторы [1,1,2], [1,2,2], [1,1,2,2]",
        input: "[[1,1,2],[1,2,2],[1,1,2,2]]",
        isTask: true,
      },
      {
        id: "late",
        label: "Общее значение в конце: [1,5,9], [2,5,9], [5,9,11]",
        input: "[[1,5,9],[2,5,9],[5,9,11]]",
      },
    ],
  },
  algo57: {
    pattern: "Разбор строки · split → map → развернуть",
    invariant:
      "Токен либо число, либо диапазон. Одиночное число — диапазон из одного элемента. Пустая строка обрабатывается отдельно.",
    complexity: "O(n + k) время · O(k) память",
    inputKind: "ranges",
    inputLabel: "Строка ranges",
    inputHint: "Числа и диапазоны через запятую без пробелов: 1-6,8-9,11. Всего до 24 чисел.",
    build: buildExpandRangesTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "1-6,8-9,11"', input: "1-6,8-9,11", isTask: true },
      { id: "task-2", label: 'Пример 2: "5"', input: "5", isTask: true },
      { id: "task-3", label: 'Пример 3: "0-2,10"', input: "0-2,10", isTask: true },
      { id: "task-4", label: "Пример 4: пустая строка", input: "", isTask: true },
      { id: "single", label: 'Диапазон из одного числа: "7-7,9"', input: "7-7,9" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
