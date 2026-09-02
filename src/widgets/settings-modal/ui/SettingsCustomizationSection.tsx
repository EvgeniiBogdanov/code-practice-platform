import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Input } from "@/shared/ui";
import { useReviewStore, DEFAULT_ASSISTANT_NAME } from "@/entities/review";
import styles from "./SettingsCustomizationSection.module.css";

const MAX_ASSISTANT_NAME_LENGTH = 30;

export const SettingsCustomizationSection = memo((): React.JSX.Element => {
  const assistantName = useReviewStore((state) => state.assistantName) || DEFAULT_ASSISTANT_NAME;
  const setAssistantName = useReviewStore((state) => state.setAssistantName);
  const resetAssistantName = useReviewStore((state) => state.resetAssistantName);

  const isDefaultName = assistantName === DEFAULT_ASSISTANT_NAME;
  const [inputValue, setInputValue] = useState(isDefaultName ? "" : assistantName);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setInputValue(assistantName === DEFAULT_ASSISTANT_NAME ? "" : assistantName);
  }, [assistantName]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= MAX_ASSISTANT_NAME_LENGTH) {
      setInputValue(value);
      setIsSaved(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      const nextName = trimmed || DEFAULT_ASSISTANT_NAME;
      await setAssistantName(nextName);
      setInputValue(nextName === DEFAULT_ASSISTANT_NAME ? "" : nextName);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    },
    [inputValue, setAssistantName]
  );

  const handleReset = useCallback(async (): Promise<void> => {
    await resetAssistantName();
    setInputValue("");
    setIsSaved(false);
  }, [resetAssistantName]);

  const currentDisplayCustomName = assistantName === DEFAULT_ASSISTANT_NAME ? "" : assistantName;
  const isModified = inputValue.trim() !== currentDisplayCustomName;
  const canReset = assistantName !== DEFAULT_ASSISTANT_NAME || inputValue.trim().length > 0;

  return (
    <div className={styles.settingsSectionWrapper}>
      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Персонализация помощника</h3>
          <p className={styles.sectionSubtitle}>
            Настройте имя или прозвище интервального помощника под себя
          </p>
        </div>

        <div className={styles.settingsRowList}>
          <div className={styles.customizationRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>Имя интервального помощника</div>
              <div className={styles.rowDesc}>
                Задайте собственное имя для помощника. Оно будет отображаться в карточке задачи над
                мотивационными сообщениями.
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <Input
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Имя"
                    maxLength={MAX_ASSISTANT_NAME_LENGTH}
                    className={styles.nameInput}
                    aria-label="Имя интервального помощника"
                  />
                  <span className={styles.charCounter} aria-live="polite">
                    {inputValue.length}/{MAX_ASSISTANT_NAME_LENGTH}
                  </span>
                </div>

                <div className={styles.buttonGroup}>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={!isModified}
                    className={styles.actionBtn}
                  >
                    {isSaved ? "Сохранено" : "Сохранить"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleReset}
                    disabled={!canReset}
                    className={styles.actionBtn}
                  >
                    Сбросить
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
});

SettingsCustomizationSection.displayName = "SettingsCustomizationSection";
