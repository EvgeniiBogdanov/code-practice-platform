import { memo } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Modal } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

export interface ConfirmAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: React.ReactNode;
}

export interface SettingsResetConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  actions: ConfirmAction[];
  onClose: () => void;
}

export const SettingsResetConfirmDialog = memo(
  ({ isOpen, title, description, actions, onClose }: SettingsResetConfirmDialogProps) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        title={title}
        icon={<AlertTriangle size={18} style={{ color: "var(--accent-red, #ef4444)" }} />}
      >
        <div className={styles.resetConfirmBody}>
          <p className={styles.resetConfirmText}>{description}</p>

          <div className={styles.resetConfirmActions}>
            {actions.map((act, idx) => (
              <Button key={idx} variant={act.variant || "danger"} onClick={act.onClick}>
                {act.icon}
                <span>{act.label}</span>
              </Button>
            ))}

            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

SettingsResetConfirmDialog.displayName = "SettingsResetConfirmDialog";
