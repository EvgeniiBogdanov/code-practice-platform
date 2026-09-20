import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "./uiStore";

describe("TypeScript sidebar tree state", () => {
  beforeEach(() => {
    useUIStore.setState({
      expandedTsGroups: {},
      expandedTsSubgroups: {},
      expandedJsGroups: { Loops: true },
    });
  });

  it("expands and collapses TypeScript without changing JavaScript folders", () => {
    useUIStore.getState().expandAllInCurrentSection("typescript", ["Basics", "Generics"]);
    expect(useUIStore.getState().expandedTsGroups).toEqual({ Basics: true, Generics: true });
    useUIStore.getState().collapseAllInCurrentSection("typescript");
    expect(useUIStore.getState().expandedTsGroups).toEqual({});
    expect(useUIStore.getState().expandedJsGroups).toEqual({ Loops: true });
  });

  it("persists TypeScript expansion independently", () => {
    useUIStore.getState().setExpandedTsGroups((previous) => ({ ...previous, Basics: true }));
    expect(useUIStore.getState().expandedTsGroups).toEqual({ Basics: true });
    const storageKey = useUIStore.persist.getOptions().name;
    if (!storageKey) throw new Error("The UI store must have a persistence key");
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    expect(stored).toMatchObject({ state: { expandedTsGroups: { Basics: true } } });
  });
});
