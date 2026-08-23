import { memo } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

export interface SettingsResetSectionProps {
  onOpenResetReviews: () => void;
  onOpenResetAll: () => void;
}

export const SettingsResetSection = memo(
  ({ onOpenResetReviews, onOpenResetAll }: SettingsResetSectionProps) => {
    return (
      <div className={styles.settingsModalBody}>
        {/* Card 1: Spaced Repetition Schedule */}
        <div className={styles.settingCard}>
          <div className={styles.settingCardHeader}>
            <div className={styles.settingCardInfo}>
              <h4 className={styles.settingCardTitle}>Интервальное повторение (SM-2)</h4>
              <p className={styles.settingCardDesc}>
                Сброс стадий запоминания, интервалов и расписания повторений задач.
              </p>
            </div>
          </div>
          <div className={styles.settingCardFooter}>
            <Button variant="secondary" onClick={onOpenResetReviews}>
              <RotateCcw size={14} />
              <span>Сбросить график повторений</span>
            </Button>
          </div>
        </div>

        {/* Card 2: Full Progress & Solutions */}
        <div className={styles.settingCard}>
          <div className={styles.settingCardHeader}>
            <div className={styles.settingCardInfo}>
              <h4 className={styles.settingCardTitle}>Прогресс и решения платформы</h4>
              <p className={styles.settingCardDesc}>
                Полная очистка статусов решённых задач, сохранённого кода решений в IndexedDB и
                чек-листов.
              </p>
            </div>
          </div>
          <div className={styles.settingCardFooter}>
            <Button variant="danger" onClick={onOpenResetAll}>
              <Trash2 size={14} />
              <span>Сбросить всю статистику и решения</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

SettingsResetSection.displayName = "SettingsResetSection";
