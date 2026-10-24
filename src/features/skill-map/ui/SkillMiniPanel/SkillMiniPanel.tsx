import React, { memo } from "react";
import { clsx } from "clsx";
import { Maximize2 } from "lucide-react";
import {
  SkillStateIcon,
  formatSkillPercent,
  getSkillById,
  getSkillToneClass,
  type SkillStats,
} from "@/entities/skill";
import styles from "./SkillMiniPanel.module.css";

export interface SkillMiniPanelProps {
  skillId: string;
  stats: ReadonlyMap<string, SkillStats>;
  onExpand: () => void;
}

/** A collapsed skill panel: title and mastery stay visible while the map is in use. */
export const SkillMiniPanel = memo(
  ({ skillId, stats, onExpand }: SkillMiniPanelProps): React.JSX.Element | null => {
    const skill = getSkillById(skillId);
    const skillStats = stats.get(skillId);
    if (!skill || !skillStats) return null;

    return (
      <button
        type="button"
        className={styles.mini}
        aria-label={`Открыть панель навыка: ${skill.title}`}
        onClick={onExpand}
      >
        <SkillStateIcon state={skillStats.state} size={16} />
        <span className={styles.title}>{skill.title}</span>
        <span className={clsx(styles.percent, getSkillToneClass(skillStats.state))}>
          {formatSkillPercent(skillStats.mastery)}%
        </span>
        <Maximize2 size={14} aria-hidden="true" className={styles.icon} />
      </button>
    );
  }
);

SkillMiniPanel.displayName = "SkillMiniPanel";
