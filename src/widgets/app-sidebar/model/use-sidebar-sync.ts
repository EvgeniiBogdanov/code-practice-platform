import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { ALL_REACT_TASKS, getTaskById } from "@/entities/task";
import { useUIStore } from "@/entities/ui-state";

export const useSidebarSync = (): void => {
  const location = useLocation();
  const pathname = location.pathname;
  const currentTaskId = pathname.split("/").pop() || "";

  const setWarmupExpanded = useUIStore((state) => state.setWarmupExpanded);
  const setRefactoringExpanded = useUIStore((state) => state.setRefactoringExpanded);
  const setTasksExpanded = useUIStore((state) => state.setTasksExpanded);
  const setAdvancedExpanded = useUIStore((state) => state.setAdvancedExpanded);
  const setReactTsExpanded = useUIStore((state) => state.setReactTsExpanded);
  const setReactTsPracticeExpanded = useUIStore((state) => state.setReactTsPracticeExpanded);

  const setExpandedJsGroups = useUIStore((state) => state.setExpandedJsGroups);
  const setExpandedJsSubgroups = useUIStore((state) => state.setExpandedJsSubgroups);
  const setExpandedAlgoGroups = useUIStore((state) => state.setExpandedAlgoGroups);
  const setExpandedAlgoSubgroups = useUIStore((state) => state.setExpandedAlgoSubgroups);

  const prevSyncedIdRef = useRef<string>("");

  useEffect(() => {
    if (!currentTaskId || currentTaskId === prevSyncedIdRef.current) return;
    prevSyncedIdRef.current = currentTaskId;

    // A. Handle Group / Subgroup Overview URLs — do NOT auto-expand list (reserved strictly for chevron click)
    if (currentTaskId.startsWith("group-") || currentTaskId.startsWith("subgroup-")) {
      return;
    }

    // B. Handle Specific Task URLs
    const task = getTaskById(currentTaskId);
    if (!task) return;

    const taskIdStr = String(task.id);

    // 1. React tasks synchronization
    if (pathname.startsWith("/react")) {
      const isWarmup = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.difficulty === "warm-up"
      );
      const isRefactoring = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.difficulty === "refactoring"
      );
      const isMiddle = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.difficulty === "middle"
      );
      const isStrong = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.difficulty === "strong"
      );
      const isReactTs = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.category === "React + TS (Разминка)"
      );
      const isReactTsPractice = ALL_REACT_TASKS.some(
        (t) => String(t.id) === taskIdStr && t.category === "React + TS (Практика)"
      );

      if (isWarmup) setWarmupExpanded(true);
      else if (isRefactoring) setRefactoringExpanded(true);
      else if (isMiddle) setTasksExpanded(true);
      else if (isStrong) setAdvancedExpanded(true);
      else if (isReactTs) setReactTsExpanded(true);
      else if (isReactTsPractice) setReactTsPracticeExpanded(true);
    }

    // 2. JavaScript tasks synchronization
    if (pathname.startsWith("/javascript") && task.group) {
      setExpandedJsGroups((prev) => {
        if (prev[task.group!]) return prev;
        return { ...prev, [task.group!]: true };
      });

      if (task.subgroup) {
        const subKey = `${task.group}/${task.subgroup}`;
        setExpandedJsSubgroups((prev) => {
          if (prev[subKey]) return prev;
          return { ...prev, [subKey]: true };
        });
      }
    }

    // 3. Algorithms tasks synchronization
    if (pathname.startsWith("/algorithms") && task.group) {
      setExpandedAlgoGroups((prev) => {
        if (prev[task.group!]) return prev;
        return { ...prev, [task.group!]: true };
      });

      if (task.subgroup) {
        const subKey = `${task.group}/${task.subgroup}`;
        setExpandedAlgoSubgroups((prev) => {
          if (prev[subKey]) return prev;
          return { ...prev, [subKey]: true };
        });
      }
    }

    // 4. Smooth scroll to active sidebar item
    requestAnimationFrame(() => {
      const el = document.getElementById(`sidebar-task-${currentTaskId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [
    currentTaskId,
    pathname,
    setWarmupExpanded,
    setRefactoringExpanded,
    setTasksExpanded,
    setAdvancedExpanded,
    setReactTsExpanded,
    setReactTsPracticeExpanded,
    setExpandedJsGroups,
    setExpandedJsSubgroups,
    setExpandedAlgoGroups,
    setExpandedAlgoSubgroups,
  ]);
};
