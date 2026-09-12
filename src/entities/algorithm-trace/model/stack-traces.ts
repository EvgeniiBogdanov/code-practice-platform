import type {
  AlgorithmInput,
  TraceStep,
  TraceValue,
  TraceStackAction,
  TraceStackLane,
} from "./algorithm-trace";
import { createTraceRecorder } from "../lib/trace-recorder";
import { stackScene, stackAction, tracePanel } from "./structure-scene";

const characterStack = ({ text }: AlgorithmInput, brackets: boolean): readonly TraceStep[] => {
  const stack: string[] = [];
  let index = -1;
  let action: TraceStackAction | undefined;
  const { steps, add } = createTraceRecorder(() => ({
    values: [...text],
    pointers: index < 0 ? [] : [{ label: "char", index, tone: "primary" }],
    structure: stackScene(
      [{ label: brackets ? "Ожидаем закрытие" : "Символы без пар", values: stack }],
      action
    ),
    panels: [
      tracePanel(
        "Вход · текущий символ",
        [...text].map((char, i) => (i === index ? `▶ ${char}` : char)),
        index
      ),
    ],
  }));
  add(
    "const stack = []",
    "Пустой стек",
    brackets
      ? "Храним ожидаемые закрывающие скобки. Снимаем только вершину."
      : "Вершина хранит последний символ ещё не сокращённой строки."
  );
  const pairs: Readonly<Record<string, string>> = { "(": ")", "[": "]", "{": "}" };
  for (index = 0; index < text.length; index++) {
    const char = text[index];
    action = undefined;
    add("for (const char of s)", "Читаем символ", `Символ ${char}, индекс ${index}.`);
    if (brackets) {
      if (pairs[char]) {
        action = stackAction(
          "push",
          [{ label: "Ожидаем закрытие", values: stack }],
          [{ lane: 0, value: pairs[char] }]
        );
        stack.push(pairs[char]);
        add(
          "isOpen ? stack.push(expectedClose)",
          "Push · ожидаем закрытие",
          `Добавляем ${pairs[char]} на вершину.`
        );
      } else {
        action = stackAction(
          "pop",
          [{ label: "Ожидаем закрытие", values: stack }],
          stack.length ? [{ lane: 0, value: stack.at(-1)! }] : []
        );
        const expected = stack.pop();
        add(
          "const last = stack.pop()",
          "Pop · проверяем пару",
          `Сняли ${expected ?? "∅"}; прочитали ${char}.`
        );
        if (expected !== char) {
          add(
            "if (!isMatch) return false",
            "Скобки не совпали",
            "Закрывающая скобка не соответствует вершине.",
            { result: false }
          );
          return steps;
        }
      }
    } else if (stack.at(-1) === char) {
      action = stackAction(
        "pop",
        [{ label: "Символы без пар", values: stack }],
        [{ lane: 0, value: char }]
      );
      stack.pop();
      add(
        "stack.pop()",
        "Pop · удаляем пару",
        `Два соседних ${char} сокращаются. Открылась предыдущая вершина.`
      );
    } else {
      action = stackAction(
        "push",
        [{ label: "Символы без пар", values: stack }],
        [{ lane: 0, value: char }]
      );
      stack.push(char);
      add("stack.push(char)", "Push · сохраняем символ", `${char} становится новой вершиной.`);
    }
  }
  index = -1;
  action = undefined;
  add(
    brackets ? "return !stack.length" : 'return stack.join("")',
    "Результат",
    brackets
      ? stack.length
        ? "Остались незакрытые скобки."
        : "Все пары закрыты."
      : `Оставшаяся строка: ${stack.join("") || "∅"}.`,
    { result: brackets ? !stack.length : stack.join("") }
  );
  return steps;
};
export const buildBracketsTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  characterStack(input, true);
export const buildAdjacentTrace = (input: AlgorithmInput): readonly TraceStep[] =>
  characterStack(input, false);

