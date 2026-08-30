import React from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  ALL_JS_TASKS,
  ALL_REACT_TASKS,
  ALL_ALGO_TASKS,
  SECTIONS_CONFIG,
  SectionType,
} from "@/entities/task";
import { NodeCount } from "@/shared/ui";
import { useSidebarHomeStats } from "../../model";
import styles from "./SidebarHomeOverview.module.css";

export interface SidebarHomeOverviewProps {
  activeSectionKey: "home" | SectionType;
}

export const SidebarHomeOverview = ({
  activeSectionKey,
}: SidebarHomeOverviewProps): React.JSX.Element => {
  const {
    completedJsTotal,
    completedReactTotal,
    completedAlgoTotal,
    jsCompletionClass,
    reactCompletionClass,
    algoCompletionClass,
  } = useSidebarHomeStats();

  return (
    <div className={styles.homeOverviewList}>
      <Link
        to="/home"
        className={clsx(styles.homeOverviewItem, activeSectionKey === "home" && styles.homeItemActive)}
      >
        <SECTIONS_CONFIG.home.icon
          size={17}
          color={SECTIONS_CONFIG.home.color}
          className={styles.icon_home}
        />
        <span className={styles.homeItemTitle}>Главная (Обзор)</span>
      </Link>

      <Link to="/javascript" className={styles.homeOverviewItem}>
        <SECTIONS_CONFIG.javascript.icon
          size={17}
          color={SECTIONS_CONFIG.javascript.color}
          className={styles.icon_javascript}
        />
        <span className={styles.homeItemTitle}>JavaScript</span>
        <NodeCount
          completed={completedJsTotal}
          total={ALL_JS_TASKS.length}
          className={jsCompletionClass}
        />
      </Link>

      <Link to="/react" className={styles.homeOverviewItem}>
        <SECTIONS_CONFIG.react.icon
          size={17}
          color={SECTIONS_CONFIG.react.color}
          className={styles.icon_react}
        />
        <span className={styles.homeItemTitle}>React</span>
        <NodeCount
          completed={completedReactTotal}
          total={ALL_REACT_TASKS.length}
          className={reactCompletionClass}
        />
      </Link>

      <Link to="/algorithms" className={styles.homeOverviewItem}>
        <SECTIONS_CONFIG.algorithms.icon
          size={17}
          color={SECTIONS_CONFIG.algorithms.color}
          className={styles.icon_algorithms}
        />
        <span className={styles.homeItemTitle}>Алгоритмы</span>
        <NodeCount
          completed={completedAlgoTotal}
          total={ALL_ALGO_TASKS.length}
          className={algoCompletionClass}
        />
      </Link>
    </div>
  );
};
