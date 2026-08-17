import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Brain,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  AlertCircle,
  Zap,
  RotateCcw,
  Target,
  Info,
} from "lucide-react";
import { VisxMasteryPie } from "./VisxMasteryPie";
import { VisxRetentionScheduleBar } from "./VisxRetentionScheduleBar";
import { ALL_TASKS } from "../../data/tasksRegistry";
import { useReviewStore } from "../../stores/useReviewStore";
import {
  calculateMasteryStats,
  getDueTasksList,
  isTaskDue,
  formatNextReviewDate,
  STAGE_INTERVALS,
} from "../../utils/spacedRepetition";

export const SpacedRepetitionSection = ({
  inModal = false,
  onNavigate,
  taskList,
  sectionName = "",
}) => {
  const [activeTab, setActiveTab] = useState("distribution"); // "distribution" | "schedule" | "due"

  const reviews = useReviewStore((state) => state.reviews);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);

  const targetTasks = useMemo(() => {
    return taskList && taskList.length > 0 ? taskList : ALL_TASKS;
  }, [taskList]);

  const masteryStats = useMemo(() => {
    return isReviewStoreReady
      ? calculateMasteryStats(targetTasks, reviews)
      : {
          dueToday: 0,
          learning: 0,
          reviewing: 0,
          mastered: 0,
          totalReviewed: 0,
          unreviewed: targetTasks.length,
          totalCount: targetTasks.length,
        };
  }, [targetTasks, reviews, isReviewStoreReady]);

  const dueTasks = useMemo(() => {
    return getDueTasksList(targetTasks, reviews);
  }, [targetTasks, reviews]);

  const hasReviews = masteryStats.totalReviewed > 0;
  const masteryPercent =
    masteryStats.totalReviewed > 0
      ? Math.round((masteryStats.mastered / masteryStats.totalReviewed) * 100)
      : 0;

  // Compute average interval for scheduled tasks belonging to this section
  const avgInterval = useMemo(() => {
    if (!reviews || masteryStats.totalReviewed === 0 || !targetTasks) return 0;
    let sum = 0;
    let count = 0;
    for (const task of targetTasks) {
      const taskId = String(task.id);
      const rev = reviews[taskId] || reviews[task.id];
      if (rev && rev.stage > 0) {
        sum += rev.intervalDays || STAGE_INTERVALS[rev.stage] || 1;
        count++;
      }
    }
    return count > 0 ? Math.round(sum / count) : 0;
  }, [reviews, masteryStats.totalReviewed, targetTasks]);

  const scopeLabel = sectionName ? `в разделе ${sectionName}` : "в каталоге";
  const displaySectionTitle = sectionName ? ` (${sectionName})` : "";

  return (
    <div className={`spaced-repetition-section ${inModal ? "in-modal" : "section-block"}`}>
      {/* Header Row (Only shown if not inModal) */}
      {!inModal && (
        <div className="block-header spaced-repetition-header">
          <div className="block-header-title-group">
            <div className="sr-header-icon-badge">
              <Brain size={18} style={{ color: "var(--accent-blue, #3b82f6)" }} />
            </div>
            <div>
              <h2 className="block-title" style={{ margin: 0 }}>
                Интервальное повторение{displaySectionTitle}
              </h2>
              <div className="sr-header-subtitle">
                Алгоритм долговременного запоминания SM-2 (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д ➔ 60+д)
              </div>
            </div>
          </div>

          {hasReviews && (
            <div className="sr-header-actions">
              {masteryStats.dueToday > 0 && (
                <button
                  className={`sr-pill-badge due-badge ${activeTab === "due" ? "active" : ""}`}
                  onClick={() => setActiveTab("due")}
                  title="Показать задачи, готовые к повторению сегодня"
                >
                  <RotateCcw size={12} className="sr-pulse-icon" />
                  <span>Повторить: {masteryStats.dueToday}</span>
                </button>
              )}
              <span className="mastery-summary-pill">
                <Trophy size={13} style={{ color: "#10b981" }} />
                <span>Мастер: {masteryStats.mastered} из {masteryStats.totalReviewed}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Dashboard: Always rendered with Visx charts */}
      <div className="sr-dashboard-card">
        {/* View Tab Selector */}
        <div className="sr-tab-bar">
          <button
            className={`sr-tab-btn ${activeTab === "distribution" ? "active" : ""}`}
            onClick={() => setActiveTab("distribution")}
          >
            <PieChartIcon size={14} />
            <span>Распределение мастерства</span>
          </button>
          <button
            className={`sr-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <BarChart3 size={14} />
            <span>График повторений</span>
          </button>
          <button
            className={`sr-tab-btn ${activeTab === "due" ? "active" : ""}`}
            onClick={() => setActiveTab("due")}
          >
            <RotateCcw size={14} />
            <span>Срочные задачи ({dueTasks.length})</span>
          </button>
        </div>

        {/* Active View Content */}
        <div className="sr-view-content">
          {/* TAB 1: DISTRIBUTION */}
          {activeTab === "distribution" && (
            <div className="sr-distribution-view">
              <div className="sr-chart-col">
                <VisxMasteryPie masteryStats={masteryStats} height={220} />
              </div>
              <div className="sr-legend-col">
                <div className="sr-legend-header">Уровни закрепления SM-2:</div>
                <div className="sr-stage-list">
                  <div className="sr-stage-item stage-mastered">
                    <div className="sr-stage-dot green" />
                    <div className="sr-stage-info">
                      <div className="sr-stage-title">Мастер (30-60+ дней)</div>
                      <div className="sr-stage-desc">Надёжно усвоено в долговременной памяти</div>
                    </div>
                    <div className="sr-stage-count">{masteryStats.mastered}</div>
                  </div>

                  <div className="sr-stage-item stage-reviewing">
                    <div className="sr-stage-dot yellow" />
                    <div className="sr-stage-info">
                      <div className="sr-stage-title">Закрепление (7-14 дней)</div>
                      <div className="sr-stage-desc">Уверенное решение, интервалы растут</div>
                    </div>
                    <div className="sr-stage-count">{masteryStats.reviewing}</div>
                  </div>

                  <div className="sr-stage-item stage-learning">
                    <div className="sr-stage-dot red" />
                    <div className="sr-stage-info">
                      <div className="sr-stage-title">Изучение (1-3 дня)</div>
                      <div className="sr-stage-desc">Активная фаза повторов и разбора нюансов</div>
                    </div>
                    <div className="sr-stage-count">{masteryStats.learning}</div>
                  </div>

                  <div className="sr-stage-item stage-unreviewed">
                    <div className="sr-stage-dot gray" />
                    <div className="sr-stage-info">
                      <div className="sr-stage-title">Ещё не в графике</div>
                      <div className="sr-stage-desc">Задачи {scopeLabel}, ожидающие решения</div>
                    </div>
                    <div className="sr-stage-count">{masteryStats.unreviewed}</div>
                  </div>
                </div>

                {!hasReviews && (
                  <div className="sr-onboarding-hint">
                    <div className="sr-onboarding-hint-title">
                      <Sparkles size={13} style={{ color: "var(--accent-blue)" }} />
                      <span>Как включить задачи в график:</span>
                    </div>
                    <div className="sr-onboarding-hint-text">
                      При решении задач оценивайте их сложность (Легко / Средне / Сложно). Алгоритм SM-2 автоматически сформирует цикл повторений (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д ➔ 60+д).
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RETENTION SCHEDULE */}
          {activeTab === "schedule" && (
            <div className="sr-schedule-view">
              <div className="sr-schedule-desc">
                Прогноз нагрузки и даты следующих повторений задач {scopeLabel} по интервалам SM-2:
              </div>
              <VisxRetentionScheduleBar
                reviews={reviews}
                allTasks={targetTasks}
                height={220}
              />
            </div>
          )}

          {/* TAB 3: DUE TASKS */}
          {activeTab === "due" && (
            <div className="sr-due-view">
              {dueTasks.length > 0 ? (
                <div className="sr-due-grid">
                  {dueTasks.map((task) => {
                    const section = task.section || "react";
                    const sectionColor =
                      section === "javascript"
                        ? "#f59e0b"
                        : section === "algorithms"
                          ? "#a855f7"
                          : "var(--accent-blue, #3b82f6)";
                    const taskSectionName =
                      section === "javascript"
                        ? "JavaScript"
                        : section === "algorithms"
                          ? "Алгоритмы"
                          : "React";

                    return (
                      <Link
                        key={task.id}
                        to={`/${section}/$taskId`}
                        params={{ taskId: String(task.id) }}
                        className="sr-due-card"
                        onClick={() => {
                          if (onNavigate) onNavigate();
                        }}
                      >
                        <div className="sr-due-card-top">
                          <span
                            className="sr-due-card-section"
                            style={{ color: sectionColor }}
                          >
                            <span
                              className="sr-section-dot"
                              style={{ backgroundColor: sectionColor }}
                            />
                            {taskSectionName}
                          </span>
                          <span className="sr-due-card-stage">
                            Этап {task.reviewData?.stage || 1}
                          </span>
                        </div>
                        <div className="sr-due-card-title">{task.title}</div>
                        <div className="sr-due-card-footer">
                          <span className="sr-due-alert-text">
                            <RotateCcw size={11} /> Пора повторить
                          </span>
                          <span className="sr-due-action-btn">
                            <span>Решить</span>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="sr-empty-due">
                  <CheckCircle2 size={32} style={{ color: "#10b981", margin: "0 auto 8px" }} />
                  <div className="sr-empty-title">Все задачи {scopeLabel} повторены!</div>
                  <div className="sr-empty-desc">
                    На сегодня нет задач {scopeLabel} с наступившим сроком повторения. Решайте новые задачи, чтобы пополнить график интервального повторения.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetitionSection;
