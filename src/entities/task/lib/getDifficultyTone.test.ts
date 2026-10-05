import { describe, expect, it } from "vitest";
import { getDifficultyTone } from "./getDifficultyTone";

describe("getDifficultyTone", () => {
  it.each([
    ["junior", "easy"],
    ["warm-up", "easy"],
    ["easy", "easy"],
    ["middle", "medium"],
    ["refactoring", "medium"],
    ["medium", "medium"],
    ["senior", "hard"],
    ["hard", "hard"],
    ["Senior", "hard"],
  ])("maps %s to %s", (difficulty, tone) => {
    expect(getDifficultyTone(difficulty)).toBe(tone);
  });

  it("returns null for missing or unknown difficulty", () => {
    expect(getDifficultyTone(undefined)).toBeNull();
    expect(getDifficultyTone("unknown")).toBeNull();
  });
});
