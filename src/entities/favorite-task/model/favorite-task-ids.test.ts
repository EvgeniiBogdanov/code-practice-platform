import { describe, expect, it } from "vitest";
import {
  addFavoriteTaskId,
  normalizeFavoriteTaskIds,
  removeFavoriteTaskId,
  toggleFavoriteTaskId,
} from "./favorite-task-ids";

describe("favorite task ids", () => {
  it("normalizes persisted ids and removes duplicates", () => {
    expect(normalizeFavoriteTaskIds([1, "2", 1, null, {}])).toEqual(["1", "2"]);
  });

  it("adds a task only once", () => {
    expect(addFavoriteTaskId(["1"], 2)).toEqual(["1", "2"]);
    expect(addFavoriteTaskId(["1"], 1)).toEqual(["1"]);
  });

  it("removes and toggles a task", () => {
    expect(removeFavoriteTaskId(["1", "2"], 1)).toEqual(["2"]);
    expect(toggleFavoriteTaskId(["1"], 1)).toEqual([]);
    expect(toggleFavoriteTaskId(["1"], 2)).toEqual(["1", "2"]);
  });
});
