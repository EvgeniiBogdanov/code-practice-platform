import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 24;

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = localStorage.getItem("playground_ui_settings");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.theme === "light" || parsed?.state?.theme === "dark") {
        return parsed.state.theme;
      }
    }
    const legacy = localStorage.getItem("playground_theme");
    if (legacy === "light" || legacy === "dark") {
      return legacy;
    }
  } catch {
    // ignore
  }
  return "dark";
};

const initialTheme = getInitialTheme();
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", initialTheme);
}

export const useUIStore = create(
  persist(
    (set, get) => ({
      // --- Persisted Settings ---
      theme: initialTheme,
      sidebarOpen: true,
      sidebarWidth: 280,
      editorFontSize: 13,
      consoleFontSize: 13,
      consoleCollapsed: true,

      // --- Modals ---
      statsModalOpen: false,
      cheatSheetOpen: false,
      cheatCategory: "hooks",
      cheatSearch: "",
      paletteOpen: false,
      paletteQuery: "",
      resetConfirmOpen: false,

      // --- Dropdowns ---
      sectionDropdownOpen: false,
      headerSectionDropdownOpen: false,
      categoryDropdownOpen: false,
      taskDropdownOpen: false,
      jsDropdownOpen: false,
      algoDropdownOpen: false,

      // --- Sidebar Accordions (React) ---
      warmupExpanded: false,
      refactoringExpanded: false,
      tasksExpanded: false,
      advancedExpanded: false,
      reactTsExpanded: false,
      reactTsPracticeExpanded: false,

      // --- Sidebar Groups (JS & Algo) ---
      expandedJsGroups: {},
      expandedJsSubgroups: {},

      // --- Global Tooltip ---
      tooltip: null,

      // ==========================================
      // ACTIONS
      // ==========================================

      // Theme Actions
      setTheme: (themeOrFn) => {
        const current = typeof get().theme === "string" ? get().theme : "dark";
        const nextTheme =
          typeof themeOrFn === "function" ? themeOrFn(current) : themeOrFn;
        const validTheme = nextTheme === "light" ? "light" : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", validTheme);
        }
        set({ theme: validTheme });
      },
      toggleTheme: () => {
        const current = typeof get().theme === "string" ? get().theme : "dark";
        const nextTheme = current === "dark" ? "light" : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", nextTheme);
        }
        set({ theme: nextTheme });
      },

      // Sidebar Actions
      setSidebarOpen: (sidebarOpen) =>
        set((state) => ({
          sidebarOpen: typeof sidebarOpen === "function" ? sidebarOpen(state.sidebarOpen) : sidebarOpen,
        })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

      // Editor Font Size Actions
      setEditorFontSize: (size) => {
        const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
        set({ editorFontSize: clamped });
      },
      increaseEditorFontSize: () => {
        set((state) => ({
          editorFontSize: Math.min(MAX_FONT_SIZE, (state.editorFontSize || 13) + 1),
        }));
      },
      decreaseEditorFontSize: () => {
        set((state) => ({
          editorFontSize: Math.max(MIN_FONT_SIZE, (state.editorFontSize || 13) - 1),
        }));
      },
      increaseFontSize: () => {
        set((state) => ({
          editorFontSize: Math.min(MAX_FONT_SIZE, (state.editorFontSize || 13) + 1),
        }));
      },
      decreaseFontSize: () => {
        set((state) => ({
          editorFontSize: Math.max(MIN_FONT_SIZE, (state.editorFontSize || 13) - 1),
        }));
      },

      // Console Font Size Actions
      setConsoleFontSize: (size) => {
        const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
        set({ consoleFontSize: clamped });
      },
      increaseConsoleFontSize: () => {
        set((state) => ({
          consoleFontSize: Math.min(MAX_FONT_SIZE, (state.consoleFontSize || 13) + 1),
        }));
      },
      decreaseConsoleFontSize: () => {
        set((state) => ({
          consoleFontSize: Math.max(MIN_FONT_SIZE, (state.consoleFontSize || 13) - 1),
        }));
      },

      // Console Actions
      setConsoleCollapsed: (consoleCollapsed) =>
        set((state) => ({
          consoleCollapsed:
            typeof consoleCollapsed === "function" ? consoleCollapsed(state.consoleCollapsed) : consoleCollapsed,
        })),
      toggleConsoleCollapsed: () => set((state) => ({ consoleCollapsed: !state.consoleCollapsed })),

      // Modal Actions
      setStatsModalOpen: (statsModalOpen) =>
        set((state) => ({
          statsModalOpen: typeof statsModalOpen === "function" ? statsModalOpen(state.statsModalOpen) : statsModalOpen,
        })),
      setCheatSheetOpen: (cheatSheetOpen) =>
        set((state) => ({
          cheatSheetOpen: typeof cheatSheetOpen === "function" ? cheatSheetOpen(state.cheatSheetOpen) : cheatSheetOpen,
        })),
      setCheatCategory: (cheatCategory) => set({ cheatCategory }),
      setCheatSearch: (cheatSearch) => set({ cheatSearch }),
      setPaletteOpen: (paletteOpen) =>
        set((state) => ({
          paletteOpen: typeof paletteOpen === "function" ? paletteOpen(state.paletteOpen) : paletteOpen,
        })),
      setPaletteQuery: (paletteQuery) => set({ paletteQuery }),
      setResetConfirmOpen: (resetConfirmOpen) =>
        set((state) => ({
          resetConfirmOpen:
            typeof resetConfirmOpen === "function" ? resetConfirmOpen(state.resetConfirmOpen) : resetConfirmOpen,
        })),
      closeAllModals: () =>
        set({
          statsModalOpen: false,
          cheatSheetOpen: false,
          paletteOpen: false,
          resetConfirmOpen: false,
          paletteQuery: "",
        }),

      // Dropdown Actions
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
            typeof taskDropdownOpen === "function" ? taskDropdownOpen(state.taskDropdownOpen) : taskDropdownOpen,
        })),
      setJsDropdownOpen: (jsDropdownOpen) =>
        set((state) => ({
          jsDropdownOpen: typeof jsDropdownOpen === "function" ? jsDropdownOpen(state.jsDropdownOpen) : jsDropdownOpen,
        })),
      setAlgoDropdownOpen: (algoDropdownOpen) =>
        set((state) => ({
          algoDropdownOpen:
            typeof algoDropdownOpen === "function" ? algoDropdownOpen(state.algoDropdownOpen) : algoDropdownOpen,
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

      // Accordion Actions
      setWarmupExpanded: (warmupExpanded) =>
        set((state) => ({
          warmupExpanded:
            typeof warmupExpanded === "function" ? warmupExpanded(state.warmupExpanded) : warmupExpanded,
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
          tasksExpanded: typeof tasksExpanded === "function" ? tasksExpanded(state.tasksExpanded) : tasksExpanded,
        })),
      setAdvancedExpanded: (advancedExpanded) =>
        set((state) => ({
          advancedExpanded:
            typeof advancedExpanded === "function" ? advancedExpanded(state.advancedExpanded) : advancedExpanded,
        })),
      setReactTsExpanded: (reactTsExpanded) =>
        set((state) => ({
          reactTsExpanded:
            typeof reactTsExpanded === "function" ? reactTsExpanded(state.reactTsExpanded) : reactTsExpanded,
        })),
      setReactTsPracticeExpanded: (reactTsPracticeExpanded) =>
        set((state) => ({
          reactTsPracticeExpanded:
            typeof reactTsPracticeExpanded === "function"
              ? reactTsPracticeExpanded(state.reactTsPracticeExpanded)
              : reactTsPracticeExpanded,
        })),
      setExpandedJsGroups: (updater) =>
        set((state) => ({
          expandedJsGroups: typeof updater === "function" ? updater(state.expandedJsGroups) : updater,
        })),
      setExpandedJsSubgroups: (updater) =>
        set((state) => ({
          expandedJsSubgroups: typeof updater === "function" ? updater(state.expandedJsSubgroups) : updater,
        })),
      openSingleCategory: (targetCategoryId) =>
        set({
          warmupExpanded: targetCategoryId === "category-warmup",
          refactoringExpanded: targetCategoryId === "category-refactoring",
          tasksExpanded: targetCategoryId === "category-middle",
          advancedExpanded: targetCategoryId === "category-strong",
          reactTsExpanded: targetCategoryId === "category-ts",
          reactTsPracticeExpanded: targetCategoryId === "category-ts-practice",
        }),

      // Tooltip Actions
      setTooltip: (tooltip) => set({ tooltip }),
    }),
    {
      name: "playground_ui_settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarWidth: state.sidebarWidth,
        editorFontSize: state.editorFontSize,
        consoleFontSize: state.consoleFontSize,
        consoleCollapsed: state.consoleCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        const activeTheme =
          state?.theme === "light" || state?.theme === "dark"
            ? state.theme
            : "dark";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", activeTheme);
        }
      },
    }
  )
);
