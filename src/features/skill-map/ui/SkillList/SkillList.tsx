import React, { memo, useMemo } from "react";
import { clsx } from "clsx";
import {
  SKILL_STATE_META,
  SkillMasteryBar,
  SkillStateIcon,
  formatSkillPercent,
  getSkillById,
  getSkillToneClass,
  type SkillStats,
  type SkillSection,
} from "@/entities/skill";
import { SkillGroupIcon } from "../SkillGroupIcon";
import { getSkillGraphLayout } from "../../lib/skillGraphLayout";
import { matchesSkillFilter, type SkillFilter } from "../../model/skillFilter";
import styles from "./SkillList.module.css";

export interface SkillListProps {
  section: SkillSection;
  stats: ReadonlyMap<string, SkillStats>;
  selectedId: string | null;
  filter: SkillFilter;
  onSelect: (skillId: string) => void;
}

/** The route as a list grouped by step: the full-fidelity alternative to the graph. */
export const SkillList = memo(
  ({ section, stats, selectedId, filter, onSelect }: SkillListProps): React.JSX.Element => {
    const { levels } = useMemo(() => getSkillGraphLayout(section), [section]);

    return (
      <div className={styles.list}>
        {levels.map((level, depth) => {
          const rows = level.flatMap((id) => {
            const skill = getSkillById(id);
            const skillStats = stats.get(id);
            return skill && skillStats && matchesSkillFilter(skillStats, filter)
              ? [{ skill, skillStats }]
              : [];
          });
          if (!rows.length) return null;
          return (
            <section key={depth} className={styles.group}>
              <h3 className={styles.groupTitle}>
                {depth === 0 ? "Основа" : `Ступень ${depth + 1}`}
              </h3>
              <ul className={styles.rows}>
                {rows.map(({ skill, skillStats }) => (
                  <li key={skill.id}>
                    <button
                      type="button"
                      className={clsx(styles.row, getSkillToneClass(skillStats.state))}
                      aria-pressed={skill.id === selectedId}
                      onClick={(): void => onSelect(skill.id)}
                    >
                      <span className={styles.icon}>
                        <SkillGroupIcon skill={skill} />
                        <SkillStateIcon state={skillStats.state} />
                      </span>
                      <span className={styles.name}>{skill.title}</span>
                      <span className={styles.state}>
                        {SKILL_STATE_META[skillStats.state].label}
                      </span>
                      <SkillMasteryBar
                        mastery={skillStats.mastery}
                        state={skillStats.state}
                        title={skill.title}
                        className={styles.bar}
                      />
                      <span className={styles.percent}>
                        {formatSkillPercent(skillStats.mastery)}%
                      </span>
                      <span className={styles.count}>
                        {skillStats.started}/{skillStats.total}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    );
  }
);

SkillList.displayName = "SkillList";
