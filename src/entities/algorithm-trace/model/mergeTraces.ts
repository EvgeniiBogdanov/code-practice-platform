import type {
  AlgorithmInput,
  TraceNodeState,
  TracePanel,
  TraceStep,
  TraceStructure,
} from "./algorithmTrace";
import { createTraceRecorder } from "../lib/traceRecorder";

interface Lane {
  readonly name: string;
  readonly values: readonly number[];
  readonly head: number;
  readonly states: ReadonlyMap<number, TraceNodeState>;
  readonly tone?: (index: number) => TraceNodeState | undefined;
}

const laneNodes = (lane: Lane, row: number): TraceStructure["nodes"][number][] =>
  lane.values.map((value, index) => ({
    id: `${lane.name}${index}`,
    value,
    column: index,
    row,
    caption: `${lane.name}[${index}]${index === lane.head ? " ◀" : ""}`,
    shape: "box",
    state: lane.tone?.(index) ?? (index === lane.head ? "active" : lane.states.get(index)),
  }));

const lanesScene = (
  label: string,
  lanes: readonly Lane[],
  result?: readonly { value: number; from: string }[]
): TraceStructure => {
  const resultRow = lanes.length;
  const nodes = [
    ...lanes.flatMap((lane, row) => laneNodes(lane, row)),
    ...(result ?? []).map((item, index) => ({
      id: `r${index}`,
      value: item.value,
      column: index,
      row: resultRow,
      caption: `← ${item.from}`,
      shape: "box" as const,
      state: "done" as const,
    })),
  ];
  const widest = Math.max(...lanes.map((lane) => lane.values.length), result?.length ?? 0);
  return { kind: "lanes", label, compact: widest > 7, nodes, edges: [] };
};

const balance = (label: string, entries: readonly [string, string, boolean?][]): TracePanel => ({
  kind: "balance",
  label,
  entries: entries.map(([key, value, active]) => ({ key, value, active: Boolean(active) })),
});

export const buildSymmetricDifferenceTrace = ({
  values: a,
  secondValues: b = [],
}: AlgorithmInput): readonly TraceStep[] => {
  let i = 0;
  let j = 0;
  const result: { value: number; from: string }[] = [];
  const aStates = new Map<number, TraceNodeState>();
  const bStates = new Map<number, TraceNodeState>();
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: lanesScene(
      "Два отсортированных массива · результат ниже",
      [
        { name: "a", values: a, head: i < a.length ? i : -1, states: aStates },
        { name: "b", values: b, head: j < b.length ? j : -1, states: bStates },
      ],
      result
    ),
    panels: [
      balance("Указатели", [
        ["i", String(i), i < a.length],
        ["j", String(j), j < b.length],
        ["result", JSON.stringify(result.map((item) => item.value))],
      ]),
    ],
  }));
  const pushUnique = (
    value: number,
    from: string,
    states: Map<number, TraceNodeState>,
    at: number
  ): string => {
    if (result.length === 0 || result[result.length - 1].value !== value) {
      result.push({ value, from });
      states.set(at, "done");
      return `${value} добавлено в результат.`;
    }
    states.set(at, "muted");
    return `${value} уже последний в результате: дубликат пропущен.`;
  };
  add(
    "const result = []",
    "Результат пуст",
    "Результат будем строить по возрастанию, поэтому дубликат всегда совпадёт с последним элементом."
  );
  add(
    "let i = 0",
    "Два указателя",
    "i идёт по a, j идёт по b. Оба массива отсортированы, значит, меньший элемент точно «свой»."
  );
  while (i < a.length && j < b.length) {
    add(
      "while (i < a.length && j < b.length)",
      "Оба массива не закончились",
      `Сравниваем a[${i}] = ${a[i]} и b[${j}] = ${b[j]}.`
    );
    if (a[i] === b[j]) {
      add(
        "if (a[i] === b[j])",
        "Значения равны",
        `${a[i]} есть в обоих массивах: в результат не попадает.`
      );
      const common = a[i];
      add(
        "const common = a[i]",
        "Запоминаем общее значение",
        `Пропустим все ${common} в обоих массивах, включая повторы.`
      );
      let skipped = 0;
      while (i < a.length && a[i] === common) {
        aStates.set(i++, "rejected");
        skipped++;
      }
      add(
        "while (i < a.length && a[i] === common) i++",
        "Пропускаем повторы в a",
        `В a пропущено ${skipped} шт.`
      );
      skipped = 0;
      while (j < b.length && b[j] === common) {
        bStates.set(j++, "rejected");
        skipped++;
      }
      add(
        "while (j < b.length && b[j] === common) j++",
        "Пропускаем повторы в b",
        `В b пропущено ${skipped} шт.`
      );
    } else if (a[i] < b[j]) {
      add("if (a[i] === b[j])", "Значения разные", `${a[i]} ≠ ${b[j]}.`);
      add(
        "else if (a[i] < b[j])",
        "a[i] меньше",
        `${a[i]} < ${b[j]}: в b такого значения нет, оно «своё».`
      );
      const note = pushUnique(a[i], `a[${i}]`, aStates, i);
      i++;
      add("pushUnique(a[i++])", "Берём из a", note);
    } else {
      add("if (a[i] === b[j])", "Значения разные", `${a[i]} ≠ ${b[j]}.`);
      add(
        "else if (a[i] < b[j])",
        "a[i] не меньше",
        `${a[i]} > ${b[j]}: в a такого значения нет, b[${j}] «своё».`
      );
      const note = pushUnique(b[j], `b[${j}]`, bStates, j);
      j++;
      add("pushUnique(b[j++])", "Берём из b", note);
    }
  }
  while (i < a.length) {
    const note = pushUnique(a[i], `a[${i}]`, aStates, i);
    i++;
    add(
      "while (i < a.length) pushUnique(a[i++])",
      "Хвост a",
      `b закончился: остаток a «свой». ${note}`
    );
  }
  while (j < b.length) {
    const note = pushUnique(b[j], `b[${j}]`, bStates, j);
    j++;
    add(
      "while (j < b.length) pushUnique(b[j++])",
      "Хвост b",
      `a закончился: остаток b «свой». ${note}`
    );
  }
  add(
    "return result",
    "Результат",
    result.length
      ? `Значения только в одном массиве: ${result.map((item) => item.value).join(", ")}.`
      : "Массивы содержат одни и те же значения.",
    {
      result: result.map((item) => item.value),
    }
  );
  return steps;
};

