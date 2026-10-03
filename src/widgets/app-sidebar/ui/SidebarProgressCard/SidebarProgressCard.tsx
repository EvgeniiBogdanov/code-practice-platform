import React, { useRef, useEffect } from "react";
import type { SectionType } from "@/entities/task";
import { clsx } from "clsx";
import { CheckSquare } from "lucide-react";
import styles from "./SidebarProgressCard.module.css";

export interface ProgressSegment {
  sectionType: SectionType;
  count: number;
}

export interface SidebarProgressCardProps {
  completedCount: number;
  totalCount: number;
  /** `home` is the overall card: neutral accent, optionally a stacked bar via `segments`. */
  sectionType: SectionType | "home";
  /** Per-section parts of the overall bar; without it the bar is a single fill. */
  segments?: readonly ProgressSegment[];
  className?: string;
  children?: React.ReactNode;
}

export const SidebarProgressCard = React.memo(
  ({
    completedCount,
    totalCount,
    sectionType,
    segments,
    className,
    children,
  }: SidebarProgressCardProps) => {
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const sectionClass = styles[sectionType] || styles.react;
    const stackedBar = segments?.reduce<{ sectionType: SectionType; x: number; width: number }[]>(
      (acc, segment) => {
        const end = acc.at(-1);
        const x = end ? end.x + end.width : 0;
        const width = totalCount > 0 ? (segment.count / totalCount) * 100 : 0;
        return [...acc, { sectionType: segment.sectionType, x, width }];
      },
      []
    );
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (fillRef.current) {
        fillRef.current.style.width = `${percentage}%`;
      }
    }, [percentage]);

    return (
      <div className={clsx(styles.stickyWrapper, className)}>
        <div className={clsx(styles.progressCard, sectionClass)}>
          <div className={styles.headerRow}>
            <span className={styles.sectionTitle}>
              <CheckSquare size={13} className={styles.checkIcon} />
              <span>Выполнено задач</span>
            </span>
            <span className={styles.countBadge}>
              {completedCount}/{totalCount}
            </span>
          </div>

          {stackedBar ? (
            <svg
              className={styles.stackedBar}
              viewBox="0 0 100 4"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect className={styles.stackedTrack} width="100" height="4" rx="2" />
              {stackedBar.map(({ sectionType: id, x, width }) => (
                <rect key={id} className={styles[`segment_${id}`]} x={x} width={width} height="4" />
              ))}
            </svg>
          ) : (
            <div className={styles.barTrack}>
              <div ref={fillRef} className={styles.barFill} />
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }
);

SidebarProgressCard.displayName = "SidebarProgressCard";
