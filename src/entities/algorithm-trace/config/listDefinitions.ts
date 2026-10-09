import type { AlgorithmDefinition } from "../model/algorithmTrace";
import { buildReverseListTrace, buildMergeListsTrace, buildCycleTrace } from "../model/listTraces";

export const listDefinitions = {
  algo21: {
    pattern: "Linked List · разворот ссылок",
    invariant: "prev — голова развёрнутой части; nextTemp сохраняет ещё не обработанную цепочку.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    inputLabel: "Значения списка",
    inputHint: "До 16 чисел. # — постоянный идентификатор узла; стрелка обозначает next.",
    examples: [
      { id: "task-1", label: "Пример 1: [10, 20, 30]", input: "10,20,30", isTask: true },
      { id: "task-2", label: "Пример 2: [7] (один узел)", input: "7", isTask: true },
      {
        id: "single",
        label: "Один узел (7)",
        input: "7",
      },
    ],
    build: buildReverseListTrace,
  },
  algo22: {
    pattern: "Linked List · слияние цепочек",
    invariant:
      "current — хвост результата; list1 и list2 — головы оставшихся отсортированных цепочек.",
    complexity: "O(n + m) время · O(1) память",
    inputKind: "lists",
    inputLabel: "Два списка JSON",
    inputHint: "[[1,2,4],[1,3,4]]: два отсортированных массива, до 16 чисел в каждом.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 5, 9] и [2, 5, 6, 10]",
        input: "[[1,5,9],[2,5,6,10]]",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [] и [3] (первый пуст)", input: "[[],[3]]", isTask: true },
      {
        id: "task-3",
        label: "Пример 3: [4, 8] и [] (второй пуст)",
        input: "[[4,8],[]]",
        isTask: true,
      },
      {
        id: "first-empty",
        label: "Первый пуст ([[], [0, 2]])",
        input: "[[],[0,2]]",
      },
      {
        id: "second-empty",
        label: "Второй пуст ([[0, 2], []])",
        input: "[[0,2],[]]",
      },
    ],
    build: buildMergeListsTrace,
  },
  algo23: {
    pattern: "Linked List · цикл Флойда",
    invariant: "slow движется на одно ребро, fast — на два. В цикле указатели встретятся.",
    complexity: "O(n) время · O(1) память",
    inputKind: "cycle",
    inputLabel: "Значения списка",
    inputHint: "До 16 чисел. pos — индекс замыкания хвоста; −1 — без цикла.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [5, 8, 1, 7], pos = 2",
        input: "5,8,1,7",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [9, 4], pos = 1 (петля на себя)",
        input: "9,4",
        parameter: "1",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [6, 2, 3], pos = -1 (без цикла)",
        input: "6,2,3",
        parameter: "-1",
        isTask: true,
      },
      {
        id: "no-cycle",
        label: "Без цикла [1, 2, 3]",
        input: "1,2,3",
        parameter: "-1",
      },
      {
        id: "empty",
        label: "Пустой список",
        input: "[]",
        parameter: "-1",
      },
    ],
    parameter: "pos",
    build: buildCycleTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
