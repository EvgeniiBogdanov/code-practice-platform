import type { AlgorithmInput, TraceStep } from "./algorithmTrace";
import { createTraceRecorder } from "../lib/traceRecorder";
import { tracePanel } from "./structureScene";

export const buildExpandRangesTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const parts = text === "" ? [] : text.split(",");
  const offsets: { start: number; end: number }[] = [];
  parts.reduce((position, part) => {
    offsets.push({ start: position, end: position + part.length - 1 });
    return position + part.length + 1;
  }, 0);
  const result: number[] = [];
  let active = -1;
  let bounds: [number, number] | undefined;
  const { steps, add } = createTraceRecorder(() => ({
    values: [...text],
    shape: "token",
    pointers: [],
    band: active >= 0 ? { ...offsets[active], tone: "primary" } : undefined,
    panels: [
      tracePanel('Токены · split(",")', parts, active),
      {
        kind: "balance",
        label: "Границы диапазона",
        entries: [
          { key: "start", value: bounds ? String(bounds[0]) : "—", active: Boolean(bounds) },
          { key: "end", value: bounds ? String(bounds[1]) : "—", active: Boolean(bounds) },
        ],
      },
      tracePanel("result · развёрнутые числа", result, -1),
    ],
  }));
  add(
    'if (ranges === "")',
    "Пустая строка?",
    text === ""
      ? '"".split(",") дал бы [""], а Number("") равен 0: без проверки получился бы [0].'
      : "Строка не пустая: разбираем токены по запятым."
  );
  if (text === "") {
    add("return []", "Пустой результат", "Для пустого ввода возвращаем пустой массив.", {
      result: [],
    });
    return steps;
  }
  add("const result = []", "Накопитель", "В result будем складывать числа в порядке чтения.");
  parts.forEach((part, index) => {
    active = index;
    bounds = undefined;
    add(
      'for (const part of ranges.split(","))',
      "Следующий токен",
      `Токен ${index + 1} из ${parts.length}: ${JSON.stringify(part)}.`
    );
    const [start, end = start] = part.split("-").map(Number);
    bounds = [start, end];
    add(
      'const [start, end = start] = part.split("-").map(Number)',
      part.includes("-") ? "Диапазон" : "Одиночное число",
      part.includes("-")
        ? `Токен делится по дефису: ${start} и ${end}.`
        : `Дефиса нет, end берёт значение по умолчанию: диапазон ${start}–${end} из одного числа.`,
      {
        formula: part.includes("-")
          ? `${JSON.stringify(part)} → [${start}, ${end}]`
          : `[${start}] → end = ${start}`,
      }
    );
    add(
      "for (let value = start; value <= end; value++)",
      "Разворачиваем диапазон",
      `Добавим числа от ${start} до ${end} включительно (${end - start + 1} шт.).`
    );
    for (let value = start; value <= end; value++) {
      result.push(value);
      add("result.push(value)", "Добавляем число", `result ← ${value}.`);
    }
  });
  active = -1;
  bounds = undefined;
  add("return result", "Результат", `Развёрнуто ${result.length} чисел.`, { result: [...result] });
  return steps;
};
