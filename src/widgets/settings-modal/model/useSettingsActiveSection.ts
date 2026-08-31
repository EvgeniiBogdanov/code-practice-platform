import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { useAllTaskSections } from "@/entities/task/catalog";

export function useSettingsActiveSection() {
  const location = useLocation();
  const { tasks } = useAllTaskSections();

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
        return tasks.filter((task) => task.section === "javascript");
      case "algorithms":
        return tasks.filter((task) => task.section === "algorithms");
      case "react":
        return tasks.filter((task) => task.section === "react");
      default:
        return tasks;
    }
  }, [activeSection, tasks]);

  return {
    activeSection,
    sectionName,
    currentSectionTasks,
  };
}
