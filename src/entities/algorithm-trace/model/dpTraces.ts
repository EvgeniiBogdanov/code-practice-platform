import type { AlgorithmInput, TracePanel, TraceStep, TraceValue } from "./algorithmTrace";
import { createTraceRecorder, marker } from "../lib/traceRecorder";
import { tracePanel } from "./structureScene";

const balance = (label: string, entries: readonly [string, string, boolean?][]): TracePanel => ({
  kind: "balance",
  label,
  entries: entries.map(([key, value, active]) => ({ key, value, active: Boolean(active) })),
});
const cell = (value: number): TraceValue => (value === Infinity ? "∞" : value);

export const buildClimbingStairsTrace = ({
  parameter: n,
}: AlgorithmInput): readonly TraceStep[] => {
  const ways: TraceValue[] = Array.from({ length: n + 1 }, () => "?");
  let previous = -1;
  let current = -1;
  let target = -1;
  const revealed = (): number[] => ways.flatMap((value, i) => (value === "?" ? [] : [i]));
  const { steps, add } = createTraceRecorder(() => ({
    values: ways,
    shape: "token",
    pointers: [
      ...(previous >= 0 ? [marker("previous", previous, "secondary")] : []),
      ...(current >= 0 ? [marker("current", current, "primary")] : []),
      ...(target >= 0 ? [marker("step", target, "anchor")] : []),
    ],
    settled: revealed(),
    panels: [
      balance("Скользящее окно", [
        ["previous", previous >= 0 ? String(ways[previous]) : "—", previous >= 0],
        ["current", current >= 0 ? String(ways[current]) : "—", current >= 0],
      ]),
    ],
  }));
  ways[0] = 1;
  previous = 0;
  add(
    "let previous = 1",
    "Ступенька 0",
    "До «нулевой» ступеньки добраться можно одним способом: никуда не идти.",
    { focus: [0] }
  );
  ways[1] = 1;
  current = 1;
  add("let current = 1", "Ступенька 1", "На первую ступеньку ведёт один шаг: способов тоже 1.", {
    focus: [1],
  });
  for (let step = 2; step <= n; step++) {
    target = step;
    add(
      "for (let step = 2; step <= n; step++)",
      `Ступенька ${step}`,
      `Попасть на ступеньку ${step} можно с ${step - 1} (шаг в 1) или с ${step - 2} (шаг в 2).`,
      {
        formula: `ways(${step}) = ways(${step - 1}) + ways(${step - 2})`,
        focus: [previous, current, step],
      }
    );
    const sum = Number(ways[previous]) + Number(ways[current]);
    ways[step] = sum;
    const shown = `${ways[previous]} + ${ways[current]} = ${sum}`;
    previous = current;
    current = step;
    target = -1;
    add(
      "[previous, current] = [current, previous + current]",
      "Сдвигаем окно",
      `Способов добраться до ступеньки ${step}: ${sum}. Окно сдвинулось на одну ступеньку вправо.`,
      { formula: shown, focus: [step] }
    );
  }
  add("return current", "Результат", `Способов подняться на ${n} ступенек: ${ways[current]}.`, {
    result: Number(ways[current]),
    focus: [current],
  });
  return steps;
};

export const buildHouseRobberTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const best: number[] = [];
  let beforeBest = 0;
  let current = 0;
  let house = -1;
  let taken: number[] = [];
  const { steps, add } = createTraceRecorder(() => ({
    values,
    shape: "token",
    pointers: house >= 0 ? [marker("money", house, "primary")] : [],
    settled: taken,
    panels: [
      balance("Состояние", [
        ["beforeBest", String(beforeBest)],
        ["best", String(current), true],
      ]),
      tracePanel("best после каждого дома", best, best.length - 1),
    ],
  }));
  add(
    "let beforeBest = 0",
    "Лучшее без последнего",
    "beforeBest — максимум для домов до предыдущего включительно (без соседа слева)."
  );
  add("let best = 0", "Лучшее на сейчас", "best — максимум для всех уже просмотренных домов.");
  for (house = 0; house < values.length; house++) {
    const money = values[house];
    add("for (const money of nums)", `Дом ${house}`, `В доме ${house} лежит ${money}.`, {
      focus: [house],
    });
    const skip = current;
    const prior = beforeBest;
    const take = prior + money;
    const next = Math.max(skip, take);
    [beforeBest, current] = [current, next];
    best.push(next);
    add(
      "[beforeBest, best] = [best, Math.max(best, beforeBest + money)]",
      take > skip ? "Берём дом" : "Пропускаем дом",
      take > skip
        ? `Взять выгоднее: ${prior} + ${money} = ${take} больше, чем пропустить (${skip}).`
        : `Пропустить не хуже: ${skip} не меньше, чем ${take}.`,
      {
        formula: `max(${skip}, ${prior} + ${money}) = ${next}`,
        focus: [house],
      }
    );
  }
  house = -1;
  let k = values.length - 1;
  const chosen: number[] = [];
  while (k >= 0) {
    if (best[k] > (k >= 1 ? best[k - 1] : 0)) {
      chosen.push(k);
      k -= 2;
    } else k--;
  }
  taken = chosen.sort((a, b) => a - b);
  add(
    "return best",
    "Результат",
    `Максимум: ${current}. Дома, которые грабим: ${taken.length ? taken.join(", ") : "нет"}.`,
    {
      result: current,
      formula: taken.length ? `${taken.map((i) => values[i]).join(" + ")} = ${current}` : undefined,
    }
  );
  return steps;
};

