import { createTraceRecorder, indices } from "../lib/trace-recorder";
import { mapPanel } from "./hash-traces";
import type { AlgorithmInput, TracePanel, TraceStep } from "./algorithm-trace";

const prefixPanel = (prefix: readonly number[], active: readonly number[] = []): TracePanel => ({
  kind: "prefix",
  label: "Префиксные суммы",
  entries: prefix.map((value, i) => ({
    key: `P[${i}]`,
    value: String(value),
    active: active.includes(i),
  })),
});

export const buildRunningSumTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const prefix: number[] = [];
  let sum = 0;
  let i = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [{ label: "num", index: i, tone: "primary" }],
    settled: indices(prefix.length),
    panels: [prefixPanel(prefix, [i])],
  }));
  add(
    "const prefix",
    "Накопление слева направо",
    "Каждая новая ячейка содержит сумму всех чисел до неё включительно."
  );
  for (; i < values.length; i++) {
    const previous = sum;
    sum += values[i];
    add("sum += num", "Накапливаем сумму", `Добавляем ${values[i]}.`, {
      formula: `${previous} + (${values[i]}) = ${sum}`,
      focus: [i],
    });
    prefix.push(sum);
    add("prefix.push(sum)", "Записываем префикс", `P[${i}] = ${sum}.`);
  }
  add("return prefix", "Префиксы готовы", `Результат: ${JSON.stringify(prefix)}.`, {
    result: [...prefix],
  });
  return steps;
};

export const buildRangeSumTrace = ({
  values,
  range = [0, values.length - 1],
}: AlgorithmInput): readonly TraceStep[] => {
  const prefix = new Array<number>(values.length + 1).fill(0);
  let i = 0;
  let query = false;
  const [left, right] = range;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: query ? [] : [{ label: "i", index: i, tone: "primary" }],
    band: { start: query ? left : 0, end: query ? right : i - 1, tone: "primary" },
    panels: [prefixPanel(prefix, query ? [left, right + 1] : [i, i + 1])],
  }));
  add("const prefix", "Нулевой префикс", "P[0] = 0. В P[i + 1] храним сумму первых i + 1 чисел.");
  for (; i < values.length; i++) {
    prefix[i + 1] = prefix[i] + values[i];
    add(
      "prefix[i + 1] = prefix[i] + nums[i]",
      "Строим префикс",
      `P[${i + 1}] = P[${i}] + nums[${i}].`,
      { formula: `${prefix[i]} + (${values[i]}) = ${prefix[i + 1]}`, focus: [i] }
    );
  }
  query = true;
  add(
    "return {",
    "Выбираем диапазон",
    `Нужна сумма nums[${left}…${right}]. Удаляем из P[${right + 1}] префикс P[${left}].`
  );
  const result = prefix[right + 1] - prefix[left];
  add(
    "sumRange:",
    "Вычитаем два префикса",
    "После подготовки любой запрос суммы выполняется за O(1).",
    {
      formula: `P[${right + 1}] − P[${left}] = ${prefix[right + 1]} − (${prefix[left]}) = ${result}`,
      result,
    }
  );
  return steps;
};

export const buildPivotTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const total = values.reduce((sum, value) => sum + value, 0);
  let left = 0;
  let right = total;
  let i = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "diamond",
    pointers: [{ label: "pivot", index: i, tone: "anchor" }],
    panels: [
      {
        kind: "balance",
        label: "Баланс · сам pivot не входит ни в одну сумму",
        entries: [
          { key: "Слева", value: String(left), tone: "primary" },
          { key: "Справа", value: String(right), tone: "secondary" },
        ],
      },
    ],
  }));
  add(
    "const totalSum",
    "Сумма всего массива",
    `totalSum = ${total}. Начинаем с пустой левой части.`
  );
  for (; i < values.length; i++) {
    right = total - left - values[i];
    add(
      "const rightSum",
      "Сравниваем чаши",
      `Слева ${left}, справа ${right}; текущий элемент ${values[i]} исключён.`,
      { formula: `${total} − (${left}) − (${values[i]}) = ${right}`, focus: [i] }
    );
    if (left === right) {
      add(
        "if (leftSum === rightSum) return i",
        "Равновесие найдено",
        `Первый опорный индекс: ${i}.`,
        { result: i, settled: [i] }
      );
      return steps;
    }
    left += values[i];
    add(
      "leftSum += nums[i]",
      "Переносим число в левую сумму",
      `Теперь leftSum = ${left}. Переходим к следующему кандидату.`
    );
  }
  add(
    "return -1",
    "Опорного индекса нет",
    "Ни у одного элемента суммы слева и справа не совпали.",
    { result: -1 }
  );
  return steps;
};

export const buildSubarraySumTrace = ({
  values,
  parameter: k,
}: AlgorithmInput): readonly TraceStep[] => {
  const map = new Map<number, number>([[0, 1]]);
  const prefix = [0];
  let sum = 0;
  let count = 0;
  let i = 0;
  let active = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: [{ label: "num", index: i, tone: "primary" }],
    panels: [
      prefixPanel(prefix, [prefix.length - 1]),
      mapPanel(map, `Map · сумма → частота · найдено ${count}`, active),
    ],
  }));
  add(
    "map.set(0, 1)",
    "Пустой префикс встречается один раз",
    "Это позволяет учитывать подмассивы, начинающиеся с индекса 0."
  );
  for (; i < values.length; i++) {
    sum += values[i];
    prefix.push(sum);
    active = sum - k;
    add(
      "currentSum += num",
      "Следующий префикс",
      `Текущая сумма ${sum}; ищем прежнюю сумму ${active}.`,
      { formula: `${sum} − (${k}) = ${active}`, focus: [i] }
    );
    add(
      "if (map.has(currentSum - k))",
      "Ищем прошлые префиксы",
      `Частота ${active}: ${map.get(active) ?? 0}. Каждый такой префикс даёт отдельный подмассив.`
    );
    if (map.has(active)) {
      count += map.get(active)!;
      add("count += map.get", "Добавляем совпадения", `Всего подмассивов: ${count}.`);
    }
    map.set(sum, (map.get(sum) ?? 0) + 1);
    active = sum;
    add(
      "map.set(currentSum",
      "Сохраняем текущий префикс",
      "Записываем после поиска, чтобы не посчитать пустой подмассив при k = 0."
    );
  }
  add("return count", "Подсчёт завершён", `Количество подмассивов с суммой ${k}: ${count}.`, {
    result: count,
  });
  return steps;
};
