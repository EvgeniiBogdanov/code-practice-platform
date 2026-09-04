import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "./uiStore";

describe("useUIStore - resetUISettings", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("resets all UI customization state to defaults and clears storage keys", () => {
    useUIStore.setState({
      theme: "light",
      sidebarOpen: false,
      sidebarWidth: 360,
      editorFontSize: 18,
      editorWordWrap: true,
      editorSplitRatio: 50,
      consoleFontSize: 16,
      consoleCollapsed: false,
      warmupExpanded: true,
      expandedJsGroups: { "group-1": true },
    });

    localStorage.setItem("playground_group_view_mode", "cards");
    localStorage.setItem("playground_favorites_list_display_mode", "tasks");
    localStorage.setItem("playground_console_collapsed", "false");
    localStorage.setItem("playground_theme", "light");
    sessionStorage.setItem("playground_collapsed_subgroups_1", "{}");
    sessionStorage.setItem("playground_favorite_tree_collapsed_folders_javascript", "[]");

    useUIStore.getState().resetUISettings();

    const state = useUIStore.getState();
    expect(state.theme).toBe("dark");
    expect(state.sidebarOpen).toBe(true);
    expect(state.sidebarWidth).toBe(280);
    expect(state.editorFontSize).toBe(14);
    expect(state.editorWordWrap).toBe(false);
    expect(state.editorSplitRatio).toBe(70);
    expect(state.consoleFontSize).toBe(14);
    expect(state.consoleCollapsed).toBe(true);
    expect(state.warmupExpanded).toBe(false);
    expect(state.expandedJsGroups).toEqual({});
    expect(state.hideTooltips).toBe(false);

    expect(localStorage.getItem("playground_group_view_mode")).toBeNull();
    expect(localStorage.getItem("playground_favorites_list_display_mode")).toBeNull();
    expect(localStorage.getItem("playground_console_collapsed")).toBeNull();
    expect(localStorage.getItem("playground_theme")).toBeNull();
    expect(sessionStorage.getItem("playground_collapsed_subgroups_1")).toBeNull();
    expect(sessionStorage.getItem("playground_favorite_tree_collapsed_folders_javascript")).toBeNull();
  });

  it("updates hideTooltips using boolean and function updater", () => {
    useUIStore.getState().setHideTooltips(true);
    expect(useUIStore.getState().hideTooltips).toBe(true);

    useUIStore.getState().setHideTooltips((prev) => !prev);
    expect(useUIStore.getState().hideTooltips).toBe(false);
  });
});
