import { useEffect } from "react";

/**
 * Custom hook for managing global keyboard shortcuts across the platform.
 * Supports:
 * - Cmd/Ctrl + K: Open/close Command Palette
 * - Escape: Close all active modals
 * - ArrowUp / ArrowDown: Navigate between tasks in the current list
 * - ArrowLeft / ArrowRight: Switch between tabs (candidate, solution, materials, questions, checklist)
 */
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
}) {
  useEffect(() => {
    if (isOpenMode) return;

    const handleKeyDown = (e) => {
      // Игнорируем нажатия внутри текстовых полей кроме Escape
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        if (e.key === "Escape") {
          if (closeAllModals) {
            closeAllModals();
          } else if (setPaletteOpen) {
            setPaletteOpen(false);
          }
        }
        return;
      }

      // Cmd+K или Ctrl+K: Открытие палитры команд
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

      // Escape: Закрытие всех модальных окон
      if (e.key === "Escape") {
        if (closeAllModals) {
          closeAllModals();
        }
        return;
      }

      // Навигация по задачам и табам
      if (selectedTask && allTasksList.length > 0 && navigate) {
        const currentIdx = allTasksList.findIndex((t) => String(t.id) === String(selectedTask.id));
        const tabs = ["candidate", "solution", "materials", "questions", "checklist"];
        const tabIdx = tabs.indexOf(activeTab);

        if (e.key === "ArrowDown" && currentIdx < allTasksList.length - 1) {
          e.preventDefault();
          const nextTask = allTasksList[currentIdx + 1];
          navigate({
            to:
              nextTask.section === "javascript"
                ? "/javascript/$taskId"
                : nextTask.section === "algorithms"
                ? "/algorithms/$taskId"
                : "/react/$taskId",
            params: { taskId: String(nextTask.id) },
            search: (prev) => prev,
          });
        } else if (e.key === "ArrowUp" && currentIdx > 0) {
          e.preventDefault();
          const prevTask = allTasksList[currentIdx - 1];
          navigate({
            to:
              prevTask.section === "javascript"
                ? "/javascript/$taskId"
                : prevTask.section === "algorithms"
                ? "/algorithms/$taskId"
                : "/react/$taskId",
            params: { taskId: String(prevTask.id) },
            search: (prev) => prev,
          });
        } else if (e.key === "ArrowRight" && tabIdx >= 0 && tabIdx < tabs.length - 1 && setActiveTab) {
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
