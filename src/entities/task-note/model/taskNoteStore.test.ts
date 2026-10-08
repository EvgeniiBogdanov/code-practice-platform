import { beforeEach, describe, expect, it } from "vitest";
import { selectTaskNote, useTaskNoteStore } from "./taskNoteStore";

const state = () => useTaskNoteStore.getState();

describe("taskNoteStore", () => {
  beforeEach(() => {
    useTaskNoteStore.setState({ notes: {} });
  });

  it("keeps note text per task", () => {
    state().setNoteText("algo1", "two pointers");
    state().setNoteText(7, "other task");

    expect(selectTaskNote("algo1")(state()).text).toBe("two pointers");
    expect(selectTaskNote("7")(state()).text).toBe("other task");
  });

  it("drops the record once the note is blank", () => {
    state().setNoteText("algo1", "text");
    state().setNoteText("algo1", "   ");

    expect(state().notes).toEqual({});
  });

  it("migrates v1 notes, dropping the mistake journal and empty records", async () => {
    localStorage.setItem(
      "playground_task_notes",
      JSON.stringify({
        version: 1,
        state: {
          notes: {
            algo1: {
              text: "kept",
              mistakes: [{ id: "m1", reasonId: "idea", comment: "", createdAt: 1 }],
            },
            algo2: {
              text: "",
              mistakes: [{ id: "m2", reasonId: "idea", comment: "", createdAt: 2 }],
            },
          },
        },
      })
    );

    await useTaskNoteStore.persist.rehydrate();

    expect(state().notes).toEqual({ algo1: { text: "kept" } });
  });
});
