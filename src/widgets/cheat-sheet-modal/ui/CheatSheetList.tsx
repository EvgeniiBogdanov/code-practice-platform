import { memo } from "react";
import { CheatSheetCard, CheatItem } from "./CheatSheetCard";
import styles from "./CheatSheetModal.module.css";

interface CheatSheetListProps {
  items: CheatItem[];
  activeCategory: string;
  copiedId: string | null;
  onCopy: (code: string, cardId: string) => void;
}

export const CheatSheetList = memo(
  ({ items, activeCategory, copiedId, onCopy }: CheatSheetListProps) => {
    if (items.length === 0) {
      return <div className={styles.empty}>По вашему запросу ничего не найдено</div>;
    }

    return (
      <div className={styles.content}>
        {items.map((item, idx) => {
          const cardId = `cheat-${activeCategory}-${idx}`;
          return (
            <CheatSheetCard
              key={cardId}
              item={item}
              cardId={cardId}
              isCopied={copiedId === cardId}
              onCopy={onCopy}
            />
          );
        })}
      </div>
    );
  }
);

CheatSheetList.displayName = "CheatSheetList";
