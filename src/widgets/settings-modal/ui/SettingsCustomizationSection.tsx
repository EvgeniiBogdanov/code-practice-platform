import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Input, Switch } from "@/shared/ui";
import { useReviewStore, DEFAULT_ASSISTANT_NAME } from "@/entities/review";
import { useUIStore } from "@/entities/ui-state";
import { sanitizeAssistantName, ASSISTANT_NAME_INPUT_PATTERN } from "../lib";
import styles from "./SettingsCustomizationSection.module.css";

const MAX_ASSISTANT_NAME_LENGTH = 30;

const TooltipSettingsSection = memo((): React.JSX.Element => {
  const hideTooltips = useUIStore((state) => state.hideTooltips);
  const setHideTooltips = useUIStore((state) => state.setHideTooltips);

  return (
    <section className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Интерфейс</h3>
      </div>

      <div className={styles.settingsRowList}>
        <div className={styles.settingsRow}>
          <div className={styles.rowInfo}>
            <div className={styles.rowTitle}>Убрать подсказки</div>
            <div className={styles.rowDesc}>
              Отключает всплывающие подсказки при наведении курсора на кнопки, элементы управления и
              код в редакторе
            </div>
          </div>

          <div className={styles.switchAction}>
            <Switch
              checked={hideTooltips}
              onChange={setHideTooltips}
              aria-label="Убрать подсказки"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

TooltipSettingsSection.displayName = "TooltipSettingsSection";

export const SettingsCustomizationSection = memo((): React.JSX.Element => {
  const assistantName = useReviewStore((state) => state.assistantName) || DEFAULT_ASSISTANT_NAME;
  const setAssistantName = useReviewStore((state) => state.setAssistantName);
  const resetAssistantName = useReviewStore((state) => state.resetAssistantName);
  const hideInteractiveAssistant = useUIStore((state) => state.hideInteractiveAssistant);
  const setHideInteractiveAssistant = useUIStore((state) => state.setHideInteractiveAssistant);

  const isDefaultName = assistantName === DEFAULT_ASSISTANT_NAME;
  const [inputValue, setInputValue] = useState(isDefaultName ? "" : assistantName);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setInputValue(assistantName === DEFAULT_ASSISTANT_NAME ? "" : assistantName);
  }, [assistantName]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const sanitized = sanitizeAssistantName(e.target.value, MAX_ASSISTANT_NAME_LENGTH);
    setInputValue(sanitized);
    setIsSaved(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      const sanitized = sanitizeAssistantName(inputValue, MAX_ASSISTANT_NAME_LENGTH).trim();
      const nextName = sanitized || DEFAULT_ASSISTANT_NAME;
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
      <TooltipSettingsSection />

      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Персонализация помощника</h3>
        </div>

        <div className={styles.settingsRowList}>
          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>Имя интервального помощника</div>
              <div className={styles.rowDesc}>Отображается в карточке задачи над сообщениями</div>
            </div>

            <div className={styles.customizationAction}>
              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.inputGroup}>
                  <Input
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Имя"
                    size="sm"
                    maxLength={MAX_ASSISTANT_NAME_LENGTH}
                    pattern={ASSISTANT_NAME_INPUT_PATTERN}
                    title="Разрешены буквы, цифры, пробел, дефис, подчёркивание и точка"
                    containerClassName={styles.nameInputContainer}
                    aria-label="Имя интервального помощника"
                    rightIcon={
                      <span className={styles.charCounter} aria-live="polite">
                        {inputValue.length}/{MAX_ASSISTANT_NAME_LENGTH}
                      </span>
                    }
                  />

                  <div className={styles.buttonGroup}>
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      disabled={!isModified}
                      className={styles.saveBtn}
                    >
                      {isSaved ? "Сохранено" : "Сохранить"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleReset}
                      disabled={!canReset}
                    >
                      Сбросить
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className={styles.settingsRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowTitle}>Отключить интерактивного помощника</div>
              <div className={styles.rowDesc}>Скрывает сообщения помощника в карточке задачи</div>
            </div>

            <div className={styles.switchAction}>
              <Switch
                checked={hideInteractiveAssistant}
                onChange={setHideInteractiveAssistant}
                aria-label="Отключить интерактивного помощника"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

SettingsCustomizationSection.displayName = "SettingsCustomizationSection";
