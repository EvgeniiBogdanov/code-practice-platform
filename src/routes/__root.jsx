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

  // Тема
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("playground_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("playground_theme", theme);
  }, [theme]);

  // Завершенные задачи
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("playground_completed_tasks");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setTaskStatus = useCallback((taskId, status) => {
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
  }, []);

  // Чеклист
  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem("playground_checklist_state");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = useCallback((key) => {
    setChecklistState((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("playground_checklist_state", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Копирование кода
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const handleCopyCode = useCallback((id, codeText) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  }, []);

  // Таймер
  const [timerSeconds, setTimerSeconds] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

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

  const startTimer = useCallback((minutes) => {
    setTimerSeconds(minutes * 60);
    setTimerRunning(true);
  }, []);

  const formatTimer = useCallback((totalSec) => {
    if (totalSec === null) return "";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Модалки
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [cheatCategory, setCheatCategory] = useState("hooks");
  const [cheatSearch, setCheatSearch] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Дропдауны
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [headerSectionDropdownOpen, setHeaderSectionDropdownOpen] = useState(false);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [jsDropdownOpen, setJsDropdownOpen] = useState(false);
  const [algoDropdownOpen, setAlgoDropdownOpen] = useState(false);

  const sectionDropdownRef = useRef(null);
  const headerSectionDropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const jsDropdownRef = useRef(null);
  const algoDropdownRef = useRef(null);

  // Категорийные аккордеоны в Сайдбаре (React)
  const [warmupExpanded, setWarmupExpanded] = useState(false);
  const [refactoringExpanded, setRefactoringExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [reactTsExpanded, setReactTsExpanded] = useState(false);
  const [reactTsPracticeExpanded, setReactTsPracticeExpanded] = useState(false);

  // Группы и подгруппы в Сайдбаре (JavaScript)
  const [expandedJsGroups, setExpandedJsGroups] = useState({});
  const [expandedJsSubgroups, setExpandedJsSubgroups] = useState({});

  const openSingleCategory = useCallback((targetCategoryId) => {
    setWarmupExpanded(targetCategoryId === "category-warmup");
    setRefactoringExpanded(targetCategoryId === "category-refactoring");
    setTasksExpanded(targetCategoryId === "category-middle");
    setAdvancedExpanded(targetCategoryId === "category-strong");
    setReactTsExpanded(targetCategoryId === "category-ts");
    setReactTsPracticeExpanded(targetCategoryId === "category-ts-practice");
  }, []);

  // Автоматическая двусторонняя синхронизация открытых папок/категорий в Finder и Сайдбаре
  // Keyed on selectedTaskId (string) instead of selectedTask (object) to avoid re-fires from reference changes
  const prevSyncedTaskIdRef = useRef(null);
  useEffect(() => {
    if (!selectedTask || !selectedTaskId) return;
    // Skip if we already synced for this exact taskId
    if (prevSyncedTaskIdRef.current === selectedTaskId) return;
    prevSyncedTaskIdRef.current = selectedTaskId;

    const taskIdStr = String(selectedTask.id);

    // React синхронизация категорий — use Set lookups for speed
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

    // JavaScript / Algorithms синхронизация групп и подгрупп (только при открытии задачи, но не при открытии страницы папки)
    if (selectedTask.group && !selectedTask.isGroupOverview) {
      setExpandedJsGroups((prev) => {
        if (prev[selectedTask.group]) return prev; // already expanded, skip state update
        return { ...prev, [selectedTask.group]: true };
      });
      if (selectedTask.subgroup) {
        const subKey = `${selectedTask.group}/${selectedTask.subgroup}`;
        setExpandedJsSubgroups((prev) => {
          if (prev[subKey]) return prev; // already expanded, skip state update
          return { ...prev, [subKey]: true };
        });
      }
    }

    // Плавная прокрутка активной задачи в сайдбаре в область видимости
    requestAnimationFrame(() => {
      const el = document.getElementById(`sidebar-task-${selectedTask.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [selectedTaskId]);

  // Клавиатурная навигация и Cmd+K
  useEffect(() => {
    if (isOpenMode) return;

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
        setCheatSheetOpen(false);
        setResetConfirmOpen(false);
        return;
      }

      if (selectedTask) {
        const currentIdx = allTasksList.findIndex((t) => String(t.id) === String(selectedTask.id));
        const tabs = ["candidate", "solution", "materials", "questions", "checklist"];
        const tabIdx = tabs.indexOf(activeTab);

        if (e.key === "ArrowDown" && currentIdx < allTasksList.length - 1) {
          e.preventDefault();
          const nextTask = allTasksList[currentIdx + 1];
          navigate({
            to: nextTask.section === "javascript" ? "/javascript/$taskId" : "/react/$taskId",
            params: { taskId: String(nextTask.id) },
            search: (prev) => prev,
          });
        } else if (e.key === "ArrowUp" && currentIdx > 0) {
          e.preventDefault();
          const prevTask = allTasksList[currentIdx - 1];
          navigate({
            to: prevTask.section === "javascript" ? "/javascript/$taskId" : "/react/$taskId",
            params: { taskId: String(prevTask.id) },
            search: (prev) => prev,
          });
        } else if (e.key === "ArrowRight" && tabIdx < tabs.length - 1) {
          setActiveTab(tabs[tabIdx + 1]);
        } else if (e.key === "ArrowLeft" && tabIdx > 0) {
          setActiveTab(tabs[tabIdx - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTask, activeTab, allTasksList, navigate, setActiveTab]);

  // Tooltip
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);

  const showTooltip = useCallback((e, text) => {
    clearTimeout(tooltipTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    tooltipTimer.current = setTimeout(() => {
      setTooltip({ text, x: rect.left + 12, y: rect.top - 4 });
    }, 650);
  }, []);

  const hideTooltip = useCallback(() => {
    clearTimeout(tooltipTimer.current);
    setTooltip(null);
  }, []);

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
      const jsStats = computeStats(JS_TASKS);
      const groupNames = Array.from(new Set(JS_TASKS.map((t) => t.group)));
      const jsCategories = groupNames.map((gName) => {
        const groupTasks = JS_TASKS.filter((t) => t.group === gName);
        const count = groupTasks.filter((t) => completedTasks[t.id] && completedTasks[t.id] !== "unsolved").length;
        return { name: gName, completed: count, total: groupTasks.length };
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
      const jsStats = computeStats(JS_TASKS);
      const algoStats = computeStats(ALGO_TASKS);
      const allSolved = solvedCount + jsStats.solved + algoStats.solved;
      const allUnsolved = unsolvedCount + jsStats.unsolved + algoStats.unsolved;
      const allTotal = totalTasks + jsStats.total + algoStats.total;
      const allInProgress = allTotal - allSolved - allUnsolved;

      return {
        title: "Общая статистика платформы",
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

    const algoStats = computeStats(ALGO_TASKS);
    const algoGroupNames = Array.from(new Set(ALGO_TASKS.map((t) => t.group)));
    const algoCategories = algoGroupNames.map((gName) => {
      const groupTasks = ALGO_TASKS.filter((t) => t.group === gName);
      const count = groupTasks.filter((t) => completedTasks[t.id] && completedTasks[t.id] !== "unsolved").length;
      return { name: gName, completed: count, total: groupTasks.length };
    });

    return {
      title: "Статистика Алгоритмы",
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

  const handleResetProgress = useCallback(() => {
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
  }, [activeSection]);

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
          {tooltip && (
            <div className="fixed-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.text}
            </div>
          )}
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
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
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

        <GlobalTooltip />
      </div>
    </PracticeContext.Provider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundComponent,
});
