import React, { memo } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { Tooltip } from "../../Tooltip";
import styles from "../Modal.module.css";

export interface ModalHeaderProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  hideCloseButton?: boolean;
  onClose: () => void;
  className?: string;
}

export const ModalHeader = memo(
  ({
    title,
    icon,
    description,
    hideCloseButton,
    onClose,
    className,
  }: ModalHeaderProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.header, className)}>
        <div className={styles.titleGroup}>
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
          <div className={styles.titleContent}>
            <h3 className={styles.title}>{title}</h3>
            {description && <div className={styles.description}>{description}</div>}
          </div>
        </div>
        {!hideCloseButton && (
          <Tooltip content="Закрыть (Esc)" side="bottom">
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Закрыть модальное окно"
            >
              <X size={16} />
            </button>
          </Tooltip>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";
