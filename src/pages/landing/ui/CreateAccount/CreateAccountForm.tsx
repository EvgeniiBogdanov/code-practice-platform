import React, { useId, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { clsx } from "clsx";
import { ACCOUNT_NAME_MAX_LENGTH, getAccountNameError, useLocalAccountStore } from "@/shared/auth";
import { Button, Input } from "@/shared/ui";
import type { WorkspaceTarget } from "../../model/createAccountDialog";
import styles from "./CreateAccount.module.css";

const STORAGE_ERROR =
  "Браузер не дал сохранить профиль — проверь режим инкогнито или настройки хранилища";

export interface CreateAccountFormProps {
  /** Called once the account is stored; receives the workspace path to open. */
  onAccountCreated: (targetPath?: string) => void;
  target?: WorkspaceTarget | null;
  layout?: "stacked" | "inline";
  autoFocus?: boolean;
  /** Mirrors the typed name, e.g. into a live profile preview. */
  onNameChange?: (name: string) => void;
}

export const CreateAccountForm = ({
  onAccountCreated,
  target = null,
  layout = "stacked",
  autoFocus = false,
  onNameChange,
}: CreateAccountFormProps): React.JSX.Element => {
  const signIn = useLocalAccountStore((state) => state.signIn);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    onNameChange?.(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isEntering) return;

    const validationError = getAccountNameError(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      signIn(name);
    } catch {
      setError(STORAGE_ERROR);
      return;
    }

    setIsEntering(true);
    onAccountCreated(target?.path);
  };

  return (
    <form className={clsx(styles.form, styles[layout])} onSubmit={handleSubmit} noValidate>
      <label className={styles.label} htmlFor={inputId}>
        Как к тебе обращаться?
      </label>
      <div className={styles.controls}>
        <Input
          id={inputId}
          size="lg"
          value={name}
          placeholder="Введи имя"
          autoComplete="nickname"
          maxLength={ACCOUNT_NAME_MAX_LENGTH}
          autoFocus={autoFocus}
          readOnly={isEntering}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          containerClassName={styles.field}
          className={clsx(styles.input, error && styles.inputInvalid)}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="primary"
          size="xl"
          className={styles.submit}
          aria-busy={isEntering}
          rightIcon={
            isEntering ? (
              <LoaderCircle size={18} className={styles.spinner} />
            ) : (
              <ArrowRight size={18} />
            )
          }
        >
          {isEntering ? "Открываем платформу…" : "Создать локальный аккаунт"}
        </Button>
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {target && !error && (
        <p className={styles.target}>
          Сразу после входа откроется: <b>{target.label}</b>
        </p>
      )}
    </form>
  );
};
