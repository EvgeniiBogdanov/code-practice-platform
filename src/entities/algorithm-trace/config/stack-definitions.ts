import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildBracketsTrace,
  buildAdjacentTrace,
  buildMinStackTrace,
  buildTemperaturesTrace,
} from "../model/stack-traces";

export const stackDefinitions = {
  algo18: {
    pattern: "Stack · парные скобки",
    invariant: "Вершина — ближайшая ожидаемая закрывающая скобка.",
    complexity: "O(n) время · O(n) память",
    inputKind: "brackets",
    inputLabel: "Скобки",
    inputHint: "До 32 символов () [] {}. Стек хранит ожидаемые закрытия.",
    examples: [
      {
        id: "task1",
        label: 'Пример 1: "()" (пара круглых)',
        input: "()",
        isTask: true,
      },
      {
        id: "task2",
        label: 'Пример 2: "()[]{}" (три пары подряд)',
        input: "()[]{}",
        isTask: true,
      },
      {
        id: "task3",
        label: 'Пример 3: "(]" (несоответствие типов)',
        input: "(]",
        isTask: true,
      },
      {
        id: "task4",
        label: 'Пример 4: "([])" (вложенная пара)',
        input: "([])",
        isTask: true,
      },
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
      {
        id: "task1",
        label: 'Пример 1: "abbaca" (каскадное удаление)',
        input: "abbaca",
        isTask: true,
      },
      {
        id: "task2",
        label: 'Пример 2: "azxxzy" (схлопывание к центру)',
        input: "azxxzy",
        isTask: true,
      },
      {
        id: "task3",
        label: 'Пример 3: "a" (один символ)',
        input: "a",
        isTask: true,
      },
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
        id: "task1",
        label: "Пример 1: push(-2, 0, -3), getMin, pop, top, getMin",
        input: '[["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]',
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
        id: "task1",
        label: "Пример 1: [73, 74, 75, 71, 69, 72, 76, 73]",
        input: "73,74,75,71,69,72,76,73",
        isTask: true,
      },
      {
        id: "task2",
        label: "Пример 2: [30, 40, 50, 60] (возрастающие)",
        input: "30,40,50,60",
        isTask: true,
      },
      {
        id: "task3",
        label: "Пример 3: [30, 60, 90]",
        input: "30,60,90",
        isTask: true,
      },
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
