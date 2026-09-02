import { memo } from "react";
import { RotateCcw } from "lucide-react";
import { Tooltip } from "@/shared/ui";
import styles from "./StatsModal.module.css";

interface StatsModalFooterProps {
  onOpenResetConfirm: () => void;
}

export const StatsModalFooter = memo(({ onOpenResetConfirm }: StatsModalFooterProps) => {
  return (
    <div className={styles.statsModalFooter}>
      <Tooltip content="Сбросить интервалы и прогресс повторений" side="top">
        <button
          type="button"
          className={styles.statsResetBtn}
          onClick={onOpenResetConfirm}
        >
          <RotateCcw size={14} />
          <span>Сбросить график повторений</span>
        </button>
      </Tooltip>
    </div>
  );
});

StatsModalFooter.displayName = "StatsModalFooter";
