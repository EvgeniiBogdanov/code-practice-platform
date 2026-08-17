import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Clock,
  RotateCcw,
  PieChart as PieChartIcon,
  Brain,
} from "lucide-react";
import { useUIStore } from "../../stores/useUIStore";
import { useReviewStore } from "../../stores/useReviewStore";
import { ALL_TASKS } from "../../data/tasksRegistry";
import { getDueTasksList } from "../../utils/spacedRepetition";
import { VisxProgressDonut } from "./VisxProgressDonut";
import { VisxCategoryBars } from "./VisxCategoryBars";
import { SpacedRepetitionSection } from "../dashboard/SpacedRepetitionSection";

export const StatsModal = ({
  statsModalOpen: propStatsModalOpen,
  setStatsModalOpen: propSetStatsModalOpen,
  currentSectionStats,
  setResetConfirmOpen: propSetResetConfirmOpen,
}) => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "spaced-repetition"

  const storeStatsModalOpen = useUIStore((state) => state.statsModalOpen);
  const storeSetStatsModalOpen = useUIStore((state) => state.setStatsModalOpen);
  const storeSetResetConfirmOpen = useUIStore((state) => state.setResetConfirmOpen);

  const reviews = useReviewStore((state) => state.reviews);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);

  const targetTasks = useMemo(() => {
    return currentSectionStats?.taskList && currentSectionStats.taskList.length > 0
      ? currentSectionStats.taskList
      : ALL_TASKS;
  }, [currentSectionStats?.taskList]);

  const dueTasks = useMemo(() => {
    return isReviewStoreReady ? getDueTasksList(targetTasks, reviews) : [];
  }, [reviews, isReviewStoreReady, targetTasks]);

  const statsModalOpen =
    propStatsModalOpen !== undefined ? propStatsModalOpen : storeStatsModalOpen;
  const setStatsModalOpen = propSetStatsModalOpen || storeSetStatsModalOpen;
  const setResetConfirmOpen = propSetResetConfirmOpen || storeSetResetConfirmOpen;

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && statsModalOpen) {
        setStatsModalOpen(false);
      }
    },
    [statsModalOpen, setStatsModalOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!statsModalOpen || !currentSectionStats) return null;

  const {
    title = "Статистика",
    sectionName = "",
    icon,
    total = 0,
    solved = 0,
    unsolved = 0,
    inProgress = 0,
    solvedPct = 0,
    unsolvedPct = 0,
    inProgressPct = 0,
    categories = [],
    breakdownTitle = "Прогресс по темам и группам:",
    isDevelopment = false,
  } = currentSectionStats;

  return (
    <div
      className="stats-modal-overlay"
      onClick={() => setStatsModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
    >
      <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stats-modal-header">
          <div className="stats-modal-title" id="stats-modal-title">
            {icon && <span className="stats-modal-header-icon">{icon}</span>}
            <span>{title}</span>
          </div>
          <button
            className="stats-modal-close"
            onClick={() => setStatsModalOpen(false)}
            title="Закрыть (Esc)"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="stats-modal-tabs">
          <button
            className={`stats-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <PieChartIcon size={14} />
            <span>Общий прогресс</span>
          </button>
          <button
            className={`stats-tab-btn ${activeTab === "spaced-repetition" ? "active" : ""}`}
            onClick={() => setActiveTab("spaced-repetition")}
          >
            <Brain size={14} />
            <span>Интервальное повторение (SM-2)</span>
            {dueTasks.length > 0 && (
              <span className="stats-tab-due-badge">{dueTasks.length}</span>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="stats-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <>
              {/* Visx Progress Donut Chart Card */}
              <div className="stats-donut-card">
                <div className="stats-donut-chart-wrap">
                  <VisxProgressDonut
                    solved={solved}
                    unsolved={unsolved}
                    inProgress={inProgress}
                    total={total}
                    solvedPct={solvedPct}
                    height={180}
                  />
                </div>
                <div className="stats-donut-legend">
                  <div className="donut-legend-item">
                    <span className="donut-legend-dot green" />
                    <span className="donut-legend-label">Решено</span>
                    <span className="donut-legend-val">{solved} ({solvedPct}%)</span>
                  </div>
                  <div className="donut-legend-item">
                    <span className="donut-legend-dot red" />
                    <span className="donut-legend-label">Не решено</span>
                    <span className="donut-legend-val">{unsolved} ({unsolvedPct}%)</span>
                  </div>
                  <div className="donut-legend-item">
                    <span className="donut-legend-dot blue" />
                    <span className="donut-legend-label">В процессе</span>
                    <span className="donut-legend-val">{inProgress} ({inProgressPct}%)</span>
                  </div>
                </div>
              </div>


              {/* Category Breakdown with Scroll */}
              {categories && categories.length > 0 && (
                <div className="stats-categories-card">
                  <div className="stats-categories-header-row">
                    <h4 className="stats-categories-title" style={{ margin: 0 }}>
                      {breakdownTitle}
                    </h4>
                    <span className="stats-categories-count-badge">
                      {categories.length} тем
                    </span>
                  </div>
                  <VisxCategoryBars categories={categories} />
                </div>
              )}

              {isDevelopment && (
                <div className="stats-dev-notice">
                  <Clock size={16} style={{ flexShrink: 0, color: "var(--accent-blue)" }} />
                  <span>
                    Этот раздел находится в активной разработке. Практические задачи появятся в скором времени.
                  </span>
                </div>
              )}
            </>
          )}

          {/* TAB 2: SPACED REPETITION (SM-2) */}
          {activeTab === "spaced-repetition" && (
            <SpacedRepetitionSection
              inModal={true}
              onNavigate={() => setStatsModalOpen(false)}
              taskList={targetTasks}
              sectionName={sectionName || title}
            />
          )}
        </div>

        {/* Footer */}
        <div className="stats-modal-footer">
          <button
            className="stats-reset-btn"
            onClick={() => setResetConfirmOpen(true)}
            title="Сбросить статус решённых задач и весь сохранённый код решений"
          >
            <RotateCcw size={14} /> Сбросить прогресс и решения
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
