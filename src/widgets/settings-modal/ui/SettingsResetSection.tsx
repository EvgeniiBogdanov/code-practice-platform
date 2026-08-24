import { memo } from "react";
import { Button } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

export interface SettingsResetSectionProps {
  onOpenResetReviews: () => void;
  onOpenResetAll: () => void;
}

export const SettingsResetSection = memo(
  ({ onOpenResetReviews, onOpenResetAll }: SettingsResetSectionProps) => {
    return (
      <div className={styles.settingsSectionWrapper}>
        {/* Section 1: Storage & SM-2 */}
        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Прогресс и интервалы</h3>
            <p className={styles.sectionSubtitle}>
              Управление локальным прогрессом решений и графиком интервального повторения
            </p>
          </div>

          <div className={styles.settingsRowList}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Интервальное повторение (SM-2)</div>
                <div className={styles.settingsRowDesc}>
                  Сброс коэффициентов легкости, стадий и расписания повторений задач.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <Button variant="secondary" onClick={onOpenResetReviews}>
                  Сбросить график
                </Button>
              </div>
            </div>

            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Локальное хранилище</div>
                <div className={styles.settingsRowDesc}>
                  Все решения и отметки чек-листов сохраняются в IndexedDB браузера.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <span className={styles.statusBadge}>IndexedDB • Активно</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Danger Zone */}
        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitleDanger}>Опасная зона</h3>
            <p className={styles.sectionSubtitle}>
              Необратимые действия над локальной базой данных и всеми решениями
            </p>
          </div>

          <div className={styles.settingsRowList}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Удалить все данные платформы</div>
                <div className={styles.settingsRowDesc}>
                  Полный сброс всех решённых задач, написанного кода решений и истории повторений.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <Button variant="danger" onClick={onOpenResetAll}>
                  Сбросить всё
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);

SettingsResetSection.displayName = "SettingsResetSection";
