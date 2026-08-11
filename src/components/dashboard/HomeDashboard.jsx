import React from "react";
import { Link } from "@tanstack/react-router";
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
  Star,
  ExternalLink,
} from "lucide-react";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { REACT_TASKS, WARMUP_TASKS } from "../../react/data/tasksData";
import { ALL_ALGO_TASKS } from "../../algorithms/data/tasksData";

export const HomeDashboard = ({
  completedTotal,
  totalTasks,
  completedJsTotal = 0,
  totalJsCount = 0,
  completedTasks = {},
}) => {
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

  const algoPct = algoTotal > 0 ? Math.round((algoSolved / algoTotal) * 100) : 0;

  return (
    <div className="notion-home-container">
      {/* Notion Page Header */}
      <div className="notion-page-header">
        <h1 className="notion-page-title">Обзор платформы</h1>
        <p className="notion-page-subtitle">
          Интерактивная платформа для подготовки к собеседованиям и практики решения задач (260+ задач). Встроенный редактор кода и веб-консоль, песочница кандидата, эталонные решения и разборы теории.
        </p>
      </div>

      {/* Notion Callouts Grid (Быстрый старт & Open-Source) */}
      <div className="notion-callouts-grid">
        <div className="notion-callout-banner">
          <div className="notion-callout-icon">
            <Lightbulb size={20} style={{ color: "var(--notion-blue, #3b82f6)" }} />
          </div>
          <div className="notion-callout-content">
            <div className="notion-callout-title">Быстрый старт</div>
            <div className="notion-callout-text">
              Решайте задачи во встроенном редакторе или любимой IDE. Анализируйте код кандидата, изучайте эталонные решения O(N) / O(1), теоретические разборы и запускайте код в веб-консоли.
            </div>
          </div>
        </div>

        <div className="notion-callout-banner">
          <div className="notion-callout-icon">
            <Star size={20} style={{ color: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)" }} />
          </div>
          <div className="notion-callout-content">
            <div className="notion-callout-header-row">
              <span className="notion-callout-title">Open-Source проект</span>
              <a
                href="https://github.com/EvgeniiBogdanov/code-practice-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="notion-callout-badge-link"
              >
                <span>GitHub</span>
                <ExternalLink size={11} />
              </a>
            </div>
            <div className="notion-callout-text">
              Поддержите развитие платформы <a href="https://github.com/EvgeniiBogdanov/code-practice-platform" target="_blank" rel="noopener noreferrer" className="notion-text-link">звездой на GitHub</a> или внесите свой вклад новыми задачами и решениями.
            </div>
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
              {grandSolved}<span className="notion-stat-total">/{grandTotal}</span>
            </span>
            <span className="notion-stat-percent">{grandPct}%</span>
          </div>
          <div className="notion-stat-bar-track">
            <div className="notion-stat-bar-fill blue" style={{ width: `${grandPct}%` }} />
          </div>
        </div>

        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <Zap size={14} style={{ color: "#f59e0b" }} />
            <span>JavaScript</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {jsSolved}<span className="notion-stat-total">/{jsTotal}</span>
            </span>
            <span className="notion-stat-percent">{jsPct}%</span>
          </div>
          <div className="notion-stat-bar-track">
            <div className="notion-stat-bar-fill amber" style={{ width: `${jsPct}%` }} />
          </div>
        </div>

        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <Code2 size={14} style={{ color: "var(--notion-blue)" }} />
            <span>React</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {reactSolved}<span className="notion-stat-total">/{reactTotal}</span>
            </span>
            <span className="notion-stat-percent">{reactPct}%</span>
          </div>
          <div className="notion-stat-bar-track">
            <div className="notion-stat-bar-fill blue" style={{ width: `${reactPct}%` }} />
          </div>
        </div>

        <div className="notion-stat-card">
          <div className="notion-stat-label">
            <Brain size={14} style={{ color: "#a855f7" }} />
            <span>Алгоритмы</span>
          </div>
          <div className="notion-stat-val-row">
            <span className="notion-stat-val">
              {algoSolved}<span className="notion-stat-total">/{algoTotal}</span>
            </span>
            <span className="notion-stat-percent">{algoPct}%</span>
          </div>
          <div className="notion-stat-bar-track">
            <div className="notion-stat-bar-fill purple" style={{ width: `${algoPct}%` }} />
          </div>
        </div>
      </div>

      <hr className="notion-divider" />

      {/* Notion Section: Разделы подготовки (Gallery View) */}
      <div className="notion-section-block">
        <div className="notion-block-header">
          <FolderGit2 size={16} className="notion-block-icon" />
          <h2 className="notion-block-title">Разделы практики</h2>
        </div>

        <div className="notion-gallery-grid">
          {/* JavaScript Card */}
          <Link to="/javascript" className="notion-gallery-card">
            <div className="notion-card-cover amber-cover">
              <Zap size={24} style={{ color: "#f59e0b" }} />
            </div>
            <div className="notion-card-body">
              <div className="notion-card-header-row">
                <h3 className="notion-card-title">JavaScript</h3>
                <span className="notion-tag amber">{jsTotal} задач</span>
              </div>
              <p className="notion-card-desc">
                Циклы (while, for, for...of), замыкания, рекурсия, прототипы, `this`, каррирование, полифилы `Promise`, `Debounce`/`Throttle`, `Event Loop` и утилиты объектов.
              </p>
              <div className="notion-card-tags">
                <span className="notion-subtag">#loops</span>
                <span className="notion-subtag">#closures</span>
                <span className="notion-subtag">#event-loop</span>
                <span className="notion-subtag">#promises</span>
              </div>
              <div className="notion-card-footer">
                <span className="notion-card-progress">{jsSolved} из {jsTotal} решено ({jsPct}%)</span>
                <span className="notion-action-btn amber">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>

          {/* React Card */}
          <Link to="/react" className="notion-gallery-card">
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
                <span className="notion-card-progress">{reactSolved} из {reactTotal} решено ({reactPct}%)</span>
                <span className="notion-action-btn blue">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>

          {/* Algorithms Card */}
          <Link to="/algorithms" className="notion-gallery-card">
            <div className="notion-card-cover purple-cover">
              <Brain size={24} style={{ color: "#a855f7" }} />
            </div>
            <div className="notion-card-body">
              <div className="notion-card-header-row">
                <h3 className="notion-card-title">Алгоритмы</h3>
                <span className="notion-tag purple">{algoTotal} задач</span>
              </div>
              <p className="notion-card-desc">
                Классические алгоритмические задачи с собеседований: два указателя, скользящее окно, бинарный поиск, графы и деревья.
              </p>
              <div className="notion-card-tags">
                <span className="notion-subtag">#two-pointers</span>
                <span className="notion-subtag">#sliding-window</span>
                <span className="notion-subtag">#binary-search</span>
              </div>
              <div className="notion-card-footer">
                <span className="notion-card-progress">{algoSolved} из {algoTotal} решено ({algoPct}%)</span>
                <span className="notion-action-btn purple">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </Link>
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
                <Code2 size={16} />
              </div>
              <h4 className="notion-feature-title">Встроенный редактор кода</h4>
            </div>
            <p className="notion-feature-desc">
              Редактирование JS, TS и React (JSX/TSX) прямо в браузере, автоформатирование Prettier, подсветка синтаксиса и полноэкранный режим (/open).
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge amber">
                <Terminal size={16} />
              </div>
              <h4 className="notion-feature-title">Интерактивная веб-консоль</h4>
            </div>
            <p className="notion-feature-desc">
              Мгновенный запуск кода (Ctrl+Enter / Cmd+Enter) с замером времени выполнения (⚡ ms), умным сворачиванием и выводом всех типов данных.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge purple">
                <Brain size={16} />
              </div>
              <h4 className="notion-feature-title">Песочница кандидата</h4>
            </div>
            <p className="notion-feature-desc">
              Запускаемый live-код с багами и недочетами реальных кандидатов для отработки навыка проведения Code Review.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge green">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="notion-feature-title">Эталонные решения</h4>
            </div>
            <p className="notion-feature-desc">
              Оптимизированные решения с разбором сложности O(N) / O(1), выбором нескольких вариантов и лучшими практиками собеседований.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge blue">
                <ClipboardCheck size={16} />
              </div>
              <h4 className="notion-feature-title">Чек-листы и вопросы</h4>
            </div>
            <p className="notion-feature-desc">
              Вопросы интервьюера и критерии самопроверки, проверяющие усвоение материала перед выходом на интервью.
            </p>
          </div>

          <div className="notion-feature-card">
            <div className="notion-feature-header">
              <div className="notion-feature-icon-badge amber">
                <Lightbulb size={16} />
              </div>
              <h4 className="notion-feature-title">Поиск и шпаргалки</h4>
            </div>
            <p className="notion-feature-desc">
              Мгновенный поиск по всей базе задач через Command Palette (Cmd+K / Ctrl+K), модальные шпаргалки и автоматический учет прогресса.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
