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
  Folder,
} from "lucide-react";
import { REACT_TASKS } from "../../react/data/tasksData";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { getGroupMeta } from "../../javascript/data/groupConfig";
import { ALGO_TASKS } from "../../algorithms/data/tasksData";
import { getAlgoGroupMeta } from "../../algorithms/data/groupConfig";

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

  const groupDropdownRef = React.useRef(null);
  const subgroupDropdownRef = React.useRef(null);

  const closeAllDropdowns = () => {
    if (setSectionDropdownOpen) setSectionDropdownOpen(false);
    if (setHeaderSectionDropdownOpen) setHeaderSectionDropdownOpen(false);
    if (setCategoryDropdownOpen) setCategoryDropdownOpen(false);
    if (setTaskDropdownOpen) setTaskDropdownOpen(false);
    setGroupDropdownOpen(false);
    setSubgroupDropdownOpen(false);
    if (setAlgoDropdownOpen) setAlgoDropdownOpen(false);
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
          <span className="section-badge soon">Обзор</span>
        </Link>
        <Link
          to="/javascript"
          className={`breadcrumb-dropdown-item ${activeSection === "javascript" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Zap size={15} style={{ color: "var(--color-warning)" }} /></span>
          <span className="dropdown-item-title">JavaScript</span>
          <span className="section-badge active">{JS_TASKS.length} задач</span>
        </Link>
        <Link
          to="/react"
          className={`breadcrumb-dropdown-item ${activeSection === "react" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Code2 size={15} style={{ color: "var(--color-info)" }} /></span>
          <span className="dropdown-item-title">React</span>
          <span className="section-badge active">{REACT_TASKS.length} задач</span>
        </Link>
        <Link
          to="/algorithms"
          className={`breadcrumb-dropdown-item ${activeSection === "algorithms" ? "active" : ""}`}
          onClick={closeAllDropdowns}
        >
          <span className="breadcrumb-dropdown-icon"><Brain size={15} style={{ color: "var(--color-accent-purple)" }} /></span>
          <span className="dropdown-item-title">Алгоритмы</span>
          <span className="section-badge active">{ALGO_TASKS.length} задач</span>
        </Link>
      </div>
    </div>
  );

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className={`sidebar-toggle-btn ${sidebarOpen ? "desktop-hidden" : ""}`}
          onClick={() => setSidebarOpen((prev) => !prev)}
          title={sidebarOpen ? "Свернуть панель задач" : "Развернуть панель задач"}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

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
                            ).map((t) => (
                              <Link
                                key={t.id}
                                to="/javascript/$taskId"
                                params={{ taskId: String(t.id) }}
                                search={(prev) => prev}
                                className={`breadcrumb-dropdown-item ${t.id === selectedTask?.id ? "active" : ""}`}
                                onClick={closeAllDropdowns}
                              >
                                <span className="breadcrumb-dropdown-icon">{taskIcon}</span>
                                <span className="dropdown-item-title">{t.title}</span>
                                {completedTasks[t.id] &&
                                  (completedTasks[t.id] === "unsolved" ? (
                                    <span className="dropdown-item-unsolved"><X size={12} /></span>
                                  ) : (
                                    <span className="dropdown-item-check"><Check size={12} /></span>
                                  ))}
                              </Link>
                            ))}
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
                          {currentCategoryTasks.map((t) => (
                            <Link
                              key={t.id}
                              to="/react/$taskId"
                              params={{ taskId: String(t.id) }}
                              search={(prev) => prev}
                              className={`breadcrumb-dropdown-item ${t.id === selectedTask?.id ? "active" : ""}`}
                              onClick={closeAllDropdowns}
                            >
                              <span className="breadcrumb-dropdown-icon">{taskIcon}</span>
                              <span className="dropdown-item-title">{t.title}</span>
                              {completedTasks[t.id] &&
                                (completedTasks[t.id] === "unsolved" ? (
                                  <span className="dropdown-item-unsolved"><X size={12} /></span>
                                ) : (
                                  <span className="dropdown-item-check"><Check size={12} /></span>
                                ))}
                            </Link>
                          ))}
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
                            {ALGO_TASKS.filter((t) => t.group === currentGroup).map((t) => (
                              <Link
                                key={t.id}
                                to="/algorithms/$taskId"
                                params={{ taskId: String(t.id) }}
                                search={(prev) => prev}
                                className={`breadcrumb-dropdown-item ${t.id === selectedTask?.id ? "active" : ""}`}
                                onClick={closeAllDropdowns}
                              >
                                <span className="breadcrumb-dropdown-icon">{taskIcon}</span>
                                <span className="dropdown-item-title">{t.title}</span>
                                {completedTasks[t.id] &&
                                  (completedTasks[t.id] === "unsolved" ? (
                                    <span className="dropdown-item-unsolved"><X size={12} /></span>
                                  ) : (
                                    <span className="dropdown-item-check"><Check size={12} /></span>
                                  ))}
                              </Link>
                            ))}
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
        {/* Кнопка Статистика */}
        <button
          className={`header-action-btn ${
            activeSection === "home" ? "disabled" : statsModalOpen ? "active" : ""
          }`}
          onClick={activeSection === "home" ? undefined : () => setStatsModalOpen((prev) => !prev)}
          disabled={activeSection === "home"}
          title={
            activeSection === "home"
              ? "Статистика недоступна в разделе Главная"
              : "Открыть подробную статистику выполнения задач"
          }
        >
          <BarChart2 size={15} /> Статистика
        </button>

        {/* Кнопка Шпаргалки */}
        <button
          className={`header-action-btn ${
            activeSection === "home" ? "disabled" : cheatSheetOpen ? "active" : ""
          }`}
          onClick={activeSection === "home" ? undefined : () => setCheatSheetOpen((prev) => !prev)}
          disabled={activeSection === "home"}
          title={
            activeSection === "home"
              ? "Шпаргалки недоступны в разделе Главная"
              : "Открыть выпадающую шпаргалку для собеседований"
          }
        >
          <Lightbulb size={15} /> Шпаргалка
        </button>

        {/* Поиск Cmd+K */}
        <button
          className="header-action-btn"
          onClick={() => setPaletteOpen(true)}
          title="Быстрый поиск задачи по всему приложению (Cmd+K)"
        >
          <Search size={15} /> <kbd className="header-kbd">⌘K</kbd>
        </button>

        {/* Таймер собеседования */}
        <div className={`timer-dropdown-container ${activeSection === "home" ? "disabled" : ""}`}>
          {timerSeconds !== null ? (
            <div
              className={`timer-display ${timerSeconds === 0 ? "expired" : ""} ${activeSection === "home" ? "disabled" : ""}`}
              onClick={
                activeSection === "home"
                  ? undefined
                  : () => {
                      setTimerRunning(false);
                      setTimerSeconds(null);
                    }
              }
              title={
                activeSection === "home"
                  ? "Таймер недоступен на Главной странице"
                  : "Нажмите чтобы сбросить таймер"
              }
            >
              <><Clock size={14} /> {formatTimer(timerSeconds)}</>
            </div>
          ) : (
            <div
              className={`timer-select-wrapper ${activeSection === "home" ? "disabled" : ""}`}
              title={activeSection === "home" ? "Таймер недоступен на Главной странице" : "Таймер собеседования"}
            >
              <Clock size={14} style={{ opacity: 0.7 }} />
              <select
                className="timer-select"
                disabled={activeSection === "home"}
                onChange={(e) => {
                  if (activeSection === "home") return;
                  const val = parseInt(e.target.value, 10);
                  if (val > 0) startTimer(val);
                  e.target.value = "";
                }}
                defaultValue=""
              >
                <option value="" disabled>Таймер...</option>
                <option value="15">15 мин</option>
                <option value="30">30 мин</option>
                <option value="45">45 мин</option>
              </select>
            </div>
          )}
        </div>

        {/* Переключатель темы */}
        <button
          className="header-action-btn"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          title={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
