import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useAllTaskSections } from "@/entities/task/catalog";
import { useReviewStore } from "@/entities/review";

export interface SpacedRepetitionModalData {
  sectionName: string;
  section: "javascript" | "react" | "algorithms" | "home";
  taskList: Task[];
}

export const useStatsModalData = (): SpacedRepetitionModalData => {
  const location = useLocation();
  const { tasks } = useAllTaskSections();
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const activeSection = useMemo<"javascript" | "react" | "algorithms" | "home">(() => {
    const p = location.pathname;
    if (p.startsWith("/javascript")) return "javascript";
    if (p.startsWith("/react")) return "react";
    if (p.startsWith("/algorithms")) return "algorithms";
    return "home";
  }, [location.pathname]);

  const activeTasks = useMemo(() => {
    const excludedSet = new Set(excludedTaskIds.map(String));
    return tasks.filter((task) => !excludedSet.has(String(task.id)));
  }, [tasks, excludedTaskIds]);

  return useMemo(() => {
    if (activeSection === "javascript") {
      return {
        sectionName: "JavaScript",
        section: "javascript",
        taskList: activeTasks.filter((task) => task.section === "javascript"),
      };
    }
    if (activeSection === "react") {
      return {
        sectionName: "React",
        section: "react",
        taskList: activeTasks.filter((task) => task.section === "react"),
      };
    }
    if (activeSection === "algorithms") {
      return {
        sectionName: "Алгоритмы",
        section: "algorithms",
        taskList: activeTasks.filter((task) => task.section === "algorithms"),
      };
    }
    return {
      sectionName: "Вся платформа",
      section: "home",
      taskList: activeTasks,
    };
  }, [activeSection, activeTasks]);
};
