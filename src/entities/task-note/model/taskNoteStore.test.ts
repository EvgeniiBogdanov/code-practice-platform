import { beforeEach, describe, expect, it } from "vitest";
import { getMistakeReason } from "./mistakeReasons";
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

  it("adds the newest mistake first and trims its comment", () => {
    state().addMistake("algo1", "edge-cases", "  пустой массив  ");
    state().addMistake("algo1", "off-by-one");

    const { mistakes } = selectTaskNote("algo1")(state());
    expect(mistakes.map((mistake) => mistake.reasonId)).toEqual(["off-by-one", "edge-cases"]);
    expect(mistakes[1].comment).toBe("пустой массив");
    expect(new Set(mistakes.map((mistake) => mistake.id)).size).toBe(2);
  });

  it("removes a mistake by id", () => {
    state().addMistake("algo1", "idea");
    state().addMistake("algo1", "syntax");
    const [newest] = selectTaskNote("algo1")(state()).mistakes;

    state().removeMistake("algo1", newest.id);

    expect(selectTaskNote("algo1")(state()).mistakes.map((mistake) => mistake.reasonId)).toEqual([
      "idea",
    ]);
  });

  it("drops the record once the note is empty", () => {
    state().setNoteText("algo1", "text");
    state().addMistake("algo1", "idea");
    state().setNoteText("algo1", "   ");
    expect(state().notes).toHaveProperty("algo1");

    state().removeMistake("algo1", selectTaskNote("algo1")(state()).mistakes[0].id);

    expect(state().notes).toEqual({});
  });

  it("falls back to the generic reason for unknown ids", () => {
    expect(getMistakeReason("removed-reason").id).toBe("other");
  });
});
