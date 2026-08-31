import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UIState, ThemeMode } from "../types";

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 24;

const getInitialUISettings = () => {
  if (typeof window === "undefined") {
    return {
      theme: "dark" as ThemeMode,
      sidebarOpen: true,
      sidebarWidth: 280,
      consoleCollapsed: true,
      editorWordWrap: false,
      editorSplitRatio: 70,
    };
  }
  try {
    const raw = localStorage.getItem("playground_ui_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state) {
        return {
          theme: (parsed.state.theme === "light" || parsed.state.theme === "dark"
            ? parsed.state.theme
            : "dark") as ThemeMode,
          sidebarOpen:
            typeof parsed.state.sidebarOpen === "boolean" ? parsed.state.sidebarOpen : true,
          sidebarWidth:
            typeof parsed.state.sidebarWidth === "number" &&
            parsed.state.sidebarWidth >= 200 &&
            parsed.state.sidebarWidth <= 480
              ? parsed.state.sidebarWidth
              : 280,
          consoleCollapsed:
            typeof parsed.state.consoleCollapsed === "boolean"
              ? parsed.state.consoleCollapsed
              : true,
          editorWordWrap:
            typeof parsed.state.editorWordWrap === "boolean"
              ? parsed.state.editorWordWrap
              : false,
          editorSplitRatio:
            typeof parsed.state.editorSplitRatio === "number" &&
            parsed.state.editorSplitRatio >= 20 &&
            parsed.state.editorSplitRatio <= 80
              ? parsed.state.editorSplitRatio
              : 70,
        };
      }
    }
    const legacy = localStorage.getItem("playground_theme");
    const legacyConsole = localStorage.getItem("playground_console_collapsed");
    return {
      theme: (legacy === "light" || legacy === "dark" ? legacy : "dark") as ThemeMode,
      sidebarOpen: true,
      sidebarWidth: 280,
      consoleCollapsed: legacyConsole !== null ? legacyConsole === "true" : true,
      editorWordWrap: false,
      editorSplitRatio: 70,
    };
  } catch {
    // ignore
  }
  return {
    theme: "dark" as ThemeMode,
    sidebarOpen: true,
    sidebarWidth: 280,
    consoleCollapsed: true,
    editorWordWrap: false,
    editorSplitRatio: 70,
  };
};

