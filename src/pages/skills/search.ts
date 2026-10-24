// Lightweight public entry for the route definition: it ships with the app shell, so it must not
// pull the page (and with it the skill catalog) through the slice's main index.
export { parseSkillsSearch, type SkillMapView, type SkillsSearch } from "./model/skillsSearch";
