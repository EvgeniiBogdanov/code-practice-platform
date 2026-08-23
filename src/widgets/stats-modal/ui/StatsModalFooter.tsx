import { memo } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./StatsModal.module.css";

interface StatsModalFooterProps {
  onOpenResetConfirm: () => void;
}

export const StatsModalFooter = memo(({ onOpenResetConfirm }: StatsModalFooterProps) => {
  return (
    <div className={styles.statsModalFooter}>
      <button
        type="button"
        className={styles.statsResetBtn}
        onClick={onOpenResetConfirm}
        title="Сбросить интервалы и прогресс повторений"
      >
        <RotateCcw size={14} />
        <span>Сбросить график повторений</span>
      </button>
    </div>
  );
});

StatsModalFooter.displayName = "StatsModalFooter";
