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
      hideInteractiveAssistant: true,
    });

    localStorage.setItem("playground_group_view_mode", "cards");
    localStorage.setItem("playground_favorites_list_display_mode", "tasks");
    localStorage.setItem("playground_console_collapsed", "false");
    localStorage.setItem("playground_theme", "light");
    localStorage.setItem("playground_visualizer_playback_speed", "2");
    sessionStorage.setItem("playground_collapsed_subgroups_1", "{}");
    sessionStorage.setItem("playground_favorite_tree_collapsed_folders_javascript", "[]");

    useUIStore.getState().resetUISettings();

    const state = useUIStore.getState();
    expect(state.theme).toBe("dark");
    expect(state.sidebarOpen).toBe(true);
    expect(state.sidebarWidth).toBe(280);
    expect(state.editorFontSize).toBe(14);
    expect(state.editorWordWrap).toBe(false);
    expect(state.visualizerZoom).toBe(1);
    expect(state.visualizerCodeFontSize).toBe(14);
    expect(state.visualizerSplitRatio).toBe(70);
    expect(state.consoleFontSize).toBe(14);
    expect(state.consoleCollapsed).toBe(true);
    expect(state.warmupExpanded).toBe(false);
    expect(state.expandedJsGroups).toEqual({});
    expect(state.hideTooltips).toBe(false);
    expect(state.hideInteractiveAssistant).toBe(false);

    expect(localStorage.getItem("playground_group_view_mode")).toBeNull();
    expect(localStorage.getItem("playground_favorites_list_display_mode")).toBeNull();
    expect(localStorage.getItem("playground_console_collapsed")).toBeNull();
    expect(localStorage.getItem("playground_theme")).toBeNull();
    expect(localStorage.getItem("playground_visualizer_zoom")).toBeNull();
    expect(localStorage.getItem("playground_visualizer_code_font_size")).toBeNull();
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBeNull();
    expect(localStorage.getItem("playground_visualizer_playback_speed")).toBeNull();
    expect(sessionStorage.getItem("playground_collapsed_subgroups_1")).toBeNull();
    expect(
      sessionStorage.getItem("playground_favorite_tree_collapsed_folders_javascript")
    ).toBeNull();
  });

  it("updates hideTooltips using boolean and function updater", () => {
    useUIStore.getState().setHideTooltips(true);
    expect(useUIStore.getState().hideTooltips).toBe(true);

    useUIStore.getState().setHideTooltips((prev) => !prev);
    expect(useUIStore.getState().hideTooltips).toBe(false);
  });

  it("updates hideInteractiveAssistant using boolean and function updater", () => {
    useUIStore.getState().setHideInteractiveAssistant(true);
    expect(useUIStore.getState().hideInteractiveAssistant).toBe(true);

    useUIStore.getState().setHideInteractiveAssistant((prev) => !prev);
    expect(useUIStore.getState().hideInteractiveAssistant).toBe(false);
  });

  it("updates, clamps and resets visualizerSplitRatio with localStorage persistence", () => {
    const store = useUIStore.getState();
    expect(store.visualizerSplitRatio).toBe(70);

    store.setVisualizerSplitRatio(60);
    expect(useUIStore.getState().visualizerSplitRatio).toBe(60);
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("60");

    // Clamping min 20, max 80
    store.setVisualizerSplitRatio(10);
    expect(useUIStore.getState().visualizerSplitRatio).toBe(20);
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("20");

    store.setVisualizerSplitRatio(95);
    expect(useUIStore.getState().visualizerSplitRatio).toBe(80);
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("80");

    store.resetVisualizerSplitRatio();
    expect(useUIStore.getState().visualizerSplitRatio).toBe(70);
    expect(localStorage.getItem("playground_visualizer_split_ratio")).toBe("70");
  });

  it("updates, steps through presets and resets visualizerZoom with localStorage persistence", () => {
    const store = useUIStore.getState();
    expect(store.visualizerZoom).toBe(1);

    store.increaseVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(1.25);
    expect(localStorage.getItem("playground_visualizer_zoom")).toBe("1.25");

    store.increaseVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(1.5);

    store.decreaseVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(1.25);

    store.setVisualizerZoom(2.5);
    expect(useUIStore.getState().visualizerZoom).toBe(2.5);

    // cannot exceed max preset
    store.increaseVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(2.5);

    store.setVisualizerZoom(0.5);
    // cannot drop below min preset
    store.decreaseVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(0.5);

    store.resetVisualizerZoom();
    expect(useUIStore.getState().visualizerZoom).toBe(1);
    expect(localStorage.getItem("playground_visualizer_zoom")).toBe("1");
  });

  it("updates, clamps and resets visualizerCodeFontSize with localStorage persistence", () => {
    const store = useUIStore.getState();
    expect(store.visualizerCodeFontSize).toBe(14);

    store.increaseVisualizerCodeFontSize();
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(15);
    expect(localStorage.getItem("playground_visualizer_code_font_size")).toBe("15");

    store.decreaseVisualizerCodeFontSize();
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(14);

    store.setVisualizerCodeFontSize(24);
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(24);

    // cannot exceed max (24)
    store.increaseVisualizerCodeFontSize();
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(24);

    store.setVisualizerCodeFontSize(12);
    // cannot drop below min (12)
    store.decreaseVisualizerCodeFontSize();
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(12);

    store.resetVisualizerCodeFontSize();
    expect(useUIStore.getState().visualizerCodeFontSize).toBe(14);
    expect(localStorage.getItem("playground_visualizer_code_font_size")).toBe("14");
  });
});
