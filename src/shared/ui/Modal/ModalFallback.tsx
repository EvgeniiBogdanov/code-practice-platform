import { memo } from "react";
import { createPortal } from "react-dom";
import { UiLoader } from "../UiLoader";
import styles from "./Modal.module.css";

export const ModalFallback = memo(() => {
  if (typeof document === "undefined") return null;

  const node = (
    <div
      className={styles.backdrop}
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
