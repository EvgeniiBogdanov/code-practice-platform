import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import type { SectionType } from "@/entities/task/meta";
import { useTaskSection } from "@/entities/task/catalog";
import { useUIStore } from "@/entities/ui-state";

export const useSidebarSync = (): void => {
  const location = useLocation();
  const pathname = location.pathname;
  const currentTaskId = pathname.split("/").pop() || "";
  const section: SectionType = pathname.startsWith("/javascript")
    ? "javascript"
    : pathname.startsWith("/algorithms")
      ? "algorithms"
      : "react";
  const { tasks } = useTaskSection(section);

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
    const task = tasks.find((item) => String(item.id) === currentTaskId);
    if (!task) return;

    // 1. React tasks synchronization
    if (pathname.startsWith("/react")) {
      const isWarmup = task.difficulty === "warm-up";
      const isRefactoring = task.difficulty === "refactoring";
      const isMiddle = task.difficulty === "middle";
      const isStrong = task.difficulty === "strong";
      const isReactTs = task.category === "React + TS (Разминка)";
      const isReactTsPractice = task.category === "React + TS (Практика)";

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

    // 4. Keep the selected task visible without adding a second animated layout shift.
    requestAnimationFrame(() => {
      const el = document.getElementById(`sidebar-task-${currentTaskId}`);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "nearest" });
      }
    });
  }, [
    currentTaskId,
    pathname,
    tasks,
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
