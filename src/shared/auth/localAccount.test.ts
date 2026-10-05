import { afterEach, describe, expect, it, vi } from "vitest";
import {
  LOCAL_ACCOUNT_STORAGE_KEY,
  clearLocalAccount,
  getAccountNameError,
  readLocalAccount,
  renameLocalAccount,
  saveLocalAccount,
  subscribeToLocalAccount,
} from "./localAccount";
import { syncLocalAccountStore, useLocalAccountStore } from "./localAccountStore";

describe("local account", () => {
  afterEach(() => {
    window.localStorage.clear();
    useLocalAccountStore.setState({ account: null });
  });

  it("validates account names", () => {
    expect(getAccountNameError("   ")).toMatch(/Введите имя/);
    expect(getAccountNameError("Я")).toBe("Минимум 2 символа");
    expect(getAccountNameError("a".repeat(33))).toBe("Максимум 32 символа");
    expect(getAccountNameError("<script>")).toMatch(/Только буквы/);
    expect(getAccountNameError("  Евгений   Б. ")).toBeNull();
    expect(getAccountNameError("Anna-Maria O'Neil")).toBeNull();
  });

  it("persists a normalized account and reads it back", () => {
    const account = saveLocalAccount("  Евгений   Б. ");

    expect(account.name).toBe("Евгений Б.");
    expect(readLocalAccount()).toEqual(account);
  });

  it("renames the account keeping its creation date", () => {
    const created = saveLocalAccount("Ада");
    const renamed = useLocalAccountStore.getState().rename("  Грейс  ");

    expect(renamed).toEqual({ name: "Грейс", createdAt: created.createdAt });
    expect(readLocalAccount()).toEqual(renamed);
    expect(useLocalAccountStore.getState().account).toEqual(renamed);
    expect(() => renameLocalAccount("")).toThrow(/Введите имя/);
    expect(readLocalAccount()).toEqual(renamed);
  });

  it("rejects invalid names without touching the storage", () => {
    expect(() => saveLocalAccount("")).toThrow(/Введите имя/);
    expect(window.localStorage.getItem(LOCAL_ACCOUNT_STORAGE_KEY)).toBeNull();
  });

  it("ignores corrupted or tampered storage values", () => {
    window.localStorage.setItem(LOCAL_ACCOUNT_STORAGE_KEY, "{not json");
    expect(readLocalAccount()).toBeNull();

    window.localStorage.setItem(
      LOCAL_ACCOUNT_STORAGE_KEY,
      JSON.stringify({ name: "<img onerror>", createdAt: 1 })
    );
    expect(readLocalAccount()).toBeNull();
  });

  it("clears the account", () => {
    saveLocalAccount("Ада");
    clearLocalAccount();

    expect(readLocalAccount()).toBeNull();
  });

  it("notifies about changes made in another tab", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToLocalAccount(listener);

    saveLocalAccount("Ада");
    window.dispatchEvent(new StorageEvent("storage", { key: LOCAL_ACCOUNT_STORAGE_KEY }));
    window.dispatchEvent(new StorageEvent("storage", { key: "unrelated_key" }));
    unsubscribe();
    window.dispatchEvent(new StorageEvent("storage", { key: LOCAL_ACCOUNT_STORAGE_KEY }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ name: "Ада" }));
  });

  it("re-reads a stale store and follows other tabs", () => {
    saveLocalAccount("Грейс");
    expect(useLocalAccountStore.getState().account).toBeNull();

    const stopSync = syncLocalAccountStore();
    expect(useLocalAccountStore.getState().account?.name).toBe("Грейс");

    clearLocalAccount();
    window.dispatchEvent(new StorageEvent("storage", { key: LOCAL_ACCOUNT_STORAGE_KEY }));
    expect(useLocalAccountStore.getState().account).toBeNull();
    stopSync();
  });

  it("signs in and out through the store", () => {
    const { signIn, signOut } = useLocalAccountStore.getState();

    signIn("Линус");
    expect(useLocalAccountStore.getState().account?.name).toBe("Линус");
    expect(readLocalAccount()?.name).toBe("Линус");

    signOut();
    expect(useLocalAccountStore.getState().account).toBeNull();
    expect(readLocalAccount()).toBeNull();
  });
});
