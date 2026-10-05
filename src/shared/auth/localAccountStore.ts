import { create } from "zustand";
import {
  clearLocalAccount,
  readLocalAccount,
  renameLocalAccount,
  saveLocalAccount,
  subscribeToLocalAccount,
  type LocalAccount,
} from "./localAccount";

interface LocalAccountState {
  account: LocalAccount | null;
  signIn: (name: string) => LocalAccount;
  rename: (name: string) => LocalAccount;
  signOut: () => void;
}

export const useLocalAccountStore = create<LocalAccountState>()((set) => ({
  account: readLocalAccount(),
  signIn: (name) => {
    const account = saveLocalAccount(name);
    set({ account });
    return account;
  },
  rename: (name) => {
    const account = renameLocalAccount(name);
    set({ account });
    return account;
  },
  signOut: () => {
    clearLocalAccount();
    set({ account: null });
  },
}));

/**
 * Re-reads the account now (the store may have been created earlier, e.g. on the landing)
 * and keeps it in sync with other tabs and bfcache restores. Returns an unsubscribe fn.
 */
export const syncLocalAccountStore = (): (() => void) => {
  useLocalAccountStore.setState({ account: readLocalAccount() });
  return subscribeToLocalAccount((account) => useLocalAccountStore.setState({ account }));
};
