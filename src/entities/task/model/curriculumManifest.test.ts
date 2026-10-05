import { describe, expect, it } from "vitest";
import type { SectionType } from "../types";
import { CURRICULUM_COUNTS } from "./curriculumManifest";
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
