import { SectionType } from "@/entities/task";
import { safeDecodeURI } from "@/shared/lib/url";

export interface ParsedBreadcrumbRoute {
  section: SectionType | "home";
  taskId: string | null;
}

export const parseBreadcrumbRoute = (pathname: string): ParsedBreadcrumbRoute => {
  const clean = pathname.replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts[0] === "react") {
    return { section: "react", taskId: parts[1] ? safeDecodeURI(parts[1]) : null };
  }
  if (parts[0] === "javascript") {
    return { section: "javascript", taskId: parts[1] ? safeDecodeURI(parts[1]) : null };
  }
  if (parts[0] === "algorithms") {
    return { section: "algorithms", taskId: parts[1] ? safeDecodeURI(parts[1]) : null };
  }
  if (parts[0] === "open") {
    return {
      section: (parts[1] as SectionType) || "react",
      taskId: parts[2] ? safeDecodeURI(parts[2]) : null,
    };
  }

  return { section: "home", taskId: null };
};
