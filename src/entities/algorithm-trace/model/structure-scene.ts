import type {
  TracePanel,
  TraceStructure,
  TraceValue,
  TraceStackLane,
  TraceStackAction,
} from "./algorithm-trace";

export const tracePanel = (
  label: string,
  values: readonly TraceValue[],
  activeIndex = values.length - 1
): TracePanel => ({
  kind: "sequence",
  label,
  entries: values.map((value, i) => ({
    key: String(i),
    value: String(value),
    active: i === activeIndex,
  })),
});
export const stackScene = (
  stacks: readonly TraceStackLane[],
  stackAction?: TraceStackAction
): TraceStructure => ({
  kind: "stack",
  stacks: stacks.map((stack) => ({ ...stack, values: [...stack.values] })),
  stackAction,
  label: "Стек · вершина сверху · LIFO",
  nodes: stacks.flatMap((stack, column) =>
    stack.values.map((value, index) => ({
      id: `${column}-${index}`,
      value,
      column: column * 2,
      row: stack.values.length - index - 1,
      caption: `${stack.label}[${index}]${index === stack.values.length - 1 ? " · top" : ""}`,
      shape: "box" as const,
      state: index === stack.values.length - 1 ? ("active" as const) : undefined,
    }))
  ),
  edges: [],
});

export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
export const buildTraceTree = (
  values: readonly (number | null)[],
  prefix = "n"
): TreeNode | null => {
  if (!values.length || values[0] === null) return null;
  const root: TreeNode = { id: `${prefix}0`, value: values[0], left: null, right: null };
  const queue = [root];
  let index = 1;
  for (let head = 0; head < queue.length && index < values.length; head++) {
    for (const side of ["left", "right"] as const) {
      const value = values[index++];
      if (value !== null && value !== undefined) {
        const node: TreeNode = { id: `${prefix}${index - 1}`, value, left: null, right: null };
        queue[head][side] = node;
        queue.push(node);
      }
    }
  }
  return root;
};
export const treeValues = (root: TreeNode | null): (number | null)[] => {
  const values: (number | null)[] = [];
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    values.push(node?.value ?? null);
    if (node) queue.push(node.left, node.right);
  }
  while (values.length && values.at(-1) === null) values.pop();
  return values;
};
export const treeScene = (
  roots: readonly (TreeNode | null)[],
  active: readonly string[],
  done: readonly string[],
  frontier: readonly string[] = [],
  captions: ReadonlyMap<string, string> = new Map()
): TraceStructure => {
  const nodes: TraceStructure["nodes"][number][] = [];
  const edges: TraceStructure["edges"][number][] = [];
  let column = 0;
  const visit = (node: TreeNode | null, row: number): void => {
    if (!node) return;
    visit(node.left, row + 1);
    nodes.push({
      id: node.id,
      value: node.value,
      column: column++,
      row,
      shape: "circle",
      caption: captions.get(node.id) ?? node.id,
      state: active.includes(node.id)
        ? "active"
        : frontier.includes(node.id)
          ? "frontier"
          : done.includes(node.id)
            ? "done"
            : undefined,
    });
    visit(node.right, row + 1);
    for (const side of ["left", "right"] as const) {
      const child = node[side];
      if (child) edges.push({ from: node.id, to: child.id, label: side === "left" ? "L" : "R" });
    }
  };
  roots.forEach((root) => {
    visit(root, 0);
    column++;
  });
  return {
    kind: "tree",
    label:
      roots.length > 1 ? "Сравнение деревьев p и q" : "Дерево · L / R — левый / правый потомок",
    nodes,
    edges,
  };
};

export const stackAction = (
  kind: TraceStackAction["kind"],
  before: readonly TraceStackLane[],
  items: TraceStackAction["items"]
): TraceStackAction => ({
  kind,
  before: before.map((stack) => ({ ...stack, values: [...stack.values] })),
  items,
});
