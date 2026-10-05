import { useState, useMemo, useDeferredValue } from "react";
import { useLocation } from "@tanstack/react-router";
import { useUIStore } from "@/entities/ui-state";
import { CHEAT_SHEET_DATA, SECTION_CHEAT_SHEETS } from "@/shared/data/cheatSheetData";
import { SectionType, SectionConfig, CheatItem } from "./types";
import { getCheatSheetSectionFromPath } from "../lib/getCheatSheetSectionFromPath";

const sectionConfigMap = SECTION_CHEAT_SHEETS as unknown as Record<string, SectionConfig>;
const cheatDataMap = CHEAT_SHEET_DATA as unknown as Record<string, CheatItem[]>;

export interface UseCheatSheetDataReturn {
  activeSection: SectionType;
  activeCategory: string;
  currentSectionConfig: SectionConfig;
  filteredData: CheatItem[];
  handleSelectSection: (sec: SectionType) => void;
  setActiveCategory: (id: string) => void;
}

export function useCheatSheetData(cheatSearch: string): UseCheatSheetDataReturn {
  const location = useLocation();
  const isOpen = useUIStore((state) => state.cheatSheetOpen);

  const initialSection = getCheatSheetSectionFromPath(location.pathname);
  const [activeSection, setActiveSection] = useState<SectionType>(initialSection);
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return sectionConfigMap[initialSection]?.defaultCategory || "hooks";
  });

  const deferredSearch = useDeferredValue(cheatSearch);
  const currentSectionConfig = sectionConfigMap[activeSection] || sectionConfigMap.react;

  const handleSelectSection = (sec: SectionType): void => {
    setActiveSection(sec);
    const cfg = sectionConfigMap[sec];
    if (cfg?.defaultCategory) {
      setActiveCategory(cfg.defaultCategory);
    }
  };

  // Opening the modal, or navigating while it is open, follows the current route
  const followedPathname = isOpen ? location.pathname : null;
  const [syncedPathname, setSyncedPathname] = useState(followedPathname);
  if (followedPathname !== syncedPathname) {
    setSyncedPathname(followedPathname);
    if (followedPathname !== null)
      handleSelectSection(getCheatSheetSectionFromPath(followedPathname));
  }

  const filteredData = useMemo((): CheatItem[] => {
    const rawData = cheatDataMap[activeCategory] || [];
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return rawData;
    return rawData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.desc?.toLowerCase().includes(q) ||
        item.tip?.toLowerCase().includes(q)
    );
  }, [activeCategory, deferredSearch]);

  return {
    activeSection,
    activeCategory,
    currentSectionConfig,
    filteredData,
    handleSelectSection,
    setActiveCategory,
  };
}
