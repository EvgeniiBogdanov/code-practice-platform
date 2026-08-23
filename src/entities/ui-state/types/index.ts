export type ThemeMode = "light" | "dark";

export interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  sidebarWidth: number;
  editorFontSize: number;
  consoleFontSize: number;
  consoleCollapsed: boolean;

  statsModalOpen: boolean;
  settingsModalOpen: boolean;
  cheatSheetOpen: boolean;
  cheatCategory: string;
  cheatSearch: string;
  paletteOpen: boolean;
  paletteQuery: string;
  resetConfirmOpen: boolean;

  sectionDropdownOpen: boolean;
  headerSectionDropdownOpen: boolean;
  categoryDropdownOpen: boolean;
  taskDropdownOpen: boolean;
  jsDropdownOpen: boolean;
  algoDropdownOpen: boolean;

  warmupExpanded: boolean;
  refactoringExpanded: boolean;
  tasksExpanded: boolean;
  advancedExpanded: boolean;
  reactTsExpanded: boolean;
  reactTsPracticeExpanded: boolean;

  expandedJsGroups: Record<string, boolean>;
  expandedJsSubgroups: Record<string, boolean>;
  expandedAlgoGroups: Record<string, boolean>;
  expandedAlgoSubgroups: Record<string, boolean>;

  tooltip: string | null;

  setTheme: (themeOrFn: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => void;
  toggleTheme: () => void;
  setSidebarOpen: (sidebarOpen: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (sidebarWidth: number) => void;
  setEditorFontSize: (size: number) => void;
  increaseEditorFontSize: () => void;
  decreaseEditorFontSize: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setConsoleFontSize: (size: number) => void;
  increaseConsoleFontSize: () => void;
  decreaseConsoleFontSize: () => void;
  setConsoleCollapsed: (consoleCollapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleConsoleCollapsed: () => void;

  setStatsModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSettingsModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setCheatSheetOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setCheatCategory: (category: string) => void;
  setCheatSearch: (search: string) => void;
  setPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setPaletteQuery: (query: string) => void;
  setResetConfirmOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  closeAllModals: () => void;

  setSectionDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setHeaderSectionDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setCategoryDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setTaskDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setJsDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setAlgoDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  closeAllDropdowns: () => void;

  setWarmupExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setRefactoringExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setTasksExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setAdvancedExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setReactTsExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setReactTsPracticeExpanded: (open: boolean | ((prev: boolean) => boolean)) => void;
  setExpandedJsGroups: (
    updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  setExpandedJsSubgroups: (
    updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  setExpandedAlgoGroups: (
    updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  setExpandedAlgoSubgroups: (
    updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  toggleJsSubgroup: (groupName: string, subName: string) => void;
  openSingleCategory: (categoryId: string) => void;

  setTooltip: (tooltip: string | null) => void;
}

export interface TimerState {
  timerSeconds: number | null;
  timerRunning: boolean;
  startTimer: (minutes: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTimerSeconds: (secondsOrFn: number | null | ((prev: number | null) => number | null)) => void;
  setTimerRunning: (runningOrFn: boolean | ((prev: boolean) => boolean)) => void;
  formatTimer: (totalSec: number | null) => string;
}
