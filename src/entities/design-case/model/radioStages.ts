import type { RadioStageId } from "./types";

export interface RadioStageMeta {
  id: RadioStageId;
  title: string;
  /** The question the stage answers. */
  hint: string;
}

export const RADIO_STAGES: readonly RadioStageMeta[] = [
  { id: "requirements", title: "Требования", hint: "Что строим и для кого" },
  { id: "architecture", title: "Архитектура", hint: "Из каких частей состоит решение" },
  { id: "data-model", title: "Модель данных", hint: "Какие данные и где они живут" },
  { id: "interface", title: "Интерфейс", hint: "API и контракты компонентов" },
  {
    id: "optimizations",
    title: "Оптимизации",
    hint: "Производительность, доступность, надёжность",
  },
];
