import { SKILL_STATE_META, type SkillTone } from "../lib/skillStateMeta";
import type { SkillState } from "../types";
import styles from "./skillTone.module.css";

/** Class that exposes `--skill-tone`, `--skill-tone-bg` and `--skill-tone-border`. */
export const getToneClass = (tone: SkillTone): string => styles[tone];

export const getSkillToneClass = (state: SkillState): string =>
  getToneClass(SKILL_STATE_META[state].tone);
