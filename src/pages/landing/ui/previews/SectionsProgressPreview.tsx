import React from "react";
import { clsx } from "clsx";
import { CURRICULUM_COUNTS, SECTIONS_CONFIG, type SectionType } from "@/entities/task/meta";
import { NodeCount } from "@/shared/ui";
import { TOTAL_TASK_COUNT } from "../../lib/formatTaskCount";
import { PreviewCard } from "./PreviewCard";
import styles from "./HeroPreviews.module.css";

const SECTION_ORDER: readonly SectionType[] = ["javascript", "typescript", "react", "algorithms"];

/** Demo progress of a learner; totals come from the real curriculum manifest. */
const DEMO_SOLVED: Record<SectionType, number> = {
  javascript: 124,
  typescript: 9,
  react: 41,
  algorithms: CURRICULUM_COUNTS.algorithms,
};

interface ProgressSegment {
  id: SectionType;
  x: number;
  width: number;
}

const SEGMENTS = SECTION_ORDER.reduce<ProgressSegment[]>((segments, id) => {
  const previous = segments.at(-1);
  const x = previous ? previous.x + previous.width : 0;
  return [...segments, { id, x, width: (DEMO_SOLVED[id] / TOTAL_TASK_COUNT) * 100 }];
}, []);

const OVERALL_PERCENT = Math.round(SEGMENTS.reduce((sum, segment) => sum + segment.width, 0));

/** Sidebar "Обзор платформы" list with progress counters and a stacked overall bar. */
export const SectionsProgressPreview = (): React.JSX.Element => (
  <PreviewCard>
    <div className={styles.sectionsHeader}>Разделы платформы</div>
    <ul className={styles.sectionsList}>
      {SECTION_ORDER.map((id) => {
        const { icon: Icon, color, title } = SECTIONS_CONFIG[id];
        return (
          <li key={id} className={styles.sectionRow}>
            <Icon size={15} color={color} />
            <span className={styles.sectionTitle}>{title}</span>
            <NodeCount completed={DEMO_SOLVED[id]} total={CURRICULUM_COUNTS[id]} />
          </li>
        );
      })}
    </ul>
    <div className={styles.overall}>
      <div className={styles.overallLabel}>
        <span>Общий прогресс</span>
        <span className={styles.overallValue}>{OVERALL_PERCENT}%</span>
      </div>
      <svg className={styles.overallBar} viewBox="0 0 100 4" preserveAspectRatio="none">
        <rect className={styles.overallTrack} width="100" height="4" rx="2" />
        {SEGMENTS.map(({ id, x, width }) => (
          <rect
            key={id}
            className={clsx(styles.overallSegment, styles[`segment_${id}`])}
            x={x}
            width={width}
            height="4"
          />
        ))}
      </svg>
    </div>
  </PreviewCard>
);
