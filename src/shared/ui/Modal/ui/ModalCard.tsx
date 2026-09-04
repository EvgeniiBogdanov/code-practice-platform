import React, { memo } from "react";
import { clsx } from "clsx";
import { ModalHeader } from "./ModalHeader";
import styles from "../Modal.module.css";
import { ModalSize } from "../Modal";

export interface ModalCardProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  size: ModalSize;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  hideCloseButton?: boolean;
  onClose: () => void;
  customHeader?: React.ReactNode;
}

export const ModalCard = memo(
  ({
    modalRef,
    size,
    title,
    icon,
    description,
    children,
    footer,
    className,
    headerClassName,
    contentClassName,
    footerClassName,
    hideCloseButton,
    onClose,
    customHeader,
  }: ModalCardProps): React.JSX.Element => {
    const modalClassNames = clsx(styles.modal, styles[`size-${size}`], className);

    return (
      <div ref={modalRef} className={modalClassNames}>
        {customHeader ? (
          customHeader
        ) : title ? (
          <ModalHeader
            title={title}
            icon={icon}
            description={description}
            hideCloseButton={hideCloseButton}
            onClose={onClose}
            className={headerClassName}
          />
        ) : null}

        <div className={clsx(styles.content, contentClassName)}>{children}</div>

        {footer && <div className={clsx(styles.footer, footerClassName)}>{footer}</div>}
      </div>
    );
  }
);

ModalCard.displayName = "ModalCard";
