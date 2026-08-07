import React from "react";
import { X, CheckCircle2, XCircle, Clock, CheckSquare, RotateCcw } from "lucide-react";

export const StatsModal = ({
  statsModalOpen,
  setStatsModalOpen,
  currentSectionStats,
  setResetConfirmOpen,
}) => {
  if (!statsModalOpen || !currentSectionStats) return null;

  return (
    <div
      className="stats-modal-overlay"
      onClick={() => setStatsModalOpen(false)}
    >
      <div
        className="stats-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stats-modal-header">
          <div className="stats-modal-title">
            {currentSectionStats.icon} <span>{currentSectionStats.title}</span>
          </div>
          <button
            className="stats-modal-close"
            onClick={() => setStatsModalOpen(false)}
            title="Закрыть (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="stats-modal-body">
          {/* Общий прогресс-бар */}
          <div className="stats-main-progress-card">
            <div className="stats-progress-label-row">
              <span>Прогресс решения</span>
              <span className="stats-percent-badge">{currentSectionStats.solvedPct}%</span>
            </div>
            
            {/* Трехцветный полосатый прогресс-бар */}
            <div className="stats-multi-bar">
              <div
                className="stats-bar-segment segment-solved"
                style={{ width: `${currentSectionStats.solvedPct}%` }}
                title={`Решено: ${currentSectionStats.solved} (${currentSectionStats.solvedPct}%)`}
              />
              <div
                className="stats-bar-segment segment-unsolved"
                style={{ width: `${currentSectionStats.unsolvedPct}%` }}
                title={`Не решено: ${currentSectionStats.unsolved} (${currentSectionStats.unsolvedPct}%)`}
              />
              <div
                className="stats-bar-segment segment-progress"
                style={{ width: `${currentSectionStats.inProgressPct}%` }}
                title={`В процессе: ${currentSectionStats.inProgress} (${currentSectionStats.inProgressPct}%)`}
              />
            </div>
          </div>

          {/* Метрики: Решено, Не решено, В процессе, Всего */}
          <div className="stats-metrics-grid">
            <div className="stats-metric-card metric-solved">
              <div className="metric-header">
                <CheckCircle2 size={15} /> Решено
              </div>
              <div className="metric-value">{currentSectionStats.solved}</div>
              <div className="metric-sub">{currentSectionStats.solvedPct}% от всех задач</div>
            </div>

            <div className="stats-metric-card metric-unsolved">
              <div className="metric-header">
                <XCircle size={15} /> Не решено
              </div>
              <div className="metric-value">{currentSectionStats.unsolved}</div>
              <div className="metric-sub">{currentSectionStats.unsolvedPct}% от всех задач</div>
            </div>

            <div className="stats-metric-card metric-progress">
              <div className="metric-header">
                <Clock size={15} /> В процессе
              </div>
              <div className="metric-value">{currentSectionStats.inProgress}</div>
              <div className="metric-sub">{currentSectionStats.inProgressPct}% осталось решить</div>
            </div>

            <div className="stats-metric-card metric-total">
              <div className="metric-header">
                <CheckSquare size={15} /> Всего задач
              </div>
              <div className="metric-value">{currentSectionStats.total}</div>
              <div className="metric-sub">100% базы раздела</div>
            </div>
          </div>

          {/* Разбивка по категориям */}
          <div className="stats-categories-card">
            <h4 className="stats-categories-title">{currentSectionStats.breakdownTitle}</h4>
            <div className="stats-categories-list">
              {currentSectionStats.categories.map((cat, i) => {
                const pct = cat.total > 0 ? (cat.completed / cat.total) * 100 : 0;
                return (
                  <div className="stats-category-row" key={i}>
                    <div className="stats-cat-name">{cat.icon} {cat.name}</div>
                    <div className="stats-cat-bar-wrapper">
                      <div className="stats-cat-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="stats-cat-val">
                      {cat.note ? cat.note : `${cat.completed}/${cat.total}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {currentSectionStats.isDevelopment && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                fontSize: "12.5px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={16} style={{ flexShrink: 0, color: "var(--notion-blue)" }} />
              <span>Этот раздел находится в активной разработке. Практические задачи появятся в скором времени.</span>
            </div>
          )}
        </div>

        {/* Футер с кнопкой сброса статистики */}
        <div className="stats-modal-footer">
          <button
            className="stats-reset-btn"
            onClick={() => setResetConfirmOpen(true)}
            title="Сбросить статус всех решенных задач"
          >
            <RotateCcw size={14} /> Сбросить статистику
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;

