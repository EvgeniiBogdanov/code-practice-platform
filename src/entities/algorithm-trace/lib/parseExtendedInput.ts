import type { AlgorithmDefinition, ParsedAlgorithmInput } from "../model/algorithmTrace";

type Definition = Pick<AlgorithmDefinition, "inputKind" | "parameter">;

const invalid = (error: string): ParsedAlgorithmInput => ({ ok: false, error });
const integer = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && Math.abs(value) <= 999;
const integers = (value: unknown, max = 16): value is number[] =>
  Array.isArray(value) && value.length <= max && value.every(integer);
const isSorted = (value: readonly number[]): boolean =>
  value.every((item, i) => i === 0 || item >= value[i - 1]);
const parseList = (raw: string): unknown => {
  try {
    return JSON.parse(raw.trim().startsWith("[") ? raw : `[${raw}]`);
  } catch {
    return undefined;
  }
};
const base = { values: [], text: "", parameter: 0 };

const parseIndexed = (raw: string): ParsedAlgorithmInput => {
  const value = parseList(raw);
  return integers(value, 12) && value.length > 0 && value.every((n) => n >= 1 && n <= value.length)
    ? { ok: true, input: { ...base, values: value } }
    : invalid("n чисел, каждое от 1 до n (n от 1 до 12). Пример: 4, 3, 2, 7, 8, 2, 3, 1.");
};
const parseSeats = (raw: string): ParsedAlgorithmInput => {
  const value = parseList(raw);
  return integers(value, 14) &&
    value.length >= 2 &&
    value.every((n) => n === 0 || n === 1) &&
    value.includes(0) &&
    value.includes(1)
    ? { ok: true, input: { ...base, values: value } }
    : invalid("От 2 до 14 мест: 1 — занято, 0 — свободно. Нужно хотя бы по одному каждого вида.");
};
const parseTriple = (raw: string): ParsedAlgorithmInput => {
  const value = parseList(raw);
  const valid =
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((part) => integers(part, 8) && isSorted(part));
  return valid
    ? {
        ok: true,
        input: { ...base, values: value[0], secondValues: value[1], thirdValues: value[2] },
      }
    : invalid("Три неубывающих массива: [[1,2,4,5],[3,3,4],[2,3,4,5,6]], до 8 чисел в каждом.");
};
const parseRanges = (raw: string): ParsedAlgorithmInput => {
  const message = "Числа и диапазоны через запятую без пробелов: 1-6,8-9,11. Всего до 24 чисел.";
  if (raw.length > 32 || !/^(\d{1,3}(-\d{1,3})?(,\d{1,3}(-\d{1,3})?)*)?$/.test(raw))
    return invalid(message);
  const total = raw
    .split(",")
    .filter(Boolean)
    .reduce((sum, part) => {
      const [start, end = start] = part.split("-").map(Number);
      return end < start ? Number.NaN : sum + end - start + 1;
    }, 0);
  return total <= 24 ? { ok: true, input: { ...base, text: raw } } : invalid(message);
};
const parseShortText = (raw: string): ParsedAlgorithmInput =>
  raw.length >= 1 && raw.length <= 14 && /^[\x21-\x7e]+$/.test(raw)
    ? { ok: true, input: { ...base, text: raw } }
    : invalid("От 1 до 14 символов ASCII без пробелов. Пример: babad.");
const parsePath = (raw: string): ParsedAlgorithmInput =>
  raw.length <= 32 && /^\/[A-Za-z0-9._/-]*$/.test(raw)
    ? { ok: true, input: { ...base, text: raw } }
    : invalid("Путь начинается с /, до 32 символов: латиница, цифры, точки, _ и -.");

const DECODE_LIMIT = 30;
const parseDecode = (raw: string): ParsedAlgorithmInput => {
  const message = `Формат k[строка]: строчные латинские буквы, числа и скобки, до 24 символов. Результат — до ${DECODE_LIMIT} символов.`;
  if (raw.length < 1 || raw.length > 24 || !/^[a-z0-9[\]]+$/.test(raw)) return invalid(message);
  const frames: { length: number; times: number }[] = [];
  let current = 0;
  let count = "";
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (/\d/.test(char)) {
      count += char;
    } else if (char === "[") {
      if (!count || Number(count) < 1) return invalid(message);
      frames.push({ length: current, times: Number(count) });
      current = 0;
      count = "";
    } else {
      if (count) return invalid(message);
      if (char === "]") {
        const frame = frames.pop();
        if (!frame) return invalid(message);
        current = frame.length + current * frame.times;
      } else current++;
    }
    if (current > DECODE_LIMIT) return invalid(message);
  }
  return !count && !frames.length ? { ok: true, input: { ...base, text: raw } } : invalid(message);
};

const parseCalc = (raw: string): ParsedAlgorithmInput => {
  const message =
    "Целые числа до 999 и + − * / (пробелы допустимы), до 24 символов. Без деления на 0.";
  if (raw.length > 24 || !/^\s*\d{1,3}(\s*[-+*/]\s*\d{1,3})*\s*$/.test(raw))
    return invalid(message);
  const hasZeroDivision = /\/\s*0+(?!\d)/.test(raw);
  return hasZeroDivision ? invalid(message) : { ok: true, input: { ...base, text: raw } };
};

