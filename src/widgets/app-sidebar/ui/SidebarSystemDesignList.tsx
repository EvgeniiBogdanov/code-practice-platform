import React from "react";
import { clsx } from "clsx";
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

      <SidebarTasksList
        tasks={drills}
        to={getTaskRoute({ section: "system-design" })}
        currentTaskId={decodedCurrentId}
        completedTasks={completedTasks}
        reviews={reviews}
        expanded
      />
    </div>
  );
};

SidebarSystemDesignList.displayName = "SidebarSystemDesignList";
