import React, { useMemo, useCallback, useTransition, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Code2,
  Zap,
  Brain,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  CheckSquare,
  Flame,
  Wrench,
  Rocket,
  FileText,
  Folder,
  X,
  Check,
} from "lucide-react";
import {
  REACT_TASKS,
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
} from "../../react/data/tasksData";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { getGroupMeta } from "../../javascript/data/groupConfig";
import { ALGO_TASKS } from "../../algorithms/data/tasksData";
import { getAlgoGroupMeta } from "../../algorithms/data/groupConfig";
import { FILE_ICON_COLOR } from "../../constants/uiConstants";

// ============================================================================
// Style Optimized Atomic Sub-Components with React.memo
// Only the active and clicked items re-render; all other 260+ items skip render
// ============================================================================

const SidebarTaskItem = React.memo(function SidebarTaskItem({
  id,
  to,
  params,
  search,
  title,
  isActive,
  status, // "solved" | "unsolved" | null
  onNavClick,
  showTooltip,
  hideTooltip,
}) {
  const handleMouseEnter = useCallback(
    (e) => {
      showTooltip(e, title);
    },
    [showTooltip, title]
  );

  return (
    <Link
      id={`sidebar-task-${id}`}
      to={to}
      params={params}
      search={search}
      className={`task-btn tree-task-btn ${isActive ? "active" : ""}`}
      onClick={onNavClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hideTooltip}
    >
      <span className="task-btn-title">
        <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />
        <span className="task-btn-text">{title}</span>
      </span>
      {status === "unsolved" && (
        <span className="dropdown-item-unsolved">
          <X size={12} />
        </span>
      )}
      {status === "solved" && (
        <span className="dropdown-item-check">
          <Check size={12} />
        </span>
      )}
    </Link>
  );
});

const SidebarGroupHeader = React.memo(function SidebarGroupHeader({
  to,
  params,
  search,
  title,
  icon,
  chevronExpanded,
  onToggle,
  onNavClick,
  isActive,
  isCompleted,
  completedCount,
  totalCount,
}) {
  return (
    <Link
      to={to}
      params={params}
      search={search}
      className={`tree-node-header group-header ${isActive ? "active" : ""}`}
      onClick={onNavClick}
    >
      <div
        className="icon-toggle-wrapper"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(e);
        }}
        title={chevronExpanded ? "Свернуть" : "Развернуть"}
      >
        <div className="icon-default">{icon}</div>
        <div className={`icon-chevron ${chevronExpanded ? "expanded" : ""}`}>
          <ChevronRight size={13} />
        </div>
      </div>
      <span className="node-title">{title}</span>
      <span className={`node-count ${isCompleted ? "completed" : ""}`}>
        {completedCount}/{totalCount}
      </span>
    </Link>
  );
});

const SidebarSubgroupHeader = React.memo(function SidebarSubgroupHeader({
  to,
  params,
  search,
  title,
  color,
  chevronExpanded,
  onToggle,
  onNavClick,
  isActive,
  isCompleted,
  completedCount,
  totalCount,
}) {
  return (
    <Link
      to={to}
      params={params}
      search={search}
      className={`tree-node-header subgroup-header ${isActive ? "active" : ""}`}
      onClick={onNavClick}
    >
      <div
        className="icon-toggle-wrapper"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(e);
        }}
        title={chevronExpanded ? "Свернуть" : "Развернуть"}
      >
        <div className="icon-default">
          <Folder size={14} style={{ color, opacity: 0.85 }} />
        </div>
        <div className={`icon-chevron ${chevronExpanded ? "expanded" : ""}`}>
          <ChevronRight size={13} />
        </div>
      </div>
      <span className="node-title">{title}</span>
      <span className={`node-count ${isCompleted ? "completed" : ""}`}>
        {completedCount}/{totalCount}
      </span>
    </Link>
  );
});

