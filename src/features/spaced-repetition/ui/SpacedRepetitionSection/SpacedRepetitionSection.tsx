import { useState, memo } from "react";
import { Task } from "@/entities/task";
import { useSpacedRepetitionData } from "../../model/useSpacedRepetitionData";
import { SpacedRepetitionKpiGrid } from "./SpacedRepetitionKpiGrid";
import { SpacedRepetitionTabBar, SRTabType } from "./SpacedRepetitionTabBar";
import { SpacedRepetitionDistributionTab } from "./SpacedRepetitionDistributionTab";
import { SpacedRepetitionScheduleTab } from "./SpacedRepetitionScheduleTab";
import { SpacedRepetitionDueTab } from "./SpacedRepetitionDueTab";
import styles from "./SpacedRepetitionSection.module.css";

export interface SpacedRepetitionSectionProps {
  inModal?: boolean;
  taskList?: Task[];
  sectionName?: string;
  onNavigate?: () => void;
  className?: string;
}

export const SpacedRepetitionSection = memo(
  ({
    inModal = false,
    taskList,
    sectionName = "",
    onNavigate,
    className,
  }: SpacedRepetitionSectionProps) => {
    const [activeTab, setActiveTab] = useState<SRTabType>("distribution");

    const {
      reviews,
      targetTasks,
      masteryStats,
      dueTasks,
      masteryPercent,
      avgInterval,
      scopeLabel,
    } = useSpacedRepetitionData({ taskList, sectionName });

    return (
      <div
        className={[inModal ? styles.inModal : styles.sectionBlock, className]
          .filter(Boolean)
          .join(" ")}
      >
        <SpacedRepetitionKpiGrid
          totalReviewed={masteryStats.totalReviewed}
          totalCount={masteryStats.totalCount}
          dueToday={masteryStats.dueToday}
          mastered={masteryStats.mastered}
          masteryPercent={masteryPercent}
          avgInterval={avgInterval}
        />

        <SpacedRepetitionTabBar
          activeTab={activeTab}
          dueTasksCount={dueTasks.length}
          onSelectTab={setActiveTab}
        />

        <div className={styles.viewContent}>
          {activeTab === "distribution" && (
            <SpacedRepetitionDistributionTab masteryStats={masteryStats} scopeLabel={scopeLabel} />
          )}

          {activeTab === "schedule" && (
            <SpacedRepetitionScheduleTab
              reviews={reviews}
              targetTasks={targetTasks}
              scopeLabel={scopeLabel}
            />
          )}

          {activeTab === "due" && (
            <SpacedRepetitionDueTab
              dueTasks={dueTasks}
              reviews={reviews}
              scopeLabel={scopeLabel}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    );
  }
);

SpacedRepetitionSection.displayName = "SpacedRepetitionSection";
