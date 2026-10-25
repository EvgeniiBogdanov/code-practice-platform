import React from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { DESIGN_CASES } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { getTaskRoute } from "@/entities/task";
import { useSidebarSystemDesignList } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarTasksList } from "./SidebarTasksList";
import styles from "./SidebarSystemDesignList.module.css";

export interface SidebarSystemDesignListProps {
  className?: string;
}

export const SidebarSystemDesignList = ({
  className,
}: SidebarSystemDesignListProps): React.JSX.Element => {
  const {
    currentTaskId,
    decodedCurrentId,
    drills,
    completedTasks,
    reviews,
    completedTotal,
    totalCount,
  } = useSidebarSystemDesignList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType="system-design"
      >
        <SidebarQuickActions section="system-design" currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      <Link to="/system-design" className={styles.overviewLink} activeOptions={{ exact: true }}>
        Обзор раздела
      </Link>

      {DESIGN_TOPICS.length > 0 && (
        <nav className={styles.group} aria-label="Теория">
          <h3 className={styles.groupTitle}>Теория</h3>
          {DESIGN_TOPICS.map((topic) => (
            <Link
              key={topic.id}
              to="/system-design/topics/$topicId"
              params={{ topicId: topic.id }}
              className={styles.item}
              activeProps={{ className: clsx(styles.item, styles.active) }}
            >
              {topic.title}
            </Link>
          ))}
        </nav>
      )}

      {DESIGN_CASES.length > 0 && (
        <nav className={styles.group} aria-label="Кейсы">
          <h3 className={styles.groupTitle}>Кейсы</h3>
          {DESIGN_CASES.map((designCase) => (
            <Link
              key={designCase.id}
              to="/system-design/cases/$caseId"
              params={{ caseId: designCase.id }}
              className={styles.item}
              activeProps={{ className: clsx(styles.item, styles.active) }}
            >
              {designCase.title}
            </Link>
          ))}
        </nav>
      )}

      {drills.length > 0 && (
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Дриллы</h3>
          <SidebarTasksList
            tasks={drills}
            to={getTaskRoute({ section: "system-design" })}
            currentTaskId={decodedCurrentId}
            completedTasks={completedTasks}
            reviews={reviews}
            expanded
          />
        </div>
      )}
    </div>
  );
};

SidebarSystemDesignList.displayName = "SidebarSystemDesignList";
