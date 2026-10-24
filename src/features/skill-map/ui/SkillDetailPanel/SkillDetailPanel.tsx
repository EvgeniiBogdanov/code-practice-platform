import React, { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { ArrowRight, Minimize2 } from "lucide-react";
import {
  SKILL_STATE_META,
  SkillStateIcon,
  formatSkillPercent,
  getSkillById,
  getSkillDependents,
  getSkillReasons,
  getSkillToneClass,
  pickNextTask,
  type SkillStats,
} from "@/entities/skill";
import { SkillGroupIcon } from "../SkillGroupIcon";
import { SECTIONS_CONFIG } from "@/entities/task/meta";
import { ScrollEdgeFade, buttonClassName } from "@/shared/ui";
import { getShortTaskTitle, getSkillTaskHref } from "../../lib/skillTaskMeta";
import { SkillReasonList } from "../SkillReasonList/SkillReasonList";
import { SkillTaskList } from "./SkillTaskList";
import styles from "./SkillDetailPanel.module.css";

export interface SkillDetailPanelProps {
  skillId: string;
  stats: ReadonlyMap<string, SkillStats>;
  onSelectSkill: (skillId: string) => void;
  onCollapse?: () => void;
}

interface SkillLinksProps {
  title: string;
  skillIds: readonly string[];
  currentSection: string;
  stats: ReadonlyMap<string, SkillStats>;
  onSelectSkill: (skillId: string) => void;
}

const SkillLinks = ({
  title,
  skillIds,
  currentSection,
  stats,
  onSelectSkill,
}: SkillLinksProps): React.JSX.Element => (
  <div className={styles.links}>
    <h4 className={styles.subheading}>{title}</h4>
    {skillIds.length ? (
      <div className={styles.chips}>
        {skillIds.map((id) => {
          const skill = getSkillById(id);
          const skillStats = stats.get(id);
          if (!skill || !skillStats) return null;
          const prefix =
            skill.section === currentSection ? "" : `${SECTIONS_CONFIG[skill.section].title} · `;
          return (
            <button
              key={id}
              type="button"
              className={clsx(styles.chip, getSkillToneClass(skillStats.state))}
              onClick={(): void => onSelectSkill(id)}
            >
              <SkillStateIcon state={skillStats.state} size={12} />
              {prefix}
              {skill.title} · {formatSkillPercent(skillStats.mastery)}%
            </button>
          );
        })}
      </div>
    ) : (
      <span className={styles.empty}>Нет</span>
    )}
  </div>
);

/** Everything about one skill: why it has its mastery, where it sits on the route, its tasks. */
export const SkillDetailPanel = memo(
  ({
    skillId,
    stats,
    onSelectSkill,
    onCollapse,
  }: SkillDetailPanelProps): React.JSX.Element | null => {
    const [isScrolled, setIsScrolled] = useState(false);
    const skill = getSkillById(skillId);
    const skillStats = stats.get(skillId);
    if (!skill || !skillStats) return null;

    const percent = formatSkillPercent(skillStats.mastery);
    const nextTask = pickNextTask(skillStats);
    const toneClass = getSkillToneClass(skillStats.state);

    return (
      <section className={styles.panel} aria-labelledby="skill-detail-title">
        <div className={styles.top}>
          <header className={styles.header}>
            <div className={styles.topRow}>
              <div className={styles.titleRow}>
                <SkillGroupIcon skill={skill} size={18} />
                <SkillStateIcon state={skillStats.state} size={18} />
                <h3 id="skill-detail-title" className={styles.title}>
                  {skill.title}
                </h3>
                <span className={clsx(styles.badge, toneClass)}>
                  {SKILL_STATE_META[skillStats.state].label}
                </span>
              </div>
              {onCollapse && (
                <button
                  type="button"
                  className={styles.collapse}
                  aria-label="Свернуть панель навыка"
                  onClick={onCollapse}
                >
                  <Minimize2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <p className={styles.summary}>
              Освоение <strong className={clsx(styles.percent, toneClass)}>{percent}%</strong> ·
              начато {skillStats.started} из {skillStats.total}
            </p>
          </header>

          {nextTask ? (
            <Link
              to={getSkillTaskHref(nextTask.id)}
              className={buttonClassName({ variant: "primary", size: "sm", className: styles.cta })}
            >
              <span className={styles.ctaText}>
                Практиковать: {getShortTaskTitle(nextTask.title)}
              </span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ) : (
            <p className={styles.done}>Навык освоен: все задачи закреплены повторениями.</p>
          )}
        </div>

        <div
          className={styles.body}
          onScroll={(event): void => setIsScrolled(event.currentTarget.scrollTop > 0)}
        >
          <ScrollEdgeFade isVisible={isScrolled} />
          <div className={styles.sections}>
            <div>
              <h4 className={styles.subheading}>Почему такая оценка</h4>
              <SkillReasonList reasons={getSkillReasons(skillStats)} />
            </div>

            <div className={styles.linkGrid}>
              <SkillLinks
                title="Опирается на"
                skillIds={skill.requires}
                currentSection={skill.section}
                stats={stats}
                onSelectSkill={onSelectSkill}
              />
              <SkillLinks
                title="Открывает"
                skillIds={getSkillDependents(skill.id)}
                currentSection={skill.section}
                stats={stats}
                onSelectSkill={onSelectSkill}
              />
            </div>

            <div>
              <h4 className={styles.subheading}>Задачи по порядку маршрута</h4>
              <SkillTaskList skill={skill} tasks={skillStats.tasks} />
            </div>
          </div>
        </div>
      </section>
    );
  }
);

SkillDetailPanel.displayName = "SkillDetailPanel";
