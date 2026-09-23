import type { AlgorithmInput, TraceStep } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { buildTraceTree, treeScene, tracePanel, type TreeNode } from "./structure-scene";

const bfsTreeTrace = ({ tree = [] }: AlgorithmInput, minimum: boolean): readonly TraceStep[] => {
  const root = buildTraceTree(tree);
  const queue: { node: TreeNode; depth: number }[] = root ? [{ node: root, depth: 1 }] : [];
  const done: string[] = [],
    levels: number[][] = [];
  let head = 0,
    active: string[] = [],
    currentLevel: number[] = [];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: treeScene(
      [root],
      active,
      done,
      queue.slice(head).map(({ node }) => node.id)
    ),
    panels: [
      tracePanel(
        "Очередь FIFO · выход слева",
        queue.slice(head).map(({ node, depth }) => `${node.id}: ${node.value} (d=${depth})`)
      ),
      ...(!minimum
        ? [
            tracePanel("Текущий уровень", currentLevel),
            tracePanel(
              "Готовые уровни",
              levels.map((level) => JSON.stringify(level))
            ),
          ]
        : []),
    ],
  }));
  add(
    minimum ? "const minDepth =" : "const levelOrder =",
    "BFS · очередь уровней",
    "Сначала обрабатываем ближайшие к корню узлы. Потомки входят в конец очереди."
  );
  add(
    "if (root === null)",
    "Проверяем корень",
    root
      ? "Корень существует; начинаем обход по уровням."
      : "Пустое дерево не содержит уровней и листьев."
  );
  if (!root) {
    add(minimum ? "return 0" : "return levels", "Пустое дерево", "Очередь остаётся пустой.", {
      result: minimum ? 0 : [],
    });
    return steps;
  }
  while (head < queue.length) {
    add(
      minimum ? "while (head < queue.length)" : "while (queue.length > 0)",
      "Проверяем очередь",
      `Ожидают обработки ${queue.length - head} узлов.`
    );
    const end = queue.length;
    currentLevel = [];
    if (!minimum)
      add(
        "const levelSize = queue.length",
        "Фиксируем размер уровня",
        `На текущем уровне ${end - head} узлов. Новые потомки относятся к следующему.`
      );
    while (head < end) {
      if (!minimum)
        add(
          "for (let i = 0; i < levelSize; i += 1)",
          "Следующий узел уровня",
          `Узел ${head + 1} из ${end} в очереди.`
        );
      const { node, depth } = queue[head++];
      active = [node.id];
      add(
        minimum ? "const [node, depth] = queue[head]" : "const node = queue.shift()",
        "Dequeue · берём первый узел",
        `${node.value}, глубина ${depth}.`
      );
      if (minimum) add("head++", "Сдвигаем голову очереди", `Следующий индекс очереди: ${head}.`);
      if (minimum)
        add(
          "if (node.left === null && node.right === null)",
          "Проверяем лист",
          !node.left && !node.right
            ? `Узел ${node.value} — первый найденный лист.`
            : `Узел ${node.value} имеет потомков.`
        );
      if (minimum && !node.left && !node.right) {
        done.push(node.id);
        add(
          "return depth",
          "Первый лист — ближайший",
          `Минимальная глубина ${depth}. Дальнейший обход не нужен.`,
          { result: depth }
        );
        return steps;
      }
      if (!minimum) {
        currentLevel.push(node.value);
        add(
          "currentLevel.push(node.val)",
          "Записываем узел уровня",
          `${node.value} добавлен в текущий уровень.`
        );
      }
      for (const side of ["left", "right"] as const) {
        const child = node[side];
        add(
          `if (node.${side} !== null)`,
          "Проверяем потомка",
          child
            ? `${side === "left" ? "Левый" : "Правый"} потомок ${child.value} добавится в очередь.`
            : `${side === "left" ? "Левого" : "Правого"} потомка нет.`
        );
        if (child) {
          queue.push({ node: child, depth: depth + 1 });
          add(
            minimum ? `queue.push([node.${side}, depth + 1])` : `queue.push(node.${side})`,
            "Enqueue · добавляем потомка",
            `${child.value} входит в конец очереди на глубине ${depth + 1}.`
          );
        }
      }
      done.push(node.id);
    }
    if (!minimum) {
      levels.push([...currentLevel]);
      add(
        "levels.push(currentLevel)",
        "Уровень готов",
        "Все узлы текущего уровня записаны. Очередь содержит следующий уровень."
      );
    }
  }
  active = [];
  add(
    minimum ? "return 0" : "return levels",
    "Обход завершён",
    root ? "Очередь пуста." : "Пустое дерево.",
    { result: minimum ? 0 : levels.map((level) => [...level]), occurrence: 1 }
  );
  return steps;
};
export const buildLevelOrderTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  bfsTreeTrace(input, false);
export const buildMinDepthTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  bfsTreeTrace(input, true);
