import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "./uiStore";

const GROUPS = ["theory", "cases", "drills"];

describe("system design sidebar folders", () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ expandedSystemDesignGroups: {}, expandedJsGroups: { Loops: true } });
  });

  it("opens every folder and closes them explicitly, leaving other sections alone", () => {
    useUIStore.getState().expandAllInCurrentSection("system-design", GROUPS);
    expect(useUIStore.getState().expandedSystemDesignGroups).toEqual({
      theory: true,
      cases: true,
      drills: true,
    });

    // `false`, not an empty map: an empty one lets the folder with the current page reopen.
    useUIStore.getState().collapseAllInCurrentSection("system-design", GROUPS);
    expect(useUIStore.getState().expandedSystemDesignGroups).toEqual({
      theory: false,
      cases: false,
      drills: false,
    });
    expect(useUIStore.getState().expandedJsGroups).toEqual({ Loops: true });
  });

  it("persists the folders", () => {
    useUIStore
      .getState()
      .setExpandedSystemDesignGroups((previous) => ({ ...previous, cases: true }));
    const storageKey = useUIStore.persist.getOptions().name;
    if (!storageKey) throw new Error("The UI store must have a persistence key");
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    expect(stored).toMatchObject({ state: { expandedSystemDesignGroups: { cases: true } } });
  });
});
