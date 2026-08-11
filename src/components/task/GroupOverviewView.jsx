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
} from "lucide-react";
import { parseMarkdownBlocks } from "../../utils/markdownParser";
import TheoryCodeBlock from "./TheoryCodeBlock";
import { usePractice } from "../../context/PracticeContext";
import { FILE_ICON_COLOR } from "../../constants/uiConstants";

export const GroupOverviewView = ({ groupMeta, groupTasks = [] }) => {
  const context = usePractice();
  const completedTasks = context?.completedTasks || {};

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

  // Фильтрация задач по статусу (Все / Решено / Не решено)
  const filteredTasks = useMemo(() => {
    return groupTasks.filter((task) => {
      const status = getTaskStatus(task.id);
      if (statusFilter === "completed") {
        return status === "solved";
      }
      if (statusFilter === "uncompleted") {
        return status === "unsolved";
      }
      return true;
    });
  }, [groupTasks, statusFilter, completedTasks]);

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

  // Автоматический скролл по якорным ссылкам при загрузке или смене хэша
  React.useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = decodeURIComponent(hash.replace("#", ""));
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const firstTask = groupTasks[0];

  // Спецификация практических задач темы (Раздел 10)
  const practiceTasksList = [
    { id: "algo4", title: "Reverse String", desc: "разворот массива на месте", url: "https://leetcode.com/problems/reverse-string/", isInternal: false },
    { id: "algo2", title: "Valid Palindrome (LeetCode #125)", desc: "проверка палиндрома с помощью двух указателей", isInternal: true },
    { id: "algo1", title: "Two Sum II — Input Array Is Sorted (LeetCode #167)", desc: "поиск суммы двух чисел за O(1) памяти", isInternal: true },
    { id: "algo5", title: "Remove Duplicates from Sorted Array (LeetCode #26)", desc: "удаление дубликатов на месте (slow / fast)", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", isInternal: false },
    { id: "algo6", title: "Move Zeroes (LeetCode #283)", desc: "сдвиг нулей в конец массива на месте", url: "https://leetcode.com/problems/move-zeroes/", isInternal: false },
    { id: "algo7", title: "Container With Most Water (LeetCode #11)", desc: "наибольшая площадь между столбиками", url: "https://leetcode.com/problems/container-with-most-water/", isInternal: false },
    { id: "algo3", title: "3Sum (LeetCode #15)", desc: "усложнённая версия с фиксацией элемента и Two Pointers", isInternal: true },
    { id: "algo8", title: "Linked List Cycle (LeetCode #141)", desc: "вариант slow/fast для связного списка", url: "https://leetcode.com/problems/linked-list-cycle/", isInternal: false },
    { id: "algo9", title: "Merge Sorted Array (LeetCode #88)", desc: "два указателя по двум массивам", url: "https://leetcode.com/problems/merge-sorted-array/", isInternal: false },
  ];

  // Спецификация полезных материалов (Раздел 11)
  const articleLinksList = [
    { title: "Что такое метод двух указателей (two pointers)?", urlTitle: "CodeChick — Разбор метода", url: "https://codechick.io/community/330" },
    { title: "Two Pointers (Два указателя): разбор техники для начинающих", urlTitle: "SprintCode.pro — Руководство", url: "https://sprintcode.pro/ru/blog/two-pointers" },
    { title: "Алгосы от Влада, часть 2. Два указателя", urlTitle: "Блог Влада Крыловского", url: "https://krilovskiy.com/posts/algo-patterns-two-pointers/" },
    { title: "Two Pointers — паттерн", urlTitle: "Habr — Обзор паттерна", url: "https://habr.com/ru/articles/1020222" },
    { title: "Список задач с тегом \"Two Pointers\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/two-pointers/" },
  ];

  const location = useLocation();
  const isJs = location.pathname.includes("/javascript");
  const isReact = location.pathname.includes("/react");
  const taskRoute = isJs ? "/javascript/$taskId" : isReact ? "/react/$taskId" : "/algorithms/$taskId";
  const sectionName = isJs ? "JavaScript" : isReact ? "React" : "Алгоритмы";

  return (
    <div className="task-view-container notion-article-view" style={{ padding: "28px 36px 80px" }}>
      <article className="notion-article-page notion-folder-page-wrapper">
        {/* Notion Folder Header Hero */}
        <header className="notion-article-header">
          <div className="notion-folder-hero">
            <div
              className="notion-folder-emoji-box"
              style={{
                background: groupMeta?.bg || "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
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
                <h1 className="notion-folder-hero-title">
                  {groupMeta?.name || groupMeta?.title || "Раздел"}
                </h1>

                {firstTask && (
                  <Link
                    to={taskRoute}
                    params={{ taskId: String(firstTask.id) }}
                    className="home-section-btn"
                    style={{
                      background: groupMeta?.color || "var(--color-primary, #3b82f6)",
                      color: "#ffffff",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "none",
                    }}
                  >
                    <span>Решать задачи</span> <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <p className="notion-folder-hero-desc" style={{ marginTop: "4px" }}>
                {groupMeta?.desc || `Все практические задачи и упражнения раздела «${groupMeta?.name || "Раздел"}».`}
              </p>
            </div>
          </div>
        </header>

        {/* Notion Database View (Files / Tasks list) */}
        <div className="notion-database-view-container">
            {/* Notion Database Controls Toolbar */}
            <div className="notion-folder-toolbar">
              {/* Status Filter Pills: Все, Решено, Не решено */}
              <div className="notion-pill-group" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
              <div className="notion-db-view-switch" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
              <div className="notion-db-columns-header">
                <span>Имя задачи / Файл</span>
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
              /* Notion List View — Exact Sidebar Tree System, scaled for page content */
              <div className="notion-folder-page-tree">
                {hasSubgroups ? (
                  Object.entries(groupedSubgroups).map(([subgroupName, tasks]) => {
                    if (tasks.length === 0) return null;
                    const isCollapsed = Boolean(collapsedSubgroups[subgroupName]);
                    const completedSubCount = tasks.filter((t) => getTaskStatus(t.id) === "solved").length;
                    const isSubCompleted = tasks.length > 0 && completedSubCount === tasks.length;
                    return (
                      <div className="notion-tree-group-block" key={subgroupName}>
                        <div
                          className="notion-tree-node-header subgroup-header"
                          onClick={() => toggleSubgroupCollapse(subgroupName)}
                        >
                          <div className="notion-icon-toggle-wrapper">
                            <div className="notion-icon-default">
                              <Folder size={17} style={{ color: groupMeta?.color || "var(--color-primary, #3b82f6)" }} />
                            </div>
                            <div className={`notion-icon-chevron ${!isCollapsed ? "expanded" : ""}`}>
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
                          <div className="notion-tree-tasks-container">
                            {tasks.map((task) => {
                              const s = getTaskStatus(task.id);
                              const isDone = s === "solved";
                              const isUnsolved = s === "unsolved";
                              return (
                                <Link
                                  key={task.id}
                                  to={taskRoute}
                                  params={{ taskId: String(task.id) }}
                                  className="task-btn notion-tree-task-btn"
                                >
                                  <span className="task-btn-title">
                                    <FileText size={16} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                                    <span className="task-btn-text">{task.title}</span>
                                  </span>

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
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="notion-tree-tasks-container" style={{ marginLeft: 0, paddingLeft: 0, borderLeft: "none" }}>
                    {filteredTasks.map((task) => {
                      const s = getTaskStatus(task.id);
                      const isDone = s === "solved";
                      const isUnsolved = s === "unsolved";
                      return (
                        <Link
                          key={task.id}
                          to={taskRoute}
                          params={{ taskId: String(task.id) }}
                          className="task-btn notion-tree-task-btn"
                        >
                          <span className="task-btn-title">
                            <FileText size={16} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                            <span className="task-btn-text">{task.title}</span>
                          </span>

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
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Notion Gallery Cards View */
              <div className="notion-gallery-grid">
                {filteredTasks.map((task) => {
                  const s = getTaskStatus(task.id);
                  const isDone = s === "solved";
                  const isUnsolved = s === "unsolved";
                  return (
                    <Link
                      key={task.id}
                      to={taskRoute}
                      params={{ taskId: String(task.id) }}
                      className="notion-gallery-card"
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <FileText size={15} className="node-file-icon" style={{ color: FILE_ICON_COLOR, flexShrink: 0 }} />
                            {task.subgroup && (
                              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                                {task.subgroup}
                              </span>
                            )}
                          </div>
                          {isDone && (
                            <span className="dropdown-item-check" title="Решено">
                              <Check size={13} />
                            </span>
                          )}
                          {isUnsolved && (
                            <span className="dropdown-item-unsolved" title="Не решено">
                              <X size={13} />
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-main)", marginBottom: "6px", lineHeight: 1.4 }}>
                          {task.title}
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

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "10px",
                          borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                          fontSize: "12px",
                        }}
                      >
                        <span
                          style={{
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        {/* Notion Article Body (Rendered if custom _info.md exists) */}
        {blocks.length > 0 && (
          <div
            className="notion-article-content"
            style={{
              paddingTop: "32px",
              borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
            }}
          >
            <h2
              className="notion-h2"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              <BookOpen size={20} style={{ color: groupMeta?.color || "#3b82f6", flexShrink: 0 }} />
              <span>Полное руководство по алгоритмической технике двух указателей</span>
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
