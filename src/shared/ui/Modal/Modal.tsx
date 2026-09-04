import React, { memo } from "react";
import { createPortal } from "react-dom";
import { useModalBehavior } from "./lib/useModalBehavior";
import { ModalCard } from "./ui/ModalCard";
import styles from "./Modal.module.css";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  customHeader?: React.ReactNode;
}

export const Modal = memo((props: ModalProps): React.JSX.Element | null => {
  const {
    isOpen,
    onClose,
    children,
    size = "md",
    hideCloseButton = false,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    ...restProps
  } = props;

  const modalRef = useModalBehavior(isOpen, closeOnEscape, onClose);

  if (!isOpen || typeof document === "undefined") return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalNode = (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <ModalCard
        modalRef={modalRef}
        size={size}
        hideCloseButton={hideCloseButton}
        onClose={onClose}
        {...restProps}
      >
        {children}
      </ModalCard>
    </div>
  );

  return createPortal(modalNode, document.body);
});

Modal.displayName = "Modal";
