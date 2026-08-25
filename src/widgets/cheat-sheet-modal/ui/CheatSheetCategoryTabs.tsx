import { memo } from "react";
import { clsx } from "clsx";
import styles from "./CheatSheetModal.module.css";

export interface CategoryConfig {
  id: string;
  name: string;
}

interface CheatSheetCategoryTabsProps {
  categories: CategoryConfig[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CheatSheetCategoryTabs = memo(
  ({ categories, activeCategory, onSelectCategory }: CheatSheetCategoryTabsProps) => {
    return (
      <div className={styles.categoryTabs}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={clsx(styles.tabBtn, activeCategory === cat.id && styles.activeTab)}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    );
  }
);

CheatSheetCategoryTabs.displayName = "CheatSheetCategoryTabs";
