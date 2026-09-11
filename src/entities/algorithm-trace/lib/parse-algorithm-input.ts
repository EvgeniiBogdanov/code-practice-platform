import type { AlgorithmDefinition, ParsedAlgorithmInput } from "../model/algorithm-trace";

const invalid = (error: string): ParsedAlgorithmInput => ({ ok: false, error });
const isVisualInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && Math.abs(value) <= 999;
const isVisualText = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 32 && !/[^\x20-\x7e]/.test(value);

export const parseAlgorithmInput = (
  definition: Pick<AlgorithmDefinition, "inputKind" | "parameter">,
  raw: string,
  parameter: string
): ParsedAlgorithmInput => {
  if (definition.inputKind === "text") {
    if (!isVisualText(raw) || (definition.parameter === "t" && !isVisualText(parameter))) {
      return invalid("Введите до 32 символов: латиница, цифры, пробелы и знаки ASCII.");
    }
    return {
      ok: true,
      input: {
        values: [],
        text: raw,
        ...(definition.parameter === "t" ? { secondText: parameter } : {}),
        parameter: 0,
      },
    };
  }
  if (definition.inputKind === "versions") {
    const n = Number(raw);
    const firstBad = Number(parameter);
    if (
      !raw.trim() ||
      !Number.isInteger(n) ||
      n < 1 ||
      n > 16 ||
      !Number.isInteger(firstBad) ||
      firstBad < 1 ||
      firstBad > n
    ) {
      return invalid("n: от 1 до 16 версий; firstBad: целое число от 1 до n.");
    }
    return {
      ok: true,
      input: { values: Array.from({ length: n }, (_, i) => i + 1), text: "", parameter: firstBad },
    };
  }
  let value: unknown;
  try {
    value = JSON.parse(raw.trim().startsWith("[") ? raw : `[${raw}]`);
  } catch {
    return invalid(
      definition.inputKind === "words"
        ? 'Введите JSON-массив строк, например: ["eat", "tea", "tan"].'
        : "Введите числа через запятую, например: 0, 1, 0, 3. Пустой массив: []."
    );
  }
  if (definition.inputKind === "words") {
    if (
      !Array.isArray(value) ||
      value.length > 16 ||
      !value.every((word: unknown) => isVisualText(word) && word.length <= 8)
    ) {
      return invalid("Допустимо до 16 строк ASCII, до 8 символов в каждой.");
    }
    const words: string[] = value;
    return { ok: true, input: { values: [], words, text: "", parameter: 0 } };
  }
  if (!Array.isArray(value) || value.length > 16 || !value.every(isVisualInteger)) {
    return invalid("Допустимо до 16 целых чисел от −999 до 999.");
  }
  const values: number[] = value;
  if (
    definition.inputKind === "sorted" &&
    values.some((number, i) => i > 0 && number < values[i - 1])
  ) {
    return invalid("Для этого алгоритма массив должен быть отсортирован по возрастанию.");
  }
  if (
    definition.inputKind === "rotated" &&
    (new Set(values).size !== values.length ||
      values.filter((number, i) => number > values[(i + 1) % values.length]).length > 1)
  ) {
    return invalid("Нужен отсортированный массив уникальных чисел, возможно циклически сдвинутый.");
  }
  if (definition.parameter === "left, right") {
    const parts = parameter.split(",").map((part) => part.trim());
    const [left, right] = parts.map(Number);
    if (
      parts.length !== 2 ||
      parts.some((part) => !part) ||
      !Number.isInteger(left) ||
      !Number.isInteger(right) ||
      left < 0 ||
      left > right ||
      right >= values.length
    ) {
      return invalid("Диапазон left, right: 0 ≤ left ≤ right < длины массива.");
    }
    return { ok: true, input: { values, text: "", parameter: 0, range: [left, right] } };
  }
  const numericParameter = Number(parameter);
  if (definition.parameter && (!parameter.trim() || !isVisualInteger(numericParameter))) {
    return invalid(`${definition.parameter}: введите целое число от −999 до 999.`);
  }
  if (
    definition.inputKind === "positive" &&
    (values.some((number) => number <= 0) || numericParameter <= 0)
  ) {
    return invalid("Для сжимаемого окна нужны положительные числа и target > 0.");
  }
  if (
    definition.inputKind === "window" &&
    (numericParameter < 1 || numericParameter > values.length)
  ) {
    return invalid("Размер окна k: целое число от 1 до длины непустого массива.");
  }
  return { ok: true, input: { values, text: "", parameter: numericParameter } };
};
