import type { AlgorithmDefinition } from "../model/algorithm-trace";
import { buildReverseListTrace, buildMergeListsTrace, buildCycleTrace } from "../model/list-traces";

export const listDefinitions = {
  algo21: {
    pattern: "Linked List · разворот ссылок",
    invariant: "prev — голова развёрнутой части; nextTemp сохраняет ещё не обработанную цепочку.",
    complexity: "O(n) время · O(1) память",
    inputKind: "array",
    inputLabel: "Значения списка",
    inputHint: "До 16 чисел. # — постоянный идентификатор узла; стрелка обозначает next.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [1, 2, 3, 4, 5]",
        input: "1,2,3,4,5",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 2]",
        input: "1,2",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустой список)",
        input: "[]",
        isTask: true,
      },
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
        id: "task1",
        label: "Пример 1: [1, 2, 4] и [1, 3, 4]",
        input: "[[1,2,4],[1,3,4]]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [] и [] (оба пусты)",
        input: "[[],[]]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] и [0] (первый пуст)",
        input: "[[],[0]]",
        isTask: true,
      },
      {
        id: "first-empty",
        label: "Первый пуст ([[], [0, 2]])",
        input: "[[],[0,2]]",
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
        id: "task1",
        label: "Пример 1: [3, 2, 0, -4], pos = 1",
        input: "3,2,0,-4",
        parameter: "1",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 2], pos = 0",
        input: "1,2",
        parameter: "0",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [1], pos = -1 (без цикла)",
        input: "1",
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