export const buildCommonElementTrace = ({
  values: a,
  secondValues: b = [],
  thirdValues: c = [],
}: AlgorithmInput): readonly TraceStep[] => {
  let i = 0;
  let j = 0;
  let k = 0;
  const passed = (head: number, index: number): TraceNodeState | undefined =>
    index < head ? "done" : undefined;
  const heads = (): number[] => [a[i], b[j], c[k]].filter((value) => value !== undefined);
  const lane = (name: string, values: readonly number[], head: number): Lane => ({
    name,
    values,
    head: head < values.length ? head : -1,
    states: new Map(),
    tone: (index) => {
      if (index === head) return values[index] === Math.max(...heads()) ? "frontier" : "active";
      return passed(head, index);
    },
  });
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: lanesScene("Три неубывающих массива · планка — максимум трёх значений", [
      lane("a", a, i),
      lane("b", b, j),
      lane("c", c, k),
    ]),
    panels: [
      balance("Текущие значения", [
        ["a[i]", a[i] === undefined ? "—" : String(a[i]), i < a.length],
        ["b[j]", b[j] === undefined ? "—" : String(b[j]), j < b.length],
        ["c[k]", c[k] === undefined ? "—" : String(c[k]), k < c.length],
        ["max", heads().length === 3 ? String(Math.max(...heads())) : "—"],
      ]),
    ],
  }));
  add(
    "let i = 0",
    "Три указателя",
    "Каждый массив получает свой указатель. Двигаются только указатели, значения которых меньше планки."
  );
  while (i < a.length && j < b.length && k < c.length) {
    add(
      "while (i < a.length && j < b.length && k < c.length)",
      "Ни один массив не закончился",
      `Смотрим значения ${a[i]}, ${b[j]} и ${c[k]}.`
    );
    const equal = a[i] === b[j] && b[j] === c[k];
    add(
      "if (a[i] === b[j] && b[j] === c[k])",
      "Все равны?",
      equal
        ? `${a[i]} = ${b[j]} = ${c[k]}: общее значение найдено.`
        : `Значения ${a[i]}, ${b[j]}, ${c[k]} различаются.`
    );
    if (equal) {
      add(
        "return a[i]",
        "Общее число найдено",
        `${a[i]} присутствует во всех трёх массивах. Массивы неубывающие, поэтому оно наименьшее.`,
        { result: a[i] }
      );
      return steps;
    }
    const max = Math.max(a[i], b[j], c[k]);
    add(
      "const max = Math.max(a[i], b[j], c[k])",
      "Планка",
      `Всё, что меньше ${max}, общим быть не может: правее в других массивах таких значений нет.`,
      {
        formula: `max(${a[i]}, ${b[j]}, ${c[k]}) = ${max}`,
      }
    );
    const moved: string[] = [];
    if (a[i] < max) {
      i++;
      moved.push("a");
    }
    add(
      "if (a[i] < max) i++",
      "Сдвиг i",
      moved.includes("a")
        ? "a[i] меньше планки: пропускаем его."
        : "a[i] уже равно планке: остаётся на месте."
    );
    if (b[j] < max) {
      j++;
      moved.push("b");
    }
    add(
      "if (b[j] < max) j++",
      "Сдвиг j",
      moved.includes("b")
        ? "b[j] меньше планки: пропускаем его."
        : "b[j] уже равно планке: остаётся на месте."
    );
    if (c[k] < max) {
      k++;
      moved.push("c");
    }
    add(
      "if (c[k] < max) k++",
      "Сдвиг k",
      moved.includes("c")
        ? "c[k] меньше планки: пропускаем его."
        : "c[k] уже равно планке: остаётся на месте."
    );
  }
  add(
    "return null",
    "Общего числа нет",
    "Один из массивов закончился, а значения, равного во всех трёх, не нашлось.",
    { result: null }
  );
  return steps;
};
