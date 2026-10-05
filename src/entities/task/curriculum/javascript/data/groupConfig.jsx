import React from "react";
import {
  Variable,
  Binary,
  Repeat,
  Box,
  Layers,
  CaseSensitive,
  Boxes,
  Lock,
  GitMerge,
  Crown,
  Infinity as InfinityIcon,
  Zap,
  Workflow,
  FileCode,
  Folder,
} from "lucide-react";

export const JS_GROUP_CONFIG = {
  "Область видимости": {
    icon: Variable,
    color: "var(--accent-amber)",
    bg: "var(--accent-amber-bg)",
    desc: "var, let и const, цепочка областей видимости, hoisting, TDZ, виды функций, параметры и IIFE.",
  },
  "Типы данных": {
    icon: Binary,
    color: "var(--accent-yellow-icon)",
    bg: "var(--accent-yellow-bg)",
    desc: "Типы данных, примитивы и ссылки, неявное приведение типов, сравнения (== vs ===).",
  },
  "Циклы": {
    icon: Repeat,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Задачи на циклы for, for...of, for...in, while и алгоритмы итерации.",
  },
  "Объекты": {
    icon: Box,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Синтаксис объектов, операции со свойствами, доступ по пути, дескрипторы, Proxy и безопасность.",
  },
  "Массивы": {
    icon: Layers,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Методы массивов, мутирующие и неизменяемые операции, утилиты и полифилы.",
  },
  "Строки": {
    icon: CaseSensitive,
    color: "var(--accent-red)",
    bg: "var(--accent-red-bg)",
    desc: "Базовые операции со строками, частотный анализ, сжатие и работа с Unicode.",
  },
  "Коллекции": {
    icon: Boxes,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Map, Set, WeakMap и WeakSet: частотные словари, операции над множествами, LRU-кэш.",
  },
  "Функции и замыкания": {
    icon: Lock,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Замыкания, декораторы, частичное применение, каррирование, композиция функций и мемоизация.",
  },
  "Рекурсия": {
    icon: GitMerge,
    color: "var(--accent-orange)",
    bg: "var(--accent-orange-bg)",
    desc: "Рекурсивные функции, базовые случаи, обход деревьев и вложенных объектов.",
  },
  "this, прототипы и классы": {
    icon: Crown,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Правила this, call/apply/bind, прототипное наследование, new, instanceof и классы.",
  },
  "Итераторы и генераторы": {
    icon: InfinityIcon,
    color: "var(--accent-gray)",
    bg: "var(--accent-gray-bg)",
    desc: "Протокол итератора, Symbol.iterator, генераторы и асинхронные генераторы.",
  },
  "Асинхронность": {
    icon: Zap,
    color: "var(--accent-pink)",
    bg: "var(--accent-pink-bg)",
    desc: "Таймеры, Promise, async/await, обработка ошибок, Event Loop, полифилы и контроль частоты.",
  },
  "Паттерны проектирования": {
    icon: Workflow,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Паттерны проектирования: Singleton, Observer (EventEmitter) и реактивные сигналы.",
  },
  "Утилиты": {
    icon: FileCode,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Прикладные утилиты: classnames, парсинг URL, шаблонизация и токенизация строк.",
  },
};

export const getGroupMeta = (groupName) => {
  if (JS_GROUP_CONFIG[groupName]) {
    const meta = JS_GROUP_CONFIG[groupName];
    const IconComponent = meta.icon;
    return {
      ...meta,
      renderIcon: (size = 14) => (
        <IconComponent size={size} color={meta.color} />
      ),
    };
  }

  const meta = {
    icon: Folder,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: `Задачи раздела «${groupName}».`,
  };
  const IconComponent = meta.icon;

  return {
    ...meta,
    renderIcon: (size = 14) => (
      <IconComponent size={size} color={meta.color} />
    ),
  };
};

export default getGroupMeta;
