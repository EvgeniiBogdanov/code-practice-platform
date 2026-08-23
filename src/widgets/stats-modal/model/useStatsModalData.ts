import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { ALL_TASKS, ALL_JS_TASKS, ALL_REACT_TASKS, ALL_ALGO_TASKS, Task } from "@/entities/task";

export interface SpacedRepetitionModalData {
  sectionName: string;
  section: "javascript" | "react" | "algorithms" | "home";
  taskList: Task[];
}

export const useStatsModalData = (): SpacedRepetitionModalData => {
  const location = useLocation();

  const activeSection = useMemo<"javascript" | "react" | "algorithms" | "home">(() => {
    const p = location.pathname;
    if (p.startsWith("/javascript")) return "javascript";
    if (p.startsWith("/react")) return "react";
    if (p.startsWith("/algorithms")) return "algorithms";
    return "home";
  }, [location.pathname]);

  return useMemo(() => {
    if (activeSection === "javascript") {
      return {
        sectionName: "JavaScript",
        section: "javascript",
        taskList: ALL_JS_TASKS,
      };
    }
    if (activeSection === "react") {
      return {
        sectionName: "React",
        section: "react",
        taskList: ALL_REACT_TASKS,
      };
    }
    if (activeSection === "algorithms") {
      return {
        sectionName: "Алгоритмы",
        section: "algorithms",
        taskList: ALL_ALGO_TASKS,
      };
    }
    return {
      sectionName: "Вся платформа",
      section: "home",
      taskList: ALL_TASKS,
    };
  }, [activeSection]);
};
