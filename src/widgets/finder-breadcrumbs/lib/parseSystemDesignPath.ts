import { safeDecodeURI } from "@/shared/lib/url";

export type SystemDesignFolder = "theory" | "cases" | "drills";

export interface SystemDesignPath {
  /** The sidebar folder the page belongs to; `null` on the section overview. */
  folder: SystemDesignFolder | null;
  /** The topic, case or drill id; `null` on a folder page. */
  pageId: string | null;
}

/** Where a system design page sits: theory topics, cases and drills live under different paths. */
export const parseSystemDesignPath = (pathname: string): SystemDesignPath => {
  const parts = pathname.split("/").filter(Boolean).map(safeDecodeURI);
  const [, first, second] = parts[0] === "open" ? parts.slice(1) : parts;

  if (!first) return { folder: null, pageId: null };
  if (first === "topics") return { folder: "theory", pageId: second ?? null };
  if (first === "cases") return { folder: "cases", pageId: second ?? null };
  if (first === "drills") return { folder: "drills", pageId: null };
  return { folder: "drills", pageId: first };
};
