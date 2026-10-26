import type { DesignTopicGroup } from "../model/types";

/** The groups of the theory in the order they are shown, with the names readers see. */
export const DESIGN_TOPIC_GROUPS: readonly { id: DesignTopicGroup; title: string }[] = [
  { id: "process", title: "Процесс собеседования" },
  { id: "foundation", title: "Фундамент фронтенда" },
  { id: "crosscutting", title: "Сквозные темы" },
];
