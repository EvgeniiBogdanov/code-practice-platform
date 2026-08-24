import { useState, useMemo, useDeferredValue } from "react";
import { CHEAT_SHEET_DATA, SECTION_CHEAT_SHEETS } from "@/shared/data/cheatSheetData";
import { SectionType } from "../ui/CheatSheetSectionTabs";
import { CategoryConfig } from "../ui/CheatSheetCategoryTabs";
import { CheatItem } from "../ui/CheatSheetCard";

interface SectionConfig {
  title: string;
  categories: CategoryConfig[];
  defaultCategory?: string;
}

const sectionConfigMap = SECTION_CHEAT_SHEETS as unknown as Record<string, SectionConfig>;
const cheatDataMap = CHEAT_SHEET_DATA as unknown as Record<string, CheatItem[]>;

export function useCheatSheetData(cheatSearch: string) {
  const [activeSection, setActiveSection] = useState<SectionType>("react");
  const [activeCategory, setActiveCategory] = useState<string>("hooks");

  const deferredSearch = useDeferredValue(cheatSearch);
  const currentSectionConfig = sectionConfigMap[activeSection] || sectionConfigMap.react;

  const handleSelectSection = (sec: SectionType) => {
    setActiveSection(sec);
    const cfg = sectionConfigMap[sec];
    if (cfg?.defaultCategory) {
      setActiveCategory(cfg.defaultCategory);
    }
  };

  const filteredData = useMemo(() => {
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
