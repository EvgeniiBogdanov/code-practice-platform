import React, { useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  ArrowRight,
  FileText,
  LayoutList,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Circle,
  Folder,
  ChevronRight,
  Zap,
  Check,
  X,
  Calendar,
  RotateCcw,
  Flame,
  Minus,
  Clock,
} from "lucide-react";
import { parseMarkdownBlocks } from "../../utils/markdownParser";
import TheoryCodeBlock from "./TheoryCodeBlock";
import { usePractice } from "../../context/PracticeContext";
import { FILE_ICON_COLOR } from "../../constants/uiConstants";
import { useReviewStore } from "../../stores/useReviewStore";
import { formatNextReviewDate, isTaskDue } from "../../utils/spacedRepetition";

export const GroupOverviewView = ({ groupMeta, groupTasks = [] }) => {
  const context = usePractice();
  const completedTasks = context?.completedTasks || {};
  const reviews = useReviewStore((state) => state.reviews);
  const location = useLocation();

  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "completed" | "uncompleted"
  const [viewMode, setViewModeState] = useState(() => {
    try {
      const saved = localStorage.getItem("playground_group_view_mode");
      return saved === "cards" ? "cards" : "list";
    } catch {
      return "list";
    }
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem("playground_group_view_mode", mode);
    } catch {
      // ignore
    }
  };
  const [collapsedSubgroups, setCollapsedSubgroups] = useState({});

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

  // Helper для определения точного статуса задачи
  const getTaskStatus = (taskId) => {
    const val = completedTasks[taskId] ?? completedTasks[String(taskId)];
    if (val === true || val === "solved") return "solved";
    if (val === "unsolved") return "unsolved";
    return "unstarted";
  };

  // Очищаем заголовок H1 и секции 10 и 11 из общего текста статьи
  const rawText = useMemo(() => {
    if (!groupMeta?.infoRaw) return "";
    return groupMeta.infoRaw
      .replace(/^#\s+[^\n]*\n*/g, "")
      .replace(/## 10\. Практика: задачи для закрепления[\s\S]*/g, "")
      .trim();
  }, [groupMeta]);

  const blocks = useMemo(() => {
    if (!rawText) return [];
    return parseMarkdownBlocks(rawText);
  }, [rawText]);

  // Расчет примерного времени чтения (180 слов в минуту)
  const readingTimeMinutes = useMemo(() => {
    if (!rawText) return 5;
    const wordCount = rawText.split(/\s+/).length;
    return Math.max(3, Math.ceil(wordCount / 180));
  }, [rawText]);

  // Статистика решения задач в данном разделе
  const stats = useMemo(() => {
    const total = groupTasks.length;
    const completed = groupTasks.filter((t) => {
      const s = getTaskStatus(t.id);
      return s === "solved";
    }).length;
    const remaining = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percent };
  }, [groupTasks, completedTasks]);

  const deferredStatusFilter = React.useDeferredValue(statusFilter);

  // Фильтрация задач по статусу (Все / Решено / Не решено)
  const filteredTasks = useMemo(() => {
    return groupTasks.filter((task) => {
      const status = getTaskStatus(task.id);
      if (deferredStatusFilter === "completed") {
        return status === "solved";
      }
      if (deferredStatusFilter === "uncompleted") {
        return status === "unsolved";
      }
      return true;
    });
  }, [groupTasks, deferredStatusFilter, completedTasks]);

  // Группировка отфильтрованных задач по подгруппам (для JS)
  const groupedSubgroups = useMemo(() => {
    const map = {};
    filteredTasks.forEach((task) => {
      const sub = task.subgroup || "Основные задачи";
      if (!map[sub]) map[sub] = [];
      map[sub].push(task);
    });
    return map;
  }, [filteredTasks]);

  const hasSubgroups = useMemo(() => {
    return groupTasks.some((t) => Boolean(t.subgroup));
  }, [groupTasks]);

  const toggleSubgroupCollapse = (subName) => {
    setCollapsedSubgroups((prev) => ({
      ...prev,
      [subName]: !prev[subName],
    }));
  };

  // Автоматический скролл по якорным ссылкам при загрузке или смене хэша, либо сброс наверх при открытии папки
  React.useEffect(() => {
    const handleScrollOrAnchor = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = decodeURIComponent(hash.replace("#", ""));
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          return;
        }
      }
      // При переходе в новую тему/папку без якоря сбрасываем скролл в начало статьи
      const contentArea = document.querySelector(".content-area");
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    handleScrollOrAnchor();
    window.addEventListener("hashchange", handleScrollOrAnchor);
    return () => window.removeEventListener("hashchange", handleScrollOrAnchor);
  }, [groupMeta?.name, groupMeta?.title, location.pathname]);

  const firstTask = groupTasks[0];

  // Спецификация практических задач темы (Раздел 10)
  const practiceTasksList = groupMeta?.practiceTasksList || [];

  // Спецификация полезных материалов (Раздел 11)
  const articleLinksList = groupMeta?.articleLinksList || [];

  const isJs = location.pathname.includes("/javascript");
  const isReact = location.pathname.includes("/react");
  const taskRoute = isJs ? "/javascript/$taskId" : isReact ? "/react/$taskId" : "/algorithms/$taskId";
  
  // Цвет кнопки строго соответствует цвету иконки конкретной открытой папки
  const folderColor = groupMeta?.color || (isJs ? "#f59e0b" : isReact ? "var(--accent-blue, #3b82f6)" : "#a855f7");
  const folderBg = groupMeta?.bg || `color-mix(in srgb, ${folderColor} 12%, transparent)`;
  const isLightColor =
    folderColor === "#f59e0b" ||
    folderColor === "#fbbf24" ||
    folderColor === "#eab308" ||
    folderColor?.toLowerCase?.() === "#f59e0b";
  const hoverTextColor = isLightColor ? "#1c1917" : "#ffffff";

  return (
    <div className="task-view-container article-view" style={{ padding: "28px 36px 80px" }}>
      <article className="article-page folder-page-wrapper">
        {/* Standard Folder Header Hero */}
        <header className="article-header">
          <div className="folder-hero">
            <div
              className="folder-emoji-box"
              style={groupMeta?.bg ? { background: groupMeta.bg } : undefined}
            >
              {groupMeta?.renderIcon ? (
                groupMeta.renderIcon(26)
              ) : groupMeta?.icon ? (
                React.createElement(groupMeta.icon, {
                  size: 26,
                  style: { color: groupMeta.color || "var(--text-main)" },
                })
              ) : (
                <Folder size={26} style={{ color: groupMeta?.color || "var(--color-primary)" }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <h1 className="folder-hero-title">
                  {groupMeta?.name || groupMeta?.title || "Раздел"}
                </h1>

                {firstTask && (
                  <Link
                    to={taskRoute}
                    params={{ taskId: String(firstTask.id) }}
                    className="home-section-btn"
                    style={{
                      "--btn-color": folderColor,
                      "--btn-bg": folderBg,
                      "--btn-hover-bg": folderColor,
                      "--btn-text": folderColor,
                      "--btn-hover-text": hoverTextColor,
                    }}
                  >
                    <span>Решать задачи</span> <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <p className="folder-hero-desc" style={{ marginTop: "4px" }}>
                {groupMeta?.desc || `Все практические задачи и упражнения раздела «${groupMeta?.name || "Раздел"}».`}
              </p>
            </div>
          </div>
        </header>

        {/* Standard Database View (Files / Tasks list) */}
        <div className="database-view-container">
            {/* Standard Database Controls Toolbar */}
            <div className="folder-toolbar">
              {/* Status Filter Pills: Все, Решено, Не решено */}
              <div className="pill-group" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  className={`header-action-btn ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  Все
                </button>
                <button
                  className={`header-action-btn ${statusFilter === "completed" ? "active" : ""}`}
                  onClick={() => setStatusFilter("completed")}
                >
                  Решено
                </button>
                <button
                  className={`header-action-btn ${statusFilter === "uncompleted" ? "active" : ""}`}
                  onClick={() => setStatusFilter("uncompleted")}
                >
                  Не решено
                </button>
              </div>

              {/* View Switcher: Список vs Карточки */}
              <div className="db-view-switch" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  className={`header-action-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Вид: Список"
                >
                  <LayoutList size={14} /> Список
                </button>
                <button
                  className={`header-action-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Вид: Карточки"
                >
                  <LayoutGrid size={14} /> Карточки
                </button>
              </div>
            </div>

            {/* Database Column Header (for List view) */}
            {viewMode === "list" && filteredTasks.length > 0 && (
              <div className="db-columns-header">
                <span className="db-col-name">Папка / Файл</span>
                <div className="db-col-meta">
                  <span className="db-col-last-solved">Решение</span>
                  <span className="db-col-next-review">Повторение</span>
                  <span className="db-col-status">Статус</span>
                </div>
              </div>
            )}

            {/* Render Filtered Tasks */}
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "54px 20px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                  Задач по выбранному фильтру нет
                </div>
                <button
                  onClick={() => setStatusFilter("all")}
                  className="header-action-btn active"
                  style={{ marginTop: "12px", display: "inline-flex" }}
                >
                  Показать все задачи
                </button>
              </div>
            ) : viewMode === "list" ? (
              /* Standard List View — Exact Sidebar Tree System, scaled for page content */
              <div className="folder-page-tree">
                {hasSubgroups ? (
                  Object.entries(groupedSubgroups).map(([subgroupName, tasks]) => {
                    if (tasks.length === 0) return null;
                    const isCollapsed = Boolean(collapsedSubgroups[subgroupName]);
                    const completedSubCount = tasks.filter((t) => getTaskStatus(t.id) === "solved").length;
                    const isSubCompleted = tasks.length > 0 && completedSubCount === tasks.length;
                    return (
                      <div className="tree-group-block" key={subgroupName}>
                        <div
                          className="tree-node-header subgroup-header"
                          onClick={() => toggleSubgroupCollapse(subgroupName)}
                        >
                          <div className="icon-toggle-wrapper">
                            <div className="icon-default">
                              <Folder size={17} style={{ color: groupMeta?.color || "var(--color-primary, #3b82f6)" }} />
                            </div>
                            <div className={`icon-chevron ${!isCollapsed ? "expanded" : ""}`}>
                              <ChevronRight size={15} />
                            </div>
                          </div>
                          <span className="node-title">{subgroupName}</span>
                          {statusFilter === "all" ? (
                            <span className={`node-count ${isSubCompleted ? "completed" : ""}`}>
                              {completedSubCount}/{tasks.length}
                            </span>
                          ) : (
                            <span className="node-count">
                              {tasks.length}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="tree-tasks-container">
                            {tasks.map((task) => {
                              const s = getTaskStatus(task.id);
                              const isDone = s === "solved";
                              const isUnsolved = s === "unsolved";

                              const taskReview = reviews[String(task.id)] || reviews[task.id];
                              const lastReviewedAt = taskReview?.lastReviewedAt;
                              const nextReviewAt = taskReview?.nextReviewAt;
                              const isDue = isTaskDue(taskReview);
                              const intervalDays = taskReview?.intervalDays;

                              return (
                                <Link
                                  key={task.id}
                                  to={taskRoute}
                                  params={{ taskId: String(task.id) }}
                                  className={`task-btn tree-task-btn ${isDue ? "task-is-due" : ""}`}
                                >
                                  <span className="task-btn-title">
                                    {isDue ? (
                                      <Flame size={16} className="node-file-icon flame-pulse-icon" style={{ color: "#ef4444" }} />
                                    ) : (
                                      <FileText size={16} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                                    )}
                                    <span className="task-btn-text">{task.title}</span>
                                  </span>

                                  <div className="task-row-meta">
                                    {/* Бейдж даты последнего решения */}
                                    {lastReviewedAt ? (
                                      <span
                                        className="folder-task-badge badge-last-solved"
                                        title={`Дата последнего решения: ${new Date(lastReviewedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`}
                                      >
                                        <Calendar size={11} className="badge-icon" />
                                        <span>{formatLastSolved(lastReviewedAt)}</span>
                                      </span>
                                    ) : (
                                      <span className="folder-task-badge badge-empty" title="Ещё не решалась">
                                        <Minus size={13} className="folder-empty-dash" />
                                      </span>
                                    )}

                                    {/* Бейдж сколько до повторного решения задачи */}
                                    {isDue ? (
                                      <span
                                        className="folder-task-badge badge-next-due"
                                        title="Срок повторения подошел! Пора повторить сегодня"
                                      >
                                        <Flame size={11} className="flame-pulse-icon" />
                                        <span>Пора повторить</span>
                                      </span>
                                    ) : nextReviewAt ? (
                                      <span
                                        className="folder-task-badge badge-next-scheduled"
                                        title={`Следующее повторение: ${formatNextReviewDate(nextReviewAt)} (интервал: ${intervalDays} дн.)`}
                                      >
                                        <RotateCcw size={11} className="badge-icon" />
                                        <span>{formatNextReviewDate(nextReviewAt)}</span>
                                      </span>
                                    ) : (
                                      <span className="folder-task-badge badge-next-empty" title="Повторение не запланировано">
                                        <Minus size={13} className="folder-empty-dash" />
                                      </span>
                                    )}

                                    {/* Иконка статуса */}
                                    <span className="task-row-status-icon">
                                      {isDone && (
                                        <span className="dropdown-item-check" title="Решено">
                                          <Check size={14} />
                                        </span>
                                      )}
                                      {isUnsolved && (
                                        <span className="dropdown-item-unsolved" title="Не решено">
                                          <X size={14} />
                                        </span>
                                      )}
                                      {!isDone && !isUnsolved && (
                                        <span className="dropdown-item-empty" title="Не начато">
                                          <Minus size={13} className="folder-empty-dash" />
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="tree-tasks-container" style={{ marginLeft: 0, paddingLeft: 0, borderLeft: "none" }}>
                    {filteredTasks.map((task) => {
                      const s = getTaskStatus(task.id);
                      const isDone = s === "solved";
                      const isUnsolved = s === "unsolved";

                      const taskReview = reviews[String(task.id)] || reviews[task.id];
                      const lastReviewedAt = taskReview?.lastReviewedAt;
                      const nextReviewAt = taskReview?.nextReviewAt;
                      const isDue = isTaskDue(taskReview);
                      const intervalDays = taskReview?.intervalDays;

                      return (
                        <Link
                          key={task.id}
                          to={taskRoute}
                          params={{ taskId: String(task.id) }}
                          className={`task-btn tree-task-btn ${isDue ? "task-is-due" : ""}`}
                        >
                          <span className="task-btn-title">
                            {isDue ? (
                              <Flame size={16} className="node-file-icon flame-pulse-icon" style={{ color: "#ef4444" }} />
                            ) : (
                              <FileText size={16} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                            )}
                            <span className="task-btn-text">{task.title}</span>
                          </span>

                          <div className="task-row-meta">
                            {/* Бейдж даты последнего решения */}
                            {lastReviewedAt ? (
                              <span
                                className="folder-task-badge badge-last-solved"
                                title={`Дата последнего решения: ${new Date(lastReviewedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}`}
                              >
                                <Calendar size={11} className="badge-icon" />
                                <span>{formatLastSolved(lastReviewedAt)}</span>
                              </span>
                            ) : (
                              <span className="folder-task-badge badge-empty" title="Ещё не решалась">
                                <Minus size={13} className="folder-empty-dash" />
                              </span>
                            )}

                            {/* Бейдж сколько до повторного решения задачи */}
                            {isDue ? (
                              <span
                                className="folder-task-badge badge-next-due"
                                title="Срок повторения подошел! Пора повторить сегодня"
                              >
                                <Flame size={11} className="flame-pulse-icon" />
                                <span>Пора повторить</span>
                              </span>
                            ) : nextReviewAt ? (
                              <span
                                className="folder-task-badge badge-next-scheduled"
                                title={`Следующее повторение: ${formatNextReviewDate(nextReviewAt)} (интервал: ${intervalDays} дн.)`}
                              >
                                <RotateCcw size={11} className="badge-icon" />
                                <span>{formatNextReviewDate(nextReviewAt)}</span>
                              </span>
                            ) : (
                              <span className="folder-task-badge badge-next-empty" title="Повторение не запланировано">
                                <Minus size={13} className="folder-empty-dash" />
                              </span>
                            )}

                            {/* Иконка статуса */}
                            <span className="task-row-status-icon">
                              {isDone && (
                                <span className="dropdown-item-check" title="Решено">
                                  <Check size={14} />
                                </span>
                              )}
                              {isUnsolved && (
                                <span className="dropdown-item-unsolved" title="Не решено">
                                  <X size={14} />
                                </span>
                              )}
                              {!isDone && !isUnsolved && (
                                <span className="dropdown-item-empty" title="Не начато">
                                  <Minus size={13} className="folder-empty-dash" />
                                </span>
                              )}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Standard Gallery Cards View */
              <div className="gallery-grid">
                {filteredTasks.map((task) => {
                  const s = getTaskStatus(task.id);
                  const isDone = s === "solved";
                  const isUnsolved = s === "unsolved";

                  const taskReview = reviews[String(task.id)] || reviews[task.id];
                  const lastReviewedAt = taskReview?.lastReviewedAt;
                  const nextReviewAt = taskReview?.nextReviewAt;
                  const isDue = isTaskDue(taskReview);

                  return (
                    <Link
                      key={task.id}
                      to={taskRoute}
                      params={{ taskId: String(task.id) }}
                      className={`gallery-card ${isDue ? "task-is-due" : ""}`}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Folder size={14} style={{ color: groupMeta?.color || "var(--color-primary, #3b82f6)", flexShrink: 0 }} />
                            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                              {task.subgroup || groupMeta?.title || "Раздел"}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: isDone ? "#10b981" : isUnsolved ? "#ef4444" : "var(--text-muted)",
                              }}
                            >
                              {isDone ? "Решено" : isUnsolved ? "Не решено" : "Не начато"}
                            </span>
                            {isDone ? (
                              <span className="dropdown-item-check" title="Решено">
                                <Check size={13} />
                              </span>
                            ) : isUnsolved ? (
                              <span className="dropdown-item-unsolved" title="Не решено">
                                <X size={13} />
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontWeight: 600, fontSize: "14px", color: "var(--text-main)", marginBottom: "6px", lineHeight: 1.4 }}>
                          {isDue ? (
                            <Flame size={16} className="node-file-icon flame-pulse-icon" style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                          ) : (
                            <FileText size={16} className="node-file-icon" style={{ color: FILE_ICON_COLOR, flexShrink: 0, marginTop: "2px" }} />
                          )}
                          <span>{task.title}</span>
                        </div>

                        {task.desc && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                              lineHeight: 1.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              marginBottom: "12px",
                            }}
                          >
                            {task.desc}
                          </div>
                        )}
                      </div>

                      {(lastReviewedAt || nextReviewAt || isDue) && (
                        <div
                          style={{
                            paddingTop: "10px",
                            borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                          }}
                        >
                          <div className="gallery-card-badges-row">
                            {lastReviewedAt && (
                              <span
                                className="folder-task-badge badge-last-solved"
                                title={`Дата последнего решения: ${new Date(lastReviewedAt).toLocaleDateString("ru-RU")}`}
                              >
                                <Calendar size={11} className="badge-icon" />
                                <span>{formatLastSolved(lastReviewedAt)}</span>
                              </span>
                            )}
                            {isDue ? (
                              <span className="folder-task-badge badge-next-due">
                                <Flame size={11} className="flame-pulse-icon" />
                                <span>Пора повторить</span>
                              </span>
                            ) : nextReviewAt ? (
                              <span className="folder-task-badge badge-next-scheduled">
                                <RotateCcw size={11} className="badge-icon" />
                                <span>{formatNextReviewDate(nextReviewAt)}</span>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        {/* Standard Article Body (Rendered if custom _info.md exists) */}
        {blocks.length > 0 && (
          <div
            className="article-content"
            style={{
              paddingTop: "32px",
              borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
            }}
          >
            <h2
              className="h2-block"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              <BookOpen size={20} style={{ color: groupMeta?.color || "#3b82f6", flexShrink: 0 }} />
              <span>{groupMeta?.guideTitle || groupMeta?.desc || `Полное руководство по разделу ${groupMeta?.title || groupMeta?.name}`}</span>
            </h2>

            {blocks.map((block, idx) => {
              if (block.type === "code") {
                return (
                  <TheoryCodeBlock
                    key={idx}
                    code={block.code}
                    language={block.language}
                  />
                );
              }
              return (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{
                    __html: block.html,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Раздел 10 & 11 отображаются для теоретических статей с разбором */}
        {blocks.length > 0 && practiceTasksList.length > 0 && (
          <div className="solution-practice-card" id="10-практика-задачи-для-закрепления" style={{ marginTop: "32px" }}>
            <div className="solution-practice-header">
              <span>🎯</span> 10. Практика: задачи для закрепления
            </div>
            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              Рекомендуемый порядок для отработки навыка (от простого к сложному):
            </p>
            <ul className="solution-practice-list">
              {practiceTasksList.map((item, idx) => (
                <li key={idx}>
                  <span className="article-topic">
                    {idx + 1}. {item.title}
                  </span>{" "}
                  — {item.desc}.{" "}
                  {item.isInternal ? (
                    <Link
                      to={taskRoute}
                      params={{ taskId: item.id }}
                      className="article-link"
                      style={{ color: "#f59e0b", fontWeight: 600 }}
                    >
                      Решать на платформе →
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-link"
                      style={{ color: "#f59e0b" }}
                    >
                      LeetCode ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {blocks.length > 0 && articleLinksList.length > 0 && (
          <div className="solution-articles-card" id="11-полезные-материалы" style={{ marginTop: "24px" }}>
            <div className="solution-articles-header">
              <span>📚</span> 11. Полезные материалы
            </div>
            <ul className="solution-articles-list">
              {articleLinksList.map((art, idx) => (
                <li key={idx}>
                  <span className="article-topic">{art.title}:</span>{" "}
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    {art.urlTitle || "Читать статью"} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
};

export default GroupOverviewView;
