import React from "react";
import {
  Code2,
  Zap,
  Brain,
  Clock,
  Terminal,
  ClipboardCheck,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  BookOpen,
} from "lucide-react";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { REACT_TASKS, WARMUP_TASKS } from "../../react/data/tasksData";
import { ALL_ALGO_TASKS } from "../../algorithms/data/tasksData";

export const HomeDashboard = ({
  setActiveSection,
  completedTotal,
  totalTasks,
  completedJsTotal = 0,
  totalJsCount = 0,
  completedTasks = {},
  setSelectedTask,
  setActiveTab,
}) => {
  const handleOpenReact = () => {
    setActiveSection("react");
    if (WARMUP_TASKS.length > 0 && setSelectedTask) {
      setSelectedTask(WARMUP_TASKS[0]);
    }
    if (setActiveTab) setActiveTab("candidate");
  };

  const handleOpenJs = () => {
    setActiveSection("javascript");
    if (JS_TASKS.length > 0 && setSelectedTask) {
      setSelectedTask(JS_TASKS[0]);
    }
    if (setActiveTab) setActiveTab("candidate");
  };

  // Helper to check if task is solved
  const isSolved = (id) =>
    completedTasks && (completedTasks[id] === true || completedTasks[id] === "solved");

  // Dynamic calculations across all sections
  const reactList = REACT_TASKS && REACT_TASKS.length > 0 ? REACT_TASKS : WARMUP_TASKS;
  const jsList = JS_TASKS || [];
  const algoList = ALL_ALGO_TASKS || [];

  const reactTotal = totalTasks || reactList.length;
  const reactSolved = completedTotal !== undefined ? completedTotal : reactList.filter((t) => isSolved(t.id)).length;

  const jsTotal = totalJsCount || jsList.length;
  const jsSolved = completedJsTotal !== undefined ? completedJsTotal : jsList.filter((t) => isSolved(t.id)).length;

  const algoTotal = algoList.length;
  const algoSolved = algoList.filter((t) => isSolved(t.id)).length;

  // Grand Total dynamically sums all active sections
  const grandTotal = reactTotal + jsTotal + algoTotal;
  const grandSolved = reactSolved + jsSolved + algoSolved;
  const grandPct = grandTotal > 0 ? Math.round((grandSolved / grandTotal) * 100) : 0;
  const jsPct = jsTotal > 0 ? Math.round((jsSolved / jsTotal) * 100) : 0;
  const reactPct = reactTotal > 0 ? Math.round((reactSolved / reactTotal) * 100) : 0;

  return (
    <div className="notion-home-container">
      {/* Notion Page Header */}
      <div className="notion-page-header">
        <div className="notion-page-icon-wrapper">
          <span className="notion-page-emoji">🚀</span>
        </div>
        <h1 className="notion-page-title">Обзор платформы</h1>
        <p className="notion-page-subtitle">
          Интерактивная среда для подготовки к Frontend-собеседованиям. Практика на реальных задачах, кандидатский код, эталонные решения и разборы теории.
        </p>
      </div>

      {/* Notion Callout Banner */}
      <div className="notion-callout-banner">
        <div className="notion-callout-icon">💡</div>
        <div className="notion-callout-content">
          <div className="notion-callout-title">Быстрый старт</div>
          <div className="notion-callout-text">
            Выберите интересующий раздел практики ниже, анализируйте исходный код кандидата, изучайте оптимизированные решения и используйте шпаргалки для успешного прохождения интервью.
          </div>
        </div>
      </div>

      {/* Notion KPI Summary Row (Database Summary View) */}
      <div className="notion-stats-grid">
        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <TrendingUp size={14} style={{ color: "var(--notion-blue)" }} />
            <span>Общий прогресс</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {grandSolved} <span className="notion-stat-sub">/ {grandTotal} задач</span>
            </span>
            <span className="notion-tag blue">{grandPct}%</span>
          </div>
          <div className="notion-progress-bar">
            <div className="notion-progress-fill blue" style={{ width: `${grandPct}%` }} />
          </div>
        </div>

        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <Zap size={14} style={{ color: "#f59e0b" }} />
            <span>Раздел JavaScript</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {completedJsTotal} <span className="notion-stat-sub">/ {jsTotal}</span>
            </span>
            <span className="notion-tag amber">{jsPct}%</span>
          </div>
          <div className="notion-progress-bar">
            <div className="notion-progress-fill amber" style={{ width: `${jsPct}%` }} />
          </div>
        </div>

        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <Code2 size={14} style={{ color: "var(--notion-blue)" }} />
            <span>Раздел React</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {completedTotal} <span className="notion-stat-sub">/ {totalTasks}</span>
            </span>
            <span className="notion-tag blue">{reactPct}%</span>
          </div>
          <div className="notion-progress-bar">
            <div className="notion-progress-fill blue" style={{ width: `${reactPct}%` }} />
          </div>
        </div>
      </div>

      <hr className="notion-divider" />

      {/* Notion Gallery View — Разделы практики */}
      <div className="notion-section-block">
        <div className="notion-block-header">
          <FolderGit2 size={16} className="notion-block-icon" />
          <h2 className="notion-block-title">Разделы практики</h2>
        </div>

        <div className="notion-gallery-grid">
          {/* JavaScript Card */}
          <div className="notion-gallery-card" onClick={handleOpenJs}>
            <div className="notion-card-cover amber-cover">
              <Zap size={24} style={{ color: "#f59e0b" }} />
            </div>
            <div className="notion-card-body">
              <div className="notion-card-header-row">
                <h3 className="notion-card-title">JavaScript</h3>
                <span className="notion-tag amber">{jsTotal} задач</span>
              </div>
              <p className="notion-card-desc">
                Замыкания, рекурсия, прототипы, `this`, каррирование, полифилы `Promise`, `Debounce`, `Throttle`, `Event Loop` и утилиты объектов.
              </p>
              <div className="notion-card-tags">
                <span className="notion-subtag">#closures</span>
                <span className="notion-subtag">#event-loop</span>
                <span className="notion-subtag">#promises</span>
                <span className="notion-subtag">#prototypes</span>
              </div>
              <div className="notion-card-footer">
                <span className="notion-card-progress">{completedJsTotal} из {jsTotal} решено ({jsPct}%)</span>
                <button
                  className="notion-action-btn amber"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenJs();
                  }}
                >
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* React Card */}
          <div className="notion-gallery-card" onClick={handleOpenReact}>
            <div className="notion-card-cover blue-cover">
              <Code2 size={24} style={{ color: "var(--notion-blue)" }} />
            </div>
            <div className="notion-card-body">
              <div className="notion-card-header-row">
                <h3 className="notion-card-title">React</h3>
                <span className="notion-tag blue">{totalTasks} задач</span>
              </div>
              <p className="notion-card-desc">
                Практика кастомных хуков, паттерны рефакторинга компонентов, оптимизация перерендеров, Redux Toolkit и интеграция с TypeScript.
              </p>
              <div className="notion-card-tags">
                <span className="notion-subtag">#hooks</span>
                <span className="notion-subtag">#refactoring</span>
                <span className="notion-subtag">#rtk</span>
                <span className="notion-subtag">#typescript</span>
              </div>
              <div className="notion-card-footer">
                <span className="notion-card-progress">{completedTotal} из {totalTasks} решено ({reactPct}%)</span>
                <button
                  className="notion-action-btn blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReact();
                  }}
                >
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Algorithms Card */}
          <div className="notion-gallery-card disabled">
            <div className="notion-card-cover purple-cover">
              <Brain size={24} style={{ color: "#a855f7" }} />
            </div>
            <div className="notion-card-body">
              <div className="notion-card-header-row">
                <h3 className="notion-card-title">Алгоритмы</h3>
                <span className="notion-tag gray">Скоро</span>
              </div>
              <p className="notion-card-desc">
                Классические алгоритмические задачи с собеседований: два указателя, скользящее окно, бинарный поиск, графы и деревья.
              </p>
              <div className="notion-card-tags">
                <span className="notion-subtag">#two-pointers</span>
                <span className="notion-subtag">#sliding-window</span>
                <span className="notion-subtag">#trees</span>
              </div>
              <div className="notion-card-footer">
                <span className="notion-card-progress">В разработке</span>
                <button className="notion-action-btn disabled" disabled>
                  <Clock size={13} />
                  <span>Скоро</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="notion-divider" />

      {/* Notion Callout Grid — Возможности платформы */}
      <div className="notion-section-block">
        <div className="notion-block-header">
          <BookOpen size={16} className="notion-block-icon" />
          <h2 className="notion-block-title">Возможности платформы</h2>
        </div>

        <div className="notion-features-grid">
          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge blue">
                <Terminal size={16} />
              </div>
              <h4 className="notion-feature-title">Песочница кандидата</h4>
            </div>
            <p className="notion-feature-desc">
              Запускаемый код с багами и недочетами реальных кандидатов для тренировки навыка проведения Code Review.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge green">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="notion-feature-title">Эталонное решение</h4>
            </div>
            <p className="notion-feature-desc">
              Чистое оптимизированное решение с разбором архитектуры, сложности O(N) / O(1) и лучшими практиками.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge purple">
                <ClipboardCheck size={16} />
              </div>
              <h4 className="notion-feature-title">Чек-лист и вопросы</h4>
            </div>
            <p className="notion-feature-desc">
              Вопросы интервьюера и требования самопроверки, проверяющие усвоение темы перед собеседованием.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge amber">
                <Lightbulb size={16} />
              </div>
              <h4 className="notion-feature-title">Шпаргалки и аналитика</h4>
            </div>
            <p className="notion-feature-desc">
              Быстрый поиск патернов в Command Palette (`Cmd+K`), шпаргалки и автоматический учет прогресса.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
