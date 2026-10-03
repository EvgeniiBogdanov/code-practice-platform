import { memo, useId, useState } from "react";
import { ACCOUNT_NAME_MAX_LENGTH, getAccountNameError, useLocalAccountStore } from "@/shared/auth";
import { Button, Input } from "@/shared/ui";
import styles from "./SettingsModal.module.css";

const STORAGE_ERROR = "Браузер не дал сохранить имя — проверьте настройки хранилища";

export interface SettingsAccountSectionProps {
  accountName: string;
}

export const SettingsAccountSection = memo(
  ({ accountName }: SettingsAccountSectionProps): React.JSX.Element => {
    const rename = useLocalAccountStore((state) => state.rename);
    const [name, setName] = useState(accountName);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const inputId = useId();
    const errorId = useId();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const validationError = getAccountNameError(name);
      if (validationError) {
        setError(validationError);
        return;
      }
      try {
        const account = rename(name);
        setName(account.name);
        setError(null);
        setIsSaved(true);
      } catch {
        setError(STORAGE_ERROR);
      }
    };

    return (
      <div className={styles.settingsSectionWrapper}>
        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Профиль</h3>
          </div>

          <form className={styles.accountForm} onSubmit={handleSubmit} noValidate>
            <div className={styles.accountControls}>
              <label className={styles.settingsRowTitle} htmlFor={inputId}>
                Имя
              </label>

              <Input
                id={inputId}
                value={name}
                maxLength={ACCOUNT_NAME_MAX_LENGTH}
                autoComplete="nickname"
                aria-invalid={error !== null}
                aria-describedby={error ? errorId : undefined}
                containerClassName={styles.accountField}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                  setIsSaved(false);
                }}
              />
              <Button type="submit" variant="primary" size="sm" disabled={name === accountName}>
                Сохранить
              </Button>
            </div>
            {error && (
              <p id={errorId} className={styles.accountError} role="alert">
                {error}
              </p>
            )}
            {isSaved && !error && <p className={styles.accountSaved}>Имя обновлено</p>}
          </form>
        </section>
      </div>
    );
  }
);

SettingsAccountSection.displayName = "SettingsAccountSection";
