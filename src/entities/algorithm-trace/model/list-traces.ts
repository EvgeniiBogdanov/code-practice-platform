import type { AlgorithmInput, TraceStep, TraceStructure } from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { tracePanel } from "./structure-scene";

const listScene = (
  values: readonly number[],
  next: readonly number[],
  labels: ReadonlyMap<number, string>,
  split = values.length,
  done: readonly number[] = []
): TraceStructure => ({
  kind: "list",
  label: "Связный список · стрелки next · ∅ = null",
  nodes: values.map((value, i) => ({
    id: String(i),
    value,
    column: i < split ? i : i - split,
    row: i < split ? 0 : 2,
    caption: `${labels.get(i) ?? `#${i}`}${next[i] === -1 ? " · next ∅" : ""}`,
    shape: "box",
    state: labels.has(i) ? "active" : done.includes(i) ? "done" : undefined,
  })),
  edges: next.flatMap((to, from) =>
    to < 0 ? [] : [{ from: String(from), to: String(to), label: "next" }]
  ),
});
const links = (length: number): number[] =>
  Array.from({ length }, (_, i) => (i === length - 1 ? -1 : i + 1));
const labelsFor = (pairs: readonly (readonly [string, number])[]): Map<number, string> => {
  const labels = new Map<number, string>();
  pairs.forEach(([label, id]) => {
    if (id >= 0) labels.set(id, [labels.get(id), label].filter(Boolean).join(" · "));
  });
  return labels;
};
export const buildReverseListTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const next = links(values.length),
    done: number[] = [];
  let prev = -1,
    current = values.length ? 0 : -1,
    saved = -1;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [],
    structure: listScene(
      values,
      next,
      labelsFor([
        ["prev", prev],
        ["current", current],
        ["nextTemp", saved],
      ]),
      values.length,
      done
    ),
    panels: [
      tracePanel("Указатели · идентификаторы узлов", [
        `prev: ${prev < 0 ? "∅" : prev}`,
        `current: ${current < 0 ? "∅" : current}`,
        `nextTemp: ${saved < 0 ? "∅" : saved}`,
      ]),
    ],
  }));
  add(
    "let prev = null",
    "Начало разворота",
    "prev = null. Значения и идентификаторы узлов не меняются — меняются только next."
  );
  while (current >= 0) {
    saved = next[current];
    add(
      "const nextTemp = current.next",
      "Сохраняем следующий узел",
      "Сохраняем nextTemp перед разрывом связи."
    );
    next[current] = prev;
    add(
      "current.next = prev",
      "Разворачиваем стрелку",
      `Теперь next узла #${current} указывает на ${prev < 0 ? "null" : `#${prev}`}.`
    );
    done.push(current);
    prev = current;
    add("prev = current", "Передвигаем prev", "Голова развёрнутой части — текущий узел.");
    current = saved;
    saved = -1;
    add(
      "current = nextTemp",
      "Переходим по сохранённой ссылке",
      "Продолжаем с ещё не обработанной частью."
    );
  }
  add("return prev", "Список развёрнут", "prev указывает на новую голову.", {
    result: [...values].reverse(),
  });
  return steps;
};
export const buildCycleTrace = ({
  values,
  parameter: pos,
}: AlgorithmInput): readonly TraceStep[] => {
  const next = links(values.length);
  if (next.length) next[next.length - 1] = pos;
  let slow = values.length ? 0 : -1,
    fast = slow;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [],
    structure: listScene(
      values,
      next,
      labelsFor([
        ["slow", slow],
        ["fast", fast],
      ])
    ),
    panels: [
      tracePanel("Указатели Флойда", [
        `slow: ${slow < 0 ? "∅" : slow}`,
        `fast: ${fast < 0 ? "∅" : fast}`,
        `pos: ${pos}`,
      ]),
    ],
  }));
  add(
    "let slow = head",
    "Два указателя на голове",
    "slow делает один переход next, fast — два. Сравниваем узлы, а не значения."
  );
  while (fast >= 0 && next[fast] >= 0) {
    slow = next[slow];
    add("slow = slow.next", "slow · один переход", `slow → #${slow}.`);
    fast = next[next[fast]];
    add(
      "fast = fast.next.next",
      "fast · два перехода",
      `fast → ${fast < 0 ? "null" : `#${fast}`}.`
    );
    if (slow === fast) {
      add("return true", "Встреча внутри цикла", `Оба указателя на одном узле #${slow}.`, {
        result: true,
      });
      return steps;
    }
  }
  add("return false", "Цикла нет", "Быстрый указатель достиг конца списка.", { result: false });
  return steps;
};
export const buildMergeListsTrace = ({
  values: first,
  secondValues: second = [],
}: AlgorithmInput): readonly TraceStep[] => {
  const values = [...first, ...second],
    next = [
      ...links(first.length),
      ...links(second.length).map((i) => (i < 0 ? -1 : i + first.length)),
    ];
  const merged: number[] = [];
  let a = first.length ? 0 : -1,
    b = second.length ? first.length : -1,
    tail = -1;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [],
    structure: listScene(
      values,
      next,
      labelsFor([
        ["list1", a],
        ["list2", b],
        ["current", tail],
      ]),
      first.length,
      merged
    ),
    panels: [
      tracePanel(
        "Результат · от dummy.next",
        merged.map((i) => values[i])
      ),
    ],
  }));
  add(
    "const dummy =",
    "Два отсортированных списка",
    "Фиктивная голова dummy пока указывает на null. current = dummy."
  );
  const append = (id: number): void => {
    if (tail >= 0) next[tail] = id;
    tail = id;
    merged.push(id);
  };
  while (a >= 0 && b >= 0) {
    add(
      "if (list1.val <= list2.val)",
      "Сравниваем головы",
      `${values[a]} ≤ ${values[b]}: ${values[a] <= values[b]}.`
    );
    if (values[a] <= values[b]) {
      const id = a;
      a = next[a];
      append(id);
      add(
        "current.next = list1",
        "Присоединяем узел list1",
        `Добавлен #${id}; list1 передвинут по next.`
      );
    } else {
      const id = b;
      b = next[b];
      append(id);
      add(
        "current.next = list2",
        "Присоединяем узел list2",
        `Добавлен #${id}; list2 передвинут по next.`
      );
    }
  }
  const rest = a >= 0 ? a : b;
  if (rest >= 0) {
    for (let id = rest; id >= 0; id = next[id]) append(id);
    add(
      a >= 0 ? "current.next = list1" : "current.next = list2",
      "Присоединяем остаток",
      "Один список закончился. Оставшаяся цепочка уже отсортирована.",
      { occurrence: 1 }
    );
  }
  a = -1;
  b = -1;
  add(
    "return dummy.next",
    "Списки объединены",
    "Стрелки соединяют исходные узлы в одну отсортированную цепочку.",
    { result: merged.map((i) => values[i]) }
  );
  return steps;
};
