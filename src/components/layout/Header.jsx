import React from "react";
import { Link } from "@tanstack/react-router";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Home,
  Code2,
  Zap,
  Brain,
  ChevronDown,
  BookOpen,
  FolderTree,
  X,
  Check,
  BarChart2,
  Lightbulb,
  Search,
  Clock,
  Sun,
  Moon,
  FileCode,
  FileText,
  Folder,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { REACT_TASKS } from "../../react/data/tasksData";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { getGroupMeta } from "../../javascript/data/groupConfig";
import { ALGO_TASKS } from "../../algorithms/data/tasksData";
import { getAlgoGroupMeta } from "../../algorithms/data/groupConfig";
import { ALL_TASKS, resolveTaskSection } from "../../data/tasksRegistry";
import { FILE_ICON_COLOR } from "../../constants/uiConstants";
import { useReviewStore } from "../../stores/useReviewStore";
import {
  getAllReviewTasksSorted,
  getReviewBadgeMeta,
  isTaskDue,
} from "../../utils/spacedRepetition";
import { Tooltip } from "../common/Tooltip";

export const Header = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  sectionDropdownOpen,
  setSectionDropdownOpen,
  headerSectionDropdownOpen,
  setHeaderSectionDropdownOpen,
  headerSectionDropdownRef,
  // React breadcrumbs
  categoryDropdownRef,
  categoryDropdownOpen,
  setCategoryDropdownOpen,
  categoriesList = [],
  categoryId,
  categoryIcon,
  taskCategory,
  openSingleCategory,
  taskDropdownRef,
  taskDropdownOpen,
  setTaskDropdownOpen,
  taskIcon,
  currentCategoryTasks = [],
  selectedTask,
  completedTasks = {},
  // JS & Algo dropdowns
  expandedJsGroups,
  setExpandedJsGroups,
  expandedJsSubgroups,
  setExpandedJsSubgroups,
  algoDropdownRef,
  algoDropdownOpen,
  setAlgoDropdownOpen,
  // Header Actions & Modals
  statsModalOpen,
  setStatsModalOpen,
  cheatSheetOpen,
  setCheatSheetOpen,
  setPaletteOpen,
  // Timer & Theme
  timerSeconds,
  setTimerSeconds,
  setTimerRunning,
  formatTimer,
  startTimer,
  theme,
  setTheme,
}) => {
  const [groupDropdownOpen, setGroupDropdownOpen] = React.useState(false);
  const [subgroupDropdownOpen, setSubgroupDropdownOpen] = React.useState(false);
  const [reviewDropdownOpen, setReviewDropdownOpen] = React.useState(false);
  const [timerDropdownOpen, setTimerDropdownOpen] = React.useState(false);

  const groupDropdownRef = React.useRef(null);
  const subgroupDropdownRef = React.useRef(null);
  const reviewDropdownRef = React.useRef(null);
  const timerDropdownRef = React.useRef(null);

  const reviews = useReviewStore((state) => state.reviews);
  const isReviewStoreReady = useReviewStore((state) => state.isInitialized);
  const sortedReviewTasks = React.useMemo(() => {
    if (!isReviewStoreReady) return [];
    return getAllReviewTasksSorted(ALL_TASKS, reviews);
  }, [reviews, isReviewStoreReady]);
  const dueTasksCount = React.useMemo(() => {
    if (!isReviewStoreReady || !reviews) return 0;
    let count = 0;
    for (const rev of Object.values(reviews)) {
      if (rev && isTaskDue(rev)) count++;
    }
    return count;
  }, [reviews, isReviewStoreReady]);

  const hasAnySolvedTasks = React.useMemo(() => {
    if (sortedReviewTasks.length > 0) return true;
    if (completedTasks) {
      for (const val of Object.values(completedTasks)) {
        if (val === true || val === "solved") return true;
      }
    }
    if (reviews) {
      for (const rev of Object.values(reviews)) {
        if (rev && (rev.stage > 0 || rev.lastReviewedAt)) return true;
      }
    }
    return false;
  }, [completedTasks, sortedReviewTasks, reviews]);

  const closeAllDropdowns = () => {
    if (setSectionDropdownOpen) setSectionDropdownOpen(false);
    if (setHeaderSectionDropdownOpen) setHeaderSectionDropdownOpen(false);
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);
    if (setTaskDropdownOpen) setTaskDropdownOpen(false);
    setGroupDropdownOpen(false);
    setSubgroupDropdownOpen(false);
    if (setAlgoDropdownOpen) setAlgoDropdownOpen(false);
    setReviewDropdownOpen(false);
    setTimerDropdownOpen(false);
  };

  const toggleSectionDropdown = () => {
    const next = !headerSectionDropdownOpen;
    closeAllDropdowns();
    if (setHeaderSectionDropdownOpen) setHeaderSectionDropdownOpen(next);
  };

  const toggleCategoryDropdown = () => {
    const next = !categoryDropdownOpen;
    closeAllDropdowns();
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(next);
  };

  const toggleTaskDropdown = () => {
    const next = !taskDropdownOpen;
    closeAllDropdowns();
    if (setTaskDropdownOpen) setTaskDropdownOpen(next);
  };

  const toggleGroupDropdown = () => {
    const next = !groupDropdownOpen;
    closeAllDropdowns();
    setGroupDropdownOpen(next);
  };

  const toggleSubgroupDropdown = () => {
    const next = !subgroupDropdownOpen;
    closeAllDropdowns();
    setSubgroupDropdownOpen(next);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target)
      ) {
        setGroupDropdownOpen(false);
      }
      if (
        subgroupDropdownRef.current &&
        !subgroupDropdownRef.current.contains(event.target)
      ) {
        setSubgroupDropdownOpen(false);
      }
      if (
        categoryDropdownRef?.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);
      }
      if (
        taskDropdownRef?.current &&
        !taskDropdownRef.current.contains(event.target)
      ) {
        if (setTaskDropdownOpen) setTaskDropdownOpen(false);
      }
      if (
        headerSectionDropdownRef?.current &&
        !headerSectionDropdownRef.current.contains(event.target)
      ) {
        if (setHeaderSectionDropdownOpen) setHeaderSectionDropdownOpen(false);
      }
      if (
        algoDropdownRef?.current &&
        !algoDropdownRef.current.contains(event.target)
      ) {
        if (setAlgoDropdownOpen) setAlgoDropdownOpen(false);
      }
      if (
        reviewDropdownRef?.current &&
        !reviewDropdownRef.current.contains(event.target)
      ) {
        setReviewDropdownOpen(false);
      }
      if (
        timerDropdownRef?.current &&
        !timerDropdownRef.current.contains(event.target)
      ) {
        setTimerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    categoryDropdownRef,
    setCategoryDropdownOpen,
    taskDropdownRef,
    setTaskDropdownOpen,
    headerSectionDropdownRef,
    setHeaderSectionDropdownOpen,
    algoDropdownRef,
    setAlgoDropdownOpen,
  ]);

  const isTaskSolved = (id) => {
    const val = completedTasks[id] ?? completedTasks[String(id)];
    return val === true || val === "solved";
  };

  const renderHeaderSectionDropdownMenu = () => (
    <div className="breadcrumb-dropdown-menu">
      <div className="breadcrumb-dropdown-header">
        <span className="breadcrumb-dropdown-header-title">РАЗДЕЛЫ ПЛАТФОРМЫ</span>
      </div>
      <div className="breadcrumb-dropdown-list">
        <Link
          to="/home"
          className={`breadcrumb-dropdown-item ${activeSection === "home" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Home size={15} style={{ color: "var(--color-info-light)" }} /></span>
          <span className="dropdown-item-title">Главная</span>
          <span className="section-badge">Обзор</span>
        </Link>
        <Link
          to="/javascript"
          className={`breadcrumb-dropdown-item ${activeSection === "javascript" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Zap size={15} style={{ color: "var(--color-warning)" }} /></span>
          <span className="dropdown-item-title">JavaScript</span>
          <span className="section-badge">{JS_TASKS.length} задач</span>
        </Link>
        <Link
          to="/react"
          className={`breadcrumb-dropdown-item ${activeSection === "react" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Code2 size={15} style={{ color: "var(--color-info)" }} /></span>
          <span className="dropdown-item-title">React</span>
          <span className="section-badge">{REACT_TASKS.length} задач</span>
        </Link>
        <Link
          to="/algorithms"
          className={`breadcrumb-dropdown-item ${activeSection === "algorithms" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Brain size={15} style={{ color: "var(--color-accent-purple)" }} /></span>
          <span className="dropdown-item-title">Алгоритмы</span>
          <span className="section-badge">{ALGO_TASKS.length} задач</span>
        </Link>
      </div>
    </div>
  );

  return (
    <header className="app-header">
      <div className="header-left">
        <Tooltip content={sidebarOpen ? "Свернуть панель (Cmd+\\)" : "Развернуть панель (Cmd+\\)"} side="bottom">
          <button
            className={`sidebar-toggle-btn ${sidebarOpen ? "desktop-hidden" : ""}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Свернуть панель" : "Развернуть панель"}
          >
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </Tooltip>

        {/* Интерактивные кликабельные хлебные крошки style (macOS Finder Emulation) */}
        <nav className="header-breadcrumbs" aria-label="Хлебные крошки Finder">
          {/* Селектор раздела платформы в крошках */}
          <div className="breadcrumb-dropdown-wrapper" ref={headerSectionDropdownRef}>
            <button
              className="breadcrumb-item breadcrumb-task-btn"
              onClick={toggleSectionDropdown}
              title="Переключить раздел практики"
            >
              {activeSection === "home" && <><Home size={15} style={{ color: "#60a5fa" }} /> <span className="breadcrumb-text-truncate">Главная</span></>}
              {activeSection === "react" && <><Code2 size={15} style={{ color: "#61dafb" }} /> <span className="breadcrumb-text-truncate">React</span></>}
              {activeSection === "javascript" && <><Zap size={15} style={{ color: "#f59e0b" }} /> <span className="breadcrumb-text-truncate">JavaScript</span></>}
              {activeSection === "algorithms" && <><Brain size={15} style={{ color: "#a855f7" }} /> <span className="breadcrumb-text-truncate">Алгоритмы</span></>}
              <ChevronDown size={14} className="breadcrumb-chevron" />
            </button>

            {headerSectionDropdownOpen && renderHeaderSectionDropdownMenu()}
          </div>

          {/* Раздел Главная */}
          {activeSection === "home" && (
            <>
              <span className="breadcrumb-separator">/</span>
              <div className="breadcrumb-dropdown-wrapper">
                <button className="breadcrumb-item breadcrumb-task-btn" style={{ cursor: "default" }}>
                  <BookOpen size={14} />
                  <span>Обзор платформы</span>
                </button>
              </div>
            </>
          )}

          {/* Раздел JavaScript */}
          {activeSection === "javascript" && selectedTask && (() => {
            const currentGroupName = selectedTask.group || "Циклы";
            const currentGroupMeta = getGroupMeta(currentGroupName);
            const currentSubgroupName = selectedTask.subgroup || "";
            return (
              <>
                {/* 1. Группа */}
                <span className="breadcrumb-separator">/</span>
                <div className="breadcrumb-dropdown-wrapper" ref={groupDropdownRef}>
                  <button
                    className="breadcrumb-item breadcrumb-task-btn"
                    onClick={toggleGroupDropdown}
                    title="Выбрать группу задач"
                  >
                    {currentGroupMeta.renderIcon(14)}
                    <span className="breadcrumb-text-truncate">{currentGroupName}</span>
                    <ChevronDown size={14} className="breadcrumb-chevron" />
                  </button>

                  {groupDropdownOpen && (
                    <div className="breadcrumb-dropdown-menu">
                      <div className="breadcrumb-dropdown-header">
                        <span className="breadcrumb-dropdown-header-icon">{currentGroupMeta.renderIcon(14)}</span>
                        <span className="breadcrumb-dropdown-header-title">Группы задач JavaScript</span>
                      </div>
                      <div className="breadcrumb-dropdown-list">
                        {Array.from(new Set(JS_TASKS.map((t) => t.group))).map((gName) => {
                          const groupTasks = JS_TASKS.filter((t) => t.group === gName);
                          const completedCount = groupTasks.filter((t) => isTaskSolved(t.id)).length;
                          const isCompleted = completedCount > 0 && completedCount === groupTasks.length;
                          const isActive = currentGroupName === gName;
                          const gMeta = getGroupMeta(gName);
                          return (
                            <Link
                              key={gName}
                              to="/javascript/$taskId"
                              params={{ taskId: `group-${gName}` }}
                              search={(prev) => prev}
                              className={`breadcrumb-dropdown-item ${isActive ? "active" : ""}`}
                              onClick={() => {
                                closeAllDropdowns();
                                setTimeout(() => {
                                  const el = document.getElementById(`category-js-${gName}`);
                                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 50);
                              }}
                            >
                              <span className="breadcrumb-dropdown-icon">{gMeta.renderIcon(14)}</span>
                              <span className="dropdown-item-title">{gName}</span>
                              <span className={`dropdown-item-count ${isCompleted ? "completed" : ""}`}>
                                {completedCount}/{groupTasks.length}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Подгруппа (только если задача имеет реальную подгруппу) */}
                {currentSubgroupName && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <div className="breadcrumb-dropdown-wrapper" ref={subgroupDropdownRef}>
                      <button
                        className="breadcrumb-item breadcrumb-task-btn"
                        onClick={toggleSubgroupDropdown}
                        title="Выбрать подгруппу задач"
                      >
                        <Folder size={14} style={{ color: currentGroupMeta.color, opacity: 0.9 }} />
                        <span className="breadcrumb-text-truncate">{currentSubgroupName}</span>
                        <ChevronDown size={14} className="breadcrumb-chevron" />
                      </button>

                      {subgroupDropdownOpen && (
                        <div className="breadcrumb-dropdown-menu">
                          <div className="breadcrumb-dropdown-header">
                            <span className="breadcrumb-dropdown-header-icon">
                              <Folder size={14} style={{ color: currentGroupMeta.color }} />
                            </span>
                            <span className="breadcrumb-dropdown-header-title">Подгруппы ({currentGroupName})</span>
                          </div>
                          <div className="breadcrumb-dropdown-list">
                            {Array.from(
                              new Set(
                                JS_TASKS.filter((t) => t.group === currentGroupName).map(
                                  (t) => t.subgroup
                                )
                              )
                            ).map((subName) => {
                              const subTasks = JS_TASKS.filter(
                                (t) => t.group === currentGroupName && t.subgroup === subName
                              );
                              const completedCount = subTasks.filter((t) => isTaskSolved(t.id)).length;
                              const isCompleted = completedCount > 0 && completedCount === subTasks.length;
                              const isActive = currentSubgroupName === subName;
                              const targetTaskId = `subgroup-${subName}`;
                              return (
                                <Link
                                  key={subName}
                                  to="/javascript/$taskId"
                                  params={{ taskId: targetTaskId }}
                                  search={(prev) => prev}
                                  className={`breadcrumb-dropdown-item ${isActive ? "active" : ""}`}
                                  onClick={() => {
                                    closeAllDropdowns();
                                    setTimeout(() => {
                                      const el =
                                        document.getElementById(`category-subgroup-${currentGroupName}-${subName}`) ||
                                        document.getElementById(`category-js-${currentGroupName}`);
                                      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                    }, 50);
                                  }}
                                >
                                  <span className="breadcrumb-dropdown-icon">
                                    <Folder size={14} style={{ color: currentGroupMeta.color, opacity: 0.9 }} />
                                  </span>
                                  <span className="dropdown-item-title">{subName}</span>
                                  <span className={`dropdown-item-count ${isCompleted ? "completed" : ""}`}>
                                    {completedCount}/{subTasks.length}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* 3. Задача (только если открыта конкретная задача, а не страница папки группы) */}
                {!selectedTask.isGroupOverview && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <div className="breadcrumb-dropdown-wrapper" ref={taskDropdownRef}>
                      <button
                        className="breadcrumb-item breadcrumb-task-btn"
                        onClick={toggleTaskDropdown}
                        title="Выбрать задачу из подгруппы"
                      >
                        <span>{taskIcon}</span>
                        <span className="breadcrumb-text-truncate">{selectedTask?.title}</span>
                        <ChevronDown size={14} className="breadcrumb-chevron" />
                      </button>

                      {taskDropdownOpen && (
                        <div className="breadcrumb-dropdown-menu">
                          <div className="breadcrumb-dropdown-header">
                            <span className="breadcrumb-dropdown-header-icon">
                              <Folder size={14} style={{ color: currentGroupMeta.color }} />
                            </span>
                            <span className="breadcrumb-dropdown-header-title">Задачи {currentSubgroupName || currentGroupName}</span>
                          </div>
                          <div className="breadcrumb-dropdown-list">
                            {JS_TASKS.filter(
                              (t) =>
                                t.group === currentGroupName &&
                                (!currentSubgroupName || t.subgroup === currentSubgroupName)
                            ).map((t) => {
                              const isSolved = isTaskSolved(t.id);
                              const status = completedTasks[t.id] ?? completedTasks[String(t.id)] ?? null;
                              const taskReview = reviews[String(t.id)] || reviews[t.id];
                              const isDue = isTaskDue(taskReview);
                              const isActive = t.id === selectedTask?.id || String(t.id) === String(selectedTask?.id);

                              return (
                                <Link
                                  key={t.id}
                                  to="/javascript/$taskId"
                                  params={{ taskId: String(t.id) }}
                                  search={(prev) => prev}
                                  className={`breadcrumb-dropdown-item ${isActive ? "active" : ""} ${isDue ? "task-is-due" : ""}`}
                                  onClick={closeAllDropdowns}
                                >
                                  <span className="breadcrumb-dropdown-icon">
                                    <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                                  </span>
                                  <span className="dropdown-item-title">{t.title}</span>
                                  {isDue ? (
                                    <span className="dropdown-item-repeat" title="Пора повторить сегодня!">
                                      <RotateCcw size={12} />
                                    </span>
                                  ) : (status === "solved" || isSolved) ? (
                                    <span className="dropdown-item-check" title="Решено">
                                      <Check size={12} />
                                    </span>
                                  ) : status === "unsolved" ? (
                                    <span className="dropdown-item-unsolved" title="Не решено">
                                      <X size={12} />
                                    </span>
                                  ) : null}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            );
          })()}

          {/* Раздел React */}
          {activeSection === "react" && taskCategory && (
            <>
              <span className="breadcrumb-separator">/</span>
              <div className="breadcrumb-dropdown-wrapper" ref={categoryDropdownRef}>
                <button
                  className="breadcrumb-item breadcrumb-task-btn"
                  onClick={toggleCategoryDropdown}
                  title="Выбрать другую группу задач"
                >
                  <span>{categoryIcon}</span>
                  <span className="breadcrumb-text-truncate">{taskCategory}</span>
                  <ChevronDown size={14} className="breadcrumb-chevron" />
                </button>

                {categoryDropdownOpen && (
                  <div className="breadcrumb-dropdown-menu">
                    <div className="breadcrumb-dropdown-header">
                      <span className="breadcrumb-dropdown-header-icon"><FolderTree size={14} /></span>
                      <span className="breadcrumb-dropdown-header-title">Группы задач React</span>
                    </div>
                    <div className="breadcrumb-dropdown-list">
                      {categoriesList.map((cat) => {
                        const isActiveCategory = cat.id === categoryId;
                        const isCompleted = cat.completed > 0 && cat.completed === cat.total;
                        return (
                          <Link
                            key={cat.id}
                            to="/react/$taskId"
                            params={{ taskId: cat.folderId || String(cat.tasks[0]?.id || "1") }}
                            search={(prev) => prev}
                            className={`breadcrumb-dropdown-item ${isActiveCategory ? "active" : ""}`}
                            onClick={() => {
                              if (openSingleCategory) openSingleCategory(cat.id);
                              setCategoryDropdownOpen(false);

                              setTimeout(() => {
                                const el = document.getElementById(cat.id);
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                              }, 50);
                            }}
                          >
                            <span className="breadcrumb-dropdown-icon">{cat.icon}</span>
                            <span className="dropdown-item-title">{cat.name}</span>
                            <span className={`dropdown-item-count ${isCompleted ? "completed" : ""}`}>
                              {cat.completed}/{cat.total}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {!selectedTask?.isGroupOverview && (
                <>
                  <span className="breadcrumb-separator">/</span>

                  <div className="breadcrumb-dropdown-wrapper" ref={taskDropdownRef}>
                    <button
                      className="breadcrumb-item breadcrumb-task-btn"
                      onClick={toggleTaskDropdown}
                      title="Выбрать другую задачу из этого раздела"
                    >
                      <span>{taskIcon}</span>
                      <span className="breadcrumb-text-truncate">{selectedTask?.title}</span>
                      <ChevronDown size={14} className="breadcrumb-chevron" />
                    </button>

                    {taskDropdownOpen && (
                      <div className="breadcrumb-dropdown-menu">
                        <div className="breadcrumb-dropdown-header">
                          <span className="breadcrumb-dropdown-header-icon">{categoryIcon}</span>
                          <span className="breadcrumb-dropdown-header-title">{taskCategory || "Задачи"}</span>
                        </div>
                        <div className="breadcrumb-dropdown-list">
                          {currentCategoryTasks.map((t) => {
                            const isSolved = isTaskSolved(t.id);
                            const status = completedTasks[t.id] ?? completedTasks[String(t.id)] ?? null;
                            const taskReview = reviews[String(t.id)] || reviews[t.id];
                            const isDue = isTaskDue(taskReview);
                            const isActive = t.id === selectedTask?.id || String(t.id) === String(selectedTask?.id);

                            return (
                              <Link
                                key={t.id}
                                to="/react/$taskId"
                                params={{ taskId: String(t.id) }}
                                search={(prev) => prev}
                                className={`breadcrumb-dropdown-item ${isActive ? "active" : ""} ${isDue ? "task-is-due" : ""}`}
                                onClick={closeAllDropdowns}
                              >
                                <span className="breadcrumb-dropdown-icon">
                                  <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                                </span>
                                <span className="dropdown-item-title">{t.title}</span>
                                {isDue ? (
                                  <span className="dropdown-item-repeat" title="Пора повторить сегодня!">
                                    <RotateCcw size={12} />
                                  </span>
                                ) : (status === "solved" || isSolved) ? (
                                  <span className="dropdown-item-check" title="Решено">
                                    <Check size={12} />
                                  </span>
                                ) : status === "unsolved" ? (
                                  <span className="dropdown-item-unsolved" title="Не решено">
                                    <X size={12} />
                                  </span>
                                ) : null}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Раздел Алгоритмы */}
          {activeSection === "algorithms" && (() => {
            const currentGroup = selectedTask ? selectedTask.group : "Two Pointers";
            const currentGroupMeta = getAlgoGroupMeta(currentGroup);
            return (
              <>
                {/* 1. Группа */}
                <span className="breadcrumb-separator">/</span>
                <div className="breadcrumb-dropdown-wrapper" ref={groupDropdownRef}>
                  <button
                    className="breadcrumb-item breadcrumb-task-btn"
                    onClick={toggleGroupDropdown}
                    title="Выбрать группу задач"
                  >
                    {currentGroupMeta.renderIcon(14)}
                    <span className="breadcrumb-text-truncate">{currentGroup}</span>
                    <ChevronDown size={14} className="breadcrumb-chevron" />
                  </button>

                  {groupDropdownOpen && (
                    <div className="breadcrumb-dropdown-menu">
                      <div className="breadcrumb-dropdown-header">
                        <span className="breadcrumb-dropdown-header-icon">{currentGroupMeta.renderIcon(14)}</span>
                        <span className="breadcrumb-dropdown-header-title">Группы задач Алгоритмы</span>
                      </div>
                      <div className="breadcrumb-dropdown-list">
                        {Array.from(new Set(ALGO_TASKS.map((t) => t.group))).map((gName) => {
                          const groupTasks = ALGO_TASKS.filter((t) => t.group === gName);
                          const completedCount = groupTasks.filter((t) => isTaskSolved(t.id)).length;
                          const isCompleted = completedCount > 0 && completedCount === groupTasks.length;
                          const isActive = currentGroup === gName;
                          const gMeta = getAlgoGroupMeta(gName);
                          return (
                            <Link
                              key={gName}
                              to="/algorithms/$taskId"
                              params={{ taskId: gMeta.infoId || "group-two-pointers" }}
                              search={(prev) => prev}
                              className={`breadcrumb-dropdown-item ${isActive ? "active" : ""}`}
                              onClick={closeAllDropdowns}
                            >
                              <span className="breadcrumb-dropdown-icon">{gMeta.renderIcon(14)}</span>
                              <span className="dropdown-item-title">{gName}</span>
                              <span className={`dropdown-item-count ${isCompleted ? "completed" : ""}`}>
                                {completedCount}/{groupTasks.length}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Задача (только если открыта конкретная задача) */}
                {!selectedTask?.isGroupOverview && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <div className="breadcrumb-dropdown-wrapper" ref={taskDropdownRef}>
                      <button
                        className="breadcrumb-item breadcrumb-task-btn"
                        onClick={toggleTaskDropdown}
                        title="Выбрать материал из группы"
                      >
                        <span>{taskIcon}</span>
                        <span className="breadcrumb-text-truncate">{selectedTask?.title}</span>
                        <ChevronDown size={14} className="breadcrumb-chevron" />
                      </button>

                      {taskDropdownOpen && (
                        <div className="breadcrumb-dropdown-menu">
                          <div className="breadcrumb-dropdown-header">
                            <span className="breadcrumb-dropdown-header-icon">{currentGroupMeta.renderIcon(14)}</span>
                            <span className="breadcrumb-dropdown-header-title">Задачи {currentGroup}</span>
                          </div>
                          <div className="breadcrumb-dropdown-list">
                            {ALGO_TASKS.filter((t) => t.group === currentGroup).map((t) => {
                              const isSolved = isTaskSolved(t.id);
                              const status = completedTasks[t.id] ?? completedTasks[String(t.id)] ?? null;
                              const taskReview = reviews[String(t.id)] || reviews[t.id];
                              const isDue = isTaskDue(taskReview);
                              const isActive = t.id === selectedTask?.id || String(t.id) === String(selectedTask?.id);

                              return (
                                <Link
                                  key={t.id}
                                  to="/algorithms/$taskId"
                                  params={{ taskId: String(t.id) }}
                                  search={(prev) => prev}
                                  className={`breadcrumb-dropdown-item ${isActive ? "active" : ""} ${isDue ? "task-is-due" : ""}`}
                                  onClick={closeAllDropdowns}
                                >
                                  <span className="breadcrumb-dropdown-icon">
                                    <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                                  </span>
                                  <span className="dropdown-item-title">{t.title}</span>
                                  {isDue ? (
                                    <span className="dropdown-item-repeat" title="Пора повторить сегодня!">
                                      <RotateCcw size={12} />
                                    </span>
                                  ) : (status === "solved" || isSolved) ? (
                                    <span className="dropdown-item-check" title="Решено">
                                      <Check size={12} />
                                    </span>
                                  ) : status === "unsolved" ? (
                                    <span className="dropdown-item-unsolved" title="Не решено">
                                      <X size={12} />
                                    </span>
                                  ) : null}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </nav>
      </div>

      <div className="header-right">
        <Tooltip.Provider delayDuration={140} skipDelayDuration={300}>
          {/* Кнопка Статистика */}
          <Tooltip content="Статистика" side="bottom">
            <button
              className={`header-action-btn ${
                activeSection === "home" ? "disabled" : statsModalOpen ? "active" : ""
              }`}
              onClick={activeSection === "home" ? undefined : () => setStatsModalOpen((prev) => !prev)}
              disabled={activeSection === "home"}
              aria-label="Статистика"
            >
              <BarChart2 size={16} />
            </button>
          </Tooltip>

          {/* Кнопка Повторение с выпадающим контекстным меню */}
          <div className="header-review-dropdown-wrapper" ref={reviewDropdownRef}>
            <Tooltip
              content={
                dueTasksCount > 0
                  ? `Пора повторить (${dueTasksCount})`
                  : "Интервальное повторение"
              }
              side="bottom"
              disabled={reviewDropdownOpen}
            >
              <button
                type="button"
                className={`header-action-btn header-review-btn ${
                  reviewDropdownOpen ? "active" : ""
                } ${dueTasksCount > 0 ? "has-due-reviews" : ""}`}
                onClick={() => {
                  const next = !reviewDropdownOpen;
                  closeAllDropdowns();
                  setReviewDropdownOpen(next);
                }}
                aria-label="Интервальное повторение"
              >
                <RotateCcw
                  size={16}
                />
                {dueTasksCount > 0 && (
                  <span className="header-review-count-badge">{dueTasksCount}</span>
                )}
              </button>
            </Tooltip>

            {reviewDropdownOpen && (
              <div className="header-review-dropdown-menu">
                <div className="header-review-dropdown-header">
                  <div className="header-review-header-title-group">
                    <RotateCcw size={14} style={{ color: dueTasksCount > 0 ? "#eab308" : "var(--text-muted)" }} />
                    <span className="header-review-header-title">К повторению</span>
                  </div>
                  <span className="header-review-header-count">
                    {dueTasksCount > 0
                      ? `${dueTasksCount} к повторению`
                      : sortedReviewTasks.length > 0
                      ? `${sortedReviewTasks.length} в графике`
                      : hasAnySolvedTasks
                      ? "Все повторены"
                      : "0 решено"}
                  </span>
                </div>

                {sortedReviewTasks.length > 0 ? (
                  <div className="header-review-dropdown-list">
                    {sortedReviewTasks.map((task) => {
                      const section = resolveTaskSection(task);
                      const to =
                        section === "algorithms"
                          ? "/algorithms/$taskId"
                          : section === "javascript"
                          ? "/javascript/$taskId"
                          : "/react/$taskId";
                      const badge = getReviewBadgeMeta(task.reviewData);
                      const rating = task.reviewData?.rating;

                      return (
                        <Link
                          key={task.id}
                          to={to}
                          params={{ taskId: String(task.id) }}
                          className={`header-review-item ${badge.isDue ? "is-due" : ""} ${rating ? `rating-gradient-${rating}` : ""}`}
                          title={rating ? `${task.title} • Оценка сложности: ${rating === "hard" ? "Сложно" : rating === "medium" ? "Средне" : "Легко"}` : task.title}
                          onClick={closeAllDropdowns}
                        >
                          <div className="header-review-item-main">
                            <FileText size={15} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
                            <span className="header-review-item-title" title={task.title}>
                              {task.title}
                            </span>
                          </div>
                          <div className="header-review-item-meta">
                            <span className={`header-review-section-tag tag-${section}`}>
                              {section === "javascript"
                                ? "JS"
                                : section === "algorithms"
                                ? "Algo"
                                : "React"}
                            </span>
                            <span className={`difficulty-badge ${badge.badgeClass}`}>
                              {badge.label}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : !hasAnySolvedTasks ? (
                  <div className="header-review-empty">
                    <div className="header-review-empty-icon">
                      <BookOpen size={20} style={{ color: "var(--text-muted)" }} />
                    </div>
                    <div className="header-review-empty-text">
                      <strong>Ещё нет решённых задач</strong>
                      <span>Решайте задачи в каталоге, чтобы добавлять их в систему интервального повторения</span>
                    </div>
                  </div>
                ) : (
                  <div className="header-review-empty">
                    <div className="header-review-empty-icon">
                      <Sparkles size={20} style={{ color: "#10b981" }} />
                    </div>
                    <div className="header-review-empty-text">
                      <strong>Все задачи повторены!</strong>
                      <span>Отличная работа! Новые повторения появятся согласно вашему графику</span>
                    </div>
                  </div>
                )}

                <div className="header-review-dropdown-footer">
                  <Link
                    to="/home"
                    className="header-review-footer-link"
                    onClick={closeAllDropdowns}
                  >
                    <span>Перейти на Главную</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка Шпаргалки */}
          <Tooltip content="Шпаргалка" side="bottom">
            <button
              className={`header-action-btn ${
                activeSection === "home" ? "disabled" : cheatSheetOpen ? "active" : ""
              }`}
              onClick={activeSection === "home" ? undefined : () => setCheatSheetOpen((prev) => !prev)}
              disabled={activeSection === "home"}
              aria-label="Шпаргалка"
            >
              <Lightbulb size={16} />
            </button>
          </Tooltip>

          {/* Поиск Cmd+K */}
          <Tooltip content="Поиск по задачам (⌘K)" side="bottom">
            <button
              className="header-action-btn"
              onClick={() => setPaletteOpen(true)}
              aria-label="Поиск по задачам (Cmd+K)"
            >
              <Search size={16} />
            </button>
          </Tooltip>

          {/* Таймер собеседования */}
          <div
            className={`timer-dropdown-container ${activeSection === "home" ? "disabled" : ""}`}
            ref={timerDropdownRef}
          >
            {timerSeconds !== null ? (
              <Tooltip content="Сбросить таймер" side="bottom">
                <button
                  type="button"
                  className={`timer-display ${timerSeconds === 0 ? "expired" : ""} ${activeSection === "home" ? "disabled" : ""}`}
                  onClick={
                    activeSection === "home"
                      ? undefined
                      : () => {
                          setTimerRunning(false);
                          setTimerSeconds(null);
                        }
                  }
                  aria-label="Сбросить таймер"
                >
                  <Clock size={14} /> {formatTimer(timerSeconds)}
                </button>
              </Tooltip>
            ) : (
              <>
                <Tooltip
                  content="Таймер собеседования"
                  side="bottom"
                  disabled={timerDropdownOpen}
                >
                  <button
                    type="button"
                    className={`header-action-btn ${timerDropdownOpen ? "active" : ""}`}
                    onClick={
                      activeSection === "home"
                        ? undefined
                        : () => {
                            const next = !timerDropdownOpen;
                            closeAllDropdowns();
                            setTimerDropdownOpen(next);
                          }
                    }
                    disabled={activeSection === "home"}
                    aria-label="Таймер собеседования"
                  >
                    <Clock size={16} />
                  </button>
                </Tooltip>

                {timerDropdownOpen && (
                  <div className="header-timer-dropdown-menu">
                    <div className="header-timer-dropdown-header">
                      <Clock size={13} style={{ color: "var(--text-muted)" }} />
                      <span>Таймер собеседования</span>
                    </div>
                    <div className="header-timer-options-list">
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          className="header-timer-option-item"
                          onClick={() => {
                            startTimer(mins);
                            setTimerDropdownOpen(false);
                          }}
                        >
                          <span>{mins} минут</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Переключатель темы */}
          <Tooltip content={theme === "dark" ? "Светлая тема" : "Тёмная тема"} side="bottom">
            <button
              className="header-action-btn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </Tooltip>
        </Tooltip.Provider>
      </div>
    </header>
  );
};

export default Header;
