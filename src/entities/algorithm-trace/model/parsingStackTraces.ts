import type {
  AlgorithmInput,
  TracePanel,
  TraceStackAction,
  TraceStackLane,
  TraceStep,
} from "./algorithmTrace";
import { createTraceRecorder } from "../lib/traceRecorder";
import { stackAction, stackScene, tracePanel } from "./structureScene";

const balance = (label: string, entries: readonly [string, string, boolean?][]): TracePanel => ({
  kind: "balance",
  label,
  entries: entries.map(([key, value, active]) => ({ key, value, active: Boolean(active) })),
});
const showChar = (char: string): string => (char === " " ? "␣" : char);
const inputPanel = (text: string, index: number): TracePanel =>
  tracePanel(
    "Вход · текущий символ",
    [...text].map((char, i) => (i === index ? `▶ ${showChar(char)}` : showChar(char))),
    index
  );

export const buildSimplifyPathTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const parts = text.split("/");
  const stack: string[] = [];
  let index = -1;
  let action: TraceStackAction | undefined;
  const lanes = (): TraceStackLane[] => [{ label: "stack · директории", values: [...stack] }];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: stackScene(lanes(), action),
    panels: [
      tracePanel(
        'Сегменты · split("/")',
        parts.map((part) => (part === "" ? '""' : part)),
        index
      ),
    ],
  }));
  add(
    "const stack = []",
    "Пустой стек",
    "Стек хранит директории от корня. Путь собирается из него в самом конце."
  );
  parts.forEach((part, at) => {
    index = at;
    action = undefined;
    add(
      'for (const part of path.split("/"))',
      "Следующий сегмент",
      `Сегмент ${at + 1} из ${parts.length}: ${part === "" ? '"" (пустой)' : JSON.stringify(part)}.`
    );
    const service = part === "" || part === ".";
    add(
      'if (part === "" || part === ".")',
      service ? "Служебный сегмент" : "Обычный сегмент",
      service
        ? `${part === "" ? "Пустой сегмент (двойной или крайний слэш)" : "«.» — текущая директория"} ничего не меняет.`
        : `${JSON.stringify(part)} — не пустой и не «.».`
    );
    if (service) {
      add("continue", "Пропускаем", "Стек остаётся прежним.");
      return;
    }
    add(
      'if (part === "..")',
      part === ".." ? "Шаг назад" : "Новая директория",
      part === ".."
        ? "«..» поднимает на уровень выше."
        : `${JSON.stringify(part)} — имя директории, включая «...».`
    );
    if (part === "..") {
      action = stackAction("pop", lanes(), stack.length ? [{ lane: 0, value: stack.at(-1)! }] : []);
      const removed = stack.pop();
      add(
        "stack.pop()",
        "Pop · выходим из директории",
        removed === undefined
          ? "Стек пуст: мы уже в корне, подняться выше нельзя. pop() на пустом стеке безопасен."
          : `Убираем ${removed}: возвращаемся на уровень выше.`
      );
    } else {
      action = stackAction("push", lanes(), [{ lane: 0, value: part }]);
      stack.push(part);
      add("stack.push(part)", "Push · входим в директорию", `${part} становится вершиной стека.`);
    }
  });
  index = -1;
  action = undefined;
  const path = `/${stack.join("/")}`;
  add('return "/" + stack.join("/")', "Собираем путь", `Склеиваем директории из стека: ${path}.`, {
    result: path,
    formula: `"/" + [${stack.join(", ")}].join("/")`,
  });
  return steps;
};

interface DecodeFrame {
  readonly prefix: string;
  readonly count: number;
}

