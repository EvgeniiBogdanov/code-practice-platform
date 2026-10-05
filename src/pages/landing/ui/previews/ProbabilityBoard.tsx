import React from "react";
import { clsx } from "clsx";
import { SECTIONS_CONFIG } from "@/entities/task/meta";
import { GaugeIndicator, MetaBadge, UiNumberScramble } from "@/shared/ui";
import { SHOWCASE_TASKS } from "../../config/showcaseTasks";
import { getShowcaseProbability } from "../../lib/showcaseProbability";
import styles from "./SectionPreviews.module.css";
import local from "./ProbabilityBoard.module.css";

const ROW_ORDER = [styles.i1, styles.i2, styles.i3, styles.i4, styles.i5, styles.i6];

/** Showcase tasks ranked by the workspace's own interview-probability index. */
const TOP_TASKS = SHOWCASE_TASKS.flatMap((task) => {
  const info = getShowcaseProbability(task);
  return info && info.probability !== null ? [{ task, info, probability: info.probability }] : [];
})
  .sort((a, b) => b.probability - a.probability)
  .slice(0, ROW_ORDER.length);

export interface ProbabilityBoardProps {
  isActive: boolean;
}

export const ProbabilityBoard = ({ isActive }: ProbabilityBoardProps): React.JSX.Element => (
  <div className={clsx(local.board, isActive && styles.active)}>
    <div className={clsx(local.header, styles.stg)}>
      <span>Топ live coding · Middle / Senior</span>
      <span className={local.headerHint}>BigTech · FinTech · E-commerce</span>
    </div>
    <ol className={local.list}>
      {TOP_TASKS.map(({ task, info, probability }, index) => (
        <li key={task.id} className={clsx(local.row, styles.stg, ROW_ORDER[index])}>
          <GaugeIndicator value={probability} size={26} aria-label={info.tooltip} />
          <span className={local.texts}>
            <span className={local.title}>{task.title}</span>
            <span className={local.meta}>
              {SECTIONS_CONFIG[task.section].title} · {task.subgroup ?? task.group}
            </span>
          </span>
          <MetaBadge variant={info.variant} className={local.badge}>
            <UiNumberScramble value={isActive ? probability : 0} suffix="%" />
          </MetaBadge>
        </li>
      ))}
    </ol>
  </div>
);
