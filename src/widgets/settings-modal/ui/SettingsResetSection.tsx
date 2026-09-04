import { memo } from "react";
import { Button } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

export interface SettingsResetSectionProps {
  onOpenResetReviews: () => void;
  onOpenResetUI: () => void;
  onOpenResetAll: () => void;
}

export const SettingsResetSection = memo(
  ({
    onOpenResetReviews,
    onOpenResetUI,
    onOpenResetAll,
  }: SettingsResetSectionProps): React.JSX.Element => {
    return (
      <div className={styles.settingsSectionWrapper}>
        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Хранилище данных</h3>
          </div>

          <div className={styles.settingsRowList}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Локальное хранилище</div>
                <div className={styles.settingsRowDesc}>
                  Все решения и отметки чек-листов сохраняются в IndexedDB браузера.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <span className={styles.statusBadge}>
                  <span>IndexedDB</span>
                  <span className={styles.statusDot}>•</span>
                  <span className={styles.statusActive}>Активно</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Сброс параметров</h3>
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
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenResetReviews}
                >
                  Сбросить график
                </Button>
              </div>
            </div>

            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Настройки интерфейса</div>
                <div className={styles.settingsRowDesc}>
                  Сброс размеров панелей, масштаба шрифтов, режимов отображения списков и карточек, фильтров и раскрытых разделов.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenResetUI}
                >
                  Сбросить интерфейс
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Удаление данных</h3>
          </div>

          <div className={styles.settingsRowList}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsRowInfo}>
                <div className={styles.settingsRowTitle}>Удалить все данные платформы</div>
                <div className={styles.settingsRowDesc}>
                  Полный сброс всех решённых задач, написанного кода решений, истории повторений, настройки интерфейса.
                </div>
              </div>
              <div className={styles.settingsRowAction}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onOpenResetAll}
                >
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
