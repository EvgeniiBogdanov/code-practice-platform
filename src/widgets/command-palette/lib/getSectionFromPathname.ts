import { PaletteSection } from "../ui/CommandPaletteTabs";

export function getSectionFromPathname(pathname: string): PaletteSection {
  if (pathname.includes("/javascript")) return "javascript";
  if (pathname.includes("/react")) return "react";
  if (pathname.includes("/algorithms")) return "algorithms";
  return "all";
}
