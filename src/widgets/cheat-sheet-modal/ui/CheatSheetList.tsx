import { memo } from "react";
import { CheatSheetCard, CheatItem } from "./CheatSheetCard";
import styles from "./CheatSheetModal.module.css";

interface CheatSheetListProps {
  items: CheatItem[];
  activeCategory: string;
}

export const CheatSheetList = memo(({ items, activeCategory }: CheatSheetListProps) => {
  if (items.length === 0) {
    return <div className={styles.empty}>По вашему запросу ничего не найдено</div>;
  }

  return (
    <div className={styles.content}>
      {items.map((item, idx) => {
        const cardId = `cheat-${activeCategory}-${idx}`;
        return <CheatSheetCard key={cardId} item={item} />;
      })}
    </div>
  );
});

CheatSheetList.displayName = "CheatSheetList";
