import type { AlgorithmDefinition, ParsedAlgorithmInput } from "../model/algorithm-trace";

export const parseAlgorithmInput = (
  definition: Pick<AlgorithmDefinition, "inputKind" | "parameter">,
  raw: string,
  parameter: string
): ParsedAlgorithmInput => {
  if (definition.inputKind === "text") {
    if (raw.length > 32 || /[^\x20-\x7e]/.test(raw)) {
      return {
        ok: false,
        error: "Введите до 32 символов: латиница, цифры, пробелы и знаки ASCII.",
      };
    }
    return { ok: true, input: { values: [], text: raw, parameter: 0 } };
  }
  let value: unknown;
  try {
    value = JSON.parse(raw.trim().startsWith("[") ? raw : `[${raw}]`);
  } catch {
    return {
      ok: false,
      error: "Введите числа через запятую, например: 0, 1, 0, 3. Пустой массив: [].",
    };
  }
  if (!Array.isArray(value) || value.length > 16 || !value.every(isVisualInteger)) {
    return { ok: false, error: "Допустимо до 16 целых чисел от −999 до 999." };
  }
  const values: number[] = value;
  if (
    definition.inputKind === "sorted" &&
    values.some((number, i) => i > 0 && number < values[i - 1])
  ) {
    return {
      ok: false,
      error: "Для этого алгоритма массив должен быть отсортирован по возрастанию.",
    };
  }
  const numericParameter = Number(parameter);
  if (definition.parameter && (!parameter.trim() || !isVisualInteger(numericParameter))) {
    return { ok: false, error: `${definition.parameter}: введите целое число от −999 до 999.` };
  }
  return { ok: true, input: { values, text: "", parameter: numericParameter } };
};

const isVisualInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && Math.abs(value) <= 999;
