import React from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import type { SectionType } from "@/entities/task/meta";
import { PlatformLogo } from "@/shared/ui";
import { SidebarProgressCard } from "../SidebarProgressCard/SidebarProgressCard";
import { useSidebarHomeStats } from "../../model/useSidebarHomeStats";
import styles from "./SidebarHomeOverview.module.css";

export interface SidebarHomeOverviewProps {
  activeSectionKey: "home" | SectionType;
  isHomeActive?: boolean;
}

export const SidebarHomeOverview = ({
  activeSectionKey,
  isHomeActive = activeSectionKey === "home",
}: SidebarHomeOverviewProps): React.JSX.Element => {
  const {
    completedTsTotal,
    completedJsTotal,
    completedReactTotal,
    completedAlgoTotal,
    completedAllTotal,
    totalAll,
  } = useSidebarHomeStats();

  return (
    <div className={styles.homeOverviewList}>
      <SidebarProgressCard
        completedCount={completedAllTotal}
        totalCount={totalAll}
        sectionType="home"
        segments={[
          { sectionType: "javascript", count: completedJsTotal },
          { sectionType: "typescript", count: completedTsTotal },
          { sectionType: "react", count: completedReactTotal },
          { sectionType: "algorithms", count: completedAlgoTotal },
        ]}
      />

      <Link
        to="/home"
        className={clsx(styles.homeOverviewItem, isHomeActive && styles.homeItemActive)}
      >
        <PlatformLogo size={17} className={styles.icon_home} />
        <span className={styles.homeItemTitle}>Обзор платформы</span>
      </Link>
    </div>
  );
};
