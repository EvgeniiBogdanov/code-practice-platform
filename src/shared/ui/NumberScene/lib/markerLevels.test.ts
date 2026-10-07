import { describe, expect, it } from "vitest";
import { assignMarkerLevels } from "./markerLevels";

const above = (x: number, width = 1.4): { x: number; width: number; below: boolean } => ({
  x,
  width,
  below: false,
});
const below = (x: number, width = 1.4): { x: number; width: number; below: boolean } => ({
  x,
  width,
  below: true,
});

describe("assignMarkerLevels", () => {
  it("keeps distant labels on the first level", () => {
    expect(assignMarkerLevels([above(0), above(5), below(0)])).toEqual([0, 0, 0]);
  });

  it("stacks overlapping labels on the same side", () => {
    expect(assignMarkerLevels([above(0), above(1.22)])).toEqual([0, 1]);
    expect(assignMarkerLevels([above(1.22), above(0)])).toEqual([1, 0]);
  });

  it("does not stack labels from opposite sides", () => {
    expect(assignMarkerLevels([above(0), below(0)])).toEqual([0, 0]);
  });

  it("uses a third level for three labels in one place", () => {
    expect(assignMarkerLevels([above(0), above(0), above(0.3)])).toEqual([0, 1, 2]);
  });

  it("reuses the first level once a label is far enough", () => {
    expect(assignMarkerLevels([above(0), above(1), above(5)])).toEqual([0, 1, 0]);
  });
});
