import type { AlgorithmDefinition } from "../model/algorithm-trace";
import { buildIslandsTrace, buildOrangesTrace, buildFloodTrace } from "../model/grid-traces";

export const gridDefinitions = {
  algo29: {
    pattern: "BFS · компоненты связности",
    invariant: "Каждый новый BFS поглощает ровно один остров; помечаем сушу при входе в очередь.",
    complexity: "O(rows × cols) время и память",
    inputKind: "islands",
    inputLabel: "Сетка JSON",
    inputHint: 'До 5×6 ячеек: 0 — вода, 1 — суша. Допустимы также строки "0" и "1".',
    examples: [
      {
        id: "task1",
        label: "Пример 1: сетка 4×5 (1 остров)",
        input: "[[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: сетка 4×5 (3 острова)",
        input: "[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]]",
        isTask: true,
      },
      {
        id: "diagonals",
        label: "Диагонали не связаны [[1,0],[0,1]]",
        input: "[[1,0],[0,1]]",
      },
      {
        id: "water",
        label: "Только вода [[0,0],[0,0]]",
        input: "[[0,0],[0,0]]",
      },
    ],
    build: buildIslandsTrace,
  },
  algo30: {
    pattern: "BFS · несколько источников",
    invariant: "Все гнилые апельсины стартуют одновременно; одна волна очереди равна одной минуте.",
    complexity: "O(rows × cols) время и память",
    inputKind: "oranges",
    inputLabel: "Сетка JSON",
    inputHint: "До 5×6 ячеек: 0 — пусто, 1 — свежий, 2 — гнилой апельсин.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [[2,1,1],[1,1,0],[0,1,1]] (4 мин)",
        input: "[[2,1,1],[1,1,0],[0,1,1]]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [[2,1,1],[0,1,1],[1,0,1]] (недостижимо, -1)",
        input: "[[2,1,1],[0,1,1],[1,0,1]]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [[0,2]] (нет свежих, 0 мин)",
        input: "[[0,2]]",
        isTask: true,
      },
      {
        id: "no-source",
        label: "Нет источника [[1]]",
        input: "[[1]]",
      },
    ],
    build: buildOrangesTrace,
  },
  algo43: {
    pattern: "BFS · заливка области",
    invariant:
      "Перекрашиваем только связанную со стартом область исходного цвета; помечаем при добавлении.",
    complexity: "O(rows × cols) время и память",
    inputKind: "flood",
    inputLabel: "Изображение JSON",
    inputHint: "До 5×6 целых цветов. sr, sc, color — строка, столбец и новый цвет.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: сетка 3×3, старт (1,1), цвет 2",
        input: "[[1,1,1],[1,1,0],[1,0,1]]",
        parameter: "1,1,2",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [[0,0,0]], тот же цвет",
        input: "[[0,0,0]]",
        parameter: "0,0,0",
        isTask: true,
      },
      {
        id: "single",
        label: "Одна ячейка [[3]], цвет 8",
        input: "[[3]]",
        parameter: "0,0,8",
      },
    ],
    parameter: "sr, sc, color",
    build: buildFloodTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
