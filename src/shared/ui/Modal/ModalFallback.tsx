import { memo } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { UiLoader } from "../UiLoader";
import styles from "./Modal.module.css";

export interface ModalFallbackProps {
  isPalette?: boolean;
}

export const ModalFallback = memo<ModalFallbackProps>(({ isPalette = false }) => {
  if (typeof document === "undefined") return null;

  const node = (
    <div
      className={clsx(styles.backdrop, isPalette && styles.paletteBackdrop)}
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-label="Загрузка..."
    >
      <UiLoader size="lg" variant="gray" />
    </div>
  );

  return createPortal(node, document.body);
});

ModalFallback.displayName = "ModalFallback";
