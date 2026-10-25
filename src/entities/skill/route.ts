import type { SkillSection } from "./types";

// Lightweight public entry: the sidebar ships with the app shell and must not pull the catalog.
/** The skill map lives inside each section, next to its favorites. */
export const SKILL_MAP_ROUTES = {
  javascript: "/javascript/skills",
  typescript: "/typescript/skills",
  react: "/react/skills",
  algorithms: "/algorithms/skills",
} as const satisfies Record<SkillSection, string>;
