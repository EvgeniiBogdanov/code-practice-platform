import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildCalculatorTrace,
  buildDecodeStringTrace,
  buildSimplifyPathTrace,
} from "../model/parsingStackTraces";

export const parsingStackDefinitions = {
  algo49: {
    pattern: "Stack · стек директорий",
    invariant:
      "В стеке лежит текущий путь от корня. «..» снимает вершину, «.» и пустые сегменты ничего не меняют.",
    complexity: "O(n) время · O(n) память",
    inputKind: "path",
    inputLabel: "Путь path",
    inputHint: "Абсолютный путь, начинается с /, до 32 символов: латиница, цифры, точки, _ и -.",
    build: buildSimplifyPathTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "/home/"', input: "/home/", isTask: true },
      { id: "task-2", label: 'Пример 2: "/home//foo/"', input: "/home//foo/", isTask: true },
      { id: "task-3", label: 'Пример 3: "/../"', input: "/../", isTask: true },
      {
        id: "task-4",
        label: 'Пример 4: "/a/./b/../../c/"',
        input: "/a/./b/../../c/",
        isTask: true,
      },
      {
        id: "dots",
        label: 'Три точки — имя директории: "/.../a/../b/c/../d/./"',
        input: "/.../a/../b/c/../d/./",
      },
    ],
  },
  algo50: {
    pattern: "Stack · контексты вложенных скобок",
    invariant:
      "При «[» внешний контекст (префикс и множитель) уходит в стек. При «]» контекст возвращается, а внутренняя строка повторяется.",
    complexity: "O(L) время · O(n) память",
    inputKind: "decode",
    inputLabel: "Строка s",
    inputHint:
      "Формат k[строка]: строчные буквы, числа и скобки, до 24 символов. Результат — до 30 символов.",
    build: buildDecodeStringTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "3[a]2[bc]"', input: "3[a]2[bc]", isTask: true },
      { id: "task-2", label: 'Пример 2: "3[a2[c]]"', input: "3[a2[c]]", isTask: true },
      { id: "task-3", label: 'Пример 3: "2[abc]3[cd]ef"', input: "2[abc]3[cd]ef", isTask: true },
      { id: "task-4", label: 'Пример 4: "10[a]"', input: "10[a]", isTask: true },
      { id: "plain", label: 'Без скобок: "abc"', input: "abc" },
    ],
  },
  algo58: {
    pattern: "Stack · слагаемые с приоритетом * и /",
    invariant:
      "* и / сразу применяются к верхнему слагаемому, + и − кладут новое слагаемое со знаком. Ответ — сумма стека.",
    complexity: "O(n) время · O(n) память",
    inputKind: "calc",
    inputLabel: "Выражение s",
    inputHint:
      "Целые числа до 999 и + − * / (пробелы допустимы), до 24 символов. Без деления на 0.",
    build: buildCalculatorTrace,
    examples: [
      { id: "task-1", label: 'Пример 1: "3+2*2"', input: "3+2*2", isTask: true },
      { id: "task-2", label: 'Пример 2: " 3/2 "', input: " 3/2 ", isTask: true },
      { id: "task-3", label: 'Пример 3: " 3+5 / 2 "', input: " 3+5 / 2 ", isTask: true },
      { id: "task-4", label: 'Пример 4: "14-3/2"', input: "14-3/2", isTask: true },
      { id: "chain", label: 'Цепочка: "2*3-4/2+10"', input: "2*3-4/2+10" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