const initialUI = getInitialUISettings();
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", initialUI.theme);
  document.documentElement.style.setProperty("--sidebar-width", `${initialUI.sidebarWidth}px`);
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: initialUI.theme,
      sidebarOpen: initialUI.sidebarOpen,
      sidebarWidth: initialUI.sidebarWidth,
      editorFontSize: 14,
      editorWordWrap: initialUI.editorWordWrap,
      editorSplitRatio: initialUI.editorSplitRatio,
      consoleFontSize: 14,
      consoleCollapsed: true,

      statsModalOpen: false,
      settingsModalOpen: false,
      cheatSheetOpen: false,
      cheatCategory: "hooks",
      cheatSearch: "",
      paletteOpen: false,
      paletteQuery: "",
      resetConfirmOpen: false,

      sectionDropdownOpen: false,
      headerSectionDropdownOpen: false,
      categoryDropdownOpen: false,
      taskDropdownOpen: false,
      jsDropdownOpen: false,
      algoDropdownOpen: false,

      warmupExpanded: false,
      refactoringExpanded: false,
      tasksExpanded: false,
      advancedExpanded: false,
      reactTsExpanded: false,
      reactTsPracticeExpanded: false,

      expandedJsGroups: {},
      expandedJsSubgroups: {},
      expandedAlgoGroups: {},
      expandedAlgoSubgroups: {},

      tooltip: null,

      setTheme: (themeOrFn) => {
        const current = get().theme || "dark";
        const nextTheme = typeof themeOrFn === "function" ? themeOrFn(current) : themeOrFn;
        const validTheme: ThemeMode = nextTheme === "light" ? "light" : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", validTheme);
        }
        set({ theme: validTheme });
      },
      toggleTheme: () => {
        const current = get().theme || "dark";
        const nextTheme: ThemeMode = current === "dark" ? "light" : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", nextTheme);
        }
        set({ theme: nextTheme });
      },

      setSidebarOpen: (sidebarOpen) =>
        set((state) => ({
          sidebarOpen:
            typeof sidebarOpen === "function" ? sidebarOpen(state.sidebarOpen) : sidebarOpen,
        })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

      setEditorFontSize: (size) => {
        const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
        set({ editorFontSize: clamped });
      },
      increaseEditorFontSize: () => {
        set((state) => ({
          editorFontSize: Math.min(MAX_FONT_SIZE, (state.editorFontSize || MIN_FONT_SIZE) + 1),
        }));
      },
      decreaseEditorFontSize: () => {
        set((state) => ({
          editorFontSize: Math.max(MIN_FONT_SIZE, (state.editorFontSize || MIN_FONT_SIZE) - 1),
        }));
      },
      increaseFontSize: () => {
        set((state) => ({
          editorFontSize: Math.min(MAX_FONT_SIZE, (state.editorFontSize || MIN_FONT_SIZE) + 1),
        }));
      },
      decreaseFontSize: () => {
        set((state) => ({
          editorFontSize: Math.max(MIN_FONT_SIZE, (state.editorFontSize || MIN_FONT_SIZE) - 1),
        }));
      },

      setEditorWordWrap: (editorWordWrap) =>
        set((state) => ({
          editorWordWrap:
            typeof editorWordWrap === "function"
              ? editorWordWrap(state.editorWordWrap)
              : editorWordWrap,
        })),
      toggleEditorWordWrap: () =>
        set((state) => ({ editorWordWrap: !state.editorWordWrap })),

      setEditorSplitRatio: (ratio) =>
        set({ editorSplitRatio: Math.min(80, Math.max(20, ratio)) }),
      resetEditorSplitRatio: () => set({ editorSplitRatio: 70 }),

      setConsoleFontSize: (size) => {
        const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
        set({ consoleFontSize: clamped });
      },
      increaseConsoleFontSize: () => {
        set((state) => ({
          consoleFontSize: Math.min(MAX_FONT_SIZE, (state.consoleFontSize || MIN_FONT_SIZE) + 1),
        }));
      },
      decreaseConsoleFontSize: () => {
        set((state) => ({
          consoleFontSize: Math.max(MIN_FONT_SIZE, (state.consoleFontSize || MIN_FONT_SIZE) - 1),
        }));
      },

      setConsoleCollapsed: (consoleCollapsed) =>
        set((state) => {
          const next =
            typeof consoleCollapsed === "function"
              ? consoleCollapsed(state.consoleCollapsed)
              : consoleCollapsed;
          try {
            localStorage.setItem("playground_console_collapsed", String(next));
          } catch {
            // ignore
          }
          return { consoleCollapsed: next };
        }),
      toggleConsoleCollapsed: () =>
        set((state) => {
          const next = !state.consoleCollapsed;
          try {
            localStorage.setItem("playground_console_collapsed", String(next));
          } catch {
            // ignore
          }
          return { consoleCollapsed: next };
        }),

      setStatsModalOpen: (statsModalOpen) =>
        set((state) => ({
          statsModalOpen:
            typeof statsModalOpen === "function"
              ? statsModalOpen(state.statsModalOpen)
              : statsModalOpen,
        })),
      setSettingsModalOpen: (settingsModalOpen) =>
        set((state) => ({
          settingsModalOpen:
            typeof settingsModalOpen === "function"
              ? settingsModalOpen(state.settingsModalOpen)
              : settingsModalOpen,
        })),
      setCheatSheetOpen: (cheatSheetOpen) =>
        set((state) => ({
          cheatSheetOpen:
            typeof cheatSheetOpen === "function"
              ? cheatSheetOpen(state.cheatSheetOpen)
              : cheatSheetOpen,
        })),
      setCheatCategory: (cheatCategory) => set({ cheatCategory }),
      setCheatSearch: (cheatSearch) => set({ cheatSearch }),
      setPaletteOpen: (paletteOpen) =>
        set((state) => ({
          paletteOpen:
            typeof paletteOpen === "function" ? paletteOpen(state.paletteOpen) : paletteOpen,
        })),
      setPaletteQuery: (paletteQuery) => set({ paletteQuery }),
      setResetConfirmOpen: (resetConfirmOpen) =>
        set((state) => ({
          resetConfirmOpen:
            typeof resetConfirmOpen === "function"
              ? resetConfirmOpen(state.resetConfirmOpen)
              : resetConfirmOpen,
        })),
      closeAllModals: () =>
        set({
          statsModalOpen: false,
          settingsModalOpen: false,
          cheatSheetOpen: false,
          paletteOpen: false,
          resetConfirmOpen: false,
          paletteQuery: "",
        }),

      setSectionDropdownOpen: (sectionDropdownOpen) =>
        set((state) => ({
          sectionDropdownOpen:
            typeof sectionDropdownOpen === "function"
              ? sectionDropdownOpen(state.sectionDropdownOpen)
              : sectionDropdownOpen,
        })),
      setHeaderSectionDropdownOpen: (headerSectionDropdownOpen) =>
        set((state) => ({
          headerSectionDropdownOpen:
            typeof headerSectionDropdownOpen === "function"
              ? headerSectionDropdownOpen(state.headerSectionDropdownOpen)
              : headerSectionDropdownOpen,
        })),
      setCategoryDropdownOpen: (categoryDropdownOpen) =>
        set((state) => ({
          categoryDropdownOpen:
            typeof categoryDropdownOpen === "function"
              ? categoryDropdownOpen(state.categoryDropdownOpen)
              : categoryDropdownOpen,
        })),
      setTaskDropdownOpen: (taskDropdownOpen) =>
        set((state) => ({
          taskDropdownOpen:
            typeof taskDropdownOpen === "function"
              ? taskDropdownOpen(state.taskDropdownOpen)
              : taskDropdownOpen,
        })),
      setJsDropdownOpen: (jsDropdownOpen) =>
        set((state) => ({
          jsDropdownOpen:
            typeof jsDropdownOpen === "function"
              ? jsDropdownOpen(state.jsDropdownOpen)
              : jsDropdownOpen,
        })),
      setAlgoDropdownOpen: (algoDropdownOpen) =>
        set((state) => ({
          algoDropdownOpen:
            typeof algoDropdownOpen === "function"
              ? algoDropdownOpen(state.algoDropdownOpen)
              : algoDropdownOpen,
        })),
      closeAllDropdowns: () =>
        set({
          sectionDropdownOpen: false,
          headerSectionDropdownOpen: false,
          categoryDropdownOpen: false,
          taskDropdownOpen: false,
          jsDropdownOpen: false,
          algoDropdownOpen: false,
        }),

      setWarmupExpanded: (warmupExpanded) =>
        set((state) => ({
          warmupExpanded:
            typeof warmupExpanded === "function"
              ? warmupExpanded(state.warmupExpanded)
              : warmupExpanded,
        })),
      setRefactoringExpanded: (refactoringExpanded) =>
        set((state) => ({
          refactoringExpanded:
            typeof refactoringExpanded === "function"
              ? refactoringExpanded(state.refactoringExpanded)
              : refactoringExpanded,
        })),
      setTasksExpanded: (tasksExpanded) =>
        set((state) => ({
          tasksExpanded:
            typeof tasksExpanded === "function"
              ? tasksExpanded(state.tasksExpanded)
              : tasksExpanded,
        })),
      setAdvancedExpanded: (advancedExpanded) =>
        set((state) => ({
          advancedExpanded:
            typeof advancedExpanded === "function"
              ? advancedExpanded(state.advancedExpanded)
              : advancedExpanded,
        })),
      setReactTsExpanded: (reactTsExpanded) =>
        set((state) => ({
          reactTsExpanded:
            typeof reactTsExpanded === "function"
              ? reactTsExpanded(state.reactTsExpanded)
              : reactTsExpanded,
        })),
      setReactTsPracticeExpanded: (reactTsPracticeExpanded) =>
        set((state) => ({
          reactTsPracticeExpanded:
            typeof reactTsPracticeExpanded === "function"
              ? reactTsPracticeExpanded(state.reactTsPracticeExpanded)
              : reactTsPracticeExpanded,
        })),
      setAllReactCategoriesExpanded: (expanded) =>
        set({
          warmupExpanded: expanded,
          refactoringExpanded: expanded,
          tasksExpanded: expanded,
          advancedExpanded: expanded,
          reactTsExpanded: expanded,
          reactTsPracticeExpanded: expanded,
        }),
      setExpandedJsGroups: (updater) =>
        set((state) => ({
          expandedJsGroups:
            typeof updater === "function" ? updater(state.expandedJsGroups || {}) : updater,
        })),
      setExpandedJsSubgroups: (updater) =>
        set((state) => ({
          expandedJsSubgroups:
            typeof updater === "function" ? updater(state.expandedJsSubgroups || {}) : updater,
        })),
      setExpandedAlgoGroups: (updater) =>
        set((state) => ({
          expandedAlgoGroups:
            typeof updater === "function" ? updater(state.expandedAlgoGroups || {}) : updater,
        })),
      setExpandedAlgoSubgroups: (updater) =>
        set((state) => ({
          expandedAlgoSubgroups:
            typeof updater === "function" ? updater(state.expandedAlgoSubgroups || {}) : updater,
        })),
      toggleJsSubgroup: (groupName, subName) => {
        const key = `${groupName}/${subName}`;
        set((state) => {
          const current = state.expandedJsSubgroups || {};
          return {
            expandedJsSubgroups: {
              ...current,
              [key]: !current[key],
            },
          };
        });
      },
      openSingleCategory: (targetCategoryId) =>
        set({
          warmupExpanded: targetCategoryId === "category-warmup",
          refactoringExpanded: targetCategoryId === "category-refactoring",
          tasksExpanded: targetCategoryId === "category-middle",
          advancedExpanded: targetCategoryId === "category-strong",
          reactTsExpanded: targetCategoryId === "category-ts",
          reactTsPracticeExpanded: targetCategoryId === "category-ts-practice",
        }),

      setTooltip: (tooltip) => set({ tooltip }),

      collapseAllInCurrentSection: (section) => {
        if (section === "javascript") {
          set({ expandedJsGroups: {}, expandedJsSubgroups: {} });
        } else if (section === "algorithms") {
          set({ expandedAlgoGroups: {}, expandedAlgoSubgroups: {} });
        } else if (section === "react") {
          set({
            warmupExpanded: false,
            refactoringExpanded: false,
            tasksExpanded: false,
            advancedExpanded: false,
            reactTsExpanded: false,
            reactTsPracticeExpanded: false,
          });
        }
      },

      expandAllInCurrentSection: (section, allGroupNames = []) => {
        if (section === "javascript") {
          const nextGroups: Record<string, boolean> = {};
          for (const name of allGroupNames) {
            nextGroups[name] = true;
          }
          set({ expandedJsGroups: nextGroups });
        } else if (section === "algorithms") {
          const nextGroups: Record<string, boolean> = {};
          for (const name of allGroupNames) {
            nextGroups[name] = true;
          }
          set({ expandedAlgoGroups: nextGroups });
        } else if (section === "react") {
          set({
            warmupExpanded: true,
            refactoringExpanded: true,
            tasksExpanded: true,
            advancedExpanded: true,
            reactTsExpanded: true,
            reactTsPracticeExpanded: true,
          });
        }
      },

      resetUISettings: () => {
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.style.setProperty("--sidebar-width", "280px");
        }
        if (typeof localStorage !== "undefined") {
          try {
            localStorage.removeItem("playground_ui_settings");
            localStorage.removeItem("playground_group_view_mode");
            localStorage.removeItem("playground_favorites_list_display_mode");
            localStorage.removeItem("playground_console_collapsed");
            localStorage.removeItem("playground_theme");
          } catch {
            // ignore
          }
        }
        if (typeof sessionStorage !== "undefined") {
          try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (key && key.startsWith("playground_")) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach((k) => sessionStorage.removeItem(k));
          } catch {
            // ignore
          }
        }
        set({
          theme: "dark",
          sidebarOpen: true,
          sidebarWidth: 280,
          editorFontSize: 14,
          editorWordWrap: false,
          editorSplitRatio: 70,
          consoleFontSize: 14,
          consoleCollapsed: true,
          warmupExpanded: false,
          refactoringExpanded: false,
          tasksExpanded: false,
          advancedExpanded: false,
          reactTsExpanded: false,
          reactTsPracticeExpanded: false,
          expandedJsGroups: {},
          expandedJsSubgroups: {},
          expandedAlgoGroups: {},
          expandedAlgoSubgroups: {},
        });
      },
    }),
    {
      name: "playground_ui_settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarWidth: state.sidebarWidth,
        editorFontSize: state.editorFontSize,
        editorWordWrap: state.editorWordWrap,
        editorSplitRatio: state.editorSplitRatio,
        consoleFontSize: state.consoleFontSize,
        consoleCollapsed: state.consoleCollapsed,
        warmupExpanded: state.warmupExpanded,
        refactoringExpanded: state.refactoringExpanded,
        tasksExpanded: state.tasksExpanded,
        advancedExpanded: state.advancedExpanded,
        reactTsExpanded: state.reactTsExpanded,
        reactTsPracticeExpanded: state.reactTsPracticeExpanded,
        expandedJsGroups: state.expandedJsGroups,
        expandedJsSubgroups: state.expandedJsSubgroups,
        expandedAlgoGroups: state.expandedAlgoGroups,
        expandedAlgoSubgroups: state.expandedAlgoSubgroups,
      }),
      onRehydrateStorage: () => (state) => {
        const activeTheme =
          state?.theme === "light" || state?.theme === "dark" ? state.theme : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", activeTheme);
        }
        if (state) {
          if (typeof state.editorFontSize === "number" && state.editorFontSize < MIN_FONT_SIZE) {
            state.editorFontSize = MIN_FONT_SIZE;
          }
          if (typeof state.consoleFontSize === "number" && state.consoleFontSize < MIN_FONT_SIZE) {
            state.consoleFontSize = MIN_FONT_SIZE;
          }
        }
      },
    }
  )
);
