import React, { memo } from "react";
import { Switch, ZoomControls } from "@/shared/ui";
import { useUIStore, MIN_FONT_SIZE, MAX_FONT_SIZE } from "@/entities/ui-state";
import { SettingsHotkeysList } from "./SettingsHotkeysList";
import styles from "./SettingsCustomizationSection.module.css";

const DEFAULT_FONT_SIZE = 14;

interface SwitchRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchRow = ({
  title,
  description,
  checked,
  onChange,
}: SwitchRowProps): React.JSX.Element => (
  <div className={styles.settingsRow}>
    <div className={styles.rowInfo}>
      <div className={styles.rowTitle}>{title}</div>
      <div className={styles.rowDesc}>{description}</div>
    </div>
    <div className={styles.switchAction}>
      <Switch checked={checked} onChange={onChange} aria-label={title} />
    </div>
  </div>
);

/** App-wide editor preferences; the editor toolbar keeps quick toggles for the same values. */
export const SettingsEditorSection = memo((): React.JSX.Element => {
  const fontSize = useUIStore((state) => state.editorFontSize);
  const setFontSize = useUIStore((state) => state.setEditorFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseEditorFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseEditorFontSize);
  const wordWrap = useUIStore((state) => state.editorWordWrap);
  const setWordWrap = useUIStore((state) => state.setEditorWordWrap);
  const linterEnabled = useUIStore((state) => state.editorLinterEnabled);
  const setLinterEnabled = useUIStore((state) => state.setEditorLinterEnabled);
  const parameterHintsOnType = useUIStore((state) => state.editorParameterHintsOnType);
  const setParameterHintsOnType = useUIStore((state) => state.setEditorParameterHintsOnType);

  return (
    <div className={styles.settingsSectionWrapper}>
      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Отображение</h3>
        </div>
        <div className={styles.settingsRowList}>
          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>Размер шрифта</div>
              <div className={styles.rowDesc}>Размер кода во всех редакторах приложения</div>
            </div>
            <ZoomControls
              value={fontSize}
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              defaultValue={DEFAULT_FONT_SIZE}
              displayValue={`${fontSize}px`}
              valueLabel={`Размер шрифта: ${fontSize}px`}
              decreaseLabel="Уменьшить шрифт"
              increaseLabel="Увеличить шрифт"
              resetLabel={`Сбросить до ${DEFAULT_FONT_SIZE}px`}
              onDecrease={decreaseFontSize}
              onIncrease={increaseFontSize}
              onReset={() => setFontSize(DEFAULT_FONT_SIZE)}
            />
          </div>
          <SwitchRow
            title="Перенос строк"
            description="Длинные строки переносятся по ширине редактора вместо горизонтальной прокрутки (Alt+Z)"
            checked={wordWrap}
            onChange={setWordWrap}
          />
        </div>
      </section>

      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Подсказки и проверка</h3>
        </div>
        <div className={styles.settingsRowList}>
          <SwitchRow
            title="Проверка ошибок"
            description="Подчёркивает синтаксические ошибки и ошибки типов прямо в коде"
            checked={linterEnabled}
            onChange={setLinterEnabled}
          />
          <SwitchRow
            title="Подсказка параметров при наборе"
            description="Показывает сигнатуру функции после ввода «(» и «,». Когда выключено, подсказка открывается только по Ctrl/Cmd+Shift+Space"
            checked={parameterHintsOnType}
            onChange={setParameterHintsOnType}
          />
        </div>
      </section>

      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Горячие клавиши</h3>
        </div>
        <SettingsHotkeysList />
      </section>
    </div>
  );
});

SettingsEditorSection.displayName = "SettingsEditorSection";
