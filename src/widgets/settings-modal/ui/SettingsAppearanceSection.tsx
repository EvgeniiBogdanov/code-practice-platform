import type { JSX } from "react";
import { useUIStore, type ThemePreference } from "@/entities/ui-state";
import { UiSegmentedControl } from "@/shared/ui";
import styles from "./SettingsAppearanceSection.module.css";

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Системная" },
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
];

export const SettingsAppearanceSection = (): JSX.Element => {
  const themePreference = useUIStore((state) => state.themePreference);
  const setThemePreference = useUIStore((state) => state.setThemePreference);

  return (
    <section className={styles.section} aria-labelledby="appearance-heading">
      <h3 id="appearance-heading" className={styles.heading}>
        Внешний вид
      </h3>
      <div className={styles.row}>
        <div className={styles.info}>
          <span className={styles.label}>Тема оформления</span>
          <p id="settings-theme-description" className={styles.description}>
            Системная тема подстраивается под настройки вашего устройства
          </p>
        </div>
        <UiSegmentedControl
          label="Тема оформления"
          descriptionId="settings-theme-description"
          value={themePreference}
          options={THEME_OPTIONS}
          onChange={setThemePreference}
        />
      </div>
    </section>
  );
};
