import { memo, useMemo } from "react";
import { Tabs, TabItem } from "@/shared/ui";
import { CategoryConfig } from "../model/types";
import styles from "./CheatSheetModal.module.css";

export type { CategoryConfig };

interface CheatSheetCategoryTabsProps {
  categories: CategoryConfig[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CheatSheetCategoryTabs = memo(
  ({ categories, activeCategory, onSelectCategory }: CheatSheetCategoryTabsProps) => {
    const items: TabItem[] = useMemo(
      () =>
        categories.map((cat) => ({
          id: cat.id,
          label: cat.name,
        })),
      [categories]
    );

    return (
      <Tabs
        variant="pills"
        size="sm"
        items={items}
        activeId={activeCategory}
        onChange={onSelectCategory}
        className={styles.categoryTabs}
      />
    );
  }
);

CheatSheetCategoryTabs.displayName = "CheatSheetCategoryTabs";
