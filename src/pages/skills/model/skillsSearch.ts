export type SkillMapView = "graph" | "list";

export interface SkillsSearch {
  skill?: string;
  view?: SkillMapView;
}

/** Skill ids look like `js.event-loop`; the page itself falls back when an id no longer exists. */
const SKILL_ID = /^[a-z]+\.[a-z-]+$/;

/**
 * Keeps only well-formed values, so a stale link never breaks the page. Runs in the route
 * definition, which ships with the app shell: it must not import the skill catalog.
 */
export const parseSkillsSearch = (search: Record<string, unknown>): SkillsSearch => ({
  skill: typeof search.skill === "string" && SKILL_ID.test(search.skill) ? search.skill : undefined,
  view: search.view === "list" || search.view === "graph" ? search.view : undefined,
});
