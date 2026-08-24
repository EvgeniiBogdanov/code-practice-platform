import React, { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { CheckSquare } from "lucide-react";
import styles from "./SidebarProgressCard.module.css";

export interface SidebarProgressCardProps {
  completedCount: number;
  totalCount: number;
  sectionType: "javascript" | "algorithms" | "react";
  className?: string;
}

export const SidebarProgressCard = React.memo(
  ({ completedCount, totalCount, sectionType, className }: SidebarProgressCardProps) => {
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const sectionClass = styles[sectionType] || styles.react;
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

          <div className={styles.barTrack}>
            <div ref={fillRef} className={styles.barFill} />
          </div>
        </div>
      </div>
    );
  }
);

SidebarProgressCard.displayName = "SidebarProgressCard";
