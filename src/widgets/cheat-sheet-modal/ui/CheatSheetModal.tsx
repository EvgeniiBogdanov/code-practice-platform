import { memo, useCallback, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/entities/ui-state";
import { useModalBehavior } from "@/shared/ui";
import { CheatSheetDrawerSkeleton } from "./CheatSheetDrawerSkeleton";
import styles from "./CheatSheetModal.module.css";

const CheatSheetDrawerBody = lazy(() =>
  import("./CheatSheetDrawerBody").then((module) => ({
    default: module.CheatSheetDrawerBody,
  }))
);

export const CheatSheetModal = memo((): React.JSX.Element | null => {
  const isOpen = useUIStore((state) => state.cheatSheetOpen);
  const setIsOpen = useUIStore((state) => state.setCheatSheetOpen);

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const drawerRef = useModalBehavior(isOpen, true, handleClose);

  if (!isOpen) return null;

  const drawerNode = (
    <div className={styles.drawerOverlay} onClick={handleClose} role="dialog" aria-modal="true">
      <Suspense fallback={<CheatSheetDrawerSkeleton onClose={handleClose} />}>
        <CheatSheetDrawerBody drawerRef={drawerRef} onClose={handleClose} />
      </Suspense>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(drawerNode, document.body) : drawerNode;
});

CheatSheetModal.displayName = "CheatSheetModal";
