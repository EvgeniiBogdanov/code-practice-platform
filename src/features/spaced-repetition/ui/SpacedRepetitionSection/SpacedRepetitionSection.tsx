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
import { SpacedRepetitionUnsolvedTab } from "./SpacedRepetitionUnsolvedTab";
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
  due: "Повтор",
  upcoming: "В очереди на повторение",
  unsolved: "Нерешенные задачи",
};

const TAB_SUBTITLES: Record<SRTabType, string> = {
  distribution: "Прогресс запоминания по алгоритму SM-2 и статистика освоения задач",
  schedule: "Прогноз нагрузки и даты следующих повторений по интервалам SM-2",
  due: "Задачи с наступившим сроком повторения для закрепления в долговременной памяти",
  upcoming: "Предстоящие запланированные интервалы повторений",
  unsolved: "Задачи, требующие повторного разбора и решения",
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
      unsolvedTasks,
      masteryPercent,
      avgInterval,
      scopeLabel,
    } = useSpacedRepetitionData({ taskList, sectionName });

    const isCompactPadding =
      activeTab === "due" || activeTab === "upcoming" || activeTab === "unsolved";

    return (
      <div className={clsx(inModal ? styles.inModal : styles.sectionBlock, className)}>
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
                unsolvedTasksCount={unsolvedTasks.length}
                onSelectTab={setActiveTab}
              />
            </div>
          </div>
        </aside>

        <main className={styles.modalMain}>
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

          <div
            className={clsx(
              styles.mainScrollable,
              isCompactPadding && styles.mainScrollableCompact
            )}
          >
            <div className={styles.pageHeader}>
              <h2 className={styles.pageTitle}>{TAB_TITLES[activeTab]}</h2>
              <p className={styles.pageSubtitle}>
                {TAB_SUBTITLES[activeTab]}
                {scopeLabel ? ` (${scopeLabel})` : ""}
              </p>
            </div>

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
                <hr className={styles.sectionDivider} />
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

            {activeTab === "unsolved" && (
              <SpacedRepetitionUnsolvedTab
                unsolvedTasks={unsolvedTasks}
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
