import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UIState, ThemeMode } from "../types";

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 24;
export const MIN_CODE_FONT_SIZE = 12;
export const MAX_CODE_FONT_SIZE = 24;

const getInitialUISettings = () => {
  if (typeof window === "undefined") {
    return {
      theme: "dark" as ThemeMode,
      sidebarOpen: true,
      sidebarWidth: 280,
      consoleCollapsed: true,
      editorWordWrap: false,
      editorSplitRatio: 70,
      visualizerSplitRatio: 70,
      visualizerZoom: 1,
      visualizerCodeFontSize: 14,
      hideTooltips: false,
      hideInteractiveAssistant: false,
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
          visualizerSplitRatio:
            typeof parsed.state.visualizerSplitRatio === "number" &&
            parsed.state.visualizerSplitRatio >= 20 &&
            parsed.state.visualizerSplitRatio <= 80
              ? parsed.state.visualizerSplitRatio
              : 70,
          visualizerZoom:
            typeof parsed.state.visualizerZoom === "number" &&
            parsed.state.visualizerZoom >= 0.5 &&
            parsed.state.visualizerZoom <= 2.5
              ? parsed.state.visualizerZoom
              : 1,
          visualizerCodeFontSize:
            typeof parsed.state.visualizerCodeFontSize === "number" &&
            parsed.state.visualizerCodeFontSize >= MIN_CODE_FONT_SIZE &&
            parsed.state.visualizerCodeFontSize <= MAX_CODE_FONT_SIZE
              ? parsed.state.visualizerCodeFontSize
              : 14,
          hideTooltips:
            typeof parsed.state.hideTooltips === "boolean" ? parsed.state.hideTooltips : false,
          hideInteractiveAssistant:
            typeof parsed.state.hideInteractiveAssistant === "boolean"
              ? parsed.state.hideInteractiveAssistant
              : false,
        };
      }
    }
    const legacy = localStorage.getItem("playground_theme");
    const legacyConsole = localStorage.getItem("playground_console_collapsed");
    const legacyVisualizerSplit = localStorage.getItem("playground_visualizer_split_ratio");
    const parsedVisualizerSplit = legacyVisualizerSplit ? Number(legacyVisualizerSplit) : 70;
    const validVisualizerSplit =
      !Number.isNaN(parsedVisualizerSplit) &&
      parsedVisualizerSplit >= 20 &&
      parsedVisualizerSplit <= 80
        ? parsedVisualizerSplit
        : 70;
    const legacyVisualizerZoom = localStorage.getItem("playground_visualizer_zoom");
    const parsedVisualizerZoom = legacyVisualizerZoom ? Number(legacyVisualizerZoom) : 1;
    const validVisualizerZoom =
      !Number.isNaN(parsedVisualizerZoom) &&
      parsedVisualizerZoom >= 0.5 &&
      parsedVisualizerZoom <= 2.5
        ? parsedVisualizerZoom
        : 1;
    const legacyVisualizerCodeFont = localStorage.getItem("playground_visualizer_code_font_size");
    const parsedVisualizerCodeFont = legacyVisualizerCodeFont ? Number(legacyVisualizerCodeFont) : 14;
    const validVisualizerCodeFont =
      !Number.isNaN(parsedVisualizerCodeFont) &&
      parsedVisualizerCodeFont >= MIN_CODE_FONT_SIZE &&
      parsedVisualizerCodeFont <= MAX_CODE_FONT_SIZE
        ? parsedVisualizerCodeFont
        : 14;
    return {
      theme: (legacy === "light" || legacy === "dark" ? legacy : "dark") as ThemeMode,
      sidebarOpen: true,
      sidebarWidth: 280,
      consoleCollapsed: legacyConsole !== null ? legacyConsole === "true" : true,
      editorWordWrap: false,
      editorSplitRatio: 70,
      visualizerSplitRatio: validVisualizerSplit,
      visualizerZoom: validVisualizerZoom,
      visualizerCodeFontSize: validVisualizerCodeFont,
      hideTooltips: false,
      hideInteractiveAssistant: false,
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
    visualizerSplitRatio: 70,
    visualizerZoom: 1,
    visualizerCodeFontSize: 14,
    hideTooltips: false,
    hideInteractiveAssistant: false,
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
      visualizerSplitRatio: initialUI.visualizerSplitRatio,
      visualizerZoom: initialUI.visualizerZoom,
      visualizerCodeFontSize: initialUI.visualizerCodeFontSize,
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
      lifecycleExpanded: false,

      expandedJsGroups: {},
      expandedJsSubgroups: {},
      expandedAlgoGroups: {},
      expandedAlgoSubgroups: {},

      tooltip: null,
      hideTooltips: initialUI.hideTooltips,
      hideInteractiveAssistant: initialUI.hideInteractiveAssistant,

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

      setVisualizerSplitRatio: (ratio) => {
        const clamped = Math.min(80, Math.max(20, ratio));
        try {
          localStorage.setItem("playground_visualizer_split_ratio", String(clamped));
        } catch {
          // ignore
        }
        set({ visualizerSplitRatio: clamped });
      },
      resetVisualizerSplitRatio: () => {
        try {
          localStorage.setItem("playground_visualizer_split_ratio", "70");
        } catch {
          // ignore
        }
        set({ visualizerSplitRatio: 70 });
      },

      setVisualizerZoom: (zoom) => {
        const clamped = Math.min(2.5, Math.max(0.5, Math.round(zoom * 100) / 100));
        try {
          localStorage.setItem("playground_visualizer_zoom", String(clamped));
        } catch {
          // ignore
        }
        set({ visualizerZoom: clamped });
      },
      increaseVisualizerZoom: () => {
        set((state) => {
          const current = state.visualizerZoom ?? 1;
          const presets = [0.5, 0.65, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5];
          const next = presets.find((p) => p > current + 0.05) ?? Math.min(2.5, current + 0.25);
          const clamped = Math.min(2.5, Math.round(next * 100) / 100);
          try {
            localStorage.setItem("playground_visualizer_zoom", String(clamped));
          } catch {
            // ignore
          }
          return { visualizerZoom: clamped };
        });
      },
      decreaseVisualizerZoom: () => {
        set((state) => {
          const current = state.visualizerZoom ?? 1;
          const presets = [0.5, 0.65, 0.8, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5];
          const next =
            presets.slice().reverse().find((p) => p < current - 0.05) ??
            Math.max(0.5, current - 0.25);
          const clamped = Math.max(0.5, Math.round(next * 100) / 100);
          try {
            localStorage.setItem("playground_visualizer_zoom", String(clamped));
          } catch {
            // ignore
          }
          return { visualizerZoom: clamped };
        });
      },
      resetVisualizerZoom: () => {
        try {
          localStorage.setItem("playground_visualizer_zoom", "1");
        } catch {
          // ignore
        }
        set({ visualizerZoom: 1 });
      },

      setVisualizerCodeFontSize: (size) => {
        const clamped = Math.min(MAX_CODE_FONT_SIZE, Math.max(MIN_CODE_FONT_SIZE, size));
        try {
          localStorage.setItem("playground_visualizer_code_font_size", String(clamped));
        } catch {
          // ignore
        }
        set({ visualizerCodeFontSize: clamped });
      },
      increaseVisualizerCodeFontSize: () => {
        set((state) => {
          const current = state.visualizerCodeFontSize ?? 14;
          const clamped = Math.min(MAX_CODE_FONT_SIZE, current + 1);
          try {
            localStorage.setItem("playground_visualizer_code_font_size", String(clamped));
          } catch {
            // ignore
          }
          return { visualizerCodeFontSize: clamped };
        });
      },
      decreaseVisualizerCodeFontSize: () => {
        set((state) => {
          const current = state.visualizerCodeFontSize ?? 14;
          const clamped = Math.max(MIN_CODE_FONT_SIZE, current - 1);
          try {
            localStorage.setItem("playground_visualizer_code_font_size", String(clamped));
          } catch {
            // ignore
          }
          return { visualizerCodeFontSize: clamped };
        });
      },
      resetVisualizerCodeFontSize: () => {
        try {
          localStorage.setItem("playground_visualizer_code_font_size", "14");
        } catch {
          // ignore
        }
        set({ visualizerCodeFontSize: 14 });
      },

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
      setLifecycleExpanded: (lifecycleExpanded) =>
        set((state) => ({
          lifecycleExpanded:
            typeof lifecycleExpanded === "function"
              ? lifecycleExpanded(state.lifecycleExpanded)
              : lifecycleExpanded,
        })),
      setAllReactCategoriesExpanded: (expanded) =>
        set({
          warmupExpanded: expanded,
          refactoringExpanded: expanded,
          tasksExpanded: expanded,
          advancedExpanded: expanded,
          reactTsExpanded: expanded,
          reactTsPracticeExpanded: expanded,
          lifecycleExpanded: expanded,
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
      setHideTooltips: (hideTooltips) =>
        set((state) => ({
          hideTooltips:
            typeof hideTooltips === "function" ? hideTooltips(state.hideTooltips) : hideTooltips,
        })),
      setHideInteractiveAssistant: (hideInteractiveAssistant) =>
        set((state) => ({
          hideInteractiveAssistant:
            typeof hideInteractiveAssistant === "function"
              ? hideInteractiveAssistant(state.hideInteractiveAssistant)
              : hideInteractiveAssistant,
        })),

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
            localStorage.removeItem("playground_visualizer_split_ratio");
            localStorage.removeItem("playground_visualizer_zoom");
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
          visualizerSplitRatio: 70,
          visualizerZoom: 1,
          visualizerCodeFontSize: 14,
          consoleFontSize: 14,
          consoleCollapsed: true,
          warmupExpanded: false,
          refactoringExpanded: false,
          tasksExpanded: false,
          advancedExpanded: false,
          reactTsExpanded: false,
          reactTsPracticeExpanded: false,
          lifecycleExpanded: false,
          expandedJsGroups: {},
          expandedJsSubgroups: {},
          expandedAlgoGroups: {},
          expandedAlgoSubgroups: {},
          hideTooltips: false,
          hideInteractiveAssistant: false,
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
        visualizerSplitRatio: state.visualizerSplitRatio,
        visualizerZoom: state.visualizerZoom,
        visualizerCodeFontSize: state.visualizerCodeFontSize,
        consoleFontSize: state.consoleFontSize,
        consoleCollapsed: state.consoleCollapsed,
        warmupExpanded: state.warmupExpanded,
        refactoringExpanded: state.refactoringExpanded,
        tasksExpanded: state.tasksExpanded,
        advancedExpanded: state.advancedExpanded,
        reactTsExpanded: state.reactTsExpanded,
        reactTsPracticeExpanded: state.reactTsPracticeExpanded,
        lifecycleExpanded: state.lifecycleExpanded,
        expandedJsGroups: state.expandedJsGroups,
        expandedJsSubgroups: state.expandedJsSubgroups,
        expandedAlgoGroups: state.expandedAlgoGroups,
        expandedAlgoSubgroups: state.expandedAlgoSubgroups,
        hideTooltips: state.hideTooltips,
        hideInteractiveAssistant: state.hideInteractiveAssistant,
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
