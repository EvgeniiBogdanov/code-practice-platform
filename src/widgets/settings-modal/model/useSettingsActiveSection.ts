import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { ALL_TASKS, ALL_JS_TASKS, ALL_ALGO_TASKS, ALL_REACT_TASKS } from "@/entities/task";

export function useSettingsActiveSection() {
  const location = useLocation();

  const activeSection = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/javascript")) return "javascript";
    if (path.includes("/algorithms")) return "algorithms";
    if (path.includes("/react")) return "react";
    return "home";
  }, [location.pathname]);

  const sectionName = useMemo(() => {
    switch (activeSection) {
      case "javascript":
        return "JavaScript";
      case "algorithms":
        return "Алгоритмы";
      case "react":
        return "React";
      default:
        return "Вся платформа";
    }
  }, [activeSection]);

  const currentSectionTasks = useMemo(() => {
    switch (activeSection) {
      case "javascript":
        return ALL_JS_TASKS;
      case "algorithms":
        return ALL_ALGO_TASKS;
      case "react":
        return ALL_REACT_TASKS;
      default:
        return ALL_TASKS;
    }
  }, [activeSection]);

  return {
    activeSection,
    sectionName,
    currentSectionTasks,
  };
}
