import { createTraceRecorder, pointerPair } from "../lib/trace-recorder";
import type { AlgorithmInput, TracePanel, TraceStep, TraceValue } from "./algorithm-trace";

const windowPanel = (
  values: readonly TraceValue[],
  left: number,
  right: number,
  metric: string
): TracePanel => ({
  kind: "window",
  label: metric,
  entries: values.map((value, i) => ({
    key: String(i),
    value: String(value),
    active: i >= left && i <= right,
  })),
});

export const buildMaxAverageTrace = ({
  values,
  parameter: k,
}: AlgorithmInput): readonly TraceStep[] => {
  let left = 0;
  let right = -1;
  let sum = 0;
  let max = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: pointerPair(left, right),
    band: { start: left, end: right, tone: "primary" },
    panels: [windowPanel(values, left, right, `Фиксированное окно · k = ${k} · сумма = ${sum}`)],
  }));
  add("let windowSum", "Окно фиксированной длины", `Собираем первые ${k} элементов.`);
  for (right = 0; right < k; right++) {
    sum += values[right];
    add("windowSum += nums[i]", "Заполняем окно", `Добавляем ${values[right]}; сумма ${sum}.`, {
      pointers: [{ label: "i", index: right, tone: "primary" }],
    });
  }
  right = k - 1;
  max = sum;
  add("let maxSum", "Первое полное окно", `Начальный максимум суммы: ${max}.`);
  for (right = k; right < values.length; right++) {
    left = right - k + 1;
    const previous = sum;
    sum += values[right] - values[right - k];
    add(
      "windowSum += nums[right]",
      "Сдвигаем окно",
      `Уходит ${values[right - k]}, входит ${values[right]}. Размер остаётся ${k}.`,
      {
        formula: `${previous} − (${values[right - k]}) + (${values[right]}) = ${sum}`,
        focus: [right - k, right],
      }
    );
    max = Math.max(max, sum);
    add("maxSum = Math.max", "Обновляем максимум", `Лучшая сумма ${max}; среднее ${max / k}.`);
  }
  right = values.length - 1;
  add("return maxSum / k", "Максимальное среднее", `${max} / ${k} = ${max / k}.`, {
    result: max / k,
    formula: `${max} / ${k} = ${max / k}`,
  });
  return steps;
};

export const buildMinWindowTrace = ({
  values,
  parameter: target,
}: AlgorithmInput): readonly TraceStep[] => {
  let left = 0;
  let right = -1;
  let sum = 0;
  let min = Infinity;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: pointerPair(left, right),
    band: { start: left, end: right, tone: "secondary" },
    panels: [
      windowPanel(
        values,
        left,
        right,
        `Сжимаемое окно · сумма ${sum} / target ${target} · минимум ${min === Infinity ? "∞" : min}`
      ),
    ],
  }));
  add(
    "let left",
    "Расширяем и сжимаем",
    "Положительные числа позволяют уменьшать сумму сдвигом левой границы."
  );
  for (right = 0; right < values.length; right++) {
    sum += values[right];
    add("sum += nums[right]", "Расширяем вправо", `Добавили ${values[right]}. Сумма ${sum}.`, {
      focus: [right],
    });
    while (sum >= target) {
      min = Math.min(min, right - left + 1);
      add(
        "minLength = Math.min",
        "Подходящее окно",
        `Сумма ${sum} ≥ ${target}; лучшая длина ${min}.`
      );
      sum -= values[left];
      add(
        "sum -= nums[left]",
        "Убираем левый элемент",
        `Вычитаем ${values[left]}; сумма становится ${sum}.`,
        { focus: [left] }
      );
      left++;
      add("left++", "Сжимаем слева", "Проверим, достаточно ли оставшейся суммы.");
    }
  }
  right = values.length - 1;
  add(
    "return minLength",
    "Минимальная длина",
    min === Infinity
      ? "Подходящего окна нет: возвращаем 0."
      : `Кратчайшее окно имеет длину ${min}.`,
    { result: min === Infinity ? 0 : min }
  );
  return steps;
};

export const buildLongestSubstringTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const values = text.split("");
  const set = new Set<string>();
  let left = 0;
  let right = -1;
  let max = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: pointerPair(left, right),
    band: { start: left, end: right, tone: "primary" },
    panels: [
      windowPanel(values, left, right, `Уникальное окно · лучший размер ${max}`),
      {
        kind: "buckets",
        label: "Set · символы окна",
        entries: [...set].map((char) => ({
          key: char,
          value: "есть",
          active: char === text[right],
        })),
      },
    ],
  }));
  add("const set", "Окно без повторов", "Set хранит символы текущего окна.");
  for (right = 0; right < text.length; right++) {
    add(
      "while (set.has(s[right]))",
      "Проверяем входящий символ",
      `Можно ли добавить ${JSON.stringify(text[right])} без повтора?`,
      { focus: [right] }
    );
    while (set.has(text[right])) {
      const removed = text[left];
      set.delete(removed);
      add(
        "set.delete(s[left])",
        "Убираем символ из Set",
        `Удаляем ${JSON.stringify(removed)} с левого края.`,
        { focus: [left] }
      );
      left++;
      add(
        "left++",
        "Сдвигаем левую границу",
        "Повторяем, пока входящий символ присутствует в Set."
      );
    }
    set.add(text[right]);
    add(
      "set.add(s[right])",
      "Расширяем уникальное окно",
      `Добавляем ${JSON.stringify(text[right])}.`
    );
    max = Math.max(max, right - left + 1);
    add(
      "maxLength = Math.max",
      "Обновляем лучшую длину",
      `Размер окна ${right - left + 1}; максимум ${max}.`
    );
  }
  right = text.length - 1;
  add("return maxLength", "Самая длинная подстрока", `Длина без повторяющихся символов: ${max}.`, {
    result: max,
  });
  return steps;
};
