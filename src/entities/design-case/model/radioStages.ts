import type { RadioStageId } from "./types";

export interface RadioStageMeta {
  id: RadioStageId;
  /** The letter of the RADIO abbreviation. */
  letter: string;
  title: string;
  /** The question the stage answers. */
  hint: string;
}

export const RADIO_STAGES: readonly RadioStageMeta[] = [
  { id: "requirements", letter: "R", title: "Требования", hint: "Что строим и для кого" },
  {
    id: "architecture",
    letter: "A",
    title: "Архитектура",
    hint: "Из каких частей состоит решение",
  },
  { id: "data-model", letter: "D", title: "Модель данных", hint: "Какие данные и где они живут" },
  { id: "interface", letter: "I", title: "Интерфейс", hint: "API и контракты компонентов" },
  {
    id: "optimizations",
    letter: "O",
    title: "Оптимизации",
    hint: "Производительность, доступность, надёжность",
  },
];
