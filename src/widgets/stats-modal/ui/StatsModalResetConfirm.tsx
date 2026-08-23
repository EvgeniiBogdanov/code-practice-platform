import { memo } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button, Modal } from "@/shared/ui";
import styles from "./StatsModal.module.css";

export interface StatsModalResetConfirmProps {
  isOpen: boolean;
  sectionName: string;
  onClose: () => void;
  onResetSection: () => void;
  onResetAll: () => void;
}

export const StatsModalResetConfirm = memo(
  ({ isOpen, sectionName, onClose, onResetSection, onResetAll }: StatsModalResetConfirmProps) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        title="Подтверждение сброса"
        icon={<AlertTriangle size={18} style={{ color: "var(--accent-red, #ef4444)" }} />}
      >
        <div className={styles.resetConfirmBody}>
          <p className={styles.resetConfirmText}>
            Вы действительно хотите сбросить график и интервалы повторений? Это действие необратимо.
          </p>

          <div className={styles.resetConfirmActions}>
            {sectionName !== "Вся платформа" && (
              <Button variant="danger" onClick={onResetSection}>
                <Trash2 size={14} />
                <span>Сбросить повторения раздела «{sectionName}»</span>
              </Button>
            )}

            <Button variant="danger" onClick={onResetAll}>
              <Trash2 size={14} />
              <span>Сбросить повторения всей платформы</span>
            </Button>

            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

StatsModalResetConfirm.displayName = "StatsModalResetConfirm";
