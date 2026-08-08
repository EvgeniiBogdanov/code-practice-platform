import React from "react";
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
  FolderTree,
  X,
  Check,
} from "lucide-react";
import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
} from "../../react/data/tasksData";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { getGroupMeta } from "../../javascript/data/groupConfig";


export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth = 260,
  setSidebarWidth,
  activeSection,
  setActiveSection,
  sectionDropdownOpen,
  setSectionDropdownOpen,
  sectionDropdownRef,
  renderSectionDropdownMenu,
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
  // Handlers & task states
  isTaskVisible,
  selectedTask,
  setSelectedTask,
  setActiveTab,
  completedTasks,
  showTooltip,
  hideTooltip,
}) => {
  const [expandedJsGroups, setExpandedJsGroups] = React.useState({});
  const [expandedJsSubgroups, setExpandedJsSubgroups] = React.useState({});
  const [isResizing, setIsResizing] = React.useState(false);

  const startResizing = React.useCallback(
    (mouseDownEvent) => {
      mouseDownEvent.preventDefault();
      setIsResizing(true);

      const startX = mouseDownEvent.clientX;
      const startWidth = sidebarWidth;

      const handleMouseMove = (mouseMoveEvent) => {
        const deltaX = mouseMoveEvent.clientX - startX;
        const newWidth = Math.min(Math.max(startWidth + deltaX, 200), 480);
        if (setSidebarWidth) {
          setSidebarWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [sidebarWidth, setSidebarWidth]
  );

  const handleResetWidth = React.useCallback(
    (e) => {
      e.preventDefault();
      if (setSidebarWidth) {
        setSidebarWidth(260);
      }
    },
    [setSidebarWidth]
  );

  const toggleJsGroup = (groupName) => {
    setExpandedJsGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const toggleJsSubgroup = (key) => {
    setExpandedJsSubgroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    if (setActiveTab) setActiveTab("candidate");
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen && typeof window !== "undefined" && window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  React.useEffect(() => {
    // Единый паттерн для всех корневых разделов: при переключении все группы и подгруппы свернуты
    setExpandedJsGroups({});
    setExpandedJsSubgroups({});
    if (setWarmupExpanded) setWarmupExpanded(false);
    if (setRefactoringExpanded) setRefactoringExpanded(false);
    if (setTasksExpanded) setTasksExpanded(false);
    if (setAdvancedExpanded) setAdvancedExpanded(false);
    if (setReactTsExpanded) setReactTsExpanded(false);
    if (setReactTsPracticeExpanded) setReactTsPracticeExpanded(false);
  }, [activeSection]);

  const completedJsTotal = JS_TASKS.filter((t) => completedTasks[t.id]).length;
  const totalJsCount = JS_TASKS.length;

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
            onClick={() => setSectionDropdownOpen((prev) => !prev)}
            title="Переключить раздел платформы"
          >
            {activeSection === "home" && <><Home size={15} style={{ color: "#60a5fa" }} /> <span>ГЛАВНАЯ</span></>}
            {activeSection === "react" && <><Code2 size={15} style={{ color: "#61dafb" }} /> <span>REACT</span></>}
            {activeSection === "javascript" && <><Zap size={15} style={{ color: "#f59e0b" }} /> <span>JAVASCRIPT</span></>}
            {activeSection === "algorithms" && <><Brain size={15} style={{ color: "#a855f7" }} /> <span>АЛГОРИТМЫ</span></>}
            <ChevronDown size={13} className="sidebar-section-chevron" />
          </button>

          {sectionDropdownOpen && renderSectionDropdownMenu(() => setSectionDropdownOpen(false))}
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
              onClick={() => setStatsModalOpen(true)}
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
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
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
                    color: "var(--notion-blue)",
                    fontSize: "11px",
                    fontWeight: "bold",
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
                    background: "var(--notion-blue)",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {/* Разминка */}
            <div className="notion-tree-group-block" id="category-warmup">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setWarmupExpanded(!warmupExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${warmupExpanded ? "expanded" : ""}`}
                />
                <Flame size={15} style={{ color: "#ff6b6b" }} />
                <span className="node-title">Разминка</span>
                <span className={`node-count ${completedWarmup > 0 && completedWarmup === totalWarmup ? "completed" : ""}`}>
                  {completedWarmup}/{totalWarmup}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${warmupExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {WARMUP_TASKS.filter(isTaskVisible).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                      onMouseEnter={(e) => showTooltip(e, task.title)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                      {completedTasks[task.id] &&
                        (completedTasks[task.id] === "unsolved" ? (
                          <span className="dropdown-item-unsolved"><X size={12} /></span>
                        ) : (
                          <span className="dropdown-item-check"><Check size={12} /></span>
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Рефакторинг */}
            <div className="notion-tree-group-block" id="category-refactoring">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setRefactoringExpanded(!refactoringExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${refactoringExpanded ? "expanded" : ""}`}
                />
                <Wrench size={15} style={{ color: "#3b82f6" }} />
                <span className="node-title">Рефакторинг</span>
                <span className={`node-count ${completedRefactoring > 0 && completedRefactoring === totalRefactoring ? "completed" : ""}`}>
                  {completedRefactoring}/{totalRefactoring}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${refactoringExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {REFACTORING_TASKS.filter(isTaskVisible).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                      onMouseEnter={(e) => showTooltip(e, task.title)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                      {completedTasks[task.id] &&
                        (completedTasks[task.id] === "unsolved" ? (
                          <span className="dropdown-item-unsolved"><X size={12} /></span>
                        ) : (
                          <span className="dropdown-item-check"><Check size={12} /></span>
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Основные задачи (Middle) */}
            <div className="notion-tree-group-block" id="category-middle">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setTasksExpanded(!tasksExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${tasksExpanded ? "expanded" : ""}`}
                />
                <Rocket size={15} style={{ color: "#10b981" }} />
                <span className="node-title">Middle</span>
                <span className={`node-count ${completedMain > 0 && completedMain === totalMain ? "completed" : ""}`}>
                  {completedMain}/{totalMain}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${tasksExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {MAIN_TASKS.filter(isTaskVisible).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                      onMouseEnter={(e) => showTooltip(e, task.title)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                      {completedTasks[task.id] &&
                        (completedTasks[task.id] === "unsolved" ? (
                          <span className="dropdown-item-unsolved"><X size={12} /></span>
                        ) : (
                          <span className="dropdown-item-check"><Check size={12} /></span>
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Сложные задачи (Strong) */}
            <div className="notion-tree-group-block" id="category-strong">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setAdvancedExpanded(!advancedExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${advancedExpanded ? "expanded" : ""}`}
                />
                <Brain size={15} style={{ color: "#a855f7" }} />
                <span className="node-title">Strong</span>
                <span className={`node-count ${completedAdvanced > 0 && completedAdvanced === totalAdvanced ? "completed" : ""}`}>
                  {completedAdvanced}/{totalAdvanced}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${advancedExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {ADVANCED_TASKS.filter(isTaskVisible).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                      onMouseEnter={(e) => showTooltip(e, task.title)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                      {completedTasks[task.id] &&
                        (completedTasks[task.id] === "unsolved" ? (
                          <span className="dropdown-item-unsolved"><X size={12} /></span>
                        ) : (
                          <span className="dropdown-item-check"><Check size={12} /></span>
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* React + TypeScript (Разминка) */}
            <div className="notion-tree-group-block" id="category-ts">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setReactTsExpanded(!reactTsExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${reactTsExpanded ? "expanded" : ""}`}
                />
                <Zap size={15} style={{ color: "#eab308" }} />
                <span className="node-title">React + TS (Разминка)</span>
                <span className={`node-count ${completedReactTs > 0 && completedReactTs === totalReactTs ? "completed" : ""}`}>
                  {completedReactTs}/{totalReactTs}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${reactTsExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {REACT_TS_TASKS.filter(isTaskVisible).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                      onMouseEnter={(e) => showTooltip(e, task.title)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                      {completedTasks[task.id] &&
                        (completedTasks[task.id] === "unsolved" ? (
                          <span className="dropdown-item-unsolved"><X size={12} /></span>
                        ) : (
                          <span className="dropdown-item-check"><Check size={12} /></span>
                        ))}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* React + TypeScript (Практика) */}
            <div className="notion-tree-group-block" id="category-ts-practice">
              <div
                className="notion-tree-node-header group-header"
                onClick={() => setReactTsPracticeExpanded(!reactTsPracticeExpanded)}
              >
                <ChevronRight
                  size={13}
                  className={`sidebar-chevron ${reactTsPracticeExpanded ? "expanded" : ""}`}
                />
                <Zap size={15} style={{ color: "#eab308" }} />
                <span className="node-title">React + TS (Практика)</span>
                <span className={`node-count ${completedReactTsPractice > 0 && completedReactTsPractice === totalReactTsPractice ? "completed" : ""}`}>
                  {completedReactTsPractice}/{totalReactTsPractice}
                </span>
              </div>
              <div
                className={`task-list-wrapper ${reactTsPracticeExpanded ? "expanded" : ""}`}
              >
                <div className="task-list-inner notion-tree-tasks-container">
                  {REACT_TS_PRACTICE_TASKS.filter(isTaskVisible).length === 0 ? (
                    <div style={{ padding: "5px 8px", fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                      Скоро появятся новые задачи...
                    </div>
                  ) : (
                    REACT_TS_PRACTICE_TASKS.filter(isTaskVisible).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          setActiveTab("candidate");
                        }}
                        className={`task-btn notion-tree-task-btn ${selectedTask?.id === task.id ? "active" : ""}`}
                        onMouseEnter={(e) => showTooltip(e, task.title)}
                        onMouseLeave={hideTooltip}
                      >
                        <span className="task-btn-title"><FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span></span>
                        {completedTasks[task.id] &&
                          (completedTasks[task.id] === "unsolved" ? (
                            <span className="dropdown-item-unsolved"><X size={12} /></span>
                          ) : (
                            <span className="dropdown-item-check"><Check size={12} /></span>
                          ))}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : activeSection === "javascript" ? (
          (() => {
            const completedJsTotal = JS_TASKS.filter((t) => completedTasks[t.id]).length;
            const totalJsCount = JS_TASKS.length;
            const jsPercentage = totalJsCount > 0 ? Math.round((completedJsTotal / totalJsCount) * 100) : 0;

            const jsGroupedMap = {};
            JS_TASKS.forEach((task) => {
              const g = task.group || "JavaScript";
              const s = task.subgroup || "Общее";
              if (!jsGroupedMap[g]) jsGroupedMap[g] = {};
              if (!jsGroupedMap[g][s]) jsGroupedMap[g][s] = [];
              jsGroupedMap[g][s].push(task);
            });

            return (
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
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
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
                        fontSize: "11px",
                        fontWeight: "bold",
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
                  const completedGroupTasks = totalGroupTasks.filter((t) => completedTasks[t.id]);
                  const isGroupCompleted = completedGroupTasks.length > 0 && completedGroupTasks.length === totalGroupTasks.length;
                  const isGroupOpen = Boolean(expandedJsGroups[groupName]);
                  const groupMeta = getGroupMeta(groupName);

                  return (
                    <div className="notion-tree-group-block" key={groupName} id={`category-js-${groupName}`}>
                      {/* Level 0: Group Header */}
                      <div
                        className="notion-tree-node-header group-header"
                        onClick={() => toggleJsGroup(groupName)}
                      >
                        <ChevronRight
                          size={13}
                          className={`sidebar-chevron ${isGroupOpen ? "expanded" : ""}`}
                        />
                        {groupMeta.renderIcon(15)}
                        <span className="node-title">{groupName}</span>
                        <span className={`node-count ${isGroupCompleted ? "completed" : ""}`}>
                          {completedGroupTasks.length}/{totalGroupTasks.length}
                        </span>
                      </div>

                      {/* Level 1: Subgroups container (Smooth Grid Accordion) */}
                      <div className={`task-list-wrapper ${isGroupOpen ? "expanded" : ""}`}>
                        <div className="task-list-inner notion-tree-subgroups-container">
                          {Object.entries(subgroups).map(([subgroupName, tasks]) => {
                            const subKey = `${groupName}/${subgroupName}`;
                            const isSubOpen = Boolean(expandedJsSubgroups[subKey]);
                            const completedSubTasks = tasks.filter((t) => completedTasks[t.id]);
                            const isSubCompleted = completedSubTasks.length > 0 && completedSubTasks.length === tasks.length;

                            return (
                              <div className="notion-tree-subgroup-block" key={subgroupName}>
                                {/* Level 1: Subgroup Header */}
                                <div
                                  className="notion-tree-node-header subgroup-header"
                                  onClick={() => toggleJsSubgroup(subKey)}
                                >
                                  <ChevronRight
                                    size={13}
                                    className={`sidebar-chevron ${isSubOpen ? "expanded" : ""}`}
                                  />
                                  <Folder size={14} style={{ color: groupMeta.color, opacity: 0.85 }} />
                                  <span className="node-title">{subgroupName}</span>
                                  <span className={`node-count ${isSubCompleted ? "completed" : ""}`}>
                                    {completedSubTasks.length}/{tasks.length}
                                  </span>
                                </div>

                                {/* Level 2: Tasks list container (Smooth Grid Accordion) */}
                                <div className={`task-list-wrapper ${isSubOpen ? "expanded" : ""}`}>
                                  <div className="task-list-inner notion-tree-tasks-container">
                                    {tasks.filter(isTaskVisible).map((task) => (
                                      <button
                                        key={task.id}
                                        onClick={() => handleTaskClick(task)}
                                        className={`task-btn notion-tree-task-btn ${
                                          selectedTask?.id === task.id ? "active" : ""
                                        }`}
                                        onMouseEnter={(e) => showTooltip(e, task.title)}
                                        onMouseLeave={hideTooltip}
                                      >
                                        <span className="task-btn-title">
                                          <FileText size={14} className="node-file-icon" style={{ color: "#94a3b8" }} /><span className="task-btn-text">{task.title}</span>
                                        </span>
                                        {completedTasks[task.id] &&
                                          (completedTasks[task.id] === "unsolved" ? (
                                            <span className="dropdown-item-unsolved">
                                              <X size={12} />
                                            </span>
                                          ) : (
                                            <span className="dropdown-item-check">
                                              <Check size={12} />
                                            </span>
                                          ))}
                                      </button>
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
            );
          })()
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <div
              className={`notion-tree-node-header group-header ${
                activeSection === "home" ? "active" : ""
              }`}
              onClick={() => setActiveSection("home")}
            >
              <Home size={15} style={{ color: "#60a5fa" }} />
              <span className="node-title">ГЛАВНАЯ (ОБЗОР)</span>
            </div>

            <div
              className={`notion-tree-node-header group-header ${
                activeSection === "javascript" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("javascript");
                if (JS_TASKS.length > 0) {
                  setSelectedTask(JS_TASKS[0]);
                  setActiveTab("candidate");
                }
              }}
            >
              <Zap size={15} style={{ color: "#f59e0b" }} />
              <span className="node-title">JAVASCRIPT</span>
              <span
                className={`node-count ${
                  completedJsTotal > 0 && completedJsTotal === totalJsCount
                    ? "completed"
                    : ""
                }`}
              >
                {completedJsTotal}/{totalJsCount}
              </span>
            </div>

            <div
              className={`notion-tree-node-header group-header ${
                activeSection === "react" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("react");
                if (WARMUP_TASKS.length > 0) {
                  setSelectedTask(WARMUP_TASKS[0]);
                  setActiveTab("candidate");
                }
              }}
            >
              <Code2 size={15} style={{ color: "#61dafb" }} />
              <span className="node-title">REACT</span>
              <span
                className={`node-count ${
                  completedTotal > 0 && completedTotal === totalTasks
                    ? "completed"
                    : ""
                }`}
              >
                {completedTotal}/{totalTasks}
              </span>
            </div>

            <div
              className={`notion-tree-node-header group-header ${
                activeSection === "algorithms" ? "active" : ""
              }`}
              onClick={() => setActiveSection("algorithms")}
            >
              <Brain size={15} style={{ color: "#a855f7" }} />
              <span className="node-title">АЛГОРИТМЫ</span>
              <span
                className="node-count"
                style={{ fontStyle: "italic", opacity: 0.7 }}
              >
                скоро
              </span>
            </div>
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

export default Sidebar;
