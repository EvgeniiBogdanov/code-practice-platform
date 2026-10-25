import type { SectionType } from "../types";
import { SECTIONS_CONFIG } from "../model/sectionsConfig";

const SECTION_IDS: ReadonlySet<string> = new Set(
  Object.values(SECTIONS_CONFIG).flatMap((section) => (section.id === "home" ? [] : [section.id]))
);

const isSectionType = (value: string | undefined): value is SectionType =>
  value !== undefined && SECTION_IDS.has(value);

/** Section a route belongs to: `/<section>/...` and the full-screen `/open/<section>/...`. */
export const getSectionFromPathname = (pathname: string): SectionType | null => {
  const [first, second] = pathname.split("/").filter(Boolean);
  const segment = first === "open" ? second : first;
  return isSectionType(segment) ? segment : null;
};
