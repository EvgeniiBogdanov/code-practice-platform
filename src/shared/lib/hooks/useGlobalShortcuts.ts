import { useEffect } from "react";

export interface UseGlobalShortcutsOptions {
  isOpenMode?: boolean;
  selectedTask?: { id: string | number; section?: string } | null;
  activeTab?: string;
  allTasksList?: Array<{ id: string | number; section: string }>;
  navigate?: (opts: {
    to: string;
    params?: Record<string, string>;
    search?: (prev: any) => any;
  }) => void;
  setActiveTab?: (tab: string) => void;
  setPaletteOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  setPaletteQuery?: (query: string) => void;
  closeAllModals?: () => void;
}

export function useGlobalShortcuts({
  isOpenMode = false,
  selectedTask,
  activeTab,
  allTasksList = [],
  navigate,
  setActiveTab,
  setPaletteOpen,
  setPaletteQuery,
  closeAllModals,
}: UseGlobalShortcutsOptions) {
  useEffect(() => {
    if (isOpenMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName;

      // Ignore key events in inputs except Escape
      if (tagName && ["INPUT", "TEXTAREA", "SELECT"].includes(tagName)) {
        if (e.key === "Escape") {
          if (closeAllModals) {
            closeAllModals();
          } else if (setPaletteOpen) {
            setPaletteOpen(false);
          }
        }
        return;
      }

      // Cmd+K or Ctrl+K: Open Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (setPaletteOpen) {
          setPaletteOpen((prev) => !prev);
        }
        if (setPaletteQuery) {
          setPaletteQuery("");
        }
        return;
      }

      // Escape: Close all active modals
      if (e.key === "Escape") {
        if (closeAllModals) {
          closeAllModals();
        }
        return;
      }

      // Arrow keys navigation
      if (selectedTask && allTasksList.length > 0 && navigate) {
        const currentIdx = allTasksList.findIndex((t) => String(t.id) === String(selectedTask.id));
        const tabs = ["candidate", "solution", "materials", "questions", "checklist"];
        const tabIdx = activeTab ? tabs.indexOf(activeTab) : -1;

        if (e.key === "ArrowDown" && currentIdx < allTasksList.length - 1) {
          e.preventDefault();
          const nextTask = allTasksList[currentIdx + 1];
          const section = nextTask.section;
          navigate({
            to:
              section === "javascript"
                ? "/javascript/$taskId"
                : section === "algorithms"
                  ? "/algorithms/$taskId"
                  : "/react/$taskId",
            params: { taskId: String(nextTask.id) },
            search: (prev) => prev,
          });
        } else if (e.key === "ArrowUp" && currentIdx > 0) {
          e.preventDefault();
          const prevTask = allTasksList[currentIdx - 1];
          const section = prevTask.section;
          navigate({
            to:
              section === "javascript"
                ? "/javascript/$taskId"
                : section === "algorithms"
                  ? "/algorithms/$taskId"
                  : "/react/$taskId",
            params: { taskId: String(prevTask.id) },
            search: (prev) => prev,
          });
        } else if (
          e.key === "ArrowRight" &&
          tabIdx >= 0 &&
          tabIdx < tabs.length - 1 &&
          setActiveTab
        ) {
          setActiveTab(tabs[tabIdx + 1]);
        } else if (e.key === "ArrowLeft" && tabIdx > 0 && setActiveTab) {
          setActiveTab(tabs[tabIdx - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpenMode,
    selectedTask,
    activeTab,
    allTasksList,
    navigate,
    setActiveTab,
    setPaletteOpen,
    setPaletteQuery,
    closeAllModals,
  ]);
}
