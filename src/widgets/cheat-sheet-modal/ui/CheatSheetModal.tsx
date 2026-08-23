import { memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/entities/ui-state";
import { useModalBehavior } from "@/shared/ui/Modal/lib/useModalBehavior";
import { useCheatSheetData } from "../model/useCheatSheetData";
import { CheatSheetDrawerBody } from "./CheatSheetDrawerBody";
import styles from "./CheatSheetModal.module.css";

export const CheatSheetModal = memo(() => {
  const isOpen = useUIStore((state) => state.cheatSheetOpen);
  const setIsOpen = useUIStore((state) => state.setCheatSheetOpen);
  const cheatSearch = useUIStore((state) => state.cheatSearch);
  const setCheatSearch = useUIStore((state) => state.setCheatSearch);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const drawerRef = useModalBehavior(isOpen, true, handleClose);

  const {
    activeSection,
    activeCategory,
    copiedId,
    currentSectionConfig,
    filteredData,
    handleSelectSection,
    setActiveCategory,
    handleCopy,
  } = useCheatSheetData(cheatSearch);

  if (!isOpen) return null;

  const drawerNode = (
    <div className={styles.drawerOverlay} onClick={handleClose} role="dialog" aria-modal="true">
      <CheatSheetDrawerBody
        drawerRef={drawerRef}
        title={currentSectionConfig.title}
        onClose={handleClose}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        cheatSearch={cheatSearch}
        onSearchChange={setCheatSearch}
        categories={currentSectionConfig.categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        items={filteredData}
        copiedId={copiedId}
        onCopy={handleCopy}
      />
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerNode, document.body) : drawerNode;
});

CheatSheetModal.displayName = "CheatSheetModal";
