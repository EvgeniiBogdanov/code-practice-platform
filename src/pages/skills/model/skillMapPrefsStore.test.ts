import { beforeEach, describe, expect, it } from "vitest";
import { useSkillMapPrefsStore } from "./skillMapPrefsStore";

const STORAGE_KEY = "playground_skill_map";

describe("skill map preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    useSkillMapPrefsStore.setState({ filter: "all", view: null });
  });

  it("writes the chosen filter and view to localStorage", () => {
    useSkillMapPrefsStore.getState().setFilter("weak");
    useSkillMapPrefsStore.getState().setView("list");

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(saved.state).toEqual({ filter: "weak", view: "list" });
  });

  it("restores the saved choice on the next visit", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { filter: "fading", view: "list" }, version: 1 })
    );

    await useSkillMapPrefsStore.persist.rehydrate();

    expect(useSkillMapPrefsStore.getState()).toMatchObject({ filter: "fading", view: "list" });
  });

  it("falls back to the defaults for a malformed saved value", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { filter: "bogus", view: "table" }, version: 1 })
    );

    await useSkillMapPrefsStore.persist.rehydrate();

    expect(useSkillMapPrefsStore.getState()).toMatchObject({ filter: "all", view: null });
  });
});
