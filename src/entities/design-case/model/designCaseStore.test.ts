import { beforeEach, describe, expect, it } from "vitest";
import { selectStageProgress, useDesignCaseStore } from "./designCaseStore";

const read = (caseId: string, stageId: string) =>
  selectStageProgress(caseId, stageId)(useDesignCaseStore.getState());

describe("useDesignCaseStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignCaseStore.setState({ stages: {} });
  });

  it("keeps choices, answer and rubric per case and stage", () => {
    const store = useDesignCaseStore.getState();
    store.chooseOption("c", "requirements", "fork", "a");
    store.chooseOption("c", "requirements", "fork", "b");
    store.setAnswer("c", "requirements", "text");
    store.toggleRubricItem("c", "requirements", 1);
    store.toggleRubricItem("c", "requirements", 0);
    store.toggleRubricItem("c", "requirements", 1);

    expect(read("c", "requirements")).toEqual({
      choices: { fork: "b" },
      answer: "text",
      rubric: [0],
    });
    expect(read("c", "architecture").answer).toBe("");
    expect(read("other", "requirements").answer).toBe("");
  });

  it("persists progress to localStorage", () => {
    useDesignCaseStore.getState().setAnswer("c", "requirements", "kept");
    const key = useDesignCaseStore.persist.getOptions().name;
    if (!key) throw new Error("The store must have a persistence key");
    expect(JSON.parse(localStorage.getItem(key) ?? "null")).toMatchObject({
      state: { stages: { "c:requirements": { answer: "kept" } } },
    });
  });
});
