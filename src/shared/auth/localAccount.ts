/**
 * Local account: the platform has no backend, so "signing in" means remembering the learner's
 * name in this browser. Progress itself lives in IndexedDB and is not bound to the account.
 */
export interface LocalAccount {
  name: string;
  createdAt: number;
}

export const LOCAL_ACCOUNT_STORAGE_KEY = "code_practice_local_account";
export const ACCOUNT_NAME_MIN_LENGTH = 2;
export const ACCOUNT_NAME_MAX_LENGTH = 32;

const ACCOUNT_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .'’_-]*$/u;

export const normalizeAccountName = (rawName: string): string =>
  rawName.replace(/\s+/g, " ").trim();

/** Returns a user-facing validation message or `null` when the name is acceptable. */
export const getAccountNameError = (rawName: string): string | null => {
  const name = normalizeAccountName(rawName);
  const length = [...name].length;

  if (length === 0) return "Введите имя — так платформа будет к тебе обращаться";
  if (length < ACCOUNT_NAME_MIN_LENGTH) return `Минимум ${ACCOUNT_NAME_MIN_LENGTH} символа`;
  if (length > ACCOUNT_NAME_MAX_LENGTH) return `Максимум ${ACCOUNT_NAME_MAX_LENGTH} символа`;
  if (!ACCOUNT_NAME_PATTERN.test(name)) return "Только буквы, цифры, пробел, точка и дефис";
  return null;
};

const isLocalAccount = (value: unknown): value is LocalAccount =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  typeof value.name === "string" &&
  getAccountNameError(value.name) === null &&
  "createdAt" in value &&
  typeof value.createdAt === "number" &&
  Number.isFinite(value.createdAt);

export const readLocalAccount = (): LocalAccount | null => {
  try {
    const raw = window.localStorage.getItem(LOCAL_ACCOUNT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isLocalAccount(parsed)
      ? { name: normalizeAccountName(parsed.name), createdAt: parsed.createdAt }
      : null;
  } catch {
    return null;
  }
};

/** Persists the account. Throws when the name is invalid or the storage is unavailable. */
export const saveLocalAccount = (rawName: string): LocalAccount => {
  const error = getAccountNameError(rawName);
  if (error) throw new Error(error);

  const account: LocalAccount = { name: normalizeAccountName(rawName), createdAt: Date.now() };
  window.localStorage.setItem(LOCAL_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
};

/** Changes the name of the stored account, keeping its creation date. */
export const renameLocalAccount = (rawName: string): LocalAccount => {
  const error = getAccountNameError(rawName);
  if (error) throw new Error(error);

  const current = readLocalAccount();
  const account: LocalAccount = {
    name: normalizeAccountName(rawName),
    createdAt: current?.createdAt ?? Date.now(),
  };
  window.localStorage.setItem(LOCAL_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  return account;
};

export const clearLocalAccount = (): void => {
  try {
    window.localStorage.removeItem(LOCAL_ACCOUNT_STORAGE_KEY);
  } catch {
    // Storage is unavailable: there is nothing to clear.
  }
};

/**
 * Notifies about account changes made outside the current document: other tabs (`storage`)
 * and pages restored from the back/forward cache (`pageshow`).
 */
export const subscribeToLocalAccount = (
  listener: (account: LocalAccount | null) => void
): (() => void) => {
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === null || event.key === LOCAL_ACCOUNT_STORAGE_KEY) {
      listener(readLocalAccount());
    }
  };
  const handlePageShow = (event: PageTransitionEvent): void => {
    if (event.persisted) listener(readLocalAccount());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("pageshow", handlePageShow);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("pageshow", handlePageShow);
  };
};
