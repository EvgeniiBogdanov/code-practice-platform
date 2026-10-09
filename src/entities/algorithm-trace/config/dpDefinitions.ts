import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildClimbingStairsTrace,
  buildCoinChangeTrace,
  buildHouseRobberTrace,
} from "../model/dpTraces";

export const dpDefinitions = {
  algo54: {
    pattern: "DP · скользящие переменные",
    invariant:
      "ways(n) = ways(n − 1) + ways(n − 2). В памяти только два последних значения, поэтому массив dp не нужен.",
    complexity: "O(n) время · O(1) память",
    inputKind: "count",
    inputLabel: "n — число ступенек",
    inputHint: "Целое число ступенек от 1 до 12.",
    build: buildClimbingStairsTrace,
    examples: [
      { id: "task-1", label: "Пример 1: n = 4", input: "4", isTask: true },
      { id: "task-2", label: "Пример 2: n = 6", input: "6", isTask: true },
      { id: "task-3", label: "Пример 3: n = 10", input: "10", isTask: true },
      { id: "one", label: "Одна ступенька: n = 1", input: "1" },
      { id: "large", label: "Больше: n = 10", input: "10" },
    ],
  },
  algo55: {
    pattern: "DP · взять или пропустить",
    invariant:
      "best — максимум для просмотренных домов. Новый дом либо пропускаем (best), либо берём (beforeBest + money).",
    complexity: "O(n) время · O(1) память",
    inputKind: "amounts",
    inputLabel: "nums — деньги в домах",
    inputHint: "От 1 до 10 домов: неотрицательные целые числа до 99.",
    build: buildHouseRobberTrace,
    examples: [
      { id: "task-1", label: "Пример 1: [5, 1, 1, 5]", input: "5, 1, 1, 5", isTask: true },
      { id: "task-2", label: "Пример 2: [3, 10, 3, 1, 2]", input: "3, 10, 3, 1, 2", isTask: true },
      {
        id: "task-3",
        label: "Пример 3: [6, 7, 1, 3, 8, 2, 4]",
        input: "6, 7, 1, 3, 8, 2, 4",
        isTask: true,
      },
      { id: "task-4", label: "Пример 4: [10]", input: "10", isTask: true },
      { id: "greedy", label: "Жадность ошибается: [2, 1, 1, 2]", input: "2, 1, 1, 2" },
      { id: "zeros", label: "Нули: [0, 0, 4, 0]", input: "0, 0, 4, 0" },
    ],
  },
  algo56: {
    pattern: "DP · рюкзак с неограниченным запасом",
    invariant:
      "dp[sum] — минимум монет для суммы sum. Любую монету можно добавить к лучшему решению для sum − coin.",
    complexity: "O(amount · n) время · O(amount) память",
    inputKind: "coins",
    inputLabel: "coins — номиналы",
    inputHint: "От 1 до 4 разных номиналов от 1 до 12. amount — целое число от 0 до 14.",
    parameter: "amount",
    build: buildCoinChangeTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 3, 4], amount = 6 (жадность ошибается)",
        input: "1, 3, 4",
        parameter: "6",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [5, 10], amount = 3",
        input: "5, 10",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [2, 7], amount = 0",
        input: "2, 7",
        parameter: "0",
        isTask: true,
      },
      {
        id: "greedy",
        label: "Жадность ломается: [1, 3, 4], amount = 6",
        input: "1, 3, 4",
        parameter: "6",
      },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
