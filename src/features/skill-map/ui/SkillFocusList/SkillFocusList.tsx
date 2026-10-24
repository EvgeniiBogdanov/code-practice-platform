import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import {
  SKILL_MAP_ROUTES,
  SkillStateIcon,
  formatSkillPercent,
  getSkillById,
  getSkillToneClass,
  type SkillDefinition,
  type SkillStats,
} from "@/entities/skill";
import { SkillGroupIcon } from "../SkillGroupIcon";
import { buttonClassName } from "@/shared/ui";
import { getShortTaskTitle, getSkillTaskHref } from "../../lib/skillTaskMeta";
import type { SkillFocusItem } from "../../model/skillFocus";
import { SkillReasonList } from "../SkillReasonList/SkillReasonList";
import styles from "./SkillFocusList.module.css";

export interface SkillFocusListProps {
  items: readonly SkillFocusItem[];
  stats: ReadonlyMap<string, SkillStats>;
  /** «rows» — a compact list on the skill map; «cards» — the home page block. */
  variant: "rows" | "cards";
  /** Opens the skill on the map; without it the skill name links to the map page. */
  onSelectSkill?: (skillId: string) => void;
}

const SkillName = ({
  skill,
  onSelectSkill,
}: {
  skill: SkillDefinition;
  onSelectSkill?: (skillId: string) => void;
}): React.JSX.Element =>
  onSelectSkill ? (
    <button type="button" className={styles.name} onClick={(): void => onSelectSkill(skill.id)}>
      {skill.title}
    </button>
  ) : (
    <Link to={SKILL_MAP_ROUTES[skill.section]} search={{ skill: skill.id }} className={styles.name}>
      {skill.title}
    </Link>
  );

/** Weak skills to fix and the next skills of the route, each with the task to open now. */
export const SkillFocusList = memo(
  ({ items, stats, variant, onSelectSkill }: SkillFocusListProps): React.JSX.Element => (
    <ul className={clsx(styles.list, styles[variant])}>
      {items.map((item) => {
        const skill = getSkillById(item.skillId);
        const skillStats = stats.get(item.skillId);
        if (!skill || !skillStats) return null;
        const isNext = item.kind === "next";
        return (
          <li
            key={item.skillId}
            className={clsx(
              styles.item,
              getSkillToneClass(skillStats.state),
              isNext && styles.next
            )}
          >
            <div className={styles.head}>
              <SkillGroupIcon skill={skill} size={16} />
              {!isNext && <SkillStateIcon state={skillStats.state} size={16} />}
              <SkillName skill={skill} onSelectSkill={onSelectSkill} />
              <span className={styles.percent}>{formatSkillPercent(skillStats.mastery)}%</span>
            </div>
            {isNext && <span className={styles.kicker}>Следующий шаг маршрута</span>}
            <SkillReasonList reasons={item.reasons.slice(0, 2)} className={styles.reasons} />
            {item.nextTask && (
              <Link
                to={getSkillTaskHref(item.nextTask.id)}
                className={buttonClassName({
                  variant: "secondary",
                  size: "sm",
                  className: styles.cta,
                })}
              >
                <span className={styles.ctaText}>{getShortTaskTitle(item.nextTask.title)}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  )
);

SkillFocusList.displayName = "SkillFocusList";
