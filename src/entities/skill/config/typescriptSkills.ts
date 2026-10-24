import type { SkillDefinition } from "../types";

const groupSkill = (
  id: string,
  title: string,
  group: string,
  requires: readonly string[]
): SkillDefinition => ({
  id,
  section: "typescript",
  title,
  requires,
  steps: [{ title, match: { group } }],
});

export const TYPESCRIPT_SKILLS: readonly SkillDefinition[] = [
  groupSkill("ts.basics", "Основы TypeScript", "Основы TypeScript", []),
  groupSkill("ts.narrowing", "Сужение типов", "Type Narrowing", ["ts.basics"]),
  groupSkill("ts.generics", "Обобщённые типы", "Generics", ["ts.narrowing"]),
  groupSkill("ts.utility", "Служебные типы", "Utility Types", ["ts.generics"]),
  groupSkill("ts.mapped", "Преобразования типов", "Mapped и Conditional Types", ["ts.utility"]),
  groupSkill("ts.patterns", "Прикладные паттерны", "Практические паттерны", [
    "ts.generics",
    "ts.narrowing",
  ]),
  groupSkill("ts.advanced", "Продвинутые типы", "Advanced Types", ["ts.mapped"]),
];
