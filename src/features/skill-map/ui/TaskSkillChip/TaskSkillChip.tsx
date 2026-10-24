import React from "react";
import { Link } from "@tanstack/react-router";
import {
  SKILL_MAP_ROUTES,
  SKILL_STATE_META,
  SkillStateIcon,
  formatSkillPercent,
  getSkillById,
  getSkillTaskEntry,
  type SkillTone,
} from "@/entities/skill";
import { MetaBadge, Tooltip, type MetaBadgeVariant } from "@/shared/ui";
import { useSkillStats } from "../../model/useSkillStats";
import styles from "./TaskSkillChip.module.css";

const BADGE_VARIANT: Readonly<Record<SkillTone, MetaBadgeVariant>> = {
  danger: "red",
  warning: "orange",
  accent: "blue",
  success: "green",
  neutral: "gray",
};

export interface TaskSkillChipProps {
  taskId: string | number;
}

/** The skill a task trains, with its mastery; opens the skill on the map. */
export const TaskSkillChip = ({ taskId }: TaskSkillChipProps): React.JSX.Element | null => {
  const stats = useSkillStats();
  const entry = getSkillTaskEntry(taskId);
  const skill = entry ? getSkillById(entry.skill) : undefined;
  const skillStats = skill ? stats.get(skill.id) : undefined;
  if (!skill || !skillStats) return null;

  const meta = SKILL_STATE_META[skillStats.state];
  const percent = formatSkillPercent(skillStats.mastery);

  return (
    <Tooltip
      content={`Навык «${skill.title}»: ${meta.label.toLowerCase()}. Открыть на карте навыков`}
      side="bottom"
      sideOffset={6}
    >
      <Link
        to={SKILL_MAP_ROUTES[skill.section]}
        search={{ skill: skill.id }}
        className={styles.link}
        aria-label={`Навык «${skill.title}», ${percent}%, ${meta.label.toLowerCase()}. Открыть на карте навыков`}
      >
        <MetaBadge
          variant={BADGE_VARIANT[meta.tone]}
          icon={<SkillStateIcon state={skillStats.state} size={12} />}
        >
          Прогресс навыка · {percent}%
        </MetaBadge>
      </Link>
    </Tooltip>
  );
};
