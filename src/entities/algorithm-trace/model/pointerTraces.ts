import type { AlgorithmInput, TracePanel, TraceStep } from "./algorithmTrace";
import { createTraceRecorder, marker, pointerPair } from "../lib/traceRecorder";

const balance = (label: string, entries: readonly [string, string, boolean?][]): TracePanel => ({
  kind: "balance",
  label,
  entries: entries.map(([key, value, active]) => ({ key, value, active: Boolean(active) })),
});

export const buildClosestPersonTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  let prev = -1;
  let best = 0;
  let seat = -1;
  let i = -1;
  let gap: { start: number; end: number } | undefined;
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: [
      ...(prev >= 0 ? [marker("prev", prev, "secondary")] : []),
      ...(i >= 0 ? [marker("i", i, "primary")] : []),
      ...(seat >= 0 ? [marker("seat", seat, "anchor")] : []),
    ],
    band: gap ? { ...gap, tone: "anchor" } : undefined,
    settled: values.flatMap((value, index) => (value === 1 ? [index] : [])),
    panels: [
      balance("Лучшее место", [
        ["best", String(best), true],
        ["seat", seat < 0 ? "—" : String(seat)],
        ["prev", String(prev)],
      ]),
    ],
  }));
  add(
    "let prev = -1",
    "Занятых мест слева нет",
    "prev = −1: пока не встретили ни одного занятого места."
  );
  add(
    "let best = 0",
    "Лучшее расстояние",
    "best хранит максимальное расстояние до ближайшего соседа."
  );
  for (i = 0; i < values.length; i++) {
    gap = undefined;
    add("for (let i = 0; i < seats.length; i++)", "Читаем место", `Место ${i}: ${values[i]}.`, {
      focus: [i],
    });
    const occupied = values[i] === 1;
    add(
      "if (seats[i] === 1)",
      "Место занято?",
      occupied
        ? `seats[${i}] = 1: считаем свободный промежуток слева от места ${i}.`
        : `seats[${i}] = 0: место свободно, ничего не считаем.`,
      { focus: [i] }
    );
    if (!occupied) continue;
    const edge = prev === -1;
    const candidate = edge ? i : Math.floor((i - prev) / 2);
    gap = { start: edge ? 0 : prev, end: i };
    if (candidate > best) {
      best = candidate;
      seat = edge ? 0 : prev + candidate;
    }
    add(
      "best = prev === -1 ? i : Math.max(best, Math.floor((i - prev) / 2))",
      edge ? "Левый край" : "Промежуток между занятыми",
      edge
        ? `Свободных мест до первого занятого: ${i}. Выгодно сесть в самый край: расстояние ${i}.`
        : `Между ${prev} и ${i} лучше сесть посередине: расстояние ${candidate}.`,
      { formula: edge ? `i = ${i}` : `⌊(${i} − ${prev}) / 2⌋ = ${candidate}`, focus: [i] }
    );
    prev = i;
    add(
      "prev = i",
      "Запоминаем занятое место",
      `prev = ${i}: следующий промежуток начнётся отсюда.`,
      {
        focus: [i],
      }
    );
  }
  i = -1;
  const tail = values.length - 1 - prev;
  gap = { start: prev, end: values.length - 1 };
  if (tail > best) {
    best = tail;
    seat = values.length - 1;
  }
  add(
    "return Math.max(best, seats.length - 1 - prev)",
    "Правый край",
    `После последнего занятого места осталось ${tail} свободных. Ответ — максимум: ${best}.`,
    { formula: `max(…, ${values.length - 1} − ${prev}) = ${best}`, result: best }
  );
  return steps;
};

export const buildPalindromeCenterTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const chars = [...text];
  let start = 0;
  let maxLength = 0;
  let center = -1;
  let left = -1;
  let right = -1;
  let candidate: { start: number; end: number } | undefined;
  const { steps, add } = createTraceRecorder(() => ({
    values: chars,
    shape: "token",
    pointers: [
      ...(center >= 0 ? [marker("center", center, "anchor")] : []),
      ...(left >= -1 && right >= 0 ? pointerPair(left, right, ["left", "right"]) : []),
    ],
    band: candidate ? { ...candidate, tone: "primary" } : undefined,
    settled: Array.from({ length: maxLength }, (_, offset) => start + offset),
    panels: [
      balance("Лучший палиндром", [
        ["start", String(start)],
        ["maxLength", String(maxLength), true],
        ["substring", JSON.stringify(text.slice(start, start + maxLength))],
      ]),
    ],
  }));
  add(
    "let start = 0",
    "Лучший палиндром",
    "start и maxLength описывают самую длинную найденную подстроку."
  );
  const expand = (from: number, to: number): number => {
    left = from;
    right = to;
    candidate = undefined;
    while (true) {
      const inside = left >= 0 && right < chars.length;
      const equal = inside && chars[left] === chars[right];
      add(
        "while (left >= 0 && right < s.length && s[left] === s[right])",
        "Сравниваем края",
        !inside
          ? "Указатель вышел за границу строки: расширение закончено."
          : equal
            ? `s[${left}] = ${JSON.stringify(chars[left])} совпадает с s[${right}]: палиндром растёт.`
            : `s[${left}] = ${JSON.stringify(chars[left])} ≠ s[${right}] = ${JSON.stringify(chars[right])}: останавливаемся.`,
        { focus: inside ? [left, right] : [] }
      );
      if (!equal) break;
      candidate = { start: left, end: right };
      left--;
      right++;
      add(
        "left--",
        "Расширяем в обе стороны",
        "left−− и right++: проверяем следующую пару символов.",
        {
          focus: candidate ? [candidate.start, candidate.end] : [],
        }
      );
    }
    const length = right - left - 1;
    add(
      "return right - left - 1",
      "Длина палиндрома",
      `Палиндром выходит за пределы указателей: длина ${length}.`,
      {
        formula: `${right} − ${left} − 1 = ${length}`,
      }
    );
    return length;
  };
  for (let i = 0; i < chars.length; i++) {
    center = i;
    left = -1;
    right = -1;
    candidate = undefined;
    add(
      "for (let i = 0; i < s.length; i++)",
      "Следующий центр",
      `Центр в символе ${i} (нечётная длина) или между ${i} и ${i + 1} (чётная).`,
      {
        focus: [i],
      }
    );
    add(
      "const length = Math.max(expand(i, i), expand(i, i + 1))",
      "Два типа центров",
      "Сначала расширяем от одного символа, затем от пары соседних.",
      { focus: [i] }
    );
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    const length = Math.max(odd, even);
    candidate = undefined;
    left = -1;
    right = -1;
    add(
      "if (length > maxLength)",
      "Лучше найденного?",
      length > maxLength
        ? `Длина ${length} больше ${maxLength}: обновляем лучший палиндром.`
        : `Длина ${length} не больше ${maxLength}: оставляем прежний результат.`,
      { formula: `max(${odd}, ${even}) = ${length}` }
    );
    if (length > maxLength) {
      maxLength = length;
      start = i - Math.floor((length - 1) / 2);
      add(
        "start = i - Math.floor((length - 1) / 2)",
        "Запоминаем начало",
        `Палиндром начинается с индекса ${start}.`,
        {
          formula: `${i} − ⌊(${length} − 1) / 2⌋ = ${start}`,
        }
      );
    }
  }
  center = -1;
  const answer = text.slice(start, start + maxLength);
  add(
    "return s.slice(start, start + maxLength)",
    "Результат",
    `Самый длинный палиндром: ${JSON.stringify(answer)}.`,
    {
      result: answer,
    }
  );
  return steps;
};
