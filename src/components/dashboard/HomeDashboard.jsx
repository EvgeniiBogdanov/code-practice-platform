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
  Sparkles,
  Award,
  Calendar,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { REACT_TASKS, WARMUP_TASKS } from "../../react/data/tasksData";
import { ALL_ALGO_TASKS } from "../../algorithms/data/tasksData";
import { ALL_TASKS } from "../../data/tasksRegistry";
import { APP_VERSION } from "../../constants/uiConstants";

export const HomeDashboard = ({
  completedTotal,
  totalTasks,
  completedJsTotal = 0,
  totalJsCount = 0,
  completedTasks = {},
}) => {
  // Helper to check if task is solved
  const isSolved = (id) => {
    if (!completedTasks) return false;
    const val = completedTasks[id] ?? completedTasks[String(id)];
    return val === true || val === "solved";
  };

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
    <div className="home-container">
      {/* Standard Page Header */}
      <div className="page-main-header">
        <div className="platform-title-row">
          <h1 className="page-main-title">Code Practice Platform</h1>
          <span className="platform-version-tag">v{APP_VERSION}</span>
        </div>
        <p className="page-main-subtitle">
          Интерактивная платформа для подготовки к техническим собеседованиям и практики решения задач ({grandTotal > 0 ? `${grandTotal} задач` : "280+ задач"}). Встроенный редактор кода с анализом типов, песочница кандидата, живой запуск React и интерактивная веб-консоль, умное интервальное повторение и эталонные решения.
        </p>
      </div>

      {/* Standard Callouts Grid (Быстрый старт & Open-Source) */}
      <div className="callouts-grid">
        <div className="callout-banner">
          <div className="callout-icon">
            <Lightbulb size={20} style={{ color: "var(--accent-blue, #3b82f6)" }} />
          </div>
          <div className="callout-content">
            <div className="callout-title">Быстрый старт</div>
            <div className="callout-text">
              Решайте задачи во встроенном редакторе или любимой IDE. Анализируйте код кандидата, изучайте эталонные решения O(N) / O(1), проверяйте критерии самопроверки и запускайте код в живой консоли и React-песочнице.
            </div>
          </div>
        </div>

        <div className="callout-banner">
          <div className="callout-icon">
            <Star size={20} style={{ color: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)" }} />
          </div>
          <div className="callout-content">
            <div className="callout-title">Open-Source проект</div>
            <div className="callout-text">
              Поддержите развитие платформы <a href="https://github.com/EvgeniiBogdanov/code-practice-platform" target="_blank" rel="noopener noreferrer" className="text-link">звездой на GitHub</a> или внесите свой вклад новыми задачами и решениями.
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Standard KPI Summary Row (Database Summary View) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <TrendingUp size={14} style={{ color: "var(--accent-blue)" }} />
            <span>Общий прогресс</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-val">
              {grandSolved}<span className="stat-total">/{grandTotal}</span>
            </span>
            <span className="stat-percent">{grandPct}%</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill blue" style={{ width: `${grandPct}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <Zap size={14} style={{ color: "#f59e0b" }} />
            <span>JavaScript</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-val">
              {jsSolved}<span className="stat-total">/{jsTotal}</span>
            </span>
            <span className="stat-percent">{jsPct}%</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill amber" style={{ width: `${jsPct}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <Code2 size={14} style={{ color: "var(--accent-blue)" }} />
            <span>React</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-val">
              {reactSolved}<span className="stat-total">/{reactTotal}</span>
            </span>
            <span className="stat-percent">{reactPct}%</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill blue" style={{ width: `${reactPct}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <Brain size={14} style={{ color: "#a855f7" }} />
            <span>Алгоритмы</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-val">
              {algoSolved}<span className="stat-total">/{algoTotal}</span>
            </span>
            <span className="stat-percent">{algoPct}%</span>
          </div>
          <div className="stat-bar-track">
            <div className="stat-bar-fill purple" style={{ width: `${algoPct}%` }} />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Standard Section: Разделы подготовки (Gallery View) */}
      <div className="section-block">
        <div className="block-header">
          <FolderGit2 size={16} className="block-icon" />
          <h2 className="block-title">Разделы практики</h2>
        </div>

        <div className="gallery-grid">
          {/* JavaScript Card */}
          <div className="gallery-card">
            <div className="card-cover amber-cover">
              <Zap size={24} style={{ color: "#f59e0b" }} />
            </div>
            <div className="card-body">
              <div className="card-header-row">
                <h3 className="card-title">JavaScript</h3>
                <span className="tag amber">{jsTotal} задач</span>
              </div>
              <p className="card-desc">
                Циклы (while, for, for...of), замыкания, рекурсия, прототипы, `this`, каррирование, полифилы `Promise`, `Debounce`/`Throttle`, `Event Loop` и утилиты объектов.
              </p>
              <div className="card-tags">
                <span className="subtag">#loops</span>
                <span className="subtag">#closures</span>
                <span className="subtag">#event-loop</span>
                <span className="subtag">#promises</span>
              </div>
              <div className="card-footer">
                <span className="card-progress">{jsSolved} из {jsTotal} решено ({jsPct}%)</span>
                <Link to="/javascript" className="action-btn amber">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* React Card */}
          <div className="gallery-card">
            <div className="card-cover blue-cover">
              <Code2 size={24} style={{ color: "var(--accent-blue)" }} />
            </div>
            <div className="card-body">
              <div className="card-header-row">
                <h3 className="card-title">React</h3>
                <span className="tag blue">{totalTasks} задач</span>
              </div>
              <p className="card-desc">
                Практика кастомных хуков, паттерны рефакторинга компонентов, оптимизация перерендеров, Redux Toolkit, React Live Runner и TypeScript.
              </p>
              <div className="card-tags">
                <span className="subtag">#hooks</span>
                <span className="subtag">#refactoring</span>
                <span className="subtag">#rtk</span>
                <span className="subtag">#typescript</span>
              </div>
              <div className="card-footer">
                <span className="card-progress">{reactSolved} из {reactTotal} решено ({reactPct}%)</span>
                <Link to="/react" className="action-btn blue">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Algorithms Card */}
          <div className="gallery-card">
            <div className="card-cover purple-cover">
              <Brain size={24} style={{ color: "#a855f7" }} />
            </div>
            <div className="card-body">
              <div className="card-header-row">
                <h3 className="card-title">Алгоритмы</h3>
                <span className="tag purple">{algoTotal} задач</span>
              </div>
              <p className="card-desc">
                Классические алгоритмические задачи с собеседований: два указателя, скользящее окно, бинарный поиск, графы и деревья с анализом O(N) / O(1).
              </p>
              <div className="card-tags">
                <span className="subtag">#two-pointers</span>
                <span className="subtag">#sliding-window</span>
                <span className="subtag">#binary-search</span>
              </div>
              <div className="card-footer">
                <span className="card-progress">{algoSolved} из {algoTotal} решено ({algoPct}%)</span>
                <Link to="/algorithms" className="action-btn purple">
                  <span>Открыть</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Standard Callout Grid — Возможности платформы */}
      <div className="section-block">
        <div className="block-header">
          <BookOpen size={16} className="block-icon" />
          <h2 className="block-title">Возможности платформы</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge blue">
                <Code2 size={16} />
              </div>
              <h4 className="feature-title">Редактор и анализ типов</h4>
            </div>
            <p className="feature-desc">
              Редактирование JS, TS и JSX/TSX с живой проверкой типов на лету, всплывающими подсказками сигнатур, Emmet JSX и автоформатированием Prettier.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge amber">
                <Terminal size={16} />
              </div>
              <h4 className="feature-title">Веб-консоль и React Runner</h4>
            </div>
            <p className="feature-desc">
              Мгновенный запуск кода (Ctrl+Enter) с замером времени (<Zap size={12} style={{ display: "inline", verticalAlign: "middle", marginBottom: "1px" }} /> ms) и живой рендеринг компонентов React с Redux Toolkit, Zustand и защитой от зацикливаний.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge purple">
                <Brain size={16} />
              </div>
              <h4 className="feature-title">Песочница кандидата</h4>
            </div>
            <p className="feature-desc">
              Запускаемый live-код с реальными багами и недочетами кандидатов для отработки навыка проведения технического Code Review.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge green">
                <RotateCcw size={16} />
              </div>
              <h4 className="feature-title">Интервальное повторение SM-2</h4>
            </div>
            <p className="feature-desc">
              Календарный алгоритм закрепления задач (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д ➔ Мастер) с учетом часового пояса и автосбросом кода в день повтора.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge green">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="feature-title">Эталонные решения</h4>
            </div>
            <p className="feature-desc">
              Оптимизированные решения с разбором сложности O(N) / O(1), выбором нескольких вариантов реализации и лучшими практиками собеседований.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <div className="feature-icon-badge blue">
                <ClipboardCheck size={16} />
              </div>
              <h4 className="feature-title">Чек-листы, поиск и таймер</h4>
            </div>
            <p className="feature-desc">
              Критерии самопроверки и вопросы интервьюера, быстрый поиск задач через Command Palette (Cmd+K), таймер собеседования и шпаргалки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
