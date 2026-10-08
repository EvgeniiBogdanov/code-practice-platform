import { describe, expect, it } from "vitest";
import { loadTaskHints } from "./taskHints";

describe("loadTaskHints", () => {
  it("returns the three hints of an algorithm task", async () => {
    const hints = await loadTaskHints("algorithms", "algo4");

    expect(hints).toHaveLength(3);
  });

  it("returns the three hints of a TypeScript task", async () => {
    const hints = await loadTaskHints("typescript", "typescript-7");

    expect(hints).toHaveLength(3);
  });

  it("returns null for unknown tasks and sections without hints", async () => {
    expect(await loadTaskHints("algorithms", "missing")).toBeNull();
    expect(await loadTaskHints("javascript", "js1")).toBeNull();
  });
});