export const buildDecodeStringTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const frames: DecodeFrame[] = [];
  let current = "";
  let count = 0;
  let index = -1;
  let action: TraceStackAction | undefined;
  const frameLabel = (frame: DecodeFrame): string =>
    `${JSON.stringify(frame.prefix)} ×${frame.count}`;
  const lanes = (): TraceStackLane[] => [
    { label: "stack · [префикс, ×k]", values: frames.map(frameLabel) },
    { label: "current", values: [JSON.stringify(current)] },
  ];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: stackScene(lanes(), action),
    panels: [
      inputPanel(text, index),
      balance("Накопитель", [
        ["count", String(count), count > 0],
        ["current", JSON.stringify(current), true],
      ]),
    ],
  }));
  add(
    "const stack = []",
    "Стек контекстов",
    "При «[» мы откладываем в стек уже собранную строку и множитель, а внутри начинаем с чистого листа."
  );
  for (index = 0; index < text.length; index++) {
    const char = text[index];
    action = undefined;
    add(
      "for (const char of s)",
      "Читаем символ",
      `Символ ${JSON.stringify(char)}, индекс ${index}.`
    );
    const digit = char >= "0" && char <= "9";
    add(
      'if (char >= "0" && char <= "9")',
      digit ? "Цифра" : "Не цифра",
      digit
        ? "Множитель может быть многозначным: накапливаем по цифрам."
        : `${JSON.stringify(char)} — не цифра, проверяем скобки.`
    );
    if (digit) {
      count = count * 10 + Number(char);
      add("count = count * 10 + Number(char)", "Накапливаем множитель", `count = ${count}.`, {
        formula: `${Math.floor(count / 10)} × 10 + ${char} = ${count}`,
      });
    } else if (char === "[") {
      add('else if (char === "[")', "Открываем уровень", "Откладываем внешний контекст в стек.");
      const frame: DecodeFrame = { prefix: current, count };
      action = stackAction("push", lanes(), [{ lane: 0, value: frameLabel(frame) }]);
      frames.push(frame);
      add(
        "stack.push([current, count])",
        "Push · откладываем контекст",
        `В стек: префикс ${JSON.stringify(current)} и множитель ×${count}.`
      );
      action = undefined;
      current = "";
      count = 0;
      add('current = ""', "Чистый лист", "Внутри скобок собираем строку заново.", {
        occurrence: 1,
      });
    } else if (char === "]") {
      add(
        'else if (char === "]")',
        "Закрываем уровень",
        "Достаём внешний контекст и повторяем накопленную строку."
      );
      const frame = frames.at(-1)!;
      action = stackAction("pop", lanes(), [{ lane: 0, value: frameLabel(frame) }]);
      frames.pop();
      add(
        "const [previous, times] = stack.pop()",
        "Pop · возвращаем контекст",
        `Извлекли префикс ${JSON.stringify(frame.prefix)} и множитель ×${frame.count}.`
      );
      const repeated = current.repeat(frame.count);
      action = undefined;
      const before = current;
      current = frame.prefix + repeated;
      add(
        "current = previous + current.repeat(times)",
        "Склеиваем",
        `${JSON.stringify(frame.prefix)} + ${JSON.stringify(before)} × ${frame.count} = ${JSON.stringify(current)}.`,
        {
          formula: `${JSON.stringify(frame.prefix)} + ${JSON.stringify(before)}.repeat(${frame.count})`,
        }
      );
    } else {
      add("} else {", "Обычная буква", "Не цифра и не скобка: дописываем в current.");
      current += char;
      action = stackAction("peek", lanes(), [{ lane: 1, value: JSON.stringify(current) }]);
      add("current += char", "Дописываем символ", `current = ${JSON.stringify(current)}.`);
    }
  }
  index = -1;
  action = undefined;
  add("return current", "Результат", `Раскодированная строка: ${JSON.stringify(current)}.`, {
    result: current,
  });
  return steps;
};

