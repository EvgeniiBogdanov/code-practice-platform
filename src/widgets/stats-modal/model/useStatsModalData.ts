import { useMemo } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  getSectionFromPathname,
  SECTIONS_CONFIG,
  type SectionType,
  type Task,
} from "@/entities/task/meta";
import { useAllTaskSections } from "@/entities/task/catalog";
import { useReviewStore } from "@/entities/review";

export interface SpacedRepetitionModalData {
  sectionName: string;
  section: SectionType | "home";
  taskList: Task[];
}

export const useStatsModalData = (): SpacedRepetitionModalData => {
  const location = useLocation();
  const { tasks } = useAllTaskSections();
  const excludedTaskIds = useReviewStore((state) => state.excludedTaskIds);

  const section = useMemo<SectionType | "home">(
    () => getSectionFromPathname(location.pathname) ?? "home",
    [location.pathname]
  );

  const activeTasks = useMemo(() => {
    const excludedSet = new Set(excludedTaskIds.map(String));
    return tasks.filter((task) => !excludedSet.has(String(task.id)));
  }, [tasks, excludedTaskIds]);

  return useMemo(
    () =>
      section === "home"
        ? { sectionName: "Вся платформа", section, taskList: activeTasks }
        : {
            sectionName: SECTIONS_CONFIG[section].title,
            section,
            taskList: activeTasks.filter((task) => task.section === section),
          },
    [section, activeTasks]
  );
};