const edgeList = (
  value: unknown,
  lowest: number,
  highest: number
): (readonly [number, number])[] | undefined => {
  if (!Array.isArray(value) || value.length > 12) return undefined;
  const pairs: (readonly [number, number])[] = [];
  for (const item of value) {
    if (!Array.isArray(item) || item.length !== 2) return undefined;
    const [from, to] = item;
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from === to ||
      from < lowest ||
      from > highest ||
      to < lowest ||
      to > highest
    )
      return undefined;
    pairs.push([from, to]);
  }
  return pairs;
};
const isAcyclic = (nodes: number, pairs: readonly (readonly [number, number])[]): boolean => {
  const indegree = new Map<number, number>();
  for (let node = 1; node <= nodes; node++) indegree.set(node, 0);
  pairs.forEach(([, to]) => indegree.set(to, (indegree.get(to) ?? 0) + 1));
  const queue = [...indegree].filter(([, count]) => count === 0).map(([node]) => node);
  for (let head = 0; head < queue.length; head++) {
    pairs
      .filter(([from]) => from === queue[head])
      .forEach(([, to]) => {
        indegree.set(to, (indegree.get(to) ?? 0) - 1);
        if (indegree.get(to) === 0) queue.push(to);
      });
  }
  return queue.length === nodes;
};
const parseGraph = (raw: string, parameter: string): ParsedAlgorithmInput => {
  const count = Number(parameter);
  if (!parameter.trim() || !Number.isInteger(count) || count < 1 || count > 8)
    return invalid("numCourses: целое число от 1 до 8.");
  const pairs = edgeList(parseList(raw), 0, count - 1);
  return pairs
    ? { ok: true, input: { ...base, pairs, parameter: count } }
    : invalid(
        "prerequisites: до 12 пар [курс, требование] с номерами от 0 до numCourses − 1, без пар вида [a, a]."
      );
};
const parseCourses = (raw: string, parameter: string): ParsedAlgorithmInput => {
  const times = parseList(parameter);
  const timesValid =
    Array.isArray(times) &&
    times.length >= 1 &&
    times.length <= 8 &&
    times.every((time) => Number.isInteger(time) && time >= 1 && time <= 9);
  if (!timesValid) return invalid("time: от 1 до 8 длительностей курсов, каждая от 1 до 9.");
  const pairs = edgeList(parseList(raw), 1, times.length);
  if (!pairs)
    return invalid(
      "relations: до 12 пар [prev, next] с номерами курсов от 1 до n (n — число длительностей)."
    );
  return isAcyclic(times.length, pairs)
    ? { ok: true, input: { ...base, pairs, times, parameter: times.length } }
    : invalid("Зависимости образуют цикл: для этой задачи граф должен быть без циклов.");
};
const parseCount = (raw: string): ParsedAlgorithmInput => {
  const n = Number(raw);
  return raw.trim() && Number.isInteger(n) && n >= 1 && n <= 12
    ? { ok: true, input: { ...base, parameter: n } }
    : invalid("n: целое число ступенек от 1 до 12.");
};
const parseAmounts = (raw: string): ParsedAlgorithmInput => {
  const value = parseList(raw);
  return integers(value, 10) && value.length >= 1 && value.every((n) => n >= 0 && n <= 99)
    ? { ok: true, input: { ...base, values: value } }
    : invalid("От 1 до 10 домов: неотрицательные целые числа до 99.");
};
const parseCoins = (raw: string, parameter: string): ParsedAlgorithmInput => {
  const value = parseList(raw);
  const amount = Number(parameter);
  if (
    !integers(value, 4) ||
    !value.length ||
    new Set(value).size !== value.length ||
    value.some((coin) => coin < 1 || coin > 12)
  )
    return invalid("От 1 до 4 разных номиналов монет, каждый от 1 до 12.");
  return parameter.trim() && Number.isInteger(amount) && amount >= 0 && amount <= 14
    ? { ok: true, input: { ...base, values: value, parameter: amount } }
    : invalid("amount: целое число от 0 до 14.");
};

export const parseExtendedInput = (
  definition: Definition,
  raw: string,
  parameter: string
): ParsedAlgorithmInput | undefined => {
  switch (definition.inputKind) {
    case "indexed":
      return parseIndexed(raw);
    case "seats":
      return parseSeats(raw);
    case "triple":
      return parseTriple(raw);
    case "ranges":
      return parseRanges(raw);
    case "shortText":
      return parseShortText(raw);
    case "path":
      return parsePath(raw);
    case "decode":
      return parseDecode(raw);
    case "calc":
      return parseCalc(raw);
    case "graph":
      return parseGraph(raw, parameter);
    case "courses":
      return parseCourses(raw, parameter);
    case "count":
      return parseCount(raw);
    case "amounts":
      return parseAmounts(raw);
    case "coins":
      return parseCoins(raw, parameter);
    default:
      return undefined;
  }
};
