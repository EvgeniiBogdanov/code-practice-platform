import { SectionType } from "../model/types";

export function getCheatSheetSectionFromPath(pathname: string): SectionType {
  if (pathname.includes("/javascript")) return "javascript";
  if (pathname.includes("/algorithms")) return "algorithms";
  if (pathname.includes("/react")) return "react";
  return "home";
}
