import { useState, useEffect, useRef, useCallback } from "react";
import {
  WARMUP_TASKS,
  REFACTORING_TASKS,
  MAIN_TASKS,
  ADVANCED_TASKS,
  REACT_TS_TASKS,
  REACT_TS_PRACTICE_TASKS,
} from "../react/data/tasksData";

/**
 * Custom hook for managing sidebar accordion sections (React categories & JS/Algo groups)
 * and auto-scrolling to the active task.
 */
export function useSidebarAccordion({ selectedTask, selectedTaskId }) {
  // Категорийные аккордеоны в Сайдбаре (React)
  const [warmupExpanded, setWarmupExpanded] = useState(false);
  const [refactoringExpanded, setRefactoringExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [reactTsExpanded, setReactTsExpanded] = useState(false);
  const [reactTsPracticeExpanded, setReactTsPracticeExpanded] = useState(false);

  // Группы и подгруппы в Сайдбаре (JavaScript / Algorithms)
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

  // Автоматическая двусторонняя синхронизация открытых папок/категорий в Сайдбаре
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

    // Плавная прокрутка активной задачи в сайдбаре в область видимости
    requestAnimationFrame(() => {
      const el = document.getElementById(`sidebar-task-${selectedTask.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [selectedTask, selectedTaskId]);

  return {
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
    expandedJsGroups,
    setExpandedJsGroups,
    expandedJsSubgroups,
    setExpandedJsSubgroups,
    openSingleCategory,
  };
}
