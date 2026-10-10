import type { AlgorithmDefinition } from "../model/algorithmTrace";
import {
  buildBracketsTrace,
  buildAdjacentTrace,
  buildMinStackTrace,
  buildTemperaturesTrace,
} from "../model/stackTraces";

export const stackDefinitions = {
  algo18: {
    pattern: "Stack · парные скобки",
    invariant: "Вершина — ближайшая ожидаемая закрывающая скобка.",
    complexity: "O(n) время · O(n) память",
    inputKind: "brackets",
    inputLabel: "Скобки",
    inputHint: "До 32 символов () [] {}. Стек хранит ожидаемые закрытия.",
    examples: [
      { id: "task-1", label: 'Пример 1: "{[()]}" (вложенные)', input: "{[()]}", isTask: true },
      { id: "task-2", label: 'Пример 2: "([)]" (перекрёст)', input: "([)]", isTask: true },
      { id: "task-3", label: 'Пример 3: "((" (не закрыты)', input: "((", isTask: true },
      { id: "task-4", label: 'Пример 4: "[]{}()" (пары подряд)', input: "[]{}()", isTask: true },
      {
        id: "nested",
        label: "Вложенные пары ({[()]})",
        input: "{[()]}",
      },
      {
        id: "unclosed",
        label: "Незакрытая скобка (()",
        input: "(()",
      },
      {
        id: "empty",
        label: "Пустая строка",
        input: "",
      },
    ],
    build: buildBracketsTrace,
  },
  algo40: {
    pattern: "Stack · сокращение соседних пар",
    invariant: "Стек содержит обработанную часть строки без соседних дубликатов.",
    complexity: "O(n) время · O(n) память",
    inputKind: "text",
    inputLabel: "Строка",
    inputHint: "До 32 символов ASCII; одинаковые соседние символы сокращаются.",
    examples: [
      { id: "task-1", label: 'Пример 1: "baab" (исчезает целиком)', input: "baab", isTask: true },
      { id: "task-2", label: 'Пример 2: "xyyxz" (каскад)', input: "xyyxz", isTask: true },
      { id: "task-3", label: 'Пример 3: "hello"', input: "hello", isTask: true },
      { id: "task-4", label: 'Пример 4: "q"', input: "q", isTask: true },
      {
        id: "all",
        label: "Полное удаление (abba)",
        input: "abba",
      },
      {
        id: "empty",
        label: "Пустая строка",
        input: "",
      },
    ],
    build: buildAdjacentTrace,
  },
  algo19: {
    pattern: "Stack · минимум на каждой глубине",
    invariant: "Основной стек и стек минимумов имеют одинаковую глубину после каждой операции.",
    complexity: "O(1) на операцию · O(n) память",
    inputKind: "operations",
    inputLabel: "Операции JSON",
    inputHint:
      'До 24 операций: ["push", число], ["pop"], ["top"], ["getMin"]. Чтение и pop требуют непустой стек.',
    examples: [
      {
        id: "task-1",
        label: "Пример 1: push(5, 2, 7), getMin, pop, top, pop, getMin",
        input: '[["push",5],["push",2],["push",7],["getMin"],["pop"],["top"],["pop"],["getMin"]]',
        isTask: true,
      },
      {
        id: "repeat",
        label: "Повторный минимум (push 2, push 2, pop, getMin)",
        input: '[["push",2],["push",2],["pop"],["getMin"]]',
      },
      {
        id: "empty",
        label: "Без операций",
        input: "[]",
      },
    ],
    build: buildMinStackTrace,
  },
  algo20: {
    pattern: "Stack · монотонный стек",
    invariant: "В стеке индексы дней без ответа; температуры снизу вверх не возрастают.",
    complexity: "O(n) время · O(n) память",
    inputKind: "array",
    inputLabel: "Температуры",
    inputHint: "До 16 целых чисел. На плитке стека: индекс и температура.",
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [18, 16, 20, 15, 17, 21]",
        input: "18,16,20,15,17,21",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: [25, 24, 23] (убывающие)",
        input: "25,24,23",
        isTask: true,
      },
      { id: "task-3", label: "Пример 3: [10, 12]", input: "10,12", isTask: true },
      {
        id: "cooling",
        label: "Похолодание (90, 80, 70)",
        input: "90,80,70",
      },
      {
        id: "same",
        label: "Одинаковые (30, 30, 30)",
        input: "30,30,30",
      },
      {
        id: "empty",
        label: "Пустой массив",
        input: "[]",
      },
    ],
    build: buildTemperaturesTrace,
  },
} satisfies Record<string, AlgorithmDefinition>;
