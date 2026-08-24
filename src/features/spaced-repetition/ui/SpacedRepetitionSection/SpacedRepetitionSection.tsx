import { useState, memo } from "react";
import { Brain, X } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { useSpacedRepetitionData } from "../../model/useSpacedRepetitionData";
import { SpacedRepetitionKpiGrid } from "./SpacedRepetitionKpiGrid";
import { SpacedRepetitionTabBar, SRTabType } from "./SpacedRepetitionTabBar";
import { SpacedRepetitionDistributionTab } from "./SpacedRepetitionDistributionTab";
import { SpacedRepetitionScheduleTab } from "./SpacedRepetitionScheduleTab";
import { SpacedRepetitionDueTab } from "./SpacedRepetitionDueTab";
import { SpacedRepetitionUpcomingTab } from "./SpacedRepetitionUpcomingTab";
import styles from "./SpacedRepetitionSection.module.css";

export interface SpacedRepetitionSectionProps {
  inModal?: boolean;
  taskList?: Task[];
  sectionName?: string;
  onNavigate?: () => void;
  onCloseModal?: () => void;
  className?: string;
}

const TAB_TITLES: Record<SRTabType, string> = {
  distribution: "Мастерство и распределение",
  schedule: "График повторений",
  due: "Срочные задачи",
  upcoming: "Предстоящий повтор",
};

export const SpacedRepetitionSection = memo(
  ({
    inModal = false,
    taskList,
    sectionName = "",
    onNavigate,
    onCloseModal,
    className,
  }: SpacedRepetitionSectionProps) => {
    const [activeTab, setActiveTab] = useState<SRTabType>("distribution");

    const {
      reviews,
      targetTasks,
      masteryStats,
      dueTasks,
      upcomingTasks,
      masteryPercent,
      avgInterval,
      scopeLabel,
    } = useSpacedRepetitionData({ taskList, sectionName });

    const isCompactPadding = activeTab === "due" || activeTab === "upcoming";

    return (
      <div
        className={[inModal ? styles.inModal : styles.sectionBlock, className]
          .filter(Boolean)
          .join(" ")}
      >
        <aside className={styles.modalSidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.workspaceHeader}>
              <div className={styles.workspaceIcon}>
                <Brain size={15} />
              </div>
              <div className={styles.workspaceInfo}>
                <span className={styles.workspaceName}>Повторения</span>
                <span className={styles.workspaceType}>{scopeLabel}</span>
              </div>
            </div>

            <div className={styles.sidebarNavGroup}>
              <div className={styles.sidebarSectionTitle}>Навигация</div>
              <SpacedRepetitionTabBar
                activeTab={activeTab}
                dueTasksCount={dueTasks.length}
                upcomingTasksCount={upcomingTasks.length}
                onSelectTab={setActiveTab}
              />
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <span className={styles.sidebarVersion}>Алгоритм SM-2</span>
            <span className={styles.sidebarBuild}>4 стадии интервалов</span>
          </div>
        </aside>

        <main className={styles.modalMain}>
          <div className={styles.mainHeader}>
            <h2 className={styles.mainHeaderTitle}>{TAB_TITLES[activeTab]}</h2>
            {onCloseModal && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onCloseModal}
                aria-label="Закрыть статистику повторений"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div
            className={clsx(
              styles.mainScrollable,
              isCompactPadding && styles.mainScrollableCompact
            )}
          >
            {activeTab === "distribution" && (
              <div className={styles.viewContent}>
                <SpacedRepetitionKpiGrid
                  totalReviewed={masteryStats.totalReviewed}
                  totalCount={masteryStats.totalCount}
                  dueToday={masteryStats.dueToday}
                  mastered={masteryStats.mastered}
                  masteryPercent={masteryPercent}
                  avgInterval={avgInterval}
                />
                <SpacedRepetitionDistributionTab
                  masteryStats={masteryStats}
                  scopeLabel={scopeLabel}
                />
              </div>
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

            {activeTab === "upcoming" && (
              <SpacedRepetitionUpcomingTab
                upcomingTasks={upcomingTasks}
                scopeLabel={scopeLabel}
                onNavigate={onNavigate}
              />
            )}
          </div>
        </main>
      </div>
    );
  }
);

SpacedRepetitionSection.displayName = "SpacedRepetitionSection";
