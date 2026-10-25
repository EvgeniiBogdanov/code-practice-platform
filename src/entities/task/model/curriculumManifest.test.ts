import { describe, expect, it } from "vitest";
import type { SectionType } from "../types";
import { CURRICULUM_COUNTS, getTaskSectionById } from "./curriculumManifest";
import { loadTaskSection } from "./taskCatalog";

describe("CURRICULUM_COUNTS", () => {
  it.each(Object.keys(CURRICULUM_COUNTS) as SectionType[])(
    "matches the real number of %s tasks",
    async (section) => {
      const tasks = await loadTaskSection(section);
      expect(tasks).toHaveLength(CURRICULUM_COUNTS[section]);
    },
    15000
  );
});

describe("getTaskSectionById", () => {
  it("resolves the section by id prefix", () => {
    expect(getTaskSectionById("js12")).toBe("javascript");
    expect(getTaskSectionById("typescript-3")).toBe("typescript");
    expect(getTaskSectionById("algo-1")).toBe("algorithms");
    expect(getTaskSectionById("sd-debounced-search")).toBe("system-design");
    expect(getTaskSectionById("warmup-1")).toBe("react");
  });
});
