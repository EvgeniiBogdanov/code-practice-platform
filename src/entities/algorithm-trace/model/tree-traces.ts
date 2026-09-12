import type { AlgorithmInput, TraceStep } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import {
  buildTraceTree,
  treeScene,
  treeValues,
  tracePanel,
  type TreeNode,
} from "./structure-scene";

type DfsMode = "depth" | "invert" | "diameter" | "preorder";
const dfsTrace = ({ tree = [] }: AlgorithmInput, mode: DfsMode): readonly TraceStep[] => {
  const root = buildTraceTree(tree),
    calls: TreeNode[] = [],
    done: string[] = [],
    output: number[] = [];
  const heights = new Map<string, string>();
  let active: string[] = [],
    diameter = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values: tree.filter((v): v is number => v !== null),
    pointers: [],
    structure: treeScene(
      [root],
      active,
      done,
      calls.map((node) => node.id),
      heights
    ),
    panels: [
      tracePanel(
        "Стек вызовов · вершина справа",
        calls.map((node) => `${node.id}: ${node.value}`)
      ),
      tracePanel(
        mode === "preorder" ? "Preorder · порядок посещения" : "Возвращаемые высоты",
        mode === "preorder" ? output : [...heights].map(([id, h]) => `${id}: ${h}`)
      ),
      ...(mode === "diameter" ? [tracePanel("Диаметр · число рёбер", [diameter])] : []),
    ],
  }));
  const entry =
    mode === "diameter"
      ? "const height ="
      : mode === "preorder"
        ? "const dfs ="
        : mode === "invert"
          ? "const invertTree ="
          : "const maxDepth =";
  add(
    entry,
    "DFS · спускаемся в глубину",
    "Каждый вызов обрабатывает своё поддерево. После потомков возвращаемся к родителю."
  );
  const visit = (node: TreeNode | null): number => {
    if (!node) {
      active = calls.length ? [calls.at(-1)!.id] : [];
      add(
        mode === "preorder" || mode === "diameter" ? "if (node === null)" : "if (root === null)",
        "База рекурсии · null",
        "Пустой потомок: возвращаемся без нового узла; его высота равна 0."
      );
      return 0;
    }
    calls.push(node);
    active = [node.id];
    add(entry, `Вход в ${node.id}`, `Открываем вызов для узла ${node.value}.`);
    if (mode === "preorder") {
      output.push(node.value);
      add(
        "values.push(node.val)",
        "Посещаем до потомков",
        `Записываем ${node.value}; затем левое и правое поддерево.`
      );
    }
    add(
      mode === "depth"
        ? "const leftDepth ="
        : mode === "diameter"
          ? "const leftHeight ="
          : mode === "invert"
            ? "const left ="
            : "dfs(node.left)",
      "Вызываем левое поддерево",
      "Родитель остаётся в стеке до возврата из рекурсии."
    );
    const left = visit(node.left);
    active = [node.id];
    add(
      mode === "depth"
        ? "const rightDepth ="
        : mode === "diameter"
          ? "const rightHeight ="
          : mode === "invert"
            ? "const right ="
            : "dfs(node.right)",
      "Вызываем правое поддерево",
      `Левое поддерево вернуло высоту ${left}.`
    );
    const right = visit(node.right);
    active = [node.id];
    const height = Math.max(left, right) + 1;
    if (mode === "invert") {
      [node.left, node.right] = [node.right, node.left];
      add(
        "root.right = left",
        "Меняем потомков местами",
        `Узел ${node.value}: стрелки L и R поменяли направления. Значения не меняются.`
      );
    } else if (mode === "diameter") {
      diameter = Math.max(diameter, left + right);
      add(
        "diameter = Math.max",
        "Путь через узел",
        `${left} + ${right} = ${left + right} рёбер; лучший диаметр ${diameter}.`
      );
    }
    heights.set(node.id, `h=${height}`);
    done.push(node.id);
    calls.pop();
    add(
      mode === "depth"
        ? "return Math.max(leftDepth, rightDepth) + 1"
        : mode === "diameter"
          ? "return Math.max(leftHeight, rightHeight) + 1"
          : mode === "invert"
            ? "return root"
            : "dfs(node.right)",
      "Возврат к родителю",
      `Высота поддерева ${node.id}: max(${left}, ${right}) + 1 = ${height}.`
    );
    return height;
  };
  const depth = visit(root);
  active = [];
  add(
    mode === "depth"
      ? root
        ? "return Math.max(leftDepth, rightDepth) + 1"
        : "return 0"
      : mode === "diameter"
        ? "return diameter"
        : mode === "invert"
          ? "return root"
          : "return values",
    "Обход завершён",
    "Стек вызовов пуст; все поддеревья обработаны.",
    {
      result:
        mode === "depth"
          ? depth
          : mode === "diameter"
            ? diameter
            : mode === "invert"
              ? treeValues(root)
              : [...output],
    }
  );
  return steps;
};
export const buildDepthTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  dfsTrace(input, "depth");
export const buildInvertTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  dfsTrace(input, "invert");
export const buildDiameterTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  dfsTrace(input, "diameter");
export const buildPreorderTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  dfsTrace(input, "preorder");

export const buildSameTreeTrace = ({
  tree = [],
  secondTree = [],
}: AlgorithmInput): readonly TraceStep[] => {
  const p = buildTraceTree(tree, "p"),
    q = buildTraceTree(secondTree, "q"),
    calls: string[] = [],
    done: string[] = [];
  let active: string[] = [];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: treeScene([p, q], active, done),
    panels: [tracePanel("Стек пар p / q", calls)],
  }));
  add(
    "const isSameTree =",
    "Синхронный DFS двух деревьев",
    "Сравниваем и форму дерева, и значения соответствующих узлов."
  );
  const visit = (a: TreeNode | null, b: TreeNode | null): boolean => {
    active = [a?.id, b?.id].filter((id): id is string => id !== undefined);
    calls.push(`${a?.id ?? "∅"} / ${b?.id ?? "∅"}`);
    add(
      "if (p === null && q === null)",
      "Сравниваем пару",
      `${a?.value ?? "null"} / ${b?.value ?? "null"}.`
    );
    let equal: boolean;
    if (!a && !b) equal = true;
    else if (!a || !b) {
      equal = false;
      add(
        "if (p === null || q === null)",
        "Форма различается",
        "Один потомок отсутствует, другой существует."
      );
    } else if (a.value !== b.value) {
      equal = false;
      add("if (p.val !== q.val)", "Значения различаются", `${a.value} ≠ ${b.value}.`);
    } else equal = visit(a.left, b.left) && visit(a.right, b.right);
    active = [a?.id, b?.id].filter((id): id is string => id !== undefined);
    if (equal) done.push(...active);
    calls.pop();
    add(
      "return isSameTree(p.left, q.left)",
      "Возврат результата пары",
      `Результат: ${equal}. При false следующие ветви не вызываются.`
    );
    return equal;
  };
  const result = visit(p, q);
  add(
    "return isSameTree(p.left, q.left)",
    result ? "Деревья одинаковы" : "Деревья различаются",
    "Проверка завершена.",
    { result }
  );
  return steps;
};
