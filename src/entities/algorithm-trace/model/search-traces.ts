import { createTraceRecorder, indices, pointerPair } from "../lib/trace-recorder";
import type { AlgorithmInput, TraceStep } from "./algorithm-trace";

type SearchMode = "exact" | "insert" | "rotated";
const buildSearchTrace = (
  { values, parameter: target }: AlgorithmInput,
  mode: SearchMode
): readonly TraceStep[] => {
  let left = 0;
  let right = values.length - 1;
  let mid = -1;
  let decision = "Ещё не проверено";
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "diamond",
    pointers: [
      ...pointerPair(left, right),
      ...(mid >= 0 ? [{ label: "mid", index: mid, tone: "anchor" as const }] : []),
    ],
    band: { start: left, end: right, tone: "anchor" },
    dimmed: indices(values.length).filter((i) => i < left || i > right),
    panels: [
      {
        kind: "search",
        label:
          mode === "rotated"
            ? "Поворот массива · выбираем отсортированную половину"
            : mode === "insert"
              ? "Поиск значения или позиции вставки"
              : "Делим область поиска пополам",
        entries: [
          { key: "target", value: String(target) },
          { key: "Диапазон", value: `[${left}, ${right}]` },
          { key: "Решение", value: decision, active: true },
        ],
      },
    ],
  }));
  add("let left", "Начальный диапазон", "Ответ ищем внутри включительных границ left и right.");
  while (left <= right) {
    mid = Math.floor(left + (right - left) / 2);
    decision = `nums[${mid}] = ${values[mid]}`;
    add("const mid", "Проверяем середину", `mid = ${mid}; сравниваем ${values[mid]} с ${target}.`, {
      focus: [mid],
      formula: `${left} + ⌊(${right} − ${left}) / 2⌋ = ${mid}`,
    });
    if (values[mid] === target) {
      add("if (nums[mid] === target) return mid", "Значение найдено", `Индекс ${mid}.`, {
        result: mid,
        settled: [mid],
      });
      return steps;
    }
    let moveLeft = values[mid] < target;
    let line = moveLeft ? "left = mid + 1" : "right = mid - 1";
    if (mode === "rotated") {
      const leftSorted = values[left] <= values[mid];
      decision = leftSorted ? "Левая половина отсортирована" : "Правая половина отсортирована";
      add("const leftHalfSorted", "Находим упорядоченную половину", decision);
      moveLeft = leftSorted
        ? !(values[left] <= target && target < values[mid])
        : values[mid] < target && target <= values[right];
      line = leftSorted ? "targetInLeftHalf ?" : "targetInRightHalf ?";
      add(
        leftSorted ? "const targetInLeftHalf" : "const targetInRightHalf",
        "Проверяем границы половины",
        `Следующий диапазон: ${moveLeft ? "справа" : "слева"} от mid.`
      );
    }
    decision = moveLeft ? `Исключаем индексы ${left}…${mid}` : `Исключаем индексы ${mid}…${right}`;
    if (moveLeft) left = mid + 1;
    else right = mid - 1;
    add(line, "Сужаем диапазон", decision);
  }
  mid = -1;
  add(
    mode === "insert" ? "return left" : "return -1",
    mode === "insert" ? "Позиция вставки" : "Значение отсутствует",
    mode === "insert"
      ? `Вставка на индекс ${left} сохранит порядок, в том числе на краю массива.`
      : "Диапазон пуст: left > right.",
    { result: mode === "insert" ? left : -1 }
  );
  return steps;
};

export const buildBinarySearchTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  buildSearchTrace(input, "exact");
export const buildSearchInsertTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  buildSearchTrace(input, "insert");
export const buildRotatedSearchTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  buildSearchTrace(input, "rotated");

export const buildFirstBadTrace = ({
  values,
  parameter: firstBad,
}: AlgorithmInput): readonly TraceStep[] => {
  let left = 1;
  let right = values.length;
  let mid = 0;
  const tested = new Map<number, boolean>();
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: [
      ...pointerPair(left - 1, right - 1, ["left", "right"]),
      ...(mid ? [{ label: "mid", index: mid - 1, tone: "anchor" as const }] : []),
    ],
    band: { start: left - 1, end: right - 1, tone: "secondary" },
    dimmed: indices(values.length).filter((i) => i < left - 1 || i > right - 1),
    panels: [
      {
        kind: "search",
        label: "Версии с 1 · ✓ исправна · ✕ плохая · ? не проверена",
        entries: values.map((version) => ({
          key: `v${version}`,
          value: tested.has(version) ? (tested.get(version) ? "✕" : "✓") : "?",
          active: version === mid,
          tone: tested.get(version) ? "secondary" : "primary",
        })),
      },
    ],
  }));
  add(
    "let left",
    "Ищем границу версий",
    `Всего версий: ${values.length}. Плохие версии образуют непрерывный суффикс. firstBad задаёт поведение тестового API.`
  );
  while (left < right) {
    mid = Math.floor(left + (right - left) / 2);
    add("const mid", "Выбираем версию", `Проверим версию ${mid}; её индекс на сцене ${mid - 1}.`, {
      focus: [mid - 1],
    });
    const bad = mid >= firstBad;
    tested.set(mid, bad);
    add("const isBad = isBadVersion(mid)", "Ответ API", `isBadVersion(${mid}) = ${bad}.`);
    if (bad) {
      right = mid;
      add(
        "right = mid",
        "Сохраняем плохую середину",
        "mid может быть первой плохой версией, поэтому остаётся в диапазоне."
      );
    } else {
      left = mid + 1;
      add(
        "left = mid + 1",
        "Исключаем исправные версии",
        "Первая плохая версия находится строго правее mid."
      );
    }
  }
  mid = 0;
  add("return left", "Граница найдена", `Первая плохая версия: ${left}.`, {
    result: left,
    settled: [left - 1],
  });
  return steps;
};
