import { useState, useEffect, useCallback } from "react";
import { useUIStore } from "@/entities/ui-state";
import { useProgressStore } from "@/entities/progress";
import { useReviewStore } from "@/entities/review";
import { useSettingsActiveSection } from "./useSettingsActiveSection";

export const useSettingsModal = () => {
  const isOpen = useUIStore((state) => state.settingsModalOpen);
  const setIsOpen = useUIStore((state) => state.setSettingsModalOpen);

  const [resetReviewsConfirmOpen, setResetReviewsConfirmOpen] = useState(false);
  const [resetUIConfirmOpen, setResetUIConfirmOpen] = useState(false);
  const [resetAllConfirmOpen, setResetAllConfirmOpen] = useState(false);

  const resetUISettings = useUIStore((state) => state.resetUISettings);
  const handleFullReset = useProgressStore((state) => state.handleFullReset);
  const handleResetReviews = useReviewStore((state) => state.handleResetReviews);
  const { activeSection, sectionName, currentSectionTasks } = useSettingsActiveSection();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        isOpen &&
        !resetReviewsConfirmOpen &&
        !resetUIConfirmOpen &&
        !resetAllConfirmOpen
      ) {
        setIsOpen(false);
      }
    },
    [isOpen, resetReviewsConfirmOpen, resetUIConfirmOpen, resetAllConfirmOpen, setIsOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleResetSectionReviews = async () => {
    if (activeSection !== "home") {
      const ids = currentSectionTasks.map((t) => t.id);
      await handleResetReviews("section", ids);
    }
    setResetReviewsConfirmOpen(false);
  };

  const handleResetAllReviews = async () => {
    await handleResetReviews("all");
    setResetReviewsConfirmOpen(false);
  };

  const handleResetUISettings = () => {
    resetUISettings();
    setResetUIConfirmOpen(false);
  };

  const handleResetAllData = async () => {
    await handleFullReset("all");
    await handleResetReviews("all");
    resetUISettings();
    setResetAllConfirmOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    activeSection,
    sectionName,
    resetReviewsConfirmOpen,
    setResetReviewsConfirmOpen,
    resetUIConfirmOpen,
    setResetUIConfirmOpen,
    resetAllConfirmOpen,
    setResetAllConfirmOpen,
    handleResetSectionReviews,
    handleResetAllReviews,
    handleResetUISettings,
    handleResetAllData,
  };
};
