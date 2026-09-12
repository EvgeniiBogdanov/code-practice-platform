import type { AlgorithmInput, TraceStep, TraceStructure, TraceValue } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { tracePanel } from "./structure-scene";

type BacktrackMode = "subsets" | "permutations" | "combinations" | "binary" | "parentheses";
interface DecisionNode {
  id: string;
  value: string;
  parent: string | null;
  depth: number;
  state?: "done" | "rejected";
}
const backtrackTrace = (
  { values, parameter: n }: AlgorithmInput,
  mode: BacktrackMode
): readonly TraceStep[] => {
  const nodes: DecisionNode[] = [{ id: "0", value: "∅", parent: null, depth: 0 }];
  const path: TraceValue[] = [],
    used = new Set<number>(),
    results: TraceValue[][] = [];
  const stringMode = mode === "binary" || mode === "parentheses";
  let active = "0",
    remaining = n;
  const scene = (): TraceStructure => {
    const columns = new Map<string, number>();
    const children = new Map<string, DecisionNode[]>();
    nodes.forEach((node) => {
      if (node.parent !== null)
        children.set(node.parent, [...(children.get(node.parent) ?? []), node]);
    });
    let column = 0;
    const layout = (node: DecisionNode): number => {
      const branch = children.get(node.id) ?? [];
      const positions = branch.map(layout);
      const x = positions.length ? (positions[0] + positions.at(-1)!) / 2 : column++;
      columns.set(node.id, x);
      return x;
    };
    layout(nodes[0]);
    return {
      kind: "decisions",
      label: "Дерево решений · выбор → рекурсия → возврат",
      nodes: nodes.map((node) => ({
        id: node.id,
        value: node.value,
        column: columns.get(node.id)!,
        row: node.depth,
        caption:
          node.state === "rejected"
            ? "отсечение"
            : node.state === "done"
              ? "ответ"
              : `depth ${node.depth}`,
        shape: "diamond",
        state: node.id === active ? "active" : node.state,
      })),
      edges: nodes.flatMap((node) =>
        node.parent === null ? [] : [{ from: node.parent, to: node.id }]
      ),
    };
  };
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [],
    structure: scene(),
    panels: [
      tracePanel("Текущий путь", path),
      tracePanel(
        "Найденные решения",
        results.map((result) => (stringMode ? result.join("") : JSON.stringify(result)))
      ),
      ...(mode === "permutations" ? [tracePanel("used · занятые индексы", [...used])] : []),
      ...(mode === "combinations" ? [tracePanel("remaining", [remaining])] : []),
    ],
  }));
  add(
    "const result = []",
    "Начинаем с пустого пути",
    "Ребро — выбор. После рекурсивного вызова возвращаемся и отменяем выбор."
  );
  const visit = (id: string, start: number, rest: number, open = 0, close = 0): void => {
    active = id;
    remaining = rest;
    const accepted =
      mode === "subsets" ||
      (mode === "permutations" && path.length === values.length) ||
      (mode === "combinations" && rest === 0) ||
      (mode === "binary" && path.length === n) ||
      (mode === "parentheses" && path.length === n * 2);
    if (accepted) {
      results.push([...path]);
      nodes[Number(id)].state = "done";
      add(
        stringMode
          ? "result.push(current)"
          : mode === "combinations"
            ? "result.push([...current])"
            : "result.push([...path])",
        "Сохраняем решение",
        `Найдено: ${JSON.stringify(stringMode ? path.join("") : path)}.`
      );
      if (mode !== "subsets") return;
    }
    if (mode === "combinations" && rest < 0) {
      nodes[Number(id)].state = "rejected";
      add(
        "if (remaining < 0)",
        "Отсекаем ветвь",
        `remaining = ${rest} < 0. Положительные кандидаты уже не исправят сумму.`
      );
      return;
    }
    const choices: { value: TraceValue; index: number }[] = stringMode
      ? (mode === "binary"
          ? ["0", "1"]
          : [...(open < n ? ["("] : []), ...(close < open ? [")"] : [])]
        ).map((value, index) => ({ value, index }))
      : values.flatMap((value, index) =>
          (mode === "permutations" ? !used.has(index) : index >= start) ? [{ value, index }] : []
        );
    if (mode === "parentheses" && close === open && path.length < n * 2)
      add(
        "if (close < open)",
        "Закрывающая скобка запрещена",
        "close = open: закрытие нарушит баланс. Эту ветвь не создаём."
      );
    for (const choice of choices) {
      const child = String(nodes.length);
      path.push(choice.value);
      used.add(choice.index);
      nodes.push({ id: child, parent: id, value: String(choice.value), depth: path.length });
      active = child;
      const line =
        mode === "binary"
          ? choice.value === "0"
            ? "backtrack(`${current}0`)"
            : "backtrack(`${current}1`)"
          : mode === "parentheses"
            ? choice.value === "("
              ? 'backtrack(current + "(", open + 1, close)'
              : 'backtrack(current + ")", open, close + 1)'
            : mode === "combinations"
              ? "current.push(candidates[i])"
              : "path.push(nums[i])";
      add(line, "Выбор · спуск", `Добавляем ${choice.value}. Путь: ${JSON.stringify(path)}.`);
      visit(
        child,
        mode === "combinations" ? choice.index : choice.index + 1,
        rest - (typeof choice.value === "number" ? choice.value : 0),
        open + (choice.value === "(" ? 1 : 0),
        close + (choice.value === ")" ? 1 : 0)
      );
      path.pop();
      used.delete(choice.index);
      active = id;
      remaining = rest;
      add(
        stringMode ? "const backtrack =" : mode === "combinations" ? "current.pop()" : "path.pop()",
        "Возврат · отменяем выбор",
        `Возвращаемся к родительскому пути ${JSON.stringify(path)}. ${stringMode ? "Строка родительского вызова не менялась." : "Последний элемент удалён."}`
      );
    }
  };
  visit("0", 0, n);
  active = "";
  add(
    "return result",
    "Перебор завершён",
    `Найдено решений: ${results.length}. Все допустимые ветви рассмотрены.`,
    { result: stringMode ? results.map((path) => path.join("")) : results.map((path) => [...path]) }
  );
  return steps;
};
export const buildSubsetsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  backtrackTrace(input, "subsets");
export const buildPermutationsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  backtrackTrace(input, "permutations");
export const buildCombinationsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  backtrackTrace(input, "combinations");
export const buildBinaryStringsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  backtrackTrace(input, "binary");
export const buildParenthesesTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  backtrackTrace(input, "parentheses");
