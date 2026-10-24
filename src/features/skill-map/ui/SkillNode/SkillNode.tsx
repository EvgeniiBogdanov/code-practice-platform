import React, { memo } from "react";
import { clsx } from "clsx";
import {
  SKILL_STATE_META,
  SkillMasteryBar,
  SkillStateIcon,
  formatSkillPercent,
  getSkillToneClass,
  type SkillDefinition,
  type SkillStats,
} from "@/entities/skill";
import { getSkillVisual } from "../../lib/skillVisual";
import { SkillGroupIcon } from "../SkillGroupIcon";
import { getGroupToneClass } from "./skillGroupTone";
import styles from "./SkillNode.module.css";

export interface SkillNodeProps {
  skill: SkillDefinition;
  stats: SkillStats;
  isSelected: boolean;
  /** The card under the pointer, or the open one: its border takes the group colour. */
  isActive: boolean;
  /** Part of the highlighted prerequisite chain. */
  isRelated: boolean;
  /** Outside the chain of the active skill: faded like the edges that leave the chain. */
  isMuted: boolean;
  /** Hidden by the active filter: kept in place so the graph does not jump. */
  isDimmed: boolean;
  onSelect: (skillId: string) => void;
  onHover: (skillId: string | null) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, skillId: string) => void;
  ref?: React.Ref<HTMLButtonElement>;
}

export const SkillNode = memo(
  ({
    skill,
    stats,
    isSelected,
    isActive,
    isRelated,
    isMuted,
    isDimmed,
    onSelect,
    onHover,
    onKeyDown,
    ref,
  }: SkillNodeProps): React.JSX.Element => {
    const percent = formatSkillPercent(stats.mastery);
    const label = SKILL_STATE_META[stats.state].label;
    const groupTone = getGroupToneClass(getSkillVisual(skill).color);

    return (
      <button
        ref={ref}
        type="button"
        data-skill-id={skill.id}
        className={clsx(
          styles.node,
          getSkillToneClass(stats.state),
          groupTone,
          stats.state === "new" && styles.notStarted,
          isRelated && styles.related,
          isActive && styles.active,
          isDimmed && styles.dimmed,
          isMuted && styles.muted
        )}
        aria-pressed={isSelected}
        aria-label={`${skill.title}: ${percent}%, ${label.toLowerCase()}`}
        onClick={(): void => onSelect(skill.id)}
        onMouseEnter={(): void => onHover(skill.id)}
        onMouseLeave={(): void => onHover(null)}
        onFocus={(): void => onHover(skill.id)}
        onBlur={(): void => onHover(null)}
        onKeyDown={(event): void => onKeyDown(event, skill.id)}
      >
        <span className={styles.head}>
          <SkillGroupIcon skill={skill} />
          <span className={styles.name} title={skill.title}>
            {skill.title}
          </span>
          <SkillStateIcon state={stats.state} className={styles.state} />
        </span>
        <SkillMasteryBar mastery={stats.mastery} state={stats.state} title={skill.title} />
        <span className={styles.footer} aria-hidden="true">
          <span className={styles.percent}>{percent}%</span>
          <span className={styles.count}>
            {stats.started}/{stats.total}
          </span>
        </span>
      </button>
    );
  }
);

SkillNode.displayName = "SkillNode";
