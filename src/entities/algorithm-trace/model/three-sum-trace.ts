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
    add(
      "for (let i = 0; i < sorted.length - 2; i++)",
      "Следующий якорь",
      `Проверяем ${sorted[i]} на индексе ${i}.`,
      { focus: [i] }
    );
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      add(
        "if (i > 0",
        "Пропускаем повторный якорь",
        `${sorted[i]} уже было первым числом. Повторный поиск дал бы дубликаты троек.`,
        { focus: [i] }
      );
      add("continue", "Переходим к следующему якорю", "Для этого значения тройки уже найдены.");
      continue;
    }
    add(
      "let left = i + 1",
      `Фиксируем ${sorted[i]}`,
      `Ищем справа пару с суммой ${-sorted[i]}. Индексы i, left и right всегда различны.`,
      { formula: `${sorted[i]} + ? + ? = 0` }
    );
    while (left < right) {
      add("while (left < right)", "Проверяем пару", `left = ${left}, right = ${right}.`, {
        focus: [i, left, right],
      });
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
      add(
        "if (sum === 0)",
        "Проверяем нулевую сумму",
        sum === 0 ? "Тройка подходит." : `Сумма ${sum} не равна нулю.`
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
          add(
            "while (left < right && sorted[left] === sorted[left + 1])",
            "Проверяем повтор слева",
            `Следующее значение ${sorted[left + 1]} повторяет ${sorted[left]}.`
          );
          left++;
          add(
            "left++",
            "Пропускаем дубликат слева",
            "Это значение уже участвовало в найденной тройке."
          );
        }
        while (left < right && sorted[right] === sorted[right - 1]) {
          add(
            "while (left < right && sorted[right] === sorted[right - 1])",
            "Проверяем повтор справа",
            `Предыдущее значение ${sorted[right - 1]} повторяет ${sorted[right]}.`
          );
          right--;
          add(
            "right--",
            "Пропускаем дубликат справа",
            "Ещё одна копия числа не создаёт новую уникальную тройку."
          );
        }
        left++;
        add("left++", "Сдвигаем левую границу", "Левое число найденной пары обработано.", {
          occurrence: 1,
        });
        right--;
        add("right--", "Сдвигаем правую границу", "Правое число найденной пары обработано.", {
          occurrence: 1,
        });
        add("continue", "Ищем следующую пару", "Продолжаем поиск для того же якоря.", {
          occurrence: 1,
        });
      } else if (sum < 0) {
        add("if (sum < 0)", "Проверяем малую сумму", `Сумма ${sum} < 0; двигаем левую границу.`);
        left++;
        add(
          "left++",
          "Сумма мала → увеличиваем left",
          "Для текущего якоря нужна большая сумма пары.",
          { occurrence: 2 }
        );
        add("continue", "Продолжаем поиск", "Следующая пара даст большую сумму.", {
          occurrence: 2,
        });
      } else {
        add("if (sum > 0)", "Проверяем большую сумму", `Сумма ${sum} > 0; двигаем правую границу.`);
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
