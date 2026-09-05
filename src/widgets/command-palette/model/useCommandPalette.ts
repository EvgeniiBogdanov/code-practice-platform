import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import type { Task } from "@/entities/task/meta";
import { useAllTaskSections } from "@/entities/task/catalog";
import { useUIStore } from "@/entities/ui-state";
import { useDebounce } from "@/shared/lib/hooks";
import { PaletteSection } from "../ui/CommandPaletteTabs";
import { getSectionFromPathname } from "../lib/getSectionFromPathname";

export interface UseCommandPaletteReturn {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  activeSection: PaletteSection;
  setActiveSection: (sec: PaletteSection) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  filteredTasks: Task[];
  isLoading: boolean;
  handleSelectTask: (task: Task) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const useCommandPalette = (): UseCommandPaletteReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useUIStore((state) => state.paletteOpen);
  const setIsOpen = useUIStore((state) => state.setPaletteOpen);
  const query = useUIStore((state) => state.paletteQuery);
  const setQuery = useUIStore((state) => state.setPaletteQuery);

  const debouncedQuery = useDebounce(query, 200);

  const [activeSection, setActiveSection] = useState<PaletteSection>(() =>
    getSectionFromPathname(location.pathname)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { tasks, isLoading } = useAllTaskSections(isOpen);

  useEffect(() => {
    if (isOpen) {
      setActiveSection(getSectionFromPathname(location.pathname));
      setQuery("");
    }
  }, [isOpen, location.pathname, setQuery]);

  const filteredTasks = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const pool =
      activeSection === "all" ? tasks : tasks.filter((t) => t.section === activeSection);
    if (!q) return pool;

    return pool.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        String(t.id).toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.group?.toLowerCase().includes(q) ||
        t.subgroup?.toLowerCase().includes(q) ||
        t.difficulty?.toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, activeSection, tasks]);

  const handleSelectTask = useCallback(
    (task: Task) => {
      setIsOpen(false);
      setQuery("");
      if (task.section === "javascript") {
        navigate({ to: "/javascript/$taskId", params: { taskId: String(task.id) } });
      } else if (task.section === "algorithms") {
        navigate({ to: "/algorithms/$taskId", params: { taskId: String(task.id) } });
      } else {
        navigate({ to: "/react/$taskId", params: { taskId: String(task.id) } });
      }
    },
    [navigate, setIsOpen, setQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTasks.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTasks.length - 1));
    } else if (e.key === "Enter" && filteredTasks[selectedIndex]) {
      e.preventDefault();
      handleSelectTask(filteredTasks[selectedIndex]);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery, activeSection]);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    debouncedQuery,
    activeSection,
    setActiveSection,
    selectedIndex,
    setSelectedIndex,
    filteredTasks,
    isLoading,
    handleSelectTask,
    handleKeyDown,
  };
};
