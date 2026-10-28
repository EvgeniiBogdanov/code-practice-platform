import { beforeEach, describe, expect, it } from "vitest";
import {
  selectCaseBoard,
  selectCaseRevision,
  selectHasCaseProgress,
  selectStageProgress,
  useDesignCaseStore,
} from "./designCaseStore";

const read = (caseId: string, stageId: string) =>
  selectStageProgress(caseId, stageId)(useDesignCaseStore.getState());

const hasProgress = (caseId: string): boolean =>
  selectHasCaseProgress(caseId)(useDesignCaseStore.getState());

describe("useDesignCaseStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {}, boards: {}, revisions: {} });
  });

  describe("resetCase", () => {
    const fill = (caseId: string): void => {
      const store = useDesignCaseStore.getState();
      store.chooseOption(caseId, "requirements", "fork", "a");
      store.toggleRubricItem(caseId, "interface", 0);
      store.setBoard(caseId, { nodes: [{ id: "n1", x: 0, y: 0, text: "API" }], edges: [] });
    };

    it("forgets the choices, ticks and board of that case", () => {
      fill("c");
      useDesignCaseStore.getState().resetCase("c");

      expect(read("c", "requirements").choices).toEqual({});
      expect(read("c", "interface").rubric).toEqual([]);
      expect(selectCaseBoard("c")(useDesignCaseStore.getState()).nodes).toEqual([]);
      expect(hasProgress("c")).toBe(false);
    });

    it("leaves the other cases alone, even one whose id starts the same way", () => {
      fill("chat");
      fill("chat-2");
      useDesignCaseStore.getState().resetCase("chat");

      expect(hasProgress("chat")).toBe(false);
      expect(hasProgress("chat-2")).toBe(true);
      expect(read("chat-2", "requirements").choices).toEqual({ fork: "a" });
    });

    it("counts the resets of a case, so an open board editor can tell it was rebuilt", () => {
      const store = useDesignCaseStore.getState();
      expect(selectCaseRevision("c")(useDesignCaseStore.getState())).toBe(0);
      store.resetCase("c");
      store.resetCase("c");

      expect(selectCaseRevision("c")(useDesignCaseStore.getState())).toBe(2);
      expect(selectCaseRevision("other")(useDesignCaseStore.getState())).toBe(0);
    });

    it("does not save the reset counter", () => {
      useDesignCaseStore.getState().resetCase("c");
      const key = useDesignCaseStore.persist.getOptions().name;
      if (!key) throw new Error("The store must have a persistence key");
      expect(JSON.parse(localStorage.getItem(key) ?? "null").state).not.toHaveProperty("revisions");
    });
  });

  describe("selectHasCaseProgress", () => {
    it("is false for a case that was only opened", () => {
      expect(hasProgress("c")).toBe(false);
    });

    it("is true once anything is chosen, ticked or drawn", () => {
      useDesignCaseStore.getState().chooseOption("c", "requirements", "fork", "a");
      expect(hasProgress("c")).toBe(true);
    });

    it("ignores a tick that was taken back", () => {
      const store = useDesignCaseStore.getState();
      store.toggleRubricItem("c", "requirements", 0);
      store.toggleRubricItem("c", "requirements", 0);
      expect(hasProgress("c")).toBe(false);
    });

    it("is true for a case with only a drawn card", () => {
      useDesignCaseStore
        .getState()
        .setBoard("c", { nodes: [{ id: "n1", x: 0, y: 0, text: "" }], edges: [] });
      expect(hasProgress("c")).toBe(true);
    });
  });

  it("keeps choices and rubric per case and stage", () => {
    const store = useDesignCaseStore.getState();
    store.chooseOption("c", "requirements", "fork", "a");
    store.chooseOption("c", "requirements", "fork", "b");
    store.toggleRubricItem("c", "requirements", 1);
    store.toggleRubricItem("c", "requirements", 0);
    store.toggleRubricItem("c", "requirements", 1);

    expect(read("c", "requirements")).toEqual({
      choices: { fork: "b" },
      rubric: [0],
    });
    expect(read("c", "architecture")).toEqual({ choices: {}, rubric: [] });
    expect(read("other", "requirements")).toEqual({ choices: {}, rubric: [] });
  });

  it("keeps one board per case, shared by all its stages", () => {
    const board = { nodes: [{ id: "n1", x: 1, y: 2, text: "API" }], edges: [] };
    const store = useDesignCaseStore.getState();
    store.toggleRubricItem("c", "architecture", 0);
    store.setBoard("c", board);

    const state = useDesignCaseStore.getState();
    expect(selectCaseBoard("c")(state)).toEqual(board);
    expect(selectCaseBoard("other")(state)).toEqual({ nodes: [], edges: [] });
    expect(read("c", "architecture")).toEqual({ choices: {}, rubric: [0] });
  });

  it("replaces the board of the case on every change", () => {
    const store = useDesignCaseStore.getState();
    store.setBoard("c", { nodes: [{ id: "n1", x: 0, y: 0, text: "A" }], edges: [] });
    store.setBoard("c", { nodes: [{ id: "n1", x: 0, y: 0, text: "B" }], edges: [] });

    expect(selectCaseBoard("c")(useDesignCaseStore.getState()).nodes[0]?.text).toBe("B");
  });

  it("persists progress and the board to localStorage", () => {
    const store = useDesignCaseStore.getState();
    store.chooseOption("c", "requirements", "fork", "a");
    store.setBoard("c", { nodes: [{ id: "n1", x: 0, y: 0, text: "API" }], edges: [] });
    const key = useDesignCaseStore.persist.getOptions().name;
    if (!key) throw new Error("The store must have a persistence key");
    expect(JSON.parse(localStorage.getItem(key) ?? "null")).toMatchObject({
      state: {
        stages: { "c:requirements": { choices: { fork: "a" } } },
        boards: { c: { nodes: [{ text: "API" }] } },
      },
    });
  });

  it("drops the notes and answers stored by older versions", async () => {
    const key = useDesignCaseStore.persist.getOptions().name;
    if (!key) throw new Error("The store must have a persistence key");
    localStorage.setItem(
      key,
      JSON.stringify({
        version: 2,
        state: {
          stages: {
            "c:architecture": { choices: { fork: "a" }, notes: "Берём SSR", rubric: [0] },
          },
          boards: {},
        },
      })
    );

    await useDesignCaseStore.persist.rehydrate();

    expect(read("c", "architecture")).toEqual({ choices: { fork: "a" }, rubric: [0] });
  });
});
