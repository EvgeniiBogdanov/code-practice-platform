import type {
  AlgorithmDefinition,
  ParsedAlgorithmInput,
  StackOperation,
} from "../model/algorithm-trace";

const integer = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && Math.abs(value) <= 999;
const numbers = (value: unknown): value is number[] =>
  Array.isArray(value) && value.length <= 16 && value.every(integer);
const tree = (value: unknown): value is (number | null)[] => {
  if (
    !Array.isArray(value) ||
    value.length > 31 ||
    !value.every((item: unknown) => item === null || integer(item))
  )
    return false;
  let slots = 1;
  for (const item of value) {
    if (slots === 0) return false;
    slots += item === null ? -1 : 1;
  }
  return true;
};
const sorted = (value: number[]): boolean => value.every((n, i) => i === 0 || n >= value[i - 1]);
const operation = (value: unknown): value is StackOperation =>
  Array.isArray(value) &&
  ((value.length === 2 && value[0] === "push" && integer(value[1])) ||
    (value.length === 1 && ["pop", "top", "getMin"].includes(value[0])));
const invalid = (error: string): ParsedAlgorithmInput => ({ ok: false, error });
const kinds = new Set([
  "brackets",
  "operations",
  "lists",
  "cycle",
  "tree",
  "trees",
  "islands",
  "oranges",
  "flood",
  "subsets",
  "permutations",
  "combinations",
  "binary",
  "parentheses",
]);

export const parseStructureInput = (
  definition: Pick<AlgorithmDefinition, "inputKind" | "parameter">,
  raw: string,
  parameter: string
): ParsedAlgorithmInput | undefined => {
  const kind = definition.inputKind;
  if (!kinds.has(kind)) return undefined;
  const base = { values: [], text: "", parameter: 0 };
  if (kind === "brackets")
    return raw.length <= 32 && /^[()[\]{}]*$/.test(raw)
      ? { ok: true, input: { ...base, text: raw } }
      : invalid("До 32 скобок: () [] {}. Пустая строка допустима.");
  if (kind === "binary" || kind === "parentheses") {
    const n = Number(raw);
    const max = kind === "binary" ? 4 : 3;
    return raw.trim() && Number.isInteger(n) && n >= 0 && n <= max
      ? { ok: true, input: { ...base, parameter: n } }
      : invalid(`n: целое число от 0 до ${max}. Лимит сохраняет дерево перебора обозримым.`);
  }
  let value: unknown;
  try {
    value = JSON.parse(raw.trim().startsWith("[") ? raw : `[${raw}]`);
  } catch {
    return invalid("Введите корректный JSON-массив. Пример формата указан над сценой.");
  }
  if (kind === "operations") {
    if (!Array.isArray(value) || value.length > 24 || !value.every(operation))
      return invalid('До 24 операций: ["push", 2], ["pop"], ["top"], ["getMin"].');
    let size = 0;
    for (const op of value) {
      if (op[0] === "push") size++;
      else {
        if (!size) return invalid("pop, top и getMin допустимы только для непустого стека.");
        if (op[0] === "pop") size--;
      }
    }
    return { ok: true, input: { ...base, operations: value } };
  }
  if (kind === "tree")
    return tree(value)
      ? { ok: true, input: { ...base, tree: value } }
      : invalid(
          "Дерево: до 31 значения в level-order, числа или null. Узел должен иметь родителя."
        );
  if (kind === "trees")
    return Array.isArray(value) && value.length === 2 && value.every(tree)
      ? { ok: true, input: { ...base, tree: value[0], secondTree: value[1] } }
      : invalid("Введите два дерева: [[1,2,3],[1,null,3]]. До 31 значения в каждом.");
  if (kind === "lists")
    return Array.isArray(value) && value.length === 2 && value.every(numbers) && value.every(sorted)
      ? { ok: true, input: { ...base, values: value[0], secondValues: value[1] } }
      : invalid("Два отсортированных списка: [[1,2,4],[1,3,4]], до 16 чисел в каждом.");
  if (kind === "islands" || kind === "oranges" || kind === "flood") {
    if (
      !Array.isArray(value) ||
      !value.length ||
      value.length > 5 ||
      !value.every(
        (row: unknown) =>
          Array.isArray(row) &&
          row.length > 0 &&
          row.length <= 6 &&
          row.every(
            (cell: unknown) =>
              integer(cell) || (kind === "islands" && (cell === "0" || cell === "1"))
          )
      )
    )
      return invalid("Прямоугольная сетка: 1–5 строк, 1–6 целочисленных ячеек в строке.");
    const grid: number[][] = value.map((row: (number | string)[]) => row.map(Number));
    if (grid.some((row) => row.length !== grid[0].length))
      return invalid("У всех строк сетки должна быть одинаковая длина.");
    if (kind !== "flood" && grid.flat().some((n) => n < 0 || n > (kind === "islands" ? 1 : 2)))
      return invalid(
        kind === "islands"
          ? "Острова: только 0 (вода) и 1 (суша)."
          : "Апельсины: 0 — пусто, 1 — свежий, 2 — гнилой."
      );
    if (kind === "flood") {
      const parts = parameter.split(",");
      const [r, c, color] = parts.map(Number);
      if (
        parts.length !== 3 ||
        parts.some((part) => !part.trim()) ||
        ![r, c, color].every(integer) ||
        r < 0 ||
        r >= grid.length ||
        c < 0 ||
        c >= grid[0].length
      )
        return invalid(
          "sr, sc, color: координаты существующей ячейки и целый цвет от −999 до 999."
        );
      return { ok: true, input: { ...base, grid, cell: [r, c], parameter: color } };
    }
    return { ok: true, input: { ...base, grid } };
  }
  if (!numbers(value)) return invalid("Допустимо до 16 целых чисел от −999 до 999.");
  if (kind === "cycle") {
    const pos = Number(parameter);
    return parameter.trim() && Number.isInteger(pos) && pos >= -1 && pos < value.length
      ? { ok: true, input: { ...base, values: value, parameter: pos } }
      : invalid("pos: индекс узла для замыкания хвоста; −1 означает отсутствие цикла.");
  }
  const max = kind === "subsets" ? 5 : 4;
  if (value.length > max || new Set(value).size !== value.length)
    return invalid(`До ${max} уникальных чисел: размер ограничивает дерево перебора.`);
  const target = Number(parameter);
  if (
    kind === "combinations" &&
    (value.some((n) => n <= 0) ||
      !parameter.trim() ||
      !Number.isInteger(target) ||
      target < 1 ||
      target > 10)
  )
    return invalid("До 4 уникальных положительных кандидатов; target — от 1 до 10.");
  return {
    ok: true,
    input: { ...base, values: value, parameter: kind === "combinations" ? target : 0 },
  };
};