export const buildMinStackTrace = ({ operations = [] }: AlgorithmInput): readonly TraceStep[] => {
  const stack: number[] = [],
    minima: number[] = [],
    output: TraceValue[] = [];
  let action: TraceStackAction | undefined;
  const lanes = (): readonly TraceStackLane[] => [
    { label: "Значения · stack", values: stack },
    { label: "Минимумы · minStack", values: minima },
  ];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: stackScene(lanes(), action),
    panels: [tracePanel("Ответы top / getMin", output)],
  }));
  add(
    "const minStack = []",
    "Два синхронных стека",
    "На каждой глубине справа хранится минимум всех значений до этой глубины."
  );
  operations.forEach(([op, value]) => {
    if (op === "push" && value !== undefined) {
      action = stackAction("push", lanes(), [{ lane: 0, value }]);
      stack.push(value);
      add("stack.push(value)", `Push ${value}`, "Добавляем значение в основной стек.");
      const minimum = Math.min(value, minima.at(-1) ?? value);
      action = stackAction("push", lanes(), [{ lane: 1, value: minimum }]);
      minima.push(minimum);
      add(
        "minStack.push(currentMin)",
        "Сохраняем минимум",
        `Минимум на этой глубине: ${minima.at(-1)}.`
      );
    } else if (op === "pop") {
      action = stackAction("pop", lanes(), [
        { lane: 0, value: stack.at(-1)! },
        { lane: 1, value: minima.at(-1)! },
      ]);
      const removed = stack.pop();
      minima.pop();
      add(
        "minStack.pop()",
        "Pop · снимаем обе вершины",
        `Удалили ${removed}; предыдущий минимум восстановлен без поиска.`
      );
    } else {
      const answer = op === "top" ? stack.at(-1)! : minima.at(-1)!;
      action = stackAction("peek", lanes(), [{ lane: op === "top" ? 0 : 1, value: answer }]);
      output.push(answer);
      add(
        op === "top" ? "const top =" : "const getMin =",
        `${op} → ${answer}`,
        "Читаем вершину за O(1), не изменяя стеки."
      );
    }
  });
  action = undefined;
  add(
    "return { push, pop, top, getMin }",
    "Операции выполнены",
    "Ответы запросов сохранены в порядке вызова.",
    { result: [...output] }
  );
  return steps;
};

export const buildTemperaturesTrace = ({ values }: AlgorithmInput): readonly TraceStep[] => {
  const stack: number[] = [],
    result = values.map(() => 0);
  let index = -1;
  let action: TraceStackAction | undefined;
  const lanes = (): readonly TraceStackLane[] => [
    { label: "Дни без ответа · индекс: °C", values: stack.map((i) => `${i}: ${values[i]}°`) },
  ];
  const { steps, add } = createTraceRecorder(() => ({
    values,
    pointers: index < 0 ? [] : [{ label: "i", index, tone: "primary" }],
    structure: stackScene(lanes(), action),
    panels: [tracePanel("Температуры", values, index), tracePanel("Дней до потепления", result)],
  }));
  add(
    "const stack = []",
    "Монотонный стек индексов",
    "Снизу вверх температуры не возрастают. Индексы ждут более тёплый день."
  );
  for (index = 0; index < values.length; index++) {
    action = undefined;
    add(
      "const isWarmer =",
      "Сравниваем с вершиной",
      `День ${index}: ${values[index]}°. Снимаем все более холодные дни.`
    );
    while (stack.length && values[index] > values[stack.at(-1)!]) {
      const previous = stack.at(-1)!;
      action = stackAction("pop", lanes(), [
        { lane: 0, value: `${previous}: ${values[previous]}°` },
      ]);
      stack.pop();
      result[previous] = index - previous;
      add(
        "result[prevIndex] = i - prevIndex",
        "Pop · найден тёплый день",
        `Для дня ${previous}: ${index} − ${previous} = ${result[previous]}.`
      );
    }
    action = stackAction("push", lanes(), [{ lane: 0, value: `${index}: ${values[index]}°` }]);
    stack.push(index);
    add("stack.push(i)", "Push · день ожидает", `Индекс ${index} становится вершиной.`);
  }
  index = -1;
  action = undefined;
  add("return result", "Результат", "Для оставшихся в стеке дней потепления нет: ответ 0.", {
    result: [...result],
  });
  return steps;
};
