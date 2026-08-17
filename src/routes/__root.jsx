import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createRootRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  FileQuestion,
  Trash2,
} from "lucide-react";

import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
  REACT_TASKS,
} from "../react/data/tasksData";
import {
  ALL_TASKS as allTasksList,
  ALL_REACT_TASKS,
  ALL_JS_TASKS,
  ALL_ALGO_TASKS,
  getTaskById,
  resolveTaskSection,
} from "../data/tasksRegistry";
import { JS_TASKS } from "../javascript/data/tasksData";
import { ALGO_TASKS } from "../algorithms/data/tasksData";
import { getAlgoGroupMetaByInfoId } from "../algorithms/data/groupConfig";
import { FILE_ICON_COLOR } from "../constants/uiConstants";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CheatSheetModal from "../components/modals/CheatSheetModal";
import CommandPaletteModal from "../components/modals/CommandPaletteModal";
import StatsModal from "../components/modals/StatsModal";
import GlobalTooltip from "../components/common/GlobalTooltip";
import { PracticeContext } from "../context/PracticeContext";
import { useGlobalShortcuts } from "../hooks/useGlobalShortcuts";
import { useUIStore, useTimerStore, useProgressStore, useReviewStore } from "../stores";

const NotFoundComponent = () => {
  return (
    <div className="coming-soon-container" style={{ padding: "60px 20px", textAlign: "center" }}>
      <div className="coming-soon-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
        <FileQuestion size={36} />
      </div>
      <h2 className="coming-soon-title" style={{ fontSize: "22px", marginBottom: "8px" }}>
        Страница не найдена (404)
      </h2>
      <p className="coming-soon-desc" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
        Запрашиваемый адрес или задача не существует. Возможно, ссылка устарела или содержит опечатку.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/home" className="home-section-btn home-section-btn--default">
          <Home size={16} /> На Главную
        </Link>
        <Link to="/react" className="home-section-btn home-section-btn--blue">
          <Code2 size={16} /> Раздел React
        </Link>
        <Link to="/javascript" className="home-section-btn home-section-btn--amber">
          <Zap size={16} /> Раздел JavaScript
        </Link>
        <Link to="/algorithms" className="home-section-btn home-section-btn--purple">
          <Brain size={16} /> Раздел Алгоритмы
        </Link>
      </div>
    </div>
  );
};

