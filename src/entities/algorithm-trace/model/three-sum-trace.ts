import { createTraceRecorder, indices, pointerPair } from "../lib/trace-recorder";
import type { AlgorithmInput, TraceStep } from "./algorithm-trace";

export const buildThreeSumTrace = ({ values }: AlgorithmInput): TraceStep[] => {
  let sorted = [...values];
  const result: number[][] = [];
  let i = -1;
  let left = 0;
  let right = sorted.length - 1;
  const { steps, add } = createTraceRecorder(() => ({
    values: sorted,
    found: result,
    dimmed: indices(Math.max(0, i)),
    pointers: i < 0 ? [] : [{ label: "i", index: i, tone: "anchor" }, ...pointerPair(left, right)],
  }));
  add(
    "const result = []",
    "Ищем уникальные тройки",
    "Зафиксируем одно число, затем найдём пару для него двумя указателями."
  );
  sorted = [...values].sort((a, b) => a - b);
  add(
    "const sorted =",
    "Сначала сортируем копию",
    "Числа теперь идут по возрастанию. Исходный массив не меняется; копия занимает O(n) памяти.",
    { focus: indices(sorted.length) }
  );
  for (i = 0; i < sorted.length - 2; i++) {
    left = i + 1;
    right = sorted.length - 1;
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      add(
        "if (i > 0",
        "Пропускаем повторный якорь",
        `${sorted[i]} уже было первым числом. Повторный поиск дал бы дубликаты троек.`,
        { focus: [i] }
      );
      continue;
    }
    add(
      "let left = i + 1",
      `Фиксируем ${sorted[i]}`,
      `Ищем справа пару с суммой ${-sorted[i]}. Индексы i, left и right всегда различны.`,
      { formula: `${sorted[i]} + ? + ? = 0` }
    );
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      add(
        "const sum =",
        "Проверяем тройку",
        "Якорь i остаётся на месте, двигаются только границы пары.",
        {
          focus: [i, left, right],
          formula: `${sorted[i]} + (${sorted[left]}) + (${sorted[right]}) = ${sum}`,
        }
      );
      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        add(
          "result.push",
          "Сохраняем новую тройку",
          "Теперь пропустим одинаковые соседние числа, чтобы не добавить эту тройку повторно.",
          { settled: [i, left, right] }
        );
        while (left < right && sorted[left] === sorted[left + 1]) {
          left++;
          add(
            "left++",
            "Пропускаем дубликат слева",
            "Это значение уже участвовало в найденной тройке."
          );
        }
        while (left < right && sorted[right] === sorted[right - 1]) {
          right--;
          add(
            "right--",
            "Пропускаем дубликат справа",
            "Ещё одна копия числа не создаёт новую уникальную тройку."
          );
        }
        left++;
        right--;
        add(
          "left++",
          "Ищем следующую пару",
          "Оба числа найденной пары обработаны. Сужаем диапазон.",
          { occurrence: 1 }
        );
      } else if (sum < 0) {
        left++;
        add(
          "left++",
          "Сумма мала → увеличиваем left",
          "Для текущего якоря нужна большая сумма пары.",
          { occurrence: 2 }
        );
      } else {
        right--;
        add(
          "right--",
          "Сумма велика ← уменьшаем right",
          "Для текущего якоря нужна меньшая сумма пары.",
          { occurrence: 2 }
        );
      }
    }
  }
  add(
    "return result",
    result.length ? "Все уникальные тройки найдены" : "Подходящих троек нет",
    "Проверены все возможные якоря. Возвращаем только различные тройки значений.",
    { result: result.map((tuple) => [...tuple]), pointers: [], formula: JSON.stringify(result) }
  );
  return steps;
};
