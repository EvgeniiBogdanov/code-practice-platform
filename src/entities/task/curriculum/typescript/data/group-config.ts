import { createElement, type ReactElement } from "react";
import {
  Binary,
  Brain,
  Braces,
  Folder,
  Layers,
  Split,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

interface TypeScriptGroupConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
  desc: string;
}

export interface TypeScriptGroupMeta extends TypeScriptGroupConfig {
  renderIcon: (size?: number) => ReactElement;
}

export const TYPESCRIPT_GROUP_CONFIG: Record<string, TypeScriptGroupConfig> = {
  "Основы TypeScript": {
    icon: Binary,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Аннотации, функции, кортежи, any/unknown/never, null, type и interface, структурная типизация, литералы и as const.",
  },
  "Type Narrowing": {
    icon: Split,
    color: "var(--accent-pink)",
    bg: "var(--accent-pink-bg)",
    desc: "typeof, in, instanceof, дискриминируемые объединения, проверка полноты через never, предикаты и функции-утверждения.",
  },
  "Generics": {
    icon: Braces,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Дженерики, ограничения и значения по умолчанию, keyof и индексный доступ, пересечения, satisfies, const-параметры и NoInfer.",
  },
  "Utility Types": {
    icon: Wrench,
    color: "var(--accent-orange)",
    bg: "var(--accent-orange-bg)",
    desc: "Pick, Omit, Record, Exclude, Extract, Partial, Required, Readonly, NonNullable, ReturnType, Parameters и Awaited.",
  },
  "Mapped и Conditional Types": {
    icon: Workflow,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Собственные утилиты на mapped types, условные типы, infer, распределение по объединению, шаблонные строки и переименование ключей.",
  },
  "Практические паттерны": {
    icon: Layers,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Проверка ответов API, классы и репозитории, расширение глобальных типов, перегрузки, события, бренды и builder.",
  },
  "Advanced Types": {
    icon: Brain,
    color: "var(--accent-red)",
    bg: "var(--accent-red-bg)",
    desc: "Рекурсивные типы, разбор строк, операции с кортежами, каррирование, вариантность и UnionToIntersection.",
  },
};

export const getTypeScriptGroupMeta = (groupName: string): TypeScriptGroupMeta => {
  const meta = TYPESCRIPT_GROUP_CONFIG[groupName] ?? {
    icon: Folder,
    color: "var(--color-ts)",
    bg: "var(--color-ts-bg)",
    desc: `Задачи раздела «${groupName}».`,
  };
  return { ...meta, renderIcon: (size = 14): ReactElement => createElement(meta.icon, { size, color: meta.color }) };
};