const RootLayout = () => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();

  const isOpenMode = pathname.startsWith("/open") || pathname.includes("/open");
  const contentAreaRef = useRef(null);

  // Сброс скролла в начало при переходе между страницами/папками/задачами
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Определение выбранной задачи по текущему URL
  const selectedTaskId = useMemo(() => {
    const cleanPath = pathname.replace(/^\/+/, "");
    const segments = cleanPath.split("/").filter(Boolean);
    const reactIdx = segments.indexOf("react");
    if (reactIdx !== -1 && segments[reactIdx + 1]) {
      return segments[reactIdx + 1];
    }
    const jsIdx = segments.indexOf("javascript");
    if (jsIdx !== -1 && segments[jsIdx + 1]) {
      return segments[jsIdx + 1];
    }
    const algoIdx = segments.indexOf("algorithms");
    if (algoIdx !== -1 && segments[algoIdx + 1]) {
      return segments[algoIdx + 1];
    }
    const openIdx = segments.indexOf("open");
    if (
      openIdx !== -1 &&
      segments[openIdx + 1] &&
      !["react", "javascript", "algorithms"].includes(segments[openIdx + 1])
    ) {
      return segments[openIdx + 1];
    }
    return null;
  }, [pathname]);

  // Определение текущей активной секции по пути URL
  const activeSection = useMemo(() => {
    if (pathname.includes("/react")) return "react";
    if (pathname.includes("/javascript")) return "javascript";
    if (pathname.includes("/algorithms")) return "algorithms";
    if (selectedTaskId && !String(selectedTaskId).startsWith("group-")) {
      return resolveTaskSection(selectedTaskId);
    }
    return "home";
  }, [pathname, selectedTaskId]);

  // Stable cache for group/subgroup overview objects to prevent reference thrashing
  const groupTaskCacheRef = useRef({});

  const selectedTask = useMemo(() => {
    if (selectedTaskId) {
      if (String(selectedTaskId).startsWith("group-") || String(selectedTaskId).startsWith("subgroup-")) {
        // Return cached object if the id hasn't changed to keep a stable reference
        const cached = groupTaskCacheRef.current;
        if (cached && cached.id === selectedTaskId) return cached;

        const rawName = decodeURIComponent(String(selectedTaskId).replace(/^group-|^subgroup-/, ""));
        const algoMeta = getAlgoGroupMetaByInfoId(selectedTaskId);
        let reactGroupName = "";
        if (selectedTaskId === "group-warmup") reactGroupName = "Разминка";
        else if (selectedTaskId === "group-refactoring") reactGroupName = "Рефакторинг";
        else if (selectedTaskId === "group-middle") reactGroupName = "Middle";
        else if (selectedTaskId === "group-strong") reactGroupName = "Strong";
        else if (selectedTaskId === "group-ts") reactGroupName = "React + TS (Разминка)";
        else if (selectedTaskId === "group-ts-practice") reactGroupName = "React + TS (Практика)";

        // JavaScript subgroup / group check
        let jsGroup = "";
        let jsSubgroup = "";
        if (String(selectedTaskId).startsWith("subgroup-")) {
          const matchedJs = JS_TASKS.find(
            (t) =>
              t.subgroup === rawName ||
              `${t.group}-${t.subgroup}` === rawName ||
              `${t.group}/${t.subgroup}` === rawName
          );
          if (matchedJs) {
            jsGroup = matchedJs.group;
            jsSubgroup = matchedJs.subgroup;
          }
        } else if (String(selectedTaskId).startsWith("group-")) {
          const matchedJs = JS_TASKS.find((t) => t.group === rawName);
          if (matchedJs) {
            jsGroup = matchedJs.group;
          }
        }

        const displayName = algoMeta?.name || reactGroupName || jsSubgroup || jsGroup || rawName;
        const result = {
          id: selectedTaskId,
          isGroupOverview: true,
          group: jsGroup || displayName,
          subgroup: jsSubgroup || undefined,
          title: algoMeta?.title || displayName,
        };
        groupTaskCacheRef.current = result;
        return result;
      }
      const found = getTaskById(selectedTaskId);
      if (found) return found;
    }
    if (activeSection === "javascript") {
      const cached = groupTaskCacheRef.current;
      if (cached && cached.id === "group-Циклы") return cached;
      const result = {
        id: "group-Циклы",
        isGroupOverview: true,
        group: "Циклы",
        title: "Циклы",
      };
      groupTaskCacheRef.current = result;
      return result;
    }
    if (activeSection === "algorithms") {
      const cached = groupTaskCacheRef.current;
      if (cached && cached.id === "group-two-pointers") return cached;
      const result = {
        id: "group-two-pointers",
        isGroupOverview: true,
        group: "Two Pointers",
        title: "Two Pointers (два указателя)",
      };
      groupTaskCacheRef.current = result;
      return result;
    }
    if (activeSection === "react") {
      const cached = groupTaskCacheRef.current;
      if (cached && cached.id === "group-warmup") return cached;
      const result = {
        id: "group-warmup",
        isGroupOverview: true,
        group: "Разминка",
        title: "Разминка",
      };
      groupTaskCacheRef.current = result;
      return result;
    }
    const cached = groupTaskCacheRef.current;
    if (cached && cached.id === "group-warmup") return cached;
    const result = {
      id: "group-warmup",
      isGroupOverview: true,
      group: "Разминка",
      title: "Разминка",
    };
    groupTaskCacheRef.current = result;
    return result;
  }, [selectedTaskId, activeSection]);

  // Сохраняем последний просмотренный id per section
  useEffect(() => {
    if (selectedTaskId && activeSection && activeSection !== "home") {
      localStorage.setItem(`playground_last_selected_task_id_${activeSection}`, String(selectedTaskId));
      localStorage.setItem("playground_last_selected_task_id", String(selectedTaskId));
    }
  }, [selectedTaskId, activeSection]);

  // Выбор активной вкладки из search params или default 'candidate'
  const activeTab = useMemo(() => {
    const search = routerState.location.search;
    return search?.tab || "candidate";
  }, [routerState.location.search]);

  const setActiveTab = useCallback((newTab) => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab: newTab === "candidate" ? undefined : newTab,
      }),
    });
  }, [navigate]);

  // Сайдбар состояние
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("playground_sidebar_open") !== "false";
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === "undefined") return 280;
    const saved = localStorage.getItem("playground_sidebar_width");
    if (!saved || saved === "260" || saved === "240" || saved === "230" || saved === "220") {
      localStorage.setItem("playground_sidebar_width", "280");
      return 280;
    }
    const parsed = parseInt(saved, 10);
    return isNaN(parsed) ? 280 : Math.min(Math.max(parsed, 220), 480);
  });

  const updateSidebarWidth = useCallback((width) => {
    const clamped = Math.min(Math.max(width, 200), 480);
    setSidebarWidth(clamped);
    localStorage.setItem("playground_sidebar_width", String(clamped));
  }, []);

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
        setSidebarOpen(false);
        wasMobile = true;
      } else if (!isNowMobile && wasMobile) {
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

  // Инициализация прогресса и интервального повторения из IndexedDB
  const initProgress = useProgressStore((state) => state.initProgress);
  const initReviews = useReviewStore((state) => state.initReviews);
  const handleResetReviews = useReviewStore((state) => state.handleResetReviews);

  useEffect(() => {
    initProgress();
    initReviews();
  }, [initProgress, initReviews]);

  const completedTasks = useProgressStore((state) => state.completedTasks);
  const setTaskStatus = useProgressStore((state) => state.setTaskStatus);
  const checklistState = useProgressStore((state) => state.checklistState);
  const toggleChecklistItem = useProgressStore((state) => state.toggleChecklistItem);
  const copiedCodeId = useProgressStore((state) => state.copiedCodeId);
  const handleCopyCode = useProgressStore((state) => state.handleCopyCode);
  const handleFullReset = useProgressStore((state) => state.handleFullReset);

  // UI Состояния из useUIStore
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const statsModalOpen = useUIStore((state) => state.statsModalOpen);
  const setStatsModalOpen = useUIStore((state) => state.setStatsModalOpen);
  const cheatSheetOpen = useUIStore((state) => state.cheatSheetOpen);
  const setCheatSheetOpen = useUIStore((state) => state.setCheatSheetOpen);
  const cheatCategory = useUIStore((state) => state.cheatCategory);
  const setCheatCategory = useUIStore((state) => state.setCheatCategory);
  const cheatSearch = useUIStore((state) => state.cheatSearch);
  const setCheatSearch = useUIStore((state) => state.setCheatSearch);
  const paletteOpen = useUIStore((state) => state.paletteOpen);
  const setPaletteOpen = useUIStore((state) => state.setPaletteOpen);
  const paletteQuery = useUIStore((state) => state.paletteQuery);
  const setPaletteQuery = useUIStore((state) => state.setPaletteQuery);
  const resetConfirmOpen = useUIStore((state) => state.resetConfirmOpen);
  const setResetConfirmOpen = useUIStore((state) => state.setResetConfirmOpen);
  const closeAllModals = useUIStore((state) => state.closeAllModals);

  const sectionDropdownOpen = useUIStore((state) => state.sectionDropdownOpen);
  const setSectionDropdownOpen = useUIStore((state) => state.setSectionDropdownOpen);
  const headerSectionDropdownOpen = useUIStore((state) => state.headerSectionDropdownOpen);
  const setHeaderSectionDropdownOpen = useUIStore((state) => state.setHeaderSectionDropdownOpen);
  const taskDropdownOpen = useUIStore((state) => state.taskDropdownOpen);
  const setTaskDropdownOpen = useUIStore((state) => state.setTaskDropdownOpen);
  const categoryDropdownOpen = useUIStore((state) => state.categoryDropdownOpen);
  const setCategoryDropdownOpen = useUIStore((state) => state.setCategoryDropdownOpen);
  const jsDropdownOpen = useUIStore((state) => state.jsDropdownOpen);
  const setJsDropdownOpen = useUIStore((state) => state.setJsDropdownOpen);
  const algoDropdownOpen = useUIStore((state) => state.algoDropdownOpen);
  const setAlgoDropdownOpen = useUIStore((state) => state.setAlgoDropdownOpen);

  const sectionDropdownRef = useRef(null);
  const headerSectionDropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const jsDropdownRef = useRef(null);
  const algoDropdownRef = useRef(null);

  // Категорийные аккордеоны и синхронизация в Сайдбаре (из useUIStore)
  const warmupExpanded = useUIStore((state) => state.warmupExpanded);
  const setWarmupExpanded = useUIStore((state) => state.setWarmupExpanded);
  const refactoringExpanded = useUIStore((state) => state.refactoringExpanded);
  const setRefactoringExpanded = useUIStore((state) => state.setRefactoringExpanded);
  const tasksExpanded = useUIStore((state) => state.tasksExpanded);
  const setTasksExpanded = useUIStore((state) => state.setTasksExpanded);
  const advancedExpanded = useUIStore((state) => state.advancedExpanded);
  const setAdvancedExpanded = useUIStore((state) => state.setAdvancedExpanded);
  const reactTsExpanded = useUIStore((state) => state.reactTsExpanded);
  const setReactTsExpanded = useUIStore((state) => state.setReactTsExpanded);
  const reactTsPracticeExpanded = useUIStore((state) => state.reactTsPracticeExpanded);
  const setReactTsPracticeExpanded = useUIStore((state) => state.setReactTsPracticeExpanded);
  const expandedJsGroups = useUIStore((state) => state.expandedJsGroups);
  const setExpandedJsGroups = useUIStore((state) => state.setExpandedJsGroups);
  const expandedJsSubgroups = useUIStore((state) => state.expandedJsSubgroups);
  const setExpandedJsSubgroups = useUIStore((state) => state.setExpandedJsSubgroups);
  const openSingleCategory = useUIStore((state) => state.openSingleCategory);

  // Синхронизация открытой задачи в сайдбаре
  const prevSyncedTaskIdRef = useRef(null);
  useEffect(() => {
    if (!selectedTask || !selectedTaskId) return;
    if (prevSyncedTaskIdRef.current === selectedTaskId) return;
    prevSyncedTaskIdRef.current = selectedTaskId;

    const taskIdStr = String(selectedTask.id);

    // React синхронизация категорий
    if (WARMUP_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setWarmupExpanded(true);
    } else if (REFACTORING_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setRefactoringExpanded(true);
    } else if (MAIN_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setTasksExpanded(true);
    } else if (ADVANCED_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setAdvancedExpanded(true);
    } else if (REACT_TS_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setReactTsExpanded(true);
    } else if (REACT_TS_PRACTICE_TASKS.some((t) => String(t.id) === taskIdStr)) {
      setReactTsPracticeExpanded(true);
    }

    // JavaScript / Algorithms синхронизация групп и подгрупп
    if (selectedTask.group && !selectedTask.isGroupOverview) {
      setExpandedJsGroups((prev) => {
        if (prev[selectedTask.group]) return prev;
        return { ...prev, [selectedTask.group]: true };
      });
      if (selectedTask.subgroup) {
        const subKey = `${selectedTask.group}/${selectedTask.subgroup}`;
        setExpandedJsSubgroups((prev) => {
          if (prev[subKey]) return prev;
          return { ...prev, [subKey]: true };
        });
      }
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`sidebar-task-${selectedTask.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [selectedTaskId, selectedTask, setWarmupExpanded, setRefactoringExpanded, setTasksExpanded, setAdvancedExpanded, setReactTsExpanded, setReactTsPracticeExpanded, setExpandedJsGroups, setExpandedJsSubgroups]);

  // Таймер практики из useTimerStore
  const timerSeconds = useTimerStore((state) => state.timerSeconds);
  const setTimerSeconds = useTimerStore((state) => state.setTimerSeconds);
  const timerRunning = useTimerStore((state) => state.timerRunning);
  const setTimerRunning = useTimerStore((state) => state.setTimerRunning);
  const startTimer = useTimerStore((state) => state.startTimer);
  const formatTimer = useTimerStore((state) => state.formatTimer);

  // Глобальные горячие клавиши (Cmd+K, Esc, навигация по стрелкам)
  useGlobalShortcuts({
    isOpenMode,
    selectedTask,
    activeTab,
    allTasksList,
    navigate,
    setActiveTab,
    setPaletteOpen,
    setPaletteQuery,
    closeAllModals,
  });

  // Метрики задач
  const totalWarmup = WARMUP_TASKS.length;
  const totalRefactoring = REFACTORING_TASKS.length;
  const totalMain = MAIN_TASKS.length;
  const totalAdvanced = ADVANCED_TASKS.length;
  const totalReactTs = REACT_TS_TASKS.length;
  const totalReactTsPractice = REACT_TS_PRACTICE_TASKS.length;
  const totalTasks =
    totalWarmup + totalRefactoring + totalMain + totalAdvanced + totalReactTs + totalReactTsPractice;

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

  const reactUnsolvedCount = useMemo(() => {
    return REACT_TASKS.filter((task) => {
      const val = completedTasks[task.id] ?? completedTasks[String(task.id)];
      return val === "unsolved";
    }).length;
  }, [completedTasks]);

  const solvedCount = completedTotal;
  const unsolvedCount = reactUnsolvedCount;

  const inProgressCount = useMemo(() => {
    const attempted = solvedCount + unsolvedCount;
    return Math.max(0, totalTasks - attempted);
  }, [totalTasks, solvedCount, unsolvedCount]);

  const solvedPercent = totalTasks > 0 ? Math.round((solvedCount / totalTasks) * 100) : 0;
  const unsolvedPercent = totalTasks > 0 ? Math.round((unsolvedCount / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const percentage = solvedPercent;

  const currentSectionStats = useMemo(() => {
    const computeStats = (taskList) => {
      const total = taskList.length;
      const solved = taskList.filter((t) => {
        const val = completedTasks[t.id] ?? completedTasks[String(t.id)];
        return val === true || val === "solved";
      }).length;
      const unsolved = taskList.filter((t) => {
        const val = completedTasks[t.id] ?? completedTasks[String(t.id)];
        return val === "unsolved";
      }).length;
      const inProg = Math.max(0, total - solved - unsolved);
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
      const reactTasks = ALL_REACT_TASKS && ALL_REACT_TASKS.length > 0
        ? ALL_REACT_TASKS
        : (REACT_TASKS && REACT_TASKS.length > 0 ? REACT_TASKS : WARMUP_TASKS);
      return {
        title: "Статистика React",
        sectionName: "React",
        section: "react",
        taskList: reactTasks,
        icon: <Code2 size={18} style={{ color: "var(--accent-blue)" }} />,
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
      const jsTasks = ALL_JS_TASKS && ALL_JS_TASKS.length > 0 ? ALL_JS_TASKS : JS_TASKS;
      const jsStats = computeStats(jsTasks);
      const groupNames = Array.from(new Set(jsTasks.map((t) => t.group)));
      const jsCategories = groupNames.map((gName) => {
        const groupTasks = jsTasks.filter((t) => t.group === gName);
        const count = groupTasks.filter((t) => {
          const val = completedTasks[t.id] ?? completedTasks[String(t.id)];
          return val === true || val === "solved";
        }).length;
        return { name: gName, completed: count, total: groupTasks.length };
      });

      return {
        title: "Статистика JavaScript",
        sectionName: "JavaScript",
        section: "javascript",
        taskList: jsTasks,
        icon: <Zap size={18} style={{ color: "#f59e0b" }} />,
        ...jsStats,
        isDevelopment: false,
        breakdownTitle: "Прогресс по группам JavaScript:",
        categories: jsCategories,
      };
    }

    if (activeSection === "home") {
      const jsTasks = ALL_JS_TASKS && ALL_JS_TASKS.length > 0 ? ALL_JS_TASKS : JS_TASKS;
      const algoTasks = ALL_ALGO_TASKS && ALL_ALGO_TASKS.length > 0 ? ALL_ALGO_TASKS : ALGO_TASKS;
      const jsStats = computeStats(jsTasks);
      const algoStats = computeStats(algoTasks);
      const allSolved = solvedCount + jsStats.solved + algoStats.solved;
      const allUnsolved = unsolvedCount + jsStats.unsolved + algoStats.unsolved;
      const allTotal = totalTasks + jsStats.total + algoStats.total;
      const allInProgress = allTotal - allSolved - allUnsolved;

      return {
        title: "Общая статистика платформы",
        sectionName: "Вся платформа",
        section: "home",
        taskList: allTasksList,
        icon: <Zap size={18} style={{ color: "var(--accent-blue)" }} />,
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
          { name: "Алгоритмы", completed: algoStats.solved, total: algoStats.total },
        ],
      };
    }

    const algoTasks = ALL_ALGO_TASKS && ALL_ALGO_TASKS.length > 0 ? ALL_ALGO_TASKS : ALGO_TASKS;
    const algoStats = computeStats(algoTasks);
    const algoGroupNames = Array.from(new Set(algoTasks.map((t) => t.group)));
    const algoCategories = algoGroupNames.map((gName) => {
      const groupTasks = algoTasks.filter((t) => t.group === gName);
      const count = groupTasks.filter((t) => {
        const val = completedTasks[t.id] ?? completedTasks[String(t.id)];
        return val === true || val === "solved";
      }).length;
      return { name: gName, completed: count, total: groupTasks.length };
    });

    return {
      title: "Статистика Алгоритмы",
      sectionName: "Алгоритмы",
      section: "algorithms",
      taskList: algoTasks,
      icon: <Brain size={18} style={{ color: "#a371f7" }} />,
      ...algoStats,
      isDevelopment: false,
      breakdownTitle: "Прогресс по темам Алгоритмы:",
      categories: algoCategories,
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

  const handleResetSection = useCallback(async () => {
    await handleFullReset("section", activeSection);
    const sectionTasks =
      activeSection === "javascript"
        ? JS_TASKS
        : activeSection === "algorithms"
        ? ALL_ALGO_TASKS
        : REACT_TASKS;
    await handleResetReviews("section", sectionTasks.map((t) => t.id));
    setResetConfirmOpen(false);
    setStatsModalOpen(false);
  }, [handleFullReset, activeSection, handleResetReviews, setResetConfirmOpen, setStatsModalOpen]);

  const handleResetAll = useCallback(async () => {
    await handleFullReset("all");
    await handleResetReviews("all");
    setResetConfirmOpen(false);
    setStatsModalOpen(false);
  }, [handleFullReset, handleResetReviews, setResetConfirmOpen, setStatsModalOpen]);

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
          folderId: `group-${name}`,
          icon: <Zap size={15} style={{ color: "#f59e0b" }} />,
          tasks,
          completed,
          total: tasks.length,
        });
      });

      return jsCategories;
    }

    return [
      { id: "category-warmup", folderId: "group-warmup", name: "Разминка", icon: <Flame size={15} style={{ color: "var(--accent-red)" }} />, tasks: WARMUP_TASKS, completed: completedWarmup, total: totalWarmup },
      { id: "category-refactoring", folderId: "group-refactoring", name: "Рефакторинг", icon: <Wrench size={15} style={{ color: "var(--accent-blue)" }} />, tasks: REFACTORING_TASKS, completed: completedRefactoring, total: totalRefactoring },
      { id: "category-middle", folderId: "group-middle", name: "Middle", icon: <Rocket size={15} style={{ color: "var(--color-success)" }} />, tasks: MAIN_TASKS, completed: completedMain, total: totalMain },
      { id: "category-strong", folderId: "group-strong", name: "Strong", icon: <Brain size={15} style={{ color: "var(--color-accent-purple)" }} />, tasks: ADVANCED_TASKS, completed: completedAdvanced, total: totalAdvanced },
      { id: "category-ts", folderId: "group-ts", name: "React + TS (Разминка)", icon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, tasks: REACT_TS_TASKS, completed: completedReactTs, total: totalReactTs },
      { id: "category-ts-practice", folderId: "group-ts-practice", name: "React + TS (Практика)", icon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, tasks: REACT_TS_PRACTICE_TASKS, completed: completedReactTsPractice, total: totalReactTsPractice },
    ];
  }, [activeSection, completedWarmup, totalWarmup, completedRefactoring, totalRefactoring, completedMain, totalMain, completedAdvanced, totalAdvanced, completedReactTs, totalReactTs, completedReactTsPractice, totalReactTsPractice, completedTasks]);

  const { taskCategory, categoryIcon, taskIcon, currentCategoryTasks, categoryId } = useMemo(() => {
    const defaultFileIcon = <FileText size={14} className="node-file-icon" style={{ color: FILE_ICON_COLOR }} />;
    if (!selectedTask) return { taskCategory: "", categoryIcon: null, taskIcon: defaultFileIcon, currentCategoryTasks: [], categoryId: "" };

    // React categories & groups
    if (selectedTask.id === "group-warmup" || WARMUP_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Разминка", categoryIcon: <Flame size={15} style={{ color: "var(--accent-red)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: WARMUP_TASKS, categoryId: "category-warmup" };
    if (selectedTask.id === "group-refactoring" || REFACTORING_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Рефакторинг", categoryIcon: <Wrench size={15} style={{ color: "var(--accent-blue)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REFACTORING_TASKS, categoryId: "category-refactoring" };
    if (selectedTask.id === "group-middle" || MAIN_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Middle", categoryIcon: <Rocket size={15} style={{ color: "var(--color-success)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: MAIN_TASKS, categoryId: "category-middle" };
    if (selectedTask.id === "group-strong" || ADVANCED_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "Strong", categoryIcon: <Brain size={15} style={{ color: "var(--color-accent-purple)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: ADVANCED_TASKS, categoryId: "category-strong" };
    if (selectedTask.id === "group-ts" || REACT_TS_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "React + TS (Разминка)", categoryIcon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REACT_TS_TASKS, categoryId: "category-ts" };
    if (selectedTask.id === "group-ts-practice" || REACT_TS_PRACTICE_TASKS.some((t) => t.id === selectedTask.id))
      return { taskCategory: "React + TS (Практика)", categoryIcon: <Zap size={15} style={{ color: "var(--color-warning-light)" }} />, taskIcon: defaultFileIcon, currentCategoryTasks: REACT_TS_PRACTICE_TASKS, categoryId: "category-ts-practice" };

    // JavaScript categories & groups
    if (JS_TASKS.some((t) => String(t.id) === String(selectedTask.id)) || (activeSection === "javascript" && selectedTask.group)) {
      const groupName = selectedTask.group || "Циклы";
      const subName = selectedTask.subgroup || "";
      const categoryName = subName ? `${groupName} > ${subName}` : groupName;
      const subTasks = JS_TASKS.filter(
        (t) => t.group === groupName && (!subName || t.subgroup === subName)
      );
      return {
        taskCategory: categoryName,
        categoryIcon: <Zap size={15} style={{ color: "var(--color-warning)" }} />,
        taskIcon: defaultFileIcon,
        currentCategoryTasks: subTasks.length > 0 ? subTasks : JS_TASKS,
        categoryId: `category-js-${categoryName}`,
      };
    }

    return { taskCategory: "", categoryIcon: null, taskIcon: defaultFileIcon, currentCategoryTasks: [], categoryId: "" };
  }, [selectedTask, activeSection]);

  const isTaskVisible = useCallback(() => true, []);

  // Helper context passed to child routes via context or outlet
  const outletContext = useMemo(() => ({
    completedTasks,
    setTaskStatus,
    activeTab,
    setActiveTab,
    checklistState,
    toggleChecklistItem,
    handleCopyCode,
    copiedCodeId,
    completedTotal,
    totalTasks,
    completedJsTotal,
    totalJsCount,
  }), [
    completedTasks,
    setTaskStatus,
    activeTab,
    setActiveTab,
    checklistState,
    toggleChecklistItem,
    handleCopyCode,
    copiedCodeId,
    completedTotal,
    totalTasks,
    completedJsTotal,
    totalJsCount,
  ]);

  if (isOpenMode) {
    return (
      <PracticeContext.Provider value={outletContext}>
        <div className="app-container app-container-open">
          <main className="content-area-open">
            <Outlet context={outletContext} />
          </main>
          <GlobalTooltip />
        </div>
      </PracticeContext.Provider>
    );
  }

  return (
    <PracticeContext.Provider value={outletContext}>
      <div className="app-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpenWithPreference}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={updateSidebarWidth}
          activeSection={activeSection}
          sectionDropdownOpen={sectionDropdownOpen}
          setSectionDropdownOpen={setSectionDropdownOpen}
          sectionDropdownRef={sectionDropdownRef}
          setHeaderSectionDropdownOpen={setHeaderSectionDropdownOpen}
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
          expandedJsGroups={expandedJsGroups}
          setExpandedJsGroups={setExpandedJsGroups}
          expandedJsSubgroups={expandedJsSubgroups}
          setExpandedJsSubgroups={setExpandedJsSubgroups}
          isTaskVisible={isTaskVisible}
          selectedTask={selectedTask}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedTasks={completedTasks}
        />

        {/* style Mobile Sidebar Overlay Backdrop */}
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
            sectionDropdownOpen={sectionDropdownOpen}
            setSectionDropdownOpen={setSectionDropdownOpen}
            headerSectionDropdownOpen={headerSectionDropdownOpen}
            setHeaderSectionDropdownOpen={setHeaderSectionDropdownOpen}
            headerSectionDropdownRef={headerSectionDropdownRef}
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
            completedTasks={completedTasks}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            expandedJsGroups={expandedJsGroups}
            setExpandedJsGroups={setExpandedJsGroups}
            expandedJsSubgroups={expandedJsSubgroups}
            setExpandedJsSubgroups={setExpandedJsSubgroups}
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

          <main className="content-area" ref={contentAreaRef}>
            <Outlet context={outletContext} />
          </main>
        </div>

        <CommandPaletteModal
          paletteOpen={paletteOpen}
          setPaletteOpen={setPaletteOpen}
          paletteQuery={paletteQuery}
          setPaletteQuery={setPaletteQuery}
          allTasksList={allTasksList}
          selectedTask={selectedTask}
          activeTab={activeTab}
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
                <AlertTriangle size={18} style={{ color: "var(--accent-red, #ef4444)" }} />
                <span>Подтверждение сброса</span>
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
                    background: "var(--accent-red-bg, rgba(239, 68, 68, 0.08))",
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
                      Сбросить прогресс и все решения задач?
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                      Все отметки о выполнении задач (решено / не решено) и весь сохранённый код решений в IndexedDB будут безвозвратно удалены, а задачи вернутся к начальному виду.
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-modal-footer" style={{ gap: "10px", justifyContent: "space-between" }}>
                <button
                  className="stats-confirm-cancel-btn"
                  onClick={() => setResetConfirmOpen(false)}
                >
                  Отмена
                </button>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button
                    className="stats-reset-btn"
                    style={{
                      background: "transparent",
                      color: "var(--color-error)",
                      borderColor: "var(--color-error)",
                    }}
                    onClick={handleResetSection}
                    title={`Сбросить прогресс и решения раздела ${activeSection}`}
                  >
                    <RotateCcw size={14} /> Сбросить раздел ({activeSection === "javascript" ? "JS" : activeSection === "algorithms" ? "Algo" : "React"})
                  </button>
                  <button
                    className="stats-reset-btn"
                    style={{
                      background: "var(--color-error)",
                      color: "var(--text-on-accent, #fff)",
                      borderColor: "var(--color-error)",
                    }}
                    onClick={handleResetAll}
                    title="Сбросить прогресс и код всех задач на платформе"
                  >
                    <Trash2 size={14} /> Сбросить всё на платформе
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <GlobalTooltip />
      </div>
    </PracticeContext.Provider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundComponent,
});
