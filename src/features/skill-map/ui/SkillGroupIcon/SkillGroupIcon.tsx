import React from "react";
import type { SkillDefinition } from "@/entities/skill";
import { getSkillVisual } from "../../lib/skillVisual";
import styles from "./SkillGroupIcon.module.css";

export interface SkillGroupIconProps {
  skill: SkillDefinition;
  size?: number;
}

/** The skill's curriculum group, drawn with the group's own icon and colour as the sidebar does. Decorative: the name is next to it. */
export const SkillGroupIcon = ({ skill, size = 14 }: SkillGroupIconProps): React.JSX.Element => (
  <span className={styles.icon} aria-hidden="true">
    {getSkillVisual(skill, size).icon}
  </span>
);
