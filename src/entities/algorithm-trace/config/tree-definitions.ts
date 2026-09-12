import { buildLevelOrderTrace, buildMinDepthTrace } from "../model/tree-bfs-traces";
import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildDepthTrace,
  buildInvertTrace,
  buildDiameterTrace,
  buildPreorderTrace,
  buildSameTreeTrace,
} from "../model/tree-traces";

export const treeDefinitions = {
  algo24: {
    pattern: "DFS · максимальная глубина",
    invariant: "Высота узла равна max(высот потомков) + 1; null возвращает 0.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [3, 9, 20, null, null, 15, 7] (сбалансированное)",
        input: "[3,9,20,null,null,15,7]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, null, 2] (цепочка)",
        input: "[1,null,2]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
      {
        id: "chain",
        label: "Односторонняя цепочка [1, null, 2, 3]",
        input: "[1,null,2,3]",
      },
    ],
    build: buildDepthTrace,
  },
  algo25: {
    pattern: "DFS · инверсия дерева",
    invariant: "После обработки поддеревьев меняем местами ссылки left и right.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [4, 2, 7, 1, 3, 6, 9] (полное дерево)",
        input: "[4,2,7,1,3,6,9]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [2, 1, 3] (3 узла)",
        input: "[2,1,3]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
      {
        id: "branching",
        label: "Ветвящееся дерево [3, 9, 20, null, null, 15, 7]",
        input: "[3,9,20,null,null,15,7]",
      },
      {
        id: "chain",
        label: "Односторонняя цепочка [1, null, 2, 3]",
        input: "[1,null,2,3]",
      },
    ],
    build: buildInvertTrace,
  },
  algo27: {
    pattern: "DFS · диаметр дерева",
    invariant:
      "Высота возвращается родителю; максимум leftHeight + rightHeight хранит диаметр в рёбрах.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [1, 2, 3, 4, 5] (диаметр 3)",
        input: "[1,2,3,4,5]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 2] (диаметр 1)",
        input: "[1,2]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
      {
        id: "branching",
        label: "Ветвящееся дерево [3, 9, 20, null, null, 15, 7]",
        input: "[3,9,20,null,null,15,7]",
      },
    ],
    build: buildDiameterTrace,
  },
  algo41: {
    pattern: "DFS · preorder",
    invariant: "Посещаем корень, затем левое и правое поддерево.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [1, null, 2, 3] (цепочка)",
        input: "[1,null,2,3]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 2, 3, 4, 5] (сбалансированное)",
        input: "[1,2,3,4,5]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
      {
        id: "branching",
        label: "Ветвящееся дерево [3, 9, 20, null, null, 15, 7]",
        input: "[3,9,20,null,null,15,7]",
      },
    ],
    build: buildPreorderTrace,
  },
  algo26: {
    pattern: "DFS · сравнение двух деревьев",
    invariant:
      "Соответствующие узлы должны одновременно отсутствовать или иметь равные значения и потомков.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "trees",
    inputLabel: "Пара деревьев JSON",
    inputHint: "Два массива level-order: [[1,2,3],[1,null,3]]. До 31 значения на дерево.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [1, 2, 3] и [1, 2, 3] (одинаковые)",
        input: "[[1,2,3],[1,2,3]]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1, 2] и [1, null, 2] (разная структура)",
        input: "[[1,2],[1,null,2]]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [1, 2, 1] и [1, 1, 2] (разные значения)",
        input: "[[1,2,1],[1,1,2]]",
        isTask: true,
      },
      {
        id: "empty",
        label: "Пустые деревья",
        input: "[[],[]]",
      },
    ],
    build: buildSameTreeTrace,
  },
  algo28: {
    pattern: "BFS · обход по уровням",
    invariant: "Очередь хранит узлы в порядке неубывающей глубины; потомки входят в конец.",
    complexity: "O(n) время · O(w) очередь",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [3, 9, 20, null, null, 15, 7]",
        input: "[3,9,20,null,null,15,7]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [1] (один корень)",
        input: "[1]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
      {
        id: "chain",
        label: "Одностороннее дерево [2, null, 3, null, 4]",
        input: "[2,null,3,null,4]",
      },
    ],
    build: buildLevelOrderTrace,
  },
  algo42: {
    pattern: "BFS · ближайший лист",
    invariant:
      "Первый извлечённый лист имеет минимальную глубину. Узел с одним потомком — не лист.",
    complexity: "O(n) время · O(w) очередь",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint:
      "Level-order: [3,9,20,null,null,15,7]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task1",
        label: "Пример 1: [3, 9, 20, null, null, 15, 7] (лист на уровне 2)",
        input: "[3,9,20,null,null,15,7]",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [2, null, 3, null, 4] (одностороннее)",
        input: "[2,null,3,null,4]",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [] (пустое дерево)",
        input: "[]",
        isTask: true,
      },
    ],
    build: buildMinDepthTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
