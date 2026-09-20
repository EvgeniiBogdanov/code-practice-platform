import { createElement, type ReactElement } from "react";
import { Binary, Braces, Wrench, Workflow, Layers, Folder, type LucideIcon } from "lucide-react";

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
  "Основы типизации": {
    icon: Binary,
    color: "var(--accent-blue)",
    bg: "var(--accent-blue-bg)",
    desc: "Аннотации, кортежи, интерфейсы, литеральные объединения, сужение типов и перечисления.",
  },
  "Обобщённые и составные типы": {
    icon: Braces,
    color: "var(--accent-purple)",
    bg: "var(--accent-purple-bg)",
    desc: "Связь аргументов и результата через generics, keyof, индексный доступ и пересечения типов.",
  },
  "Служебные типы": {
    icon: Wrench,
    color: "var(--accent-orange)",
    bg: "var(--accent-orange-bg)",
    desc: "Преобразование готовых моделей с помощью Pick, Omit, Record, Partial, Exclude, Extract, ReturnType и Parameters.",
  },
  "Преобразования типов": {
    icon: Workflow,
    color: "var(--accent-cyan)",
    bg: "var(--accent-cyan-bg)",
    desc: "Mapped types, условные типы, infer, шаблонные строки и дискриминируемые объединения.",
  },
  "Прикладные паттерны": {
    icon: Layers,
    color: "var(--accent-green)",
    bg: "var(--accent-green-bg)",
    desc: "Типизация запросов, классов, перегрузок, событий, вложенных обновлений и идентификаторов.",
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
