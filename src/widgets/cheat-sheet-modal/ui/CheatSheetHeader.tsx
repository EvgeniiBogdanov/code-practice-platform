import { memo } from "react";
import { Lightbulb, X } from "lucide-react";
import { Tooltip, SquareButton } from "@/shared/ui";
import styles from "./CheatSheetModal.module.css";

interface CheatSheetHeaderProps {
  title: string;
  onClose: () => void;
}

export const CheatSheetHeader = memo(({ title, onClose }: CheatSheetHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <Lightbulb size={18} className={styles.titleIcon} />
        <span>{title}</span>
      </div>
      <Tooltip content="Закрыть (Esc)" side="bottom">
        <SquareButton icon={<X size={18} />} onClick={onClose} aria-label="Закрыть шпаргалку" />
      </Tooltip>
    </div>
  );
});

CheatSheetHeader.displayName = "CheatSheetHeader";
