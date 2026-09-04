import React, { memo } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../Modal";
import { Button, ButtonVariant } from "../Button";
import styles from "./ConfirmModal.module.css";

export interface ConfirmModalAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  actions: ConfirmModalAction[];
  onClose: () => void;
  cancelText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ConfirmModal = memo(
  ({
    isOpen,
    title,
    description,
    actions,
    onClose,
    cancelText = "Отмена",
    icon = <AlertTriangle size={18} className={styles.iconDanger} />,
    className,
  }: ConfirmModalProps): React.JSX.Element => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        title={title}
        icon={icon}
        className={className}
      >
        <div className={styles.body}>
          {typeof description === "string" ? (
            <p className={styles.text}>{description}</p>
          ) : (
            description
          )}

          <div className={styles.actions}>
            {actions.map((act) => (
              <Button
                key={act.label}
                variant={act.variant || "danger"}
                onClick={act.onClick}
                leftIcon={act.icon}
              >
                {act.label}
              </Button>
            ))}

            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

ConfirmModal.displayName = "ConfirmModal";