// ============================================================================
// Main Sidebar Component
// ============================================================================

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth = 280,
  setSidebarWidth,
  activeSection,
  sectionDropdownOpen,
  setSectionDropdownOpen,
  sectionDropdownRef,
  setHeaderSectionDropdownOpen,
  setStatsModalOpen,
  completedTotal,
  totalTasks,
  percentage,
  // Category metrics
  completedWarmup,
  totalWarmup,
  completedRefactoring,
  totalRefactoring,
  completedMain,
  totalMain,
  completedAdvanced,
  totalAdvanced,
  completedReactTs,
  totalReactTs,
  completedReactTsPractice,
  totalReactTsPractice,
  // Category expansion states
  warmupExpanded,
  setWarmupExpanded,
  refactoringExpanded,
  setRefactoringExpanded,
  tasksExpanded,
  setTasksExpanded,
  advancedExpanded,
  setAdvancedExpanded,
  reactTsExpanded,
  setReactTsExpanded,
  reactTsPracticeExpanded,
  setReactTsPracticeExpanded,
  // JS Group expansion states
  expandedJsGroups = {},
  setExpandedJsGroups,
  expandedJsSubgroups = {},
  setExpandedJsSubgroups,
  // Handlers & task states
  isTaskVisible,
  selectedTask,
  completedTasks = {},
  showTooltip,
  hideTooltip,
}) => {
  const [isResizing, setIsResizing] = React.useState(false);
  const [, startTransition] = useTransition();

  const startResizing = useCallback(
    (mouseDownEvent) => {
      mouseDownEvent.preventDefault();
      setIsResizing(true);

      const startX = mouseDownEvent.clientX;
      const startWidth = sidebarWidth;
      let rafId = null;

      document.body.classList.add("is-resizing-sidebar");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handleMouseMove = (mouseMoveEvent) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const deltaX = mouseMoveEvent.clientX - startX;
          const newWidth = Math.min(Math.max(startWidth + deltaX, 200), 480);
          if (setSidebarWidth) {
            setSidebarWidth(newWidth);
          }
        });
      };

      const handleMouseUp = () => {
        if (rafId) cancelAnimationFrame(rafId);
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.classList.remove("is-resizing-sidebar");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseup", handleMouseUp);
    },
    [sidebarWidth, setSidebarWidth]
  );

  React.useEffect(() => {
    return () => {
      document.body.classList.remove("is-resizing-sidebar");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handleResetWidth = useCallback(
    (e) => {
      e.preventDefault();
      if (setSidebarWidth) {
        setSidebarWidth(280);
      }
    },
    [setSidebarWidth]
  );

  const toggleJsGroup = useCallback(
    (groupName) => {
      if (setExpandedJsGroups) {
        startTransition(() => {
          setExpandedJsGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
          }));
        });
      }
    },
    [setExpandedJsGroups]
  );

  const toggleJsSubgroup = useCallback(
    (key) => {
      if (setExpandedJsSubgroups) {
        startTransition(() => {
          setExpandedJsSubgroups((prev) => ({
            ...prev,
            [key]: !prev[key],
          }));
        });
      }
    },
    [setExpandedJsSubgroups]
  );

  // Stable reference for search={(prev) => prev} to avoid re-renders from new function references
  const preserveSearch = useCallback((prev) => prev, []);

  const handleMobileNavClick = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sectionDropdownRef?.current &&
        !sectionDropdownRef.current.contains(event.target)
      ) {
        if (setSectionDropdownOpen) setSectionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sectionDropdownRef, setSectionDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen && typeof window !== "undefined" && window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  const isTaskSolved = useCallback(
    (id) => {
      const val = completedTasks[id] ?? completedTasks[String(id)];
      return val === true || val === "solved";
    },
    [completedTasks]
  );

  const getTaskStatus = useCallback(
    (id) => {
      const val = completedTasks[id] ?? completedTasks[String(id)];
      if (val === true || val === "solved") return "solved";
      if (val === "unsolved") return "unsolved";
      return null;
    },
    [completedTasks]
  );

  // Memoized JS data structures & metrics
  const completedJsTotal = useMemo(() => {
    return JS_TASKS.filter((t) => isTaskSolved(t.id)).length;
  }, [isTaskSolved]);
  const totalJsCount = JS_TASKS.length;
  const jsPercentage = totalJsCount > 0 ? Math.round((completedJsTotal / totalJsCount) * 100) : 0;

  const { jsGroupedMap, jsGroupMetaMap } = useMemo(() => {
    const map = {};
    const metaMap = {};
    JS_TASKS.forEach((task) => {
      const g = task.group || "JavaScript";
      const s = task.subgroup || "Общее";
      if (!map[g]) {
        map[g] = {};
        metaMap[g] = getGroupMeta(g);
      }
      if (!map[g][s]) map[g][s] = [];
      map[g][s].push(task);
    });
    return { jsGroupedMap: map, jsGroupMetaMap: metaMap };
  }, []);

  // Memoized Algorithms data structures & metrics
  const completedAlgoTotal = useMemo(() => {
    return ALGO_TASKS.filter((t) => isTaskSolved(t.id)).length;
  }, [isTaskSolved]);
  const totalAlgoCount = ALGO_TASKS.length;
  const algoPercentage = totalAlgoCount > 0 ? Math.round((completedAlgoTotal / totalAlgoCount) * 100) : 0;

  const { algoGroupedMap, algoGroupMetaMap } = useMemo(() => {
    const map = {};
    const metaMap = {};
    ALGO_TASKS.forEach((task) => {
      const g = task.group || "Algorithms";
      if (!map[g]) {
        map[g] = [];
        metaMap[g] = getAlgoGroupMeta(g);
      }
      map[g].push(task);
    });
    return { algoGroupedMap: map, algoGroupMetaMap: metaMap };
  }, []);

  const selectedTaskIdStr = selectedTask ? String(selectedTask.id) : "";

  // Category toggle callbacks
  const handleToggleWarmup = useCallback(
    (e) => {
      e.stopPropagation();
      setWarmupExpanded((prev) => !prev);
    },
    [setWarmupExpanded]
  );

  const handleToggleRefactoring = useCallback(
    (e) => {
      e.stopPropagation();
      setRefactoringExpanded((prev) => !prev);
    },
    [setRefactoringExpanded]
  );

  const handleToggleTasks = useCallback(
    (e) => {
      e.stopPropagation();
      setTasksExpanded((prev) => !prev);
    },
    [setTasksExpanded]
  );

  const handleToggleAdvanced = useCallback(
    (e) => {
      e.stopPropagation();
      setAdvancedExpanded((prev) => !prev);
    },
    [setAdvancedExpanded]
  );

  const handleToggleReactTs = useCallback(
    (e) => {
      e.stopPropagation();
      setReactTsExpanded((prev) => !prev);
    },
    [setReactTsExpanded]
  );

  const handleToggleReactTsPractice = useCallback(
    (e) => {
      e.stopPropagation();
      setReactTsPracticeExpanded((prev) => !prev);
    },
    [setReactTsPracticeExpanded]
  );

  const renderSectionDropdown = () => (
    <div className="section-dropdown-menu">
      <div className="section-dropdown-header">Разделы практики</div>
      <Link
        to="/home"
        className={`section-dropdown-item ${activeSection === "home" ? "active" : ""}`}
        onClick={() => {
          setSectionDropdownOpen(false);
          handleMobileNavClick();
        }}
      >
        <Home size={15} style={{ color: "var(--color-info-light)" }} /> <span>Главная</span>{" "}
        <span className="section-badge soon">Обзор</span>
      </Link>
      <Link
        to="/javascript"
        className={`section-dropdown-item ${activeSection === "javascript" ? "active" : ""}`}
        onClick={() => {
          setSectionDropdownOpen(false);
          handleMobileNavClick();
        }}
      >
        <Zap size={15} style={{ color: "var(--color-warning)" }} /> <span>JavaScript</span>{" "}
        <span className="section-badge active">{JS_TASKS.length} задач</span>
      </Link>
      <Link
        to="/react"
        className={`section-dropdown-item ${activeSection === "react" ? "active" : ""}`}
        onClick={() => {
          setSectionDropdownOpen(false);
          handleMobileNavClick();
        }}
      >
        <Code2 size={15} style={{ color: "var(--color-info)" }} /> <span>React</span>{" "}
        <span className="section-badge active">{REACT_TASKS.length} задач</span>
      </Link>
      <Link
        to="/algorithms"
        className={`section-dropdown-item ${activeSection === "algorithms" ? "active" : ""}`}
        onClick={() => {
          setSectionDropdownOpen(false);
          handleMobileNavClick();
        }}
      >
        <Brain size={15} style={{ color: "var(--color-accent-purple)" }} /> <span>Алгоритмы</span>{" "}
        <span className="section-badge active">{ALGO_TASKS.length} задач</span>
      </Link>
    </div>
  );

  return (
    <aside
      className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"} ${isResizing ? "is-resizing" : ""}`}
      style={
        sidebarOpen
          ? { width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px`, maxWidth: `${sidebarWidth}px` }
          : undefined
      }
    >
      <div className="sidebar-header">
        <div className="sidebar-workspace-info-wrapper" ref={sectionDropdownRef}>
          <button
            className="sidebar-workspace-info-btn"
            onClick={() => {
              if (setHeaderSectionDropdownOpen) setHeaderSectionDropdownOpen(false);
              setSectionDropdownOpen((prev) => !prev);
            }}
            title="Переключить раздел платформы"
          >
            {activeSection === "home" && (
              <>
                <Home size={15} style={{ color: "#60a5fa" }} /> <span>Главная</span>
              </>
            )}
            {activeSection === "react" && (
              <>
                <Code2 size={15} style={{ color: "#61dafb" }} /> <span>React</span>
              </>
            )}
            {activeSection === "javascript" && (
              <>
                <Zap size={15} style={{ color: "#f59e0b" }} /> <span>JavaScript</span>
              </>
            )}
            {activeSection === "algorithms" && (
              <>
                <Brain size={15} style={{ color: "#a855f7" }} /> <span>Алгоритмы</span>
              </>
            )}
            <ChevronDown size={13} className="sidebar-section-chevron" />
          </button>

          {sectionDropdownOpen && renderSectionDropdown()}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(false)}
          title="Свернуть боковую панель"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      <div className="sidebar-scroll-content">
        {activeSection === "react" ? (
          <>
            <div
              className="sidebar-progress-card"
              onClick={() => setStatsModalOpen && setStatsModalOpen(true)}
              style={{ cursor: "pointer" }}
              title="Открыть расширенную статистику задач"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-main)",
                    fontSize: "var(--fs-sidebar-section)",
                    fontWeight: "var(--fw-semibold)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--ls-section)",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <CheckSquare size={13} /> Выполнено задач
                </span>
                <span
                  style={{
                    color: "var(--accent-blue)",
                    fontSize: "var(--fs-sidebar-badge)",
                    fontWeight: "var(--fw-bold)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {completedTotal}/{totalTasks}
                </span>
              </div>

              <div
                style={{
                  height: "4px",
                  background: "var(--border-color)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: "var(--accent-blue)",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {/* Разминка */}
            <div className="tree-group-block" id="category-warmup">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-warmup" }}
                search={preserveSearch}
                title="Разминка"
                icon={<Flame size={15} style={{ color: "#ff6b6b" }} />}
                chevronExpanded={warmupExpanded}
                onToggle={handleToggleWarmup}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-warmup"}
                isCompleted={completedWarmup > 0 && completedWarmup === totalWarmup}
                completedCount={completedWarmup}
                totalCount={totalWarmup}
              />
              <div className={`task-list-wrapper ${warmupExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {WARMUP_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Рефакторинг */}
            <div className="tree-group-block" id="category-refactoring">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-refactoring" }}
                search={preserveSearch}
                title="Рефакторинг"
                icon={<Wrench size={15} style={{ color: "#3b82f6" }} />}
                chevronExpanded={refactoringExpanded}
                onToggle={handleToggleRefactoring}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-refactoring"}
                isCompleted={completedRefactoring > 0 && completedRefactoring === totalRefactoring}
                completedCount={completedRefactoring}
                totalCount={totalRefactoring}
              />
              <div className={`task-list-wrapper ${refactoringExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {REFACTORING_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Основные задачи (Middle) */}
            <div className="tree-group-block" id="category-middle">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-middle" }}
                search={preserveSearch}
                title="Middle"
                icon={<Rocket size={15} style={{ color: "#10b981" }} />}
                chevronExpanded={tasksExpanded}
                onToggle={handleToggleTasks}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-middle"}
                isCompleted={completedMain > 0 && completedMain === totalMain}
                completedCount={completedMain}
                totalCount={totalMain}
              />
              <div className={`task-list-wrapper ${tasksExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {MAIN_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Сложные задачи (Strong) */}
            <div className="tree-group-block" id="category-strong">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-strong" }}
                search={preserveSearch}
                title="Strong"
                icon={<Brain size={15} style={{ color: "#a855f7" }} />}
                chevronExpanded={advancedExpanded}
                onToggle={handleToggleAdvanced}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-strong"}
                isCompleted={completedAdvanced > 0 && completedAdvanced === totalAdvanced}
                completedCount={completedAdvanced}
                totalCount={totalAdvanced}
              />
              <div className={`task-list-wrapper ${advancedExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {ADVANCED_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* React + TypeScript (Разминка) */}
            <div className="tree-group-block" id="category-ts">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-ts" }}
                search={preserveSearch}
                title="React + TS (Разминка)"
                icon={<Zap size={15} style={{ color: "#eab308" }} />}
                chevronExpanded={reactTsExpanded}
                onToggle={handleToggleReactTs}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-ts"}
                isCompleted={completedReactTs > 0 && completedReactTs === totalReactTs}
                completedCount={completedReactTs}
                totalCount={totalReactTs}
              />
              <div className={`task-list-wrapper ${reactTsExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {REACT_TS_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* React + TypeScript (Практика) */}
            <div className="tree-group-block" id="category-ts-practice">
              <SidebarGroupHeader
                to="/react/$taskId"
                params={{ taskId: "group-ts-practice" }}
                search={preserveSearch}
                title="React + TS (Практика)"
                icon={<Zap size={15} style={{ color: "#eab308" }} />}
                chevronExpanded={reactTsPracticeExpanded}
                onToggle={handleToggleReactTsPractice}
                onNavClick={handleMobileNavClick}
                isActive={selectedTaskIdStr === "group-ts-practice"}
                isCompleted={completedReactTsPractice > 0 && completedReactTsPractice === totalReactTsPractice}
                completedCount={completedReactTsPractice}
                totalCount={totalReactTsPractice}
              />
              <div className={`task-list-wrapper ${reactTsPracticeExpanded ? "expanded" : ""}`}>
                <div className="task-list-inner tree-tasks-container">
                  {REACT_TS_PRACTICE_TASKS.filter(isTaskVisible).map((task) => (
                    <SidebarTaskItem
                      key={task.id}
                      id={task.id}
                      to="/react/$taskId"
                      params={{ taskId: String(task.id) }}
                      search={preserveSearch}
                      title={task.title}
                      isActive={selectedTaskIdStr === String(task.id)}
                      status={getTaskStatus(task.id)}
                      onNavClick={handleMobileNavClick}
                      showTooltip={showTooltip}
                      hideTooltip={hideTooltip}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : activeSection === "javascript" ? (
          <>
            <div
              className="sidebar-progress-card"
              onClick={() => setStatsModalOpen && setStatsModalOpen(true)}
              style={{ cursor: "pointer" }}
              title="Открыть расширенную статистику задач JavaScript"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-main)",
                    fontSize: "var(--fs-sidebar-section)",
                    fontWeight: "var(--fw-semibold)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--ls-section)",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <CheckSquare size={13} /> Выполнено задач
                </span>
                <span
                  style={{
                    color: "#f59e0b",
                    fontSize: "var(--fs-sidebar-badge)",
                    fontWeight: "var(--fw-bold)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {completedJsTotal}/{totalJsCount}
                </span>
              </div>

              <div
                style={{
                  height: "4px",
                  background: "var(--border-color)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${jsPercentage}%`,
                    height: "100%",
                    background: "#f59e0b",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {Object.entries(jsGroupedMap).map(([groupName, subgroups]) => {
              const totalGroupTasks = Object.values(subgroups).flat();
              const completedGroupTasks = totalGroupTasks.filter((t) => isTaskSolved(t.id));
              const isGroupCompleted =
                completedGroupTasks.length > 0 && completedGroupTasks.length === totalGroupTasks.length;
              const isGroupOpen = Boolean(expandedJsGroups[groupName]);
              const groupMeta = jsGroupMetaMap[groupName] || getGroupMeta(groupName);
              const isFolderActive =
                selectedTaskIdStr === `group-${groupName}` ||
                selectedTaskIdStr === `group-${encodeURIComponent(groupName)}` ||
                (Boolean(selectedTask?.isGroupOverview) &&
                  !selectedTask?.subgroup &&
                  (selectedTask?.group === groupName ||
                    selectedTask?.id === `group-${groupName}` ||
                    selectedTask?.id === `group-${encodeURIComponent(groupName)}`));

              return (
                <div className="tree-group-block" key={groupName} id={`category-js-${groupName}`}>
                  {/* Level 0: Group Header */}
                  <SidebarGroupHeader
                    to="/javascript/$taskId"
                    params={{ taskId: `group-${groupName}` }}
                    search={preserveSearch}
                    title={groupName}
                    icon={groupMeta.renderIcon(15)}
                    chevronExpanded={isGroupOpen}
                    onToggle={(e) => {
                      e.stopPropagation();
                      toggleJsGroup(groupName);
                    }}
                    onNavClick={handleMobileNavClick}
                    isActive={isFolderActive}
                    isCompleted={isGroupCompleted}
                    completedCount={completedGroupTasks.length}
                    totalCount={totalGroupTasks.length}
                  />

                  {/* Level 1: Subgroups container (Smooth Grid Accordion) */}
                  <div className={`task-list-wrapper ${isGroupOpen ? "expanded" : ""}`}>
                    <div className="task-list-inner tree-subgroups-container">
                      {Object.entries(subgroups).map(([subgroupName, tasks]) => {
                        const subKey = `${groupName}/${subgroupName}`;
                        const isSubOpen = Boolean(expandedJsSubgroups[subKey]);
                        const completedSubTasks = tasks.filter((t) => isTaskSolved(t.id));
                        const isSubCompleted =
                          completedSubTasks.length > 0 && completedSubTasks.length === tasks.length;
                        const isSubActive =
                          selectedTaskIdStr === `subgroup-${subgroupName}` ||
                          selectedTaskIdStr === `subgroup-${encodeURIComponent(subgroupName)}` ||
                          selectedTaskIdStr === `subgroup-${groupName}-${subgroupName}` ||
                          selectedTaskIdStr === `subgroup-${encodeURIComponent(groupName)}-${encodeURIComponent(subgroupName)}` ||
                          (Boolean(selectedTask?.isGroupOverview) &&
                            Boolean(selectedTask?.subgroup) &&
                            selectedTask.subgroup === subgroupName &&
                            (!selectedTask.group || selectedTask.group === groupName));

                        return (
                          <div
                            className="tree-subgroup-block"
                            key={subgroupName}
                            id={`category-subgroup-${groupName}-${subgroupName}`}
                          >
                            {/* Level 1: Subgroup Header */}
                            <SidebarSubgroupHeader
                              to="/javascript/$taskId"
                              params={{ taskId: `subgroup-${subgroupName}` }}
                              search={preserveSearch}
                              title={subgroupName}
                              color={groupMeta.color}
                              chevronExpanded={isSubOpen}
                              onToggle={(e) => {
                                e.stopPropagation();
                                toggleJsSubgroup(subKey);
                              }}
                              onNavClick={handleMobileNavClick}
                              isActive={isSubActive}
                              isCompleted={isSubCompleted}
                              completedCount={completedSubTasks.length}
                              totalCount={tasks.length}
                            />

                            {/* Level 2: Tasks list container (Smooth Grid Accordion) */}
                            <div className={`task-list-wrapper ${isSubOpen ? "expanded" : ""}`}>
                              <div className="task-list-inner tree-tasks-container">
                                {tasks.filter(isTaskVisible).map((task) => (
                                  <SidebarTaskItem
                                    key={task.id}
                                    id={task.id}
                                    to="/javascript/$taskId"
                                    params={{ taskId: String(task.id) }}
                                    search={preserveSearch}
                                    title={task.title}
                                    isActive={selectedTaskIdStr === String(task.id)}
                                    status={getTaskStatus(task.id)}
                                    onNavClick={handleMobileNavClick}
                                    showTooltip={showTooltip}
                                    hideTooltip={hideTooltip}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : activeSection === "algorithms" ? (
          <>
            <div
              className="sidebar-progress-card"
              onClick={() => setStatsModalOpen && setStatsModalOpen(true)}
              style={{ cursor: "pointer" }}
              title="Открыть расширенную статистику задач Алгоритмы"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    color: "var(--text-main)",
                    fontSize: "var(--fs-sidebar-section)",
                    fontWeight: "var(--fw-semibold)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--ls-section)",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <CheckSquare size={13} /> Выполнено задач
                </span>
                <span
                  style={{
                    color: "#a855f7",
                    fontSize: "var(--fs-sidebar-badge)",
                    fontWeight: "var(--fw-bold)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {completedAlgoTotal}/{totalAlgoCount}
                </span>
              </div>

              <div
                style={{
                  height: "4px",
                  background: "var(--border-color)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${algoPercentage}%`,
                    height: "100%",
                    background: "#a855f7",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {Object.entries(algoGroupedMap).map(([groupName, tasks]) => {
              const completedGroupTasks = tasks.filter((t) => isTaskSolved(t.id));
              const isGroupCompleted =
                completedGroupTasks.length > 0 && completedGroupTasks.length === tasks.length;
              const isGroupOpen = Boolean(expandedJsGroups[groupName]);
              const groupMeta = algoGroupMetaMap[groupName] || getAlgoGroupMeta(groupName);
              const isFolderActive =
                selectedTaskIdStr === groupMeta.infoId ||
                selectedTaskIdStr === `group-${groupName}` ||
                selectedTaskIdStr === `group-${encodeURIComponent(groupName)}` ||
                (Boolean(selectedTask?.isGroupOverview) &&
                  !selectedTask?.subgroup &&
                  (selectedTask?.id === groupMeta.infoId || selectedTask?.group === groupName)) ||
                (!selectedTask && groupMeta.infoId === "group-two-pointers");

              return (
                <div className="tree-group-block" key={groupName} id={`category-algo-${groupName}`}>
                  {/* Level 0: Group Header */}
                  <SidebarGroupHeader
                    to="/algorithms/$taskId"
                    params={{ taskId: groupMeta.infoId || "group-two-pointers" }}
                    search={preserveSearch}
                    title={groupName}
                    icon={groupMeta.renderIcon(15)}
                    chevronExpanded={isGroupOpen}
                    onToggle={(e) => {
                      e.stopPropagation();
                      toggleJsGroup(groupName);
                    }}
                    onNavClick={handleMobileNavClick}
                    isActive={isFolderActive}
                    isCompleted={isGroupCompleted}
                    completedCount={completedGroupTasks.length}
                    totalCount={tasks.length}
                  />

                  {/* Level 1: Directly Tasks list container */}
                  <div className={`task-list-wrapper ${isGroupOpen ? "expanded" : ""}`}>
                    <div className="task-list-inner tree-tasks-container">
                      {tasks.filter(isTaskVisible).map((task) => (
                        <SidebarTaskItem
                          key={task.id}
                          id={task.id}
                          to="/algorithms/$taskId"
                          params={{ taskId: String(task.id) }}
                          search={preserveSearch}
                          title={task.title}
                          isActive={selectedTaskIdStr === String(task.id)}
                          status={getTaskStatus(task.id)}
                          onNavClick={handleMobileNavClick}
                          showTooltip={showTooltip}
                          hideTooltip={hideTooltip}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <Link
              to="/home"
              className={`tree-node-header group-header ${activeSection === "home" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              <Home size={15} style={{ color: "#60a5fa" }} />
              <span className="node-title">Главная (Обзор)</span>
            </Link>

            <Link
              to="/javascript"
              className={`tree-node-header group-header ${activeSection === "javascript" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              <Zap size={15} style={{ color: "#f59e0b" }} />
              <span className="node-title">JavaScript</span>
              <span
                className={`node-count ${
                  completedJsTotal > 0 && completedJsTotal === totalJsCount ? "completed" : ""
                }`}
              >
                {completedJsTotal}/{totalJsCount}
              </span>
            </Link>

            <Link
              to="/react"
              className={`tree-node-header group-header ${activeSection === "react" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              <Code2 size={15} style={{ color: "#61dafb" }} />
              <span className="node-title">React</span>
              <span
                className={`node-count ${
                  completedTotal > 0 && completedTotal === totalTasks ? "completed" : ""
                }`}
              >
                {completedTotal}/{totalTasks}
              </span>
            </Link>

            <Link
              to="/algorithms"
              className={`tree-node-header group-header ${activeSection === "algorithms" ? "active" : ""}`}
              onClick={handleMobileNavClick}
            >
              <Brain size={15} style={{ color: "#a855f7" }} />
              <span className="node-title">Алгоритмы</span>
              <span
                className={`node-count ${
                  completedAlgoTotal > 0 && completedAlgoTotal === totalAlgoCount ? "completed" : ""
                }`}
              >
                {completedAlgoTotal}/{totalAlgoCount}
              </span>
            </Link>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div
          className={`sidebar-resizer ${isResizing ? "is-active" : ""}`}
          onMouseDown={startResizing}
          onDoubleClick={handleResetWidth}
          title="Зажмите и потяните для изменения ширины. Двойной клик — сброс"
        />
      )}
    </aside>
  );
};

export default React.memo(Sidebar);
