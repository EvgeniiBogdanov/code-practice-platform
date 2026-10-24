import { describe, expect, it } from "vitest";
import { toSkillStatus } from "./skillStatus";

describe("toSkillStatus", () => {
  it("reads both the solved marks and the unsolved mark", () => {
    expect(toSkillStatus("solved")).toBe("solved");
    expect(toSkillStatus(true)).toBe("solved");
    expect(toSkillStatus("unsolved")).toBe("unsolved");
  });

  it("treats a missing or unknown status as not started", () => {
    expect(toSkillStatus(undefined)).toBeNull();
    expect(toSkillStatus(false)).toBeNull();
    expect(toSkillStatus("in-progress")).toBeNull();
  });
});
