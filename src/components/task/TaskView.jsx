import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Play,
  CheckCircle,
  BookOpen,
  HelpCircle,
  ListChecks,
  Flame,
  Clock,
  Sparkles,
  AlertCircle,
  Trophy,
  Brain,
  Lock,
  Check,
  Calendar,
} from "lucide-react";
import { getTaskById } from "../../data/tasksRegistry";
import { getDifficultyLabel } from "../../utils/difficultyHelpers";
import { useReviewStore } from "../../stores/useReviewStore";
import {
  getReviewBadgeMeta,
  RATINGS,
  formatNextReviewDate,
} from "../../utils/spacedRepetition";
import CandidateTab from "./CandidateTab";
import SolutionTab from "./SolutionTab";
import MaterialsTab from "./MaterialsTab";
import QuestionsTab from "./QuestionsTab";
import ChecklistTab from "./ChecklistTab";

// Helper для форматирования даты последнего решения
const formatLastSolved = (timestamp) => {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return "Сегодня";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  const months = [
    "янв", "фев", "мар", "апр", "мая", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек"
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export const TaskView = ({
  selectedTask,
  setTaskStatus,
  completedTasks = {},
  activeTab = "candidate",
  setActiveTab,
  handleCopyCode,
  copiedCodeId,
  checklistState = {},
  toggleChecklistItem,
}) => {
  const activeTask = getTaskById(selectedTask?.id) || selectedTask;

  const CandidateComponent = activeTask.candidate;
  const SolutionComponent = activeTask.solution;

  const reviews = useReviewStore((state) => state.reviews);
  const submitReview = useReviewStore((state) => state.submitReview);
  const removeReview = useReviewStore((state) => state.removeReview);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);
  const taskReview = isReviewStoreReady ? (reviews[String(activeTask.id)] || null) : undefined;
  const badgeMeta = getReviewBadgeMeta(taskReview || null);

  const [showRatingPrompt, setShowRatingPrompt] = useState(false);

  React.useEffect(() => {
    const contentArea = document.querySelector(".content-area");
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    setShowRatingPrompt(false);
  }, [activeTask?.id, activeTab]);

  // Пользователь может оценить задачу ТОЛЬКО если:
  // 1. Задача ещё ни разу не оценивалась (!taskReview || !taskReview.stage)
  // 2. Или подошёл срок повторного закрепления (badgeMeta.isDue === true)
  // Пока стор не загружен из IndexedDB — кнопки заблокированы
  const isNeverReviewed = !taskReview || !taskReview.stage || taskReview.stage === 0;
  const canRate = isReviewStoreReady && (isNeverReviewed || badgeMeta.isDue);

  const taskIdStr = String(activeTask.id);
  const isCurrentlySolved =
    completedTasks[activeTask.id] === true ||
    completedTasks[activeTask.id] === "solved" ||
    completedTasks[taskIdStr] === true ||
    completedTasks[taskIdStr] === "solved";

  const isCurrentlyUnsolved =
    completedTasks[activeTask.id] === "unsolved" ||
    completedTasks[taskIdStr] === "unsolved";

  const handleRate = async (rating) => {
    if (!canRate) return;
    await submitReview(activeTask.id, rating);
    if (!isCurrentlySolved) {
      if (setTaskStatus) setTaskStatus(activeTask.id, "solved");
    }
  };

  return (
    <div className="content-inner">
      <div className="task-detail-card">
        <div className="task-header-row">
          <div className="task-title-container">
            <h2 className="task-detail-title">
              <span className="task-detail-title-text">{activeTask.title}</span>
              {activeTask.difficulty && (
                <span className={`difficulty-badge difficulty-${activeTask.difficulty}`}>
                  {getDifficultyLabel(activeTask.difficulty)}
                </span>
              )}
            </h2>
          </div>
          <div className="task-status-actions">
            <button
              type="button"
              onClick={() => {
                if (!setTaskStatus) return;
                const nextSolved = !isCurrentlySolved;
                setTaskStatus(activeTask.id, nextSolved ? "solved" : null);
                if (!nextSolved) {
                  removeReview(activeTask.id);
                }
              }}
              className={`status-btn ${isCurrentlySolved ? "solved-active" : ""}`}
              title={
                isCurrentlySolved
                  ? "Нажмите повторно, чтобы снять отметку"
                  : "Пометить как решённую"
              }
            >
              Решено
            </button>

            <button
              type="button"
              onClick={() => {
                if (!setTaskStatus) return;
                setTaskStatus(activeTask.id, isCurrentlyUnsolved ? null : "unsolved");
                removeReview(activeTask.id);
              }}
              className={`status-btn ${isCurrentlyUnsolved ? "unsolved-active" : ""}`}
              title={
                isCurrentlyUnsolved
                  ? "Нажмите повторно, чтобы снять отметку"
                  : "Пометить как нерешённую"
              }
            >
              Не решено
            </button>
          </div>
        </div>

        {/* Панель интервального повторения и оценки решения */}
        {isReviewStoreReady && (isCurrentlySolved || taskReview) && (
          <div className={`task-review-banner ${!canRate ? "review-banner-locked" : ""}`}>
            <div className="task-review-header-row">
              <div className="task-review-info">
                <div className="task-review-texts">
                  <div className="task-review-title">
                    <span>Интервальное повторение</span>
                    {badgeMeta.stage > 0 && (
                      <span className={`difficulty-badge ${badgeMeta.badgeClass}`}>
                        {badgeMeta.stageName}
                      </span>
                    )}
                    {taskReview?.lastReviewedAt && (
                      <span
                        className="task-review-last-solved-badge"
                        title={`Дата последнего решения: ${new Date(taskReview.lastReviewedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`}
                      >
                        <Calendar size={12} className="badge-icon" />
                        <span>Решено: {formatLastSolved(taskReview.lastReviewedAt)}</span>
                      </span>
                    )}
                    {!canRate && (
                      <span className="task-review-locked-badge" title="Кнопки станут активны, когда наступит срок повторения задачи">
                        <Lock size={12} />
                        <span>Запланировано</span>
                      </span>
                    )}
                  </div>
                  <div className="task-review-desc">
                    {badgeMeta.isDue ? (
                      <span className="desc-due">
                        Срок повторения настал! Код в редакторе сброшен до начального, чтобы решить задачу заново с нуля. Напишите решение и оцените сложность:
                      </span>
                    ) : taskReview ? (
                      <span className="desc-scheduled">
                        <div>
                          Следующее повторение: <strong>{formatNextReviewDate(taskReview.nextReviewAt, taskReview.dueDate)}</strong> (интервал: {taskReview.intervalDays} дн.)
                        </div>
                        <div style={{ marginTop: "3px" }}>
                          В день повторения решение в редакторе сбросится, чтобы решить задачу заново с нуля
                        </div>
                      </span>
                    ) : (
                      <span className="desc-new">
                        Оцените сложность решения для составления персонального графика повторений:
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`task-review-ratings ${!canRate ? "ratings-disabled" : ""}`}>
              <button
                type="button"
                className={`review-rate-btn rate-easy ${taskReview?.rating === RATINGS.EASY ? "active" : ""} ${!canRate ? "disabled" : ""}`}
                onClick={() => handleRate(RATINGS.EASY)}
                disabled={!canRate}
                title={
                  canRate
                    ? "Решил уверенно и быстро — повторить через 7 дней"
                    : `Кнопка неактивна до наступления срока повторения (${formatNextReviewDate(taskReview?.nextReviewAt)})`
                }
              >
                <div className="rate-btn-content">
                  <div className="rate-btn-title-row">
                    <CheckCircle2 size={13} className="rate-icon rate-icon-easy" />
                    <span className="rate-label">Легко</span>
                  </div>
                  <span className="rate-interval">+7 дней</span>
                </div>
                {taskReview?.rating === RATINGS.EASY && (
                  <span className="rate-current-check" title="Текущая оценка"><Check size={11} /></span>
                )}
              </button>

              <button
                type="button"
                className={`review-rate-btn rate-medium ${taskReview?.rating === RATINGS.MEDIUM ? "active" : ""} ${!canRate ? "disabled" : ""}`}
                onClick={() => handleRate(RATINGS.MEDIUM)}
                disabled={!canRate}
                title={
                  canRate
                    ? "Решил сам, но с заминкой — повторить через 3 дня"
                    : `Кнопка неактивна до наступления срока повторения (${formatNextReviewDate(taskReview?.nextReviewAt)})`
                }
              >
                <div className="rate-btn-content">
                  <div className="rate-btn-title-row">
                    <Clock size={13} className="rate-icon rate-icon-medium" />
                    <span className="rate-label">Средне</span>
                  </div>
                  <span className="rate-interval">+3 дня</span>
                </div>
                {taskReview?.rating === RATINGS.MEDIUM && (
                  <span className="rate-current-check" title="Текущая оценка"><Check size={11} /></span>
                )}
              </button>

              <button
                type="button"
                className={`review-rate-btn rate-hard ${taskReview?.rating === RATINGS.HARD ? "active" : ""} ${!canRate ? "disabled" : ""}`}
                onClick={() => handleRate(RATINGS.HARD)}
                disabled={!canRate}
                title={
                  canRate
                    ? "Трудно / смотрел подсказки — повторить завтра (+1 день)"
                    : `Кнопка неактивна до наступления срока повторения (${formatNextReviewDate(taskReview?.nextReviewAt)})`
                }
              >
                <div className="rate-btn-content">
                  <div className="rate-btn-title-row">
                    <AlertCircle size={13} className="rate-icon rate-icon-hard" />
                    <span className="rate-label">Сложно</span>
                  </div>
                  <span className="rate-interval">+1 день</span>
                </div>
                {taskReview?.rating === RATINGS.HARD && (
                  <span className="rate-current-check" title="Текущая оценка"><Check size={11} /></span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="tabs-container">
          <div className="tabs-header">
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("candidate")}
              className={`tab-link tab-candidate ${activeTab === "candidate" ? "active" : ""}`}
            >
              <Play size={14} className="tab-icon" />
              <span>Задача</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("solution")}
              className={`tab-link tab-solution ${activeTab === "solution" ? "active" : ""}`}
            >
              <CheckCircle size={14} className="tab-icon" />
              <span>Решение</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("materials")}
              className={`tab-link tab-materials ${activeTab === "materials" ? "active" : ""}`}
            >
              <BookOpen size={14} className="tab-icon" />
              <span>Разбор и теория</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("questions")}
              className={`tab-link tab-questions ${activeTab === "questions" ? "active" : ""}`}
            >
              <HelpCircle size={14} className="tab-icon" />
              <span>Вопросы</span>
              <span className="tab-badge">
                {activeTask.interviewerQuestions ? activeTask.interviewerQuestions.length : 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("checklist")}
              className={`tab-link tab-checklist ${activeTab === "checklist" ? "active" : ""}`}
            >
              <ListChecks size={14} className="tab-icon" />
              <span>Самопроверка</span>
              <span className="tab-badge">
                {activeTask.checklist ? activeTask.checklist.length : 0}
              </span>
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "candidate" && (
              <CandidateTab
                selectedTask={activeTask}
                CandidateComponent={CandidateComponent}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
                setTaskStatus={setTaskStatus}
                completedTasks={completedTasks}
              />
            )}

            {activeTab === "solution" && (
              <SolutionTab
                selectedTask={activeTask}
                SolutionComponent={SolutionComponent}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
                setTaskStatus={setTaskStatus}
                completedTasks={completedTasks}
              />
            )}

            {activeTab === "materials" && (
              <MaterialsTab
                selectedTask={activeTask}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
              />
            )}

            {activeTab === "questions" && (
              <QuestionsTab selectedTask={activeTask} />
            )}

            {activeTab === "checklist" && (
              <ChecklistTab
                selectedTask={activeTask}
                checklistState={checklistState}
                toggleChecklistItem={toggleChecklistItem}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
