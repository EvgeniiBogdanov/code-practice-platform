import { create } from "zustand";

/** Workspace screen to open right after sign-up (e.g. a task picked in the palette demo). */
export interface WorkspaceTarget {
  path: string;
  label: string;
}

interface CreateAccountDialogState {
  isOpen: boolean;
  target: WorkspaceTarget | null;
  open: (target?: WorkspaceTarget) => void;
  close: () => void;
}

export const useCreateAccountDialog = create<CreateAccountDialogState>()((set) => ({
  isOpen: false,
  target: null,
  open: (target) => set({ isOpen: true, target: target ?? null }),
  close: () => set({ isOpen: false, target: null }),
}));
