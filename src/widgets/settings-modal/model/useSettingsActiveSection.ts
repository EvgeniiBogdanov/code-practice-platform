import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import { getSectionFromPathname, SECTIONS_CONFIG, type SectionType } from "@/entities/task/meta";
import { useAllTaskSections } from "@/entities/task/catalog";

export function useSettingsActiveSection() {
  const location = useLocation();
  const { tasks } = useAllTaskSections();

  const activeSection = useMemo<SectionType | "home">(
    () => getSectionFromPathname(location.pathname) ?? "home",
    [location.pathname]
  );

  const sectionName =
    activeSection === "home" ? "Вся платформа" : SECTIONS_CONFIG[activeSection].title;

  const currentSectionTasks = useMemo(
    () =>
      activeSection === "home" ? tasks : tasks.filter((task) => task.section === activeSection),
    [activeSection, tasks]
  );

  return {
    activeSection,
    sectionName,
    currentSectionTasks,
  };
}
