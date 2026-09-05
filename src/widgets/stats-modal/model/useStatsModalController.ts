import { useEffect, useCallback } from "react";
import { useUIStore } from "@/entities/ui-state";
import { useStatsModalData } from "./useStatsModalData";

export const useStatsModalController = () => {
  const isOpen = useUIStore((state) => state.statsModalOpen);
  const setIsOpen = useUIStore((state) => state.setStatsModalOpen);

  const statsData = useStatsModalData();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    },
    [isOpen, setIsOpen]
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const modalTitle =
    statsData.section === "home"
      ? "Статистика повторений платформы"
      : `Статистика повторений (${statsData.sectionName})`;

  return {
    isOpen,
    setIsOpen,
    statsData,
    modalTitle,
  };
};
