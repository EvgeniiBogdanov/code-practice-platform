import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({
  saved: [] as Array<[string, boolean]>,
  broadcasts: [] as Array<[string, unknown]>,
}));

vi.mock("@/shared/lib/storage", async () => {
  const actual =
    await vi.importActual<typeof import("@/shared/lib/storage")>("@/shared/lib/storage");
  return {
    ...actual,
    saveChecklistItemToDB: async (key: string, checked: boolean) =>
      void storage.saved.push([key, checked]),
    broadcastSyncEvent: (type: string, payload: unknown) =>
      void storage.broadcasts.push([type, payload]),
  };
});

const { useProgressStore } = await import("./progressStore");

describe("checkChecklistItems", () => {
  beforeEach(() => {
    storage.saved = [];
    storage.broadcasts = [];
    useProgressStore.setState({ checklistState: { "check-a-0": true } });
  });

  it("ticks new items and never unticks one that is already ticked", async () => {
    await useProgressStore.getState().checkChecklistItems(["check-a-0", "check-a-1"]);
    expect(useProgressStore.getState().checklistState).toEqual({
      "check-a-0": true,
      "check-a-1": true,
    });
    expect(storage.saved).toEqual([["check-a-1", true]]);
    expect(storage.broadcasts).toEqual([
      ["CHECKLIST_CHANGED", { key: "check-a-1", checked: true }],
    ]);
  });

  it("does nothing when everything is already ticked", async () => {
    await useProgressStore.getState().checkChecklistItems(["check-a-0"]);
    expect(storage.saved).toEqual([]);
    expect(storage.broadcasts).toEqual([]);
  });
});
