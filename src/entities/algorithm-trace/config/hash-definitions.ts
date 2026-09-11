import type { AlgorithmDefinition } from "../model/algorithm-trace";
import {
  buildAnagramTrace,
  buildDuplicateTrace,
  buildGroupAnagramsTrace,
  buildHashTwoSumTrace,
} from "../model/hash-traces";

export const hashDefinitions = {
  algo4: {
    pattern: "Hash Map · поиск дополнения",
    invariant:
      "Map хранит индексы только прошлых элементов: одно число нельзя использовать дважды.",
    complexity: "O(n) время · O(n) память",
    inputKind: "array",
    parameter: "target",
    build: buildHashTwoSumTrace,
    examples: [
      { id: "basic", label: "Поиск дополнения", input: "2, 7, 11, 15", parameter: "9" },
      { id: "same", label: "Одинаковые числа", input: "3, 3", parameter: "6" },
      { id: "none", label: "Пары нет", input: "1, 2, 4", parameter: "8" },
      { id: "empty", label: "Пустой массив", input: "[]", parameter: "0" },
    ],
  },
  algo6: {
    pattern: "Hash Set · ранний выход",
    invariant: "Set хранит уникальные просмотренные числа. Повтор завершает поиск.",
    complexity: "O(n) время · O(n) память",
    inputKind: "array",
    build: buildDuplicateTrace,
    examples: [
      { id: "basic", label: "Повтор в конце", input: "1, 2, 3, 1" },
      { id: "none", label: "Все уникальные", input: "1, 2, 3, 4" },
      { id: "zero", label: "Нули", input: "0, 0" },
      { id: "empty", label: "Пустой массив", input: "[]" },
    ],
  },
  algo5: {
    pattern: "Hash Map · счётчик частот",
    invariant: "Сначала считаем символы s, затем расходуем частоты символами t.",
    complexity: "O(n + m) время · O(Σ) память",
    inputKind: "text",
    parameter: "t",
    inputLabel: "Строка s",
    inputHint: "s и t: до 32 символов ASCII. Регистр и пробелы учитываются.",
    build: buildAnagramTrace,
    examples: [
      { id: "basic", label: "Анаграммы", input: "anagram", parameter: "nagaram" },
      { id: "false", label: "Лишний символ", input: "rat", parameter: "car" },
      { id: "count", label: "Разные частоты", input: "aab", parameter: "abb" },
      { id: "length", label: "Разные длины", input: "ab", parameter: "a" },
      { id: "empty", label: "Пустые строки", input: "", parameter: "" },
    ],
  },
  algo7: {
    pattern: "Hash Map · группировка по ключу",
    invariant: "Отсортированные символы — общий ключ всех анаграмм в группе.",
    complexity: "O(n · m log m) время · O(n · m) память",
    inputKind: "words",
    inputLabel: "Массив строк",
    inputHint: "JSON: до 16 строк ASCII, до 8 символов в каждой. Регистр учитывается.",
    build: buildGroupAnagramsTrace,
    examples: [
      { id: "basic", label: "Три группы", input: '["eat", "tea", "tan", "ate", "nat", "bat"]' },
      { id: "same", label: "Повторы и пустые слова", input: '["", "a", "", "a"]' },
      { id: "empty", label: "Пустой массив", input: "[]" },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
