import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Home,
  Code2,
  Zap,
  Brain,
  Flame,
  Wrench,
  Rocket,
  FileText,
  AlertTriangle,
  RotateCcw,
  X,
} from "lucide-react";

import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
  REACT_TASKS,
  ALL_TASKS,
} from "./react/data/tasksData";
import { JS_TASKS } from "./javascript/data/tasksData";
import { FILE_ICON_COLOR } from "./constants/uiConstants";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import HomeDashboard from "./components/dashboard/HomeDashboard";
import TaskView from "./components/task/TaskView";
import CheatSheetModal from "./components/modals/CheatSheetModal";
import CommandPaletteModal from "./components/modals/CommandPaletteModal";
import StatsModal from "./components/modals/StatsModal";
import GlobalTooltip from "./components/common/GlobalTooltip";

const Playground = () => {
  const [selectedTask, setSelectedTask] = useState(() => {
    try {
      const savedId = localStorage.getItem("playground_last_selected_task_id");
      if (savedId !== null && savedId !== undefined) {
        const found = ALL_TASKS.find((t) => String(t.id) === String(savedId));
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return WARMUP_TASKS[0];
  });

  useEffect(() => {
    if (selectedTask && selectedTask.id !== undefined) {
      localStorage.setItem("playground_last_selected_task_id", String(selectedTask.id));
    }
  }, [selectedTask]);

  const [activeTab, setActiveTab] = useState("candidate"); // 'candidate', 'solution', 'materials', 'questions', 'checklist'

  // Состояние активного раздела (по умолчанию "home" для новых пользователей)
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem("playground_active_section");
    return saved ? saved : "home";
  });
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [headerSectionDropdownOpen, setHeaderSectionDropdownOpen] = useState(false);
  const sectionDropdownRef = useRef(null);
  const headerSectionDropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("playground_active_section", activeSection);
    if (activeSection === "javascript" && (!selectedTask || !String(selectedTask.id).startsWith("js"))) {
      if (JS_TASKS.length > 0) setSelectedTask(JS_TASKS[0]);
    }
  }, [activeSection]);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("playground_sidebar_open") !== "false";
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === "undefined") return 260;
    const saved = localStorage.getItem("playground_sidebar_width");
    const parsed = saved ? parseInt(saved, 10) : 260;
    return isNaN(parsed) ? 260 : Math.min(Math.max(parsed, 200), 480);
  });

  const updateSidebarWidth = useCallback((width) => {
    const clamped = Math.min(Math.max(width, 200), 480);
    setSidebarWidth(clamped);
    localStorage.setItem("playground_sidebar_width", String(clamped));
  }, []);

  const [sidebarFilter] = useState("ALL"); // ALL | SOLVED | UNSOLVED
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("playground_theme") || "dark";
  });
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [cheatCategory, setCheatCategory] = useState("hooks");
  const [cheatSearch, setCheatSearch] = useState("");

  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem("playground_checklist_state");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [timerSeconds, setTimerSeconds] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Категорийные аккордеоны в Сайдбаре (все изначально свернуты)
  const [warmupExpanded, setWarmupExpanded] = useState(false);
  const [refactoringExpanded, setRefactoringExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [reactTsExpanded, setReactTsExpanded] = useState(false);
  const [reactTsPracticeExpanded, setReactTsPracticeExpanded] = useState(false);

  const openSingleCategory = (targetCategoryId) => {
    setWarmupExpanded(targetCategoryId === "category-warmup");
    setRefactoringExpanded(targetCategoryId === "category-refactoring");
    setTasksExpanded(targetCategoryId === "category-middle");
    setAdvancedExpanded(targetCategoryId === "category-strong");
    setReactTsExpanded(targetCategoryId === "category-ts");
    setReactTsPracticeExpanded(targetCategoryId === "category-ts-practice");
  };



  const toggleChecklistItem = (key) => {
    setChecklistState((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("playground_checklist_state", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("playground_theme", theme);
  }, [theme]);

  // Запоминание настройки пользователя для десктопа (> 768px)
  const desktopSidebarPreferenceRef = useRef(
    localStorage.getItem("playground_sidebar_open") !== "false"
  );

  const setSidebarOpenWithPreference = useCallback((valOrFn) => {
    setSidebarOpen((prev) => {
      const nextVal = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        desktopSidebarPreferenceRef.current = nextVal;
        localStorage.setItem("playground_sidebar_open", String(nextVal));
      }
      return nextVal;
    });
  }, []);

  // Умный адаптивный эффект перехода Desktop <-> Mobile/Tablet (768px)
  useEffect(() => {
    let wasMobile = window.innerWidth <= 768;

    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;

      if (isNowMobile && !wasMobile) {
        // Переход с десктопа на мобильный -> сворачиваем сайдбар
        setSidebarOpen(false);
        wasMobile = true;
      } else if (!isNowMobile && wasMobile) {
        // Переход с мобильного на десктоп -> восстанавливаем сохраненное состояние десктопа
        setSidebarOpen(desktopSidebarPreferenceRef.current);
        wasMobile = false;
      }
    };

    if (wasMobile) {
      setSidebarOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyCode = (id, codeText) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Обратный отсчёт таймера
  useEffect(() => {
    if (!timerRunning || timerSeconds === null || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startTimer = (minutes) => {
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
  };

  const formatTimer = (totalSec) => {
    if (totalSec === null) return "";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Все задачи в единый список для поиска и навигации
  const allTasksList = useMemo(() => [
    ...WARMUP_TASKS.map((t) => ({ ...t, difficulty: "warm-up", category: "Разминка", section: "react" })),
    ...REFACTORING_TASKS.map((t) => ({ ...t, difficulty: "warm-up", category: "Рефакторинг", section: "react" })),
    ...MAIN_TASKS.map((t) => ({ ...t, difficulty: "middle", category: "Middle", section: "react" })),
    ...ADVANCED_TASKS.map((t) => ({ ...t, difficulty: "strong", category: "Strong", section: "react" })),
    ...REACT_TS_TASKS.map((t) => ({ ...t, difficulty: "ts", category: "React + TS (Разминка)", section: "react" })),
    ...REACT_TS_PRACTICE_TASKS.map((t) => ({ ...t, difficulty: "ts", category: "React + TS (Практика)", section: "react" })),
    ...JS_TASKS.map((t) => ({ ...t, group: t.group, subgroup: t.subgroup, category: t.group || "JavaScript", section: "javascript" })),
  ], []);

  // Клавиатурная навигация и Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        if (e.key === "Escape") setPaletteOpen(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        setPaletteQuery("");
        return;
      }

      if (e.key === "Escape") {
        setPaletteOpen(false);
        setStatsModalOpen(false);
        return;
      }

      const currentIdx = allTasksList.findIndex((t) => t.id === selectedTask.id);
      const tabs = ["candidate", "solution", "materials", "questions", "checklist"];
      const tabIdx = tabs.indexOf(activeTab);

      if (e.key === "ArrowDown" && currentIdx < allTasksList.length - 1) {
        e.preventDefault();
        setSelectedTask(allTasksList[currentIdx + 1]);
      } else if (e.key === "ArrowUp" && currentIdx > 0) {
        e.preventDefault();
        setSelectedTask(allTasksList[currentIdx - 1]);
      } else if (e.key === "ArrowRight" && tabIdx < tabs.length - 1) {
        setActiveTab(tabs[tabIdx + 1]);
      } else if (e.key === "ArrowLeft" && tabIdx > 0) {
        setActiveTab(tabs[tabIdx - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTask, activeTab, allTasksList]);

  // Tooltip для sidebar задач
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);

  const showTooltip = (e, text) => {
    clearTimeout(tooltipTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    tooltipTimer.current = setTimeout(() => {
      setTooltip({ text, x: rect.left + 12, y: rect.top - 4 });
    }, 650);
  };

  const hideTooltip = () => {
    clearTimeout(tooltipTimer.current);
    setTooltip(null);
  };

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("playground_completed_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setTaskStatus = (taskId, status) => {
    setCompletedTasks((prev) => {
      const current = prev[taskId];
      const isCurrentlyActive =
        (status === "solved" && (current === true || current === "solved")) ||
        (status === "unsolved" && current === "unsolved");
      const newStatus = isCurrentlyActive ? null : status;
      const updated = { ...prev, [taskId]: newStatus };
      if (!newStatus) {
        delete updated[taskId];
      }
      localStorage.setItem("playground_completed_tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const taskDropdownRef = useRef(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const [jsDropdownOpen, setJsDropdownOpen] = useState(false);
  const jsDropdownRef = useRef(null);

  const [algoDropdownOpen, setAlgoDropdownOpen] = useState(false);
  const algoDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskDropdownRef.current && !taskDropdownRef.current.contains(event.target)) {
        setTaskDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(event.target)) {
        setSectionDropdownOpen(false);
      }
      if (headerSectionDropdownRef.current && !headerSectionDropdownRef.current.contains(event.target)) {
        setHeaderSectionDropdownOpen(false);
      }
      if (jsDropdownRef.current && !jsDropdownRef.current.contains(event.target)) {
        setJsDropdownOpen(false);
      }
      if (algoDropdownRef.current && !algoDropdownRef.current.contains(event.target)) {
        setAlgoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalWarmup = WARMUP_TASKS.length;
  const totalRefactoring = REFACTORING_TASKS.length;
  const totalMain = MAIN_TASKS.length;
  const totalAdvanced = ADVANCED_TASKS.length;
  const totalReactTs = REACT_TS_TASKS.length;
  const totalReactTsPractice = REACT_TS_PRACTICE_TASKS.length;
  const totalTasks =
    totalWarmup + totalRefactoring + totalMain + totalAdvanced + totalReactTs + totalReactTsPractice;

  const renderSectionDropdownMenu = (closeFn) => (
    <div className="section-dropdown-menu">
      <div className="section-dropdown-header">РАЗДЕЛЫ ПРАКТИКИ</div>
      <button
        className={`section-dropdown-item ${activeSection === "home" ? "active" : ""}`}
        onClick={() => {
          setActiveSection("home");
          closeFn();
        }}
      >
        <Home size={15} style={{ color: "var(--color-info-light)" }} /> <span>ГЛАВНАЯ</span> <span className="section-badge soon">Обзор</span>
      </button>
      <button
        className={`section-dropdown-item ${activeSection === "javascript" ? "active" : ""}`}
        onClick={() => {
          setActiveSection("javascript");
          if (JS_TASKS.length > 0) {
            setSelectedTask(JS_TASKS[0]);
            setActiveTab("candidate");
          }
          closeFn();
        }}
      >
        <Zap size={15} style={{ color: "var(--color-warning)" }} /> <span>JAVASCRIPT</span> <span className="section-badge active">{JS_TASKS.length} задач</span>
      </button>
      <button
        className={`section-dropdown-item ${activeSection === "react" ? "active" : ""}`}
        onClick={() => {
          setActiveSection("react");
          if (WARMUP_TASKS.length > 0) {
            setSelectedTask(WARMUP_TASKS[0]);
            setActiveTab("candidate");
          }
          closeFn();
        }}
      >
        <Code2 size={15} style={{ color: "var(--color-info)" }} /> <span>REACT</span> <span className="section-badge active">{totalTasks} задач</span>
      </button>
      <button
        className={`section-dropdown-item ${activeSection === "algorithms" ? "active" : ""}`}
        onClick={() => {
          setActiveSection("algorithms");
          closeFn();
        }}
      >
        <Brain size={15} style={{ color: "var(--color-accent-purple)" }} /> <span>АЛГОРИТМЫ</span> <span className="section-badge soon">0 задач</span>
      </button>
    </div>
  );

  const renderHeaderSectionDropdownMenu = () => (
    <div className="breadcrumb-dropdown-menu">
      <div className="breadcrumb-dropdown-header">РАЗДЕЛЫ ПЛАТФОРМЫ</div>
      <div className="breadcrumb-dropdown-list">
        <button
          className={`breadcrumb-dropdown-item ${activeSection === "home" ? "active" : ""}`}
          onClick={() => {
            setActiveSection("home");
            setHeaderSectionDropdownOpen(false);
          }}
        >
          <span><Home size={15} style={{ color: "var(--color-info-light)" }} /></span>
          <span className="dropdown-item-title">ГЛАВНАЯ</span>
          <span className="section-badge soon">Обзор</span>
        </button>
        <button
          className={`breadcrumb-dropdown-item ${activeSection === "javascript" ? "active" : ""}`}
          onClick={() => {
            setActiveSection("javascript");
            if (JS_TASKS.length > 0) {
              setSelectedTask(JS_TASKS[0]);
              setActiveTab("candidate");
            }
            setHeaderSectionDropdownOpen(false);
          }}
        >
          <span><Zap size={15} style={{ color: "var(--color-warning)" }} /></span>
          <span className="dropdown-item-title">JAVASCRIPT</span>
          <span className="section-badge active">{JS_TASKS.length} задач</span>
        </button>
        <button
          className={`breadcrumb-dropdown-item ${activeSection === "react" ? "active" : ""}`}
          onClick={() => {
            setActiveSection("react");
            if (WARMUP_TASKS.length > 0) {
              setSelectedTask(WARMUP_TASKS[0]);
              setActiveTab("candidate");
            }
            setHeaderSectionDropdownOpen(false);
          }}
        >
          <span><Code2 size={15} style={{ color: "var(--color-info)" }} /></span>
          <span className="dropdown-item-title">REACT</span>
          <span className="section-badge active">{totalTasks} задач</span>
        </button>
        <button
          className={`breadcrumb-dropdown-item ${activeSection === "algorithms" ? "active" : ""}`}
          onClick={() => {
            setActiveSection("algorithms");
            setHeaderSectionDropdownOpen(false);
          }}
        >
          <span><Brain size={15} style={{ color: "var(--color-accent-purple)" }} /></span>
          <span className="dropdown-item-title">АЛГОРИТМЫ</span>
          <span className="section-badge soon">0 задач</span>
        </button>
      </div>
    </div>
  );

  const completedWarmup = WARMUP_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedRefactoring = REFACTORING_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedMain = MAIN_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedAdvanced = ADVANCED_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedReactTs = REACT_TS_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedReactTsPractice = REACT_TS_PRACTICE_TASKS.filter(
    (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
  ).length;
  const completedTotal =
    completedWarmup +
    completedRefactoring +
    completedMain +
    completedAdvanced +
    completedReactTs +
    completedReactTsPractice;

  const totalJsCount = JS_TASKS.length;
  const completedJsTotal = useMemo(() => {
    return JS_TASKS.filter(
      (task) => completedTasks[task.id] === true || completedTasks[task.id] === "solved"
    ).length;
  }, [completedTasks]);

  const [statsModalOpen, setStatsModalOpen] = useState(false);

  const solvedCount = completedTotal;
  const unsolvedCount = useMemo(() => {
    return Object.values(completedTasks).filter((status) => status === "unsolved").length;
  }, [completedTasks]);

  const inProgressCount = useMemo(() => {
    const attempted = solvedCount + unsolvedCount;
    return Math.max(0, totalTasks - attempted);
  }, [totalTasks, solvedCount, unsolvedCount]);

  const solvedPercent = totalTasks > 0 ? Math.round((solvedCount / totalTasks) * 100) : 0;
  const unsolvedPercent = totalTasks > 0 ? Math.round((unsolvedCount / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const percentage = solvedPercent;

  const currentSectionStats = useMemo(() => {
    // === Helper: compute stats for a given list of tasks ===
    const computeStats = (taskList) => {
      const total = taskList.length;
      const solved = taskList.filter((t) => completedTasks[t.id] && completedTasks[t.id] !== "unsolved").length;
      const unsolved = taskList.filter((t) => completedTasks[t.id] === "unsolved").length;
      const inProg = total - solved - unsolved;
      return {
        total,
        solved,
        unsolved,
        inProgress: inProg,
        solvedPct: total > 0 ? Math.round((solved / total) * 100) : 0,
        unsolvedPct: total > 0 ? Math.round((unsolved / total) * 100) : 0,
        inProgressPct: total > 0 ? Math.round((inProg / total) * 100) : 0,
      };
    };

    if (activeSection === "react") {
      return {
        title: "Статистика React",
        icon: <Code2 size={18} style={{ color: "var(--notion-blue)" }} />,
        total: totalTasks,
        solved: solvedCount,
        unsolved: unsolvedCount,
        inProgress: inProgressCount,
        solvedPct: solvedPercent,
        unsolvedPct: unsolvedPercent,
        inProgressPct: inProgressPercent,
        isDevelopment: false,
        breakdownTitle: "Прогресс по группам React:",
        categories: [
          { name: "Разминка", completed: completedWarmup, total: totalWarmup },
          { name: "Рефакторинг", completed: completedRefactoring, total: totalRefactoring },
          { name: "Middle", completed: completedMain, total: totalMain },
          { name: "Strong", completed: completedAdvanced, total: totalAdvanced },
          { name: "React + TS (Разминка)", completed: completedReactTs, total: totalReactTs },
          { name: "React + TS (Практика)", completed: completedReactTsPractice, total: totalReactTsPractice },
        ],
      };
    }

    if (activeSection === "javascript") {
      const jsStats = computeStats(JS_TASKS);

      // Build categories from unique groups in JS_TASKS
      const groupNames = Array.from(new Set(JS_TASKS.map((t) => t.group)));
      const jsCategories = groupNames.map((gName) => {
        const groupTasks = JS_TASKS.filter((t) => t.group === gName);
        const completedCount = groupTasks.filter((t) => completedTasks[t.id] && completedTasks[t.id] !== "unsolved").length;
        return { name: gName, completed: completedCount, total: groupTasks.length };
      });

      return {
        title: "Статистика JavaScript",
        icon: <Zap size={18} style={{ color: "#f59e0b" }} />,
        ...jsStats,
        isDevelopment: false,
        breakdownTitle: "Прогресс по группам JavaScript:",
        categories: jsCategories,
      };
    }

    if (activeSection === "home") {
      // Aggregate React + JS stats
      const jsStats = computeStats(JS_TASKS);
      const allSolved = solvedCount + jsStats.solved;
      const allUnsolved = unsolvedCount + jsStats.unsolved;
      const allTotal = totalTasks + jsStats.total;
      const allInProgress = allTotal - allSolved - allUnsolved;

      return {
        title: "Общая статистика платформы",
        icon: <Zap size={18} style={{ color: "var(--notion-blue)" }} />,
        total: allTotal,
        solved: allSolved,
        unsolved: allUnsolved,
        inProgress: allInProgress,
        solvedPct: allTotal > 0 ? Math.round((allSolved / allTotal) * 100) : 0,
        unsolvedPct: allTotal > 0 ? Math.round((allUnsolved / allTotal) * 100) : 0,
        inProgressPct: allTotal > 0 ? Math.round((allInProgress / allTotal) * 100) : 0,
        isDevelopment: false,
        breakdownTitle: "Прогресс по разделам:",
        categories: [
          { name: "React", completed: completedTotal, total: totalTasks },
          { name: "JavaScript", completed: jsStats.solved, total: jsStats.total },
          { name: "Алгоритмы", completed: 0, total: 0, note: "Скоро" },
        ],
      };
    }

    return {
      title: "Статистика Алгоритмы",
      icon: <Brain size={18} style={{ color: "#a371f7" }} />,
      total: 0,
      solved: 0,
      unsolved: 0,
      inProgress: 0,
      solvedPct: 0,
      unsolvedPct: 0,
      inProgressPct: 0,
      isDevelopment: true,
      breakdownTitle: "Темы Алгоритмы:",
      categories: [
        { name: "Два указателя (Two Pointers)", completed: 0, total: 0, note: "В разработке" },
        { name: "Скользящее окно (Sliding Window)", completed: 0, total: 0, note: "В разработке" },
        { name: "Бинарный поиск (Binary Search)", completed: 0, total: 0, note: "В разработке" },
        { name: "Обход деревьев и графов", completed: 0, total: 0, note: "В разработке" },
      ],
    };
  }, [
    activeSection,
    totalTasks,
    solvedCount,
    unsolvedCount,
    inProgressCount,
    solvedPercent,
    unsolvedPercent,
    inProgressPercent,
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
    completedTotal,
    completedTasks,
  ]);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleResetProgress = () => {
    const idsToRemove = new Set(
      activeSection === "javascript"
        ? JS_TASKS.map((t) => t.id)
        : REACT_TASKS.map((t) => t.id)
    );
    setCompletedTasks((prev) => {
      const updated = {};
      for (const [id, status] of Object.entries(prev)) {
        if (!idsToRemove.has(id)) {
          updated[id] = status;
        }
      }
      localStorage.setItem("playground_completed_tasks", JSON.stringify(updated));
      return updated;
    });
    setResetConfirmOpen(false);
  };

  const categoriesList = useMemo(() => {
    if (activeSection === "javascript") {
      const jsCategories = [];
      const jsSubgroupsMap = {};
      JS_TASKS.forEach((task) => {
        const name = task.group && task.subgroup ? `${task.group} > ${task.subgroup}` : (task.group || "JAVASCRIPT");
        if (!jsSubgroupsMap[name]) {
          jsSubgroupsMap[name] = [];
        }
        jsSubgroupsMap[name].push(task);
      });

      Object.entries(jsSubgroupsMap).forEach(([name, tasks]) => {
        const completed = tasks.filter((t) => completedTasks[t.id]).length;
        jsCategories.push({
          id: `category-js-${name}`,
          name: name,
          icon: <Zap size={15} style={{ color: "#f59e0b" }} />,
          tasks,
          completed,
          total: tasks.length,
        });
      });

      return jsCategories;
    }

    return [
      { id: "category-warmup", name: "Разминка", icon: <Flame size={15} style={{ color: "var(--notion-red)" }} />, tasks: WARMUP_TASKS, completed: completedWarmup, total: totalWarmup },
      { id: "category-refactoring", name: "Рефакторинг", icon: <Wrench size={15} style={{ color: "var(--notion-blue)" }} />, tasks: REFACTORING_TASKS, completed: completedRefactoring, total: totalRefactoring },
      { id: "category-middle", name: "Middle", icon: <Rocket size={15} style={{ color: "var(--color-success)" }} />, tasks: MAIN_TASKS, completed: completedMain, total: totalMain },
      { id: "category-strong", name: "Strong", icon: <Brain size={15} style={{ color: "var(--color-accent-purple)" }} />, tasks: ADVANCED_TASKS, completed: completedAdvanced, total: totalAdvanced },
      { id: "category-ts", name: "React + TS (Разминка)", icon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, tasks: REACT_TS_TASKS, completed: completedReactTs, total: totalReactTs },
      { id: "category-ts-practice", name: "React + TS (Практика)", icon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, tasks: REACT_TS_PRACTICE_TASKS, completed: completedReactTsPractice, total: totalReactTsPractice },
    ];
  }, [activeSection, completedWarmup, totalWarmup, completedRefactoring, totalRefactoring, completedMain, totalMain, completedAdvanced, totalAdvanced, completedReactTs, totalReactTs, completedReactTsPractice, totalReactTsPractice, completedTasks]);

  const { taskCategory, categoryIcon, taskIcon, currentCategoryTasks, categoryId } = useMemo(() => {
    const defaultFileIcon = <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />;
    if (JS_TASKS.some((t) => String(t.id) === String(selectedTask?.id))) {
      const match = JS_TASKS.find((t) => String(t.id) === String(selectedTask?.id));
      const categoryName = match?.group && match?.subgroup
        ? `${match.group} > ${match.subgroup}`
        : (match?.group || "JavaScript");
      const subTasks = JS_TASKS.filter(
        (t) => t.group === match?.group && t.subgroup === match?.subgroup
      );
      return {
        taskCategory: categoryName,
        categoryIcon: <Zap size={15} style={{ color: "var(--color-warning)" }} />,
        taskIcon: defaultFileIcon,
        currentCategoryTasks: subTasks,
        categoryId: `category-js-${categoryName}`,
      };
    }
    if (WARMUP_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Разминка", categoryIcon: <Flame size={15} style={{ color: "var(--notion-red)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: WARMUP_TASKS, categoryId: "category-warmup" };
    if (REFACTORING_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Рефакторинг", categoryIcon: <Wrench size={15} style={{ color: "var(--notion-blue)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REFACTORING_TASKS, categoryId: "category-refactoring" };
    if (MAIN_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Middle", categoryIcon: <Rocket size={15} style={{ color: "var(--color-success)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: MAIN_TASKS, categoryId: "category-middle" };
    if (ADVANCED_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Strong", categoryIcon: <Brain size={15} style={{ color: "var(--color-accent-purple)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: ADVANCED_TASKS, categoryId: "category-strong" };
    if (REACT_TS_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "React + TS (Разминка)", categoryIcon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REACT_TS_TASKS, categoryId: "category-ts" };
    if (REACT_TS_PRACTICE_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "React + TS (Практика)", categoryIcon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REACT_TS_PRACTICE_TASKS, categoryId: "category-ts-practice" };
    return { taskCategory: "", categoryIcon: null, taskIcon: defaultFileIcon, currentCategoryTasks: [], categoryId: "" };
  }, [selectedTask.id]);

  const isTaskVisible = (task) => {
    if (sidebarFilter === "ALL") return true;
    const status = completedTasks[task.id];
    const isSolved = status === true || status === "solved";
    if (sidebarFilter === "SOLVED") return isSolved;
    if (sidebarFilter === "UNSOLVED") return !isSolved;
    return true;
  };

  return (
    <div className="app-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpenWithPreference}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={updateSidebarWidth}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sectionDropdownOpen={sectionDropdownOpen}
        setSectionDropdownOpen={setSectionDropdownOpen}
        sectionDropdownRef={sectionDropdownRef}
        renderSectionDropdownMenu={renderSectionDropdownMenu}
        setStatsModalOpen={setStatsModalOpen}
        completedTotal={completedTotal}
        totalTasks={totalTasks}
        percentage={percentage}
        completedWarmup={completedWarmup}
        totalWarmup={totalWarmup}
        completedRefactoring={completedRefactoring}
        totalRefactoring={totalRefactoring}
        completedMain={completedMain}
        totalMain={totalMain}
        completedAdvanced={completedAdvanced}
        totalAdvanced={totalAdvanced}
        completedReactTs={completedReactTs}
        totalReactTs={totalReactTs}
        completedReactTsPractice={completedReactTsPractice}
        totalReactTsPractice={totalReactTsPractice}
        warmupExpanded={warmupExpanded}
        setWarmupExpanded={setWarmupExpanded}
        refactoringExpanded={refactoringExpanded}
        setRefactoringExpanded={setRefactoringExpanded}
        tasksExpanded={tasksExpanded}
        setTasksExpanded={setTasksExpanded}
        advancedExpanded={advancedExpanded}
        setAdvancedExpanded={setAdvancedExpanded}
        reactTsExpanded={reactTsExpanded}
        setReactTsExpanded={setReactTsExpanded}
        reactTsPracticeExpanded={reactTsPracticeExpanded}
        setReactTsPracticeExpanded={setReactTsPracticeExpanded}
        isTaskVisible={isTaskVisible}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        setActiveTab={setActiveTab}
        completedTasks={completedTasks}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />

      {/* Notion-style Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="app-content-wrapper">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpenWithPreference}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          headerSectionDropdownOpen={headerSectionDropdownOpen}
          setHeaderSectionDropdownOpen={setHeaderSectionDropdownOpen}
          headerSectionDropdownRef={headerSectionDropdownRef}
          renderHeaderSectionDropdownMenu={renderHeaderSectionDropdownMenu}
          categoryDropdownRef={categoryDropdownRef}
          categoryDropdownOpen={categoryDropdownOpen}
          setCategoryDropdownOpen={setCategoryDropdownOpen}
          categoriesList={categoriesList}
          categoryId={categoryId}
          categoryIcon={categoryIcon}
          taskCategory={taskCategory}
          openSingleCategory={openSingleCategory}
          taskDropdownRef={taskDropdownRef}
          taskDropdownOpen={taskDropdownOpen}
          setTaskDropdownOpen={setTaskDropdownOpen}
          taskIcon={taskIcon}
          currentCategoryTasks={currentCategoryTasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          completedTasks={completedTasks}
          setActiveTab={setActiveTab}
          jsDropdownRef={jsDropdownRef}
          jsDropdownOpen={jsDropdownOpen}
          setJsDropdownOpen={setJsDropdownOpen}
          algoDropdownRef={algoDropdownRef}
          algoDropdownOpen={algoDropdownOpen}
          setAlgoDropdownOpen={setAlgoDropdownOpen}
          statsModalOpen={statsModalOpen}
          setStatsModalOpen={setStatsModalOpen}
          cheatSheetOpen={cheatSheetOpen}
          setCheatSheetOpen={setCheatSheetOpen}
          setPaletteOpen={setPaletteOpen}
          timerSeconds={timerSeconds}
          setTimerSeconds={setTimerSeconds}
          setTimerRunning={setTimerRunning}
          formatTimer={formatTimer}
          startTimer={startTimer}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="content-area">
          {activeSection === "home" && (
            <HomeDashboard
              setActiveSection={setActiveSection}
              completedTotal={completedTotal}
              totalTasks={totalTasks}
              completedJsTotal={completedJsTotal}
              totalJsCount={totalJsCount}
              completedTasks={completedTasks}
              setSelectedTask={setSelectedTask}
              setActiveTab={setActiveTab}
            />
          )}

          {(activeSection === "react" || activeSection === "javascript") && (
            <TaskView
              selectedTask={selectedTask}
              setTaskStatus={setTaskStatus}
              completedTasks={completedTasks}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleCopyCode={handleCopyCode}
              copiedCodeId={copiedCodeId}
              checklistState={checklistState}
              toggleChecklistItem={toggleChecklistItem}
            />
          )}

          {activeSection === "algorithms" && (
            <div className="coming-soon-container">
              <div className="coming-soon-icon">
                {activeSection === "javascript" ? <Zap size={32} /> : <Brain size={32} />}
              </div>
              <h2 className="coming-soon-title">
                Раздел {activeSection === "javascript" ? "JavaScript" : "Алгоритмы"} в разработке
              </h2>
              <p className="coming-soon-desc">
                Мы готовим большую практическую базу задач с автотестами и разборами решений. Скоро здесь появятся новые упражнения!
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="home-section-btn"
                  onClick={() => setActiveSection("react")}
                >
                  <Code2 size={16} /> Перейти к разделу React →
                </button>
                <button
                  className="home-section-btn-disabled"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveSection("home")}
                >
                  <Home size={14} /> На Главную
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <CommandPaletteModal
        paletteOpen={paletteOpen}
        setPaletteOpen={setPaletteOpen}
        paletteQuery={paletteQuery}
        setPaletteQuery={setPaletteQuery}
        allTasksList={allTasksList}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        setActiveSection={setActiveSection}
        setActiveTab={setActiveTab}
        activeSection={activeSection}
      />

      <CheatSheetModal
        cheatSheetOpen={cheatSheetOpen}
        setCheatSheetOpen={setCheatSheetOpen}
        cheatSearch={cheatSearch}
        setCheatSearch={setCheatSearch}
        cheatCategory={cheatCategory}
        setCheatCategory={setCheatCategory}
        handleCopyCode={handleCopyCode}
        copiedCodeId={copiedCodeId}
        activeSection={activeSection}
      />

      <StatsModal
        statsModalOpen={statsModalOpen}
        setStatsModalOpen={setStatsModalOpen}
        currentSectionStats={currentSectionStats}
        setResetConfirmOpen={setResetConfirmOpen}
      />

      {resetConfirmOpen && (
        <div
          className="reset-confirm-overlay"
          onClick={() => setResetConfirmOpen(false)}
        >
          <div
            className="stats-modal reset-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stats-modal-header">
              <div className="stats-modal-title">
                <AlertTriangle size={18} style={{ color: "var(--notion-red, #ef4444)" }} />
                <span>Подтверждение сброса</span>
              </div>
              <button
                className="stats-modal-close"
                onClick={() => setResetConfirmOpen(false)}
                title="Закрыть"
              >
                <X size={18} />
              </button>
            </div>

            <div className="stats-modal-body" style={{ padding: "20px" }}>
              <div
                style={{
                  padding: "16px",
                  background: "var(--notion-red-bg, rgba(239, 68, 68, 0.08))",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md, 8px)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "var(--text-main)",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <AlertTriangle size={20} style={{ flexShrink: 0, color: "var(--color-error)", marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", color: "var(--text-main)", fontSize: "14px" }}>
                    Сбросить статистику раздела {activeSection === "javascript" ? "JavaScript" : "React"}?
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                    Все отметки о решённых и нерешённых задачах в разделе <strong>{activeSection === "javascript" ? "JavaScript" : "React"}</strong> будут безвозвратно удалены.
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-modal-footer" style={{ gap: "10px" }}>
              <button
                className="stats-confirm-cancel-btn"
                onClick={() => setResetConfirmOpen(false)}
              >
                Отмена
              </button>
              <button
                className="stats-reset-btn"
                style={{
                  background: "var(--color-error)",
                  color: "var(--text-on-accent)",
                  borderColor: "var(--color-error)",
                }}
                onClick={handleResetProgress}
              >
                <RotateCcw size={14} /> Подтвердить сброс
              </button>
            </div>
          </div>
        </div>
      )}

      {tooltip && (
        <div className="fixed-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      {/* Глобальный портал всплывающих подсказок (вывод поверх всего) */}
      <GlobalTooltip />
    </div>
  );
};

export default Playground;
