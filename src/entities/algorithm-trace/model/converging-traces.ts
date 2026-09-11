import { createTraceRecorder, indices, pointerPair } from "../lib/trace-recorder";
import type { AlgorithmInput, TraceStep } from "./algorithm-trace";

export const buildTwoSumTrace = ({ values, parameter: target }: AlgorithmInput): TraceStep[] => {
  let left = 0;
  let right = values.length - 1;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: pointerPair(left, right),
    dimmed: [...indices(left), ...indices(values.length - right - 1, right + 1)],
  }));
  add(
    "let left = 0",
    "Начинаем с двух краёв",
    "Массив отсортирован. Слева — наименьшее число, справа — наибольшее.",
    { formula: `target = ${target}` }
  );
  while (left < right) {
    const sum = values[left] + values[right];
    add(
      "const sum =",
      "Сравниваем сумму с целью",
      "Одно сравнение подскажет, какую границу можно исключить.",
      {
        focus: [left, right],
        formula: `${values[left]} + ${values[right]} = ${sum} ${sum === target ? "=" : sum < target ? "<" : ">"} ${target}`,
      }
    );
    if (sum === target) {
      add(
        "return [left + 1, right + 1]",
        "Пара найдена",
        `Индексы в ответе начинаются с 1: ${left} + 1 и ${right} + 1.`,
        {
          result: [left + 1, right + 1],
          settled: [left, right],
          formula: `return [${left + 1}, ${right + 1}]`,
        }
      );
      return steps;
    }
    if (sum < target) {
      left++;
      add(
        "left++",
        "Нужна сумма больше → left",
        "Даже с наибольшим правым числом сумма мала. Старый left не подходит ни для одной оставшейся пары."
      );
    } else {
      right--;
      add(
        "right--",
        "Нужна сумма меньше ← right",
        "Даже с наименьшим левым числом сумма велика. Старый right можно исключить."
      );
    }
  }
  add(
    "return []",
    "Подходящей пары нет",
    "Указатели встретились: использовать один элемент дважды нельзя. По условию исходной задачи пара гарантирована; здесь показан защитный возврат.",
    { result: [], formula: "return []" }
  );
  return steps;
};

export const buildPalindromeTrace = ({ text }: AlgorithmInput): TraceStep[] => {
  const values = text.split("");
  const settled: number[] = [];
  const dimmed: number[] = [];
  let left = 0;
  let right = values.length - 1;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: pointerPair(left, right),
    settled,
    dimmed,
  }));
  const isAlphanumeric = (char: string): boolean => /[a-z0-9]/i.test(char);
  add(
    "let left = 0",
    "Читаем строку с двух сторон",
    "Сравниваем буквы и цифры без учёта регистра. Пробелы и знаки пропускаем без создания новой строки."
  );
  while (left < right) {
    while (left < right && !isAlphanumeric(values[left])) {
      dimmed.push(left++);
      add(
        "left++",
        "Пропускаем знак слева",
        "Этот символ не является латинской буквой или цифрой."
      );
    }
    while (left < right && !isAlphanumeric(values[right])) {
      dimmed.push(right--);
      add("right--", "Пропускаем знак справа", "Знаки не влияют на проверку палиндрома.");
    }
    const same = values[left].toLowerCase() === values[right].toLowerCase();
    add(
      "if (s[left].toLowerCase()",
      same ? "Символы совпадают" : "Нашли несовпадение",
      "Сравнение выполняется в нижнем регистре, исходная строка сохраняется.",
      {
        focus: [left, right],
        formula: `${JSON.stringify(values[left].toLowerCase())} ${same ? "=" : "≠"} ${JSON.stringify(values[right].toLowerCase())}`,
      }
    );
    if (!same) {
      add(
        "return false",
        "Это не палиндром",
        "Одной несовпадающей пары достаточно, чтобы закончить проверку.",
        { result: false, focus: [left, right], formula: "return false" }
      );
      return steps;
    }
    if (isAlphanumeric(values[left])) settled.push(left, right);
    left++;
    right--;
    add(
      "left++",
      "Сужаем непроверенную часть",
      "Пара проверена. Оба указателя переходят к центру.",
      { occurrence: 1 }
    );
  }
  add(
    "return true",
    "Это палиндром",
    "Все значимые пары совпали. Пустая строка и строка без букв и цифр тоже проходят проверку.",
    { result: true, formula: "return true" }
  );
  return steps;
};

export const buildParityTrace = ({ values }: AlgorithmInput): TraceStep[] => {
  const nums = [...values];
  let left = 0;
  let right = nums.length - 1;
  const { steps, add } = createTraceRecorder(() => ({
    values: nums,
    pointers: pointerPair(left, right),
    settled: [...indices(left), ...indices(nums.length - right - 1, right + 1)],
  }));
  add(
    "let left = 0",
    "Чётные влево, нечётные вправо",
    "Ищем нечётное слева и чётное справа, чтобы обменом поставить оба числа в нужные части."
  );
  while (left < right) {
    while (left < right && nums[left] % 2 === 0) {
      add(
        "while (left < right && nums[left]",
        "Слева уже чётное",
        `${nums[left]} делится на 2 без остатка. Оставляем число слева.`,
        { focus: [left] }
      );
      left++;
      add(
        "left++",
        "Ищем дальше справа →",
        "Левая часть до left уже содержит только чётные числа."
      );
    }
    while (left < right && nums[right] % 2 !== 0) {
      add(
        "while (left < right && nums[right]",
        "Справа уже нечётное",
        `${nums[right]} % 2 ≠ 0. Проверка работает и для отрицательных чисел.`,
        { focus: [right] }
      );
      right--;
      add(
        "right--",
        "Ищем дальше слева ←",
        "Правая часть после right уже содержит только нечётные числа."
      );
    }
    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      add(
        "[nums[left], nums[right]] =",
        "Один обмен исправляет две позиции",
        `${nums[left]} перемещено в чётную часть, ${nums[right]} — в нечётную. Порядок внутри частей не гарантирован.`,
        { focus: [left, right], transfer: { from: left, to: right, kind: "swap" } }
      );
      left++;
      right--;
      add("left++", "Продвигаем обе границы", "Обменённые позиции больше проверять не нужно.", {
        occurrence: 1,
      });
    }
  }
  add(
    "return nums",
    "Массив разделён по чётности",
    "Каждый элемент в нужной части. Сортировка чисел внутри частей не требуется.",
    { result: [...nums], settled: indices(nums.length), formula: `[${nums.join(", ")}]` }
  );
  return steps;
};
