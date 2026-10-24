import type { SkillDefinition } from "../types";

// React groups are formats and levels ("Разминка", "Рефакторинг"), not topics, so every task is
// placed by hand: a refactoring task belongs to the topic it trains.
const taskSkill = (
  id: string,
  title: string,
  requires: readonly string[],
  taskIds: readonly string[]
): SkillDefinition => ({
  id,
  section: "react",
  title,
  requires,
  steps: [{ title, match: { taskIds } }],
});

export const REACT_SKILLS: readonly SkillDefinition[] = [
  taskSkill(
    "react.state",
    "Состояние и события",
    [],
    [
      "w1",
      "w5",
      "w6",
      "w7",
      "w4",
      "w2",
      "w3",
      "w8",
      "w9",
      "w10",
      "w11",
      "w25",
      "w12",
      "w26",
      "w30",
      "w32",
      "w34",
      "r1",
    ]
  ),
  taskSkill(
    "react.effects",
    "Эффекты и синхронизация",
    ["react.state", "js.closures"],
    ["w15", "w27", "w28", "r2", "r8", "18", "a11", "a4", "a5"]
  ),
  taskSkill(
    "react.render",
    "Рендер и производительность",
    ["react.state"],
    ["w18", "w19", "w20", "w21", "r10", "r3", "r4", "r5", "r18", "r20", "a9", "a10"]
  ),
  taskSkill("react.refs", "Refs и DOM", ["react.state"], ["w22", "w23", "w24", "r12", "r11", "20"]),
  taskSkill("react.forms", "Формы и Actions", ["react.state"], ["19", "12", "26"]),
  taskSkill(
    "react.patterns",
    "Композиция и UI-паттерны",
    ["react.state"],
    [
      "w31",
      "w35",
      "r19",
      "r13",
      "r15",
      "r16",
      "r17",
      "6",
      "9",
      "16",
      "21",
      "24",
      "25",
      "13",
      "14",
      "17",
    ]
  ),
  taskSkill(
    "react.data",
    "Загрузка данных",
    ["react.effects", "js.promise"],
    ["w13", "w14", "w16", "w17", "r6", "r7", "11", "10", "5", "51", "23", "22", "15", "52"]
  ),
  taskSkill(
    "react.state-mgmt",
    "Управление состоянием",
    ["react.state"],
    ["w33", "a1", "a6", "a7", "a12", "a2", "a3", "a8"]
  ),
  taskSkill(
    "react.ts",
    "TypeScript в React",
    ["react.patterns", "ts.generics"],
    [
      "ts3",
      "ts5",
      "ts6",
      "ts8",
      "ts12",
      "ts1",
      "ts4",
      "ts7",
      "ts9",
      "ts10",
      "ts2",
      "ts11",
      "tsp1",
      "tsp3",
      "tsp2",
    ]
  ),
];
