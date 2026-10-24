import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SkillFilter } from "@/features/skill-map";
import type { SkillMapView } from "./skillsSearch";

const FILTERS: readonly SkillFilter[] = ["all", "weak", "fading", "new"];
const VIEWS: readonly SkillMapView[] = ["graph", "list"];

const isFilter = (value: unknown): value is SkillFilter =>
  FILTERS.some((filter) => filter === value);
const isView = (value: unknown): value is SkillMapView => VIEWS.some((view) => view === value);

interface SkillMapPrefsState {
  filter: SkillFilter;
  /** The view picked last; null until one is picked, so the screen width decides the default. */
  view: SkillMapView | null;
  setFilter: (filter: SkillFilter) => void;
  setView: (view: SkillMapView) => void;
}

/** The filter and the view are the user's choice: they apply to every skill map and survive reloads. */
export const useSkillMapPrefsStore = create<SkillMapPrefsState>()(
  persist(
    (set) => ({
      filter: "all",
      view: null,
      setFilter: (filter): void => {
        set({ filter });
      },
      setView: (view): void => {
        set({ view });
      },
    }),
    {
      name: "playground_skill_map",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ filter: state.filter, view: state.view }),
      // A malformed or outdated value falls back to the default instead of breaking the page.
      merge: (persisted, current) => {
        const saved = typeof persisted === "object" && persisted !== null ? persisted : {};
        const filter = "filter" in saved && isFilter(saved.filter) ? saved.filter : current.filter;
        const view = "view" in saved && isView(saved.view) ? saved.view : current.view;
        return { ...current, filter, view };
      },
    }
  )
);
