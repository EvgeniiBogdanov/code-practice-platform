import { getSectionFromPathname, SectionType } from "@/entities/task";
import { safeDecodeURI } from "@/shared/lib/url";

export interface ParsedBreadcrumbRoute {
  section: SectionType | "home";
  taskId: string | null;
}

export const parseBreadcrumbRoute = (pathname: string): ParsedBreadcrumbRoute => {
  const section = getSectionFromPathname(pathname);
  if (!section) return { section: "home", taskId: null };

  const parts = pathname.split("/").filter(Boolean);
  const taskId = parts[parts[0] === "open" ? 2 : 1];
  return { section, taskId: taskId ? safeDecodeURI(taskId) : null };
};
