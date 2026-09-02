import React from "react";
import {
  Repeat,
  Layers,
  Clock,
  Boxes,
  Zap,
  Lock,
  GitMerge,
  Crown,
  Sparkles,
  Sliders,
  Workflow,
  Activity,
  FileCode,
  Box,
  Folder,
  Binary,
} from "lucide-react";

export const JS_GROUP_CONFIG = {
  "Типы данных": {
    icon: Binary,
    color: "var(--accent-yellow)",
    bg: "var(--accent-yellow-bg)",
    desc: "Типы данных, неявное приведение типов, сравнения (== vs ===) и ссылочная модель.",
  },
  "Циклы": {
    icon: Repeat,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Задачи на циклы for, while, for...of, for...in и алгоритмы итерации.",
  },
  "Объекты": {
    icon: Box,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Синтаксис объектов, операции со свойствами, деструктуризация, методы Object и реальные задачи с собеседований.",
  },
  "Массивы": {
    icon: Layers,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Методы массивов, поиск, фильтрация, трансформация и агрегация данных.",
  },
  "Коллекции": {
    icon: Boxes,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Структуры данных Map и Set в JavaScript, частотные словари и дедупликация.",
  },
  "Замыкания": {
    icon: Lock,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Замыкания, лексическое окружение, каррирование, композиция функций и мемоизация.",
  },
  "Рекурсия": {
    icon: GitMerge,
    color: "var(--accent-orange)",
    bg: "var(--accent-orange-bg)",
    desc: "Рекурсивные функции, базовые случаи, обход деревьев и графов.",
  },
  "Прототипы THIS": {
    icon: Crown,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Контекст вызова this, привязка контекста, прототипное наследование и классы.",
  },
  "Асинхронность": {
    icon: Zap,
    color: "var(--accent-pink)",
    bg: "var(--accent-pink-bg)",
    desc: "Таймеры, контроль частоты, Event Loop, Promise, async/await, полифилы и очереди задач.",
  },
  "Строки и Утилиты": {
    icon: FileCode,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Алгоритмы обработки строк, форматирование, шаблонизация и парсинг.",
  },
  "Паттерны проектирования": {
    icon: Workflow,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Паттерны проектирования, Singleton, Observer, Factory, PubSub и сигналы.",
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