export const buildCalculatorTrace = ({ text }: AlgorithmInput): readonly TraceStep[] => {
  const stack: number[] = [];
  let number = 0;
  let operator = "+";
  let index = -1;
  let action: TraceStackAction | undefined;
  const lanes = (): TraceStackLane[] => [{ label: "stack · слагаемые", values: [...stack] }];
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: stackScene(lanes(), action),
    panels: [
      inputPanel(text, index),
      balance("Состояние разбора", [
        ["number", String(number), true],
        ["operator", operator, true],
      ]),
    ],
  }));
  add(
    "const stack = []",
    "Стек слагаемых",
    "* и / сразу применяются к верхнему слагаемому, а + и − кладут новое слагаемое со знаком."
  );
  for (index = 0; index <= text.length; index++) {
    const char = text[index];
    action = undefined;
    add(
      "for (let i = 0; i <= s.length; i++)",
      index === text.length ? "Конец строки" : "Читаем символ",
      index === text.length
        ? "i = s.length: char = undefined. Этот шаг применяет последний оператор к последнему числу."
        : `Символ ${JSON.stringify(char)}, индекс ${index}.`
    );
    add(
      "const char = s[i]",
      "Берём символ",
      char === undefined ? "s[i] = undefined." : `char = ${JSON.stringify(char)}.`
    );
    const digit = char !== undefined && char >= "0" && char <= "9";
    add(
      'if (char >= "0" && char <= "9")',
      digit ? "Цифра" : "Не цифра",
      digit ? "Накапливаем число по цифрам." : "Это пробел, оператор или конец строки."
    );
    if (digit) {
      number = number * 10 + Number(char);
      add("number = number * 10 + Number(char)", "Накапливаем число", `number = ${number}.`, {
        formula: `${Math.floor(number / 10)} × 10 + ${char} = ${number}`,
      });
      continue;
    }
    const space = char === " ";
    add(
      'else if (char !== " ")',
      space ? "Пробел" : "Оператор или конец",
      space
        ? "Пробелы не влияют на вычисление."
        : `Число ${number} закончено: применяем предыдущий оператор «${operator}».`
    );
    if (space) continue;
    if (operator === "+") {
      add('if (operator === "+")', "Оператор +", `Кладём ${number} как новое слагаемое.`);
      action = stackAction("push", lanes(), [{ lane: 0, value: number }]);
      stack.push(number);
      add("stack.push(number)", "Push · слагаемое", `В стек: ${number}.`);
    } else if (operator === "-") {
      add('else if (operator === "-")', "Оператор −", `Кладём ${-number} (слагаемое со знаком).`);
      action = stackAction("push", lanes(), [{ lane: 0, value: -number }]);
      stack.push(-number);
      add("stack.push(-number)", "Push · слагаемое со знаком", `В стек: ${-number}.`);
    } else {
      const top = stack.at(-1)!;
      const result = operator === "*" ? top * number : Math.trunc(top / number);
      add(
        operator === "*" ? 'else if (operator === "*")' : "} else {",
        operator === "*" ? "Оператор *" : "Оператор /",
        `${operator === "*" ? "Умножаем" : "Делим (округляя к нулю)"} верхнее слагаемое ${top} на ${number}.`
      );
      const line =
        operator === "*"
          ? "stack.push(stack.pop() * number)"
          : "stack.push(Math.trunc(stack.pop() / number))";
      action = stackAction("pop", lanes(), [{ lane: 0, value: top }]);
      stack.pop();
      add(line, "Pop · берём вершину", `stack.pop() вернул ${top}.`);
      action = stackAction("push", lanes(), [{ lane: 0, value: result }]);
      stack.push(result);
      add(
        line,
        "Push · результат",
        `${top} ${operator} ${number} = ${result}: результат занимает место вершины.`,
        { formula: `${top} ${operator} ${number} = ${result}` }
      );
    }
    action = undefined;
    if (char !== undefined) {
      operator = char;
      add(
        "operator = char",
        "Запоминаем оператор",
        `Следующее число будет обработано оператором «${operator}».`
      );
      number = 0;
      add("number = 0", "Сбрасываем число", "Начинаем читать следующее число.", { occurrence: 1 });
    }
  }
  index = -1;
  action = undefined;
  const total = stack.reduce((sum, term) => sum + term, 0);
  add(
    "return stack.reduce",
    "Суммируем слагаемые",
    `Сумма стека: ${stack.join(" + ") || "0"} = ${total}.`,
    { result: total, formula: `${stack.join(" + ")} = ${total}` }
  );
  return steps;
};
