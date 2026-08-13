import React, { createContext, useContext } from "react";
import { useProgressStore } from "../stores/useProgressStore";

export const PracticeContext = createContext(null);

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (context) return context;

  // Fallback to Zustand progress store for direct access
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const checklistState = useProgressStore((state) => state.checklistState);
  const copiedCodeId = useProgressStore((state) => state.copiedCodeId);
  const setTaskStatus = useProgressStore((state) => state.setTaskStatus);
  const toggleChecklistItem = useProgressStore((state) => state.toggleChecklistItem);
  const handleCopyCode = useProgressStore((state) => state.handleCopyCode);

  return {
    completedTasks,
    checklistState,
    copiedCodeId,
    setTaskStatus,
    toggleChecklistItem,
    handleCopyCode,
  };
};
