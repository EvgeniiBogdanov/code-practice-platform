import type { AlgorithmInput, TraceStep } from "./algorithmTrace";
import { createTraceRecorder, marker } from "../lib/traceRecorder";
import { tracePanel } from "./structureScene";

export const buildDisappearedTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const nums = [...values];
  const missing: number[] = [];
  let reader = -1;
  let cell = -1;
  let collecting = false;
  const { steps, add } = createTraceRecorder(() => ({
    values: nums,
    shape: "token",
    pointers: [
      ...(reader >= 0 && !collecting ? [marker("num", reader, "primary")] : []),
      ...(cell >= 0
        ? [collecting ? marker("i", cell, "primary") : marker("index", cell, "secondary")]
        : []),
    ],
    settled: nums.flatMap((value, i) => (value < 0 ? [i] : [])),
    panels: [tracePanel("missing · пропущенные числа", missing, -1)],
  }));
  add(
    "for (const num of nums)",
    "Знак ячейки как метка",
    "Число x указывает на ячейку x − 1. Отрицательное значение в ячейке означает «число уже встречалось»."
  );
  for (reader = 0; reader < nums.length; reader++) {
    const num = nums[reader];
    cell = -1;
    add("for (const num of nums)", "Читаем число", `num = ${num}. Читаем ячейку ${reader}.`, {
      focus: [reader],
    });
    cell = Math.abs(num) - 1;
    add(
      "const index = Math.abs(num) - 1",
      "Число → ячейка",
      `Модуль нужен: значение могло быть уже помечено минусом. Число ${Math.abs(num)} живёт в ячейке ${cell}.`,
      { formula: `|${num}| − 1 = ${cell}`, focus: [reader, cell] }
    );
    const fresh = nums[cell] > 0;
    add(
      "if (nums[index] > 0)",
      "Ячейка уже помечена?",
      fresh
        ? `nums[${cell}] = ${nums[cell]} > 0: число ${cell + 1} встречается впервые.`
        : `nums[${cell}] = ${nums[cell]} < 0: число ${cell + 1} уже встречалось (дубликат). Знак не меняем.`,
      { focus: [reader, cell] }
    );
    if (fresh) {
      nums[cell] = -nums[cell];
      add(
        "nums[index] = -nums[index]",
        "Помечаем знаком",
        `Ячейка ${cell} стала отрицательной: число ${cell + 1} присутствует в массиве.`,
        { focus: [cell] }
      );
    }
  }
  reader = -1;
  cell = -1;
  collecting = true;
  add(
    "const missing = []",
    "Фаза 2 · собираем ответ",
    "Ячейки, оставшиеся положительными, не получили метку: их номер + 1 отсутствует в массиве."
  );
  for (cell = 0; cell < nums.length; cell++) {
    add(
      "for (let i = 0; i < nums.length; i++)",
      "Проверяем ячейку",
      `Читаем ячейку ${cell}: ${nums[cell]}.`,
      { focus: [cell] }
    );
    const isMissing = nums[cell] > 0;
    add(
      "if (nums[i] > 0)",
      "Метка есть?",
      isMissing
        ? `nums[${cell}] > 0: метки нет, числа ${cell + 1} в массиве не было.`
        : `nums[${cell}] < 0: число ${cell + 1} встречалось.`,
      { focus: [cell] }
    );
    if (isMissing) {
      missing.push(cell + 1);
      add("missing.push(i + 1)", "Число пропущено", `Добавляем ${cell + 1} в ответ.`, {
        focus: [cell],
      });
    }
  }
  cell = -1;
  add(
    "return missing",
    "Результат",
    missing.length ? `Пропущены числа: ${missing.join(", ")}.` : "Пропущенных чисел нет.",
    { result: [...missing] }
  );
  return steps;
};
