import { memo } from "react";
import { useUIStore } from "@/entities/ui-state";
import { useCheatSheetData } from "../model/useCheatSheetData";
import { CheatSheetHeader } from "./CheatSheetHeader";
import { CheatSheetSectionTabs } from "./CheatSheetSectionTabs";
import { CheatSheetCategoryTabs } from "./CheatSheetCategoryTabs";
import { CheatSheetList } from "./CheatSheetList";
import styles from "./CheatSheetModal.module.css";

export interface CheatSheetDrawerBodyProps {
  drawerRef: React.Ref<HTMLDivElement>;
  onClose: () => void;
}

export const CheatSheetDrawerBody = memo(
  ({ drawerRef, onClose }: CheatSheetDrawerBodyProps): React.JSX.Element => {
    const cheatSearch = useUIStore((state) => state.cheatSearch);
    const setCheatSearch = useUIStore((state) => state.setCheatSearch);

    const {
      activeSection,
      activeCategory,
      currentSectionConfig,
      filteredData,
      handleSelectSection,
      setActiveCategory,
    } = useCheatSheetData(cheatSearch);

    return (
      <div ref={drawerRef} className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <CheatSheetHeader title={currentSectionConfig.title} onClose={onClose} />
        <CheatSheetSectionTabs activeSection={activeSection} onSelectSection={handleSelectSection} />
        <input
          type="text"
          value={cheatSearch}
          onChange={(e) => setCheatSearch(e.target.value)}
          placeholder="Поиск по методам, типам, паттернам..."
          className={styles.search}
          spellCheck={false}
        />
        <CheatSheetCategoryTabs
          categories={currentSectionConfig.categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <CheatSheetList items={filteredData} activeCategory={activeCategory} />
      </div>
    );
  }
);

CheatSheetDrawerBody.displayName = "CheatSheetDrawerBody";
