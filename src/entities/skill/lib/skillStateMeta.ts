import type { SkillState } from "../types";

export type SkillTone = "danger" | "warning" | "accent" | "success" | "neutral";

export interface SkillStateMeta {
  label: string;
  tone: SkillTone;
}

export const SKILL_STATE_META: Readonly<Record<SkillState, SkillStateMeta>> = {
  weak: { label: "Слабое место", tone: "danger" },
  fading: { label: "Угасает", tone: "warning" },
  new: { label: "Не начат", tone: "neutral" },
  intro: { label: "Знакомство", tone: "accent" },
  practice: { label: "Практика", tone: "accent" },
  confident: { label: "Уверенно", tone: "success" },
  master: { label: "Мастер", tone: "success" },
};

/** Mastery as a whole percent; any started progress shows at least 1%. */
export const formatSkillPercent = (mastery: number): number =>
  mastery > 0 ? Math.max(1, Math.round(mastery * 100)) : 0;
