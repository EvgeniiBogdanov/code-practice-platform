import type { SkillDefinition, SkillStep } from "../types";

const subgroupSteps = (group: string, subgroups: readonly string[]): SkillStep[] =>
  subgroups.map((subgroup) => ({ title: subgroup, match: { group, subgroups: [subgroup] } }));

const ARRAYS = "Массивы";
const FUNCTIONS = "Функции и замыкания";
const OOP = "this, прототипы и классы";
const ASYNC = "Асинхронность";

export const JAVASCRIPT_SKILLS: readonly SkillDefinition[] = [
  {
    id: "js.scope",
    section: "javascript",
    title: "Область видимости",
    requires: [],
    steps: subgroupSteps("Область видимости", [
      "var, let, const",
      "Hoisting и TDZ",
      "Функции и IIFE",
    ]),
  },
  {
    id: "js.types",
    section: "javascript",
    title: "Типы и приведение",
    requires: [],
    steps: subgroupSteps("Типы данных", [
      "Примитивы и ссылки",
      "Приведение типов",
      "Проверка типов",
    ]),
  },
  {
    id: "js.loops",
    section: "javascript",
    title: "Циклы",
    requires: [],
    steps: subgroupSteps("Циклы", ["for", "for of", "for in", "while"]),
  },
  {
    id: "js.strings",
    section: "javascript",
    title: "Строки",
    requires: ["js.loops"],
    steps: subgroupSteps("Строки", ["Базовые операции", "Частотный анализ", "Строки и Unicode"]),
  },
  {
    id: "js.objects",
    section: "javascript",
    title: "Объекты",
    requires: ["js.types"],
    steps: subgroupSteps("Объекты", [
      "Базовый синтаксис",
      "Манипуляции и Утилиты",
      "Копирование и трансформация",
      "Доступ по пути",
      "Дескрипторы и свойства",
      "Метапрограммирование",
      "Безопасность и прототипы",
    ]),
  },
  {
    id: "js.arrays-iter",
    section: "javascript",
    title: "Массивы: перебор и поиск",
    requires: ["js.loops"],
    steps: subgroupSteps(ARRAYS, [
      "includes",
      "find",
      "some, every, findIndex",
      "filter",
      "map",
      "Копирование и изменение массивов",
    ]),
  },
  {
    id: "js.arrays-reduce",
    section: "javascript",
    title: "Массивы: reduce и сортировка",
    requires: ["js.arrays-iter"],
    steps: subgroupSteps(ARRAYS, ["sort", "reduce", "Утилиты массивов"]),
  },
  {
    id: "js.collections",
    section: "javascript",
    title: "Map и Set",
    requires: ["js.objects"],
    steps: subgroupSteps("Коллекции", ["Set", "Map", "WeakMap и WeakSet"]),
  },
  {
    id: "js.closures",
    section: "javascript",
    title: "Замыкания",
    requires: ["js.scope"],
    steps: subgroupSteps(FUNCTIONS, ["Замыкания (База)", "Кеширование и мемоизация"]),
  },
  {
    id: "js.hof",
    section: "javascript",
    title: "Функции высшего порядка",
    requires: ["js.closures"],
    steps: subgroupSteps(FUNCTIONS, [
      "Декораторы и функции высшего порядка",
      "Каррирование",
      "Композиция функций",
    ]),
  },
  {
    id: "js.recursion",
    section: "javascript",
    title: "Рекурсия",
    requires: ["js.objects", "js.loops"],
    steps: subgroupSteps("Рекурсия", [
      "База рекурсии",
      "Массивы и строки",
      "Вложенные структуры",
      "Деревья",
      "Объекты: задачи с собеседований",
    ]),
  },
  {
    id: "js.this",
    section: "javascript",
    title: "this и контекст",
    requires: ["js.closures"],
    steps: subgroupSteps(OOP, ["Контекст this", "call, apply, bind"]),
  },
  {
    id: "js.proto",
    section: "javascript",
    title: "Прототипы",
    requires: ["js.this", "js.objects"],
    steps: subgroupSteps(OOP, ["Прототипы"]),
  },
  {
    id: "js.classes",
    section: "javascript",
    title: "Классы",
    requires: ["js.proto"],
    steps: subgroupSteps(OOP, ["Классы"]),
  },
  {
    id: "js.timers",
    section: "javascript",
    title: "Таймеры",
    requires: ["js.closures"],
    steps: subgroupSteps(ASYNC, ["Таймеры"]),
  },
  {
    id: "js.promise",
    section: "javascript",
    title: "Promise",
    requires: ["js.timers"],
    steps: subgroupSteps(ASYNC, ["Основы Promise", "Комбинаторы", "Обработка ошибок"]),
  },
  {
    id: "js.async",
    section: "javascript",
    title: "async/await и паттерны",
    requires: ["js.promise"],
    steps: subgroupSteps(ASYNC, ["async/await", "Продвинутые паттерны"]),
  },
  {
    id: "js.event-loop",
    section: "javascript",
    title: "Event Loop",
    requires: ["js.timers", "js.promise"],
    steps: subgroupSteps(ASYNC, ["Event Loop"]),
  },
  {
    id: "js.throttle",
    section: "javascript",
    title: "Контроль частоты",
    requires: ["js.hof", "js.timers"],
    steps: subgroupSteps(ASYNC, ["Контроль частоты"]),
  },
  {
    id: "js.polyfills",
    section: "javascript",
    title: "Полифилы",
    requires: ["js.proto", "js.arrays-reduce", "js.promise"],
    steps: [
      { title: "Полифилы массивов", match: { group: ARRAYS, subgroups: ["Полифилы массивов"] } },
      { title: "Полифилы Promise", match: { group: ASYNC, subgroups: ["Полифилы"] } },
    ],
  },
  {
    id: "js.iterators",
    section: "javascript",
    title: "Итераторы и генераторы",
    requires: ["js.loops", "js.collections"],
    steps: subgroupSteps("Итераторы и генераторы", ["Итераторы", "Генераторы"]),
  },
  {
    id: "js.patterns",
    section: "javascript",
    title: "Паттерны проектирования",
    requires: ["js.closures", "js.classes"],
    steps: subgroupSteps("Паттерны проектирования", [
      "Порождающие паттерны",
      "Паттерн Наблюдатель",
      "Реактивность",
    ]),
  },
  {
    id: "js.utils",
    section: "javascript",
    title: "Прикладные утилиты",
    requires: ["js.strings", "js.objects"],
    steps: subgroupSteps("Утилиты", [
      "CSS утилиты",
      "Парсинг URL",
      "Шаблонизация",
      "Регулярные выражения",
    ]),
  },
];
