import { createTraceRecorder, indices, pointerPair } from "../lib/trace-recorder";
import type { AlgorithmInput, TraceStep } from "./algorithm-trace";

export const buildRemoveElementTrace = ({
  values,
  parameter: val,
}: AlgorithmInput): TraceStep[] => {
  const nums = [...values];
  let write = 0;
  let read = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values: nums,
    pointers: pointerPair(write, read, ["write", "read"]),
    settled: indices(write),
  }));
  add(
    "let write = 0",
    "Собираем нужные числа слева",
    `read проверяет элементы, write хранит место следующей записи. Удаляем ${val}.`
  );
  for (; read < nums.length; read++) {
    const keep = nums[read] !== val;
    add(
      "if (nums[read] !== val)",
      keep ? "Это число оставляем" : "Пропускаем совпадение",
      keep
        ? `${nums[read]} ≠ ${val}: число войдёт в результат.`
        : `${nums[read]} = ${val}: двигается только read.`,
      { focus: [read], formula: `${nums[read]} ${keep ? "≠" : "="} ${val}` }
    );
    if (!keep) continue;
    nums[write] = nums[read];
    add(
      "nums[write] = nums[read]",
      "Записываем в начало массива",
      `Копируем значение с индекса ${read} на индекс ${write}. Исходный массив меняется на месте.`,
      { focus: [write], transfer: { from: read, to: write, kind: "copy" } }
    );
    write++;
    add(
      "write++",
      "Расширяем готовый префикс",
      `Первые ${write} элементов уже не содержат ${val}.`
    );
  }
  add(
    "return write",
    `Готово: k = ${write}`,
    "Ответ — длина готового префикса. Значения справа от k не входят в результат и могут быть любыми.",
    {
      result: write,
      dimmed: indices(nums.length - write, write),
      formula: `nums[0…k) = [${nums.slice(0, write).join(", ")}]`,
    }
  );
  return steps;
};

export const buildRemoveDuplicatesTrace = ({ values }: AlgorithmInput): TraceStep[] => {
  const nums = [...values];
  let slow = 0;
  let fast = 1;
  const { steps, add } = createTraceRecorder(() => ({
    values: nums,
    pointers: pointerPair(slow, fast, ["slow", "fast"]),
    settled: indices(nums.length ? slow + 1 : 0),
  }));
  add(
    "if (nums.length === 0)",
    "Проверяем пустой массив",
    "В отсортированном массиве одинаковые числа стоят рядом. slow отмечает последнее уникальное число."
  );
  if (!nums.length) {
    add("return 0", "Готово: k = 0", "В пустом массиве нет уникальных элементов.", { result: 0 });
    return steps;
  }
  for (; fast < nums.length; fast++) {
    const unique = nums[fast] !== nums[slow];
    add(
      "if (nums[fast] !== nums[slow])",
      unique ? "Нашли новое число" : "Пропускаем дубликат",
      unique
        ? `${nums[fast]} отличается от последнего уникального ${nums[slow]}.`
        : `${nums[fast]} уже есть в готовом префиксе; slow остаётся на месте.`,
      { focus: [slow, fast], formula: `${nums[fast]} ${unique ? "≠" : "="} ${nums[slow]}` }
    );
    if (!unique) continue;
    slow++;
    add("slow++", "Выбираем место записи", `Следующее уникальное число займёт индекс ${slow}.`, {
      settled: indices(slow),
    });
    nums[slow] = nums[fast];
    add(
      "nums[slow] = nums[fast]",
      "Сохраняем уникальное число",
      `Копируем ${nums[fast]} на индекс ${slow}.`,
      { focus: [slow], transfer: { from: fast, to: slow, kind: "copy" } }
    );
  }
  add(
    "return slow + 1",
    `Готово: k = ${slow + 1}`,
    "slow — индекс, поэтому длина равна slow + 1. Хвост массива не входит в ответ.",
    {
      result: slow + 1,
      dimmed: indices(nums.length - slow - 1, slow + 1),
      formula: `nums[0…k) = [${nums.slice(0, slow + 1).join(", ")}]`,
    }
  );
  return steps;
};

export const buildMoveZeroesTrace = ({ values }: AlgorithmInput): TraceStep[] => {
  const nums = [...values];
  let slow = 0;
  let fast = 0;
  const { steps, add } = createTraceRecorder(() => ({
    values: nums,
    pointers: pointerPair(slow, fast, ["slow", "fast"]),
    settled: indices(slow),
  }));
  add(
    "let slow = 0",
    "Сохраняем порядок ненулевых",
    "fast просматривает массив. slow показывает, куда поставить следующее ненулевое число."
  );
  for (; fast < nums.length; fast++) {
    add(
      "if (nums[fast] !== 0)",
      nums[fast] === 0 ? "Ноль оставляем позади" : "Нашли ненулевое число",
      nums[fast] === 0
        ? "slow не двигается: это место для следующего ненулевого числа."
        : `${nums[fast]} должно занять индекс ${slow}.`,
      { focus: [fast] }
    );
    if (nums[fast] === 0) continue;
    if (slow !== fast) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      add(
        "[nums[slow], nums[fast]] =",
        "Меняем число и ноль местами",
        "Ненулевое число уходит в готовый префикс, а ноль — на его прежнее место. Порядок ненулевых сохраняется.",
        { focus: [slow, fast], transfer: { from: fast, to: slow, kind: "swap" } }
      );
    } else {
      add(
        "if (slow !== fast)",
        "Число уже на своём месте",
        "Указатели совпадают: обмен с самим собой не нужен.",
        { focus: [slow] }
      );
    }
    slow++;
    add(
      "slow++",
      "Продвигаем границу",
      `Первые ${slow} элементов — ненулевые, в исходном порядке.`
    );
  }
  add(
    "return nums",
    "Все нули перемещены вправо",
    "Массив изменён на месте. Каждое число проверено один раз.",
    { result: [...nums], settled: indices(nums.length), formula: `[${nums.join(", ")}]` }
  );
  return steps;
};
