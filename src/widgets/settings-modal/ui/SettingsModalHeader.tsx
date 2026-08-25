import { memo } from "react";
import { Settings, X } from "lucide-react";
import { Tooltip, SquareButton } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

export interface SettingsModalHeaderProps {
  onClose: () => void;
}

export const SettingsModalHeader = memo(({ onClose }: SettingsModalHeaderProps) => {
  return (
    <div className={styles.settingsModalHeader}>
      <div className={styles.settingsModalTitle}>
        <Settings size={18} color="var(--accent-blue, #3b82f6)" />
        <span>Настройки</span>
      </div>
      <Tooltip content="Закрыть (Esc)" side="bottom">
        <SquareButton icon={<X size={18} />} onClick={onClose} aria-label="Закрыть" />
      </Tooltip>
    </div>
  );
});

SettingsModalHeader.displayName = "SettingsModalHeader";