export const buildCoinChangeTrace = ({
  values: coins,
  parameter: amount,
}: AlgorithmInput): readonly TraceStep[] => {
  const dp: number[] = [];
  let sum = -1;
  let source = -1;
  let coin = -1;
  const { steps, add } = createTraceRecorder(() => ({
    values: dp.map(cell),
    shape: "token",
    pointers: [
      ...(sum >= 0 ? [marker("sum", sum, "primary")] : []),
      ...(source >= 0 ? [marker("sum − coin", source, "secondary")] : []),
    ],
    band: source >= 0 && sum >= 0 ? { start: source, end: sum, tone: "secondary" } : undefined,
    settled: dp.flatMap((value, i) => (value === Infinity ? [] : [i])),
    panels: [
      {
        kind: "window",
        label: "coins · номиналы",
        entries: coins.map((value, index) => ({
          key: String(index),
          value: String(value),
          active: value === coin,
        })),
      },
    ],
  }));
  for (let i = 0; i <= amount; i++) dp.push(Infinity);
  add(
    "const dp = new Array(amount + 1).fill(Infinity)",
    "Таблица dp",
    "dp[sum] — минимум монет для суммы sum. ∞ означает «набрать пока нельзя»."
  );
  dp[0] = 0;
  add("dp[0] = 0", "База", "Для суммы 0 монеты не нужны.", { focus: [0] });
  for (sum = 1; sum <= amount; sum++) {
    coin = -1;
    source = -1;
    add(
      "for (let sum = 1; sum <= amount; sum++)",
      `Сумма ${sum}`,
      `Ищем минимум монет для суммы ${sum}.`,
      { focus: [sum] }
    );
    for (const value of coins) {
      coin = value;
      source = -1;
      add(
        "for (const coin of coins)",
        `Монета ${value}`,
        `Пробуем взять монету ${value} последней.`,
        { focus: [sum] }
      );
      const fits = value <= sum;
      add(
        "if (coin <= sum)",
        fits ? "Монета подходит" : "Монета слишком большая",
        fits
          ? `${value} ≤ ${sum}: остаётся набрать ${sum - value}.`
          : `${value} > ${sum}: монета не помещается.`,
        { focus: [sum] }
      );
      if (!fits) continue;
      source = sum - value;
      const old = dp[sum];
      const candidate = dp[source] + 1;
      dp[sum] = Math.min(old, candidate);
      const text = (item: number): string => (item === Infinity ? "∞" : String(item));
      add(
        "dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1)",
        dp[sum] < old ? "Нашли лучше" : "Не лучше",
        dp[sum] < old
          ? `dp[${sum}] = ${text(dp[sum])}: сумму ${source} набираем за ${text(dp[source])} монет и добавляем ${value}.`
          : `Вариант через ${value} (${text(candidate)}) не лучше текущего ${text(old)}.`,
        {
          formula: `min(${text(old)}, ${text(dp[source])} + 1) = ${text(dp[sum])}`,
          focus: [sum, source],
        }
      );
    }
  }
  sum = -1;
  source = -1;
  coin = -1;
  add(
    "return dp[amount] === Infinity",
    dp[amount] === Infinity ? "Набрать нельзя" : "Результат",
    dp[amount] === Infinity
      ? `dp[${amount}] = ∞: сумму ${amount} набрать нельзя, ответ −1.`
      : `Минимум монет для суммы ${amount}: ${dp[amount]}.`,
    {
      result: dp[amount] === Infinity ? -1 : dp[amount],
      focus: [amount],
    }
  );
  return steps;
};
