import { buildLevelOrderTrace, buildMinDepthTrace } from "../model/treeBfsTraces";
import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildDepthTrace,
  buildInvertTrace,
  buildDiameterTrace,
  buildPreorderTrace,
  buildSameTreeTrace,
} from "../model/treeTraces";

export const treeDefinitions = {
  algo24: {
    pattern: "DFS · максимальная глубина",
    invariant: "Высота узла равна max(высот потомков) + 1; null возвращает 0.",
    complexity: "O(n) время · O(h) стек вызовов",
    inputKind: "tree",
    inputLabel: "Дерево JSON",
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [8, 4, 12, null, 6, 10, null, 5]",
        input: "[8,4,12,null,6,10,null,5]",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [1, 2] (два уровня)", input: "[1,2]", isTask: true },
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
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      { id: "task-1", label: "Пример 1: [5, 3, 8, 1, 4]", input: "[5,3,8,1,4]", isTask: true },
      {
        id: "task-2",
        label: "Пример 2: [1, null, 2] (только правый потомок)",
        input: "[1,null,2]",
        isTask: true,
      },
      {
        id: "branching",
        label: "Ветвящееся дерево [6, 2, 9, 1, 4, 7, 12]",
        input: "[6,2,9,1,4,7,12]",
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
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [1, 2, null, 3, 4, 5, null, null, 6] (путь не через корень)",
        input: "[1,2,null,3,4,5,null,null,6]",
        isTask: true,
      },
      { id: "task-2", label: "Пример 2: [7, 3] (диаметр 1)", input: "[7,3]", isTask: true },
      {
        id: "branching",
        label: "Ветвящееся дерево [6, 2, 9, 1, 4, 7, 12]",
        input: "[6,2,9,1,4,7,12]",
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
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [6, 2, 8, 1, 4] (сбалансированное)",
        input: "[6,2,8,1,4]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [3, null, 5, 4] (правая ветка)",
        input: "[3,null,5,4]",
        isTask: true,
      },
      {
        id: "branching",
        label: "Ветвящееся дерево [6, 2, 9, 1, 4, 7, 12]",
        input: "[6,2,9,1,4,7,12]",
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
        id: "task-1",
        label: "Пример 1: [4, 2, 6] и [4, 2, 6] (одинаковые)",
        input: "[[4,2,6],[4,2,6]]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [4, 2] и [4, null, 2] (разная форма)",
        input: "[[4,2],[4,null,2]]",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [4, 2, 6] и [4, 6, 2] (разные значения)",
        input: "[[4,2,6],[4,6,2]]",
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
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [10, 6, 15, 3, 8, null, 20]",
        input: "[10,6,15,3,8,null,20]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [5, null, 7] (правая ветка)",
        input: "[5,null,7]",
        isTask: true,
      },
      { id: "task-3", label: "Пример 3: [] (пустое дерево)", input: "[]", isTask: true },
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
    inputHint: "Level-order: [6,2,9,1,4,7,12]. null — отсутствующий потомок; до 31 значения.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [7, 3, 9, 1, null, 8] (листья на уровне 3)",
        input: "[7,3,9,1,null,8]",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [4, 2, 6, null, null, 5] (лист на уровне 2)",
        input: "[4,2,6,null,null,5]",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: [1, null, 2, null, 3, null, 4] (цепочка)",
        input: "[1,null,2,null,3,null,4]",
        isTask: true,
      },
    ],
    build: buildMinDepthTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
