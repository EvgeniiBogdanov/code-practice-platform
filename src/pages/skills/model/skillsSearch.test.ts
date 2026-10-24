import { describe, expect, it } from "vitest";
import { parseSkillsSearch } from "./skillsSearch";

describe("parseSkillsSearch", () => {
  it("keeps valid skills and views", () => {
    expect(parseSkillsSearch({ skill: "react.effects", view: "list" })).toEqual({
      skill: "react.effects",
      view: "list",
    });
  });

  it("drops malformed values so an old link still opens the page", () => {
    expect(parseSkillsSearch({ skill: "<script>", view: "3d" })).toEqual({
      skill: undefined,
      view: undefined,
    });
  });
});
