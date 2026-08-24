import React, { memo } from "react";
import { CheatSheetHeader } from "./CheatSheetHeader";
import { CheatSheetSectionTabs, SectionType } from "./CheatSheetSectionTabs";
import { CheatSheetCategoryTabs, CategoryConfig } from "./CheatSheetCategoryTabs";
import { CheatSheetList } from "./CheatSheetList";
import { CheatItem } from "./CheatSheetCard";
import styles from "./CheatSheetModal.module.css";

interface CheatSheetDrawerBodyProps {
  drawerRef: React.Ref<HTMLDivElement>;
  title: string;
  onClose: () => void;
  activeSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  cheatSearch: string;
  onSearchChange: (query: string) => void;
  categories: CategoryConfig[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  items: CheatItem[];
}

export const CheatSheetDrawerBody = memo(
  ({
    drawerRef,
    title,
    onClose,
    activeSection,
    onSelectSection,
    cheatSearch,
    onSearchChange,
    categories,
    activeCategory,
    onSelectCategory,
    items,
  }: CheatSheetDrawerBodyProps) => {
    return (
      <div ref={drawerRef} className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <CheatSheetHeader title={title} onClose={onClose} />
        <CheatSheetSectionTabs activeSection={activeSection} onSelectSection={onSelectSection} />
        <input
          type="text"
          value={cheatSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по методам, типам, паттернам..."
          className={styles.search}
          spellCheck={false}
        />
        <CheatSheetCategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />
        <CheatSheetList items={items} activeCategory={activeCategory} />
      </div>
    );
  }
);

CheatSheetDrawerBody.displayName = "CheatSheetDrawerBody";
