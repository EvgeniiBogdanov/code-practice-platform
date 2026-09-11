import { createTraceRecorder } from "../lib/trace-recorder";
import type { AlgorithmInput, TracePanel, TraceStep } from "./algorithm-trace";

export const mapPanel = (
  map: ReadonlyMap<string | number, number | string | readonly string[]>,
  label: string,
  active?: string | number
): TracePanel => ({
  kind: "buckets",
  label,
  entries: [...map].map(([key, value]) => ({
    key: String(key),
    value: Array.isArray(value) ? JSON.stringify(value) : String(value),
    active: key === active,
  })),
});

export const buildHashTwoSumTrace = ({
  values,
  parameter: target,
}: AlgorithmInput): readonly TraceStep[] => {
  const map = new Map<number, number>();
  let i = 0;
  let active = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: [{ label: "i", index: i, tone: "primary" }],
    panels: [mapPanel(map, "Map · число → индекс", active)],
  }));
  add("const map", "Пустая таблица", "В Map сохраняем только уже просмотренные числа.");
  for (; i < values.length; i++) {
    active = target - values[i];
    add(
      "const complement",
      "Ищем дополнение",
      `Для ${values[i]} проверяем ключ ${active}. Текущий элемент ещё не записан.`,
      { formula: `${target} − ${values[i]} = ${active}`, focus: [i] }
    );
    const previous = map.get(active);
    if (previous !== undefined) {
      add(
        "return [map.get",
        "Пара найдена",
        `Ключ ${active} хранит индекс ${previous}; второй индекс — ${i}.`,
        { result: [previous, i], settled: [previous, i] }
      );
      return steps;
    }
    map.set(values[i], i);
    active = values[i];
    add(
      "map.set(nums[i], i)",
      "Записываем число",
      `Map[${values[i]}] = ${i}. Следующие элементы смогут найти эту пару.`
    );
  }
  add("return []", "Пары нет", "Все числа просмотрены; подходящего дополнения не встретилось.", {
    result: [],
  });
  return steps;
};

export const buildDuplicateTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const seen = new Map<number, string>();
  let i = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: [{ label: "num", index: i, tone: "primary" }],
    panels: [mapPanel(seen, "Set · просмотренные значения", values[i])],
  }));
  add("const set", "Пустое множество", "Каждое число проверяем перед добавлением в Set.");
  for (; i < values.length; i++) {
    add("if (set.has(num))", "Проверяем наличие", `Есть ли ${values[i]} в множестве?`, {
      focus: [i],
    });
    if (seen.has(values[i])) {
      add("return true", "Дубликат найден", `${values[i]} уже встречалось. Завершаем поиск.`, {
        result: true,
        settled: [values.indexOf(values[i]), i],
      });
      return steps;
    }
    seen.set(values[i], "есть");
    add("set.add(num)", "Добавляем в Set", `${values[i]} встречается впервые.`);
  }
  add("return false", "Дубликатов нет", "Каждое число встретилось один раз.", { result: false });
  return steps;
};

export const buildAnagramTrace = ({
  text,
  secondText = "",
}: AlgorithmInput): readonly TraceStep[] => {
  const counts = new Map<string, number>();
  let i = 0;
  let active = "";
  const values = text.split("");
  let consuming = false;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: [{ label: "char", index: i, tone: "primary" }],
    panels: [
      mapPanel(counts, consuming ? "Map · вычитаем символы t" : "Map · считаем символы s", active),
      {
        kind: "window",
        label: "t · проверяемая строка",
        entries: secondText.split("").map((char, index) => ({
          key: String(index),
          value: char,
          active: i === index && consuming,
        })),
      },
    ],
  }));
  add(
    "if (s.length !== t.length)",
    "Сравниваем длины",
    `s: ${text.length}, t: ${secondText.length}. Регистр и пробелы учитываются.`
  );
  if (text.length !== secondText.length) {
    add(
      "return false",
      "Разные длины",
      "Анаграммы должны содержать одинаковое количество символов.",
      { result: false }
    );
    return steps;
  }
  add("const map", "Счётчик частот", "Сначала подсчитаем символы s, затем вычтем символы t.");
  for (i = 0; i < text.length; i++) {
    active = text[i];
    counts.set(active, (counts.get(active) ?? 0) + 1);
    add(
      "map.set(char, (map.get(char)",
      "Увеличиваем частоту",
      `Символ ${JSON.stringify(active)}: ${counts.get(active)}.`,
      { focus: [i] }
    );
  }
  consuming = true;
  values.splice(0, values.length, ...secondText);
  for (i = 0; i < secondText.length; i++) {
    active = secondText[i];
    add(
      "if (!map.has(char)",
      "Проверяем остаток",
      `Для ${JSON.stringify(active)} доступно ${counts.get(active) ?? 0}.`,
      { focus: [i] }
    );
    if (!counts.get(active)) {
      add("return false", "Лишний символ", "В s не осталось такого символа.", {
        occurrence: 1,
        result: false,
      });
      return steps;
    }
    counts.set(active, counts.get(active)! - 1);
    add(
      "map.set(char, map.get(char) - 1)",
      "Уменьшаем частоту",
      `Используем одно вхождение ${JSON.stringify(active)}.`
    );
  }
  add("return true", "Это анаграммы", "Все частоты обнулились.", { result: true });
  return steps;
};

export const buildGroupAnagramsTrace = ({ words = [] }: AlgorithmInput): readonly TraceStep[] => {
  const groups = new Map<string, string[]>();
  let i = 0;
  let key = "";
  const { steps, add } = createTraceRecorder(() => ({
    values: words,
    shape: "token",
    pointers: [{ label: "str", index: i, tone: "primary" }],
    panels: [mapPanel(groups, "Map · отсортированный ключ → группа", key)],
  }));
  add(
    "const map",
    "Группы анаграмм",
    "Слова с одинаковым отсортированным ключом попадают в одну группу."
  );
  for (; i < words.length; i++) {
    key = words[i].split("").sort().join("");
    add("const key", "Строим ключ", `${JSON.stringify(words[i])} → ${JSON.stringify(key)}.`, {
      focus: [i],
      formula: `${words[i] || '""'} → ${key || '""'}`,
    });
    if (!groups.has(key)) {
      groups.set(key, []);
      add("map.set(key, [])", "Новая группа", `Создаём ячейку для ключа ${JSON.stringify(key)}.`);
    }
    groups.get(key)!.push(words[i]);
    add(
      "map.get(key).push(str)",
      "Добавляем слово",
      `${JSON.stringify(words[i])} помещается в группу ${JSON.stringify(key)}.`
    );
  }
  add(
    "return [...map.values()]",
    "Группы готовы",
    "Возвращаем группы в порядке первого появления их ключей.",
    { result: [...groups.values()].map((group) => [...group]) }
  );
  return steps;
};
