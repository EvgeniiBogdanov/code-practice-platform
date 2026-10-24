import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SkillPanelState {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

/** The collapsed choice is a user preference: it applies to every skill and survives reloads. */
export const useSkillPanelStore = create<SkillPanelState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      setCollapsed: (isCollapsed): void => {
        set({ isCollapsed });
      },
    }),
    {
      name: "playground_skill_panel",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
