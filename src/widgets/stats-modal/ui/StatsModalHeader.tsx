import React, { memo } from "react";
import { X } from "lucide-react";
import { Tooltip, SquareButton } from "@/shared/ui";
import styles from "./StatsModal.module.css";

interface StatsModalHeaderProps {
  icon?: React.ReactNode;
  title: string;
  onClose: () => void;
}

export const StatsModalHeader = memo(({ icon, title, onClose }: StatsModalHeaderProps) => {
  return (
    <div className={styles.statsModalHeader}>
      <div className={styles.statsModalTitle}>
        {icon && <span className={styles.statsModalHeaderIcon}>{icon}</span>}
        <span>{title}</span>
      </div>
      <Tooltip content="Закрыть (Esc)" side="bottom">
        <SquareButton icon={<X size={18} />} onClick={onClose} aria-label="Закрыть" />
      </Tooltip>
    </div>
  );
});

StatsModalHeader.displayName = "StatsModalHeader";
